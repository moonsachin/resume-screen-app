# Quick Start - Dashboard Analytics

## 🚀 Get Started in 2 Minutes

### Step 1: Install Dependencies
```bash
cd resume-screening-app
npm install
```

The `recharts` library is already included in package.json.

### Step 2: Start Development Server
```bash
npm run dev
```

Visit: **http://localhost:3000/dashboard**

---

## 📊 Feature Walkthrough

### 1. View Dashboard Analytics

**Navigate to Dashboard:**
```
http://localhost:3000/dashboard
```

**What You'll See:**
- 8 KPI cards with real-time metrics
- 4 interactive charts:
  - Resume upload trend (last 30 days)
  - Match score distribution
  - Top 10 skills frequency
  - Jobs by status (pie chart)
- Recent activity feed

**Interact with Charts:**
- Hover over data points for details
- Charts are responsive (resize browser)
- All data updates on page refresh

---

### 2. Use Global Search

**Access Search:**
- Look at top navbar (center)
- Click search bar
- Or press `/` (keyboard shortcut - future)

**Search Examples:**
```
"john"          → Finds candidates named John
"react"         → Finds candidates with React skill
"engineer"      → Finds jobs with "engineer" in title
"acme"          → Finds jobs at Acme company
```

**Search Results:**
- Grouped by category (Candidates, Jobs)
- Up to 10 results per category
- Click result to navigate
- Press Esc to close

---

### 3. Filter Match Results

**Navigate to Matches:**
```
/dashboard/matches/{jobId}
```

**Apply Filters:**
1. Click "Filters" button (top right)
2. Set criteria:
   ```
   Score Range: 70 - 100
   Experience: 3 - 7 years
   Has Skill: React
   Missing Skill: TypeScript
   Recommendation: Strong Fit
   ```
3. Click "Apply Filters"
4. View filtered results

**Filter Features:**
- Filters show in URL (shareable)
- Clear all filters with one click
- Active filter count badge
- Real-time table updates

**Example URLs:**
```
?scoreMin=70&scoreMax=100
?experienceMin=3&experienceMax=7
?requiredSkill=react
?recommendation=Strong%20Fit
```

---

### 4. Export to CSV

**From Matches Page:**
1. (Optional) Apply filters
2. Click "Export CSV" button
3. Wait for download (1-2 seconds)
4. Open in Excel/Google Sheets

**Export Options:**
```
All matches:        /api/export/candidates?jobId=123
Filtered:           /api/export/candidates?jobId=123&scoreMin=70
Top 10:             /api/export/candidates?jobId=123&limit=10
By recommendation:  /api/export/candidates?recommendation=Strong%20Fit
```

**CSV Contains:**
- Rank
- Candidate Name
- Email
- Phone
- Score
- Skill Match %
- Experience
- Recommendation
- Missing Skills
- Job Title
- Company

---

## 💡 Pro Tips

### Dashboard Tips

**Tip 1: Monitor Key Metrics**
- Check "Strong Fit Candidates" daily
- Track "This Week Uploads" for sourcing
- Watch "Average Match Score" for quality

**Tip 2: Use Charts for Insights**
- Upload trend shows sourcing effectiveness
- Score distribution reveals quality issues
- Top skills guide job requirements

**Tip 3: Identify Top Talent**
- "Top Candidate" card shows best match
- Click to view full profile
- Reach out immediately

---

### Search Tips

**Tip 1: Search Smart**
- Use partial names: "joh" finds "John", "Johnson"
- Search by skill: "react" finds all React developers
- Search by company: "google" finds all Google jobs

**Tip 2: Navigate Fast**
- Search is faster than browsing
- Use for quick candidate lookup
- Great for team collaboration

**Tip 3: Search Scope**
- Searches name, email, summary (candidates)
- Searches title, company, description (jobs)
- Case-insensitive, partial matching

---

### Filter Tips

**Tip 1: Combine Filters**
```
Score: 80-100
Experience: 5+ years
Has Skill: React
Recommendation: Strong Fit
```
Result: Senior React developers with excellent matches

**Tip 2: Share Filtered Views**
- Copy URL after applying filters
- Send to team members
- Everyone sees same filtered results

**Tip 3: Use Missing Skills**
- Find candidates missing specific skills
- Identify training needs
- Plan skill development

**Tip 4: Filter by Recommendation**
- "Strong Fit" for immediate interviews
- "Good Fit" for consideration
- "Moderate Fit" for backup pipeline

---

### Export Tips

**Tip 1: Export Filtered Results**
- Apply filters first
- Then export
- Only exports visible candidates

