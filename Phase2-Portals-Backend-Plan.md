# Vidhya Tutorials — Phase 2: Portals, Auth & Backend Migration
**Scope:** Student/Teacher/Admin portals, authentication, full backend migration off Express into Next.js, new Postgres data layer, file storage, payments, notifications. Builds directly on the Phase 1 Next.js project and design system — no new design tokens introduced here, this phase consumes what Phase 1 established.

---

## 1. Objective

Retire the Express/Node backend entirely and move all business logic (auth, RBAC, attendance, fee ledger, material upload, batch/curriculum management) into Next.js Route Handlers and Server Actions, on a single Vercel deployment. Replace MongoDB/Mongoose with Postgres (via Supabase) + Prisma. Replace hand-rolled JWT/bcrypt auth with Clerk. Remove the gamification system entirely. Replace Twilio SMS with Resend email-only notifications.

No live production data exists today — this is a fresh start on the new database, not a migration/ETL job. Prisma `migrate` sets up the schema from scratch.

---

## 2. Tech Stack

| Layer | Old | New |
|---|---|---|
| Framework | React 19 + Vite (SPA) + Express backend | Next.js 15 (App Router), full-stack |
| Auth | Custom JWT + bcrypt + lockout logic | Clerk (free tier) |
| Database | MongoDB Atlas + Mongoose | Postgres via Supabase (free tier) + Prisma |
| File storage | (implied local/S3-ish via `contentUrl` strings) | Supabase Storage |
| Payments | Razorpay | Razorpay (unchanged, ported to Next.js API routes + webhook handler) |
| Email | Nodemailer | Resend |
| SMS | Twilio | **Removed** — email-only |
| Scheduled jobs | (assumed Node cron/interval) | Vercel Cron (Vercel Cron Jobs, free tier includes daily cron) |
| Security middleware | Helmet, express-rate-limit, mongo-sanitize | Next.js middleware for route protection; rate limiting via Vercel/Upstash if needed; Prisma parameterizes queries by default so injection-class sanitization is largely moot |

---

## 3. Authentication & RBAC (Clerk)

### 3.1 Approach
- Clerk handles all credential storage, session management, password reset, and login UI primitives. This replaces `passwordHash`, bcrypt, and account-lockout logic wholesale.
- **Role storage:** store role (`STUDENT` / `TEACHER` / `ADMIN` / `PARENT`) in Clerk's `publicMetadata` at account creation, AND mirror it in your own Postgres `User` table (see schema below). Postgres remains the source of truth for anything relational (batch assignments, fee links, etc.); Clerk metadata is what your Next.js middleware reads cheaply on every request without a DB round-trip.
- **Sync mechanism:** Clerk webhooks (`user.created`, `user.updated`, `user.deleted`) → a Next.js Route Handler (`/api/webhooks/clerk`) → upsert into Postgres `User` row. This keeps Clerk and your DB consistent without manual double-writes scattered through the app.

### 3.2 Route Protection
- `middleware.ts` at the project root using Clerk's `authMiddleware`/`clerkMiddleware` — define public routes (everything from Phase 1) vs protected routes (`/student/*`, `/teacher/*`, `/admin/*`), and enforce role match by reading `publicMetadata.role` before allowing access to a given portal's route group.
- Route groups: `app/(public)/`, `app/student/`, `app/teacher/`, `app/admin/` — each portal a distinct segment with its own layout that also double-checks role server-side (defense in depth beyond middleware).

### 3.3 Your Existing 3-Way Login Screen
Your current `/login` UI (Student/Teacher/Admin tab selector, ID + password fields) is a nice piece of UX worth keeping visually — but functionally it becomes a thin wrapper: the tab just pre-selects which Clerk sign-in flow/redirect-after-login path to use, since Clerk itself handles credential verification. Custom `userId`-style login (e.g. `STU-2024-0031` as a "username") is supported via Clerk's custom sign-in flows if you want to keep ID-based login rather than email — flag this as a decision point during implementation (Clerk supports username-based auth alongside/instead of email).

### 3.4 Parent Role
Kept as originally scoped — linked via `studentIds` array, read-only access to their linked students' attendance/fees/progress. No changes to this relationship model, just re-expressed as a Prisma relation instead of a Mongoose array of ObjectIds.

---

## 4. Database Schema (Prisma / Postgres)

