import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, GitMerge, ExternalLink, TrendingUp, Award, AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { formatDate, cn } from "@/lib/utils";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const resume = await prisma.resume.findUnique({
    where: { id },
    select: { candidateName: true },
  });

  return {
    title: resume
      ? `${resume.candidateName} — All Matches`
      : "Resume Not Found",
  };
}

async function getResumeMatches(resumeId: string) {
  const resume = await prisma.resume.findUnique({
    where: { id: resumeId },
    select: {
      id: true,
      candidateName: true,
      email: true,
      experienceYears: true,
      skills: true,
      matches: {
        include: {
          job: {
            select: {
              id: true,
              title: true,
              company: true,
              location: true,
              employmentType: true,
              salaryRange: true,
            },
          },
        },
        orderBy: { score: "desc" },
      },
    },
  });

  return resume;
}

function getScoreColor(score: number) {
  if (score >= 85) return "from-green-500 to-emerald-600";
  if (score >= 65) return "from-yellow-500 to-orange-500";
  return "from-red-500 to-rose-600";
}

function getScoreBadgeVariant(score: number): "success" | "warning" | "destructive" {
  if (score >= 85) return "success";
  if (score >= 65) return "warning";
  return "destructive";
}

function getRecommendationConfig(recommendation: string | null) {
  switch (recommendation) {
    case "Strong Fit":
      return {
        color: "text-green-700 bg-green-50 border-green-200",
        icon: CheckCircle2,
        iconColor: "text-green-600",
      };
    case "Good Fit":
      return {
        color: "text-blue-700 bg-blue-50 border-blue-200",
        icon: TrendingUp,
        iconColor: "text-blue-600",
      };
    case "Moderate Fit":
      return {
        color: "text-yellow-700 bg-yellow-50 border-yellow-200",
        icon: AlertCircle,
        iconColor: "text-yellow-600",
      };
    case "Weak Fit":
      return {
        color: "text-red-700 bg-red-50 border-red-200",
        icon: XCircle,
        iconColor: "text-red-600",
      };
    default:
      return {
        color: "text-gray-700 bg-gray-50 border-gray-200",
        icon: AlertCircle,
        iconColor: "text-gray-600",
      };
  }
}

