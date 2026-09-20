import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IFeeReceipt extends Document {
  studentId: Types.ObjectId;
  transactionId: string;
  amount: number;
  paymentDate: Date;
  receiptUrl?: string;
  status: 'PENDING VERIFICATION' | 'VERIFIED' | 'REJECTED';
  createdAt: Date;
  updatedAt: Date;
}

const FeeReceiptSchema = new Schema<IFeeReceipt>({
  studentId:     { type: Schema.Types.ObjectId, ref: 'User', required: true },
  transactionId: { type: String, required: true },
  amount:        { type: Number, required: true },
  paymentDate:   { type: Date, required: true },
  receiptUrl:    { type: String },
  status:        { type: String, enum: ['PENDING VERIFICATION', 'VERIFIED', 'REJECTED'], default: 'PENDING VERIFICATION' },
}, { timestamps: true });

export const FeeReceipt = mongoose.models.FeeReceipt || mongoose.model<IFeeReceipt>('FeeReceipt', FeeReceiptSchema);
