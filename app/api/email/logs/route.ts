import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const matchId = searchParams.get("matchId");
    const jobId = searchParams.get("jobId");
    const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit")) || 50));

    const where: Record<string, unknown> = {};

    if (matchId) {
      where.matchId = matchId;
    } else if (jobId) {
      where.match = {
        jobId,
      };
    }

    const logs = await prisma.emailLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        match: {
          include: {
            resume: {
              select: {
                candidateName: true,
                email: true,
              },
            },
            job: {
              select: {
                title: true,
                company: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ logs });
  } catch (error) {
    console.error("GET /api/email/logs error:", error);
    return NextResponse.json(
      { error: "Failed to fetch email logs" },
      { status: 500 }
    );
  }
}
