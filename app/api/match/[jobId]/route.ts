import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface RouteContext {
  params: Promise<{ jobId: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { jobId } = await context.params;
    const { searchParams } = new URL(request.url);
    const sortBy = searchParams.get("sortBy") || "score";
    const order = searchParams.get("order") || "desc";

    // Validate sort parameters
    const validSortFields = ["score", "skillMatchPercent", "createdAt"];
    const sortField = validSortFields.includes(sortBy) ? sortBy : "score";
    const sortOrder = order === "asc" ? "asc" : "desc";

    // Fetch matches for this job
    const matches = await prisma.match.findMany({
      where: { jobId },
      orderBy: [
        { [sortField]: sortOrder },
        { score: "desc" }, // Secondary sort by score
      ],
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
            education: true,
            summary: true,
          },
        },
      },
    });

    // Add rank to each match
    const rankedMatches = matches.map((match, index) => ({
      ...match,
      rank: index + 1,
    }));

    return NextResponse.json({
      matches: rankedMatches,
      total: matches.length,
    });
  } catch (error) {
    console.error("GET /api/match/[jobId] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch matches" },
      { status: 500 }
    );
  }
}
