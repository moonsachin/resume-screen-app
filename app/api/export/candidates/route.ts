import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getCandidatesForExport, convertToCSV, generateExportFilename } from "@/lib/export";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get("jobId") || undefined;
    const scoreMin = searchParams.get("scoreMin")
      ? Number(searchParams.get("scoreMin"))
      : undefined;
    const scoreMax = searchParams.get("scoreMax")
      ? Number(searchParams.get("scoreMax"))
      : undefined;
    const recommendation = searchParams.get("recommendation") || undefined;
    const limit = searchParams.get("limit")
      ? Number(searchParams.get("limit"))
      : undefined;

    // Get candidates
    const candidates = await getCandidatesForExport({
      jobId,
      scoreMin,
      scoreMax,
      recommendation,
      limit,
    });

    if (candidates.length === 0) {
      return NextResponse.json(
        { error: "No candidates found matching criteria" },
        { status: 404 }
      );
    }

    // Convert to CSV
    const csv = convertToCSV(candidates);

    // Get job title for filename
    let jobTitle: string | undefined;
    if (jobId) {
      const job = await prisma.job.findUnique({
        where: { id: jobId },
        select: { title: true },
      });
      jobTitle = job?.title;
    }

    const filename = generateExportFilename(jobTitle);

    // Return CSV file
    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("GET /api/export/candidates error:", error);
    return NextResponse.json(
      { error: "Export failed" },
      { status: 500 }
    );
  }
}
