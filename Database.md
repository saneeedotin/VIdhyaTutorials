# Vidhya Tutorials - Comprehensive Database Architecture

This document defines the complete normalized PostgreSQL database schema for the Vidhya Tutorials portal, currently hosted on **Supabase**. It extends the core engine to support all new modules: Fees Management, Content Moderation, Announcements, and Audit Logging. It utilizes Supabase Auth for authentication and Row Level Security (RLS) for data protection.

---

## 1. Core Authentication & Profiles

### `Users` (public.users)
Core application table synced with Supabase `auth.users` via database triggers.
| Attribute | Data Type & Constraints | Description |
| :--- | :--- | :--- |
| `id` | UUID, Primary Key | Unique identifier for all accounts. Matches `auth.users.id`. |
| `name` | String, Not Null | Full name of the user. |
| `email` | String, Unique, Not Null | Login credential. |
| `role` | Enum `(ADMIN, TEACHER, STUDENT)`| Application-level permissions. |
| `active` | Boolean, Default: true | Determines if the account is currently enabled. |
| `created_at` | Timestamp | Account creation date. |

*Note: Passwords are managed securely by Supabase Auth and are not stored in the `public.users` table.*

### `Student_Profile`
Extends `Users` for students.
| Attribute | Data Type & Constraints | Description |
| :--- | :--- | :--- |
| `id` | UUID, Primary Key | Unique identifier for the student. |
| `user_id` | UUID, Foreign Key | Links to `Users.id`. |
| `standard_id` | UUID, Foreign Key | Links to `Standard.id`. |
| `roll_number` | Integer | Student's registration/roll number. |
| `enrollment_date` | Date | When the student joined the standard. |

### `Teacher_Profile`
Extends `Users` for teachers.
| Attribute | Data Type & Constraints | Description |
| :--- | :--- | :--- |
| `id` | UUID, Primary Key | Unique identifier for the teacher. |
| `user_id` | UUID, Foreign Key | Links to `Users.id`. |
| `employee_id` | String, Unique | Internal staff identification. |

---

## 2. Academics & Curriculum

### `Standard`
Represents a grade, class level, or section (e.g., "10th Standard").
| Attribute | Data Type & Constraints | Description |
| :--- | :--- | :--- |
| `id` | UUID, Primary Key | Unique identifier. |
| `name` | String, Unique | The name of the standard. |

### `Subject` (or Batch)
A specific subject taught to a specific standard by a specific teacher.
| Attribute | Data Type & Constraints | Description |
| :--- | :--- | :--- |
| `id` | UUID, Primary Key | Unique class instance identifier. |
| `name` | String | e.g., "Science", "Mathematics". |
| `standard_id` | UUID, Foreign Key | Links to `Standard.id`. |
| `teacher_id` | UUID, Foreign Key | Links to `Teacher_Profile.id`. |

### `Student_Subject` (Junction Table)
Manages manual enrollment of students into specific subjects.
| Attribute | Data Type & Constraints | Description |
| :--- | :--- | :--- |
| `id` | UUID, Primary Key | Junction table identifier. |
| `student_id` | UUID, Foreign Key | Links to `Student_Profile.id`. |
| `subject_id` | UUID, Foreign Key | Links to `Subject.id`. |

---

## 3. Operations & Tracking

### `Attendance_Record`
Daily attendance tracking.
| Attribute | Data Type & Constraints | Description |
| :--- | :--- | :--- |
| `id` | UUID, Primary Key | Unique transaction identifier. |
| `student_id` | UUID, Foreign Key | Links to `Student_Profile.id`. |
| `subject_id` | UUID, Foreign Key | Links to `Subject.id`. |
| `date` | Date, Not Null | The specific day of the class. |
| `status` | Enum `(PRESENT, ABSENT, EXCUSED)`| The attendance state. |
| `recorded_by` | UUID, Foreign Key | Links to `Users.id` (Teacher or Admin). |

### `Teacher_Proxy`
Temporary access for substitute teachers.
| Attribute | Data Type & Constraints | Description |
| :--- | :--- | :--- |
| `id` | UUID, Primary Key | Unique identifier. |
| `grantor_id` | UUID, Foreign Key | Links to `Teacher_Profile.id` (Original). |
| `proxy_id` | UUID, Foreign Key | Links to `Teacher_Profile.id` (Substitute). |
| `subject_id` | UUID, Foreign Key | Links to `Subject.id`. |
| `expires_at` | Timestamp, Not Null | Auto-revocation time. |

