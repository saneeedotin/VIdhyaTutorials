import { isFirebaseActive } from './firebase';
import { FirestoreCollection } from './firestoreAdapter';
import { fileDb } from './fileDb';

// Firestore collection singletons
const firestoreCollections = {
  users: new FirestoreCollection('users'),
  admissions: new FirestoreCollection('admissions'),
  announcements: new FirestoreCollection('announcements'),
  appointments: new FirestoreCollection('appointments'),
  fees: new FirestoreCollection('fees'),
  feeReceipts: new FirestoreCollection('feeReceipts'),
  batches: new FirestoreCollection('batches'),
  materials: new FirestoreCollection('materials'),
  auditLogs: new FirestoreCollection('auditLogs'),
};

export function isDbActive(): boolean {
  return isFirebaseActive();
}

// Proxy getter that routes to Google Cloud Firestore if active, or fileDb seamlessly
export const db = {
  get users() {
    return isFirebaseActive() ? (firestoreCollections.users as any) : fileDb.users;
  },
  get admissions() {
    return isFirebaseActive() ? (firestoreCollections.admissions as any) : fileDb.admissions;
  },
  get announcements() {
    return isFirebaseActive() ? (firestoreCollections.announcements as any) : fileDb.announcements;
  },
  get appointments() {
    return isFirebaseActive() ? (firestoreCollections.appointments as any) : fileDb.appointments;
  },
  get fees() {
    return isFirebaseActive() ? (firestoreCollections.fees as any) : fileDb.fees;
  },
  get feeReceipts() {
    return isFirebaseActive() ? (firestoreCollections.feeReceipts as any) : fileDb.feeReceipts;
  },
  get batches() {
    return isFirebaseActive() ? (firestoreCollections.batches as any) : fileDb.batches;
  },
  get materials() {
    return isFirebaseActive() ? (firestoreCollections.materials as any) : fileDb.materials;
  },
  get auditLogs() {
    return isFirebaseActive() ? (firestoreCollections.auditLogs as any) : fileDb.auditLogs;
  },
};
