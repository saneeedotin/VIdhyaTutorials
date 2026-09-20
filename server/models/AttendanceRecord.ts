import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IAttendanceRecord extends Document {
  studentId: Types.ObjectId;
  batchId: Types.ObjectId;
  subjectId: Types.ObjectId;
  weekStartDate: string; // YYYY-MM-DD
  percentage: number;
  markedBy: Types.ObjectId; // Teacher who marked it
  markedAt: Date;
}

const AttendanceRecordSchema = new Schema<IAttendanceRecord>({
  studentId:     { type: Schema.Types.ObjectId, ref: 'User', required: true },
  batchId:       { type: Schema.Types.ObjectId, ref: 'Batch', required: true },
  subjectId:     { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  weekStartDate: { type: String, required: true },
  percentage:    { type: Number, required: true, min: 0, max: 100 },
  markedBy:      { type: Schema.Types.ObjectId, ref: 'User', required: true },
  markedAt:      { type: Date, default: Date.now },
});

// A student can only have one attendance record per subject per week
AttendanceRecordSchema.index({ studentId: 1, subjectId: 1, weekStartDate: 1 }, { unique: true });

export const AttendanceRecord = mongoose.models.AttendanceRecord || mongoose.model<IAttendanceRecord>('AttendanceRecord', AttendanceRecordSchema);
