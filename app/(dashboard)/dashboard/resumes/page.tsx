import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ResumesClient } from "./resumes-client";

export const metadata: Metadata = {
  title: "Resumes — ResumeAI",
  description: "Upload and manage candidate resumes with AI-powered parsing",
};

async function getResumes() {
  const resumes = await prisma.resume.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { matches: true } },
    },
  });

  // Cast Prisma Json fields to expected types
  return resumes.map((r) => ({
    ...r,
    skills: (r.skills as string[] | null) ?? null,
  }));
}

export default async function ResumesPage() {
  const resumes = await getResumes();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Resumes</h1>
        <p className="text-gray-500 mt-1">
          Upload and manage candidate resumes with AI-powered parsing
        </p>
      </div>

      <ResumesClient initialResumes={resumes} />
    </div>
  );
}