**Tip 2: Export Top Candidates**
- Add `?limit=10` to URL
- Gets top 10 by score
- Perfect for quick review

**Tip 3: Use CSV for Analysis**
- Import to Excel
- Create pivot tables
- Generate reports
- Share with stakeholders

**Tip 4: Regular Exports**
- Export weekly for tracking
- Compare over time
- Measure improvement

---

## 🎯 Common Workflows

### Workflow 1: Daily Recruiter Routine

```
1. Check Dashboard
   - View new uploads (This Week)
   - Check strong fit count
   - Review top candidate

2. Search for Specific Skills
   - Use global search
   - Find "senior react developer"
   - Review profiles

3. Filter High-Quality Matches
   - Score: 85-100
   - Recommendation: Strong Fit
   - Export top 10

4. Contact Candidates
   - Use exported CSV
   - Email/call top candidates
   - Schedule interviews
```

---

### Workflow 2: Weekly Hiring Review

```
1. Review Dashboard Charts
   - Upload trend (sourcing effectiveness)
   - Score distribution (quality check)
   - Top skills (market insights)

2. Analyze Each Job
   - Navigate to matches page
   - Filter by score range
   - Identify strong candidates

3. Export Reports
   - Export all strong fits
   - Share with hiring managers
   - Track progress

4. Plan Next Week
   - Identify skill gaps
   - Adjust sourcing strategy
   - Set hiring goals
```

---

### Workflow 3: Candidate Shortlisting

```
1. Navigate to Job Matches
   - Select specific job
   - View all candidates

2. Apply Filters
   - Score: 75-100
   - Experience: 3-7 years
   - Has Skill: Required tech stack
   - Recommendation: Strong/Good Fit

3. Review Filtered Results
   - Check top 5-10 candidates
   - View detailed match analysis
   - Download resumes

4. Export Shortlist
   - Export filtered results
   - Share with team
   - Schedule interviews
```

---

## 📊 Sample Data Insights

### Dashboard Metrics Example
```
Total Resumes: 150
Total Jobs: 12
Total Matches: 450
Average Match Score: 68%
Strong Fit Candidates: 45
This Week Uploads: 23
Open Jobs: 8
Top Candidate: John Doe (92%)
```

### Chart Insights Example

**Resume Upload Trend:**
```
Mon: 5 uploads
Tue: 8 uploads
Wed: 12 uploads (peak)
Thu: 7 uploads
Fri: 4 uploads
```
Insight: Wednesday is best sourcing day

**Match Score Distribution:**
```
0-25%: 15 candidates (poor matches)
26-50%: 45 candidates (weak matches)
51-75%: 120 candidates (good matches)
76-100%: 70 candidates (excellent matches)
```
Insight: 28% are excellent matches

**Top Skills:**
```
1. JavaScript (85 candidates)
2. React (72 candidates)
3. Node.js (65 candidates)
4. Python (58 candidates)
5. TypeScript (52 candidates)
```
Insight: JavaScript ecosystem dominates

---

## 🔍 Troubleshooting

### Dashboard Not Loading?
```bash
# Check database connection
npm run db:studio

# Regenerate Prisma client
npm run db:generate

# Restart dev server
npm run dev
```

### Search Not Working?
- Check minimum 2 characters entered
- Verify database has data
- Check browser console for errors
- Ensure session is valid

### Filters Not Applying?
- Click "Apply Filters" button
- Check URL for filter params
- Verify data matches filter criteria
- Clear filters and try again

### Export Failing?
- Check if matches exist
- Verify filter criteria
- Check browser download settings
- Try exporting without filters

---

## ✅ Success Checklist

- [ ] Dashboard loads with 8 KPI cards
- [ ] All 4 charts display correctly
- [ ] Global search returns results
- [ ] Filters apply and update URL
- [ ] CSV export downloads successfully
- [ ] Charts are interactive (hover works)
- [ ] Search dropdown closes on click outside
- [ ] Filter count badge shows correctly
- [ ] Export filename includes job title
- [ ] Mobile responsive (test on phone)

---

## 🎉 You're Ready!

You now have a powerful analytics dashboard with:
- Real-time KPI tracking
- Interactive data visualization
- Fast global search
- Flexible filtering
- Easy CSV export

**Start recruiting smarter! 🚀**

---

## 📞 Need Help?

- Check full documentation: `DASHBOARD_ANALYTICS.md`
- Review API docs: `IMPLEMENTATION_SUMMARY.md`
- Check troubleshooting: This file
- Review code examples: Component files

---

*Happy Recruiting! 🎯*