Direct translation of your existing Mongoose models, with gamification fields/models removed entirely (`xp`, `level`, `badges`, `currentStreak` on User; `VideoWatchRecord`, `XPTransaction`, `StudentTodo`/`SubjectProgress` gamified aspects dropped — `StudentTodo` can stay if it's just task tracking, not XP-tied).

```prisma
enum Role {
  STUDENT
  TEACHER
  ADMIN
  PARENT
}

enum MaterialType {
  PDF
  VIDEO_LINK
  IMAGE
  TEXT
}

enum Visibility {
  CLASS
  ALL
}

enum FeeStatus {
  PENDING
  PAID
  OVERDUE
  CANCELLED
}

model User {
  id            String   @id @default(cuid())
  clerkId       String   @unique          // links to Clerk account
  userId        String   @unique          // display ID, e.g. STU-2024-0031
  role          Role
  name          String
  email         String   @unique
  schoolCode    String?
  profileImageUrl String?                 // Supabase Storage URL

  sectionId     String?
  section       Section?  @relation(fields: [sectionId], references: [id])

  batches       Batch[]   @relation("BatchStudents")
  taughtBatches Batch[]   @relation("BatchTeachers")

  studentIds    String[]                  // for PARENT role — linked student User.ids
  feeRecords    FeeRecord[]
  materials     CourseMaterial[]          // materials this user (teacher) uploaded
  attendance    AttendanceRecord[]
  notifications Notification[]

  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model Section {
  id       String  @id @default(cuid())
  name     String
  users    User[]
  batches  Batch[]
}

model Batch {
  id            String   @id @default(cuid())
  name          String                     // e.g. "Science Morning A"
  sectionId     String
  section       Section  @relation(fields: [sectionId], references: [id])
  students      User[]   @relation("BatchStudents")
  teachers      User[]   @relation("BatchTeachers")
  schedule      Json                        // [{ day, startTime, endTime, subjectId }]
  academicYear  String
  maxCapacity   Int
  isActive      Boolean  @default(true)

  feeRecords    FeeRecord[]
  materials     CourseMaterial[]
  attendance    AttendanceRecord[]
}

model FeeRecord {
  id             String    @id @default(cuid())
  studentId      String
  student        User      @relation(fields: [studentId], references: [id])
  batchId        String
  batch          Batch     @relation(fields: [batchId], references: [id])
  amountPaise    Int
  dueDate        DateTime
  status         FeeStatus @default(PENDING)
  razorpayPaymentId String?
  razorpayOrderId   String?
  receiptNumber  String?
  receiptFileUrl String?                     // Supabase Storage URL for the receipt PDF
  createdAt      DateTime  @default(now())
}

model CourseMaterial {
  id           String       @id @default(cuid())
  courseId     String?
  chapterId    String?
  lessonId     String?
  teacherId    String
  teacher      User         @relation(fields: [teacherId], references: [id])
  batchId      String?
  batch        Batch?       @relation(fields: [batchId], references: [id])
  type         MaterialType
  contentUrl   String                        // Supabase Storage URL or YouTube link
  visibility   Visibility   @default(CLASS)
  isViewOnly   Boolean      @default(false)
  createdAt    DateTime     @default(now())
}

model AttendanceRecord {
  id        String   @id @default(cuid())
  studentId String
  student   User     @relation(fields: [studentId], references: [id])
  batchId   String
  batch     Batch    @relation(fields: [batchId], references: [id])
  date      DateTime
  present   Boolean
  markedBy  String                           // teacher User.id
  createdAt DateTime @default(now())
}

model Notification {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  title     String
  body      String
  read      Boolean  @default(false)
  createdAt DateTime @default(now())
}

model PublicAnnouncement {
  id        String   @id @default(cuid())
  title     String
  body      String
  audience  String                            // "ALL" or a batchId
  createdAt DateTime @default(now())
}

model AuditLog {
  id        String   @id @default(cuid())
  actorId   String
  action    String
  metadata  Json?
  createdAt DateTime @default(now())
}
```

Notes:
- `Json` fields (like `Batch.schedule`) map cleanly onto Postgres's native `jsonb` — you don't lose Mongo's schema flexibility where you actually want it.
- `Appointment`, `Session` models from your original schema can be added the same pattern if/when you scope that feature for Phase 2 — omitted above for brevity since they weren't detailed in your original doc.
- All money fields stay in paise (integers), consistent with your original design — avoids floating-point currency bugs regardless of DB choice.

---

## 5. File Storage (Supabase Storage)

- Two buckets: `profile-pictures` (public read, since these are just avatars) and `fee-receipts` (private, signed-URL access only).
- Upload flow: client → Next.js Route Handler → Supabase Storage (server-side upload using the service role key, never exposed to the browser) → store the returned URL on the relevant Prisma record (`User.profileImageUrl`, `FeeRecord.receiptFileUrl`, `CourseMaterial.contentUrl` for PDF-type materials).
- Fee receipts and any `isViewOnly` PDFs: serve via short-lived signed URLs generated on request, not permanent public links — preserves the "view-only, no download" intent from your original PRD.

---

## 6. Sitemap (Phase 2 additions)

```
/login                       Clerk-backed login (STUDENT/TEACHER/ADMIN tab UI retained)

/student/dashboard           Overview — upcoming classes, pending fees, announcements (NO gamification widgets)
/student/courses             Course viewer (materials by batch)
/student/fees                Fee ledger, Razorpay payment flow
/student/settings            Profile

/teacher/dashboard           Assigned batches, upcoming schedule, tasks
/teacher/attendance          Mark/review attendance
/teacher/materials/upload    Material uploader (PDF/video/link, visibility + view-only controls)
/teacher/settings            Profile

/admin/dashboard             Metrics — active students, revenue, system health
/admin/users                 User management (students/teachers/parents, role assignment)
/admin/curriculum            Batch & section management, schedules
/admin/financials             Global fee ledger, overdue tracking, fee structures
/admin/announcements         Broadcast to batches or institute-wide
/admin/settings              Profile
```

Removed from original sitemap: any gamification-specific settings/views (none were explicitly routed in your original sitemap, so no route deletions needed — just the dashboard widgets and underlying models).

---

## 7. Payments (Razorpay)

- Order creation: Next.js Route Handler (`/api/fees/create-order`) — server-side only, using Razorpay's Node SDK with secret key in environment variables (never client-exposed).
- Payment verification: Razorpay webhook → `/api/webhooks/razorpay` Route Handler → verify signature → update `FeeRecord.status` to `PAID`, store `razorpayPaymentId`/`razorpayOrderId`, generate receipt (PDF, stored to `fee-receipts` bucket, URL saved to `receiptFileUrl`).
- Client-side: Razorpay Checkout.js triggered from `/student/fees`, standard flow — this part barely changes from a typical Razorpay integration regardless of frontend framework.

---

## 8. Notifications (Resend, email-only)

- Replace Nodemailer + Twilio entirely with Resend's API (generous free tier: 3,000 emails/month, 100/day — comfortably covers 100–200 students' worth of fee reminders and announcements).
- Trigger points:
  - Fee due/overdue reminders (scheduled, see Cron below)
  - New announcement broadcast (immediate, on admin publish)
  - Attendance alert to parent (optional, if parent role reads this as high-signal — flag as a v2 nice-to-have if it adds noise)
