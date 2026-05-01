We are building Vaultly — a premium full-stack personal budgeting app.
The Supabase project is already created and all database tables have been set up. Do not create any migrations or ask me to run any SQL. The database is ready.
Project Structure — Use exactly this:
textvaultly/
├── frontend/          ← Next.js 14 App Router (all UI + frontend logic)
├── backend/           ← NestJS Backend (all API, business logic, validation, notifications)
├── .env.local
└── package.json       ← Root package.json with workspaces
Replace the original tech stack and structure with the following:
TECH STACK
Frontend (frontend/):

Next.js 14 (App Router)
TypeScript
Tailwind CSS
Framer Motion (all animations)
Recharts (all charts)
Zustand (global state)
date-fns
Lucide React (icons)
React Hook Form + Zod
@supabase/supabase-js and @supabase/ssr (for auth and realtime)

Backend (backend/):

NestJS (latest version)
TypeScript
Zod + class-validator (validation)
@supabase/supabase-js (using service role key)
web-push (for push notifications)

Install all required packages at the start before building anything.

PROJECT STRUCTURE (Exact)
Frontend:
textfrontend/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── transactions/page.tsx
│   │   ├── cards/page.tsx
│   │   ├── budgets/page.tsx
│   │   ├── analytics/page.tsx
│   │   ├── goals/page.tsx
│   │   ├── notifications/page.tsx
│   │   └── settings/page.tsx
│   ├── auth/callback/route.ts
│   └── api/
│       ├── notifications/send/route.ts
│       ├── notifications/subscribe/route.ts
│       └── export/route.ts
├── components/
│   ├── cards/
│   ├── charts/
│   ├── dashboard/
│   ├── transactions/
│   ├── goals/
│   ├── budgets/
│   ├── notifications/
│   └── ui/
├── lib/
│   ├── supabase/
│   ├── utils/
│   └── api.ts                 ← Axios client pointing to NestJS backend
├── stores/
├── types/
├── public/
│   └── sw.js
└── middleware.ts

Backend:
do the backend how you see fit but make use of Nest's full features (guards, pipes, etc. if necessary) 

Design system (colors, fonts, glassmorphism, card design, animations, etc.)
All pages and features (Dashboard with 7 sections, Transactions, Cards with live preview, Budgets, Analytics with 6 Recharts charts, Goals with confetti, Notifications, Settings, etc.)
Full responsive layout (desktop sidebar + mobile bottom nav)
Optimistic UI, skeletons, Framer Motion animations, Zod validation, etc.
Push notifications with service worker
Budget alert triggers
All types, formatters, Zustand stores

Important Changes:

The NestJS backend is responsible for all API calls, business logic, validation, budget calculations, push notification triggering, analytics queries, and data mutations.
The Next.js frontend should call the NestJS backend API (not Supabase directly for most operations) using an Axios instance in frontend/lib/api.ts.
Backend will use Supabase service role key for admin-level operations.
Frontend will still use Supabase client for authentication and realtime if needed.

Build Order — Follow exactly:

Install all npm packages (in root, frontend, and backend)
Set up globals.css with CSS variables and font imports (in frontend)
Create types/index.ts (in frontend)
Create Supabase client files (in frontend/lib/supabase/)
Create middleware.ts (in frontend)
Create app/auth/callback/route.ts (in frontend)
Create lib/utils/formatters.ts (in frontend)
Create Zustand stores (in frontend)
Build auth pages: /login and /signup (in frontend)
Build dashboard layout with sidebar and mobile nav
Build Cards page + Add Card modal with live preview
Build Transactions page + Add/Edit transaction modal
Build Dashboard page with all 7 sections
...and continue through all remaining steps as originally specified.

Use NestJS for the backend and use the two top-level folders: frontend/ and backend/.
Now begin with Step 1: Create the project structure with frontend/ and backend/ folders, set up npm workspaces, and install all required packages.