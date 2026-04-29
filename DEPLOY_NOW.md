# 🚀 Quick Deployment Guide

## ✅ Changes Made:
- ❌ Removed `vercel.json` (was causing secret reference issue)
- ✅ Changed `DATABASE_URL` → `DB_CONNECTION_STRING`
- ✅ Updated all config files

---

## 📋 Environment Variables (Use These Names):

```
DB_CONNECTION_STRING
NEXTAUTH_SECRET
NEXTAUTH_URL
GROQ_API_KEY
UPLOAD_DIR
MAX_FILE_SIZE_MB
NEXT_PUBLIC_MAX_FILE_SIZE_MB
RESEND_API_KEY
```

---

## 🎯 Deployment Steps:

### Step 1: Commit & Push
```bash
git add .
git commit -m "Fix: Remove vercel.json and rename DATABASE_URL"
git push origin main
```

### Step 2: Deploy on Vercel/Netlify
- Import repository
- Root Directory: `resume-screen-app`
- Add environment variables manually
- Deploy

---

## 🔐 Environment Variable Values:

Get from your `.env` file - DO NOT commit this file!

---

**Note:** `DATABASE_URL` is now `DB_CONNECTION_STRING` everywhere!
