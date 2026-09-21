import { initFirebase, isFirebaseActive, getFirestore } from './firebase';
import { seedDatabase } from './seed';

export const connectDB = async () => {
  const firebaseSuccess = initFirebase();

  if (firebaseSuccess && isFirebaseActive()) {
    try {
      const firestore = getFirestore();
      // Verify connectivity by fetching collection list
      await firestore.listCollections();
      console.log('✅ Google Cloud Firestore connected successfully');
      await seedDatabase();
      return;
    } catch (primaryError: any) {
      console.warn('⚠️ Could not connect to remote Firestore:', primaryError?.message || primaryError);
      console.log('🔄 Falling back to embedded persistent database engine (server/data/)...');
    }
  } else {
    console.log('📦 No Firebase credentials configured. Initializing embedded persistent database (server/data/)...');
  }

  console.log('🚀 Embedded persistent database ready. All data is saved to server/data/*.json');
  await seedDatabase();
};