export default async function ResumeMatchesPage({ params }: PageProps) {
  const { id } = await params;
  const resume = await getResumeMatches(id);

  if (!resume) {
    notFound();
  }

  const topMatch = resume.matches[0];
  const averageScore = resume.matches.length > 0
    ? resume.matches.reduce((sum, m) => sum + m.score, 0) / resume.matches.length
    : 0;
  const strongFits = resume.matches.filter(m => m.score >= 85).length;

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Link href={`/dashboard/resumes/${resume.id}`}>
            <Button variant="ghost" size="sm" className="gap-2 mt-1">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">
              {resume.candidateName}'s Matches
            </h1>
            <p className="text-sm text-gray-500">
              {resume.email}
              {resume.experienceYears && (
                <> · {resume.experienceYears} years experience</>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {resume.matches.length > 0 && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border-l-4 border-l-indigo-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Matches</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {resume.matches.length}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                  <GitMerge className="h-6 w-6 text-indigo-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Strong Fits</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {strongFits}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <Award className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Score</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {Math.round(averageScore)}%
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Top Score</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {topMatch ? Math.round(topMatch.score) : 0}%
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Matches List */}
      {resume.matches.length === 0 ? (
        <Card className="border-2 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <GitMerge className="h-10 w-10 text-gray-400" aria-hidden="true" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No matches yet
            </h3>
            <p className="text-sm text-gray-500 max-w-sm mb-6">
              This resume hasn't been matched with any jobs yet. Run AI matching on a job to see results.
            </p>
            <Link href="/dashboard/jobs">
              <Button size="lg" className="gap-2">
                <ExternalLink className="h-4 w-4" />
                Browse Jobs
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {resume.matches.map((match, index) => {
            const recConfig = getRecommendationConfig(match.recommendation);
            const RecommendationIcon = recConfig.icon;
            
            return (
              <Card
                key={match.id}
                className="group hover:shadow-lg transition-all duration-300 border-l-4 hover:border-l-indigo-500"
                style={{
                  borderLeftColor: match.score >= 85 ? '#10b981' : match.score >= 65 ? '#f59e0b' : '#ef4444'
                }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-6">
                    {/* Rank Badge */}
                    <div className="flex flex-col items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-600">
                        #{index + 1}
                      </div>
                      
                      {/* Score Circle with Gradient */}
                      <div className="relative">
                        <div
                          className={cn(
                            "flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-full text-white shadow-lg bg-gradient-to-br",
                            getScoreColor(match.score)
                          )}
                          aria-label={`Match score: ${Math.round(match.score)}%`}
                        >
                          <span className="text-xl font-bold leading-none">
                            {Math.round(match.score)}
                          </span>
                          <span className="text-xs opacity-90 mt-0.5">SCORE</span>
                        </div>
                        {/* Pulse animation for top matches */}
                        {match.score >= 85 && (
                          <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-20" />
                        )}
                      </div>
                    </div>

                    {/* Match Details */}
                    <div className="flex-1 min-w-0 space-y-4">
                      {/* Job Title & Company */}
                      <div>
                        <Link
                          href={`/dashboard/jobs/${match.job.id}`}
                          className="text-xl font-bold text-gray-900 hover:text-indigo-600 flex items-center gap-2 group/link transition-colors"
                        >
                          {match.job.title}
                          <ExternalLink className="h-4 w-4 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                        </Link>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-sm font-medium">
                            {match.job.company}
                          </Badge>
                          {match.job.location && (
                            <span className="text-sm text-gray-500 flex items-center gap-1">
                              📍 {match.job.location}
                            </span>
                          )}
                          {match.job.employmentType && (
                            <Badge variant="secondary" className="text-xs">
                              {match.job.employmentType.replace("_", " ")}
                            </Badge>
                          )}
                          {match.job.salaryRange && (
                            <span className="text-sm text-green-600 font-medium">
                              💰 {match.job.salaryRange}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Match Stats Grid */}
                      <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                        {match.skillMatchPercent !== null && (
                          <div className="text-center">
                            <p className="text-2xl font-bold text-indigo-600">
                              {Math.round(match.skillMatchPercent)}%
                            </p>
                            <p className="text-xs text-gray-500 mt-1">Skill Match</p>
                          </div>
                        )}
                        {match.matchedSkills && Array.isArray(match.matchedSkills) && (
                          <div className="text-center">
                            <p className="text-2xl font-bold text-green-600">
                              {(match.matchedSkills as string[]).length}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">Matched</p>
                          </div>
                        )}
                        {match.missingSkills && Array.isArray(match.missingSkills) && (
                          <div className="text-center">
                            <p className="text-2xl font-bold text-red-600">
                              {(match.missingSkills as string[]).length}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">Missing</p>
                          </div>
                        )}
                      </div>

                      {/* Matched Skills */}
                      {match.matchedSkills && Array.isArray(match.matchedSkills) && (match.matchedSkills as string[]).length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                            ✓ Matched Skills
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {(match.matchedSkills as string[]).slice(0, 10).map((skill, idx) => (
                              <Badge 
                                key={idx} 
                                className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                              >
                                {skill}
                              </Badge>
                            ))}
                            {(match.matchedSkills as string[]).length > 10 && (
                              <Badge variant="outline" className="text-xs">
                                +{(match.matchedSkills as string[]).length - 10} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Missing Skills */}
                      {match.missingSkills && Array.isArray(match.missingSkills) && (match.missingSkills as string[]).length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                            ⚠ Missing Skills
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {(match.missingSkills as string[]).slice(0, 6).map((skill, idx) => (
                              <Badge 
                                key={idx} 
                                className="bg-red-50 text-red-700 border-red-200"
                              >
                                {skill}
                              </Badge>
                            ))}
                            {(match.missingSkills as string[]).length > 6 && (
                              <Badge variant="outline" className="text-xs">
                                +{(match.missingSkills as string[]).length - 6} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Experience Relevance */}
                      {match.experienceRelevance && (
                        <div className="p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
                          <p className="text-sm text-blue-900">
                            <span className="font-semibold">Experience: </span>
                            {match.experienceRelevance}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Right Side - Recommendation & Actions */}
                    <div className="flex flex-col items-end gap-3 shrink-0">
                      {match.recommendation && (
                        <Badge
                          className={cn(
                            "border px-3 py-1.5 flex items-center gap-2 text-sm font-semibold",
                            recConfig.color
                          )}
                        >
                          <RecommendationIcon className={cn("h-4 w-4", recConfig.iconColor)} />
                          {match.recommendation}
                        </Badge>
                      )}
                      
                      <p className="text-xs text-gray-400">
                        Matched {formatDate(match.createdAt)}
                      </p>
                      
                      <div className="flex flex-col gap-2 w-full min-w-[140px]">
                        <Link href={`/dashboard/matches/${match.jobId}`} className="w-full">
                          <Button size="sm" className="w-full gap-2 bg-indigo-600 hover:bg-indigo-700">
                            <ExternalLink className="h-3.5 w-3.5" />
                            View Details
                          </Button>
                        </Link>
                        <Link href={`/dashboard/jobs/${match.job.id}`} className="w-full">
                          <Button size="sm" variant="outline" className="w-full">
                            View Job
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
