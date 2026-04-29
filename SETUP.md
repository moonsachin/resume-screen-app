# Quick Setup Guide

## Step-by-Step Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup PostgreSQL Database

**Option A: Local PostgreSQL**

Install PostgreSQL locally and create a database:

```sql
CREATE DATABASE resume_screening_db;
```

**Option B: Cloud Database (Recommended for quick start)**

Use a free PostgreSQL service like:
- [Neon](https://neon.tech) - Free tier with instant setup
- [Supabase](https://supabase.com) - Free tier with 500MB
- [Railway](https://railway.app) - Free tier available

### 3. Configure Environment Variables

Create `.env` file:

```bash
cp .env.example .env
```

Update the `DATABASE_URL` in `.env`:

```env
# Example for local PostgreSQL
DATABASE_URL="postgresql://postgres:password@localhost:5432/resume_screening_db"

# Example for Neon (cloud)
DATABASE_URL="postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb"

# Generate a secure secret for NextAuth
NEXTAUTH_SECRET="run: openssl rand -base64 32"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Initialize Database

```bash
# Generate Prisma Client
npm run db:generate

# Create database tables
npm run db:push

# Seed with test data (optional but recommended)
npm run db:seed
```

### 5. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### 6. Login with Test Account

After seeding, use these credentials:

**Admin:**
- Email: `admin@resumeapp.com`
- Password: `admin123`

**Recruiter:**
- Email: `recruiter@resumeapp.com`
- Password: `recruiter123`

## Troubleshooting

### Database Connection Issues

**Error: "Database does not exist"**
```bash
# Make sure the database is created
# For local PostgreSQL:
psql -U postgres
CREATE DATABASE resume_screening_db;
\q
```

**Error: "Connection refused"**
- Check if PostgreSQL is running
- Verify the connection string in `.env`
- Check firewall settings

### Prisma Issues

**Error: "Prisma Client not generated"**
```bash
npm run db:generate
```

**Error: "Migration failed"**
```bash
# Reset database (WARNING: deletes all data)
npx prisma migrate reset
npm run db:seed
```

### Build Issues

**Error: "Module not found"**
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
```

## Production Deployment

### Environment Variables for Production

```env
DATABASE_URL="your-production-database-url"
NEXTAUTH_SECRET="generate-a-new-secure-secret"
NEXTAUTH_URL="https://your-domain.com"
NODE_ENV="production"
```

### Deployment Platforms

**Vercel (Recommended)**
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

**Other Options:**
- Railway
- Render
- AWS/Azure/GCP
- Docker container

### Database Migrations in Production

```bash
# Run migrations (not db:push)
npm run db:migrate
```

## Next Steps

1. ✅ Complete setup and login
2. 📝 Explore the dashboard
3. 🔧 Customize the UI/branding
4. 🚀 Add resume upload functionality
5. 🤖 Implement AI matching logic
6. 📧 Add email notifications
7. 🎨 Enhance the design

## Need Help?

- Check the main [README.md](./README.md)
- Review Prisma docs: https://www.prisma.io/docs
- Review Next.js docs: https://nextjs.org/docs
- Review NextAuth docs: https://next-auth.js.org
