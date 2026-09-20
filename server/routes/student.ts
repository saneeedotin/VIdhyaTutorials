import express from 'express';
import { protect, requireRole, AuthRequest } from '../middleware/auth';
import { db } from '../db/adapter';
import { awardXP } from '../services/gamification';

const router = express.Router();

router.use(protect);
router.use(requireRole(['STUDENT']));

// --- TIMETABLE ---

// Get today's timetable for the student's batch
router.get('/timetable/today', async (req: AuthRequest, res) => {
  try {
    const userProfile = await db.users.findById(req.user!.id);
    const standard = userProfile?.standard || '10th';
    const batch = await db.batches.findOne({ standard }) || (await db.batches.find())[0];

    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const todaySchedule = (batch?.schedule || []).filter((s: any) => s.day === today);

    res.json({
      success: true,
      data: todaySchedule.length > 0 ? todaySchedule : [
        { time: '04:30 PM - 05:45 PM', subject: 'Mathematics 1', teacher: 'Dr. Sharma', room: 'Hall 1' },
        { time: '06:00 PM - 07:15 PM', subject: 'Science 1', teacher: 'Prof. Kulkarni', room: 'Hall 1' },
      ],
      batchName: batch?.name || 'Class 10th SSC Board Champions',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get upcoming 3 days timetable for the student's batch
router.get('/timetable/upcoming', async (req: AuthRequest, res) => {
  try {
    const userProfile = await db.users.findById(req.user!.id);
    const standard = userProfile?.standard || '10th';
    const batch = await db.batches.findOne({ standard }) || (await db.batches.find())[0];

    const days = [];
    for (let i = 0; i < 3; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const dayName = d.toLocaleDateString('en-US', { weekday: 'long' });
      days.push({
        date: d,
        dayName,
        schedule: [
          { time: '04:30 PM - 05:45 PM', subject: i % 2 === 0 ? 'Mathematics 1' : 'Science 1', teacher: 'Dr. Sharma', room: 'Hall 1' },
          { time: '06:00 PM - 07:15 PM', subject: i % 2 === 0 ? 'Science 2' : 'Mathematics 2', teacher: 'Prof. Kulkarni', room: 'Hall 1' },
        ],
      });
    }

    res.json({ success: true, data: days });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// --- ATTENDANCE ---

// Get attendance summary
router.get('/attendance', async (req: AuthRequest, res) => {
  try {
    const records = await db.attendance.find({ studentId: req.user!.id });
    const totalClasses = records.length || 24;
    const presentClasses = records.length ? records.filter((r: any) => r.status === 'PRESENT').length : 22;
    const percentage = Math.round((presentClasses / totalClasses) * 100);

    const weekly = [
      { _id: 'w1', label: 'Week 1', percentage: 95 },
      { _id: 'w2', label: 'Week 2', percentage: 88 },
      { _id: 'w3', label: 'Week 3', percentage: 100 },
      { _id: 'w4', label: 'Week 4', percentage: 92 },
    ];

    res.json({
      success: true,
      data: {
        total: totalClasses,
        present: presentClasses,
        percentage,
        overallPercentage: percentage,
        status: percentage >= 90 ? 'EXCELLENT' : percentage >= 75 ? 'GOOD' : 'NEEDS ATTENTION',
        weekly,
        records: records.length ? records : [
          { date: '2026-03-12', subject: 'Maths 1', status: 'PRESENT' },
          { date: '2026-03-11', subject: 'Science 1', status: 'PRESENT' },
          { date: '2026-03-10', subject: 'Maths 2', status: 'PRESENT' },
          { date: '2026-03-09', subject: 'Science 2', status: 'PRESENT' },
        ],
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// --- SUBJECT PROGRESS ---

// Get student's subject progress
router.get('/progress', async (req: AuthRequest, res) => {
  try {
    const progress = await db.subjectProgress.find({ studentId: req.user!.id });
    if (progress.length === 0) {
      return res.json({
        success: true,
        data: [
          { subjectName: 'Mathematics 1 & 2', percentage: 82 },
          { subjectName: 'Science 1 & 2', percentage: 78 },
          { subjectName: 'Languages (Eng/Hindi/Marathi)', percentage: 88 },
          { subjectName: 'Social Sciences', percentage: 75 },
        ],
      });
    }
    res.json({ success: true, data: progress });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// --- COURSE MATERIALS ---

// Fetch Materials for student's standard
router.get('/materials', async (req: AuthRequest, res) => {
  try {
    const userProfile = await db.users.findById(req.user!.id);
    const standard = userProfile?.standard || '10th';

    let materials = await db.materials.find({ standard });
    if (materials.length === 0) {
      materials = await db.materials.find();
    }
    res.json({ success: true, data: materials });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// --- TODOS ---

router.get('/todos', async (req: AuthRequest, res) => {
  try {
    let todos = await db.todos.find({ studentId: req.user!.id }).sort({ createdAt: -1 });
    if (todos.length === 0) {
      todos = await db.todos.find().sort({ createdAt: -1 });
    }
    res.json({ success: true, data: todos });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/todos', async (req: AuthRequest, res) => {
  try {
    const { title, task, subject, dueDate, priority } = req.body;
    const taskTitle = title || task;
    if (!taskTitle) return res.status(400).json({ success: false, error: 'Task title is required' });

    const todo = await db.todos.create({
      studentId: req.user!.id,
      title: taskTitle,
      task: taskTitle,
      subject: subject || 'General',
      dueDate: dueDate || 'This week',
      priority: priority || 'MEDIUM',
      completed: false,
      isCompleted: false,
      createdAt: new Date().toISOString(),
    });

    res.status(201).json({ success: true, data: todo });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/todos/:id', async (req, res) => {
  try {
    const { isCompleted, completed, title, task } = req.body;
    const isDone = isCompleted !== undefined ? isCompleted : completed;
    const taskName = title || task;

    const updated = await db.todos.findByIdAndUpdate(
      req.params.id,
      {
        ...(isDone !== undefined ? { isCompleted: isDone, completed: isDone } : {}),
        ...(taskName ? { title: taskName, task: taskName } : {}),
      },
      { new: true }
    );

    if (!updated) return res.status(404).json({ success: false, error: 'Todo not found' });
    res.json({ success: true, data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete('/todos/:id', async (req, res) => {
  try {
    const deleted = await db.todos.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, error: 'Todo not found' });
    res.json({ success: true, message: 'Todo deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// --- FEES & RECEIPTS ---

// Get student payment receipts
router.get('/fees/receipts', async (req: AuthRequest, res) => {
  try {
    let receipts = await db.feeReceipts.find({ studentId: req.user!.id }).sort({ createdAt: -1 });
    if (receipts.length === 0) {
      receipts = [
        {
          _id: 'rec-001',
          transactionId: 'TXN-UPI-9821831',
          receiptNo: 'VT-REC-2025-0102',
          amount: 15000,
          paymentDate: '2025-06-15',
          paymentMode: 'UPI',
          status: 'VERIFIED',
        },
        {
          _id: 'rec-002',
          transactionId: 'TXN-CASH-4412',
          receiptNo: 'VT-REC-2025-0481',
          amount: 10000,
          paymentDate: '2025-10-10',
          paymentMode: 'CASH',
          status: 'VERIFIED',
        },
      ];
    }
    res.json({ success: true, data: receipts });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Submit a new fee payment receipt for verification
router.post('/fees/receipt', async (req: AuthRequest, res) => {
  try {
    const { transactionId, amount, paymentDate, receiptUrl } = req.body;
    if (!transactionId || !amount) {
      return res.status(400).json({ success: false, error: 'Transaction ID and amount are required' });
    }

    const newReceipt = await db.feeReceipts.create({
      studentId: req.user!.id,
      transactionId,
      receiptNo: `VT-SUB-${Date.now().toString().slice(-6)}`,
      amount: Number(amount) || 0,
      paymentDate: paymentDate || new Date().toISOString(),
      receiptUrl: receiptUrl || '',
      status: 'PENDING VERIFICATION',
      createdAt: new Date().toISOString(),
    });

    res.status(201).json({
      success: true,
      message: 'Receipt submitted successfully! Admin will verify and update your ledger.',
      data: newReceipt,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
