# Vidhya Tutorials - Design Assets & UI Overview

This document outlines the core design components and screens of the Vidhya Tutorials application.

## Brand Assets
The application uses the primary logo for branding across the public and portal areas.
- **Logo:** `public/logo.png`, `public/logo2.png`, and `public/logo.svg` (used in the animated splash Loading Screen).

## Animation & Scrolling Engine
- **Scroll Physics:** Lenis is used globally to provide buttery-smooth, momentum-based scrolling.
- **Scroll Orchestration:** GSAP (`@gsap/react`) is integrated for high-performance scroll-triggered animations.
- **Micro-interactions:** Framer Motion handles route transitions, the Loading Screen fade, and `FadeInWhenVisible` reveals.

## Screenshots & UI Flow

### Public Facing Site
The landing page and public routes provide information about the institution.
*Screenshot Example:*
![Homepage Screenshot](./other%20assets/Screenshot%202026-06-08%20085650.png)

### Dashboard Portals
The application includes customized dashboards for different roles:

**Student Portal**
![Student Dashboard](./other%20assets/Screenshot%202026-06-08%20085805.png)

**Teacher Portal**
![Teacher Portal](./other%20assets/Screenshot%202026-06-08%20085900.png)

**Admin Dashboard**
![Admin Dashboard](./other%20assets/Screenshot%202026-06-08%20085942.png)

### Additional Screens
- **Login/Registration:** `LoginRegisterPage` with a standalone dark theme layout.
- **Course Viewer:** Used by students to view course materials.
![Course Viewer](./other%20assets/Screenshot%202026-06-08%20090024.png)
- **Fee Ledger:** Overview of pending and paid fees.
![Fee Ledger](./other%20assets/Screenshot%202026-06-08%20090107.png)
- **User Management (Admin):** Used by admin to manage students, parents, and teachers.
![User Management](./other%20assets/Screenshot%202026-06-08%20090201.png)
- **Material Uploader (Teacher):** Used by teachers to upload materials.
![Material Uploader](./other%20assets/Screenshot%202026-06-08%20090238.png)
