import express from 'express';
import { db } from '../db/adapter';
import { protect, requireRole } from '../middleware/auth';
import { sendAdmissionEmail, sendAdmissionWhatsApp } from '../services/notifications';

const router = express.Router();

// Public route: submit an admission application
router.post('/apply', async (req, res) => {
  try {
    const data = req.body;
    if (!data.studentName || !data.phone || !data.standard) {
      return res.status(400).json({ error: 'Student name, phone, and standard are required' });
    }

    const newApp = await db.admissions.create({
      ...data,
      status: 'PENDING',
      submittedAt: new Date().toISOString(),
    });

    // Trigger Email and WhatsApp notifications to Admin asynchronously
    sendAdmissionEmail(newApp).catch(err => console.warn('[Admission Email] notification skipped:', err.message));
    sendAdmissionWhatsApp(newApp).catch(err => console.warn('[Admission WhatsApp] notification skipped:', err.message));

    res.status(201).json({
      success: true,
      message: 'Admission application submitted successfully! Our counseling team will contact you shortly.',
      applicationId: newApp._id,
      application: newApp,
    });
  } catch (error: any) {
    console.error('Admission submit error:', error);
    res.status(400).json({ success: false, error: error.message || 'Failed to submit application' });
  }
});

// Public route: get sanitized recent admission confirmations
router.get('/public-list', async (_req, res) => {
  try {
    const apps = await db.admissions.find().sort({ submittedAt: -1 }).limit(10);
    const sanitized = apps.map((a: any) => ({
      _id: a._id || a.id,
      standard: a.standard || '10th',
      status: a.status || 'CONFIRMED',
      date: a.submittedAt ? new Date(a.submittedAt).toLocaleDateString() : 'Recent',
      maskedName: a.studentName ? `${a.studentName.charAt(0)}. ${a.studentName.split(' ').slice(-1)[0]}` : 'Student',
    }));
    res.json({ success: true, data: sanitized });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Admin only route: get all applications
router.get('/', protect, requireRole(['ADMIN']), async (req, res) => {
  try {
    const apps = await db.admissions.find().sort({ submittedAt: -1 });
    res.json(apps);
  } catch (error) {
    console.error('Error fetching admissions:', error);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

// Admin only route: update application details
router.put('/:id', protect, requireRole(['ADMIN']), async (req, res) => {
  try {
    const updated = await db.admissions.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Application not found' });
    res.json(updated);
  } catch (error: any) {
    console.error('Error updating admission details:', error);
    res.status(500).json({ error: error.message || 'Failed to update application' });
  }
});

// Admin only route: update application status
router.patch('/:id/status', protect, requireRole(['ADMIN']), async (req, res) => {
  try {
    const { status } = req.body;
    if (!['PENDING', 'APPROVED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const updatedApp = await db.admissions.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedApp) return res.status(404).json({ error: 'Application not found' });
    res.json(updatedApp);
  } catch (error) {
    console.error('Error updating admission status:', error);
    res.status(500).json({ error: 'Failed to update application status' });
  }
});

// Admin only route: convert approved admission to student account
router.post('/:id/convert-to-student', protect, requireRole(['ADMIN']), async (req, res) => {
  try {
    const app = await db.admissions.findById(req.params.id);
    if (!app) return res.status(404).json({ error: 'Application not found' });

    // Check if user already exists
    const existingUser = await db.users.findOne({ email: app.email?.toLowerCase().trim() });
    if (existingUser) {
      // Mark application as approved and linked
      await db.admissions.findByIdAndUpdate(req.params.id, {
        status: 'APPROVED',
        enrolledStudentId: existingUser.userId,
      });
      return res.json({
        success: true,
        message: 'Student account already exists for this email. Application linked to existing account.',
        studentId: existingUser.userId,
        defaultPassword: 'Existing user password',
      });
    }

    const bcrypt = await import('bcrypt');
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || '10', 10);
    const passwordHash = await bcrypt.hash('password123', saltRounds);
    const userId = `STU-${Math.floor(1000 + Math.random() * 9000)}`;

    const newUser = await db.users.create({
      userId,
      name: app.studentName,
      email: app.email?.toLowerCase().trim() || `${userId.toLowerCase()}@vidhya.edu`,
      role: 'STUDENT',
      standard: app.standard || '10th',
      division: 'A',
      phone: app.phone,
      courses: app.subjects || [],
      passwordHash,
      schoolCode: 'VIDHYA',
      isActive: true,
      xp: 100,
      level: 1,
      currentStreak: 1,
      longestStreak: 1,
      badges: ['New Member'],
      createdAt: new Date().toISOString(),
    });

    // Update application
    await db.admissions.findByIdAndUpdate(req.params.id, {
      status: 'APPROVED',
      enrolledStudentId: userId,
    });

    res.status(201).json({
      success: true,
      message: `Enrolled successfully! Student ID: ${userId}`,
      studentId: userId,
      defaultPassword: 'password123',
      user: newUser,
    });
  } catch (error: any) {
    console.error('Error converting applicant to student:', error);
    res.status(500).json({ error: error.message || 'Failed to convert applicant to student' });
  }
});

// Admin only route: delete application
router.delete('/:id', protect, requireRole(['ADMIN']), async (req, res) => {
  try {
    const deleted = await db.admissions.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Application not found' });
    res.json({ message: 'Application deleted successfully' });
  } catch (error) {
    console.error('Error deleting admission:', error);
    res.status(500).json({ error: 'Failed to delete application' });
  }
});

export default router;
