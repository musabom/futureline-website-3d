# FutureLine

## Overview
FutureLine is a production-ready full-stack web application for a professional AI, training, and digital services company. Built with Next.js 14 (App Router), TypeScript, TailwindCSS, PostgreSQL, and Prisma ORM.

**Brand**: FutureLine - Design . Deploy . Evolve
**Primary Color**: Deep Navy #0F1E3D
**Accent Gradient**: #1B2C63 to #18A999

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS 3 with custom brand theme
- **Database**: PostgreSQL with Prisma ORM (v5.22)
- **Auth**: NextAuth v4 with credentials provider (role-based)
- **Icons**: Lucide React
- **Payments**: Stripe (ready for integration)

## Project Architecture

```
src/
  app/
    (public)/          # Public-facing pages (Home, Courses, Services, AI)
    (tourism)/tourism/ # FL Tourism standalone page (own layout, no FutureLine header/footer)
    (auth)/            # Login and Register pages
    (protected)/       # Dashboard and Admin portal
    api/               # API routes
      auth/            # NextAuth and registration
      admin/           # Admin CRUD APIs (protected)
      ai/              # AI recommendation
      checkout/        # Payment flow
      enrollment/      # Progress tracking
      leads/           # Tourism contact form leads API
  components/          # Reusable components
    admin/             # Admin-specific components
  lib/                 # Utilities, Prisma client, auth config
  types/               # TypeScript type definitions
prisma/
  schema.prisma        # Database schema (includes Lead model)
  seed.ts              # Seed data script
public/
  images/tourism/      # Tourism gallery + hero images
```

## User Roles
- **ADMIN**: Full system control, access to /admin portal
- **INSTRUCTOR**: Manage assigned courses, upload lessons
- **CUSTOMER**: Browse, purchase, access courses, track progress

## Seed Data Credentials
- Admin: admin@futureline.com / admin123
- Instructor: instructor@futureline.com / instructor123
- Customer: customer@futureline.com / customer123

## Key Features
- Public website with hero, courses, services, AI recommendations
- Course filtering by type, level, search
- AI-powered course recommendation (rule-based, LLM-ready architecture)
- Customer dashboard with progress tracking
- Online course learning area with lesson viewer
- Admin portal with full CRUD management
- Role-based route protection
- Stripe payment flow (with graceful fallback when no key configured)
- CSV export for enrollments

## Environment Variables
- DATABASE_URL: PostgreSQL connection string
- NEXTAUTH_SECRET / SESSION_SECRET: Auth session secret
- NEXTAUTH_URL: App URL for NextAuth
- STRIPE_SECRET_KEY: (Optional) Stripe API key

## Running
- Dev: `npm run dev` (port 5000)
- Seed: `npm run seed`
- Build: `npm run build`

## FL Tourism Page
- Standalone page at /tourism with its own route group (bypasses FutureLine header/footer)
- Clean white/gold theme: bg #FFFFFF, accent #C49A3A, text #1A1A1A, secondary #666666
- Brand: "Authentic Oman Tours and Adventures"
- Sections: Hero, Featured Package (pricing), Full 6-Day Itinerary with tabbed day selector (each day has detailed stops with durations/costs), Gallery carousel (15 items), Reviews carousel (6 testimonials), Contact form (stores leads in DB), Footer
- Contact: WhatsApp +968 9653 2326 / +968 9425 9459, Email: authentic.tour.om@gmail.com
- TripAdvisor link integrated in hero and reviews section
- Floating WhatsApp button (green #25D366)
- Lead model in Prisma stores contact form submissions with source tracking
- Gallery images stored in public/images/tourism/

## Recent Changes
- Initial build: Full application with all core features
- Database seeded with courses, services, testimonials, and demo users
- FL Tourism page rebuilt with clean tourism theme, 8 sections, gallery, reviews, contact form with lead storage
- Lead source tracking: Added `source` field to Lead model, tourism form tags submissions as "FL Tourism"
- Admin Leads page at /admin/leads with search, source filtering, and CSV export
- Secured leads API: public /api/leads only accepts POST; admin reads via /api/admin/leads (auth-protected)
- TripAdvisor floating button added to tourism page (green #34E0A1, bottom-left)
