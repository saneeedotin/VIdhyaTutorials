import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ICourseMaterial extends Document {
  courseId: Types.ObjectId;
  chapterId: Types.ObjectId;
  lessonId: Types.ObjectId;
  teacherId: Types.ObjectId;
  type: 'PDF' | 'VIDEO_LINK' | 'IMAGE' | 'TEXT';
  title: string;
  contentUrl: string; // URL to S3, Drive, or YouTube
  version: number;
  isViewOnly: boolean; // For PDF, block download
  visibility: 'CLASS' | 'ALL';
  standard: string;
  division: string;
  createdAt: Date;
  updatedAt: Date;
}

const CourseMaterialSchema = new Schema<ICourseMaterial>({
  courseId:   { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  chapterId:  { type: Schema.Types.ObjectId, required: true },
  lessonId:   { type: Schema.Types.ObjectId, required: true },
  teacherId:  { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type:       { type: String, enum: ['PDF', 'VIDEO_LINK', 'IMAGE', 'TEXT'], required: true },
  title:      { type: String, required: true },
  contentUrl: { type: String, required: true },
  version:    { type: Number, default: 1 },
  isViewOnly: { type: Boolean, default: false },
  visibility: { type: String, enum: ['CLASS', 'ALL'], default: 'CLASS' },
  standard:   { type: String, required: true },
  division:   { type: String, required: true },
}, { timestamps: true });

// A lesson can have multiple materials, but usually 1 main video and maybe 1 notes file.
CourseMaterialSchema.index({ lessonId: 1, type: 1 });

export const CourseMaterial = mongoose.models.CourseMaterial || mongoose.model<ICourseMaterial>('CourseMaterial', CourseMaterialSchema);
