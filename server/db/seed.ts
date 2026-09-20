import bcrypt from 'bcrypt';
import { db } from './adapter';

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
          phone: '+91 98205 70000',
        },
        {
          _id: '660000000000000000000002',
          userId: 'TCH-1234',
          email: 'teacher@vidhya.in',
          name: 'Dr. Sharma (Senior Faculty)',
          role: 'TEACHER',
          passwordHash,
          schoolCode: 'VIDHYA',
          isActive: true,
          xp: 520,
          level: 5,
          currentStreak: 12,
          longestStreak: 20,
          badges: ['Top Mentor', 'Physics Specialist'],
          phone: '+91 98205 70001',
          courses: ['Physics', 'Mathematics 1 & 2'],
        },
        {
          _id: '660000000000000000000005',
          userId: 'TCH-1235',
          email: 'kulkarni@vidhya.in',
          name: 'Prof. Kulkarni (Commerce Head)',
          role: 'TEACHER',
          passwordHash,
          schoolCode: 'VIDHYA',
          isActive: true,
          xp: 480,
          level: 4,
          currentStreak: 9,
          longestStreak: 15,
          badges: ['Accounts Expert', 'Chartered Faculty'],
          phone: '+91 98205 70002',
          courses: ['Book Keeping - Accountancy', 'Economics', 'OCM'],
        },
        {
          _id: '660000000000000000000003',
          userId: 'STU-1234',
          email: 'student@vidhya.in',
          name: 'Arjun Rathod',
          role: 'STUDENT',
          passwordHash,
          schoolCode: 'VIDHYA',
          standard: '10th',
          division: 'A',
          isActive: true,
          xp: 420,
          level: 4,
          currentStreak: 14,
          longestStreak: 14,
          badges: ['Scholar', 'Punctual', 'Top Scorer'],
          phone: '+91 98765 43210',
          courses: ['Maths 1', 'Maths 2', 'Science 1', 'Science 2', 'English'],
        },
        {
          _id: '660000000000000000000006',
          userId: 'STU-1235',
          email: 'sneha@vidhya.in',
          name: 'Sneha Deshmukh',
          role: 'STUDENT',
          passwordHash,
          schoolCode: 'VIDHYA',
          standard: '12th',
          division: 'Science-PCB',
          isActive: true,
          xp: 590,
          level: 5,
          currentStreak: 21,
          longestStreak: 30,
          badges: ['NEET Star', 'Bio Champion'],
          phone: '+91 98765 43211',
          courses: ['Physics', 'Chemistry', 'Biology', 'English'],
        },
        {
          _id: '660000000000000000000004',
          userId: 'PAR-1234',
          email: 'parent@vidhya.in',
          name: 'Mr. Rajesh Rathod (Parent)',
          role: 'PARENT',
          passwordHash,
          schoolCode: 'VIDHYA',
          isActive: true,
          phone: '+91 98200 11223',
        },
      ];
      await db.users.insertMany(users);
      console.log('✅ Users seeded successfully!');
    }

    // 2. Seed Announcements (Public & Classroom)
    const announcementsCount = await db.announcements.countDocuments();
    if (announcementsCount === 0) {
      const announcements = [
        {
          _id: '660000000000000000000010',
          title: '🔥 10th SSC & 12th Board Prelims Test Series 2026',
          type: 'EXAM',
          date: 'March 2026',
          time: '10:00 AM - 01:00 PM',
          tags: ['Board Exam', 'Prelims', '10th SSC', '12th HSC'],
          isActive: true,
          content: 'Intensive full-syllabus mock exam series conducted strictly as per Maharashtra State Board pattern. Detailed answer sheet evaluations with personalized feedback.',
        },
        {
          _id: '660000000000000000000011',
          title: '🎯 Special MHT-CET & NEET Formula Revision Workshop',
          type: 'WORKSHOP',
          date: 'Every Sunday',
          time: '08:30 AM - 12:30 PM',
          tags: ['NEET', 'MHT-CET', 'Science'],
          isActive: true,
          content: 'High-yield numerical problem solving, memory maps for organic reactions, and speed calculation shortcuts for Physics and Mathematics.',
        },
        {
          _id: '660000000000000000000012',
          title: '📢 Parent-Teacher Meeting (PTM) & Progress Report Distribution',
          type: 'MEETING',
          date: 'Upcoming Saturday',
          time: '04:00 PM - 07:00 PM',
          tags: ['PTM', 'Progress', 'Dharavi Branch'],
          isActive: true,
          content: 'One-on-one counseling session between parents and subject teachers to review test scores, attendance records, and personalized preparation roadmaps.',
        },
      ];
      await db.announcements.insertMany(announcements);
      console.log('✅ Announcements seeded successfully!');
    }

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

    // 7. Seed Student Todos
    const todosCount = await db.todos.countDocuments();
    if (todosCount === 0) {
      const todos = [
        {
          _id: '660000000000000000000060',
          studentId: '660000000000000000000003',
          task: 'Complete Maths 1 Linear Equations Exercise 1.3',
          subject: 'Mathematics 1',
          dueDate: 'Tomorrow, 05:00 PM',
          completed: false,
          priority: 'HIGH',
        },
        {
          _id: '660000000000000000000061',
          studentId: '660000000000000000000003',
          task: 'Review Science 1 Periodic Classification Notes',
          subject: 'Science 1',
          dueDate: 'Friday',
          completed: true,
          priority: 'MEDIUM',
        },
        {
          _id: '660000000000000000000062',
          studentId: '660000000000000000000003',
          task: 'Practice Geometry Theorems proof writing',
          subject: 'Mathematics 2',
          dueDate: 'Sunday Mock Test',
          completed: false,
          priority: 'HIGH',
        },
      ];
      await db.todos.insertMany(todos);
      console.log('✅ Student Todos seeded successfully!');
    }

    console.log('🌟 [Seed] Vidhya Tutorials database seeding completed successfully!');
  } catch (err) {
    console.error('❌ Seeding error:', err);
  }
};
