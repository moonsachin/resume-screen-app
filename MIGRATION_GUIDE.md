# Migration Guide - Job Management + AI Matching Module

## Prerequisites

Before running the application, ensure you have:

1. **PostgreSQL Database** running and accessible
2. **Environment Variables** configured in `.env`:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/resume_screening"
   GROQ_API_KEY="your_groq_api_key_here"
   NEXTAUTH_SECRET="your_nextauth_secret"
   NEXTAUTH_URL="http://localhost:3000"
   ```

## Database Migration Steps

### 1. Generate Prisma Client
```bash
cd resume-screening-app
npm run db:generate
```

### 2. Run Database Migration
```bash
npm run db:migrate
```

This will:
- Create the `jobs` table with all fields
- Create the `matches` table with relations
- Set up foreign keys and constraints
- Create indexes for performance

### 3. (Optional) Seed Sample Data
```bash
npm run db:seed
```

This will create:
- Sample user accounts
- Sample job postings
- Sample resumes

## Database Schema Overview

### Jobs Table
```sql
CREATE TABLE jobs (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT,
  employment_type TEXT NOT NULL DEFAULT 'FULL_TIME',
  experience_required FLOAT,
  required_skills JSONB,
  optional_skills JSONB,
  salary_range TEXT,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'DRAFT',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL
);
```

### Matches Table
```sql
CREATE TABLE matches (
  id TEXT PRIMARY KEY,
  resume_id TEXT NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
  job_id TEXT NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  score FLOAT NOT NULL,
  skill_match_percent FLOAT,
  matched_skills JSONB,
  missing_skills JSONB,
  strengths JSONB,
  weaknesses JSONB,
  experience_relevance TEXT,
  recommendation TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE(resume_id, job_id)
);
```

## Verification Steps

### 1. Check Database Connection
```bash
npm run db:studio
```
This opens Prisma Studio to view your database.

### 2. Verify Tables Exist
In Prisma Studio, you should see:
- ✅ users
- ✅ resumes
- ✅ jobs (new)
- ✅ matches (new)

### 3. Test API Endpoints

**Create a Job:**
```bash
curl -X POST http://localhost:3000/api/jobs \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Senior Software Engineer",
    "company": "Tech Corp",
    "employmentType": "FULL_TIME",
    "experienceRequired": 5,
    "requiredSkills": ["JavaScript", "React", "Node.js"],
    "optionalSkills": ["TypeScript", "AWS"],
    "description": "We are looking for an experienced software engineer...",
    "status": "OPEN"
  }'
```

**List Jobs:**
```bash
curl http://localhost:3000/api/jobs
```

**Run Matching:**
```bash
curl -X POST http://localhost:3000/api/match/run/{jobId}
```

## Running the Application

### Development Mode
```bash
npm run dev
```

Visit: http://localhost:3000

### Production Build
```bash
npm run build
npm start
```

## Troubleshooting

### Issue: "Prisma Client not generated"
**Solution:**
```bash
npm run db:generate
```

### Issue: "Database connection failed"
**Solution:**
- Check DATABASE_URL in .env
- Ensure PostgreSQL is running
- Verify credentials and database exists

### Issue: "GROQ_API_KEY not set"
**Solution:**
- Get API key from https://console.groq.com
- Add to .env file
- Restart dev server

### Issue: "Migration failed"
**Solution:**
```bash
# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Or push schema without migration
npm run db:push
```

### Issue: "TypeScript errors"
**Solution:**
```bash
# Regenerate Prisma types
npm run db:generate

# Check for errors
npx tsc --noEmit
```

## Post-Migration Checklist

- [ ] Database tables created successfully
- [ ] Prisma Client generated
- [ ] Environment variables configured
- [ ] Dev server starts without errors
- [ ] Can access /dashboard/jobs page
- [ ] Can create a new job
- [ ] Can upload resumes (prerequisite)
- [ ] Can run AI matching
- [ ] Can view match results

## Next Steps

1. **Upload Resumes**: Navigate to `/dashboard/resumes` and upload candidate resumes
2. **Create Jobs**: Navigate to `/dashboard/jobs/new` and create job postings
3. **Run Matching**: Click "Run Match" on any job to start AI analysis
4. **Review Results**: View ranked candidates and detailed match analysis

## Support

If you encounter issues:
1. Check the console for error messages
2. Review the logs in terminal
3. Verify all environment variables
4. Ensure database is accessible
5. Check Groq API key is valid

## Rollback (if needed)

To rollback the migration:
```bash
# View migration history
npx prisma migrate status

# Rollback last migration
npx prisma migrate resolve --rolled-back {migration_name}
```

**Note**: This is a destructive operation and will delete the jobs and matches tables.
