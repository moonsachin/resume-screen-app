import { prisma } from "./prisma";

export interface DashboardStats {
  totalResumes: number;
  totalJobs: number;
  totalMatches: number;
  averageMatchScore: number;
  strongFitCount: number;
  thisWeekUploads: number;
  openJobsCount: number;
  topCandidate: {
    name: string;
    score: number;
  } | null;
}

export interface ResumeUploadTrend {
  date: string;
  count: number;
}

export interface MatchScoreDistribution {
  range: string;
  count: number;
}

export interface TopSkill {
  skill: string;
  count: number;
}

export interface JobsByStatus {
  status: string;
  count: number;
}

export interface ChartData {
  resumeUploadTrend: ResumeUploadTrend[];
  matchScoreDistribution: MatchScoreDistribution[];
  topSkills: TopSkill[];
  jobsByStatus: JobsByStatus[];
}

/**
 * Get comprehensive dashboard statistics
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const [
    totalResumes,
    totalJobs,
    totalMatches,
    avgScoreResult,
    strongFitCount,
    thisWeekUploads,
    openJobsCount,
    topMatch,
  ] = await Promise.all([
    // Total resumes
    prisma.resume.count(),

    // Total jobs
    prisma.job.count(),

    // Total matches
    prisma.match.count(),

    // Average match score
    prisma.match.aggregate({
      _avg: { score: true },
    }),

    // Strong fit candidates (score >= 85)
    prisma.match.count({
      where: {
        score: { gte: 85 },
      },
    }),

    // This week uploads
    prisma.resume.count({
      where: {
        createdAt: { gte: oneWeekAgo },
      },
    }),

    // Open jobs count
    prisma.job.count({
      where: { status: "OPEN" },
    }),

    // Top candidate
    prisma.match.findFirst({
      orderBy: { score: "desc" },
      include: {
        resume: {
          select: { candidateName: true },
        },
      },
    }),
  ]);

  return {
    totalResumes,
    totalJobs,
    totalMatches,
    averageMatchScore: avgScoreResult._avg.score || 0,
    strongFitCount,
    thisWeekUploads,
    openJobsCount,
    topCandidate: topMatch
      ? {
          name: topMatch.resume.candidateName,
          score: topMatch.score,
        }
      : null,
  };
}

/**
 * Get chart data for dashboard visualizations
 */
export async function getChartData(days: number = 30): Promise<ChartData> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  // Resume upload trend
  const resumes = await prisma.resume.findMany({
    where: {
      createdAt: { gte: startDate },
    },
    select: { createdAt: true },
  });

  const resumeUploadTrend = generateDateSeries(resumes, days);

  // Match score distribution
  const matches = await prisma.match.findMany({
    select: { score: true },
  });

  const matchScoreDistribution = [
    { range: "0-25", count: matches.filter((m) => m.score < 25).length },
    { range: "26-50", count: matches.filter((m) => m.score >= 25 && m.score < 50).length },
    { range: "51-75", count: matches.filter((m) => m.score >= 50 && m.score < 75).length },
    { range: "76-100", count: matches.filter((m) => m.score >= 75).length },
  ];

  // Top skills frequency
  const resumesWithSkills = await prisma.resume.findMany({
    select: { skills: true },
  });

  const skillCounts = new Map<string, number>();
  resumesWithSkills.forEach((resume) => {
    if (Array.isArray(resume.skills)) {
      (resume.skills as string[]).forEach((skill) => {
        const normalized = skill.toLowerCase().trim();
        skillCounts.set(normalized, (skillCounts.get(normalized) || 0) + 1);
      });
    }
  });

  const topSkills = Array.from(skillCounts.entries())
    .map(([skill, count]) => ({ skill, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Jobs by status
  const jobsByStatus = await prisma.job.groupBy({
    by: ["status"],
    _count: { status: true },
  });

  return {
    resumeUploadTrend,
    matchScoreDistribution,
    topSkills,
    jobsByStatus: jobsByStatus.map((item) => ({
      status: item.status,
      count: item._count.status,
    })),
  };
}

/**
 * Generate date series for trend charts
 */
function generateDateSeries(
  items: { createdAt: Date }[],
  days: number
): ResumeUploadTrend[] {
  const series: ResumeUploadTrend[] = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];

    const count = items.filter((item) => {
      const itemDate = new Date(item.createdAt).toISOString().split("T")[0];
      return itemDate === dateStr;
    }).length;

    series.push({
      date: dateStr,
      count,
    });
  }

  return series;
}

/**
 * Global search across resumes, jobs, and matches
 */
export async function globalSearch(query: string) {
  const searchTerm = query.trim().toLowerCase();

  if (!searchTerm) {
    return { resumes: [], jobs: [], matches: [] };
  }

  const [resumes, jobs, matches] = await Promise.all([
    // Search resumes
    prisma.resume.findMany({
      where: {
        OR: [
          { candidateName: { contains: searchTerm, mode: "insensitive" } },
          { email: { contains: searchTerm, mode: "insensitive" } },
          { summary: { contains: searchTerm, mode: "insensitive" } },
        ],
      },
      take: 10,
      select: {
        id: true,
        candidateName: true,
        email: true,
        experienceYears: true,
        skills: true,
      },
    }),

    // Search jobs
    prisma.job.findMany({
      where: {
        OR: [
          { title: { contains: searchTerm, mode: "insensitive" } },
          { company: { contains: searchTerm, mode: "insensitive" } },
          { description: { contains: searchTerm, mode: "insensitive" } },
        ],
      },
      take: 10,
      select: {
        id: true,
        title: true,
        company: true,
        status: true,
        _count: { select: { matches: true } },
      },
    }),

    // Search matches by skills
    prisma.match.findMany({
      where: {
        OR: [
          { recommendation: { contains: searchTerm, mode: "insensitive" } },
        ],
      },
      take: 10,
      include: {
        resume: {
          select: {
            id: true,
            candidateName: true,
            email: true,
          },
        },
        job: {
          select: {
            id: true,
            title: true,
            company: true,
          },
        },
      },
    }),
  ]);

  return { resumes, jobs, matches };
}
