# Vidhya Tutorials Sitemap

The application uses React Router to manage navigation across public pages and authenticated portal areas.

## Public Routes (`/`)
Wrapped in `LayoutPublic` with the standard Loyalist Design and the global `SmoothScroll` provider (Lenis physics).
- **`/`** - Landing Page (Home)
- **`/admissions`** - Admissions Page
- **`/about`** - About Page
- **`/life`** - Life At Vidhya Page
- **`/courses`** - Our Courses Page
- **`/our-locations`** - Our Locations Page

## Authentication Route (`/login`)
- **`/login`** - Login & Registration Page (Standalone layout)

## Authenticated Portals (Protected Routes)
Wrapped in `DashboardLayout` for authenticated users.

### Student Portal (`/student/*`)
Access restricted to `STUDENT` role.
- **`/student/dashboard`** - Student Overview Dashboard
- **`/student/courses`** - Course Viewer
- **`/student/fees`** - Fee Ledger (Pending/Paid Fees)
- **`/student/settings`** - Profile Settings

### Teacher Portal (`/teacher/*`)
Access restricted to `TEACHER` role.
- **`/teacher/dashboard`** - Teacher Overview Dashboard
- **`/teacher/attendance`** - Teacher Attendance Management
- **`/teacher/materials/upload`** - Material Uploader
- **`/teacher/settings`** - Profile Settings

### Admin Portal (`/admin/*`)
Access restricted to `ADMIN` role.
- **`/admin/dashboard`** - Admin Overview Dashboard
- **`/admin/users`** - User Management (Students, Teachers, Parents)
- **`/admin/curriculum`** - Batch & Curriculum Management
- **`/admin/financials`** - Global Ledger for Fees & Payments
- **`/admin/announcements`** - Manage Announcements
- **`/admin/settings`** - Profile Settings
