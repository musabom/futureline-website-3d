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
    (auth)/            # Login and Register pages
    (protected)/       # Dashboard and Admin portal
    api/               # API routes
      auth/            # NextAuth and registration
      admin/           # Admin CRUD APIs (protected)
      ai/              # AI recommendation
      checkout/        # Payment flow
      enrollment/      # Progress tracking
  components/          # Reusable components
    admin/             # Admin-specific components
  lib/                 # Utilities, Prisma client, auth config
  types/               # TypeScript type definitions
prisma/
  schema.prisma        # Database schema
  seed.ts              # Seed data script
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

## Recent Changes
- Initial build: Full application with all core features
- Database seeded with courses, services, testimonials, and demo users
