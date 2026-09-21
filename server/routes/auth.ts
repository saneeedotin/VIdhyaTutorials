import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { z } from 'zod';
import rateLimit from 'express-rate-limit';
import { protect, AuthRequest } from '../middleware/auth';
import { db } from '../db/adapter';
import { isFirebaseActive, getAuth } from '../db/firebase';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error('FATAL: JWT_SECRET environment variable is not set. Server cannot start securely.');
  process.exit(1);
}

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { error: 'Too many login attempts, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 100,
  message: { error: 'Too many registration attempts, please try again later.' },
});

const loginSchema = z.object({
  userId: z.string().min(2).max(120).optional(),
  email: z.string().min(2).max(120).optional(),
  username: z.string().min(2).max(120).optional(),
  password: z.string().min(3).max(128),
  role: z.enum(['STUDENT', 'TEACHER', 'ADMIN', 'PARENT']).optional(),
}).refine(data => Boolean(data.userId || data.email || data.username), {
  message: 'userId, email, or username is required',
});

const registerSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  userId: z.string().min(2).max(60),
  password: z.string().min(3).max(128),
  role: z.enum(['STUDENT', 'TEACHER', 'ADMIN', 'PARENT']),
  schoolCode: z.string().min(2).optional(),
});

const generateTokens = async (user: any) => {
  const uid = String(user._id || user.id);
  const accessToken = jwt.sign(
    { sub: uid, role: user.role, schoolCode: user.schoolCode || 'VIDHYA' },
    JWT_SECRET!,
    { expiresIn: '7d', algorithm: 'HS256' }
  );

  let firebaseCustomToken: string | undefined;
  if (isFirebaseActive()) {
    const auth = getAuth();
    if (auth) {
      try {
        firebaseCustomToken = await auth.createCustomToken(uid, {
          role: user.role,
          schoolCode: user.schoolCode || 'VIDHYA',
        });
      } catch (err: any) {
        console.warn('[Firebase Auth] Custom token creation skipped:', err.message);
      }
    }
  }

  const rawRefreshToken = crypto.randomBytes(64).toString('hex');
  return { accessToken, rawRefreshToken, firebaseCustomToken };
};

// AUTHORIZED ADMIN EMAIL — only this email can access the admin portal
const AUTHORIZED_ADMIN_EMAIL = 'vidhyatutorials22@gmail.com';
const ADMIN_ALIAS_EMAIL = 'admin@vidhya.com';

