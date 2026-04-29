# AI Resume Screening App

A full-stack AI-powered resume screening application built with Next.js, TypeScript, PostgreSQL, Prisma, Tailwind CSS, and ShadCN UI.

## Features

- 🔐 **Authentication**: Secure login/register with NextAuth (JWT-based)
- 👥 **Role-Based Access**: Admin and Recruiter roles
- 📄 **Resume Upload**: Drag & drop PDF/DOCX upload with progress indicator
- 🤖 **AI Parsing**: Groq LLM extracts structured candidate data from resumes
- 📊 **Resume Management**: View, search, and delete resumes with full candidate profiles
- 💼 **Job Management**: Complete CRUD operations for job postings with skill management
- 🎯 **AI Matching Engine**: Advanced AI-powered resume-to-job matching with detailed analysis
- 📈 **Match Results**: Ranked candidates with scores, recommendations, and detailed insights
- 🔍 **Match Analysis**: Strengths, weaknesses, skill gaps, and experience relevance
- 📊 **Advanced Dashboard**: 8 KPI cards + 4 interactive charts with real-time analytics
- 🔎 **Global Search**: Fast search across candidates, jobs, and skills
- 🎛️ **Advanced Filters**: Filter matches by score, experience, skills, and recommendation
- 📥 **CSV Export**: Export candidates with filters for easy reporting
- 📈 **Analytics Charts**: Upload trends, score distribution, top skills, jobs by status
- 📧 **Email Notifications**: Send automated emails to candidates (shortlisted, interview, rejection)
- 📬 **Bulk Email**: Send emails to multiple candidates at once
- 📋 **Hiring Pipeline**: Kanban board with 8 stages and drag-and-drop functionality
- 📝 **Recruiter Notes**: Add internal notes per candidate with timeline view
- 🚀 **Production Ready**: Vercel + Neon deployment configuration included
- 🎨 **Modern UI**: Built with Tailwind CSS and ShadCN UI components
- ✅ **Type-Safe**: Full TypeScript coverage
- 🔒 **Protected Routes**: Middleware-based route protection

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL (Neon for production)
- **ORM**: Prisma 7
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS
- **UI Components**: ShadCN UI (Radix UI primitives)
- **Charts**: Recharts
- **Drag & Drop**: @dnd-kit
- **Email**: Resend
- **Form Validation**: Zod + React Hook Form
- **Icons**: Lucide React
- **AI**: Groq API (llama-3.3-70b-versatile)
- **Deployment**: Vercel

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (local or cloud)

## Getting Started

### 1. Clone and Install

```bash
cd resume-screening-app
npm install
```

### 2. Environment Setup

Copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

Update `.env` with your database credentials and API keys:

```env
# Database - Update with your PostgreSQL connection string
DATABASE_URL="postgresql://postgres:password@localhost:5432/resume_screening_db"

# Groq API - Get your API key from https://console.groq.com
GROQ_API_KEY="gsk_your_groq_api_key_here"

# Resend Email API - Get your API key from https://resend.com
RESEND_API_KEY="re_your_resend_api_key_here"

# NextAuth - Generate a secure secret: openssl rand -base64 32
NEXTAUTH_SECRET="your-super-secret-nextauth-key-change-in-production"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Database Setup

Create the database and run migrations:

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database (creates tables)
npm run db:push

# Seed database with test data
npm run db:seed
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Default Test Accounts

After seeding, you can login with:

**Admin Account:**
- Email: `admin@resumeapp.com`
- Password: `admin123`

**Recruiter Account:**
- Email: `recruiter@resumeapp.com`
- Password: `recruiter123`

## Project Structure

```
resume-screening-app/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Auth pages (login, register)
│   ├── (dashboard)/         # Protected dashboard pages
│   ├── api/                 # API routes
│   │   ├── auth/           # NextAuth + registration
│   │   └── dashboard/      # Dashboard stats API
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page (redirects)
│   ├── providers.tsx       # Client providers (SessionProvider)
│   └── globals.css         # Global styles
├── components/              # React components
│   ├── auth/               # Login/Register forms
│   ├── dashboard/          # Dashboard components
│   ├── layout/             # Layout components (Navbar)
│   └── ui/                 # ShadCN UI components
├── lib/                     # Utilities and configs
│   ├── auth.ts             # NextAuth configuration
│   ├── prisma.ts           # Prisma client instance
│   ├── utils.ts            # Utility functions
│   └── validations/        # Zod schemas
├── prisma/                  # Database
│   ├── schema.prisma       # Database schema
│   └── seed.ts             # Seed script
├── types/                   # TypeScript types
│   └── next-auth.d.ts      # NextAuth type extensions
├── proxy.ts                 # Route protection middleware
├── .env                     # Environment variables (not in git)
├── .env.example            # Environment template
└── package.json            # Dependencies and scripts
```

## Database Schema

### Models

- **User**: Authentication and user management
  - Fields: id, name, email, password, role (ADMIN/RECRUITER), createdAt
  
- **Resume**: Candidate resume data
  - Fields: id, candidateName, email, phone, fileUrl, fileSize, fileType, extractedText, skills, experienceYears, education, projects, summary, createdAt, updatedAt
  - Relations: matches (one-to-many)
  
- **Job**: Job posting information
  - Fields: id, title, company, location, employmentType, experienceRequired, requiredSkills, optionalSkills, salaryRange, description, status, createdAt, updatedAt
  - Relations: matches (one-to-many)
  
- **Match**: AI-powered resume-to-job matching results
  - Fields: id, resumeId, jobId, score, skillMatchPercent, matchedSkills, missingSkills, strengths, weaknesses, experienceRelevance, recommendation, createdAt
  - Relations: resume (many-to-one), job (many-to-one)
  - Unique constraint: (resumeId, jobId)

## Available Scripts

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint

# Database
npm run db:generate      # Generate Prisma Client
npm run db:migrate       # Run migrations (dev)
npm run db:push          # Push schema to database
npm run db:seed          # Seed database with test data
npm run db:studio        # Open Prisma Studio
```

