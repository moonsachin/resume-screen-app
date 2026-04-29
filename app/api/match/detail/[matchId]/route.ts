import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface RouteContext {
  params: Promise<{ matchId: string }>;
}

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { matchId } = await context.params;

    const match = await prisma.match.findUnique({
      where: { id: matchId },
      include: {
        resume: true,
        job: true,
      },
    });

    if (!match) {
      return NextResponse.json({ error: "Match not found" }, { status: 404 });
    }

    return NextResponse.json({ match });
  } catch (error) {
    console.error("GET /api/match/detail/[matchId] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch match details" },
      { status: 500 }
    );
  }
}
