# Quick Start Guide - Job Management + AI Matching

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies
```bash
cd resume-screening-app
npm install
```

### Step 2: Configure Environment
Create `.env` file:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/resume_screening"
GROQ_API_KEY="gsk_your_api_key_here"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

### Step 3: Setup Database
```bash
npm run db:generate
npm run db:migrate
```

### Step 4: Start Development Server
```bash
npm run dev
```

Visit: **http://localhost:3000**

---

## 📋 Complete Workflow Example

### 1. Register/Login
- Navigate to `/login` or `/register`
- Create an account or login

### 2. Upload Resumes
- Go to **Dashboard → Resumes**
- Click "Upload Resume"
- Select PDF/DOCX files
- AI extracts candidate data automatically

### 3. Create a Job
- Go to **Dashboard → Jobs**
- Click "Add Job"
- Fill in details:
  ```
  Title: Senior React Developer
  Company: Tech Startup Inc
  Location: San Francisco, CA
  Type: Full-time
  Experience: 5 years
  
  Required Skills:
  - React
  - TypeScript
  - Node.js
  - REST APIs
  
  Optional Skills:
  - GraphQL
  - AWS
  - Docker
  
  Description:
  We're looking for an experienced React developer to join our team...
  
  Status: OPEN
  ```
- Click "Create Job"

### 4. Run AI Matching
- From Jobs list, click "Match" button
- Or open job detail and click "Run Match"
- Wait 30-60 seconds for AI analysis
- View success notification

### 5. Review Candidates
- See ranked list of candidates
- Top candidates appear first
- View scores, skill matches, recommendations
- Click "View" to see detailed analysis

### 6. Analyze Match Details
Modal shows:
- Overall score and skill match %
- Strengths (what makes them a good fit)
- Weaknesses (areas of concern)
- Matched skills (green badges)
- Missing skills (red badges)
- Experience relevance assessment
- Contact information
- Download resume button

### 7. Make Decision
- Review top 3-5 candidates
- Download their resumes
- Contact via email/phone
- Schedule interviews

---

## 🎯 Key Features Demo

### Feature 1: Smart Skill Matching
```
Job requires: React, TypeScript, Node.js
Candidate has: React, JavaScript, Node.js, Python

Result:
✅ Matched: React, Node.js
❌ Missing: TypeScript
➕ Extra: JavaScript, Python

Score: 75% (Good Fit)
```

### Feature 2: Experience Analysis
```
Job requires: 5 years experience
Candidate has: 6 years experience

AI Analysis:
"Candidate has relevant experience with 6 years in software 
development, including 4 years specifically with React. 
Experience level exceeds requirements."
```

### Feature 3: Recommendation Levels
- **Strong Fit (85-100%)**: Meets all requirements, highly recommended
- **Good Fit (65-84%)**: Meets most requirements, recommended
- **Moderate Fit (45-64%)**: Some gaps, consider with reservations
- **Weak Fit (0-44%)**: Significant gaps, not recommended

---

## 💡 Pro Tips

### Tip 1: Write Detailed Job Descriptions
Better descriptions = Better matches
```
❌ Bad: "Looking for a developer"
✅ Good: "Seeking a senior full-stack developer with 5+ years 
experience in React, Node.js, and PostgreSQL. Must have 
experience with microservices architecture and AWS deployment."
```

### Tip 2: Prioritize Required Skills
- Add must-have skills to "Required Skills"
- Add nice-to-have skills to "Optional Skills"
- AI weighs required skills more heavily

### Tip 3: Re-run Matches After Updates
- Updated job description? Re-run match
- Added new resumes? Re-run match
- Old matches are replaced with fresh analysis

### Tip 4: Use Status Effectively
- **DRAFT**: Job not ready, won't show in active listings
- **OPEN**: Actively recruiting, visible to all
- **CLOSED**: Position filled, archived

### Tip 5: Review Multiple Candidates
- Don't just interview #1
- Top 3-5 candidates often have similar scores
- Consider cultural fit, availability, salary expectations

---

## 🔍 Understanding Match Scores

### Score Breakdown
```
Overall Score = Weighted Average of:
- Required Skills Match (40%)
- Experience Relevance (30%)
- Optional Skills Match (15%)
- Education & Projects (15%)
```

### What Each Score Means

**90-100%**: Perfect match
- Has all required skills
- Experience exceeds requirements
- Strong relevant background
- **Action**: Interview immediately

**75-89%**: Excellent candidate
- Has most required skills
- Experience meets requirements
- Good relevant background
- **Action**: Definitely interview

**60-74%**: Good candidate
- Has core required skills
- Experience close to requirements
- Some gaps but trainable
- **Action**: Consider interviewing

**45-59%**: Marginal candidate
- Missing some required skills
- Experience below requirements
- Significant gaps
- **Action**: Interview only if desperate

**Below 45%**: Poor match
- Missing most required skills
- Insufficient experience
- Not a good fit
- **Action**: Pass

---

## 📊 Sample Output

### Example Match Result
```
Candidate: John Doe
Email: john.doe@email.com
Phone: (555) 123-4567

Overall Score: 87%
Skill Match: 90%
Experience: 6 years

Recommendation: Strong Fit

Strengths:
✓ Extensive React experience with 5+ years
✓ Strong TypeScript skills demonstrated in recent projects
✓ Led team of 4 developers in previous role
✓ Experience with AWS and cloud deployment

Weaknesses:
⚠ Limited GraphQL experience
⚠ No Docker/containerization background

Matched Skills:
React, TypeScript, Node.js, REST APIs, AWS

Missing Skills:
GraphQL, Docker

Experience Relevance:
"Candidate has 6 years of relevant experience as a full-stack 
developer, with the last 3 years focused specifically on React 
and TypeScript. Led development of multiple production 
applications serving 100k+ users."
```

---

## 🛠️ Troubleshooting

### No Matches Appearing?
1. Check if resumes are uploaded
2. Verify job has required skills
3. Check console for errors
4. Ensure GROQ_API_KEY is valid

### Low Match Scores?
1. Review job requirements (too strict?)
2. Check resume quality (AI extraction worked?)
3. Consider adjusting required vs optional skills

### Slow Matching?
- Normal for 10+ resumes (30-60 seconds)
- AI processes each resume individually
- Concurrency limited to avoid rate limits

### API Errors?
1. Check Groq API key is valid
2. Verify API quota not exceeded
3. Check internet connection
4. Review API logs in console

---

## 🎓 Learning Resources

### Understanding the AI
- Model: llama-3.3-70b-versatile (Groq)
- Context: 8K tokens per resume
- Temperature: 0.1 (consistent results)
- Output: Structured JSON

### Best Practices
1. Upload quality resumes (clear formatting)
2. Write detailed job descriptions
3. Use specific skill names
4. Review multiple candidates
5. Re-run matches periodically

### Next Steps
- Explore analytics dashboard
- Set up email notifications
- Integrate with ATS
- Customize scoring weights
- Add interview scheduling

---

## 📞 Support

Need help?
- Check documentation: `JOBS_MATCHING_MODULE.md`
- Review migration guide: `MIGRATION_GUIDE.md`
- Check API logs in terminal
- Verify environment variables

---

## ✅ Success Checklist

- [ ] Database connected
- [ ] Resumes uploaded
- [ ] Job created
- [ ] Match run successfully
- [ ] Results visible
- [ ] Detail modal works
- [ ] Resume download works
- [ ] Ready to hire! 🎉

---

**Happy Hiring! 🚀**
