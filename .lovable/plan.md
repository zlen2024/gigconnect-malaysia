

# SiswaGig — Malaysian Student-Gig Marketplace MVP

## Overview
A bilateral service-exchange platform connecting Malaysian students (offering gigs) with clients (posting jobs). Students push their services; clients pull talent — all verified through .edu.my emails.

---

## 1. Landing Page
A polished marketing page inspired by your HTML mockup and image reference:
- **Sticky navigation** with SiswaGig branding, nav links (About, How It Works, FAQ), Login & Sign Up buttons
- **Hero section** with headline, tagline, and dual CTAs: "Join as Student" / "Hire Talent"
- **Dual-Way Marketplace section** — side-by-side cards explaining Student-Push (post gigs & portfolio) and Client-Pull (post jobs & find talent)
- **Core features** — Verified Onboarding, Nearby Discovery, Milestone Badges
- **Stats/social proof bar** — student count, jobs completed, universities, earnings
- **Footer** with CTAs and links
- **Mobile bottom navigation bar**

## 2. Authentication & Onboarding
- **Sign up** with email (prioritizing .edu.my verification), password
- **Login** page
- **Role selection** during signup: Student or Client
- **Profile creation** — name, university, skills/categories (students), or company info (clients)
- User profiles table linked to auth, with a separate roles table for security

## 3. Student Dashboard (Student-Push)
- **My Gigs** — create, edit, and manage gig listings with title, description, category, pricing packages, and delivery time
- **Portfolio** section — upload work samples and project descriptions
- **Badge/Level display** — Newbie → Pro → Expert based on completed jobs
- **Earnings overview** — total earned, pending payments
- **Incoming orders/requests** — view and respond to client requests

## 4. Client Dashboard (Client-Pull)
- **Post a Job** — title, description, category, budget, location/remote preference
- **Browse Talent** — search and filter students by skill, university, rating, badge level
- **My Jobs** — manage posted jobs, view applicants, accept proposals
- **Order tracking** — track active jobs and mark as complete

## 5. Gig & Job Marketplace (Public)
- **Browse Gigs** — filterable listing of student services by category (Design, Tutoring, IT Support, etc.)
- **Browse Jobs** — filterable listing of client-posted jobs
- **Gig/Job detail pages** with descriptions, pricing, reviews, and contact/apply actions

## 6. Messaging
- **Simple in-app chat** between student and client once a job/gig is initiated
- Message history per conversation

## 7. Reviews & Ratings
- Clients can rate and review students after job completion
- Students can rate clients
- Ratings contribute to badge progression

## 8. Backend (Supabase / Lovable Cloud)
- **Database tables**: profiles, user_roles, gigs, jobs, orders, messages, reviews
- **Row-Level Security** on all tables ensuring users only access their own data
- **Storage** for portfolio images and avatars
- **Edge functions** for any sensitive operations (e.g., badge calculation)

---

## Design Direction
- Clean, modern UI with a blue primary color (#0048ad) matching the SiswaGig brand
- Glassmorphism nav bar, rounded cards, gradient accents
- Mobile-first responsive design with bottom navigation on mobile
- Inter font family throughout

