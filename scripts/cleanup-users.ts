import dotenv from 'dotenv';
dotenv.config();

import { db } from '../server/db/adapter';

async function main() {
  console.log('🔍 Fetching all users from database...');
  // Wait a moment for firestore to initialize
  await new Promise(r => setTimeout(r, 2000));

  const users = await db.users.find();
  console.log(`Found ${users.length} users in DB:`);
  users.forEach((u: any) => {
    console.log(`- ${u.name} | ${u.email} | ${u.userId} | ${u.role} (ID: ${u._id || u.id})`);
  });

  const AUTHORIZED_ADMIN_EMAIL = 'vidhyatutorials22@gmail.com';
  const AUTHORIZED_ADMIN_ID = 'ADM-1234';

  for (const u of users) {
    const uEmail = String(u.email || '').toLowerCase().trim();
    const uId = String(u.userId || '').toUpperCase().trim();

    if (uEmail !== AUTHORIZED_ADMIN_EMAIL && uId !== AUTHORIZED_ADMIN_ID) {
      console.log(`🗑️ Deleting user: ${u.name} (${u.email} / ${u.userId})...`);
      await db.users.findByIdAndDelete(u._id || u.id);
    } else {
      console.log(`✅ Keeping Admin: ${u.name} (${u.email} / ${u.userId})`);
    }
  }

  const remaining = await db.users.find();
  console.log(`\n🎉 Cleanup complete! Remaining users (${remaining.length}):`);
  remaining.forEach((u: any) => {
    console.log(`- ${u.name} | ${u.email} | ${u.userId} | ${u.role}`);
  });

  process.exit(0);
}

main().catch(err => {
  console.error('Error during cleanup:', err);
  process.exit(1);
});
