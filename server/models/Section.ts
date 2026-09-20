import mongoose, { Schema, Document } from 'mongoose';

export type SectionType = 'SCHOOL' | 'COMMERCE' | 'SCIENCE' | 'NEET' | 'SSC';

export interface ISection extends Document {
  name: SectionType;
  label: string;      // e.g. "Science (11th-12th)"
  themeColor: string; // e.g. "#4575e1"
  icon: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SectionSchema = new Schema<ISection>({
  name:       { type: String, enum: ['SCHOOL', 'COMMERCE', 'SCIENCE', 'NEET', 'SSC'], required: true, unique: true },
  label:      { type: String, required: true },
  themeColor: { type: String, required: true },
  icon:       { type: String, required: true },
  isActive:   { type: Boolean, default: true },
}, { timestamps: true });

export const Section = mongoose.models.Section || mongoose.model<ISection>('Section', SectionSchema);
