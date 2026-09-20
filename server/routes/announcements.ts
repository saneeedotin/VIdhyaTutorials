import express from 'express';
import { db } from '../db/adapter';
import { protect, requireRole } from '../middleware/auth';

const router = express.Router();

// GET all active announcements (Public)
router.get('/', async (req, res) => {
  try {
    const announcements = await db.announcements.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(announcements);
  } catch (error) {
    console.error('Error fetching announcements:', error);
    res.status(500).json({ error: 'Server error fetching announcements' });
  }
});

// GET all announcements including inactive (Admin only)
router.get('/all', protect, requireRole(['ADMIN']), async (req, res) => {
  try {
    const announcements = await db.announcements.find().sort({ createdAt: -1 });
    res.json(announcements);
  } catch (error) {
    console.error('Error fetching all announcements:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST new announcement (Admin only)
router.post('/', protect, requireRole(['ADMIN']), async (req, res) => {
  try {
    const { type, title, date, time, imgUrl, tags, isActive, content } = req.body;
    const newAnnouncement = await db.announcements.create({
      type: type || 'GENERAL',
      title,
      date,
      time,
      imgUrl,
      tags: Array.isArray(tags) ? tags : [],
      isActive: isActive !== undefined ? isActive : true,
      content,
    });
    res.status(201).json(newAnnouncement);
  } catch (error) {
    console.error('Error creating announcement:', error);
    res.status(500).json({ error: 'Server error creating announcement' });
  }
});

// PUT update announcement (Admin only)
router.put('/:id', protect, requireRole(['ADMIN']), async (req, res) => {
  try {
    const updatedAnnouncement = await db.announcements.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedAnnouncement) {
      return res.status(404).json({ error: 'Announcement not found' });
    }
    res.json(updatedAnnouncement);
  } catch (error) {
    console.error('Error updating announcement:', error);
    res.status(500).json({ error: 'Server error updating announcement' });
  }
});

// DELETE announcement (Admin only)
router.delete('/:id', protect, requireRole(['ADMIN']), async (req, res) => {
  try {
    const deletedAnnouncement = await db.announcements.findByIdAndDelete(req.params.id);
    if (!deletedAnnouncement) {
      return res.status(404).json({ error: 'Announcement not found' });
    }
    res.json({ message: 'Announcement deleted successfully' });
  } catch (error) {
    console.error('Error deleting announcement:', error);
    res.status(500).json({ error: 'Server error deleting announcement' });
  }
});

export default router;
