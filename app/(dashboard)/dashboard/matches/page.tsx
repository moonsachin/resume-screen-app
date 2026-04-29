import type { Metadata } from "next";
import { GitMerge, Zap } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate, formatScore } from "@/lib/utils";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Matches — ResumeAI",
  description: "View resume-job match results",
};

async function getMatches() {
  return prisma.match.findMany({
    orderBy: { score: "desc" },
    include: {
      resume: {
        select: { candidateName: true, email: true },
      },
      job: {
        select: { title: true, company: true },
      },
    },
  });
}

function getScoreVariant(score: number) {
  if (score >= 85) return "success";
  if (score >= 65) return "warning";
  return "destructive";
}

function getScoreLabel(score: number) {
  if (score >= 85) return "Excellent";
  if (score >= 65) return "Good";
  return "Low";
}

export default async function MatchesPage() {
  const matches = await getMatches();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Matches</h1>
          <p className="text-gray-500 mt-1">
            {matches.length} resume-job match{matches.length !== 1 ? "es" : ""}
          </p>
        </div>
        <Button className="gap-2">
          <Zap className="h-4 w-4" aria-hidden="true" />
          Run Matching
        </Button>
      </div>

      {matches.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <GitMerge
              className="h-12 w-12 text-gray-300 mb-4"
              aria-hidden="true"
            />
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              No matches yet
            </h3>
            <p className="text-sm text-gray-500 max-w-sm">
              Upload resumes and add jobs, then run the AI matching engine to
              find the best candidates.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {matches.map((match) => (
            <Card
              key={match.id}
              className="hover:shadow-md transition-shadow duration-200 cursor-pointer"
            >
              <CardContent className="p-5">
                <div className="flex items-center gap-4">
                  {/* Score circle */}
                  <div
                    className={cn(
                      "flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-full text-white",
                      match.score >= 85
                        ? "bg-green-500"
                        : match.score >= 65
                          ? "bg-yellow-500"
                          : "bg-red-500"
                    )}
                    aria-label={`Match score: ${formatScore(match.score)}`}
                  >
                    <span className="text-sm font-bold leading-none">
                      {Math.round(match.score)}
                    </span>
                    <span className="text-xs opacity-80">%</span>
                  </div>

                  {/* Match details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-gray-900">
                        {match.resume.candidateName}
                      </span>
                      <span className="text-gray-400">→</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {match.job.title}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs text-gray-500">
                        {match.resume.email}
                      </span>
                      <span className="text-gray-300">·</span>
                      <Badge variant="outline" className="text-xs">
                        {match.job.company}
                      </Badge>
                    </div>
                  </div>

                  {/* Score badge + date */}
                  <div className="text-right shrink-0">
                    <Badge
                      variant={getScoreVariant(match.score)}
                      className="mb-1"
                    >
                      {getScoreLabel(match.score)}
                    </Badge>
                    <p className="text-xs text-gray-400">
                      {formatDate(match.createdAt)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
