# Production Deployment Guide

## 🚀 Deploy to Vercel + Neon Database

This guide will help you deploy the AI Resume Screening App to production using Vercel (hosting) and Neon (PostgreSQL database).

---

## Prerequisites

- GitHub account
- Vercel account (free tier available)
- Neon account (free tier available)
- Groq API key
- Resend API key (for emails)

---

## Step 1: Setup Neon Database

### 1.1 Create Neon Account
1. Go to [https://neon.tech](https://neon.tech)
2. Sign up with GitHub or email
3. Verify your email

### 1.2 Create Database
1. Click "Create Project"
2. Choose a name: `resume-screening-db`
3. Select region (closest to your users)
4. Click "Create Project"

### 1.3 Get Connection String
1. In your Neon dashboard, click "Connection Details"
2. Copy the connection string
3. It looks like:
   ```
   postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
4. Save this for later

### 1.4 Configure Database
```sql
-- Neon automatically creates a database
-- No additional configuration needed
```

---

## Step 2: Setup Vercel Project

### 2.1 Push Code to GitHub
```bash
cd resume-screening-app
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/resume-screening-app.git
git push -u origin main
```

### 2.2 Import to Vercel
1. Go to [https://vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Select "resume-screening-app"

### 2.3 Configure Build Settings
Vercel will auto-detect Next.js. Verify:
- **Framework Preset**: Next.js
- **Build Command**: `prisma generate && next build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

---

## Step 3: Configure Environment Variables

### 3.1 Add Environment Variables in Vercel
In Vercel project settings → Environment Variables, add:

#### Database
```
DATABASE_URL = postgresql://user:password@ep-xxx.neon.tech/neondb?sslmode=require
```
(Use your Neon connection string)

#### Groq API
```
GROQ_API_KEY = gsk_your_groq_api_key_here
```
Get from: [https://console.groq.com](https://console.groq.com)

#### Resend Email
```
RESEND_API_KEY = re_your_resend_api_key_here
```
Get from: [https://resend.com](https://resend.com)

#### NextAuth
```
NEXTAUTH_SECRET = your-generated-secret-here
NEXTAUTH_URL = https://your-app.vercel.app
```

Generate secret:
```bash
openssl rand -base64 32
```

### 3.2 Environment Variable Scopes
- Set all variables for: **Production**, **Preview**, and **Development**
- This ensures consistency across environments

---

## Step 4: Run Database Migrations

### 4.1 Install Vercel CLI
```bash
npm install -g vercel
```

### 4.2 Login to Vercel
```bash
vercel login
```

### 4.3 Link Project
```bash
cd resume-screening-app
vercel link
```

### 4.4 Pull Environment Variables
```bash
vercel env pull .env.local
```

### 4.5 Run Migrations
```bash
# Generate Prisma Client
npx prisma generate

# Push schema to Neon database
npx prisma db push

# Or run migrations
npx prisma migrate deploy
```

### 4.6 Seed Database (Optional)
```bash
npm run db:seed
```

---

## Step 5: Deploy Application

### 5.1 Deploy to Production
```bash
vercel --prod
```

Or push to GitHub main branch (auto-deploys).

### 5.2 Verify Deployment
1. Visit your Vercel URL: `https://your-app.vercel.app`
2. Check deployment logs in Vercel dashboard
3. Test login functionality
4. Upload a test resume
5. Create a test job
6. Run AI matching

---

## Step 6: Post-Deployment Configuration

### 6.1 Custom Domain (Optional)
1. In Vercel project settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Update `NEXTAUTH_URL` environment variable

### 6.2 Configure Email Domain (Resend)
1. Go to Resend dashboard
2. Add and verify your domain
3. Update email `from` address in code
4. Test email sending

### 6.3 Setup Monitoring
1. Enable Vercel Analytics
2. Configure error tracking (Sentry)
3. Set up uptime monitoring

---

## Environment Variables Reference

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | Neon PostgreSQL connection string | `postgresql://...` |
| `GROQ_API_KEY` | Groq API key for AI matching | `gsk_...` |
| `RESEND_API_KEY` | Resend API key for emails | `re_...` |
| `NEXTAUTH_SECRET` | NextAuth secret key | `random-32-char-string` |
| `NEXTAUTH_URL` | Your app URL | `https://your-app.vercel.app` |

### Optional Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `SENTRY_DSN` | Sentry error tracking | `https://...` |
| `NODE_ENV` | Environment | `production` |

---

## Troubleshooting

### Database Connection Issues

**Error**: "Can't reach database server"
```bash
# Check connection string format
# Ensure ?sslmode=require is included
# Verify Neon database is active
```

**Solution**:
1. Check Neon dashboard for database status
2. Verify connection string is correct
3. Ensure SSL mode is enabled

### Build Failures

**Error**: "Prisma Client not generated"
```bash
# Add to build command
prisma generate && next build
```

**Error**: "Module not found"
```bash
# Clear cache and rebuild
vercel --force
```

### Email Not Sending

**Error**: "Email service not configured"
```bash
# Verify RESEND_API_KEY is set
# Check Resend dashboard for API key status
# Verify domain is verified (for custom domains)
```

### Migration Issues

**Error**: "Migration failed"
```bash
# Reset database (WARNING: deletes data)
npx prisma migrate reset

# Or push schema without migration
npx prisma db push --force-reset
```

---

## Performance Optimization

### 1. Enable Caching
```typescript
// In API routes
export const revalidate = 60; // Cache for 60 seconds
```

### 2. Optimize Images
```typescript
// Use Next.js Image component
import Image from 'next/image';
```

### 3. Database Indexing
```prisma
// Already configured in schema.prisma
@@index([resumeId, jobId])
```

### 4. Enable Compression
```javascript
// next.config.ts
compress: true
```

---

## Security Checklist

- [ ] Environment variables set correctly
- [ ] NEXTAUTH_SECRET is strong (32+ characters)
- [ ] Database uses SSL (`?sslmode=require`)
- [ ] API keys are not in code
- [ ] CORS configured properly
- [ ] Rate limiting enabled (future)
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention (Prisma)
- [ ] XSS prevention (React)

---

## Monitoring & Maintenance

### Daily Checks
- [ ] Check Vercel deployment status
- [ ] Monitor error logs
- [ ] Check database usage (Neon dashboard)
- [ ] Verify email delivery

### Weekly Tasks
- [ ] Review performance metrics
- [ ] Check API usage (Groq, Resend)
- [ ] Update dependencies
- [ ] Backup database

### Monthly Tasks
- [ ] Security audit
- [ ] Performance optimization
- [ ] Cost review
- [ ] Feature planning

---

## Scaling Considerations

### Database (Neon)
- **Free Tier**: 0.5 GB storage, 100 hours compute
- **Pro Tier**: 10 GB storage, unlimited compute
- **Upgrade**: When approaching limits

### Hosting (Vercel)
- **Hobby**: Free, 100 GB bandwidth
- **Pro**: $20/month, 1 TB bandwidth
- **Upgrade**: When traffic increases

### Email (Resend)
- **Free**: 100 emails/day
- **Pro**: $20/month, 50k emails/month
- **Upgrade**: When sending more emails

---

## Backup Strategy

### Database Backups (Neon)
```bash
# Neon provides automatic backups
# Access via Neon dashboard → Backups

# Manual backup
pg_dump $DATABASE_URL > backup.sql

# Restore
psql $DATABASE_URL < backup.sql
```

### Code Backups
- GitHub repository (automatic)
- Vercel deployment history
- Local development backups

---

## Rollback Procedure

### If Deployment Fails

1. **Instant Rollback** (Vercel)
   ```bash
   vercel rollback
   ```

2. **Revert to Previous Deployment**
   - Go to Vercel dashboard
   - Select previous deployment
   - Click "Promote to Production"

3. **Database Rollback**
   ```bash
   # Restore from Neon backup
   # Or run previous migration
   npx prisma migrate resolve --rolled-back {migration_name}
   ```

---

## Cost Estimation

### Free Tier (Suitable for MVP)
- **Vercel**: Free (Hobby plan)
- **Neon**: Free (0.5 GB, 100 hours)
- **Groq**: Free tier available
- **Resend**: Free (100 emails/day)
- **Total**: $0/month

### Production (Small Team)
- **Vercel Pro**: $20/month
- **Neon Pro**: $19/month
- **Groq**: Pay-as-you-go (~$10/month)
- **Resend Pro**: $20/month
- **Total**: ~$70/month

### Production (Growing Company)
- **Vercel Team**: $20/user/month
- **Neon Scale**: $69/month
- **Groq**: ~$50/month
- **Resend Business**: $80/month
- **Total**: ~$200-300/month

---

## Support & Resources

### Documentation
- [Vercel Docs](https://vercel.com/docs)
- [Neon Docs](https://neon.tech/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)

### Community
- [Vercel Discord](https://vercel.com/discord)
- [Next.js Discord](https://nextjs.org/discord)
- [Prisma Slack](https://slack.prisma.io)

### Support
- Vercel: support@vercel.com
- Neon: support@neon.tech
- Groq: support@groq.com
- Resend: support@resend.com

---

## ✅ Deployment Checklist

### Pre-Deployment
- [ ] Code pushed to GitHub
- [ ] Environment variables documented
- [ ] Database schema finalized
- [ ] API keys obtained
- [ ] Domain purchased (optional)

### Deployment
- [ ] Neon database created
- [ ] Vercel project created
- [ ] Environment variables set
- [ ] Database migrated
- [ ] Application deployed
- [ ] Custom domain configured (optional)

### Post-Deployment
- [ ] Test all features
- [ ] Verify email sending
- [ ] Check AI matching
- [ ] Monitor error logs
- [ ] Set up monitoring
- [ ] Configure backups

### Go-Live
- [ ] Announce to users
- [ ] Monitor closely for 24 hours
- [ ] Be ready to rollback
- [ ] Collect feedback
- [ ] Plan improvements

---

## 🎉 You're Live!

Your AI Resume Screening App is now deployed to production!

**Next Steps:**
1. Share your app URL with users
2. Monitor performance and errors
3. Collect user feedback
4. Plan feature improvements
5. Scale as needed

**Need Help?**
- Check troubleshooting section
- Review documentation
- Contact support
- Join community forums

---

*Last Updated: 2026-04-28*
*Version: 1.0.0*
