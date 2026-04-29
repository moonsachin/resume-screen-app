import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { jobSchema } from "@/lib/validations/job";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    const job = await prisma.job.findUnique({
      where: { id },
      include: {
        _count: { select: { matches: true } },
        matches: {
          orderBy: { score: "desc" },
          take: 5,
          include: {
            resume: {
              select: {
                id: true,
                candidateName: true,
                email: true,
                experienceYears: true,
              },
            },
          },
        },
      },
    });

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    return NextResponse.json({ job });
  } catch (error) {
    console.error("GET /api/jobs/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch job" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    const existing = await prisma.job.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    const body = await request.json();
    const parsed = jobSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const job = await prisma.job.update({
      where: { id },
      data: {
        title: parsed.data.title,
        company: parsed.data.company,
        location: parsed.data.location || null,
        employmentType: parsed.data.employmentType,
        experienceRequired: parsed.data.experienceRequired ?? null,
        requiredSkills: parsed.data.requiredSkills,
        optionalSkills: parsed.data.optionalSkills,
        salaryRange: parsed.data.salaryRange || null,
        description: parsed.data.description,
        status: parsed.data.status,
      },
    });

    return NextResponse.json({ message: "Job updated successfully", job });
  } catch (error) {
    console.error("PUT /api/jobs/[id] error:", error);
    return NextResponse.json({ error: "Failed to update job" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    const existing = await prisma.job.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // Hard delete — cascades to matches via schema
    await prisma.job.delete({ where: { id } });

    return NextResponse.json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/jobs/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete job" }, { status: 500 });
  }
}
