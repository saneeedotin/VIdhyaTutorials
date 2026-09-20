# Vidhya Tutorials — Phase 1: Public Site Rebuild
**Scope:** Marketing/public-facing site only. No auth, no portals, no database writes. Goal is to ship the new visual identity fast on a stack that's ready to absorb Phase 2.

---

## 1. Objective

Rebuild the public-facing site (`/`, `/admissions`, `/about`, `/life`, `/courses`, `/our-locations`) on Next.js with a new minimal white + blue design system, replacing the current dark indigo/glassmorphic theme. This phase is purely presentational — no backend logic changes, no auth, no data model changes. It exists to (a) get the new brand live quickly, and (b) stand up the Next.js project skeleton that Phase 2 builds on.

Out of scope for this phase: `/login`, anything under `/student`, `/teacher`, `/admin`, Clerk integration, Prisma/database setup, Razorpay, Resend. Those are all Phase 2.

---

## 2. Tech Stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js 15 (App Router) | `app/` directory, React Server Components by default |
| Language | TypeScript | strict mode |
| Styling | Tailwind CSS v4 | CSS variables for the design tokens below, no separate CSS-in-JS |
| Animation | Framer Motion | scroll reveals, hero entrance, hover states — keep it subtle, this is a minimal site now, not a heavy-motion one |
| Fonts | `next/font` — Instrument Serif (display) + Geist (body) | self-hosted via next/font, zero layout shift |
| Images | `next/image` | all campus/hero imagery optimized automatically |
| Hosting | Vercel (free/hobby tier) | zero-config for Next.js, generous free tier for this traffic level |
| Deployment | Git-based, auto-deploy on push to `main` | preview deployments per PR/branch |

No backend, no database, no auth packages installed in this phase. Keep the public site a static/SSG-leaning app — most pages here don't need to be dynamic (`generateStaticParams` / static rendering where possible for speed).

---

## 3. Design System

### 3.1 Color Palette

Direction: 70% deep-navy-on-white (institutional, trustworthy, Coursera-adjacent) + 30% clinical crispness (Stripe/Linear-style precision in the interactive elements).

```css
:root {
  /* Base */
  --color-bg: #FFFFFF;
  --color-bg-subtle: #F6F8FB;      /* section backgrounds, alternating rows */
  --color-bg-inverse: #0B1930;      /* rare — footer or a single dark section for contrast */

  /* Text */
  --color-ink: #0B1930;             /* headings, primary text — deep navy, not pure black */
  --color-ink-muted: #5C6B85;       /* body copy, secondary text */
  --color-ink-faint: #94A0B8;       /* captions, timestamps, placeholder text */

  /* Accent (the "clinical" 30%) */
  --color-accent: #2F6FED;          /* primary CTA, links, active states, focus rings */
  --color-accent-hover: #1D56C9;
  --color-accent-soft: #EAF1FF;     /* light blue backgrounds — badges, highlighted cards, hover fills */
  --color-accent-soft-border: #C9DBFB;

  /* Borders / dividers */
  --color-border: #E3E8F0;
  --color-border-strong: #CBD5E3;

  /* Semantic (kept muted, not saturated — stays consistent with the minimal palette) */
  --color-success: #1F9D6B;
  --color-warning: #B98900;
  --color-error: #D6483F;
}
```

