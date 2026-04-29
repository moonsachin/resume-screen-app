# 🔐 Login Credentials

## Test Accounts (Seeded Data)

### Admin Account
```
Email: admin@resumeai.com
Password: password123
Role: ADMIN
```

### Recruiter Accounts

**Recruiter 1 - Sarah Johnson**
```
Email: sarah@resumeai.com
Password: password123
Role: RECRUITER
```

**Recruiter 2 - Mike Chen**
```
Email: mike@resumeai.com
Password: password123
Role: RECRUITER
```

---

## Quick Login

| User | Email | Password | Role |
|------|-------|----------|------|
| Admin | admin@resumeai.com | password123 | ADMIN |
| Sarah | sarah@resumeai.com | password123 | RECRUITER |
| Mike | mike@resumeai.com | password123 | RECRUITER |

---

## Access URLs

- **Landing Page**: http://localhost:3000
- **Login**: http://localhost:3000/login
- **Register**: http://localhost:3000/register
- **Dashboard**: http://localhost:3000/dashboard

---

## Features Access

All users (Admin + Recruiters) can:
- ✅ Upload resumes (single & bulk)
- ✅ Create jobs
- ✅ Run AI matching
- ✅ View matches
- ✅ Manage pipeline
- ✅ Add notes
- ✅ Send emails
- ✅ Export data
- ✅ View analytics

---

## Database Seeded Data

### Users: 3
- 1 Admin
- 2 Recruiters

### Resumes: 6
1. John Doe - Senior Full Stack Developer (5 years)
2. Jane Smith - Frontend Developer (3 years)
3. Alex Kumar - Backend Engineer (6 years)
4. Maria Garcia - DevOps Engineer (4 years)
5. David Lee - Mobile Developer (4 years)
6. Emily Brown - Junior Full Stack Developer (1 year)

### Jobs: 6
1. Senior Full Stack Developer @ TechCorp Inc.
2. Frontend Developer @ DesignHub
3. Backend Engineer @ DataFlow Systems
4. DevOps Engineer @ CloudScale
5. Mobile Developer @ AppVentures
6. Junior Full Stack Developer @ StartupXYZ

### Matches: 7
Pre-matched resumes with jobs (scores 78-96%)

### Pipeline Entries: 5
Candidates in various stages

### Notes: 4
Sample recruiter notes

---

## How to Reset Data

```bash
# Re-run seeder to reset all data
npm run db:seed
```

---

## Production Setup

⚠️ **IMPORTANT**: Change these credentials before deploying to production!

1. Update passwords in database
2. Use strong passwords (16+ characters)
3. Enable 2FA if possible
4. Use environment-specific credentials

---

## Need Help?

- Forgot password? Use "Register" to create new account
- Database issues? Run `npm run db:seed`
- Login not working? Check `.env` file for `DATABASE_URL`

---

**Last Updated**: 2026-04-28
**Environment**: Development
**Status**: ✅ Active
