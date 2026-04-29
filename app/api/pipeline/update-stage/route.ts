import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { updatePipelineStage } from "@/lib/pipeline";
import { z } from "zod";

const updateStageSchema = z.object({
  matchId: z.string(),
  stage: z.enum([
    "APPLIED",
    "REVIEWED",
    "SHORTLISTED",
    "INTERVIEW_SCHEDULED",
    "INTERVIEWED",
    "OFFERED",
    "HIRED",
    "REJECTED",
  ]),
});

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = updateStageSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { matchId, stage } = parsed.data;

    await updatePipelineStage(matchId, stage);

    return NextResponse.json({
      message: "Pipeline stage updated successfully",
    });
  } catch (error) {
    console.error("PUT /api/pipeline/update-stage error:", error);
    return NextResponse.json(
      { error: "Failed to update pipeline stage" },
      { status: 500 }
    );
  }
}
