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
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit")) || 10));
    const search = searchParams.get("search")?.trim() || "";
    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { candidateName: { contains: search, mode: "insensitive" as const } },
            { email: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {};

    const [resumes, total] = await Promise.all([
      prisma.resume.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        select: {
          id: true,
          candidateName: true,
          email: true,
          phone: true,
          fileUrl: true,
          fileSize: true,
          fileType: true,
          skills: true,
          experienceYears: true,
          summary: true,
          createdAt: true,
          _count: { select: { matches: true } },
        },
      }),
      prisma.resume.count({ where }),
    ]);

    return NextResponse.json({
      resumes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("GET /api/resumes error:", error);
    return NextResponse.json(
      { error: "Failed to fetch resumes" },
      { status: 500 }
    );
  }
}
