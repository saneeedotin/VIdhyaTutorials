import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import { connectDB } from './db/connect';
import authRoutes from './routes/auth';
import adminRoutes from './routes/admin';
import teacherRoutes from './routes/teacher';
import studentRoutes from './routes/student';
import feeRoutes from './routes/fees';
import appointmentRoutes from './routes/appointments';
import announcementRoutes from './routes/announcements';
import admissionRoutes from './routes/admissions';
import analyticsRoutes from './routes/analytics';
import contentRoutes from './routes/content';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.set('trust proxy', 1); // Trust first proxy for Cloudflare/NGINX (fixes express-rate-limit)

// Middlewares
app.use(helmet());
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, or same-origin proxy)
    callback(null, true);
  },
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(mongoSanitize({ replaceWith: '_' }));

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', server: 'Vidhya Tutorials API', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/fees', feeRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/admissions', admissionRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/content', contentRoutes);

// Connect DB and Start Server
const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();

// Trigger restart
