import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IVideoWatchRecord extends Document {
  studentId: Types.ObjectId;
  lessonId: Types.ObjectId;
  watchedSeconds: number;
  totalSeconds: number;
  lastPosition: number;
  completed: boolean;
  updatedAt: Date;
}

const VideoWatchRecordSchema = new Schema<IVideoWatchRecord>({
  studentId:      { type: Schema.Types.ObjectId, ref: 'User', required: true },
  lessonId:       { type: Schema.Types.ObjectId, required: true }, // Not heavily ref'd since it's a subdoc inside Course
  watchedSeconds: { type: Number, default: 0 },
  totalSeconds:   { type: Number, required: true },
  lastPosition:   { type: Number, default: 0 },
  completed:      { type: Boolean, default: false },
}, { timestamps: true });

VideoWatchRecordSchema.index({ studentId: 1, lessonId: 1 }, { unique: true });

export const VideoWatchRecord = mongoose.models.VideoWatchRecord || mongoose.model<IVideoWatchRecord>('VideoWatchRecord', VideoWatchRecordSchema);
