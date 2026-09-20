import mongoose, { Schema, Document, Types } from 'mongoose';

export type Role = 'STUDENT' | 'TEACHER' | 'ADMIN' | 'PARENT';

export interface IUser extends Document {
  userId: string;       // STU-2024-0031 format
  role: Role;
  name: string;
  email: string;
  passwordHash: string;
  schoolCode: string;
  
  // Account Status & Security
  isActive: boolean;
  isLocked: boolean;
  failedLoginAttempts: number;
  lockedUntil?: Date;
  emailVerified: boolean;
  
  // Gamification
  xp: number;
  level: number;
  badges: string[];
  currentStreak: number;
  longestStreak: number;
  lastStreakDate?: string;

  // Detailed Profile fields
  phone?: string;
  age?: number;
  standard?: string;
  division?: string;
  courses?: string[];
  profilePic?: string; // Storing base64 or URL
  
  // Relational IDs
  sectionId?: Types.ObjectId; // For Student
  batchId?: Types.ObjectId;   // For Student
  sectionIds?: Types.ObjectId[]; // For Teacher
  batchIds?: Types.ObjectId[];   // For Teacher
  studentIds?: Types.ObjectId[]; // For Parent (linked children)
  
  // Preferences
  preferredLanguage?: string;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  userId:               { type: String, required: true, unique: true, trim: true },
  role:                 { type: String, enum: ['STUDENT','TEACHER','ADMIN','PARENT'], required: true },
  name:                 { type: String, required: true, trim: true },
  email:                { type: String, required: true, lowercase: true, trim: true },
  passwordHash:         { type: String, required: true },
  schoolCode:           { type: String, required: true, trim: true },
  
  isActive:             { type: Boolean, default: true },
  isLocked:             { type: Boolean, default: false },
  failedLoginAttempts:  { type: Number, default: 0 },
  lockedUntil:          { type: Date },
  emailVerified:        { type: Boolean, default: false },
  
  xp:                   { type: Number, default: 0 },
  level:                { type: Number, default: 1 },
  badges:               [{ type: String }],
  currentStreak:        { type: Number, default: 0 },
  longestStreak:        { type: Number, default: 0 },
  lastStreakDate:       { type: String },

  phone:                { type: String },
  age:                  { type: Number },
  standard:             { type: String, default: '6th' },
  division:             { type: String, default: 'A' },
  courses:              [{ type: String }],
  profilePic:           { type: String }, // Base64 string can be quite large
  
  sectionId:            { type: Schema.Types.ObjectId, ref: 'Section' },
  batchId:              { type: Schema.Types.ObjectId, ref: 'Batch' },
  sectionIds:           [{ type: Schema.Types.ObjectId, ref: 'Section' }],
  batchIds:             [{ type: Schema.Types.ObjectId, ref: 'Batch' }],
  studentIds:           [{ type: Schema.Types.ObjectId, ref: 'User' }],
  
  preferredLanguage:    { type: String, default: 'en' },
}, { timestamps: true });

// Index for fast auth lookups
UserSchema.index({ userId: 1, role: 1 });
UserSchema.index({ email: 1 });

export const User = mongoose.model<IUser>('User', UserSchema);
