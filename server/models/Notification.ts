import mongoose, { Schema, Document, Types } from 'mongoose';

export interface INotification extends Document {
  recipientId: Types.ObjectId;
  recipientRole: string;
  type: string;
  title: string;
  body: string;
  data?: any; // e.g. { targetId: "exam-123", action: "view_exam" }
  isRead: boolean;
  readAt?: Date;
  deliveryChannels: ('IN_APP' | 'PUSH' | 'EMAIL')[];
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>({
  recipientId:      { type: Schema.Types.ObjectId, ref: 'User', required: true },
  recipientRole:    { type: String, required: true },
  type:             { type: String, required: true },
  title:            { type: String, required: true },
  body:             { type: String, required: true },
  data:             { type: Schema.Types.Mixed },
  isRead:           { type: Boolean, default: false },
  readAt:           { type: Date },
  deliveryChannels: [{ type: String, enum: ['IN_APP', 'PUSH', 'EMAIL'] }],
}, { timestamps: true });

// Index for fast query of unread notifications for a user
NotificationSchema.index({ recipientId: 1, isRead: 1 });

export const Notification = mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);
