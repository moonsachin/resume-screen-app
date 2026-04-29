"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { GripVertical, Mail, Award } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export interface PipelineCandidate {
  id: string;
  matchId: string;
  stage: string;
  candidateName: string;
  email: string;
  score: number;
  recommendation: string | null;
  skills: string[];
  experienceYears: number | null;
  updatedAt: Date;
}

interface CandidateCardProps {
  candidate: PipelineCandidate;
  isDragging?: boolean;
  isUpdating?: boolean;
}

export function CandidateCard({
  candidate,
  isDragging = false,
  isUpdating = false,
}: CandidateCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: candidate.matchId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-600 bg-green-50";
    if (score >= 70) return "text-emerald-600 bg-emerald-50";
    if (score >= 50) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <Card
        className={cn(
          "cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow",
          (isDragging || isSortableDragging) && "opacity-50",
          isUpdating && "pointer-events-none opacity-60"
        )}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-2">
            <div {...listeners} className="mt-1 cursor-grab">
              <GripVertical className="h-4 w-4 text-gray-400" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/dashboard/resumes/${candidate.matchId}`}
                    className="font-medium text-gray-900 hover:text-emerald-600 truncate block"
                  >
                    {candidate.candidateName}
                  </Link>
                  <p className="text-xs text-gray-500 truncate flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {candidate.email}
                  </p>
                </div>

                <div
                  className={cn(
                    "flex items-center justify-center h-10 w-10 rounded-full font-bold text-sm shrink-0",
                    getScoreColor(candidate.score)
                  )}
                >
                  {Math.round(candidate.score)}
                </div>
              </div>

              {candidate.skills.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {candidate.skills.slice(0, 3).map((skill) => (
                    <Badge key={skill} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {candidate.skills.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{candidate.skills.length - 3}
                    </Badge>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>
                  {candidate.experienceYears
                    ? `${candidate.experienceYears} yrs exp`
                    : "N/A"}
                </span>
                <span>{formatDate(candidate.updatedAt)}</span>
              </div>

              {candidate.recommendation && (
                <div className="mt-2">
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs",
                      candidate.recommendation === "Strong Fit" &&
                        "bg-green-50 text-green-700",
                      candidate.recommendation === "Good Fit" &&
                        "bg-emerald-50 text-emerald-700",
                      candidate.recommendation === "Moderate Fit" &&
                        "bg-yellow-50 text-yellow-700"
                    )}
                  >
                    <Award className="h-3 w-3 mr-1" />
                    {candidate.recommendation}
                  </Badge>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
