import express from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { protect, requireRole } from '../middleware/auth';
import { db } from '../db/adapter';

const router = express.Router();

router.use(protect);
router.use(requireRole(['ADMIN']));

// 1. System Metrics & Summary
router.get('/metrics', async (req, res) => {
  try {
    const totalStudents = await db.users.countDocuments({ role: 'STUDENT' });
    const totalTeachers = await db.users.countDocuments({ role: 'TEACHER' });
    const pendingAdmissions = await db.admissions.countDocuments({ status: 'PENDING' });
    const totalBatches = await db.batches.countDocuments();
    const allFees = await db.fees.find();
    const totalRevenue = allFees.reduce((acc: number, f: any) => acc + (f.paidAmount || 0), 0);
    const totalDue = allFees.reduce((acc: number, f: any) => acc + (f.dueAmount || 0), 0);

    res.json({
      success: true,
      data: {
        totalStudents,
        totalTeachers,
        pendingAdmissions,
        totalBatches,
        totalRevenue,
        totalDue,
        activeBatches: totalBatches,
        branchesCount: 1, // Dharavi 90 Feet Road
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 2. Sections
router.get('/sections', async (req, res) => {
  try {
    const sections = await db.batches.find();
    res.json({ success: true, data: sections });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 3. Batches
router.get('/batches', async (req, res) => {
  try {
    const batches = await db.batches.find();
    res.json({ success: true, data: batches });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/batches', async (req, res) => {
  try {
    const { name, standard, division, wing, timing, room, subjects, totalStudents } = req.body;
    const batch = await db.batches.create({
      name,
      standard: standard || '10th',
      division: division || 'A',
      wing: wing || 'SCHOOL',
      timing,
      room,
      subjects: Array.isArray(subjects) ? subjects : [],
      totalStudents: totalStudents || 0,
      createdAt: new Date().toISOString(),
    });
    res.status(201).json({ success: true, data: batch });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.put('/batches/:id', async (req, res) => {
  try {
    const updated = await db.batches.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ success: false, error: 'Batch not found' });
    res.json({ success: true, data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete('/batches/:id', async (req, res) => {
  try {
    const deleted = await db.batches.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, error: 'Batch not found' });
    res.json({ success: true, message: 'Batch deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Fee Receipts Review & Approval
router.get('/fees/receipts', async (req, res) => {
  try {
    const receipts = await db.feeReceipts.find();
    res.json({ success: true, data: receipts });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/fees/receipts/:id', async (req, res) => {
  try {
    const { status, remarks } = req.body;
    const updatedReceipt = await db.feeReceipts.findByIdAndUpdate(
      req.params.id,
      { status, remarks, reviewedAt: new Date().toISOString() },
      { new: true }
    );

    if (!updatedReceipt) {
      return res.status(404).json({ success: false, error: 'Receipt not found' });
    }

    // If verified/approved, automatically update student fee ledger
    if (status === 'VERIFIED') {
      const studentFee = await db.fees.findOne({ studentId: updatedReceipt.studentId });
      if (studentFee) {
        const newPaid = (studentFee.paidAmount || 0) + (updatedReceipt.amount || 0);
        const newDue = Math.max(0, (studentFee.totalAmount || 0) - newPaid);
        await db.fees.findByIdAndUpdate(studentFee._id || studentFee.id, {
          paidAmount: newPaid,
          dueAmount: newDue,
          status: newDue === 0 ? 'PAID' : 'PARTIAL',
          lastPaymentDate: updatedReceipt.paymentDate || new Date().toISOString(),
        });
      }
    }

    res.json({ success: true, data: updatedReceipt });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 4. Users (Teachers & Students)
router.get('/users', async (req, res) => {
  try {
    const { role } = req.query;
    const query = role ? { role } : {};
    const users = await db.users.find(query);
    res.json({ success: true, data: users });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/users', async (req, res) => {
  try {
    const { name, email, role = 'STUDENT', standard, division, phone, courses } = req.body;
    if (!name || !email) {
      return res.status(400).json({ success: false, error: 'Name and email are required' });
    }

    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || '10', 10);
    const passwordHash = await bcrypt.hash('password123', saltRounds);
    const prefix = role === 'TEACHER' ? 'TCH' : 'STU';
    const userId = `${prefix}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newUser = await db.users.create({
      userId,
      name,
      email: email.toLowerCase().trim(),
      role,
      standard: standard || '10th',
      division: division || 'A',
      phone,
      courses: Array.isArray(courses) ? courses : [],
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

    res.status(201).json({ success: true, data: newUser, defaultPassword: 'password123' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/users/:id', async (req, res) => {
  try {
    const updated = await db.users.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ success: false, error: 'User not found' });
    res.json({ success: true, data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    const deleted = await db.users.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, error: 'User not found' });
    res.json({ success: true, message: 'User removed successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/users/:id/reset-password', async (req, res) => {
  try {
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || '10', 10);
    const passwordHash = await bcrypt.hash('password123', saltRounds);
    await db.users.findByIdAndUpdate(req.params.id, { passwordHash });
    res.json({ success: true, message: 'Password reset to default (password123)' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
