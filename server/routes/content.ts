import express from 'express';
import fs from 'fs';
import path from 'path';
import { protect, requireRole } from '../middleware/auth';

const router = express.Router();
const GALLERY_FILE = path.resolve(process.cwd(), 'server', 'data', 'gallery.json');
const REVIEWS_FILE = path.resolve(process.cwd(), 'server', 'data', 'reviews.json');

// Helper to safely load JSON data
function loadData(filePath: string, fallback: any[]): any[] {
  try {
    if (!fs.existsSync(filePath)) {
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, JSON.stringify(fallback, null, 2), 'utf-8');
      return fallback;
    }
    const raw = fs.readFileSync(filePath, 'utf-8');
    const parsed = JSON.parse(raw || '[]');
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : fallback;
  } catch (err) {
    console.error(`Error loading data from ${filePath}:`, err);
    return fallback;
  }
}

// Helper to save JSON data
function saveData(filePath: string, data: any[]): void {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error(`Error saving data to ${filePath}:`, err);
  }
}

// Initial realistic seed gallery photos
const INITIAL_GALLERY = [
  {
    id: 'photo-e1',
    src: '/gallery/gallery-16.jpg',
    title: 'Faculty & Student Annual Resort Outing',
    category: 'Events',
    description: 'Teachers and students celebrating together during the annual recreation trip.'
  },
  {
    id: 'photo-e2',
    src: '/gallery/gallery-17.jpg',
    title: 'Girls Batch Annual Excursion Day',
    category: 'Events',
    description: 'Memorable team bonding day and refreshing outdoor retreat with batchmates.'
  },
  {
    id: 'photo-m1',
    src: '/gallery/gallery-13.jpg',
    title: 'Vikas Tank Sir Mentoring Top Rankers',
    category: 'Mentorship',
    description: '1-on-1 strategic board exam doubt resolution and academic guidance.'
  },
  {
    id: 'photo-c1',
    src: '/gallery/gallery-14.jpg',
    title: 'Focused Smart Classroom Session',
    category: 'Classroom',
    description: 'Interactive concept delivery and personalized attention in small batches.'
  },
  {
    id: 'photo-a1',
    src: '/gallery/gallery-15.jpg',
    title: 'Board Exam Rankers Felicitation Ceremony',
    category: 'Achievers',
    description: 'Celebrating 98%+ achievers and scholarship holders with parents.'
  }
];

// Initial realistic reviews
const INITIAL_REVIEWS = [
  {
    id: 'rev-1',
    name: 'Mrs. Sunita Deshmukh',
    role: 'Parent',
    detail: 'Parent of Aryan Deshmukh (10th SSC - 96.4%)',
    comment: 'Vikas Tank Sir and the entire faculty at Vidhya Tutorials are exceptional. Personal attention, weekly test series, and timely feedback helped my son score 96.4% in 10th boards. Truly the best coaching classes in Mumbai!',
    rating: 5,
    source: 'Google Review'
  },
  {
    id: 'rev-2',
    name: 'Rajesh K. Mehta',
    role: 'Parent',
    detail: 'Parent of Shreya Mehta (12th Science)',
    comment: 'The conceptual clarity provided by teachers for Physics and Mathematics is unmatched. Doubt solving sessions even late evening made all the difference.',
    rating: 5,
    source: 'Google Review'
  },
  {
    id: 'rev-3',
    name: 'Tanvi Joshi',
    role: 'Student',
    detail: 'Alumni (MHT-CET 99.12 Percentile)',
    comment: 'Studying at Vidhya Tutorials was the turning point in my academic career. The mock test series and Vikas Sir\'s motivational guidance kept me on track!',
    rating: 5,
    source: 'Justdial Review'
  },
  {
    id: 'rev-4',
    name: 'Manoj Sharma',
    role: 'Parent',
    detail: 'Parent of Rohan Sharma (9th Standard)',
    comment: 'Very systematic teaching methodology and regular parent-teacher meetings. Attendance and performance are tracked transparently.',
    rating: 5,
    source: 'Google Review'
  }
];

// ══════════════════════════════════════════════════
// 1. GALLERY ENDPOINTS
// ══════════════════════════════════════════════════

