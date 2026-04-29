import 'dotenv/config';
import { PrismaClient, Role, JobStatus, EmploymentType, PipelineStage } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

const pool = new Pool({ connectionString: process.env.DB_CONNECTION_STRING });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data
  console.log('🗑️  Clearing existing data...');
  await prisma.note.deleteMany();
  await prisma.candidatePipeline.deleteMany();
  await prisma.emailLog.deleteMany();
  await prisma.match.deleteMany();
  await prisma.resume.deleteMany();
  await prisma.job.deleteMany();
  await prisma.user.deleteMany();

  // Create Users
  console.log('👤 Creating users...');
  const hashedPassword = await bcrypt.hash('password123', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@resumeai.com',
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });

  const recruiter1 = await prisma.user.create({
    data: {
      name: 'Sarah Johnson',
      email: 'sarah@resumeai.com',
      password: hashedPassword,
      role: Role.RECRUITER,
    },
  });

  const recruiter2 = await prisma.user.create({
    data: {
      name: 'Mike Chen',
      email: 'mike@resumeai.com',
      password: hashedPassword,
      role: Role.RECRUITER,
    },
  });

  console.log('✅ Created 3 users');

  // Create Resumes
  console.log('📄 Creating resumes...');
  const resumes = await Promise.all([
    prisma.resume.create({
      data: {
        candidateName: 'John Doe',
        email: 'john.doe@email.com',
        phone: '+1-555-0101',
        fileUrl: '/uploads/john-doe-resume.pdf',
        fileSize: 245000,
        fileType: 'application/pdf',
        extractedText: 'Senior Full Stack Developer with 5 years of experience...',
        skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'PostgreSQL', 'AWS', 'Docker'],
        experienceYears: 5,
        education: [
          {
            degree: 'Bachelor of Science in Computer Science',
            institution: 'MIT',
            year: 2018,
          },
        ],
        projects: [
          {
            name: 'E-commerce Platform',
            description: 'Built scalable e-commerce platform handling 10k+ daily users',
            technologies: ['React', 'Node.js', 'MongoDB'],
          },
        ],
        summary: 'Experienced full-stack developer specializing in modern web technologies',
      },
    }),
    prisma.resume.create({
      data: {
        candidateName: 'Jane Smith',
        email: 'jane.smith@email.com',
        phone: '+1-555-0102',
        fileUrl: '/uploads/jane-smith-resume.pdf',
        fileSize: 198000,
        fileType: 'application/pdf',
        extractedText: 'Frontend Developer with expertise in React and UI/UX...',
        skills: ['React', 'JavaScript', 'CSS', 'Tailwind', 'Figma', 'TypeScript', 'Next.js'],
        experienceYears: 3,
        education: [
          {
            degree: 'Bachelor of Arts in Design',
            institution: 'Stanford University',
            year: 2020,
          },
        ],
        projects: [
          {
            name: 'Design System',
            description: 'Created comprehensive design system for enterprise application',
            technologies: ['React', 'Storybook', 'Tailwind'],
          },
        ],
        summary: 'Creative frontend developer with strong design sensibility',
      },
    }),
    prisma.resume.create({
      data: {
        candidateName: 'Alex Kumar',
        email: 'alex.kumar@email.com',
        phone: '+1-555-0103',
        fileUrl: '/uploads/alex-kumar-resume.pdf',
        fileSize: 312000,
        fileType: 'application/pdf',
        extractedText: 'Backend Engineer specializing in microservices and cloud architecture...',
        skills: ['Python', 'Django', 'FastAPI', 'PostgreSQL', 'Redis', 'Kubernetes', 'AWS'],
        experienceYears: 6,
        education: [
          {
            degree: 'Master of Science in Computer Science',
            institution: 'Carnegie Mellon University',
            year: 2017,
          },
        ],
        projects: [
          {
            name: 'Microservices Platform',
            description: 'Architected and deployed microservices handling 1M+ requests/day',
            technologies: ['Python', 'Kubernetes', 'PostgreSQL'],
          },
        ],
        summary: 'Backend specialist with deep expertise in distributed systems',
      },
    }),
    prisma.resume.create({
      data: {
        candidateName: 'Maria Garcia',
        email: 'maria.garcia@email.com',
        phone: '+1-555-0104',
        fileUrl: '/uploads/maria-garcia-resume.pdf',
        fileSize: 267000,
        fileType: 'application/pdf',
        extractedText: 'DevOps Engineer with strong automation and CI/CD experience...',
        skills: ['Docker', 'Kubernetes', 'Jenkins', 'Terraform', 'AWS', 'Python', 'Bash'],
        experienceYears: 4,
        education: [
          {
            degree: 'Bachelor of Engineering in Software Engineering',
            institution: 'UC Berkeley',
            year: 2019,
          },
        ],
        projects: [
          {
            name: 'CI/CD Pipeline',
            description: 'Implemented automated deployment pipeline reducing release time by 70%',
            technologies: ['Jenkins', 'Docker', 'Kubernetes'],
          },
        ],
        summary: 'DevOps engineer passionate about automation and infrastructure as code',
      },
    }),
    prisma.resume.create({
      data: {
        candidateName: 'David Lee',
        email: 'david.lee@email.com',
        phone: '+1-555-0105',
        fileUrl: '/uploads/david-lee-resume.pdf',
        fileSize: 223000,
        fileType: 'application/pdf',
        extractedText: 'Mobile Developer with expertise in React Native and Flutter...',
        skills: ['React Native', 'Flutter', 'JavaScript', 'Dart', 'Firebase', 'iOS', 'Android'],
        experienceYears: 4,
        education: [
          {
            degree: 'Bachelor of Science in Software Engineering',
            institution: 'Georgia Tech',
            year: 2019,
          },
        ],
        projects: [
          {
            name: 'Fitness Tracking App',
            description: 'Built cross-platform mobile app with 50k+ downloads',
            technologies: ['React Native', 'Firebase', 'Redux'],
          },
        ],
        summary: 'Mobile developer focused on creating seamless cross-platform experiences',
      },
    }),
    prisma.resume.create({
      data: {
        candidateName: 'Emily Brown',
        email: 'emily.brown@email.com',
        phone: '+1-555-0106',
        fileUrl: '/uploads/emily-brown-resume.pdf',
        fileSize: 189000,
        fileType: 'application/pdf',
        extractedText: 'Junior Full Stack Developer eager to learn and grow...',
        skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'HTML', 'CSS'],
        experienceYears: 1,
        education: [
          {
            degree: 'Bachelor of Science in Computer Science',
            institution: 'University of Washington',
            year: 2022,
          },
        ],
        projects: [
          {
            name: 'Blog Platform',
            description: 'Created full-stack blog platform as capstone project',
            technologies: ['React', 'Node.js', 'MongoDB'],
          },
        ],
        summary: 'Recent graduate with strong fundamentals and passion for web development',
      },
    }),
  ]);

  console.log(`✅ Created ${resumes.length} resumes`);

  // Create Jobs
  console.log('💼 Creating jobs...');
  const jobs = await Promise.all([
    prisma.job.create({
      data: {
        title: 'Senior Full Stack Developer',
        company: 'TechCorp Inc.',
        location: 'San Francisco, CA (Remote)',
        employmentType: EmploymentType.FULL_TIME,
        experienceRequired: 5,
        requiredSkills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'PostgreSQL'],
        optionalSkills: ['AWS', 'Docker', 'Kubernetes', 'GraphQL'],
        salaryRange: '$120k - $180k',
        description: `We're looking for a Senior Full Stack Developer to join our growing team.

**Responsibilities:**
- Design and develop scalable web applications
- Lead technical discussions and code reviews
- Mentor junior developers
- Collaborate with product and design teams

**Requirements:**
- 5+ years of full-stack development experience
- Strong proficiency in React and Node.js
- Experience with PostgreSQL or similar databases
- Excellent problem-solving skills

**Benefits:**
- Competitive salary and equity
- Health, dental, and vision insurance
- Flexible work schedule
- Professional development budget`,
        status: JobStatus.OPEN,
      },
    }),
    prisma.job.create({
      data: {
        title: 'Frontend Developer',
        company: 'DesignHub',
        location: 'New York, NY (Hybrid)',
        employmentType: EmploymentType.FULL_TIME,
        experienceRequired: 3,
        requiredSkills: ['React', 'JavaScript', 'CSS', 'HTML'],
        optionalSkills: ['TypeScript', 'Tailwind', 'Next.js', 'Figma'],
        salaryRange: '$90k - $130k',
        description: `Join our creative team as a Frontend Developer!

**What You'll Do:**
- Build beautiful, responsive user interfaces
- Collaborate with designers to implement pixel-perfect designs
- Optimize application performance
- Write clean, maintainable code

**What We're Looking For:**
- 3+ years of frontend development experience
- Strong React skills
- Eye for design and attention to detail
- Experience with modern CSS frameworks

**Perks:**
- Creative and collaborative environment
- Latest tools and technologies
- Learning and development opportunities
- Flexible hybrid work model`,
        status: JobStatus.OPEN,
      },
    }),
    prisma.job.create({
      data: {
        title: 'Backend Engineer',
        company: 'DataFlow Systems',
        location: 'Austin, TX (Remote)',
        employmentType: EmploymentType.FULL_TIME,
        experienceRequired: 5,
        requiredSkills: ['Python', 'Django', 'PostgreSQL', 'Redis'],
        optionalSkills: ['Kubernetes', 'AWS', 'Microservices', 'GraphQL'],
        salaryRange: '$130k - $190k',
        description: `We're seeking an experienced Backend Engineer to build scalable systems.

**Key Responsibilities:**
- Design and implement backend services
- Optimize database queries and performance
- Build RESTful and GraphQL APIs
- Ensure system reliability and scalability

**Requirements:**
- 5+ years of backend development experience
- Expert-level Python and Django knowledge
- Strong database design skills
- Experience with distributed systems

**What We Offer:**
- Competitive compensation package
- Fully remote work environment
- Cutting-edge technology stack
- Collaborative team culture`,
        status: JobStatus.OPEN,
      },
    }),
    prisma.job.create({
      data: {
        title: 'DevOps Engineer',
        company: 'CloudScale',
        location: 'Seattle, WA (Remote)',
        employmentType: EmploymentType.FULL_TIME,
        experienceRequired: 4,
        requiredSkills: ['Docker', 'Kubernetes', 'AWS', 'Terraform'],
        optionalSkills: ['Jenkins', 'Python', 'Ansible', 'Prometheus'],
        salaryRange: '$110k - $160k',
        description: `Looking for a DevOps Engineer to manage our cloud infrastructure.

**Responsibilities:**
- Manage and optimize AWS infrastructure
- Build and maintain CI/CD pipelines
- Implement infrastructure as code
- Monitor system performance and reliability

**Requirements:**
- 4+ years of DevOps experience
- Strong Kubernetes and Docker skills
- Experience with AWS services
- Infrastructure as code expertise

**Benefits:**
- Remote-first company
- Professional development budget
- Health and wellness benefits
- Flexible PTO policy`,
        status: JobStatus.OPEN,
      },
    }),
    prisma.job.create({
      data: {
        title: 'Mobile Developer',
        company: 'AppVentures',
        location: 'Los Angeles, CA (Hybrid)',
        employmentType: EmploymentType.FULL_TIME,
        experienceRequired: 3,
        requiredSkills: ['React Native', 'JavaScript', 'iOS', 'Android'],
        optionalSkills: ['Flutter', 'TypeScript', 'Firebase', 'Redux'],
        salaryRange: '$100k - $150k',
        description: `Join our mobile team to build innovative apps!

**What You'll Build:**
- Cross-platform mobile applications
- Smooth, performant user experiences
- Integration with backend APIs
- App store deployments

**What We Need:**
- 3+ years of mobile development experience
- Strong React Native skills
- Published apps on App Store and Play Store
- Understanding of mobile design patterns

**Why Join Us:**
- Work on consumer-facing products
- Collaborative startup environment
- Equity compensation
- Hybrid work flexibility`,
        status: JobStatus.OPEN,
      },
    }),
    prisma.job.create({
      data: {
        title: 'Junior Full Stack Developer',
        company: 'StartupXYZ',
        location: 'Remote',
        employmentType: EmploymentType.FULL_TIME,
        experienceRequired: 1,
        requiredSkills: ['JavaScript', 'React', 'Node.js'],
        optionalSkills: ['TypeScript', 'MongoDB', 'Git'],
        salaryRange: '$60k - $80k',
        description: `Great opportunity for junior developers to grow!

**What You'll Learn:**
- Full-stack web development
- Agile development practices
- Code review and collaboration
- Modern development tools

**Requirements:**
- 1+ year of development experience or relevant bootcamp/degree
- Basic understanding of React and Node.js
- Eagerness to learn and grow
- Good communication skills

**What We Provide:**
- Mentorship from senior developers
- Learning and development opportunities
- Supportive team environment
- Remote work flexibility`,
        status: JobStatus.OPEN,
      },
    }),
  ]);

  console.log(`✅ Created ${jobs.length} jobs`);

  // Create Matches (AI matching results)
  console.log('🤝 Creating matches...');
  const matches = await Promise.all([
    // John Doe matches
    prisma.match.create({
      data: {
        resumeId: resumes[0].id,
        jobId: jobs[0].id,
        score: 92,
        skillMatchPercent: 95,
        matchedSkills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'PostgreSQL', 'AWS', 'Docker'],
        missingSkills: ['Kubernetes', 'GraphQL'],
        strengths: [
          'Strong full-stack experience with 5 years',
          'Excellent match for required tech stack',
          'Experience with cloud platforms (AWS)',
          'Built scalable systems handling high traffic',
        ],
        weaknesses: [
          'Missing Kubernetes experience',
          'No GraphQL mentioned in resume',
        ],
        experienceRelevance: 'Perfect match - 5 years experience matches requirement exactly',
        recommendation: 'Strong Fit',
      },
    }),
    prisma.match.create({
      data: {
        resumeId: resumes[0].id,
        jobId: jobs[1].id,
        score: 78,
        skillMatchPercent: 80,
        matchedSkills: ['JavaScript', 'React'],
        missingSkills: ['CSS expertise', 'Tailwind', 'Figma'],
        strengths: [
          'Strong React experience',
          'Full-stack background beneficial',
        ],
        weaknesses: [
          'More backend-focused than frontend',
          'Limited design tool experience',
        ],
        experienceRelevance: 'Overqualified - 5 years vs 3 required',
        recommendation: 'Moderate Fit',
      },
    }),
    // Jane Smith matches
    prisma.match.create({
      data: {
        resumeId: resumes[1].id,
        jobId: jobs[1].id,
        score: 95,
        skillMatchPercent: 98,
        matchedSkills: ['React', 'JavaScript', 'CSS', 'Tailwind', 'TypeScript', 'Next.js', 'Figma'],
        missingSkills: [],
        strengths: [
          'Perfect skill match for frontend role',
          'Strong design background',
          'Experience with modern CSS frameworks',
          'Built comprehensive design systems',
        ],
        weaknesses: [
          'Slightly less experience than preferred (3 vs 3+ years)',
        ],
        experienceRelevance: 'Excellent match - 3 years meets requirement',
        recommendation: 'Strong Fit',
      },
    }),
    // Alex Kumar matches
    prisma.match.create({
      data: {
        resumeId: resumes[2].id,
        jobId: jobs[2].id,
        score: 96,
        skillMatchPercent: 97,
        matchedSkills: ['Python', 'Django', 'PostgreSQL', 'Redis', 'Kubernetes', 'AWS'],
        missingSkills: ['GraphQL'],
        strengths: [
          'Extensive backend experience (6 years)',
          'Expert in Python and Django',
          'Strong distributed systems knowledge',
          'Experience with microservices architecture',
        ],
        weaknesses: [
          'No GraphQL experience mentioned',
        ],
        experienceRelevance: 'Excellent - 6 years exceeds 5 year requirement',
        recommendation: 'Strong Fit',
      },
    }),
    // Maria Garcia matches
    prisma.match.create({
      data: {
        resumeId: resumes[3].id,
        jobId: jobs[3].id,
        score: 94,
        skillMatchPercent: 96,
        matchedSkills: ['Docker', 'Kubernetes', 'AWS', 'Terraform', 'Python'],
        missingSkills: ['Jenkins', 'Ansible'],
        strengths: [
          'Strong DevOps background',
          'Excellent Kubernetes and Docker skills',
          'Infrastructure as code expertise',
          'Proven track record with CI/CD',
        ],
        weaknesses: [
          'No Jenkins experience (uses other CI tools)',
          'Missing Ansible experience',
        ],
        experienceRelevance: 'Perfect match - 4 years meets requirement',
        recommendation: 'Strong Fit',
      },
    }),
    // David Lee matches
    prisma.match.create({
      data: {
        resumeId: resumes[4].id,
        jobId: jobs[4].id,
        score: 91,
        skillMatchPercent: 93,
        matchedSkills: ['React Native', 'JavaScript', 'iOS', 'Android', 'Firebase'],
        missingSkills: ['Flutter', 'Redux'],
        strengths: [
          'Strong React Native experience',
          'Published apps with significant downloads',
          'Cross-platform expertise',
          'Experience with Firebase',
        ],
        weaknesses: [
          'No Flutter experience',
          'Redux not mentioned',
        ],
        experienceRelevance: 'Good match - 4 years exceeds 3 year requirement',
        recommendation: 'Strong Fit',
      },
    }),
    // Emily Brown matches
    prisma.match.create({
      data: {
        resumeId: resumes[5].id,
        jobId: jobs[5].id,
        score: 85,
        skillMatchPercent: 88,
        matchedSkills: ['JavaScript', 'React', 'Node.js'],
        missingSkills: ['TypeScript', 'MongoDB'],
        strengths: [
          'Recent graduate with fresh knowledge',
          'Strong fundamentals',
          'Built full-stack projects',
          'Eager to learn',
        ],
        weaknesses: [
          'Limited professional experience',
          'Missing TypeScript knowledge',
          'No MongoDB experience',
        ],
        experienceRelevance: 'Perfect match - 1 year meets requirement',
        recommendation: 'Good Fit',
      },
    }),
  ]);

  console.log(`✅ Created ${matches.length} matches`);

  // Create Pipeline entries for some matches
  console.log('📊 Creating pipeline entries...');
  await Promise.all([
    prisma.candidatePipeline.create({
      data: {
        matchId: matches[0].id,
        stage: PipelineStage.SHORTLISTED,
      },
    }),
    prisma.candidatePipeline.create({
      data: {
        matchId: matches[2].id,
        stage: PipelineStage.INTERVIEW_SCHEDULED,
      },
    }),
    prisma.candidatePipeline.create({
      data: {
        matchId: matches[3].id,
        stage: PipelineStage.INTERVIEWED,
      },
    }),
    prisma.candidatePipeline.create({
      data: {
        matchId: matches[4].id,
        stage: PipelineStage.SHORTLISTED,
      },
    }),
    prisma.candidatePipeline.create({
      data: {
        matchId: matches[5].id,
        stage: PipelineStage.REVIEWED,
      },
    }),
  ]);

  console.log('✅ Created 5 pipeline entries');

  // Create Notes
  console.log('📝 Creating notes...');
  await Promise.all([
    prisma.note.create({
      data: {
        matchId: matches[0].id,
        userId: recruiter1.id,
        content: 'Excellent candidate! Strong technical background and great communication skills during initial screening.',
      },
    }),
    prisma.note.create({
      data: {
        matchId: matches[0].id,
        userId: recruiter2.id,
        content: 'Reviewed portfolio - impressive projects. Recommend moving to technical interview.',
      },
    }),
    prisma.note.create({
      data: {
        matchId: matches[2].id,
        userId: recruiter1.id,
        content: 'Interview scheduled for next Tuesday at 2 PM. Candidate seems very enthusiastic about the role.',
      },
    }),
    prisma.note.create({
      data: {
        matchId: matches[3].id,
        userId: recruiter2.id,
        content: 'Technical interview completed. Strong problem-solving skills. Team feedback was very positive.',
      },
    }),
  ]);

  console.log('✅ Created 4 notes');

  console.log('\n🎉 Database seeding completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`   - Users: 3 (1 admin, 2 recruiters)`);
  console.log(`   - Resumes: ${resumes.length}`);
  console.log(`   - Jobs: ${jobs.length}`);
  console.log(`   - Matches: ${matches.length}`);
  console.log(`   - Pipeline Entries: 5`);
  console.log(`   - Notes: 4`);
  console.log('\n🔐 Login Credentials:');
  console.log('   Admin: admin@resumeai.com / password123');
  console.log('   Recruiter 1: sarah@resumeai.com / password123');
  console.log('   Recruiter 2: mike@resumeai.com / password123');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
