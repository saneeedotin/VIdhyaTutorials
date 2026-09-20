import mongoose, { Schema, Document, Types } from 'mongoose';

export type MaterialType = 'DOCUMENT' | 'VIDEO';

export interface IMaterial extends Document {
  title: string;
  type: MaterialType;
  url: string; // File URL or YouTube embed link
  standard: string;
  division: string;
  subject: string;
  uploadedBy: Types.ObjectId;
  fileSize?: string; // e.g., "2.4 MB" for documents
  duration?: string; // e.g., "15:00" for videos
  createdAt: Date;
  updatedAt: Date;
}

const MaterialSchema = new Schema<IMaterial>({
  title:      { type: String, required: true, trim: true },
  type:       { type: String, enum: ['DOCUMENT', 'VIDEO'], required: true },
  url:        { type: String, required: true },
  standard:   { type: String, required: true },
  division:   { type: String, required: true },
  subject:    { type: String, required: true },
  uploadedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  fileSize:   { type: String },
  duration:   { type: String },
}, { timestamps: true });

MaterialSchema.index({ standard: 1, division: 1 });

export const Material = mongoose.model<IMaterial>('Material', MaterialSchema);
