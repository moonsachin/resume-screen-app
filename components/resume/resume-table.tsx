"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FileText, Trash2, Eye, Search, Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

interface Resume {
  id: string;
  candidateName: string;
  email: string;
  phone: string | null;
  fileUrl: string;
  fileSize: number | null;
  fileType: string | null;
  skills: string[] | null;
  experienceYears: number | null;
  summary: string | null;
  createdAt: Date | string;
  _count: { matches: number };
}

interface ResumeTableProps {
  initialResumes: Resume[];
  onDelete?: () => void;
}

export function ResumeTable({ initialResumes, onDelete }: ResumeTableProps) {
  const [resumes, setResumes] = useState<Resume[]>(initialResumes);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Update resumes when initialResumes prop changes
  useEffect(() => {
    setResumes(initialResumes);
    setIsLoading(false);
  }, [initialResumes]);

  const filteredResumes = resumes.filter(
    (resume) =>
      resume.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resume.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id: string, candidateName: string) => {
    if (
      !confirm(
        `Are you sure you want to delete ${candidateName}'s resume? This action cannot be undone.`
      )
    ) {
      return;
    }

    setIsDeleting(id);

    try {
      const response = await fetch(`/api/resumes/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Failed to delete resume");
      }

      toast.success("Resume deleted successfully");
      setResumes((prev) => prev.filter((r) => r.id !== id));
      onDelete?.();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error((error as Error).message || "Failed to delete resume");
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-md">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
            aria-hidden="true"
          />
          <Input
            type="search"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
            aria-label="Search resumes"
          />
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-3 w-[200px]" />
                  </div>
                  <Skeleton className="h-8 w-20" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : filteredResumes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <FileText
              className="h-12 w-12 text-gray-300 mb-4"
              aria-hidden="true"
            />
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              {searchQuery ? "No resumes found" : "No resumes yet"}
            </h3>
            <p className="text-sm text-gray-500">
              {searchQuery
                ? "Try adjusting your search query"
                : "Upload your first resume to get started"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">
              {filteredResumes.length} Resume{filteredResumes.length !== 1 ? "s" : ""}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-y border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Candidate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Experience
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Skills
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Uploaded
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredResumes.map((resume) => (
                    <tr
                      key={resume.id}
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100">
                            <FileText
                              className="h-4 w-4 text-indigo-600"
                              aria-hidden="true"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {resume.candidateName}
                            </p>
                            {resume._count.matches > 0 && (
                              <p className="text-xs text-gray-500">
                                {resume._count.matches} match
                                {resume._count.matches !== 1 ? "es" : ""}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 truncate max-w-xs">
                          {resume.email}
                        </div>
                        {resume.phone && (
                          <div className="text-xs text-gray-500">
                            {resume.phone}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">
                          {resume.experienceYears
                            ? `${resume.experienceYears} year${resume.experienceYears !== 1 ? "s" : ""}`
                            : "—"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {resume.skills && Array.isArray(resume.skills) ? (
                            resume.skills.slice(0, 3).map((skill, idx) => (
                              <Badge
                                key={idx}
                                variant="secondary"
                                className="text-xs"
                              >
                                {skill}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-sm text-gray-400">—</span>
                          )}
                          {resume.skills &&
                            Array.isArray(resume.skills) &&
                            resume.skills.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{resume.skills.length - 3}
                              </Badge>
                            )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(resume.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/dashboard/resumes/${resume.id}`}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 cursor-pointer"
                              aria-label={`View ${resume.candidateName}'s resume`}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <a
                            href={resume.fileUrl}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 cursor-pointer"
                              aria-label={`Download ${resume.candidateName}'s resume`}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </a>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                            onClick={() =>
                              handleDelete(resume.id, resume.candidateName)
                            }
                            disabled={isDeleting === resume.id}
                            aria-label={`Delete ${resume.candidateName}'s resume`}
                          >
                            {isDeleting === resume.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
