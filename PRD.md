# Product Requirements Document (PRD): Vidhya Tutorials

## 1. Product Overview
**Product Name:** Vidhya Tutorials
**Description:** A comprehensive educational institution management platform designed to streamline administration, teaching, and learning. It features a public-facing website for marketing and admissions, alongside role-based, secure portals for Students, Teachers, Admins, and Parents.
**Objective:** Digitize institute operations, provide students with online course material access, simplify fee management for administrators, and give teachers robust tools for attendance and material distribution.

## 2. Target Audience & User Roles
1. **Student:** Enrolled users accessing course materials, viewing schedules, tracking their progress, and paying fees.
2. **Teacher:** Educators managing attendance, uploading study materials (PDFs, videos), and tracking student progress.
3. **Admin:** Institute administrators managing users, batches/curriculum, financials/ledgers, and global announcements.
4. **Parent (Optional/Linked):** Can monitor student performance, attendance, and fee statuses.

## 3. Scope of Work & Features

### 3.1 Public-Facing Site (Marketing & Info)
- **Landing Page (`/`):** Highlights institution achievements, core values, and features.
- **Admissions (`/admissions`):** Information on enrollment processes and forms.
- **About Us (`/about`):** History, mission, and student Testimonials.
- **Life at Vidhya (`/life`):** Showcases extracurriculars, events, and culture (Note: Testimonials moved to About Us).
- **Our Courses (`/courses`):** Public catalog of offered subjects and programs.
- **Locations (`/our-locations`):** Branch details, contact info, and maps.

### 3.2 Authentication & Security
- **Login/Register (`/login`):** Unified login interface distinguishing roles based on credentials.
- **Role-Based Access Control (RBAC):** Users are redirected to specific portals based on their assigned role (`STUDENT`, `TEACHER`, `ADMIN`).
- **Security Features:** JWT-based auth, password hashing (bcrypt), account lockouts after failed attempts, and route-level protection (`ProtectedRoute` wrapper).

### 3.3 Student Portal (`/student/*`)
- **Dashboard:** Overview of upcoming classes, pending fees, and recent announcements.
- **Course Viewer:** Interface to view videos and read PDFs/materials uploaded by teachers for their assigned batches.
- **Fee Ledger:** Detailed breakdown of paid and pending installments, with integration possibilities for payment gateways (e.g., Razorpay).
- **Gamification (XP & Badges):** Students earn XP for activities (e.g., watching videos, completing tasks), building streaks and leveling up.
- **Settings:** Profile management and preferences.

### 3.4 Teacher Portal (`/teacher/*`)
- **Dashboard:** Snapshot of assigned batches, upcoming schedules, and tasks.
- **Attendance Management:** Interface to mark and review daily/session-level student attendance.
- **Material Uploader:** Secure upload system for sharing PDFs, links, or videos. Teachers can specify visibility (`CLASS` vs `ALL`) and set properties like `isViewOnly` for PDFs.
- **Settings:** Profile management.

### 3.5 Admin Portal (`/admin/*`)
- **Dashboard (Overview):** High-level metrics on active students, total revenue, and system health.
- **User Management:** Create, edit, and deactivate users (Students, Teachers, Parents). Handles role assignment and school codes.
- **Batch & Curriculum Management:** Define sections, create batches, map students/teachers to batches, and manage weekly schedules.
- **Financials (Global Ledger):** Monitor overall fee collection, track overdue payments, and manage fee structures.
- **Announcements:** Broadcast notifications or public announcements to specific batches or the entire institute.
- **Settings:** Profile settings.

## 4. Technical Specifications

### 4.1 Tech Stack
- **Frontend:** React 19, TypeScript, Vite, TailwindCSS v4, React Router v7.
- **Animations & Scrolling:** Framer Motion (UI micro-interactions), GSAP (Scroll triggers), and Lenis (Smooth physical momentum scrolling).
- **Core UI Features:** Global animated Splash/Loading Screen on initial hydration. All dashboard interactive elements are fully wired.
- **Backend:** Node.js, Express.js, TypeScript.
- **Database:** MongoDB (via Mongoose).
- **Security/Middleware:** Helmet, CORS, Express Rate Limit, Mongo Sanitize, JWT, Bcrypt.
- **Other Integrations:** Nodemailer (Email), Twilio (SMS), Razorpay (Payments/Ledger).

### 4.2 Data Models (Key Entities)
- **User:** Stores profile, authentication details, role, and gamification stats.
- **Batch:** Defines a class group, assigned teachers, students, and schedule.
- **CourseMaterial:** Connects uploaded resources (PDF, Video) to courses/lessons.
- **FeeRecord:** Tracks installment dues, amounts, payment status, and metadata.
- *(Additional modules include AttendanceRecord, AuditLog, Notification, etc.)*

## 5. Non-Functional Requirements
- **Responsive Design:** Portals must be fully functional on mobile and desktop.
- **Performance:** Fast loading times for videos and PDFs (optimized assets).
- **Scalability:** Able to handle concurrent connections for attendance and material downloads, particularly during exam seasons.
- **Data Privacy:** View-only permissions for proprietary PDFs; strict RBAC preventing students from seeing peers' financial/attendance data.
