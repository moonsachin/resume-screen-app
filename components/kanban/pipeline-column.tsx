"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CandidateCard, type PipelineCandidate } from "./candidate-card";
import { cn } from "@/lib/utils";

interface PipelineColumnProps {
  id: string;
  label: string;
  color: string;
  candidates: PipelineCandidate[];
  isUpdating: boolean;
}

export function PipelineColumn({
  id,
  label,
  color,
  candidates,
  isUpdating,
}: PipelineColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div className="flex-shrink-0 w-80">
      <Card
        className={cn(
          "h-full transition-colors",
          isOver && "ring-2 ring-emerald-500"
        )}
      >
        <div className={cn("p-4 rounded-t-lg", color)}>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">{label}</h3>
            <Badge variant="secondary">{candidates.length}</Badge>
          </div>
        </div>

        <div
          ref={setNodeRef}
          className="p-4 space-y-3 min-h-[400px] max-h-[600px] overflow-y-auto"
        >
          <SortableContext
            items={candidates.map((c) => c.matchId)}
            strategy={verticalListSortingStrategy}
          >
            {candidates.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-sm">
                No candidates
              </div>
            ) : (
              candidates.map((candidate) => (
                <CandidateCard
                  key={candidate.matchId}
                  candidate={candidate}
                  isUpdating={isUpdating}
                />
              ))
            )}
          </SortableContext>
        </div>
      </Card>
    </div>
  );
}