---

## 4. Financial & Assets

### `Fees_Ledger`
Global ledger to track student fee statuses, managed entirely by the admin (no payment gateway).
| Attribute | Data Type & Constraints | Description |
| :--- | :--- | :--- |
| `id` | UUID, Primary Key | Unique ledger entry. |
| `student_id` | UUID, Foreign Key | Links to `Student_Profile.id`. |
| `status` | Enum `(PAID, PARTIALLY_PAID, PENDING)` | The payment status of the fee. |
| `amount_due` | Decimal | Total amount the student owes. |
| `amount_paid` | Decimal | Amount paid so far. |
| `due_date` | Date | When the fee is due. |
| `receipt_url` | String (Nullable) | Cloud storage link to manually uploaded PDF receipt. |
| `updated_by` | UUID, Foreign Key | Links to `Users.id` (Admin). |

### `Materials`
Study materials and lecture videos uploaded by teachers.
| Attribute | Data Type & Constraints | Description |
| :--- | :--- | :--- |
| `id` | UUID, Primary Key | Unique material identifier. |
| `title` | String | Title of the resource. |
| `type` | Enum `(DOCUMENT, VIDEO)` | Resource type. |
| `url` | String | Cloud storage or video URL. |
| `subject_id` | UUID, Foreign Key | Links to `Subject.id`. |
| `teacher_id` | UUID, Foreign Key | Links to `Teacher_Profile.id`. |
| `status` | Enum `(PUBLISHED, FLAGGED)` | Admin moderation status. |
| `created_at` | Timestamp | Upload timestamp. |

---

## 5. Communications & Support

### `Announcements`
Public and private broadcasts shown on dashboards and landing page.
| Attribute | Data Type & Constraints | Description |
| :--- | :--- | :--- |
| `id` | UUID, Primary Key | Unique identifier. |
| `type` | Enum `(NEWS, EVENT)` | Type of announcement. |
| `title` | String, Not Null | Headline. |
| `date` | Date, Not Null | Display date. |
| `time` | String (Nullable) | Event time block. |
| `img_url` | String (Nullable) | Cover image URL. |
| `tags` | Array<String> | Display tags (e.g., "Academic"). |
| `is_active` | Boolean | Whether to show the broadcast publicly. |

### `Support_Tickets`
Queries raised by users for the admin to resolve.
| Attribute | Data Type & Constraints | Description |
| :--- | :--- | :--- |
| `id` | UUID, Primary Key | Unique identifier. |
| `user_id` | UUID, Foreign Key | Links to `Users.id` (who raised it). |
| `subject` | String | Brief title. |
| `description` | Text | Detailed issue description. |
| `status` | Enum `(OPEN, IN_PROGRESS, RESOLVED)` | Ticket state. |
| `created_at` | Timestamp | Date raised. |

### `Audit_Logs`
Immutable security and action tracking.
| Attribute | Data Type & Constraints | Description |
| :--- | :--- | :--- |
| `id` | UUID, Primary Key | Log identifier. |
| `user_id` | UUID, Foreign Key | Who performed the action. |
| `action` | String | Identifier (e.g. `FEE_OVERRIDE`, `USER_DELETED`). |
| `details` | Text | Human-readable explanation of the change. |
| `severity` | Enum `(LOW, MEDIUM, HIGH)` | Risk level of the action. |
| `ip_address` | String | Network source. |
| `timestamp` | Timestamp | When the action occurred. |

---

## 6. Security & Policies (Row Level Security)
The platform heavily leverages PostgreSQL Row Level Security (RLS) policies to secure data on Supabase:
- **Authentication**: Users must be logged in to query data.
- **Admin Supremacy**: Admins have `ALL` permissions across almost every table (Users, Fees, Tickets, etc.).
- **Self-Service**: Students can only view their own records (e.g. `user_id = auth.uid()`).
- **Teacher Isolation**: Teachers can only manage attendance and materials for their assigned classes.

## 7. Storage (Supabase Buckets)
- `receipts`: Stores PDF/Image receipts for fee payments uploaded by Admins.
- `materials`: Stores document/video materials uploaded by Teachers for Students.