- Templates: build with React Email (pairs natively with Resend + Next.js) for maintainable, on-brand HTML emails matching the new navy/blue design system.

---

## 9. Scheduled Jobs (Vercel Cron)

Serverless functions can't run long-lived background processes the way your old Express server could. Replace with Vercel Cron Jobs (`vercel.json` cron config, free tier supports daily-granularity crons):

- Daily job: scan `FeeRecord` for `dueDate` approaching/passed → flip `PENDING` → `OVERDUE` where applicable → trigger Resend reminder emails.
- (Streak/XP reset jobs are removed entirely along with gamification — one less thing to maintain.)

---

## 10. Non-Functional Requirements (carried forward, re-scoped for new stack)

- **Responsive:** unchanged requirement — all portals fully functional on mobile and desktop, now via Tailwind's responsive utilities consistent with the Phase 1 design system.
- **Performance:** Next.js Server Components reduce client JS for data-heavy dashboard views; Supabase Storage + `next/image` handle asset delivery.
- **Scalability:** non-issue at 100–200 students on Vercel's serverless model + Supabase's free tier connection limits — no action needed beyond using Prisma's connection pooling (`pgbouncer` mode, which Supabase provides) to stay within serverless connection limits.
- **Data privacy:** RBAC enforced at both middleware and query level (never trust the client-selected role — always re-derive from the authenticated Clerk session server-side); `isViewOnly` PDFs served via signed URLs only, never public links; students cannot query other students' `FeeRecord`/`AttendanceRecord` rows — enforce via server-side query scoping (`where: { studentId: session.userId }`), not client-side hiding.

---

## 11. Explicitly Removed From Original Scope

- All gamification: `xp`, `level`, `badges`, `currentStreak` on `User`; `XPTransaction`, `VideoWatchRecord` models; any XP-bar/badge/streak UI on dashboards.
- Twilio/SMS notifications.
- MongoDB/Mongoose as the data layer.
- Standalone Express server/deployment.

## 12. Carried Forward Unchanged

- The 4-role model (Student/Teacher/Admin/Parent) and its relationships.
- Razorpay as the payment provider.
- The 3-way tabbed login UI pattern (Student/Teacher/Admin), visually restyled per Phase 1's design system.
- View-only PDF restriction for proprietary materials.
