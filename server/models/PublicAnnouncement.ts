import mongoose, { Schema, Document } from 'mongoose';

export interface IPublicAnnouncement extends Document {
  type: 'NEWS' | 'EVENT';
  title: string;
  date: string;
  time?: string;
  imgUrl?: string;
  tags?: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PublicAnnouncementSchema = new Schema<IPublicAnnouncement>({
  type: { type: String, enum: ['NEWS', 'EVENT'], required: true },
  title: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String },
  imgUrl: { type: String },
  tags: [{ type: String }],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export const PublicAnnouncement = mongoose.model<IPublicAnnouncement>('PublicAnnouncement', PublicAnnouncementSchema);
