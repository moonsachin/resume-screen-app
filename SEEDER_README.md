# Database Seeder

This seeder populates your database with sample data for development and testing.

## What Gets Seeded

### Users (3)
- **Admin**: admin@resumeai.com / password123
- **Recruiter 1**: sarah@resumeai.com / password123
- **Recruiter 2**: mike@resumeai.com / password123

### Resumes (6)
1. **John Doe** - Senior Full Stack Developer (5 years)
   - Skills: JavaScript, TypeScript, React, Node.js, PostgreSQL, AWS, Docker
   
2. **Jane Smith** - Frontend Developer (3 years)
   - Skills: React, JavaScript, CSS, Tailwind, Figma, TypeScript, Next.js
   
3. **Alex Kumar** - Backend Engineer (6 years)
   - Skills: Python, Django, FastAPI, PostgreSQL, Redis, Kubernetes, AWS
   
4. **Maria Garcia** - DevOps Engineer (4 years)
   - Skills: Docker, Kubernetes, Jenkins, Terraform, AWS, Python, Bash
   
5. **David Lee** - Mobile Developer (4 years)
   - Skills: React Native, Flutter, JavaScript, Dart, Firebase, iOS, Android
   
6. **Emily Brown** - Junior Full Stack Developer (1 year)
   - Skills: JavaScript, React, Node.js, MongoDB, HTML, CSS

### Jobs (6)
1. **Senior Full Stack Developer** @ TechCorp Inc. - $120k-$180k
2. **Frontend Developer** @ DesignHub - $90k-$130k
3. **Backend Engineer** @ DataFlow Systems - $130k-$190k
4. **DevOps Engineer** @ CloudScale - $110k-$160k
5. **Mobile Developer** @ AppVentures - $100k-$150k
6. **Junior Full Stack Developer** @ StartupXYZ - $60k-$80k

### Matches (7)
AI-generated matches between resumes and jobs with:
- Match scores (78-96%)
- Skill match percentages
- Matched and missing skills
- Strengths and weaknesses
- Experience relevance
- Recommendations (Strong Fit, Moderate Fit, Good Fit)

### Pipeline Entries (5)
Candidates in various hiring stages:
- Shortlisted (2)
- Interview Scheduled (1)
- Interviewed (1)
- Reviewed (1)

### Notes (4)
Recruiter notes on candidates with feedback and observations

## How to Run

### First Time Setup
```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Run seeder
npm run db:seed
```

### Re-seed Database
```bash
# This will clear all existing data and re-populate
npm run db:seed
```

### Alternative Commands
```bash
# Using npx directly
npx tsx prisma/seed.ts

# Using Prisma's built-in seed command
npx prisma db seed
```

## Important Notes

⚠️ **Warning**: Running the seeder will **DELETE ALL EXISTING DATA** in the following tables:
- notes
- candidate_pipeline
- email_logs
- matches
- resumes
- jobs
- users

🔒 **Security**: All seeded passwords are hashed using bcrypt with 10 salt rounds.

📝 **Development Only**: This seeder is intended for development and testing environments only. Do not run in production!

## Customization

To customize the seed data, edit `prisma/seed.ts`:

```typescript
// Add more users
const newUser = await prisma.user.create({
  data: {
    name: 'Your Name',
    email: 'your@email.com',
    password: hashedPassword,
    role: Role.RECRUITER,
  },
});

// Add more resumes, jobs, matches, etc.
```

## Troubleshooting

### Error: PrismaClient not initialized
```bash
# Regenerate Prisma client
npx prisma generate
```

### Error: Database connection failed
```bash
# Check your .env file has correct DATABASE_URL
# Verify PostgreSQL is running
# Test connection: npx prisma db pull
```

### Error: Migration not applied
```bash
# Apply pending migrations
npx prisma migrate dev
```

### TypeScript errors
```bash
# Install tsx if not installed
npm install -D tsx

# Regenerate Prisma client
npx prisma generate
```

## Database Schema

The seeder works with the following models:
- User (with Role: ADMIN, RECRUITER)
- Resume (candidate information and skills)
- Job (job postings with requirements)
- Match (AI matching results)
- EmailLog (email communication history)
- CandidatePipeline (hiring stage tracking)
- Note (recruiter notes on candidates)

## Next Steps After Seeding

1. **Start the development server**
   ```bash
   npm run dev
   ```

2. **Login with seeded credentials**
   - Visit http://localhost:3000/login
   - Use any of the seeded user credentials

3. **Explore the features**
   - View dashboard analytics
   - Browse resumes and jobs
   - Check AI match results
   - Test the hiring pipeline
   - Add recruiter notes
   - Send test emails

4. **Test AI matching**
   - Create a new job
   - Run AI matching against seeded resumes
   - Compare results with seeded matches

## Production Deployment

For production:
1. **Do NOT run the seeder** in production
2. Use proper user registration flow
3. Import real resume data
4. Create actual job postings
5. Let AI generate real matches

## Support

If you encounter issues:
1. Check the error message carefully
2. Verify your `.env` file configuration
3. Ensure PostgreSQL is running
4. Check Prisma migration status: `npx prisma migrate status`
5. Review the seeder code in `prisma/seed.ts`

---

**Last Updated**: 2026-04-28  
**Prisma Version**: 7.8.0  
**Node Version**: 22.17.0
