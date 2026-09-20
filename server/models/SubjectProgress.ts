import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ISubjectProgress extends Document {
  studentId: Types.ObjectId;
  subjectName: string;
  percentage: number;
  updatedByTeacherId?: Types.ObjectId;
  updatedAt: Date;
}

const SubjectProgressSchema = new Schema<ISubjectProgress>({
  studentId:          { type: Schema.Types.ObjectId, ref: 'User', required: true },
  subjectName:        { type: String, required: true },
  percentage:         { type: Number, required: true, min: 0, max: 100, default: 0 },
  updatedByTeacherId: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

// A student can only have one progress record per subject name
SubjectProgressSchema.index({ studentId: 1, subjectName: 1 }, { unique: true });

export const SubjectProgress = mongoose.models.SubjectProgress || mongoose.model<ISubjectProgress>('SubjectProgress', SubjectProgressSchema);
