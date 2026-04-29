import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { Briefcase, MapPin, Clock, DollarSign, Edit, Trash2, Zap } from "lucide-react";
import Link from "next/link";

interface JobDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: JobDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const job = await prisma.job.findUnique({ where: { id } });
  
  return {
    title: job ? `${job.title} — ResumeAI` : "Job Not Found",
    description: job?.description.slice(0, 160),
  };
}

async function getJob(id: string) {
  return prisma.job.findUnique({
    where: { id },
    include: {
      _count: { select: { matches: true } },
      matches: {
        orderBy: { score: "desc" },
        take: 5,
        include: {
          resume: {
            select: {
              id: true,
              candidateName: true,
              email: true,
              experienceYears: true,
            },
          },
        },
      },
    },
  });
}

function getEmploymentTypeLabel(type: string) {
  const labels: Record<string, string> = {
    FULL_TIME: "Full-time",
    PART_TIME: "Part-time",
    CONTRACT: "Contract",
    REMOTE: "Remote",
  };
  return labels[type] || type;
}

function getStatusColor(status: string) {
  const colors: Record<string, string> = {
    DRAFT: "bg-gray-100 text-gray-800",
    OPEN: "bg-green-100 text-green-800",
    CLOSED: "bg-red-100 text-red-800",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { id } = await params;
  const job = await getJob(id);

  if (!job) {
    notFound();
  }

  const requiredSkills = Array.isArray(job.requiredSkills)
    ? (job.requiredSkills as string[])
    : [];
  const optionalSkills = Array.isArray(job.optionalSkills)
    ? (job.optionalSkills as string[])
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-emerald-100">
            <Briefcase className="h-6 w-6 text-emerald-600" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
            <p className="text-gray-500 mt-1">{job.company}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/dashboard/jobs/${job.id}/edit`}>
            <Button variant="outline" size="sm" className="gap-2 cursor-pointer">
              <Edit className="h-4 w-4" />
              Edit
            </Button>
          </Link>
          <Link href={`/dashboard/matches/${job.id}`}>
            <Button size="sm" className="gap-2 cursor-pointer">
              <Zap className="h-4 w-4" />
              Run Match
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Info */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Location</p>
                <p className="text-sm font-medium">{job.location || "Not specified"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Type</p>
                <p className="text-sm font-medium">
                  {getEmploymentTypeLabel(job.employmentType)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Briefcase className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Experience</p>
                <p className="text-sm font-medium">
                  {job.experienceRequired
                    ? `${job.experienceRequired} years`
                    : "Not specified"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <DollarSign className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Salary</p>
                <p className="text-sm font-medium">{job.salaryRange || "Not specified"}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-4 pt-4 border-t">
            <Badge className={getStatusColor(job.status)}>{job.status}</Badge>
            <span className="text-sm text-gray-500">
              Posted {formatDate(job.createdAt)}
            </span>
            <span className="text-sm text-gray-500">•</span>
            <span className="text-sm text-gray-500">
              {job._count.matches} candidate{job._count.matches !== 1 ? "s" : ""} matched
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Skills */}
      {(requiredSkills.length > 0 || optionalSkills.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle>Skills</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {requiredSkills.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Required Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {requiredSkills.map((skill) => (
                    <Badge
                      key={skill}
                      variant="default"
                      className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {optionalSkills.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Optional Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {optionalSkills.map((skill) => (
                    <Badge key={skill} variant="outline">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle>Job Description</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none">
            <p className="whitespace-pre-wrap text-gray-700">{job.description}</p>
          </div>
        </CardContent>
      </Card>

      {/* Top Matches */}
      {job.matches.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Top Candidates</CardTitle>
              <Link href={`/dashboard/matches/${job.id}`}>
                <Button variant="outline" size="sm" className="cursor-pointer">
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {job.matches.map((match, index) => (
                <div
                  key={match.id}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 font-semibold text-sm">
                      #{index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {match.resume.candidateName}
                      </p>
                      <p className="text-sm text-gray-500">{match.resume.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-emerald-600">
                      {Math.round(match.score)}%
                    </p>
                    <p className="text-xs text-gray-500">
                      {match.resume.experienceYears
                        ? `${match.resume.experienceYears} yrs exp`
                        : ""}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
