# Vidhya Tutorials - Backend Schema Overview

This document outlines the core MongoDB collections and schemas used by the backend. The backend is built using Express and Mongoose.

## Core Models

### User (`User.ts`)
Manages authentication, profiles, gamification, and relationships across roles (`STUDENT`, `TEACHER`, `ADMIN`, `PARENT`).
- `userId`: String (Format: STU-2024-0031)
- `role`: Enum (STUDENT, TEACHER, ADMIN, PARENT)
- `name`, `email`, `passwordHash`, `schoolCode`
- Gamification fields: `xp`, `level`, `badges`, `currentStreak`
- Relational fields: `sectionId`, `batchId`, `studentIds` (for parent linking)

### Batch (`Batch.ts`)
Represents a group of students taught by specific teachers, following a schedule.
- `name`: String (e.g. "Science Morning A")
- `sectionId`: ObjectId (Ref: Section)
- `teacherIds`, `studentIds`: Arrays of ObjectIds (Ref: User)
- `schedule`: Array containing `day`, `startTime`, `endTime`, `subjectId`
- `academicYear`: String
- `maxCapacity`, `isActive`

### FeeRecord (`FeeRecord.ts`)
Tracks fee installments, payments, and dues for students.
- `studentId`: ObjectId (Ref: User)
- `batchId`: ObjectId (Ref: Batch)
- `amount`: Number (Stored in paise)
- `dueDate`: Date
- `status`: Enum (PENDING, PAID, OVERDUE, CANCELLED)
- `paymentId`, `orderId`, `receiptNumber`: Strings (for Razorpay Integration)

### CourseMaterial (`CourseMaterial.ts`)
Manages educational materials uploaded by teachers for courses and chapters.
- `courseId`, `chapterId`, `lessonId`: ObjectIds
- `teacherId`: ObjectId (Ref: User)
- `type`: Enum (PDF, VIDEO_LINK, IMAGE, TEXT)
- `contentUrl`: String (S3, Drive, or YouTube URL)
- `visibility`: Enum (CLASS, ALL)
- `isViewOnly`: Boolean (For PDF download blocking)

### Other Identified Models (server/models/)
- **Appointment.ts**: Counseling or teacher-parent appointments.
- **AttendanceRecord.ts**: Daily or class-wise attendance.
- **AuditLog.ts**: System activity logging.
- **Notification.ts / PublicAnnouncement.ts**: Alerts and broadcasts.
- **Section.ts / Session.ts**: Academic groupings and temporal sessions.
- **StudentTodo.ts / SubjectProgress.ts**: Task tracking and gamified progression.
- **VideoWatchRecord.ts / XPTransaction.ts**: Activity tracking for XP distribution.

## Relationships Summary
- A **User** (Student) belongs to a **Batch** and **Section**.
- A **User** (Teacher) can be assigned to multiple **Batches**.
- **Parents** are linked to multiple `studentIds`.
- **FeeRecords** link back to `studentId` and `batchId`.
- **CourseMaterials** are uploaded by a `teacherId` and relate to specific `courseId` / `lessonId`.

## Frontend Integration Note
Currently, the UI dashboard components are built out with placeholders and active buttons triggering "Feature coming soon!" alerts. These interfaces are designed to map directly to the above schemas once the REST APIs are fully hooked up to the frontend state.
