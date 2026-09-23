import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './db/connect';
import authRoutes from './routes/auth';
import adminRoutes from './routes/admin';
import feeRoutes from './routes/fees';
import appointmentRoutes from './routes/appointments';
import announcementRoutes from './routes/announcements';
import admissionRoutes from './routes/admissions';
import analyticsRoutes from './routes/analytics';
import contentRoutes from './routes/content';

// Production defaults — ensures the app works even if Hostinger doesn't save env vars
if (!process.env.NODE_ENV) process.env.NODE_ENV = 'production';

const app = express();
const PORT = process.env.PORT || 5000;

// Provide __dirname safely for both ESM (dev) and CJS (prod)
const getDirname = () => {
  if (typeof __dirname !== 'undefined') return __dirname;
  return path.dirname(fileURLToPath(import.meta.url));
};
const __dirname_safe = getDirname();

app.set('trust proxy', 1); // Trust first proxy for Cloudflare/NGINX (fixes express-rate-limit)

// Middlewares
app.use(helmet({
  contentSecurityPolicy: false, // Allow inline scripts from Vite build
}));
// Production CORS whitelist from CORS_ORIGIN env var
const allowedOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow same-origin requests (no origin header) or whitelisted origins
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: origin ${origin} not allowed`));
    }
  },
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(mongoSanitize({ replaceWith: '_' }));

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', server: 'Vidhya Tutorials API', env: process.env.NODE_ENV, timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/fees', feeRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/admissions', admissionRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/content', contentRoutes);

// ── Production: Serve React frontend from dist/ ──
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname_safe, 'dist');
  app.use(express.static(distPath));

  // SPA fallback: any non-API route serves index.html for client-side routing
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Connect DB and Start Server
const start = () => {
  // Start listening immediately to satisfy Hostinger's 3-second timeout requirement
  app.listen(PORT, async () => {
    console.log(`✅ Server running on port ${PORT} (${process.env.NODE_ENV || 'development'})`);
    // Initialize DB connection in the background
    await connectDB().catch(err => console.error('Database connection error:', err));
  });
};

start();

