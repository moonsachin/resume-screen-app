import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  Phone,
  Briefcase,
  GraduationCap,
  Code,
  FileText,
  Download,
  Calendar,
} from "lucide-react";
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
import { formatDate } from "@/lib/utils";

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
      ? `${resume.candidateName} — Resume Details`
      : "Resume Not Found",
  };
}

async function getResumeDetails(id: string) {
  const resume = await prisma.resume.findUnique({
    where: { id },
    include: {
      matches: {
        include: {
          job: {
            select: {
              id: true,
              title: true,
              company: true,
            },
          },
        },
        orderBy: { score: "desc" },
        take: 5,
      },
    },
  });

  return resume;
}

export default async function ResumeDetailPage({ params }: PageProps) {
  const { id } = await params;
  const resume = await getResumeDetails(id);

  if (!resume) {
    notFound();
  }

  const education = resume.education as Array<{
    degree: string;
    institution: string;
    year?: string;
  }> | null;

  const projects = resume.projects as Array<{
    name: string;
    description: string;
    technologies?: string[];
  }> | null;

  const skills = resume.skills as string[] | null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/resumes">
            <Button variant="ghost" size="sm" className="gap-2 cursor-pointer">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {resume.candidateName}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Uploaded {formatDate(resume.createdAt)}
            </p>
          </div>
        </div>
        <a
          href={resume.fileUrl}
          download
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button className="gap-2 cursor-pointer">
            <Download className="h-4 w-4" />
            Download Resume
          </Button>
        </a>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column - Main info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {resume.email && (
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-gray-400" aria-hidden="true" />
                  <a
                    href={`mailto:${resume.email}`}
                    className="text-sm text-indigo-600 hover:underline cursor-pointer"
                  >
                    {resume.email}
                  </a>
                </div>
              )}
              {resume.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-gray-400" aria-hidden="true" />
                  <a
                    href={`tel:${resume.phone}`}
                    className="text-sm text-gray-900 cursor-pointer"
                  >
                    {resume.phone}
                  </a>
                </div>
              )}
              {resume.experienceYears !== null && (
                <div className="flex items-center gap-3">
                  <Briefcase
                    className="h-4 w-4 text-gray-400"
                    aria-hidden="true"
                  />
                  <span className="text-sm text-gray-900">
                    {resume.experienceYears} year
                    {resume.experienceYears !== 1 ? "s" : ""} of experience
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Summary */}
          {resume.summary && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Professional Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {resume.summary}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Skills */}
          {skills && skills.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Code className="h-4 w-4" aria-hidden="true" />
                  Skills
                </CardTitle>
                <CardDescription>
                  {skills.length} skill{skills.length !== 1 ? "s" : ""} identified
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, idx) => (
                    <Badge key={idx} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Education */}
          {education && education.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" aria-hidden="true" />
                  Education
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {education.map((edu, idx) => (
                    <li key={idx} className="border-l-2 border-indigo-200 pl-4">
                      <p className="text-sm font-medium text-gray-900">
                        {edu.degree}
                      </p>
                      <p className="text-sm text-gray-600">{edu.institution}</p>
                      {edu.year && (
                        <p className="text-xs text-gray-400 mt-1">{edu.year}</p>
                      )}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Projects */}
          {projects && projects.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="h-4 w-4" aria-hidden="true" />
                  Projects
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {projects.map((project, idx) => (
                    <li key={idx} className="pb-4 border-b last:border-0">
                      <h4 className="text-sm font-semibold text-gray-900 mb-1">
                        {project.name}
                      </h4>
                      <p className="text-sm text-gray-600 mb-2">
                        {project.description}
                      </p>
                      {project.technologies &&
                        project.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {project.technologies.map((tech, techIdx) => (
                              <Badge
                                key={techIdx}
                                variant="outline"
                                className="text-xs"
                              >
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        )}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right column - Sidebar */}
        <div className="space-y-6">
          {/* File Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">File Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <span className="text-gray-500">File Type:</span>
                <Badge variant="secondary" className="ml-2">
                  {resume.fileType?.toUpperCase() || "Unknown"}
                </Badge>
              </div>
              {resume.fileSize && (
                <div>
                  <span className="text-gray-500">File Size:</span>
                  <span className="ml-2 text-gray-900">
                    {(resume.fileSize / 1024).toFixed(1)} KB
                  </span>
                </div>
              )}
              <div>
                <span className="text-gray-500">Uploaded:</span>
                <span className="ml-2 text-gray-900">
                  {formatDate(resume.createdAt)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Job Matches */}
          {resume.matches.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Top Matches</CardTitle>
                <CardDescription>
                  {resume.matches.length} job match
                  {resume.matches.length !== 1 ? "es" : ""}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {resume.matches.map((match) => (
                    <li
                      key={match.id}
                      className="flex items-center justify-between pb-3 border-b last:border-0 hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <div className="min-w-0 flex-1">
                        <Link
                          href={`/dashboard/jobs/${match.job.id}`}
                          className="text-sm font-medium text-gray-900 hover:text-indigo-600 truncate block cursor-pointer"
                        >
                          {match.job.title}
                        </Link>
                        <p className="text-xs text-gray-500">
                          {match.job.company}
                        </p>
                      </div>
                      <Badge
                        variant={
                          match.score >= 85
                            ? "success"
                            : match.score >= 65
                              ? "warning"
                              : "destructive"
                        }
                        className="ml-2 shrink-0"
                      >
                        {Math.round(match.score)}%
                      </Badge>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <a
                href={resume.fileUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Button variant="outline" className="w-full gap-2 cursor-pointer">
                  <Download className="h-4 w-4" />
                  Download Resume
                </Button>
              </a>
              {resume.matches.length > 0 ? (
                <Link href={`/dashboard/resumes/${resume.id}/matches`}>
                  <Button variant="outline" className="w-full gap-2 cursor-pointer">
                    <Calendar className="h-4 w-4" />
                    View All Matches
                  </Button>
                </Link>
              ) : (
                <Button variant="outline" className="w-full gap-2 cursor-not-allowed" disabled>
                  <Calendar className="h-4 w-4" />
                  No Matches Yet
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
