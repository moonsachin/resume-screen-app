import { FileText, Briefcase } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

interface RecentResume {
  id: string;
  candidateName: string;
  email: string;
  createdAt: Date | string;
}

interface RecentJob {
  id: string;
  title: string;
  company: string;
  createdAt: Date | string;
}

interface RecentActivityProps {
  recentResumes: RecentResume[];
  recentJobs: RecentJob[];
}

export function RecentActivity({
  recentResumes,
  recentJobs,
}: RecentActivityProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Recent Resumes */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-indigo-600" aria-hidden="true" />
            <CardTitle className="text-base">Recent Resumes</CardTitle>
          </div>
          <CardDescription>Latest candidate submissions</CardDescription>
        </CardHeader>
        <CardContent>
          {recentResumes.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">
              No resumes yet
            </p>
          ) : (
            <ul className="space-y-3" aria-label="Recent resumes">
              {recentResumes.map((resume) => (
                <li
                  key={resume.id}
                  className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {resume.candidateName}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {resume.email}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400 ml-2 shrink-0">
                    {formatDate(resume.createdAt)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Recent Jobs */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Briefcase
              className="h-5 w-5 text-emerald-600"
              aria-hidden="true"
            />
            <CardTitle className="text-base">Recent Jobs</CardTitle>
          </div>
          <CardDescription>Latest job postings</CardDescription>
        </CardHeader>
        <CardContent>
          {recentJobs.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">
              No jobs yet
            </p>
          ) : (
            <ul className="space-y-3" aria-label="Recent jobs">
              {recentJobs.map((job) => (
                <li
                  key={job.id}
                  className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {job.title}
                    </p>
                    <Badge variant="secondary" className="mt-0.5 text-xs">
                      {job.company}
                    </Badge>
                  </div>
                  <span className="text-xs text-gray-400 ml-2 shrink-0">
                    {formatDate(job.createdAt)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
