import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { MatchesClient } from "./matches-client";

interface MatchesPageProps {
  params: Promise<{ jobId: string }>;
}

export async function generateMetadata({ params }: MatchesPageProps): Promise<Metadata> {
  const { jobId } = await params;
  const job = await prisma.job.findUnique({ where: { id: jobId } });
  
  return {
    title: job ? `Matches for ${job.title} — ResumeAI` : "Matches",
    description: `View candidate matches for ${job?.title || "this job"}`,
  };
}

async function getJobWithMatches(jobId: string) {
  return prisma.job.findUnique({
    where: { id: jobId },
    include: {
      matches: {
        orderBy: [{ score: "desc" }, { createdAt: "desc" }],
        include: {
          resume: {
            select: {
              id: true,
              candidateName: true,
              email: true,
              phone: true,
              fileUrl: true,
              experienceYears: true,
              skills: true,
            },
          },
        },
      },
    },
  });
}

export default async function MatchesPage({ params }: MatchesPageProps) {
  const { jobId } = await params;
  const job = await getJobWithMatches(jobId);

  if (!job) {
    notFound();
  }

  return <MatchesClient job={job} />;
}
