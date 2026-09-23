import { initializeApp, getApps, cert, applicationDefault } from 'firebase-admin/app';
import { getFirestore as getFirestoreAdmin, Firestore } from 'firebase-admin/firestore';
import { getAuth as getAuthAdmin, Auth } from 'firebase-admin/auth';
import fs from 'fs';
import path from 'path';

let initialized = false;
let disabled = false;
let firestoreInstance: Firestore | null = null;
let authInstance: Auth | null = null;

export function initFirebase(): boolean {
  if (disabled) return false;
  if (initialized) return true;

  try {
    let credential: any = null;
    const projectId = process.env.FIREBASE_PROJECT_ID || 'vidhyatutorials-472ba';

    // 1. Check for Service Account File Path
    const saPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || 'vidhyatutorials-472ba-firebase-adminsdk-fbsvc-6e4394dc0f.json';
    const resolvedPath = path.isAbsolute(saPath) ? saPath : path.resolve(process.cwd(), saPath);

    if (fs.existsSync(resolvedPath)) {
      try {
        const fileContent = fs.readFileSync(resolvedPath, 'utf-8');
        const serviceAccount = JSON.parse(fileContent);
        credential = cert(serviceAccount);
        console.log(`🔑 Firebase: Loaded service account credentials from ${path.basename(resolvedPath)}`);
      } catch (err: any) {
        console.warn(`⚠️ Firebase: Failed to parse service account file at ${resolvedPath}:`, err.message);
      }
    }

    // 2. Check for Inline JSON or Base64 Service Account Key
    if (!credential && process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      try {
        let raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY.trim();
        if (raw.startsWith('{')) {
          credential = cert(JSON.parse(raw));
        } else {
          // Assume base64
          const decoded = Buffer.from(raw, 'base64').toString('utf-8');
          credential = cert(JSON.parse(decoded));
        }
        console.log('🔑 Firebase: Loaded service account credentials from FIREBASE_SERVICE_ACCOUNT_KEY env var');
      } catch (err: any) {
        console.warn('⚠️ Firebase: Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY:', err.message);
      }
    }

    // 3. Check for Individual Environment Variables
    if (!credential && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
      try {
        credential = cert({
          projectId,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        });
        console.log('🔑 Firebase: Loaded credentials from FIREBASE_CLIENT_EMAIL & FIREBASE_PRIVATE_KEY');
      } catch (err: any) {
        console.warn('⚠️ Firebase: Failed to construct credentials from individual env vars:', err.message);
      }
    }

    // 4. Default / Application Default Credentials fallback
    // Only attempt ADC if explicitly requested or if GOOGLE_APPLICATION_CREDENTIALS is set,
    // otherwise it hangs on Hostinger trying to reach GCP metadata servers.
    if (!credential && (process.env.GOOGLE_APPLICATION_CREDENTIALS || process.env.FIREBASE_USE_ADC === 'true')) {
      try {
        credential = applicationDefault();
        console.log('🔑 Firebase: Falling back to Application Default Credentials');
      } catch {
        // No valid credentials found
      }
    }

    if (!credential) {
      console.warn('⚠️ Firebase: No valid credentials found. Firestore will fall back to embedded store.');
      return false;
    }

    if (getApps().length === 0) {
      initializeApp({
        credential,
        projectId,
      });
    }

    firestoreInstance = getFirestoreAdmin();
    // Ignore undefined properties so Firestore writes don't reject objects with optional undefined fields
    firestoreInstance.settings({ ignoreUndefinedProperties: true });
    authInstance = getAuthAdmin();

    initialized = true;
    console.log(`🔥 Firebase initialized successfully for project: [${projectId}]`);
    return true;
  } catch (error: any) {
    console.error('❌ Firebase initialization error:', error.message || error);
    return false;
  }
}

export function isFirebaseActive(): boolean {
  if (disabled) return false;
  if (!initialized) {
    initFirebase();
  }
  return initialized && firestoreInstance !== null;
}

export function disableFirebase() {
  disabled = true;
  initialized = false;
  firestoreInstance = null;
  authInstance = null;
}

export function getFirestore(): Firestore {
  if (!initialized) {
    initFirebase();
  }
  if (!firestoreInstance) {
    throw new Error('Firestore is not initialized. Check your Firebase credentials.');
  }
  return firestoreInstance;
}

export function getAuth(): Auth | null {
  if (!initialized) {
    initFirebase();
  }
  return authInstance;
}
