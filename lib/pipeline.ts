import { prisma } from "./prisma";

export type PipelineStage =
  | "APPLIED"
  | "REVIEWED"
  | "SHORTLISTED"
  | "INTERVIEW_SCHEDULED"
  | "INTERVIEWED"
  | "OFFERED"
  | "HIRED"
  | "REJECTED";

export interface PipelineCandidate {
  id: string;
  matchId: string;
  stage: PipelineStage;
  candidateName: string;
  email: string;
  score: number;
  recommendation: string | null;
  skills: string[];
  experienceYears: number | null;
  updatedAt: Date;
}

/**
 * Get pipeline data for a job
 */
export async function getPipelineData(jobId: string): Promise<{
  stages: Record<PipelineStage, PipelineCandidate[]>;
  total: number;
}> {
  const matches = await prisma.match.findMany({
    where: { jobId },
    include: {
      resume: {
        select: {
          candidateName: true,
          email: true,
          skills: true,
          experienceYears: true,
        },
      },
      candidatePipeline: true,
    },
    orderBy: { score: "desc" },
  });

  const stages: Record<PipelineStage, PipelineCandidate[]> = {
    APPLIED: [],
    REVIEWED: [],
    SHORTLISTED: [],
    INTERVIEW_SCHEDULED: [],
    INTERVIEWED: [],
    OFFERED: [],
    HIRED: [],
    REJECTED: [],
  };

  matches.forEach((match) => {
    const stage = match.candidatePipeline?.stage || "APPLIED";
    const skills = Array.isArray(match.resume.skills)
      ? (match.resume.skills as string[])
      : [];

    stages[stage].push({
      id: match.candidatePipeline?.id || match.id,
      matchId: match.id,
      stage,
      candidateName: match.resume.candidateName,
      email: match.resume.email,
      score: match.score,
      recommendation: match.recommendation,
      skills,
      experienceYears: match.resume.experienceYears,
      updatedAt: match.candidatePipeline?.updatedAt || match.createdAt,
    });
  });

  return {
    stages,
    total: matches.length,
  };
}

/**
 * Update candidate pipeline stage
 */
export async function updatePipelineStage(
  matchId: string,
  newStage: PipelineStage
): Promise<void> {
  const existing = await prisma.candidatePipeline.findUnique({
    where: { matchId },
  });

  if (existing) {
    await prisma.candidatePipeline.update({
      where: { matchId },
      data: { stage: newStage },
    });
  } else {
    await prisma.candidatePipeline.create({
      data: {
        matchId,
        stage: newStage,
      },
    });
  }
}

/**
 * Get stage statistics
 */
export async function getPipelineStats(jobId: string): Promise<
  Record<PipelineStage, number>
> {
  const matches = await prisma.match.findMany({
    where: { jobId },
    include: { candidatePipeline: true },
  });

  const stats: Record<PipelineStage, number> = {
    APPLIED: 0,
    REVIEWED: 0,
    SHORTLISTED: 0,
    INTERVIEW_SCHEDULED: 0,
    INTERVIEWED: 0,
    OFFERED: 0,
    HIRED: 0,
    REJECTED: 0,
  };

  matches.forEach((match) => {
    const stage = match.candidatePipeline?.stage || "APPLIED";
    stats[stage]++;
  });

  return stats;
}
