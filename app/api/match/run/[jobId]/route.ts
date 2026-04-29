import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { matchAllResumesToJob } from "@/lib/matcher";

interface RouteContext {
  params: Promise<{ jobId: string }>;
}

export async function POST(_request: NextRequest, context: RouteContext) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { jobId } = await context.params;

    // Fetch job with required fields
    const job = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // Fetch all resumes
    const resumes = await prisma.resume.findMany({
      select: {
        id: true,
        candidateName: true,
        extractedText: true,
        skills: true,
        experienceYears: true,
        summary: true,
      },
    });

    if (resumes.length === 0) {
      return NextResponse.json(
        { error: "No resumes found to match" },
        { status: 400 }
      );
    }

    // Prepare job data for matching
    const jobData = {
      title: job.title,
      description: job.description,
      requiredSkills: Array.isArray(job.requiredSkills)
        ? (job.requiredSkills as string[])
        : [],
      optionalSkills: Array.isArray(job.optionalSkills)
        ? (job.optionalSkills as string[])
        : [],
      experienceRequired: job.experienceRequired,
    };

    // Prepare resume data
    const resumeData = resumes.map((r) => ({
      id: r.id,
      candidateName: r.candidateName,
      extractedText: r.extractedText,
      skills: Array.isArray(r.skills) ? (r.skills as string[]) : null,
      experienceYears: r.experienceYears,
      summary: r.summary,
    }));

    // Run AI matching with concurrency control
    const matchResults = await matchAllResumesToJob(
      resumeData,
      jobData,
      3 // concurrency limit
    );

    // Delete existing matches for this job (re-run scenario)
    await prisma.match.deleteMany({
      where: { jobId },
    });

    // Save successful matches to database
    const successfulMatches = matchResults.filter((m) => m.result !== null);
    
    if (successfulMatches.length === 0) {
      return NextResponse.json(
        { error: "All matching attempts failed" },
        { status: 500 }
      );
    }

    const matchRecords = await prisma.match.createMany({
      data: successfulMatches.map((m) => ({
        jobId,
        resumeId: m.resumeId,
        score: m.result!.score,
        skillMatchPercent: m.result!.skillMatchPercent,
        matchedSkills: m.result!.matchedSkills,
        missingSkills: m.result!.missingSkills,
        strengths: m.result!.strengths,
        weaknesses: m.result!.weaknesses,
        experienceRelevance: m.result!.experienceRelevance,
        recommendation: m.result!.recommendation,
      })),
    });

    return NextResponse.json({
      message: "Matching completed successfully",
      totalResumes: resumes.length,
      successfulMatches: successfulMatches.length,
      failedMatches: matchResults.length - successfulMatches.length,
      matchesCreated: matchRecords.count,
    });
  } catch (error) {
    console.error("POST /api/match/run/[jobId] error:", error);
    return NextResponse.json(
      { error: "Failed to run matching", details: (error as Error).message },
      { status: 500 }
    );
  }
}
