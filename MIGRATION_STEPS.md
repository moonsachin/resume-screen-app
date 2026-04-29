# Database Migration Steps - Workflow Features

## 🔄 Local Database Migration

### Prerequisites
- PostgreSQL running locally
- Database credentials in `.env` file

### Step 1: Verify Database Connection

```bash
# Test connection
npx prisma db pull
```

If connection fails, update `.env`:
```env
DATABASE_URL="postgresql://YOUR_USER:YOUR_PASSWORD@localhost:5432/resume_screening_db"
```

### Step 2: Push Schema Changes

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database (recommended for development)
npx prisma db push

# OR create migration (recommended for production)
npx prisma migrate dev --name add_workflow_features
```

### Step 3: Verify Tables Created

```bash
# Open Prisma Studio to view tables
npm run db:studio
```

You should see these new tables:
- ✅ `email_logs` - Email notification logs
- ✅ `candidate_pipeline` - Hiring pipeline stages
- ✅ `notes` - Recruiter notes

### Step 4: Seed Database (Optional)

```bash
npm run db:seed
```

---

## 📊 Schema Changes Summary

### New Tables

**1. email_logs**
```sql
CREATE TABLE email_logs (
  id TEXT PRIMARY KEY,
  match_id TEXT NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- SHORTLISTED, INTERVIEW_SCHEDULED, REJECTION, CUSTOM
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING', -- PENDING, SENT, FAILED
  sent_at TIMESTAMP,
  error TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

**2. candidate_pipeline**
```sql
CREATE TABLE candidate_pipeline (
  id TEXT PRIMARY KEY,
  match_id TEXT NOT NULL UNIQUE REFERENCES matches(id) ON DELETE CASCADE,
  stage TEXT NOT NULL DEFAULT 'APPLIED', -- APPLIED, REVIEWED, SHORTLISTED, etc.
  updated_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

**3. notes**
```sql
CREATE TABLE notes (
  id TEXT PRIMARY KEY,
  match_id TEXT NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL
);
```

### New Enums

```sql
CREATE TYPE EmailType AS ENUM ('SHORTLISTED', 'INTERVIEW_SCHEDULED', 'REJECTION', 'CUSTOM');
CREATE TYPE EmailStatus AS ENUM ('PENDING', 'SENT', 'FAILED');
CREATE TYPE PipelineStage AS ENUM (
  'APPLIED', 'REVIEWED', 'SHORTLISTED', 'INTERVIEW_SCHEDULED',
  'INTERVIEWED', 'OFFERED', 'HIRED', 'REJECTED'
);
```

### Modified Tables

**users** - Added relation to notes
```sql
-- No schema change, just relation added in Prisma
```

**matches** - Added relations
```sql
-- No schema change, just relations added in Prisma
-- Relations: emailLogs, candidatePipeline, notes
```

---

## 🔍 Verify Migration

### Check Tables Exist
```bash
npx prisma studio
```

### Run Test Queries
```sql
-- Check email_logs table
SELECT * FROM email_logs LIMIT 1;

-- Check candidate_pipeline table
SELECT * FROM candidate_pipeline LIMIT 1;

-- Check notes table
SELECT * FROM notes LIMIT 1;
```

---

## 🚨 Troubleshooting

### Error: "Authentication failed"
**Solution:**
1. Check PostgreSQL is running
2. Verify credentials in `.env`
3. Test connection: `psql -U postgres -d resume_screening_db`

### Error: "Database does not exist"
**Solution:**
```bash
# Create database
createdb resume_screening_db

# Or using psql
psql -U postgres
CREATE DATABASE resume_screening_db;
\q
```

### Error: "Prisma Client not generated"
**Solution:**
```bash
npm run db:generate
```

### Error: "Migration failed"
**Solution:**
```bash
# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Or use db:push (no migration history)
npx prisma db push --force-reset
```

---

## 📦 Migration Files Location

If you used `prisma migrate dev`, migration files are in:
```
prisma/migrations/
└── YYYYMMDDHHMMSS_add_workflow_features/
    └── migration.sql
```

---

## 🔄 Transfer to Neon Database

### Step 1: Export Local Data
```bash
# Export all data
pg_dump -U postgres -d resume_screening_db > local_backup.sql

# Or export specific tables
pg_dump -U postgres -d resume_screening_db -t users -t resumes -t jobs -t matches > data_only.sql
```

### Step 2: Setup Neon Database
1. Create Neon project
2. Get connection string
3. Update `.env` with Neon URL

### Step 3: Push Schema to Neon
```bash
# Update DATABASE_URL in .env to Neon
DATABASE_URL="postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require"

# Push schema
npx prisma db push

# Or run migrations
npx prisma migrate deploy
```

### Step 4: Import Data to Neon
```bash
# Import data
psql "postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require" < local_backup.sql

# Or use Prisma Studio to manually copy important data
npm run db:studio
```

---

## ✅ Post-Migration Checklist

- [ ] All tables created successfully
- [ ] Enums created
- [ ] Foreign keys working
- [ ] Cascade deletes configured
- [ ] Indexes created
- [ ] Test data seeded (optional)
- [ ] Application starts without errors
- [ ] Can create email logs
- [ ] Can update pipeline stages
- [ ] Can add notes

---

## 🧪 Test Migration

### Test Email Logs
```bash
# Start app
npm run dev

# Test API
curl -X POST http://localhost:3000/api/email/send \
  -H "Content-Type: application/json" \
  -d '{"matchId":"test_id","type":"SHORTLISTED"}'
```

### Test Pipeline
```bash
# Update stage
curl -X PUT http://localhost:3000/api/pipeline/update-stage \
  -H "Content-Type: application/json" \
  -d '{"matchId":"test_id","stage":"REVIEWED"}'
```

### Test Notes
```bash
# Create note
curl -X POST http://localhost:3000/api/notes \
  -H "Content-Type: application/json" \
  -d '{"matchId":"test_id","content":"Test note"}'
```

---

## 📝 Notes

- **Development**: Use `npx prisma db push` (faster, no migration files)
- **Production**: Use `npx prisma migrate deploy` (with migration files)
- **Backup**: Always backup before migration
- **Test**: Test on staging before production

---

## 🆘 Need Help?

If migration fails:
1. Check error message carefully
2. Verify database connection
3. Check Prisma schema syntax
4. Review migration SQL
5. Check database logs

---

**Ready to migrate! 🚀**

Run these commands when database is ready:
```bash
npm run db:generate
npx prisma db push
npm run db:seed  # optional
npm run dev
```
