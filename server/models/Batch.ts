import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ISchedule {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  startTime: string; // e.g. "09:00"
  endTime: string;   // e.g. "10:30"
  subjectId: Types.ObjectId;
}

export interface IBatch extends Document {
  name: string; // e.g. "Science Morning A"
  sectionId: Types.ObjectId;
  teacherIds: Types.ObjectId[];
  studentIds: Types.ObjectId[];
  schedule: ISchedule[];
  academicYear: string; // e.g. "2024-2025"
  maxCapacity: number;
  isActive: boolean;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ScheduleSchema = new Schema<ISchedule>({
  day:        { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], required: true },
  startTime:  { type: String, required: true },
  endTime:    { type: String, required: true },
  subjectId:  { type: Schema.Types.ObjectId, ref: 'Course', required: true }, // Referencing Course as subject
});

const BatchSchema = new Schema<IBatch>({
  name:         { type: String, required: true, trim: true },
  sectionId:    { type: Schema.Types.ObjectId, ref: 'Section', required: true },
  teacherIds:   [{ type: Schema.Types.ObjectId, ref: 'User' }],
  studentIds:   [{ type: Schema.Types.ObjectId, ref: 'User' }],
  schedule:     [ScheduleSchema],
  academicYear: { type: String, required: true },
  maxCapacity:  { type: Number, required: true, default: 50 },
  isActive:     { type: Boolean, default: true },
  isArchived:   { type: Boolean, default: false },
}, { timestamps: true });

// Ensure batch names are unique within a section for an academic year
BatchSchema.index({ sectionId: 1, name: 1, academicYear: 1 }, { unique: true });

export const Batch = mongoose.models.Batch || mongoose.model<IBatch>('Batch', BatchSchema);
