import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import {
  FileText,
  Briefcase,
  GitMerge,
  TrendingUp,
  Award,
  Calendar,
  FolderOpen,
  User,
} from "lucide-react";
import { authOptions } from "@/lib/auth";
import { getDashboardStats, getChartData } from "@/lib/analytics";
import { StatCard } from "@/components/dashboard/stat-card";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { ResumeUploadTrend } from "@/components/charts/resume-upload-trend";
import { MatchScoreDistribution } from "@/components/charts/match-score-distribution";
import { TopSkillsChart } from "@/components/charts/top-skills-chart";
import { JobsByStatus } from "@/components/charts/jobs-by-status";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Dashboard — ResumeAI",
  description: "Advanced analytics and insights for your resume screening",
};

async function getRecentActivity() {
  const [recentResumes, recentJobs] = await Promise.all([
    prisma.resume.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        candidateName: true,
        email: true,
        createdAt: true,
      },
    }),
    prisma.job.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        company: true,
        createdAt: true,
      },
    }),
  ]);

  return { recentResumes, recentJobs };
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const [stats, chartData, activity] = await Promise.all([
    getDashboardStats(),
    getChartData(30),
    getRecentActivity(),
  ]);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {greeting()}, {session?.user?.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-gray-500 mt-1">
          Here&apos;s your comprehensive hiring analytics dashboard.
        </p>
      </div>

      {/* KPI Cards - Row 1 */}
      <section aria-label="Key Performance Indicators">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Resumes"
            value={stats.totalResumes}
            description="Candidate submissions"
            icon={FileText}
            iconColor="text-indigo-600"
            iconBg="bg-indigo-50"
          />
          <StatCard
            title="Total Jobs"
            value={stats.totalJobs}
            description="Job postings"
            icon={Briefcase}
            iconColor="text-emerald-600"
            iconBg="bg-emerald-50"
          />
          <StatCard
            title="Total Matches"
            value={stats.totalMatches}
            description="AI-powered matches"
            icon={GitMerge}
            iconColor="text-purple-600"
            iconBg="bg-purple-50"
          />
          <StatCard
            title="Avg Match Score"
            value={`${Math.round(stats.averageMatchScore)}%`}
            description="Overall quality"
            icon={TrendingUp}
            iconColor="text-orange-600"
            iconBg="bg-orange-50"
          />
        </div>
      </section>

      {/* KPI Cards - Row 2 */}
      <section aria-label="Additional Metrics">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Strong Fit Candidates"
            value={stats.strongFitCount}
            description="Score ≥ 85%"
            icon={Award}
            iconColor="text-green-600"
            iconBg="bg-green-50"
          />
          <StatCard
            title="This Week Uploads"
            value={stats.thisWeekUploads}
            description="Last 7 days"
            icon={Calendar}
            iconColor="text-blue-600"
            iconBg="bg-blue-50"
          />
          <StatCard
            title="Open Jobs"
            value={stats.openJobsCount}
            description="Active positions"
            icon={FolderOpen}
            iconColor="text-yellow-600"
            iconBg="bg-yellow-50"
          />
          <StatCard
            title="Top Candidate"
            value={stats.topCandidate?.name || "N/A"}
            description={
              stats.topCandidate
                ? `${Math.round(stats.topCandidate.score)}% match`
                : "No matches yet"
            }
            icon={User}
            iconColor="text-pink-600"
            iconBg="bg-pink-50"
          />
        </div>
      </section>

      {/* Charts - Row 1 */}
      <section aria-label="Analytics Charts">
        <div className="grid gap-6 lg:grid-cols-2">
          <ResumeUploadTrend data={chartData.resumeUploadTrend} />
          <MatchScoreDistribution data={chartData.matchScoreDistribution} />
        </div>
      </section>

      {/* Charts - Row 2 */}
      <section aria-label="Skills and Jobs Analytics">
        <div className="grid gap-6 lg:grid-cols-2">
          <TopSkillsChart data={chartData.topSkills} />
          <JobsByStatus data={chartData.jobsByStatus} />
        </div>
      </section>

      {/* Recent activity */}
      <section aria-label="Recent activity">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Activity
        </h2>
        <RecentActivity
          recentResumes={activity.recentResumes}
          recentJobs={activity.recentJobs}
        />
      </section>
    </div>
  );
}
