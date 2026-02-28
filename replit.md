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

## Business Divisions
- **FL Tourism**: Live - Standalone tourism page at /tourism
- **FL Courses**: Live - Full course catalog, free enrollment, lesson viewer
- **FL Services**: Coming Soon (Digitalisation service live at /services/digitalisation)
- **FL AI & Automation**: Coming Soon - Professional landing page at /ai

## Key Features
- Public website with hero, four division cards (with Coming Soon badges), courses
- Course filtering by type, level, search; all courses are free
- Customer dashboard with progress tracking
- Online course learning area with lesson viewer (video, notes, quizzes)
- Admin portal with full CRUD management
- CRM pipeline with 7 stages, lead detail pages, activity logging
- Email templates with variable substitution ({{name}}, {{email}}, {{service}})
- Automation rules engine (triggers + actions, ready for email service)
- Role-based route protection (Admin, Instructor, Customer)
- Instructor portal with course builder and approval workflow
- CSV export for enrollments and leads

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

## Instructor Portal
- Separate portal at `/instructor` with own layout and sidebar
- Instructors only see and manage their own courses and lessons
- Instructor course builder mirrors admin course builder with instructor-scoped APIs
- Course submission: Instructors create courses with `approvalStatus: PENDING`
- Login redirects by role: ADMIN → /admin, INSTRUCTOR → /instructor, CUSTOMER → /dashboard

## Course Approval Flow
- New courses from instructors start with `approvalStatus: PENDING`
- Admin can approve/reject courses from the admin courses page
- Rejected courses show reason to instructor
- Only `APPROVED` courses appear on public pages

## Revenue Split
- Each instructor has a `commissionRate` (default 70%) - instructor's share of revenue
- Platform keeps the remainder (e.g., 30%)
- Admin can adjust per-instructor from the Instructors management page
- `InstructorEarning` model ready for tracking when paid courses are enabled

## API Security
- Instructor APIs at `/api/instructor/*` verify ownership of courses/lessons
- Admin APIs at `/api/admin/*` require ADMIN role
- Instructors cannot modify `approvalStatus` or `instructorId` on their courses

## Recent Changes
- Initial build: Full application with all core features
- Database seeded with courses, services, testimonials, and demo users
- FL Tourism page rebuilt with clean tourism theme, 8 sections, gallery, reviews, contact form with lead storage
- Lead source tracking: Added `source` field to Lead model, tourism form tags submissions as "FL Tourism"
- Admin Leads page at /admin/leads with search, source filtering, and CSV export
- Secured leads API: public /api/leads only accepts POST; admin reads via /api/admin/leads (auth-protected)
- TripAdvisor floating button added to tourism page (green #34E0A1, bottom-left)
- FL Services page rebuilt with real Digitalisation content: Hero, Services Grid, Industries, and CTA. Scalable array structure for adding future services.
- Digitalisation details moved to dedicated page at /services/digitalisation with sections: Live Case (with Turnaround Hub demo link), What We Fix, How We Deliver, What You Get, and CTA. Back to Services navigation included.
- Lesson video embedding: LessonViewer now embeds YouTube/Vimeo videos in a responsive 16:9 iframe player instead of exposing raw URLs. Only YouTube and Vimeo URLs are allowed (security). Admin lesson form updated with clearer placeholder text.
- All courses made free: Removed payment/Stripe flow, enrollment is direct and free. Course pages show "Free" instead of prices.
- Course learning page rebuilt with collapsible module accordion: Modules expand/collapse to show lesson titles. Clicking a lesson opens it inline with Video (top), Lesson Notes box (middle), and downloadable Attachments (bottom). Mark as Complete button per lesson tracks progress.
- Enrollment redirects to course learning page directly (not dashboard). Course curriculum hidden from public course page until enrolled.
- Admin Course Builder: Visual accordion-based lesson management. Select a course, add/delete modules, add multiple lessons per module. Two lesson types: Content (video, notes, attachments) and Quiz (multiple-choice questions with correct answer marking). Inline editing forms.
- Student Quiz View: Quiz lessons show interactive multiple-choice questions. Students select answers, submit, see score with correct/incorrect highlighting. Perfect score auto-completes the lesson. "Try Again" option for incomplete scores.
- Instructor Portal: Separate /instructor area with dashboard, course management, and course builder. Role-based login redirect. Instructor-scoped APIs with ownership verification.
- Course Approval: Admin can approve/reject instructor-submitted courses. Only approved courses show publicly.
- Instructor Management: Admin page at /admin/instructors to manage commission rates, enable/disable instructors.
- Revenue Split: CommissionRate field on User, InstructorEarning model for future paid courses tracking.
- CRM Pipeline: Expanded Lead model with 7 pipeline stages (NEW→CONTACTED→OFFER_SENT→FOLLOW_UP→NEGOTIATING→WON→LOST), priority levels, deal value, tags, follow-up scheduling. Pipeline and table views at /admin/leads.
- Lead Detail Page: Individual lead view at /admin/leads/[id] with stage controls, notes, activity timeline, message composer with template integration, and deal details sidebar.
- Email Templates: Template system at /admin/templates with WELCOME/PROPOSAL/FOLLOW_UP/CLOSING/THANK_YOU types. Supports {{name}}, {{email}}, {{service}} variables. Templates can be applied when composing messages to leads.
- Automation Rules: Rule engine at /admin/automation with configurable triggers (stage change, days inactive, new lead, follow-up due) and actions (change stage, send template, set priority, add tag, schedule follow-up). Delay configuration in hours. Ready for email service integration.
- Lead Activity Logging: All interactions (stage changes, notes, emails, calls) automatically logged with timestamps. Activity API at /api/admin/leads/[id]/activity.
- Lead capture forms now auto-create activity log entries when new leads submit.
