import mongoose, { Schema } from 'mongoose';

const SessionSchema = new Schema({
  userId:          { type: Schema.Types.ObjectId, ref: 'User', required: true },
  refreshTokenHash:{ type: String, required: true, unique: true }, // store HASH not raw token
  expiresAt:       { type: Date, required: true },
  ipAddress:       { type: String },
  userAgent:       { type: String },
}, { timestamps: true });

// TTL index — MongoDB auto-deletes expired sessions
SessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Session = mongoose.model('Session', SessionSchema);