// Public: Get all gallery photos
router.get('/gallery', (_req, res) => {
  const photos = loadData(GALLERY_FILE, INITIAL_GALLERY);
  res.json({ success: true, data: photos });
});

// Admin: Add gallery photo
router.post('/gallery', protect, requireRole(['ADMIN']), (req, res) => {
  try {
    const { title, category = 'Events', src, description } = req.body;
    if (!title || !src) {
      return res.status(400).json({ success: false, error: 'Title and image source/URL are required' });
    }

    const photos = loadData(GALLERY_FILE, INITIAL_GALLERY);
    const newPhoto = {
      id: `photo-custom-${Date.now()}`,
      title,
      category,
      src,
      description: description || 'Uploaded via Admin Panel',
      createdAt: new Date().toISOString()
    };

    photos.unshift(newPhoto);
    saveData(GALLERY_FILE, photos);

    res.status(201).json({ success: true, message: 'Photo added to gallery successfully!', data: newPhoto });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Admin: Delete gallery photo
router.delete('/gallery/:id', protect, requireRole(['ADMIN']), (req, res) => {
  try {
    let photos = loadData(GALLERY_FILE, INITIAL_GALLERY);
    const beforeCount = photos.length;
    photos = photos.filter(p => String(p.id) !== String(req.params.id));

    if (photos.length === beforeCount) {
      return res.status(404).json({ success: false, error: 'Photo not found' });
    }

    saveData(GALLERY_FILE, photos);
    res.json({ success: true, message: 'Photo deleted successfully!' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ══════════════════════════════════════════════════
// 2. REVIEWS & TESTIMONIALS ENDPOINTS
// ══════════════════════════════════════════════════

// Public: Get all reviews
router.get('/reviews', (_req, res) => {
  const reviews = loadData(REVIEWS_FILE, INITIAL_REVIEWS);
  res.json({ success: true, data: reviews });
});

// Public or Admin: Add a review (Public visitors can pin reviews, Admin can add verified reviews)
router.post('/reviews', (req, res) => {
  try {
    const { name, role = 'Parent', detail, comment, rating = 5, source = 'Website Wall', likes = 0, colorKey = 'cream', frontRotate } = req.body;
    if (!name || !comment) {
      return res.status(400).json({ success: false, error: 'Reviewer name and comment are required' });
    }

    const reviews = loadData(REVIEWS_FILE, INITIAL_REVIEWS);
    const newReview = {
      id: `rev-custom-${Date.now()}`,
      name,
      role,
      detail: detail || 'Vidhya Tutorials Student/Parent',
      comment,
      rating: Number(rating) || 5,
      source,
      likes: Number(likes) || 0,
      colorKey: colorKey || 'cream',
      frontRotate: frontRotate !== undefined ? Number(frontRotate) : (Math.random() * 4 - 2),
      createdAt: new Date().toISOString()
    };

    reviews.unshift(newReview);
    saveData(REVIEWS_FILE, reviews);

    res.status(201).json({ success: true, message: 'Review added successfully!', data: newReview });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Admin: Edit a review
router.put('/reviews/:id', protect, requireRole(['ADMIN']), (req, res) => {
  try {
    const reviews = loadData(REVIEWS_FILE, INITIAL_REVIEWS);
    const idx = reviews.findIndex(r => String(r.id) === String(req.params.id));

    if (idx === -1) {
      return res.status(404).json({ success: false, error: 'Review not found' });
    }

    reviews[idx] = {
      ...reviews[idx],
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    saveData(REVIEWS_FILE, reviews);
    res.json({ success: true, message: 'Review updated successfully!', data: reviews[idx] });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Admin: Delete a review
router.delete('/reviews/:id', protect, requireRole(['ADMIN']), (req, res) => {
  try {
    let reviews = loadData(REVIEWS_FILE, INITIAL_REVIEWS);
    const beforeCount = reviews.length;
    reviews = reviews.filter(r => String(r.id) !== String(req.params.id));

    if (reviews.length === beforeCount) {
      return res.status(404).json({ success: false, error: 'Review not found' });
    }

    saveData(REVIEWS_FILE, reviews);
    res.json({ success: true, message: 'Review deleted successfully!' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
