import express from 'express';
import { protect, requireRole, AuthRequest } from '../middleware/auth';
import { db } from '../db/adapter';

const router = express.Router();

router.use(protect);
router.use(requireRole(['TEACHER', 'ADMIN']));

// Fetch students for teacher's class
router.get('/students', async (req, res) => {
  try {
    const { standard, division } = req.query;
    const query: any = { role: 'STUDENT' };
    if (standard) query.standard = standard;
    if (division) query.division = division;

    let students = await db.users.find(query);
    if (students.length === 0) {
      students = await db.users.find({ role: 'STUDENT' });
    }

    res.json({ success: true, data: students });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Fetch batches assigned to teacher
router.get('/batches', async (req, res) => {
  try {
    const batches = await db.batches.find();
    res.json({ success: true, data: batches });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Mark attendance
router.post('/attendance', async (req: AuthRequest, res) => {
  try {
    const { batchId, date, weekStartDate, subjectId, students } = req.body;
    if (!Array.isArray(students)) {
      return res.status(400).json({ success: false, error: 'students array is required' });
    }

    const attendanceDate = date || weekStartDate || new Date().toISOString().slice(0, 10);
    const records = students.map((s: any) => {
      const studentId = s.studentId || s._id || s.id || s.userId;
      const percentage = s.percentage !== undefined ? Number(s.percentage) : (s.status === 'PRESENT' ? 100 : 0);
      const status = s.status || (percentage >= 75 ? 'PRESENT' : 'ABSENT');

      return {
        studentId,
        batchId: batchId || 'DEFAULT',
        subjectId: subjectId || 'DEFAULT',
        date: attendanceDate,
        percentage,
        status,
        markedBy: req.user!.id,
        createdAt: new Date().toISOString(),
      };
    });

    await db.attendance.insertMany(records);
    res.json({ success: true, message: 'Attendance marked successfully', count: records.length });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Upload study material
router.post('/materials', async (req: AuthRequest, res) => {
  try {
    const {
      title,
      type = 'DOCUMENT',
      url,
      contentUrl,
      standard = '10th',
      division = 'A',
      subject = 'General',
      isViewOnly,
      visibility,
      courseId,
      chapterId,
      lessonId,
      fileSize,
      duration,
    } = req.body;

    const fileUrl = url || contentUrl;
    if (!title || !fileUrl) {
      return res.status(400).json({ success: false, error: 'Title and URL are required' });
    }

    const material = await db.materials.create({
      title,
      type,
      url: fileUrl,
      standard,
      division,
      subject,
      isViewOnly: isViewOnly !== undefined ? isViewOnly : true,
      visibility: visibility || 'CLASS',
      courseId,
      chapterId,
      lessonId,
      uploadedBy: req.user!.id,
      fileSize: fileSize || '1.5 MB',
      duration,
      createdAt: new Date().toISOString(),
    });

    res.status(201).json({ success: true, data: material });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get materials uploaded by teacher
router.get('/materials', async (req, res) => {
  try {
    const materials = await db.materials.find();
    res.json({ success: true, data: materials });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// --- TEACHER TODOS / TASKS ---

// Get teacher tasks
router.get('/todos', async (req: AuthRequest, res) => {
  try {
    let todos = await db.todos.find({ teacherId: req.user!.id });
    if (todos.length === 0) {
      todos = [
        {
          _id: 't-todo-1',
          teacherId: req.user!.id,
          title: 'Review 10th Standard SSC Algebra Unit Test',
          isCompleted: false,
          completed: false,
          createdAt: new Date().toISOString(),
        },
        {
          _id: 't-todo-2',
          teacherId: req.user!.id,
          title: 'Prepare Class 11 Physics Notes on Gravitation',
          isCompleted: true,
          completed: true,
          createdAt: new Date().toISOString(),
        }
      ];
    }
    res.json({ success: true, data: todos });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create teacher task
router.post('/todos', async (req: AuthRequest, res) => {
  try {
    const { title, task } = req.body;
    const taskTitle = title || task;
    if (!taskTitle) return res.status(400).json({ success: false, error: 'Title is required' });

    const newTodo = await db.todos.create({
      teacherId: req.user!.id,
      title: taskTitle,
      task: taskTitle,
      isCompleted: false,
      completed: false,
      createdAt: new Date().toISOString(),
    });

    res.status(201).json({ success: true, data: newTodo });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Toggle or update teacher task
router.put('/todos/:id', async (req, res) => {
  try {
    const { isCompleted, completed, title } = req.body;
    const isDone = isCompleted !== undefined ? isCompleted : completed;

    const updated = await db.todos.findByIdAndUpdate(
      req.params.id,
      {
        ...(isDone !== undefined ? { isCompleted: isDone, completed: isDone } : {}),
        ...(title ? { title, task: title } : {}),
      },
      { new: true }
    );

    if (!updated) return res.status(404).json({ success: false, error: 'Todo not found' });
    res.json({ success: true, data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete teacher task
router.delete('/todos/:id', async (req, res) => {
  try {
    const deleted = await db.todos.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, error: 'Todo not found' });
    res.json({ success: true, message: 'Todo removed successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