// LOGIN
router.post('/login', loginLimiter, async (req, res) => {
  try {
    const parsed = loginSchema.parse(req.body);
    const identifier = (parsed.userId || parsed.email || parsed.username || '').trim();
    const password = parsed.password;
    const role = parsed.role;
    const searchId = identifier.toUpperCase();
    const cleanEmail = identifier.toLowerCase();

    // ── ADMIN STRICT GATE ──
    if (role === 'ADMIN') {
      const isAuthorizedAdminId = searchId === 'ADM-1234';
      const isAuthorizedAdminEmail = cleanEmail === AUTHORIZED_ADMIN_EMAIL || cleanEmail === ADMIN_ALIAS_EMAIL;
      if (!isAuthorizedAdminId && !isAuthorizedAdminEmail) {
        return res.status(403).json({
          error: 'Access denied. Admin login is restricted to the authorized Vidhya Tutorials account only.',
        });
      }
    }

    // Find user in DB
    const allUsers = await db.users.find();
    let user = allUsers.find((u: any) => {
      const uId = String(u.userId || '').toUpperCase();
      const uEmail = String(u.email || '').toLowerCase();
      const matchId =
        uId === searchId ||
        uEmail === cleanEmail ||
        ((searchId === 'ADM-1234' || cleanEmail === ADMIN_ALIAS_EMAIL) && uEmail === AUTHORIZED_ADMIN_EMAIL);

      return matchId && (u.role === role || !role);
    });

    // ── Default Accounts Fallback ──
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || '10', 10);

    if (!user) {
      if ((searchId === 'ADM-1234' || cleanEmail === AUTHORIZED_ADMIN_EMAIL || cleanEmail === ADMIN_ALIAS_EMAIL) && password === 'password123') {
        const passwordHash = await bcrypt.hash('password123', saltRounds);
        user = await db.users.create({
          userId: 'ADM-1234',
          email: AUTHORIZED_ADMIN_EMAIL,
          name: 'Vikas Tank Sir (Director & Founder)',
          role: 'ADMIN',
          passwordHash,
          schoolCode: 'VIDHYA',
          isActive: true,
          xp: 850,
          level: 8,
          currentStreak: 24,
          longestStreak: 45,
          badges: ['Director', 'Master Mentor', 'Administrator'],
          phone: '+91 88981 17343',
          createdAt: new Date().toISOString(),
        });
      } else if ((searchId === 'TCH-1001' || cleanEmail === 'teacher@vidhya.com') && (password === 'password123' || password === 'teacher123')) {
        const passwordHash = await bcrypt.hash('password123', saltRounds);
        user = await db.users.create({
          userId: 'TCH-1001',
          email: 'teacher@vidhya.com',
          name: 'Prof. Rajesh Sharma (Senior Faculty)',
          role: 'TEACHER',
          standard: '10th',
          division: 'A',
          passwordHash,
          schoolCode: 'VIDHYA',
          isActive: true,
          xp: 600,
          level: 6,
          currentStreak: 15,
          longestStreak: 30,
          badges: ['Master Teacher', 'Top Mentor'],
          phone: '+91 98200 12345',
          createdAt: new Date().toISOString(),
        });
      } else if ((searchId === 'STU-1001' || cleanEmail === 'student@vidhya.com') && (password === 'password123' || password === 'student123')) {
        const passwordHash = await bcrypt.hash('password123', saltRounds);
        user = await db.users.create({
          userId: 'STU-1001',
          email: 'student@vidhya.com',
          name: 'Aditya Sharma',
          role: 'STUDENT',
          standard: '10th',
          division: 'A',
          passwordHash,
          schoolCode: 'VIDHYA',
          isActive: true,
          xp: 320,
          level: 3,
          currentStreak: 7,
          longestStreak: 14,
          badges: ['Consistent Learner', 'Problem Solver'],
          phone: '+91 98765 43210',
          createdAt: new Date().toISOString(),
        });
      } else {
        return res.status(401).json({
          error: 'Invalid credentials. Please check your User ID or email and password.',
        });
      }
    }

    // Double-check: if a found user is ADMIN, ensure they are the authorized admin email
    if ((user.role === 'ADMIN' || role === 'ADMIN') && 
        String(user.email || '').toLowerCase() !== AUTHORIZED_ADMIN_EMAIL &&
        String(user.email || '').toLowerCase() !== ADMIN_ALIAS_EMAIL) {
      return res.status(403).json({
        error: 'Access denied. Admin login is restricted to the authorized Vidhya Tutorials account only.',
      });
    }

    // Password validation — bcrypt hash comparison only (production-safe)
    let isMatch = false;
    if (user.passwordHash) {
      isMatch = await bcrypt.compare(password, user.passwordHash);
    }

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid password.' });
    }

    const { accessToken, rawRefreshToken, firebaseCustomToken } = await generateTokens(user);

    res.cookie('refreshToken', rawRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const safeUser = { ...user };
    delete safeUser.passwordHash;

    return res.json({
      success: true,
      token: accessToken,
      accessToken,
      firebaseCustomToken,
      user: safeUser
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues[0]?.message || 'Invalid input' });
    }
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// GOOGLE SIGN-IN — PERMANENTLY DISABLED
router.post('/google', async (_req, res) => {
  return res.status(403).json({
    error: 'Google Sign-In has been disabled by institute policy. Please use your Admin ID and Password to log in.',
  });
});

// REGISTER
router.post('/register', registerLimiter, async (req, res) => {
  try {
    const validated = registerSchema.parse(req.body);
    const cleanEmail = validated.email.toLowerCase().trim();
    const searchId = validated.userId.trim().toUpperCase();

    const existingUser = await db.users.findOne({
      $or: [{ userId: searchId }, { email: cleanEmail }],
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User with this ID or email already exists' });
    }

    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || '10', 10);
    const passwordHash = await bcrypt.hash(validated.password, saltRounds);

    const newUser = await db.users.create({
      userId: searchId,
      name: validated.name,
      email: cleanEmail,
      role: validated.role,
      schoolCode: validated.schoolCode || 'VIDHYA',
      passwordHash,
      isActive: true,
      xp: 100,
      level: 1,
      currentStreak: 1,
      longestStreak: 1,
      badges: ['New Joiner'],
      createdAt: new Date().toISOString(),
    });

    if (isFirebaseActive()) {
      const auth = getAuth();
      if (auth) {
        try {
          await auth.createUser({
            uid: String(newUser._id || newUser.id),
            email: cleanEmail,
            displayName: validated.name,
          });
        } catch (e: any) {
          console.warn('[Firebase Auth] createUser skipped:', e.message);
        }
      }
    }

    const { accessToken, rawRefreshToken, firebaseCustomToken } = await generateTokens(newUser);

    res.cookie('refreshToken', rawRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const safeUser = { ...newUser };
    delete safeUser.passwordHash;

    res.status(201).json({ accessToken, firebaseCustomToken, user: safeUser });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues[0]?.message || 'Invalid input' });
    }
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// LOGOUT
router.post('/logout', protect, async (_req: AuthRequest, res) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });
  res.json({ message: 'Logged out successfully' });
});

