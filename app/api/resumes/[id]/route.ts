import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { unlink } from "fs/promises";
import path from "path";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    const resume = await prisma.resume.findUnique({
      where: { id },
      include: {
        matches: {
          include: {
            job: {
              select: {
                id: true,
                title: true,
                company: true,
              },
            },
          },
          orderBy: { score: "desc" },
        },
      },
    });

    if (!resume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    return NextResponse.json({ resume });
  } catch (error) {
    console.error("GET /api/resumes/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch resume" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    // Get resume to find file path
    const resume = await prisma.resume.findUnique({
      where: { id },
      select: { fileUrl: true },
    });

    if (!resume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    // Delete from database (cascades to matches)
    await prisma.resume.delete({ where: { id } });

    // Delete file from disk
    try {
      const filePath = path.join(process.cwd(), "public", resume.fileUrl);
      await unlink(filePath);
    } catch (fileError) {
      console.error("Failed to delete file:", fileError);
      // Continue even if file deletion fails
    }

    return NextResponse.json({
      message: "Resume deleted successfully",
    });
  } catch (error) {
    console.error("DELETE /api/resumes/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete resume" },
      { status: 500 }
    );
  }
}
