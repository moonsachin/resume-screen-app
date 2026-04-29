"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, FileText, Briefcase, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface SearchResult {
  resumes: Array<{
    id: string;
    candidateName: string;
    email: string;
    experienceYears: number | null;
    skills: unknown;
  }>;
  jobs: Array<{
    id: string;
    title: string;
    company: string;
    status: string;
    _count: { matches: number };
  }>;
  matches: Array<{
    id: string;
    score: number;
    resume: {
      id: string;
      candidateName: string;
      email: string;
    };
    job: {
      id: string;
      title: string;
      company: string;
    };
  }>;
}

export function GlobalSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SearchResult | null>(null);

  const performSearch = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setResults(null);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      if (response.ok) {
        const data = await response.json();
        setResults(data);
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (query) {
        performSearch(query);
      }
    }, 300);

    return () => clearTimeout(debounce);
  }, [query, performSearch]);

  const handleClose = () => {
    setIsOpen(false);
    setQuery("");
    setResults(null);
  };

  const totalResults =
    (results?.resumes.length || 0) +
    (results?.jobs.length || 0) +
    (results?.matches.length || 0);

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search candidates, jobs, skills..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="pl-10 pr-10"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setResults(null);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && query.length >= 2 && (
        <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 max-h-[500px] overflow-y-auto z-50">
          {isLoading ? (
            <div className="p-8 text-center">
              <Loader2 className="h-6 w-6 animate-spin mx-auto text-gray-400" />
              <p className="text-sm text-gray-500 mt-2">Searching...</p>
            </div>
          ) : results && totalResults > 0 ? (
            <div className="p-2">
              {/* Resumes */}
              {results.resumes.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase px-2 py-1">
                    Candidates ({results.resumes.length})
                  </h3>
                  {results.resumes.map((resume) => {
                    const skills = Array.isArray(resume.skills)
                      ? (resume.skills as string[])
                      : [];
                    return (
                      <button
                        key={resume.id}
                        onClick={() => {
                          router.push(`/dashboard/resumes/${resume.id}`);
                          handleClose();
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-md flex items-start gap-3"
                      >
                        <FileText className="h-5 w-5 text-indigo-600 mt-0.5 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">
                            {resume.candidateName}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {resume.email}
                          </p>
                          {skills.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {skills.slice(0, 3).map((skill) => (
                                <Badge
                                  key={skill}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {skill}
                                </Badge>
                              ))}
                              {skills.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{skills.length - 3}
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Jobs */}
              {results.jobs.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase px-2 py-1">
                    Jobs ({results.jobs.length})
                  </h3>
                  {results.jobs.map((job) => (
                    <button
                      key={job.id}
                      onClick={() => {
                        router.push(`/dashboard/jobs/${job.id}`);
                        handleClose();
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-md flex items-start gap-3 cursor-pointer"
                    >
                      <Briefcase className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {job.title}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {job.company}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            variant="outline"
                            className={
                              job.status === "OPEN"
                                ? "bg-green-50 text-green-700"
                                : "bg-gray-50 text-gray-700"
                            }
                          >
                            {job.status}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {job._count.matches} matches
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : query.length >= 2 ? (
            <div className="p-8 text-center">
              <Search className="h-8 w-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No results found</p>
              <p className="text-xs text-gray-400 mt-1">
                Try different keywords
              </p>
            </div>
          ) : null}
        </div>
      )}

      {/* Backdrop */}
      {isOpen && query.length >= 2 && (
        <div
          className="fixed inset-0 z-40"
          onClick={handleClose}
        />
      )}
    </div>
  );
}
