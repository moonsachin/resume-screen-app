"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import {
  Zap,
  Loader2,
  Download,
  Eye,
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowLeft,
  Filter,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { MatchDetailModal } from "@/components/match/match-detail-modal";
import { MatchFilters } from "@/components/filters/match-filters";
import { ExportButton } from "@/components/export/export-button";

interface Match {
  id: string;
  score: number;
  skillMatchPercent: number | null;
  matchedSkills: unknown;
  missingSkills: unknown;
  strengths: unknown;
  weaknesses: unknown;
  experienceRelevance: string | null;
  recommendation: string | null;
  createdAt: Date;
  resume: {
    id: string;
    candidateName: string;
    email: string;
    phone: string | null;
    fileUrl: string;
    experienceYears: number | null;
    skills: unknown;
  };
}

interface Job {
  id: string;
  title: string;
  company: string;
  status: string;
  matches: Match[];
}

interface MatchesClientProps {
  job: Job;
}

function getRecommendationIcon(recommendation: string | null) {
  switch (recommendation) {
    case "Strong Fit":
      return <TrendingUp className="h-4 w-4 text-green-600" />;
    case "Good Fit":
      return <TrendingUp className="h-4 w-4 text-emerald-600" />;
    case "Moderate Fit":
      return <Minus className="h-4 w-4 text-yellow-600" />;
    case "Weak Fit":
      return <TrendingDown className="h-4 w-4 text-red-600" />;
    default:
      return <Minus className="h-4 w-4 text-gray-400" />;
  }
}