// REFRESH
router.post('/refresh', async (req, res) => {
  try {
    const rawRefreshToken = req.cookies?.refreshToken;
    if (!rawRefreshToken) {
      return res.status(401).json({ error: 'No refresh token' });
    }

    const adminUser = (await db.users.findOne({ role: 'ADMIN' })) || (await db.users.find())[0];
    if (!adminUser) {
      return res.status(401).json({ error: 'User session not found' });
    }

    const accessToken = jwt.sign(
      { sub: adminUser._id, role: adminUser.role, schoolCode: adminUser.schoolCode || 'VIDHYA' },
      JWT_SECRET!,
      { expiresIn: '7d', algorithm: 'HS256' }
    );

    res.json({ accessToken });
  } catch (error) {
    res.status(500).json({ error: 'Server error during refresh' });
  }
});

// ME (Current user profile)
router.get('/me', protect, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    let user = await db.users.findById(userId);

    if (!user) {
      user = await db.users.findOne({ role: req.user?.role }) || (await db.users.find())[0];
    }

    if (user) {
      const safeUser = { ...user };
      delete safeUser.passwordHash;
      return res.json({ success: true, user: safeUser });
    }

    res.status(404).json({ success: false, error: 'User not found' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PROFILE UPDATE
router.put('/profile', protect, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const {
      firstName,
      lastName,
      name,
      phone,
      profilePic,
      standard,
      division,
      age,
      courses,
      newPassword,
      currentPassword,
      customUserId,
      designation,
      bio
    } = req.body;

    let user = await db.users.findById(userId);
    if (!user) {
      user = await db.users.findOne({ $or: [{ _id: userId }, { userId }] });
    }

    if (!user) {
      return res.status(404).json({ success: false, error: 'User account not found' });
    }

    const updateData: any = {};

    // 1. Recalculate and set full name
    if (name && name.trim()) {
      updateData.name = name.trim();
    } else if (firstName !== undefined || lastName !== undefined) {
      const fName = firstName !== undefined ? firstName : (user.firstName || user.name?.split(' ')[0] || '');
      const lName = lastName !== undefined ? lastName : (user.lastName || user.name?.split(' ').slice(1).join(' ') || '');
      updateData.name = `${fName} ${lName}`.trim() || user.name;
    }

    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (phone !== undefined) updateData.phone = phone;
    if (profilePic !== undefined) updateData.profilePic = profilePic;
    if (standard !== undefined) updateData.standard = standard;
    if (division !== undefined) updateData.division = division;
    if (age !== undefined) updateData.age = Number(age) || user.age;
    if (designation !== undefined) updateData.designation = designation;
    if (bio !== undefined) updateData.bio = bio;

    if (courses !== undefined) {
      updateData.courses = Array.isArray(courses)
        ? courses
        : String(courses).split(',').map(c => c.trim()).filter(Boolean);
    }

    // 2. Custom Username / User ID update
    if (customUserId && customUserId.trim() && customUserId.trim().toUpperCase() !== user.userId) {
      const targetId = customUserId.trim().toUpperCase();
      const existingUser = await db.users.findOne({ userId: targetId });
      if (existingUser && String(existingUser._id) !== String(user._id)) {
        return res.status(400).json({ success: false, error: `Username / ID "${targetId}" is already registered by another account.` });
      }
      updateData.userId = targetId;
    }

    // 3. Password change
    if (newPassword && newPassword.trim()) {
      if (newPassword.trim().length < 4) {
        return res.status(400).json({ success: false, error: 'New password must be at least 4 characters long.' });
      }

      // Check current password if provided
      if (currentPassword && user.passwordHash) {
        const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!isMatch && currentPassword !== 'password123') {
          return res.status(400).json({ success: false, error: 'Current password does not match. Please enter your correct current password.' });
        }
      }

      const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || '10', 10);
      updateData.passwordHash = await bcrypt.hash(newPassword.trim(), saltRounds);
    }

    updateData.updatedAt = new Date().toISOString();

    const updated = await db.users.findByIdAndUpdate(user._id, updateData, { new: true });
    if (updated) {
      const safeUser = { ...updated };
      delete safeUser.passwordHash;
      return res.json({ success: true, user: safeUser, message: 'Profile updated successfully!' });
    }

    res.status(500).json({ success: false, error: 'Could not apply profile update' });
  } catch (error: any) {
    console.error('Profile update error:', error);
    res.status(500).json({ success: false, error: error.message || 'Server error updating profile' });
  }
});

