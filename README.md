# 🎓 Vidhya Tutorials — Official Web Platform

> A modern, high-performance web platform and digital portal for **Vidhya Tutorials**, Mumbai's premier coaching institute for Science, Commerce, and Competitive Examinations (JEE / NEET / MHT-CET).

---

## 🌟 Key Features

- **🏛️ High-Impact Public Portal**
  - **Dynamic Hero & 3D Interactive Elements**: Built with Lenis smooth scrolling and fluid physics.
  - **Course Discovery & Wing Explorer**: Detailed roadmaps for Secondary, Higher Secondary, and Competitive Entrance wings.
  - **Branch Locator**: Interactive guide to Vidhya Tutorials physical centers across Mumbai (Kandivali, Borivali, Malad, etc.).
  - **Achievers & Toppers Wall**: Dynamic display of state ranks, percentile boards, and student testimonials.
  - **Campus Life & Virtual Tour**: Gallery showcasing state-of-the-art classrooms, libraries, and science labs.
  - **Live Notice Board**: Real-time ticker and announcements for exam schedules and batch dates.

- **📝 Admissions & Inquiries**
  - Instant online admission application form with step-by-step validation.
  - Free counseling session and demo class booking modals.
  - WhatsApp and call direct integration with center counselors.

- **🛡️ Security & Enterprise Architecture**
  - Integrated with Supabase for cloud persistence and storage.
  - Rate limiting, cookie signing, Helmet HTTP headers, and strict authentication middleware.
  - Type-safe development with TypeScript and Zod schema validation.

---

## 🛠️ Technology Stack

| Domain | Technologies |
| :--- | :--- |
| **Frontend Framework** | React 19, TypeScript, Vite 6 |
| **Styling & Design System** | Tailwind CSS v4, Vanilla CSS Custom Variables |
| **Animations & Motion** | Motion (`motion/react`), GSAP, `@gsap/react`, Lenis |
| **Icons & Media** | Lucide React, Optimized WebP / AVIF assets |
| **State & Forms** | React Hook Form, Zod validation |
| **Backend & APIs** | Node.js, Express, Tsx |
| **Database & Auth** | Supabase, MongoDB / Mongoose |
| **Communications** | Nodemailer (Email), Twilio (WhatsApp notifications) |

---

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### 2. Installation
Clone the repository and install project dependencies:

```bash
git clone https://github.com/saneeedotin/VIdhyaTutorials.git
cd "Vidhya Turorails mark 1"
npm install
```

### 3. Environment Configuration
Create a `.env` or `.env.local` file by copying the template:

```bash
cp .env.example .env
```

Fill in your configuration keys:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4. Running Locally

Start the Vite development server:
```bash
npm run dev
```
The application will be available at `http://localhost:3000`.

To run the backend service (optional):
```bash
npm run server
```

---

## 📦 Production Build & Quality Checks

Run the TypeScript type check:
```bash
npm run lint
```

Build the optimized production bundle:
```bash
npm run build
```

Preview the production build locally:
```bash
npm run preview
```

---

## 📁 Project Structure

```text
├── public/                 # Static assets (favicons, logos, topper pictures)
├── src/
│   ├── api/                # API client and networking utilities
│   ├── components/
│   │   ├── auth/           # Login, Register, ProtectedRoute
│   │   ├── landing/        # Public pages (Courses, Achievers, Gallery, etc.)
│   │   └── ui/             # Reusable UI primitives (Modals, Buttons, Loaders)
│   ├── context/            # React Context providers (Auth, Section)
│   ├── lib/                # Third-party service clients (Supabase)
│   ├── utils/              # Security and form helpers
│   ├── App.tsx             # Root application router & layout controller
│   ├── index.css           # Global typography, color tokens, and utility classes
│   └── main.tsx            # React application entry point
├── server/                 # Express backend API server (Optional microservice)
├── supabase/               # Supabase schema definitions and edge functions
├── .env.example            # Environment variable template
├── tsconfig.json           # TypeScript compiler configuration
└── vite.config.ts          # Vite build, aliases, and rollup chunk configuration
```

---

## 🔒 License

Private & Proprietary — Vidhya Tutorials. All rights reserved.