function getRecommendationColor(recommendation: string | null) {
  switch (recommendation) {
    case "Strong Fit":
      return "bg-green-100 text-green-800";
    case "Good Fit":
      return "bg-emerald-100 text-emerald-800";
    case "Moderate Fit":
      return "bg-yellow-100 text-yellow-800";
    case "Weak Fit":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export function MatchesClient({ job }: MatchesClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isRunning, setIsRunning] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Apply filters
  const scoreMin = searchParams.get("scoreMin")
    ? Number(searchParams.get("scoreMin"))
    : undefined;
  const scoreMax = searchParams.get("scoreMax")
    ? Number(searchParams.get("scoreMax"))
    : undefined;
  const experienceMin = searchParams.get("experienceMin")
    ? Number(searchParams.get("experienceMin"))
    : undefined;
  const experienceMax = searchParams.get("experienceMax")
    ? Number(searchParams.get("experienceMax"))
    : undefined;
  const requiredSkill = searchParams.get("requiredSkill") || undefined;
  const missingSkill = searchParams.get("missingSkill") || undefined;
  const recommendation = searchParams.get("recommendation") || undefined;

  // Filter matches
  const filteredMatches = job.matches.filter((match) => {
    if (scoreMin !== undefined && match.score < scoreMin) return false;
    if (scoreMax !== undefined && match.score > scoreMax) return false;
    if (
      experienceMin !== undefined &&
      (match.resume.experienceYears === null ||
        match.resume.experienceYears < experienceMin)
    )
      return false;
    if (
      experienceMax !== undefined &&
      match.resume.experienceYears !== null &&
      match.resume.experienceYears > experienceMax
    )
      return false;
    if (recommendation && match.recommendation !== recommendation) return false;

    // Check required skill
    if (requiredSkill) {
      const matchedSkills = Array.isArray(match.matchedSkills)
        ? (match.matchedSkills as string[])
        : [];
      const hasSkill = matchedSkills.some((s) =>
        s.toLowerCase().includes(requiredSkill.toLowerCase())
      );
      if (!hasSkill) return false;
    }

    // Check missing skill
    if (missingSkill) {
      const missingSkills = Array.isArray(match.missingSkills)
        ? (match.missingSkills as string[])
        : [];
      const hasMissing = missingSkills.some((s) =>
        s.toLowerCase().includes(missingSkill.toLowerCase())
      );
      if (!hasMissing) return false;
    }

    return true;
  });

  const handleRunMatch = async () => {
    setIsRunning(true);
    try {
      const response = await fetch(`/api/match/run/${job.id}`, {
        method: "POST",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to run matching");
      }

      toast.success(
        `Matching completed! ${result.successfulMatches} of ${result.totalResumes} resumes matched.`
      );
      router.refresh();
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <Link
              href={`/dashboard/jobs/${job.id}`}
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Job
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">
              Candidate Matches
            </h1>
            <p className="text-gray-500 mt-1">
              {job.title} at {job.company}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>
            <ExportButton
              jobId={job.id}
              scoreMin={scoreMin}
              scoreMax={scoreMax}
              recommendation={recommendation}
            />
            <Button
              onClick={handleRunMatch}
              disabled={isRunning}
              className="gap-2"
            >
              {isRunning ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Running Match...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4" />
                  {job.matches.length > 0 ? "Re-run Match" : "Run Match"}
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="lg:col-span-1">
              <MatchFilters />
            </div>
          )}

          {/* Main Content */}
          <div className={showFilters ? "lg:col-span-3" : "lg:col-span-4"}>
            {/* Stats */}
            {filteredMatches.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold text-gray-900">
                      {filteredMatches.length}
                    </div>
                    <p className="text-sm text-gray-500">Total Candidates</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold text-green-600">
                      {
                        filteredMatches.filter(
                          (m) =>
                            m.recommendation === "Strong Fit" ||
                            m.recommendation === "Good Fit"
                        ).length
                      }
                    </div>
                    <p className="text-sm text-gray-500">Strong/Good Fits</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold text-emerald-600">
                      {Math.round(
                        filteredMatches.reduce((sum, m) => sum + m.score, 0) /
                          filteredMatches.length
                      )}
                      %
                    </div>
                    <p className="text-sm text-gray-500">Average Score</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold text-gray-900">
                      {filteredMatches[0]
                        ? Math.round(filteredMatches[0].score)
                        : 0}
                      %
                    </div>
                    <p className="text-sm text-gray-500">Top Score</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Matches Table */}
            {filteredMatches.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                  <Zap
                    className="h-12 w-12 text-gray-300 mb-4"
                    aria-hidden="true"
                  />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    {job.matches.length === 0
                      ? "No matches yet"
                      : "No matches found"}
                  </h3>
                  <p className="text-sm text-gray-500 max-w-sm mb-4">
                    {job.matches.length === 0
                      ? 'Click "Run Match" to compare all resumes against this job using AI.'
                      : "Try adjusting your filters to see more results."}
                  </p>
                  {job.matches.length === 0 && (
                    <Button onClick={handleRunMatch} disabled={isRunning}>
                      {isRunning ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Running...
                        </>
                      ) : (
                        <>
                          <Zap className="mr-2 h-4 w-4" />
                          Run Match
                        </>
                      )}
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>
                    Ranked Candidates
                    {filteredMatches.length !== job.matches.length && (
                      <span className="text-sm font-normal text-gray-500 ml-2">
                        (Showing {filteredMatches.length} of {job.matches.length})
                      </span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b text-left text-sm text-gray-500">
                          <th className="pb-3 font-medium">Rank</th>
                          <th className="pb-3 font-medium">Candidate</th>
                          <th className="pb-3 font-medium">Score</th>
                          <th className="pb-3 font-medium">Skill Match</th>
                          <th className="pb-3 font-medium">Experience</th>
                          <th className="pb-3 font-medium">Recommendation</th>
                          <th className="pb-3 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredMatches.map((match, index) => {
                          const missingSkills = Array.isArray(match.missingSkills)
                            ? (match.missingSkills as string[])
                            : [];

                          return (
                            <tr
                              key={match.id}
                              className="border-b last:border-0 hover:bg-gray-50 cursor-pointer"
                            >
                              <td className="py-4">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 font-semibold text-sm">
                                  #{index + 1}
                                </div>
                              </td>
                              <td className="py-4">
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {match.resume.candidateName}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {match.resume.email}
                                  </p>
                                </div>
                              </td>
                              <td className="py-4">
                                <div className="flex items-center gap-2">
                                  <div className="text-lg font-bold text-emerald-600">
                                    {Math.round(match.score)}%
                                  </div>
                                </div>
                              </td>
                              <td className="py-4">
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {match.skillMatchPercent
                                      ? `${Math.round(match.skillMatchPercent)}%`
                                      : "N/A"}
                                  </p>
                                  {missingSkills.length > 0 && (
                                    <p className="text-xs text-red-600">
                                      {missingSkills.length} missing
                                    </p>
                                  )}
                                </div>
                              </td>
                              <td className="py-4">
                                <p className="text-sm text-gray-700">
                                  {match.resume.experienceYears
                                    ? `${match.resume.experienceYears} yrs`
                                    : "N/A"}
                                </p>
                              </td>
                              <td className="py-4">
                                <Badge
                                  className={getRecommendationColor(
                                    match.recommendation
                                  )}
                                >
                                  <span className="flex items-center gap-1">
                                    {getRecommendationIcon(match.recommendation)}
                                    {match.recommendation || "N/A"}
                                  </span>
                                </Badge>
                              </td>
                              <td className="py-4">
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSelectedMatch(match)}
                                    className="cursor-pointer"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <a
                                    href={match.resume.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <Button variant="outline" size="sm" className="cursor-pointer">
                                      <Download className="h-4 w-4" />
                                    </Button>
                                  </a>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Match Detail Modal */}
      {selectedMatch && (
        <MatchDetailModal
          match={selectedMatch}
          onClose={() => setSelectedMatch(null)}
        />
      )}
    </>
  );
}
