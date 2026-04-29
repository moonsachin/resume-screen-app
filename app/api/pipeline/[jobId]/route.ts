import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getPipelineData, getPipelineStats } from "@/lib/pipeline";

interface RouteContext {
  params: Promise<{ jobId: string }>;
}

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { jobId } = await context.params;

    const [pipelineData, stats] = await Promise.all([
      getPipelineData(jobId),
      getPipelineStats(jobId),
    ]);

    return NextResponse.json({
      pipeline: pipelineData,
      stats,
    });
  } catch (error) {
    console.error("GET /api/pipeline/[jobId] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch pipeline data" },
      { status: 500 }
    );
  }
}