Notes:
- No gradients, no glassmorphism, no glow/blur blobs (a clean break from the current dark theme's hero background treatment).
- `--color-accent` is used sparingly — for CTAs, links, active nav states, and small accent details (like the italic word treatment below). It should never be the dominant color on a page; white and navy-on-white carry the visual weight.
- Photography (campus/architecture shots like the current hero) stays, but treated with a subtle cool color grade to sit naturally against the blue accent rather than the current warm sepia tone.

### 3.2 Typography

| Role | Font | Usage |
|---|---|---|
| Display | **Instrument Serif** | H1/H2 hero and section headlines, large stat numbers, the signature italicized-word accent (see below) |
| Body/UI | **Geist** | paragraphs, nav, buttons, form labels, all UI chrome |
| Mono (optional accent) | **Geist Mono** | small data-like details — e.g. branch codes, stats — used very sparingly for texture, not a primary font |

**Signature detail to carry forward:** your current site already does one thing well — a single italicized accent word inside headlines ("Creators of *Creative* Minds", "your *learning* portal"). Keep this pattern exactly, but render the italic word in Instrument Serif italic + `--color-accent` blue instead of the current gradient treatment. It's a distinctive, low-effort brand signature worth preserving through the redesign.

Type scale (Tailwind config):
```
text-xs    12px / 16px   — captions, labels
text-sm    14px / 20px   — secondary body, form helper text
text-base  16px / 24px   — body copy
text-lg    18px / 28px   — lead paragraphs
text-2xl   24px / 32px   — card headings
text-4xl   36px / 42px   — section headings (Instrument Serif)
text-6xl   56px / 60px   — hero headline (Instrument Serif)
```

### 3.3 Shape, Spacing, Elevation

- **Corner radius:** 10–12px on cards/buttons/inputs. Not Stripe's sharp 0px, not the current theme's heavy rounding either — a middle ground that reads "precise but approachable."
- **Borders over shadows:** default to a 1px `--color-border` outline for cards; reserve soft shadows (`shadow-sm`/`shadow-md`, low opacity, no color tint) for elevated elements like modals or the nav bar on scroll.
- **Whitespace:** generous section padding (96–128px vertical on desktop between major sections) — whitespace is doing a lot of the "minimal" work here, not just color reduction.
- **Grid:** 12-column, max content width ~1280px, centered, consistent gutters.

### 3.4 Core Components (build as shared primitives in `components/ui/`)

- `Button` — primary (solid `--color-accent`, white text), secondary (white bg, navy border/text), ghost/text link
- `Card` — bordered, white bg, optional `--color-bg-subtle` variant
- `Badge` — small pill, `--color-accent-soft` bg + `--color-accent` text (used for tags like "Excellence in Education" eyebrow labels)
- `NavBar` — sticky, white bg, blurred border-bottom on scroll, current active-page underline in accent blue
- `SectionHeading` — eyebrow badge + Instrument Serif headline + Geist subhead, reused across all public pages

---

## 4. Sitemap (Phase 1)

Unchanged from current routes — this phase is a visual/stack rebuild, not a re-architecture:

```
/                  Landing Page
/admissions        Admissions info
/about             About Us
/life              Life at Vidhya
/courses           Our Courses (public catalog)
/our-locations     Branch details, contact, maps
```

`/login` exists as a route stub in this phase (links from the nav "Log In" button should work) but can render a simple "coming soon" or redirect placeholder until Phase 2 wires up Clerk.

---

## 5. Page-by-Page Brief

### 5.1 Landing Page (`/`)
Current structure (from existing site) to preserve, restyled:
- Hero: full-width campus/architecture photo, eyebrow badge ("Excellence in Education"), Instrument Serif headline with one italic accent word, supporting paragraph, primary + secondary CTA buttons ("Explore Programs" / "Virtual Tour")
- Add below the fold (not currently visible in the captured frame, but standard for this PRD's public site scope): stats strip (years running, students, batches, results), program highlights grid, testimonials/achievements, campus life teaser, final CTA band before footer

### 5.2 Admissions (`/admissions`)
Enrollment process steps (numbered, horizontal on desktop), key dates, downloadable/linked forms, FAQ accordion, CTA to contact/apply.

### 5.3 About (`/about`)
History/mission narrative, leadership or faculty highlight, core values as a 3–4 card grid, timeline of institute milestones if available.

### 5.4 Life at Vidhya (`/life`)
Photo-forward page — events/extracurriculars gallery, culture blurb, student spotlight cards.

### 5.5 Our Courses (`/courses`)
Course/program catalog as filterable cards (subject, level), each linking to a detail view or anchor section with syllabus highlights and batch timing info.

### 5.6 Our Locations (`/our-locations`)
Branch cards (address, contact, map embed), consistent card treatment with the rest of the site.

---

## 6. Performance & SEO

- Static generation (`generateStaticParams`/default static rendering) for all six public pages — they don't need per-request dynamic data.
- `next/image` for every photo asset, with explicit width/height to avoid CLS.
- Next.js Metadata API for per-page `<title>`/`<meta description>`/OpenGraph tags — important since this is the marketing surface that needs to rank and share well.
- Lighthouse target: 90+ on Performance/Accessibility/SEO for all public pages before calling Phase 1 done.

---

## 7. File Structure (Phase 1 scaffold)

```
app/
  layout.tsx              — root layout, font loading, global nav/footer
  page.tsx                — landing page
  admissions/page.tsx
  about/page.tsx
  life/page.tsx
  courses/page.tsx
  our-locations/page.tsx
  login/page.tsx           — placeholder, real logic in Phase 2
components/
  ui/                       — Button, Card, Badge, NavBar, SectionHeading, Footer
  sections/                 — page-specific section components (Hero, StatsStrip, CourseCard, etc.)
lib/
  fonts.ts                  — next/font config for Instrument Serif + Geist
public/
  logo.svg (or updated logo asset matching new palette — current logo.png/logo2.png likely need a navy/white recolor pass)
```

---

## 8. Explicitly Deferred to Phase 2

- Clerk auth, `/login` real implementation, role-based routing/middleware
- Prisma schema, Supabase Postgres + Storage setup
- Student/Teacher/Admin portals in full
- Razorpay fee payments
- Resend email notifications
- Any gamification-adjacent UI (n/a — gamification is being removed entirely, not carried into either phase)
