const fs = require('fs');
const path = require('path');

const portraitBuf = fs.readFileSync(path.join(__dirname, '..', 'public', 'vikas-sir-ai-portrait.jpg'));
const portraitBase64 = 'data:image/jpeg;base64,' + portraitBuf.toString('base64');

const dashboardBuf = fs.readFileSync('C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\d8fee4e1-b644-45b7-92db-4ae37babfe81\\admin_dashboard_restored.png');
const dashboardBase64 = 'data:image/png;base64,' + dashboardBuf.toString('base64');

const htmlContent = `<!DOCTYPE html>
<html lang="hi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vidhya Tutorials — Client Presentation & Operational Guide (Vikas Tank Sir)</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Outfit:wght@600;700;800;900&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #090d16;
      --card-bg: #121929;
      --card-border: rgba(255, 255, 255, 0.08);
      --primary: #2563eb;
      --primary-glow: rgba(37, 99, 235, 0.35);
      --accent: #f59e0b;
      --accent-glow: rgba(245, 158, 11, 0.25);
      --success: #10b981;
      --success-glow: rgba(16, 185, 129, 0.25);
      --danger: #ef4444;
      --text: #f8fafc;
      --text-muted: #94a3b8;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Plus Jakarta Sans', sans-serif;
      background: radial-gradient(circle at 50% 0%, #172554 0%, var(--bg) 75%);
      color: var(--text);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 20px;
      overflow-x: hidden;
    }

    /* Deck Master Container */
    .deck-container {
      width: 100%;
      max-width: 1180px;
      background: rgba(18, 25, 41, 0.85);
      backdrop-filter: blur(20px);
      border: 1px solid var(--card-border);
      border-radius: 28px;
      box-shadow: 0 30px 80px -20px rgba(0, 0, 0, 0.8), 0 0 40px var(--primary-glow);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      min-height: 720px;
      position: relative;
    }

    /* Header Bar */
    .deck-header {
      padding: 16px 32px;
      background: rgba(9, 13, 22, 0.9);
      border-bottom: 1px solid var(--card-border);
      display: flex;
      justify-content: space-between;
      align-items: center;
      z-index: 10;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .brand-logo {
      width: 42px;
      height: 42px;
      background: linear-gradient(135deg, #3b82f6, #1d4ed8);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Outfit', sans-serif;
      font-weight: 900;
      font-size: 20px;
      color: white;
      box-shadow: 0 4px 15px rgba(37, 99, 235, 0.4);
    }

    .brand-title {
      font-family: 'Outfit', sans-serif;
      font-weight: 800;
      font-size: 19px;
      color: white;
      letter-spacing: -0.3px;
    }

    .brand-subtitle {
      font-size: 12px;
      color: #94a3b8;
      font-weight: 500;
    }

    .brand-badge {
      background: rgba(59, 130, 246, 0.15);
      color: #60a5fa;
      border: 1px solid rgba(59, 130, 246, 0.3);
      padding: 5px 12px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .deck-actions {
      display: flex;
      gap: 10px;
    }

    .btn-action {
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid var(--card-border);
      color: #cbd5e1;
      padding: 8px 16px;
      border-radius: 10px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s;
    }

    .btn-action:hover {
      background: rgba(255, 255, 255, 0.12);
      color: white;
      border-color: rgba(255, 255, 255, 0.2);
    }

    /* Slide Stage */
    .slide-stage {
      flex: 1;
      position: relative;
      overflow: hidden;
      min-height: 580px;
      display: flex;
    }

    .slide {
      display: none;
      width: 100%;
      padding: 36px 44px;
      animation: fadeIn 0.35s ease-out forwards;
      flex-direction: column;
    }

    .slide.active {
      display: flex;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(12px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* Slide Typography */
    .slide-tag {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #60a5fa;
      margin-bottom: 8px;
    }

    .slide-title {
      font-family: 'Outfit', sans-serif;
      font-size: 30px;
      font-weight: 800;
      color: white;
      letter-spacing: -0.5px;
      line-height: 1.25;
      margin-bottom: 8px;
    }

    .slide-subtitle {
      font-size: 14.5px;
      color: var(--text-muted);
      line-height: 1.5;
      margin-bottom: 24px;
    }

    /* Grids & Cards */
    .grid-2 {
      display: grid;
      grid-cols: 2;
      grid-template-columns: repeat(2, 1fr);
      gap: 22px;
    }

    .grid-3 {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
    }

    .grid-left-wide {
      display: grid;
      grid-template-columns: 1.35fr 1fr;
      gap: 24px;
    }

    .grid-right-wide {
      display: grid;
      grid-template-columns: 1fr 1.35fr;
      gap: 24px;
    }

    .card {
      background: rgba(18, 25, 41, 0.7);
      border: 1px solid var(--card-border);
      border-radius: 20px;
      padding: 22px;
      transition: all 0.25s ease;
      position: relative;
      overflow: hidden;
    }

    .card:hover {
      border-color: rgba(59, 130, 246, 0.4);
      background: rgba(23, 33, 54, 0.85);
      transform: translateY(-2px);
    }

    .card-icon {
      font-size: 28px;
      margin-bottom: 12px;
      display: inline-block;
    }

    .card-title {
      font-family: 'Outfit', sans-serif;
      font-weight: 700;
      font-size: 17px;
      color: white;
      margin-bottom: 8px;
    }

    .card-desc {
      font-size: 13px;
      color: var(--text-muted);
      line-height: 1.6;
    }

    .card-desc strong {
      color: #e2e8f0;
    }

    /* Banner callout */
    .banner {
      background: linear-gradient(135deg, rgba(37, 99, 235, 0.15), rgba(59, 130, 246, 0.05));
      border: 1px solid rgba(59, 130, 246, 0.35);
      border-radius: 18px;
      padding: 16px 22px;
      margin-top: auto;
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .banner.success {
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(16, 185, 129, 0.05));
      border-color: rgba(16, 185, 129, 0.35);
    }

    .banner.warning {
      background: linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(245, 158, 11, 0.05));
      border-color: rgba(245, 158, 11, 0.35);
    }

    .banner.danger {
      background: linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(239, 68, 68, 0.05));
      border-color: rgba(239, 68, 68, 0.35);
    }

    .banner-text {
      font-size: 13px;
      line-height: 1.5;
      color: #cbd5e1;
    }

    .banner-text strong {
      color: white;
    }

    /* Data Table */
    .table-container {
      border: 1px solid var(--card-border);
      border-radius: 18px;
      overflow: hidden;
      background: rgba(15, 23, 42, 0.6);
    }

    table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      font-size: 13px;
    }

    th {
      background: rgba(15, 23, 42, 0.95);
      padding: 14px 18px;
      color: #94a3b8;
      font-weight: 700;
      border-bottom: 1px solid var(--card-border);
      text-transform: uppercase;
      font-size: 11px;
      letter-spacing: 0.5px;
    }

    td {
      padding: 13px 18px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      color: #e2e8f0;
    }

    tr:last-child td {
      border-bottom: none;
    }

    .badge-pill {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.3px;
    }

    .badge-blue { background: rgba(59, 130, 246, 0.2); color: #93c5fd; border: 1px solid rgba(59, 130, 246, 0.4); }
    .badge-green { background: rgba(16, 185, 129, 0.2); color: #6ee7b7; border: 1px solid rgba(16, 185, 129, 0.4); }
    .badge-amber { background: rgba(245, 158, 11, 0.2); color: #fde68a; border: 1px solid rgba(245, 158, 11, 0.4); }
    .badge-red { background: rgba(239, 68, 68, 0.2); color: #fca5a5; border: 1px solid rgba(239, 68, 68, 0.4); }

    .code-badge {
      background: #090d16;
      padding: 3px 8px;
      border-radius: 6px;
      font-family: monospace;
      font-weight: 700;
      color: #60a5fa;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    /* Live Screenshot Frame */
    .screenshot-frame {
      border-radius: 16px;
      overflow: hidden;
      border: 2px solid rgba(59, 130, 246, 0.4);
      box-shadow: 0 15px 35px -10px rgba(0, 0, 0, 0.8), 0 0 25px rgba(37, 99, 235, 0.2);
      background: #0f172a;
      position: relative;
    }

    .screenshot-frame img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .screenshot-caption {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: rgba(15, 23, 42, 0.85);
      backdrop-filter: blur(8px);
      padding: 8px 14px;
      font-size: 11px;
      font-weight: 700;
      color: #93c5fd;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      justify-content: space-between;
    }

    /* Footer Navigation */
    .deck-footer {
      padding: 16px 32px;
      background: rgba(9, 13, 22, 0.95);
      border-top: 1px solid var(--card-border);
      display: flex;
      justify-content: space-between;
      align-items: center;
      z-index: 10;
    }

    .nav-controls {
      display: flex;
      gap: 12px;
      align-items: center;
    }

    .btn-nav {
      background: var(--primary);
      color: white;
      border: none;
      padding: 9px 20px;
      border-radius: 10px;
      font-weight: 700;
      font-size: 13px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s;
    }

    .btn-nav:hover {
      background: #1d4ed8;
      box-shadow: 0 0 15px var(--primary-glow);
    }

    .btn-nav:disabled {
      background: rgba(255, 255, 255, 0.1);
      color: #64748b;
      cursor: not-allowed;
      box-shadow: none;
    }

    .slide-dots {
      display: flex;
      gap: 6px;
    }

    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.2);
      cursor: pointer;
      transition: all 0.2s;
    }

    .dot.active {
      width: 24px;
      border-radius: 10px;
      background: #3b82f6;
      box-shadow: 0 0 10px rgba(59, 130, 246, 0.6);
    }

    .slide-counter {
      font-size: 13px;
      font-weight: 700;
      color: var(--text-muted);
    }

    /* Print & Fullscreen styles */
    @media print {
      body {
        background: white !important;
        color: black !important;
        padding: 0;
      }
      .deck-header, .deck-footer {
        display: none !important;
      }
      .deck-container {
        border: none !important;
        box-shadow: none !important;
        max-width: 100% !important;
        background: white !important;
      }
      .slide {
        display: flex !important;
        page-break-after: always;
        padding: 40px !important;
        min-height: 100vh;
      }
      .card {
        background: #f8fafc !important;
        border: 1px solid #cbd5e1 !important;
        color: black !important;
      }
      .slide-title { color: #1e3a8a !important; }
      .card-title { color: #0f172a !important; }
      .card-desc { color: #334155 !important; }
      table th { background: #e2e8f0 !important; color: black !important; }
      table td { color: #1e293b !important; }
      .banner { border-color: #cbd5e1 !important; background: #f1f5f9 !important; color: black !important; }
      .banner-text { color: black !important; }
    }
  </style>
</head>
<body>

  <div class="deck-container" id="deckContainer">
    
    <!-- Top Bar -->
    <header class="deck-header">
      <div class="brand">
        <div class="brand-logo">VT</div>
        <div>
          <div class="brand-title">Vidhya Tutorials</div>
          <div class="brand-subtitle">Dharavi 90 Feet Road Campus • Mumbai</div>
        </div>
        <span class="brand-badge">Official Client Presentation</span>
      </div>

      <div class="deck-actions">
        <button class="btn-action" onclick="toggleFullScreen()">⛶ Fullscreen</button>
        <button class="btn-action" onclick="window.print()">🖨️ Print / Save as PDF</button>
      </div>
    </header>

    <!-- Slide Stage -->
    <main class="slide-stage">

      <!-- SLIDE 1: Welcome & Executive AI Portrait -->
      <section class="slide active">
        <div class="slide-tag">Slide 01 / 11 • Executive Overview</div>
        <h1 class="slide-title">Vidhya Tutorials — Digital Platform</h1>
        <p class="slide-subtitle">Director Vikas Tank Sir ke liye complete website aur admin panel ka aasan guide</p>

        <div class="grid-left-wide" style="align-items: center; margin-bottom: 20px;">
          <!-- Left: Big Director Card with AI Portrait -->
          <div style="display: flex; gap: 24px; align-items: center; background: rgba(15, 23, 42, 0.85); border: 2px solid rgba(59, 130, 246, 0.4); border-radius: 24px; padding: 22px 26px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);">
            <div style="position: relative; width: 130px; height: 160px; border-radius: 18px; overflow: hidden; border: 2px solid #3b82f6; box-shadow: 0 8px 24px rgba(59, 130, 246, 0.4); shrink: 0;">
              <img src="${portraitBase64}" alt="Vikas Tank Sir" style="width: 100%; height: 100%; object-fit: cover; object-position: top;">
              <div style="position: absolute; bottom: 0; left: 0; right: 0; background: rgba(15, 23, 42, 0.9); font-size: 10px; font-weight: 800; text-align: center; color: #60a5fa; padding: 3px;">DIRECTOR</div>
            </div>
            <div>
              <span class="badge-pill badge-blue" style="margin-bottom: 8px;">Founder & Senior Academic Head</span>
              <h2 style="font-family: 'Outfit', sans-serif; font-size: 26px; font-weight: 800; color: white;">Vikas Tank Sir</h2>
              <p style="font-size: 13px; color: #94a3b8; line-height: 1.5; margin-top: 6px;">
                18+ Years of Academic Excellence • Mathematics & Science Pedagogy • Direct Personal Mentorship for Mumbai Board Students.
              </p>
              <div style="display: flex; gap: 10px; margin-top: 12px;">
                <span class="badge-pill badge-green">✔ Single Admin</span>
                <span class="badge-pill badge-amber">✔ Instant WhatsApp Lead</span>
              </div>
            </div>
          </div>

          <!-- Right: Quick Impact Summary -->
          <div class="card" style="border-color: rgba(59, 130, 246, 0.3);">
            <div class="card-icon">🎯</div>
            <div class="card-title">Digital Platform Goals</div>
            <div class="card-desc">
              1. <strong>Zero Lead Leakage:</strong> Har inquiry par instant alert.<br>
              2. <strong>100% Director Control:</strong> Sirf Vikas Sir ka private secure panel.<br>
              3. <strong>Genuine Transparency:</strong> 100% real website visitors & records.
            </div>
          </div>
        </div>

        <div class="banner">
          <span style="font-size: 24px;">💡</span>
          <div class="banner-text">
            <strong>Maksad:</strong> Dharavi 90 Feet Road branch ke coaching admissions ko 100% digital karna aur har ek student ki inquiry turant Vikas Sir ke phone par aana.
          </div>
        </div>
      </section>

      <!-- SLIDE 2: Credentials & Single-User Security -->
      <section class="slide">
        <div class="slide-tag">Slide 02 / 11 • Access & Security</div>
        <h1 class="slide-title">Admin Login & Credentials</h1>
        <p class="slide-subtitle">Director Vikas Sir ka exclusive administrative access desk</p>

        <div class="table-container" style="margin-bottom: 22px;">
          <table>
            <thead>
              <tr>
                <th>Access Field</th>
                <th>Official Credential</th>
                <th>Security & Role Notes</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Public Website</strong></td>
                <td><span class="code-badge">https://vidhyatutorials.in</span></td>
                <td>Parents aur students ke dekhne ke liye live website</td>
              </tr>
              <tr>
                <td><strong>Admin Login URL</strong></td>
                <td><span class="code-badge">https://vidhyatutorials.in/login</span></td>
                <td>Director ka private secure login gate</td>
              </tr>
              <tr>
                <td><strong>Admin User ID</strong></td>
                <td><span class="code-badge">ADM-1234</span></td>
                <td>Official registered Director User ID</td>
              </tr>
              <tr>
                <td><strong>Registered Admin Email</strong></td>
                <td><span class="code-badge">vidhyatutorials22@gmail.com</span></td>
                <td>Sirf isi email par password reset aur alerts aayenge</td>
              </tr>
              <tr>
                <td><strong>Database Access Gate</strong></td>
                <td><span class="badge-pill badge-green">● Single User Only (Vikas Sir)</span></td>
                <td>Dummy student/teacher/parent accounts permanently deleted</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="grid-2">
          <div class="card" style="border-color: rgba(16, 185, 129, 0.4);">
            <div class="card-icon">🛡️</div>
            <div class="card-title" style="color: #6ee7b7;">Exclusive Single Director Gate</div>
            <div class="card-desc">
              Database mein sirf aur sirf Vikas Tank Sir ka account register hai. Dusra koi bhi unauthorized vyakti panel mein enter nahi ho sakta.
            </div>
          </div>
          <div class="card" style="border-color: rgba(245, 158, 11, 0.4);">
            <div class="card-icon">🔐</div>
            <div class="card-title" style="color: #fde68a;">Clean Sidebar (No Clutter)</div>
            <div class="card-desc">
              Admin panel se faltu tabs jaise Batches aur Fee Ledger hata diye gaye hain taaki Sir ko sirf wahi dikhe jo zaroori hai: <strong>Admissions, Inquiries, Notices aur Settings</strong>.
            </div>
          </div>
        </div>
      </section>

      <!-- SLIDE 3: Public Website Sections -->
      <section class="slide">
        <div class="slide-tag">Slide 03 / 11 • Website Walkthrough</div>
        <h1 class="slide-title">Website par Parents & Students kya dekhenge?</h1>
        <p class="slide-subtitle">Vidhya Tutorials ki modern, high-speed official website ke key sections</p>

        <div class="grid-3" style="margin-bottom: 20px;">
          <div class="card" style="border-color: rgba(59, 130, 246, 0.35);">
            <div class="card-icon">🏫</div>
            <div class="card-title">1. School Section</div>
            <div class="card-desc">
              <strong>8th, 9th, 10th SSC & CBSE:</strong><br>
              Concept foundation, mathematics drills, weekly test series, and board exam revision batches.
            </div>
          </div>

          <div class="card" style="border-color: rgba(245, 158, 11, 0.35);">
            <div class="card-icon">💼</div>
            <div class="card-title">2. Commerce Section</div>
            <div class="card-desc">
              <strong>11th & 12th HSC (FYJC / SYJC):</strong><br>
              Book Keeping & Accountancy, Economics, OCM, and SP with practical problem solving.
            </div>
          </div>

          <div class="card" style="border-color: rgba(16, 185, 129, 0.35);">
            <div class="card-icon">🔬</div>
            <div class="card-title">3. Science & Entrance</div>
            <div class="card-desc">
              <strong>11th & 12th Science:</strong><br>
              Physics, Chemistry, Maths, Biology along with MHT-CET, NEET & JEE Foundation support.
            </div>
          </div>
        </div>

        <div class="grid-2">
          <div class="card">
            <div class="card-title">📝 Online Admission & Inquiries</div>
            <div class="card-desc">
              Website ke har page par "Apply for Admission" aur "Book Free Counseling" ke buttons hain jahan parent student ka naam, standard aur phone number daal sakte hain.
            </div>
          </div>
          <div class="card">
            <div class="card-title">📍 Dharavi 90 Feet Road Branch</div>
            <div class="card-desc">
              Institute ka exact address, landmark, Google Map location aur direct WhatsApp button website ke footer mein integrated hai.
            </div>
          </div>
        </div>
      </section>

      <!-- SLIDE 4: Instant Automation Flow -->
      <section class="slide">
        <div class="slide-tag">Slide 04 / 11 • Lead Automation</div>
        <h1 class="slide-title">Automated Lead Notification System</h1>
        <p class="slide-subtitle">Jab bhi koi parent admission ya inquiry form bharega toh kya hoga?</p>

        <div class="grid-3" style="margin-bottom: 22px;">
          <!-- WhatsApp Card -->
          <div class="card" style="border-color: rgba(37, 211, 102, 0.45); background: rgba(37, 211, 102, 0.08);">
            <div class="card-icon">💬</div>
            <div class="card-title" style="color: #4ade80;">1. Instant WhatsApp Alert</div>
            <div class="card-desc">
              Vikas Sir ke personal WhatsApp <strong>+91 88981 17343</strong> par turant notification aayegi:<br><br>
              <div style="background: rgba(0,0,0,0.4); padding: 10px; border-radius: 8px; border-left: 3px solid #25d366; font-size: 11.5px; font-family: monospace;">
                📢 *New Admission Inquiry!*<br>
                👤 Student: Aryan Patil<br>
                📞 Phone: 98200XXXXX<br>
                📚 Class: 10th SSC
              </div>
            </div>
          </div>

          <!-- Gmail Card -->
          <div class="card" style="border-color: rgba(239, 68, 68, 0.45); background: rgba(239, 68, 68, 0.08);">
            <div class="card-icon">✉️</div>
            <div class="card-title" style="color: #f87171;">2. Official Gmail Backup</div>
            <div class="card-desc">
              <strong>vidhyatutorials22@gmail.com</strong> par complete admission profile aayegi jisme parent ka address, previous school aur percentage details hongi.
            </div>
          </div>

          <!-- Admin Portal Card -->
          <div class="card" style="border-color: rgba(59, 130, 246, 0.45); background: rgba(59, 130, 246, 0.08);">
            <div class="card-icon">📂</div>
            <div class="card-title" style="color: #93c5fd;">3. Admin Database Record</div>
            <div class="card-desc">
              Lead hamesha ke liye Admin Dashboard ke table mein save ho jayegi, taaki offline counseling ke waqt complete record available rahe.
            </div>
          </div>
        </div>

        <div class="banner success">
          <span style="font-size: 26px;">⚡</span>
          <div class="banner-text">
            <strong>Director Pro-Tip:</strong> Parent ke form bharne ke <strong>15 se 30 minute</strong> ke andar phone call karne se admission hone ke chances <strong>80% zyada</strong> hote hain!
          </div>
        </div>
      </section>

      <!-- SLIDE 5: Real Admin Dashboard Screenshot -->
      <section class="slide">
        <div class="slide-tag">Slide 05 / 11 • Command Center</div>
        <h1 class="slide-title">Real Admin Dashboard Overview</h1>
        <p class="slide-subtitle">Director Vikas Sir ka live private command center</p>

        <div class="grid-left-wide" style="align-items: center;">
          <!-- Real Dashboard Screenshot Frame -->
          <div class="screenshot-frame" style="height: 380px;">
            <img src="${dashboardBase64}" alt="Vidhya Tutorials Real Admin Dashboard">
            <div class="screenshot-caption">
              <span>🖥️ Live Admin Dashboard Interface (vidhyatutorials.in/admin)</span>
              <span>100% Real Analytics</span>
            </div>
          </div>

          <!-- Dashboard Highlights Breakdown -->
          <div style="display: flex; flex-direction: column; gap: 14px;">
            <div class="card" style="padding: 16px;">
              <div style="font-size: 14px; font-weight: 700; color: #60a5fa; margin-bottom: 4px;">1. Sidebar Navigation</div>
              <div style="font-size: 12.5px; color: #cbd5e1; line-height: 1.4;">
                Overview, Admissions, Forms, Users, Announcements aur Settings. Faltu Batches/Fee Ledger permanently removed.
              </div>
            </div>

            <div class="card" style="padding: 16px;">
              <div style="font-size: 14px; font-weight: 700; color: #34d399; margin-bottom: 4px;">2. Quick Action Metric Cards</div>
              <div style="font-size: 12.5px; color: #cbd5e1; line-height: 1.4;">
                Pending admissions aur verified student applications ko 1-click mein open aur review karein.
              </div>
            </div>

            <div class="card" style="padding: 16px;">
              <div style="font-size: 14px; font-weight: 700; color: #fbbf24; margin-bottom: 4px;">3. CSV Export Button</div>
              <div style="font-size: 12.5px; color: #cbd5e1; line-height: 1.4;">
                "Download CSV Report" button se sabhi students ka data Excel/CSV format mein 1 second mein download ho jata hai.
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- SLIDE 6: Managing Admissions & WhatsApp Chat -->
      <section class="slide">
        <div class="slide-tag">Slide 06 / 11 • Student Inquiries</div>
        <h1 class="slide-title">Admissions Manage Karna & 1-Click WhatsApp</h1>
        <p class="slide-subtitle">Ek click mein parent se direct WhatsApp chat aur admission status update karein</p>

        <div class="grid-2" style="margin-bottom: 20px;">
          <!-- Table Breakdown -->
          <div class="card">
            <div class="card-title">📋 Admission Table Features</div>
            <div class="card-desc" style="line-height: 1.8;">
              • <strong>Class Filter:</strong> 8th, 9th, 10th, Commerce ya Science ke mutabiq filter karein.<br>
              • <strong>Status Pipeline:</strong><br>
              &nbsp;&nbsp;🟡 <span class="badge-pill badge-amber">New</span> (Naya form aaya hai)<br>
              &nbsp;&nbsp;🔵 <span class="badge-pill badge-blue">Contacted</span> (Phone par baat ho chuki hai)<br>
              &nbsp;&nbsp;🟢 <span class="badge-pill badge-green">Enrolled</span> (Fees bhardi aur admission confirm)
            </div>
          </div>

          <!-- WhatsApp Chat Button -->
          <div class="card" style="border-color: rgba(37, 211, 102, 0.4);">
            <div class="card-title" style="color: #4ade80;">💬 1-Click WhatsApp Direct Connect</div>
            <div class="card-desc">
              Har student row ke aage green WhatsApp icon hota hai.
              <br><br>
              Us par click karte hi aapke phone ya PC par parent ka WhatsApp chat seedhe open ho jata hai pre-filled message ke saath:
              <br><br>
              <div style="background: rgba(0,0,0,0.4); padding: 10px; border-radius: 8px; border-left: 3px solid #25d366; font-size: 12px; color: #86efac;">
                "Namaste! Vidhya Tutorials mein Aryan ke 10th SSC admission form ke silsile mein sampark kiya jaa raha hai..."
              </div>
            </div>
          </div>
        </div>

        <div class="banner">
          <span style="font-size: 24px;">💡</span>
          <div class="banner-text">
            <strong>Fayda:</strong> Number save karne ki zaroorat nahi padti; click karte hi direct WhatsApp open hota hai!
          </div>
        </div>
      </section>

      <!-- SLIDE 7: Notice Board & Announcements -->
      <section class="slide">
        <div class="slide-tag">Slide 07 / 11 • Live Notice Board</div>
        <h1 class="slide-title">Notice Board & Announcements Kaise Kaam Karega?</h1>
        <p class="slide-subtitle">Website ka notice board kab dikhega aur Sir kaise publish karenge?</p>

        <div class="grid-2" style="margin-bottom: 22px;">
          <div class="card">
            <div class="card-icon">🧹</div>
            <div class="card-title">Default State: Bilkul Clean & Empty</div>
            <div class="card-desc">
              Website par koi bhi purana ya fake notice nahi dikhega. Jab tak Vikas Sir Admin Panel se naya notice nahi daalte, tab tak notice board section website par bilkul clean aur hidden rahega.
            </div>
          </div>

          <div class="card">
            <div class="card-icon">📢</div>
            <div class="card-title">Instant 10-Second Publishing</div>
            <div class="card-desc">
              1. Admin Panel mein <strong>Announcements</strong> tab par jayein.<br>
              2. Title daalein (e.g. <em>"10th Prelim Exam Schedule Announced"</em>).<br>
              3. Category chunein (Exam / Holiday / PTM / Urgent).<br>
              4. "Publish" par click karein — <strong>turant live website par visible ho jayega!</strong>
            </div>
          </div>
        </div>

        <div class="grid-3">
          <div class="card" style="padding: 16px;">
            <div style="font-weight: 700; color: #f87171; font-size: 14px;">Urgent Alerts</div>
            <div style="font-size: 12px; color: #94a3b8; margin-top: 4px;">Heavy rain holidays ya emergency batch timing change.</div>
          </div>
          <div class="card" style="padding: 16px;">
            <div style="font-weight: 700; color: #60a5fa; font-size: 14px;">Exam Schedules</div>
            <div style="font-size: 12px; color: #94a3b8; margin-top: 4px;">Weekly test series aur prelim timetable circulars.</div>
          </div>
          <div class="card" style="padding: 16px;">
            <div style="font-weight: 700; color: #fbbf24; font-size: 14px;">PTM Alerts</div>
            <div style="font-size: 12px; color: #94a3b8; margin-top: 4px;">Parents meeting dates aur timings ki official intimation.</div>
          </div>
        </div>
      </section>

      <!-- SLIDE 8: Strict Password & Security Rules -->
      <section class="slide">
        <div class="slide-tag">Slide 08 / 11 • Security & Passwords</div>
        <h1 class="slide-title">Password Edit & Reset (Strict 5-Minute Rule)</h1>
        <p class="slide-subtitle">Admin portal ka password badalne aur reset karne ke do surakshit tareeqe</p>

        <div class="grid-2" style="margin-bottom: 20px;">
          <!-- Method 1: Profile Settings -->
          <div class="card" style="border-color: rgba(59, 130, 246, 0.4);">
            <div class="card-title" style="color: #93c5fd;">Tareeqa 1: Direct Profile Settings Se</div>
            <div class="card-desc" style="line-height: 1.7;">
              Agar aapko apna purana password pata hai:<br>
              1. Admin Panel mein niche <strong>Settings / Profile</strong> kholein.<br>
              2. <strong>Current Password</strong> enter karein.<br>
              3. Apna <strong>New Password</strong> daalein aur confirm karein.<br>
              4. "Save Changes" dabayein — password turant update ho jayega!
            </div>
          </div>

          <!-- Method 2: Forgot Password -->
          <div class="card" style="border-color: rgba(239, 68, 68, 0.4);">
            <div class="card-title" style="color: #fca5a5;">Tareeqa 2: Forgot Password (Strict 5-Min Rule)</div>
            <div class="card-desc" style="line-height: 1.7;">
              Agar password bhool gaye hain:<br>
              1. Login screen par <strong>"Forgot Password"</strong> dabayein.<br>
              2. Email enter karein: <span class="code-badge">vidhyatutorials22@gmail.com</span><br>
              3. Official Gmail par ek secure 1-time reset link aayegi.<br>
              4. <strong>Strict 5-Minute Timer:</strong> Yeh link sirf <strong>5 minutes</strong> tak valid rahegi. 5 minute baad link automatically expire ho jayegi.
            </div>
          </div>
        </div>

        <div class="banner danger">
          <span style="font-size: 26px;">🔒</span>
          <div class="banner-text">
            <strong>High-Security Policy:</strong> Screen par koi direct master key ya bypass button nahi rakha gaya hai taaki koi dusra vyakti portal ka password change na kar sake. Sirf official email ke zariye hi reset ho sakta hai.
          </div>
        </div>
      </section>

      <!-- SLIDE 9: Real-time Traffic Analytics -->
      <section class="slide">
        <div class="slide-tag">Slide 09 / 11 • Real Analytics</div>
        <h1 class="slide-title">Live Website Traffic Analytics (100% Genuine)</h1>
        <p class="slide-subtitle">Website par genuine kitne log aa rahe hain uski live audit report</p>

        <div class="grid-2" style="margin-bottom: 22px;">
          <div class="card">
            <div class="card-title">👁️ Total Website Hits</div>
            <div class="card-desc">
              Website par total kitne pages open kiye gaye hain. Har baar jab koi parent ya student naya page dekhta hai, yeh counter automatic badhta hai.
            </div>
          </div>

          <div class="card">
            <div class="card-title">👥 Today's Visits (Unique Visitors)</div>
            <div class="card-desc">
              Aaj kitne naye alag-alag logon ne website visit ki hai. IP address ke zariye system genuine logo ko track karta hai.
            </div>
          </div>
        </div>

        <div class="grid-2">
          <div class="card">
            <div class="card-title">📈 Top Explored Pages</div>
            <div class="card-desc">
              Pata chalta hai ki parents kis section mein sabse zyada interested hain — jaise 10th SSC, 12th Commerce, ya Online Admission Form.
            </div>
          </div>

          <div class="card" style="border-color: rgba(16, 185, 129, 0.4);">
            <div class="card-title" style="color: #6ee7b7;">✔ 100% Genuine (No Fake Counters)</div>
            <div class="card-desc">
              Puraane fake mock numbers (+14820 etc.) permanently delete kar diye gaye hain. Sir ko sirf genuine real visitors dikhenge.
            </div>
          </div>
        </div>
      </section>

      <!-- SLIDE 10: Toppers & Content Gallery -->
      <section class="slide">
        <div class="slide-tag">Slide 10 / 11 • Results & Media</div>
        <h1 class="slide-title">Toppers Showcase & Campus Gallery</h1>
        <p class="slide-subtitle">Board exam mein high score karne wale students aur institute ki photos</p>

        <div class="grid-3" style="margin-bottom: 22px;">
          <div class="card">
            <div class="card-icon">🏆</div>
            <div class="card-title">SSC & HSC Board Toppers</div>
            <div class="card-desc">
              Student ka Photo, Name, Percentage (e.g. 94.6% SSC Board) aur School Name website ke Achievers showcase mein show hota hai.
            </div>
          </div>

          <div class="card">
            <div class="card-icon">📸</div>
            <div class="card-title">Dharavi Campus Gallery</div>
            <div class="card-desc">
              Smart classroom, library environment, mentoring sessions aur felicitation function ki genuine photos uploaded hain.
            </div>
          </div>

          <div class="card">
            <div class="card-icon">🌟</div>
            <div class="card-title">Google & Parent Reviews</div>
            <div class="card-desc">
              Parents aur alumni ke 5-star genuine reviews website par show hote hain jisse naye parents ka trust 100% badhta hai.
            </div>
          </div>
        </div>

        <div class="banner">
          <span style="font-size: 24px;">💡</span>
          <div class="banner-text">
            <strong>Marketing Rule:</strong> Jab parents toppers ke genuine marks aur reviews dekhte hain, toh admission conversion rate 3x badh jata hai.
          </div>
        </div>
      </section>

      <!-- SLIDE 11: Daily Routine & Support Handover -->
      <section class="slide">
        <div class="slide-tag">Slide 11 / 11 • Handover & Support</div>
        <h1 class="slide-title">Director's Daily 5-Minute Routine & Support</h1>
        <p class="slide-subtitle">Platform ko smoothly chalane ke liye Vikas Sir ka 5-minute daily checklist</p>

        <div class="grid-3" style="margin-bottom: 22px;">
          <div class="card" style="border-color: rgba(59, 130, 246, 0.4);">
            <div class="card-icon">☀️</div>
            <div class="card-title">Step 1: Morning Check</div>
            <div class="card-desc">
              Subah WhatsApp aur Gmail check karein ki raat ko ya subah kisi parent ka naya admission form toh nahi aaya.
            </div>
          </div>

          <div class="card" style="border-color: rgba(16, 185, 129, 0.4);">
            <div class="card-icon">📞</div>
            <div class="card-title">Step 2: Quick Call-Back</div>
            <div class="card-desc">
              Admin panel kholein aur "New" status wale students ko 1-Click WhatsApp ya Call karke counseling ke liye institute bulayein.
            </div>
          </div>

          <div class="card" style="border-color: rgba(245, 158, 11, 0.4);">
            <div class="card-icon">📢</div>
            <div class="card-title">Step 3: Post Notice (If Any)</div>
            <div class="card-desc">
              Agar koi test series timetable ya holiday update deni ho, toh 10 second mein Announcement publish kar dein.
            </div>
          </div>
        </div>

        <div class="banner success">
          <span style="font-size: 28px;">🤝</span>
          <div class="banner-text">
            <strong>Technical Assistance:</strong> Vidhya Tutorials ka digital platform complete security aur performance optimization ke saath tayar hai. Kisi bhi query ke liye humari direct developer support line available hai.
          </div>
        </div>
      </section>

    </main>

    <!-- Bottom Controller -->
    <footer class="deck-footer">
      <div class="slide-counter">
        <span id="currentSlideNum">1</span> / <span id="totalSlideNum">11</span>
      </div>

      <div class="slide-dots" id="dotsContainer"></div>

      <div class="nav-controls">
        <button class="btn-nav" id="prevBtn" onclick="prevSlide()" disabled>← Previous</button>
        <button class="btn-nav" id="nextBtn" onclick="nextSlide()">Next →</button>
      </div>
    </footer>

  </div>

  <script>
    const slides = document.querySelectorAll('.slide');
    const totalSlides = slides.length;
    let currentSlide = 0;

    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const currentSlideNum = document.getElementById('currentSlideNum');
    const totalSlideNum = document.getElementById('totalSlideNum');
    const dotsContainer = document.getElementById('dotsContainer');

    totalSlideNum.textContent = totalSlides;

    // Create Navigation Dots
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement('div');
      dot.className = 'dot' + (i === 0 ? ' active' : '');
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    }

    const dots = document.querySelectorAll('.dot');

    function updateDeck() {
      slides.forEach((slide, index) => {
        slide.classList.toggle('active', index === currentSlide);
      });

      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
      });

      currentSlideNum.textContent = currentSlide + 1;
      prevBtn.disabled = currentSlide === 0;
      nextBtn.disabled = currentSlide === totalSlides - 1;
    }

    function nextSlide() {
      if (currentSlide < totalSlides - 1) {
        currentSlide++;
        updateDeck();
      }
    }

    function prevSlide() {
      if (currentSlide > 0) {
        currentSlide--;
        updateDeck();
      }
    }

    function goToSlide(index) {
      currentSlide = index;
      updateDeck();
    }

    // Keyboard Arrow Navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        prevSlide();
      }
    });

    // Fullscreen Toggle
    function toggleFullScreen() {
      const elem = document.getElementById('deckContainer');
      if (!document.fullscreenElement) {
        elem.requestFullscreen().catch(err => {
          alert('Error attempting to enable full-screen mode: ' + err.message);
        });
      } else {
        document.exitFullscreen();
      }
    }
  </script>
</body>
</html>
`;

const target1 = path.join(__dirname, '..', 'VIdhya_Tutorials_Client_Presentation.html');
const target2 = 'C:\\Users\\Admin\\OneDrive\\Desktop\\VIdhya_Tutorials_Client_Presentation.html';

fs.writeFileSync(target1, htmlContent, 'utf8');
fs.writeFileSync(target2, htmlContent, 'utf8');

console.log('✅ Generated Master Client Presentation HTML at:');
console.log('1.', target1, '(' + Math.round(fs.statSync(target1).size / 1024) + ' KB)');
console.log('2.', target2, '(' + Math.round(fs.statSync(target2).size / 1024) + ' KB)');
