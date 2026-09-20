import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IFeeRecord extends Document {
  studentId: Types.ObjectId;
  batchId: Types.ObjectId;
  installmentNumber: number;
  title: string; // e.g. "Term 1 Fee", "Scholarship Discount"
  amount: number; // Stored in PAISE (integer)
  dueDate: Date;
  status: 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  paidAt?: Date;
  paymentId?: string; // Razorpay payment ID
  orderId?: string; // Razorpay order ID
  receiptNumber?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const FeeRecordSchema = new Schema<IFeeRecord>({
  studentId:         { type: Schema.Types.ObjectId, ref: 'User', required: true },
  batchId:           { type: Schema.Types.ObjectId, ref: 'Batch', required: true },
  installmentNumber: { type: Number, required: true },
  title:             { type: String, required: true },
  amount:            { type: Number, required: true }, // in paise
  dueDate:           { type: Date, required: true },
  status:            { type: String, enum: ['PENDING', 'PAID', 'OVERDUE', 'CANCELLED'], default: 'PENDING' },
  paidAt:            { type: Date },
  paymentId:         { type: String },
  orderId:           { type: String },
  receiptNumber:     { type: String },
  notes:             { type: String },
}, { timestamps: true });

// Quickly find pending fees for a student
FeeRecordSchema.index({ studentId: 1, status: 1 });

export const FeeRecord = mongoose.models.FeeRecord || mongoose.model<IFeeRecord>('FeeRecord', FeeRecordSchema);
