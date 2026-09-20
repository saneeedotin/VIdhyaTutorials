// Full End-to-End Test for Vidhya Tutorials Backend
async function runTests() {
  const baseUrl = 'http://localhost:5000';
  console.log('🚀 Starting Full Backend Verification against:', baseUrl);

  let passed = 0;
  let failed = 0;

  async function test(name: string, fn: () => Promise<any>) {
    try {
      await fn();
      console.log(`✅ [PASS] ${name}`);
      passed++;
    } catch (err: any) {
      console.error(`❌ [FAIL] ${name}:`, err.message || err);
      failed++;
    }
  }

  // 1. Health check
  await test('GET /api/health', async () => {
    const res = await fetch(`${baseUrl}/api/health`);
    const json: any = await res.json();
    if (!json.status) throw new Error('Health check failed: ' + JSON.stringify(json));
  });

  // 2. Public Announcements
  await test('GET /api/announcements', async () => {
    const res = await fetch(`${baseUrl}/api/announcements`);
    const json: any = await res.json();
    const list = Array.isArray(json) ? json : json.data;
    if (!Array.isArray(list)) throw new Error('Failed to get announcements');
  });

  // 3. Analytics Tracking & Stats
  await test('POST /api/analytics/track and GET /api/analytics/stats', async () => {
    const trackRes = await fetch(`${baseUrl}/api/analytics/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        path: '/',
        referrer: 'direct',
        platform: 'Win32',
        language: 'en-US'
      })
    });
    const trackJson: any = await trackRes.json();
    if (!trackJson.success) throw new Error('Tracking failed');

    const statsRes = await fetch(`${baseUrl}/api/analytics/stats`);
    const statsJson: any = await statsRes.json();
    if (!statsJson.success || typeof statsJson.data.totalVisits !== 'number') throw new Error('Stats failed');
  });

  // 4. Public Content: Gallery & Reviews
  await test('GET /api/content/gallery and GET /api/content/reviews', async () => {
    const gRes = await fetch(`${baseUrl}/api/content/gallery`);
    const gJson: any = await gRes.json();
    if (!gJson.success || !Array.isArray(gJson.data)) throw new Error('Gallery failed');

    const rRes = await fetch(`${baseUrl}/api/content/reviews`);
    const rJson: any = await rRes.json();
    if (!rJson.success || !Array.isArray(rJson.data)) throw new Error('Reviews failed');
  });

  // 5. Public Review Submission
  await test('POST /api/content/reviews (Public pinning)', async () => {
    const res = await fetch(`${baseUrl}/api/content/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Automated Test Parent',
        role: 'Parent',
        comment: 'Outstanding guidance by Vikas Tank Sir and faculty! Truly impressive coaching.',
        rating: 5,
        source: 'Website Wall'
      })
    });
    const json: any = await res.json();
    if (!json.success || !json.data?.id) throw new Error('Failed to pin review');
  });

  // 6. Public Admission Application
  await test('POST /api/admissions/apply and GET /api/admissions/public-list', async () => {
    const applyRes = await fetch(`${baseUrl}/api/admissions/apply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentName: 'Test Student Verification',
        parentName: 'Test Parent Verification',
        phone: '9876543210',
        standard: '10th',
        previousMarks: '91%',
        schoolName: 'Swami Vivekanand High School'
      })
    });
    const applyJson: any = await applyRes.json();
    if (!applyJson.success) throw new Error('Admission application failed: ' + JSON.stringify(applyJson));

    const pubListRes = await fetch(`${baseUrl}/api/admissions/public-list`);
    const pubListJson: any = await pubListRes.json();
    if (!pubListJson.success || !Array.isArray(pubListJson.data)) throw new Error('Admission public list failed');
  });

  // 7. Auth: Admin Login
  let adminToken = '';
  await test('POST /api/auth/login (ADMIN - admin@vidhya.com)', async () => {
    const res = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@vidhya.com', password: 'password123' })
    });
    const json: any = await res.json();
    if (!json.success || !json.token) throw new Error('Admin login failed: ' + JSON.stringify(json));
    adminToken = json.token;
  });

  // 8. Auth: Teacher Login
  let teacherToken = '';
  await test('POST /api/auth/login (TEACHER - teacher@vidhya.com)', async () => {
    const res = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'teacher@vidhya.com', password: 'password123' })
    });
    const json: any = await res.json();
    if (!json.success || !json.token) throw new Error('Teacher login failed: ' + JSON.stringify(json));
    teacherToken = json.token;
  });

  // 9. Auth: Student Login
  let studentToken = '';
  await test('POST /api/auth/login (STUDENT - student@vidhya.com)', async () => {
    const res = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'student@vidhya.com', password: 'password123' })
    });
    const json: any = await res.json();
    if (!json.success || !json.token) throw new Error('Student login failed: ' + JSON.stringify(json));
    studentToken = json.token;
  });

  // 10. Admin: Metrics, Batches, Users
  await test('Admin Routes: /metrics, /batches, /users', async () => {
    const metricsRes = await fetch(`${baseUrl}/api/admin/metrics`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const metricsJson: any = await metricsRes.json();
    if (!metricsJson.success || !metricsJson.data?.branchesCount) throw new Error('Metrics failed');

    const batchesRes = await fetch(`${baseUrl}/api/admin/batches`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const batchesJson: any = await batchesRes.json();
    if (!batchesJson.success || !Array.isArray(batchesJson.data)) throw new Error('Batches failed');

    const usersRes = await fetch(`${baseUrl}/api/admin/users`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const usersJson: any = await usersRes.json();
    if (!usersJson.success || !Array.isArray(usersJson.data)) throw new Error('Users failed');
  });

  // 11. Teacher: Students, Attendance, Materials, Todos
  await test('Teacher Routes: /students, /attendance, /materials, /todos', async () => {
    const stuRes = await fetch(`${baseUrl}/api/teacher/students?standard=10th&division=A`, {
      headers: { Authorization: `Bearer ${teacherToken}` }
    });
    const stuJson: any = await stuRes.json();
    if (!stuJson.success || !Array.isArray(stuJson.data)) throw new Error('Teacher students fetch failed');

    const attRes = await fetch(`${baseUrl}/api/teacher/attendance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${teacherToken}`
      },
      body: JSON.stringify({
        batchId: '10th-A',
        students: [
          { studentId: stuJson.data[0]?._id || 'STU-1001', percentage: 95 }
        ]
      })
    });
    const attJson: any = await attRes.json();
    if (!attJson.success) throw new Error('Attendance mark failed');

    const matRes = await fetch(`${baseUrl}/api/teacher/materials`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${teacherToken}`
      },
      body: JSON.stringify({
        title: 'Class 10 SSC Mathematics Revision Notes',
        type: 'PDF',
        contentUrl: 'https://storage.vidhya.com/materials/math-ch1.pdf',
        standard: '10th',
        division: 'A',
        subject: 'Mathematics'
      })
    });
    const matJson: any = await matRes.json();
    if (!matJson.success) throw new Error('Material upload failed');

    const todoRes = await fetch(`${baseUrl}/api/teacher/todos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${teacherToken}`
      },
      body: JSON.stringify({ title: 'Schedule Parent Teacher Meeting for 10th Standard' })
    });
    const todoJson: any = await todoRes.json();
    if (!todoJson.success) throw new Error('Teacher todo create failed');
  });

  // 12. Student: Timetable, Attendance, Todos, Fee Receipts
  await test('Student Routes: /timetable, /attendance, /todos, /fees/receipt', async () => {
    const ttRes = await fetch(`${baseUrl}/api/student/timetable/upcoming`, {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    const ttJson: any = await ttRes.json();
    if (!ttJson.success || !Array.isArray(ttJson.data)) throw new Error('Student timetable failed');

    const attRes = await fetch(`${baseUrl}/api/student/attendance`, {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    const attJson: any = await attRes.json();
    if (!attJson.success || typeof attJson.data?.overallPercentage !== 'number') throw new Error('Student attendance failed');

    const todoRes = await fetch(`${baseUrl}/api/student/todos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${studentToken}`
      },
      body: JSON.stringify({ title: 'Complete Physics Practice Paper 2' })
    });
    const todoJson: any = await todoRes.json();
    if (!todoJson.success) throw new Error('Student todo create failed');

    const receiptRes = await fetch(`${baseUrl}/api/student/fees/receipt`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${studentToken}`
      },
      body: JSON.stringify({
        transactionId: 'TXN-UPI-AUTO-TEST-001',
        amount: 15000,
        paymentDate: '2026-09-20'
      })
    });
    const receiptJson: any = await receiptRes.json();
    if (!receiptJson.success || !receiptJson.data?._id) throw new Error('Fee receipt submission failed');

    // 13. Admin verifies and approves the submitted receipt
    const adminVerifyRes = await fetch(`${baseUrl}/api/admin/fees/receipts/${receiptJson.data._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({ status: 'VERIFIED', remarks: 'Payment verified via bank statement' })
    });
    const adminVerifyJson: any = await adminVerifyRes.json();
    if (!adminVerifyJson.success || adminVerifyJson.data?.status !== 'VERIFIED') throw new Error('Admin receipt approval failed');
  });

  console.log(`\n========================================`);
  console.log(`Summary: Passed: ${passed}, Failed: ${failed}`);
  console.log(`========================================`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(e => {
  console.error('Test execution error:', e);
  process.exit(1);
});
