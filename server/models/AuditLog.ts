import mongoose, { Schema } from 'mongoose';

const AuditLogSchema = new Schema({
  userId:    { type: String },          // userId string (not ObjectId — may not exist for failed attempts)
  role:      { type: String },
  action:    { type: String, enum: ['LOGIN_SUCCESS','LOGIN_FAIL','LOGOUT','REGISTER','PASSWORD_RESET'] },
  ipAddress: { type: String },
  userAgent: { type: String },
  timestamp: { type: Date, default: Date.now },
});

AuditLogSchema.index({ timestamp: -1 });   // fast descending sort for admin log viewer
export const AuditLog = mongoose.model('AuditLog', AuditLogSchema);
