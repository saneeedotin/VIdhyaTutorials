import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IXPTransaction extends Document {
  studentId: Types.ObjectId;
  amount: number;
  reason: string; // e.g., 'Completed Lesson', 'Perfect Exam Score'
  sourceId?: string; // e.g., lessonId or examId to ensure idempotency
  timestamp: Date;
}

const XPTransactionSchema = new Schema<IXPTransaction>({
  studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  amount:    { type: Number, required: true },
  reason:    { type: String, required: true },
  sourceId:  { type: String }, // Can be anything, so keep as String
  timestamp: { type: Date, default: Date.now },
});

// Idempotency: A student cannot be awarded XP for the exact same reason and sourceId twice
// (e.g. they can't get "Lesson Completed" XP for the same lesson twice)
XPTransactionSchema.index({ studentId: 1, reason: 1, sourceId: 1 }, { unique: true, sparse: true });

export const XPTransaction = mongoose.models.XPTransaction || mongoose.model<IXPTransaction>('XPTransaction', XPTransactionSchema);
