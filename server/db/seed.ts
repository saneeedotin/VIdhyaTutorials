import bcrypt from 'bcryptjs';
import { db } from './adapter';
import { isFirebaseActive, getAuth } from './firebase';

export const seedDatabase = async () => {
  try {
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || '10', 10);
    const passwordHash = await bcrypt.hash('password123', saltRounds);

    // 1. Seed Users
    const usersCount = await db.users.countDocuments();
    if (usersCount === 0) {
      const users = [
        {
          _id: '660000000000000000000001',
          userId: 'ADM-1234',
          email: 'vidhyatutorials22@gmail.com',
          name: 'Vikas Tank Sir (Director & Founder)',
          role: 'ADMIN',
          passwordHash,
          schoolCode: 'VIDHYA',
          isActive: true,
          xp: 850,
          level: 8,
          currentStreak: 24,
          longestStreak: 45,
          badges: ['Director', 'Master Mentor', 'Administrator'],
          phone: '+91 88981 17343',
        },
      ];
      await db.users.insertMany(users);

      // Sync initial users with Firebase Auth if active
      if (isFirebaseActive()) {
        const auth = getAuth();
        if (auth) {
          for (const u of users) {
            try {
              await auth.getUser(u._id).catch(async () => {
                await auth.createUser({
                  uid: u._id,
                  email: u.email,
                  displayName: u.name,
                });
              });
            } catch (authErr: any) {
              // Non-blocking
            }
          }
        }
      }

      console.log('✅ Users seeded successfully!');
    }

    // 2. Announcements - initially empty until admin publishes them
    // (no dummy announcements)

    // 3. Seed Batches
    const batchesCount = await db.batches.countDocuments();
    if (batchesCount === 0) {
      const batches = [
        {
          _id: '660000000000000000000020',
          name: 'Class 10th SSC Board Champions (Batch A)',
          standard: '10th',
          division: 'A',
          wing: 'SCHOOL',
          room: 'Hall 1 (Main Floor)',
          timing: '04:30 PM - 07:30 PM (Mon-Sat)',
          totalStudents: 32,
          subjects: ['Maths 1', 'Maths 2', 'Science 1', 'Science 2', 'History & Civics', 'Geography', 'English', 'Hindi', 'Marathi'],
        },
        {
          _id: '660000000000000000000021',
          name: 'Class 12th HSC Science - NEET & CET Target',
          standard: '12th',
          division: 'Science',
          wing: 'COLLEGE',
          room: 'Lab 2 (Audio-Visual Hall)',
          timing: '07:30 AM - 11:30 AM (Mon-Sat)',
          totalStudents: 28,
          subjects: ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'English'],
        },
        {
          _id: '660000000000000000000022',
          name: 'Class 12th HSC Commerce Excellence',
          standard: '12th',
          division: 'Commerce',
          wing: 'COMMERCE',
          room: 'Room 3 (First Floor)',
          timing: '03:00 PM - 06:00 PM (Mon-Sat)',
          totalStudents: 30,
          subjects: ['Book Keeping - Accountancy', 'Organization of Commerce (OCM)', 'Economics', 'Secretarial Practice (SP)', 'English'],
        },
        {
          _id: '660000000000000000000023',
          name: 'Class 6th to 8th Foundation Junior Wing',
          standard: '8th',
          division: 'Foundation',
          wing: 'SCHOOL',
          room: 'Room 4',
          timing: '05:00 PM - 07:00 PM (Mon-Fri)',
          totalStudents: 24,
          subjects: ['Mathematics', 'Science', 'History', 'Geography', 'English', 'Hindi', 'Marathi'],
        },
      ];
      await db.batches.insertMany(batches);
      console.log('✅ Batches seeded successfully!');
    }

    // 4. Seed Course Materials
    const materialsCount = await db.materials.countDocuments();
    if (materialsCount === 0) {
      const materials = [
        {
          _id: '660000000000000000000030',
          title: '10th SSC Maths 1 & 2 Formula Handbook (Complete)',
          type: 'DOCUMENT',
          url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          standard: '10th',
          division: 'A',
          subject: 'Mathematics',
          uploadedBy: '660000000000000000000002',
          fileSize: '2.4 MB',
          createdAt: new Date().toISOString(),
        },
        {
          _id: '660000000000000000000031',
          title: '10th Science 1 - Gravitation & Chemical Reactions Quick Revision',
          type: 'DOCUMENT',
          url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          standard: '10th',
          division: 'A',
          subject: 'Science',
          uploadedBy: '660000000000000000000002',
          fileSize: '3.1 MB',
          createdAt: new Date().toISOString(),
        },
        {
          _id: '660000000000000000000032',
          title: '12th Commerce - Partnership Final Accounts Step-by-Step Ledger Guide',
          type: 'DOCUMENT',
          url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          standard: '12th',
          division: 'Commerce',
          subject: 'Accountancy',
          uploadedBy: '660000000000000000000005',
          fileSize: '4.2 MB',
          createdAt: new Date().toISOString(),
        },
        {
          _id: '660000000000000000000033',
          title: 'NEET Physics - Electrostatics & Modern Physics Masterclass',
          type: 'VIDEO',
          url: 'https://www.youtube.com/watch?v=IuqVNpOmtTI',
          standard: '12th',
          division: 'Science',
          subject: 'Physics',
          uploadedBy: '660000000000000000000002',
          duration: '38:15',
          createdAt: new Date().toISOString(),
        },
      ];
      await db.materials.insertMany(materials);
      console.log('✅ Materials seeded successfully!');
    }

    // 5. Seed Sample Admissions for Admin Management
    const admissionsCount = await db.admissions.countDocuments();
    if (admissionsCount === 0) {
      const admissions = [
        {
          _id: '660000000000000000000040',
          studentName: 'Rahul Verma',
          parentName: 'Sanjay Verma',
          email: 'rahul.verma@example.com',
          phone: '+91 98112 23344',
          whatsapp: '+91 98112 23344',
          schoolOrCollege: 'Our Lady of Good Counsel High School',
          academicWing: 'SCHOOL',
          standard: '10th',
          stream: 'General',
          subjectSelection: 'ALL',
          selectedSubjects: ['Maths 1', 'Maths 2', 'Science 1', 'Science 2', 'English', 'Hindi', 'Marathi'],
          status: 'PENDING',
          submittedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
          address: 'Matunga Labour Camp, Near 90 Feet Road, Dharavi',
        },
        {
          _id: '660000000000000000000041',
          studentName: 'Anjali Gupta',
          parentName: 'Manoj Gupta',
          email: 'anjali.gupta@example.com',
          phone: '+91 98223 34455',
          whatsapp: '+91 98223 34455',
          schoolOrCollege: 'SIES College of Arts, Science & Commerce',
          academicWing: 'COMMERCE',
          standard: '12th',
          stream: 'Commerce',
          subjectSelection: 'PARTICULAR',
          selectedSubjects: ['Book Keeping - Accountancy', 'Economics', 'Maths 1', 'Maths 2'],
          status: 'APPROVED',
          submittedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
          address: 'Kumbharwada, Dharavi, Mumbai - 400017',
        },
        {
          _id: '660000000000000000000042',
          studentName: 'Fahad Shaikh',
          parentName: 'Ibrahim Shaikh',
          email: 'fahad.shaikh@example.com',
          phone: '+91 98334 45566',
          whatsapp: '+91 98334 45566',
          schoolOrCollege: 'Kirti M. Doongursee College',
          academicWing: 'COLLEGE',
          standard: '11th',
          stream: 'Science-PCM',
          subjectSelection: 'ALL',
          selectedSubjects: ['Physics', 'Chemistry', 'Mathematics', 'English'],
          status: 'APPROVED',
          submittedAt: new Date(Date.now() - 3600000 * 48).toISOString(),
          address: 'Transit Camp, Dharavi, Mumbai - 400017',
        },
      ];
      await db.admissions.insertMany(admissions);
      console.log('✅ Admission applications seeded successfully!');
    }

    // 6. Seed Fee Records
    const feesCount = await db.fees.countDocuments();
    if (feesCount === 0) {
      const fees = [
        {
          _id: '660000000000000000000050',
          studentId: '660000000000000000000003',
          studentName: 'Arjun Rathod',
          standard: '10th',
          academicYear: '2025-2026',
          totalAmount: 35000,
          paidAmount: 25000,
          dueAmount: 10000,
          status: 'PARTIAL',
          dueDate: '2026-03-31',
          installments: [
            { installmentNo: 1, amount: 15000, paidDate: '2025-06-15', status: 'PAID', receiptNo: 'VT-REC-2025-0102' },
            { installmentNo: 2, amount: 10000, paidDate: '2025-10-10', status: 'PAID', receiptNo: 'VT-REC-2025-0481' },
            { installmentNo: 3, amount: 10000, paidDate: null, status: 'PENDING', receiptNo: null },
          ],
        },
        {
          _id: '660000000000000000000051',
          studentId: '660000000000000000000006',
          studentName: 'Sneha Deshmukh',
          standard: '12th',
          academicYear: '2025-2026',
          totalAmount: 48000,
          paidAmount: 48000,
          dueAmount: 0,
          status: 'PAID',
          dueDate: '2026-01-15',
          installments: [
            { installmentNo: 1, amount: 24000, paidDate: '2025-06-20', status: 'PAID', receiptNo: 'VT-REC-2025-0144' },
            { installmentNo: 2, amount: 24000, paidDate: '2025-11-05', status: 'PAID', receiptNo: 'VT-REC-2025-0612' },
          ],
        },
      ];
      await db.fees.insertMany(fees);
      console.log('✅ Fees seeded successfully!');
    }

    console.log('🌟 [Seed] Vidhya Tutorials database seeding completed successfully!');
  } catch (err) {
    console.error('❌ Seeding error:', err);
  }
};
