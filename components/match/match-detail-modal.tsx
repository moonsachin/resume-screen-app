"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Download, CheckCircle, XCircle, TrendingUp, AlertCircle } from "lucide-react";

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

interface MatchDetailModalProps {
  match: Match;
  onClose: () => void;
}

export function MatchDetailModal({ match, onClose }: MatchDetailModalProps) {
  const matchedSkills = Array.isArray(match.matchedSkills)
    ? (match.matchedSkills as string[])
    : [];
  const missingSkills = Array.isArray(match.missingSkills)
    ? (match.missingSkills as string[])
    : [];
  const strengths = Array.isArray(match.strengths)
    ? (match.strengths as string[])
    : [];
  const weaknesses = Array.isArray(match.weaknesses)
    ? (match.weaknesses as string[])
    : [];
  const candidateSkills = Array.isArray(match.resume.skills)
    ? (match.resume.skills as string[])
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {match.resume.candidateName}
            </h2>
            <p className="text-sm text-gray-500">{match.resume.email}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Score Overview */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-3xl font-bold text-emerald-600">
                    {Math.round(match.score)}%
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Overall Score</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-600">
                    {match.skillMatchPercent
                      ? `${Math.round(match.skillMatchPercent)}%`
                      : "N/A"}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Skill Match</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-600">
                    {match.resume.experienceYears || "N/A"}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Years Experience</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t text-center">
                <Badge
                  className={
                    match.recommendation === "Strong Fit"
                      ? "bg-green-100 text-green-800"
                      : match.recommendation === "Good Fit"
                        ? "bg-emerald-100 text-emerald-800"
                        : match.recommendation === "Moderate Fit"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                  }
                >
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {match.recommendation || "N/A"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Strengths */}
          {strengths.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="h-5 w-5" />
                  Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {strengths.map((strength, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">•</span>
                      <span className="text-sm text-gray-700">{strength}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Weaknesses */}
          {weaknesses.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-700">
                  <AlertCircle className="h-5 w-5" />
                  Areas of Concern
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {weaknesses.map((weakness, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-red-600 mt-1">•</span>
                      <span className="text-sm text-gray-700">{weakness}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Skills Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>Skills Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {matchedSkills.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <h3 className="text-sm font-medium text-gray-700">
                      Matched Skills ({matchedSkills.length})
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {matchedSkills.map((skill) => (
                      <Badge
                        key={skill}
                        className="bg-green-100 text-green-800"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {missingSkills.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <XCircle className="h-4 w-4 text-red-600" />
                    <h3 className="text-sm font-medium text-gray-700">
                      Missing Skills ({missingSkills.length})
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {missingSkills.map((skill) => (
                      <Badge key={skill} className="bg-red-100 text-red-800">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {candidateSkills.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    All Candidate Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {candidateSkills.map((skill) => (
                      <Badge key={skill} variant="outline">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Experience Relevance */}
          {match.experienceRelevance && (
            <Card>
              <CardHeader>
                <CardTitle>Experience Assessment</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700">{match.experienceRelevance}</p>
              </CardContent>
            </Card>
          )}

          {/* Contact Info */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="text-sm font-medium">{match.resume.email}</p>
              </div>
              {match.resume.phone && (
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="text-sm font-medium">{match.resume.phone}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-3">
            <a
              href={match.resume.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1"
            >
              <Button className="w-full gap-2">
                <Download className="h-4 w-4" />
                Download Resume
              </Button>
            </a>
            <Button variant="outline" onClick={onClose} className="flex-1">
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
