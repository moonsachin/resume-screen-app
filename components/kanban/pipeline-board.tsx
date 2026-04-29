"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import { PipelineColumn } from "./pipeline-column";
import { CandidateCard } from "./candidate-card";

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

interface PipelineBoardProps {
  initialData: Record<string, PipelineCandidate[]>;
  jobId: string;
}

const STAGES = [
  { id: "APPLIED", label: "Applied", color: "bg-gray-100" },
  { id: "REVIEWED", label: "Reviewed", color: "bg-blue-100" },
  { id: "SHORTLISTED", label: "Shortlisted", color: "bg-purple-100" },
  { id: "INTERVIEW_SCHEDULED", label: "Interview Scheduled", color: "bg-yellow-100" },
  { id: "INTERVIEWED", label: "Interviewed", color: "bg-orange-100" },
  { id: "OFFERED", label: "Offered", color: "bg-green-100" },
  { id: "HIRED", label: "Hired", color: "bg-emerald-100" },
  { id: "REJECTED", label: "Rejected", color: "bg-red-100" },
];

export function PipelineBoard({ initialData, jobId }: PipelineBoardProps) {
  const router = useRouter();
  const [candidates, setCandidates] = useState(initialData);
  const [activeCandidate, setActiveCandidate] = useState<PipelineCandidate | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const candidate = Object.values(candidates)
      .flat()
      .find((c) => c.matchId === active.id);
    setActiveCandidate(candidate || null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveCandidate(null);

    if (!over || active.id === over.id) return;

    const candidateId = active.id as string;
    const newStage = over.id as string;

    // Find the candidate
    let candidate: PipelineCandidate | undefined;
    let oldStage: string | undefined;

    for (const [stage, stageCandidates] of Object.entries(candidates)) {
      const found = stageCandidates.find((c) => c.matchId === candidateId);
      if (found) {
        candidate = found;
        oldStage = stage;
        break;
      }
    }

    if (!candidate || !oldStage || oldStage === newStage) return;

    // Optimistic update
    const newCandidates = { ...candidates };
    newCandidates[oldStage] = newCandidates[oldStage].filter(
      (c) => c.matchId !== candidateId
    );
    newCandidates[newStage] = [
      ...newCandidates[newStage],
      { ...candidate, stage: newStage },
    ];
    setCandidates(newCandidates);

    // Update on server
    setIsUpdating(true);
    try {
      const response = await fetch("/api/pipeline/update-stage", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          matchId: candidateId,
          stage: newStage,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update stage");
      }

      toast.success(`Moved ${candidate.candidateName} to ${STAGES.find((s) => s.id === newStage)?.label}`);
      router.refresh();
    } catch (error) {
      // Revert on error
      setCandidates(candidates);
      toast.error("Failed to update candidate stage");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {STAGES.map((stage) => (
          <PipelineColumn
            key={stage.id}
            id={stage.id}
            label={stage.label}
            color={stage.color}
            candidates={candidates[stage.id] || []}
            isUpdating={isUpdating}
          />
        ))}
      </div>

      <DragOverlay>
        {activeCandidate ? (
          <div className="rotate-3 opacity-80">
            <CandidateCard candidate={activeCandidate} isDragging />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