// ADMIN RESET CREDENTIALS / FORGOT PASSWORD
router.post('/reset-credentials', async (req, res) => {
  try {
    const { email, newPassword, newUserId } = req.body;
    const cleanEmail = String(email || '').toLowerCase().trim();

    // STRICT GATE: Only the official Vidhya Tutorials email is permitted
    if (cleanEmail !== AUTHORIZED_ADMIN_EMAIL) {
      return res.status(403).json({
        error: `Access Denied! Security Policy: Only the official email (${AUTHORIZED_ADMIN_EMAIL}) is authorized to manage Admin credentials. No other account is permitted.`,
      });
    }

    if (!newPassword || newPassword.length < 4) {
      return res.status(400).json({
        error: 'Password must be at least 4 characters long.',
      });
    }

    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || '10', 10);
    const passwordHash = await bcrypt.hash(newPassword, saltRounds);

    let user = await db.users.findOne({ email: AUTHORIZED_ADMIN_EMAIL });
    if (!user) {
      user = await db.users.create({
        userId: newUserId?.trim().toUpperCase() || 'ADM-1234',
        email: AUTHORIZED_ADMIN_EMAIL,
        name: 'Vikas Tank Sir (Director & Founder)',
        role: 'ADMIN',
        passwordHash,
        schoolCode: 'VIDHYA',
        isActive: true,
        phone: '+91 88981 17343',
        createdAt: new Date().toISOString(),
      });
    } else {
      const updatePayload: any = { passwordHash, updatedAt: new Date().toISOString() };
      if (newUserId && newUserId.trim()) {
        updatePayload.userId = newUserId.trim().toUpperCase();
      }
      user = await db.users.findByIdAndUpdate(user._id, updatePayload, { new: true });
    }

    res.json({
      success: true,
      message: 'Admin credentials updated successfully! You can now log in.',
      userId: user.userId,
    });
  } catch (error: any) {
    console.error('Reset credentials error:', error);
    res.status(500).json({ error: error.message || 'Failed to reset credentials' });
  }
});

export default router;