## API Routes

### Authentication
- `POST /api/auth/register` - Create new user account
- `POST /api/auth/signin` - Sign in (handled by NextAuth)
- `POST /api/auth/signout` - Sign out (handled by NextAuth)

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

### Jobs
- `GET /api/jobs` - List all jobs (with pagination, search, filter)
- `POST /api/jobs` - Create new job
- `GET /api/jobs/:id` - Get single job with matches
- `PUT /api/jobs/:id` - Update job
- `DELETE /api/jobs/:id` - Delete job

### Resumes
- `GET /api/resumes` - List all resumes
- `POST /api/resumes/upload` - Upload and parse resume
- `GET /api/resumes/:id` - Get single resume
- `DELETE /api/resumes/:id` - Delete resume

### Matching
- `POST /api/match/run/:jobId` - Run AI matching for job
- `GET /api/match/:jobId` - Get matches for job (ranked)
- `GET /api/match/detail/:matchId` - Get single match detail

## Pages

### Public Routes
- `/login` - Sign in page
- `/register` - Create account page

### Protected Routes (requires authentication)
- `/dashboard` - Main dashboard with stats and recent activity
- `/dashboard/resumes` - Resume list and upload
- `/dashboard/resumes/:id` - Resume detail view
- `/dashboard/jobs` - Job list with search and filter
- `/dashboard/jobs/new` - Create new job
- `/dashboard/jobs/:id` - Job detail with top matches
- `/dashboard/jobs/:id/edit` - Edit job
- `/dashboard/matches` - All matches overview
- `/dashboard/matches/:jobId` - Ranked candidates for specific job

## Security Features

- ✅ Password hashing with bcrypt (12 rounds)
- ✅ JWT-based session management
- ✅ Protected API routes with NextAuth
- ✅ Route protection middleware
- ✅ Role-based access control
- ✅ Server-side validation with Zod
- ✅ CSRF protection (NextAuth built-in)
- ✅ SQL injection protection (Prisma)

## Development Notes

### Prisma 7 Changes
This project uses Prisma 7, which requires:
- Database adapter (`@prisma/adapter-pg`)
- Connection URL configured via `prisma.config.ts`
- No `url` field in `schema.prisma` datasource

### Next.js 16 Changes
- Middleware renamed to `proxy.ts`
- Async `searchParams` in page components
- React 19 support

## Documentation

For detailed information about specific features:

- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Production deployment guide for Vercel + Neon
- **[WORKFLOW_FEATURES.md](./WORKFLOW_FEATURES.md)** - Email, pipeline, and notes documentation
- **[JOBS_MATCHING_MODULE.md](./JOBS_MATCHING_MODULE.md)** - Complete job management and AI matching documentation
- **[DASHBOARD_ANALYTICS.md](./DASHBOARD_ANALYTICS.md)** - Advanced dashboard analytics, search, filters, and export
- **[ANALYTICS_QUICK_START.md](./ANALYTICS_QUICK_START.md)** - Quick start guide for analytics features
- **[QUICK_START.md](./QUICK_START.md)** - 5-minute quick start guide
- **[MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)** - Database setup and migration guide
- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - Technical implementation details
- **[FEATURE_OVERVIEW.md](./FEATURE_OVERVIEW.md)** - Visual feature walkthrough
- **[DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)** - Production deployment checklist

## Future Enhancements

- [ ] Email notifications for new matches
- [ ] Bulk job operations
- [ ] Export matches to CSV/Excel
- [ ] Advanced filtering (score range, recommendation level)
- [ ] Interview scheduling integration
- [ ] Team collaboration features
- [ ] Analytics dashboard
- [ ] Custom scoring weights
- [ ] Multi-language support
- [ ] ATS integration

## License

MIT

## Support

For issues or questions, please open an issue on the repository.
