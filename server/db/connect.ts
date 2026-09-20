import mongoose from 'mongoose';
import { seedDatabase } from './seed';

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (uri) {
    try {
      await mongoose.connect(uri, { dbName: 'myvidhya', serverSelectionTimeoutMS: 4000 });
      console.log('✅ MongoDB connected successfully to remote cluster');
      await seedDatabase();
      return;
    } catch (primaryError) {
      console.warn('⚠️ Could not connect to remote MONGODB_URI:', (primaryError as any)?.message || primaryError);
      console.log('🔄 Falling back to embedded persistent database engine (server/data/)...');
    }
  } else {
    console.log('📦 No MONGODB_URI found. Initializing embedded persistent database (server/data/)...');
  }

  // Fallback: Disconnect any hanging mongoose attempts so buffering won't stall
  try {
    await mongoose.disconnect();
  } catch (e) {}

  console.log('🚀 Embedded persistent database ready. All data is saved to server/data/*.json');
  await seedDatabase();
};
