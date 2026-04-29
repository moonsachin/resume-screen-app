import type { Metadata } from "next";
import { Briefcase, Plus, Edit, Trash2, Zap, Eye } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Jobs — ResumeAI",
  description: "Manage job postings",
};

async function getJobs() {
  return prisma.job.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { matches: true } },
    },
  });
}

function getStatusColor(status: string) {
  const colors: Record<string, string> = {
    DRAFT: "bg-gray-100 text-gray-800",
    OPEN: "bg-green-100 text-green-800",
    CLOSED: "bg-red-100 text-red-800",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
}

export default async function JobsPage() {
  const jobs = await getJobs();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Jobs</h1>
          <p className="text-gray-500 mt-1">
            {jobs.length} job posting{jobs.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link href="/dashboard/jobs/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add Job
          </Button>
        </Link>
      </div>

      {jobs.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Briefcase
              className="h-12 w-12 text-gray-300 mb-4"
              aria-hidden="true"
            />
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              No jobs yet
            </h3>
            <p className="text-sm text-gray-500 max-w-sm mb-4">
              Add your first job posting to start matching candidates.
            </p>
            <Link href="/dashboard/jobs/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Job
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <Card
              key={job.id}
              className="hover:shadow-md transition-shadow duration-200 cursor-pointer group"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  {/* Job Info - Clickable area */}
                  <Link 
                    href={`/dashboard/jobs/${job.id}`}
                    className="flex items-start gap-4 flex-1 min-w-0 cursor-pointer"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-emerald-100 group-hover:bg-emerald-200 transition-colors">
                      <Briefcase
                        className="h-6 w-6 text-emerald-600"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900 truncate group-hover:text-emerald-600 transition-colors">
                          {job.title}
                        </h3>
                        <Badge className={getStatusColor(job.status)}>
                          {job.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{job.company}</p>
                      <p className="text-sm text-gray-500 line-clamp-2 mb-2">
                        {job.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                        <span>Posted {formatDate(job.createdAt)}</span>
                        <span>•</span>
                        <span>
                          {job._count.matches} match
                          {job._count.matches !== 1 ? "es" : ""}
                        </span>
                        {job.experienceRequired && (
                          <>
                            <span>•</span>
                            <span>{job.experienceRequired} yrs exp</span>
                          </>
                        )}
                      </div>
                    </div>
                  </Link>

                  {/* Actions */}
                  <div className="flex gap-2 shrink-0">
                    <Link href={`/dashboard/jobs/${job.id}`}>
                      <Button variant="outline" size="sm" className="cursor-pointer">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href={`/dashboard/jobs/${job.id}/edit`}>
                      <Button variant="outline" size="sm" className="cursor-pointer">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href={`/dashboard/matches/${job.id}`}>
                      <Button size="sm" className="gap-2 cursor-pointer">
                        <Zap className="h-4 w-4" />
                        Match
                      </Button>
                    </Link>
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
