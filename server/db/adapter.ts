import mongoose from 'mongoose';
import { fileDb } from './fileDb';

// Import Mongoose models
import { User } from '../models/User';
import { AdmissionApplication } from '../models/AdmissionApplication';
import { PublicAnnouncement } from '../models/PublicAnnouncement';
import { Appointment } from '../models/Appointment';
import { FeeRecord } from '../models/FeeRecord';
import { FeeReceipt } from '../models/FeeReceipt';
import { Batch } from '../models/Batch';
import { AttendanceRecord } from '../models/AttendanceRecord';
import { Material } from '../models/Material';
import { StudentTodo } from '../models/StudentTodo';
import { SubjectProgress } from '../models/SubjectProgress';
import { XPTransaction } from '../models/XPTransaction';
import { AuditLog } from '../models/AuditLog';

export function isMongoActive(): boolean {
  return mongoose.connection.readyState === 1;
}

// Proxy getter that routes to MongoDB if connected, or to fileDb seamlessly
export const db = {
  get users() {
    return isMongoActive() ? (User as any) : fileDb.users;
  },
  get admissions() {
    return isMongoActive() ? (AdmissionApplication as any) : fileDb.admissions;
  },
  get announcements() {
    return isMongoActive() ? (PublicAnnouncement as any) : fileDb.announcements;
  },
  get appointments() {
    return isMongoActive() ? (Appointment as any) : fileDb.appointments;
  },
  get fees() {
    return isMongoActive() ? (FeeRecord as any) : fileDb.fees;
  },
  get feeReceipts() {
    return isMongoActive() ? (FeeReceipt as any) : fileDb.feeReceipts;
  },
  get batches() {
    return isMongoActive() ? (Batch as any) : fileDb.batches;
  },
  get attendance() {
    return isMongoActive() ? (AttendanceRecord as any) : fileDb.attendance;
  },
  get materials() {
    return isMongoActive() ? (Material as any) : fileDb.materials;
  },
  get todos() {
    return isMongoActive() ? (StudentTodo as any) : fileDb.todos;
  },
  get subjectProgress() {
    return isMongoActive() ? (SubjectProgress as any) : fileDb.subjectProgress;
  },
  get xpTransactions() {
    return isMongoActive() ? (XPTransaction as any) : fileDb.xpTransactions;
  },
  get auditLogs() {
    return isMongoActive() ? (AuditLog as any) : fileDb.auditLogs;
  },
};
