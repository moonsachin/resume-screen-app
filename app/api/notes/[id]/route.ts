import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

interface RouteContext {
  params: Promise<{ id: string }>;
}

const updateNoteSchema = z.object({
  content: z.string().min(1, "Note content is required"),
});

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await request.json();
    const parsed = updateNoteSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { content } = parsed.data;

    // Check if note exists and belongs to user
    const existing = await prisma.note.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    if (existing.userId !== session.user.id) {
      return NextResponse.json(
        { error: "You can only edit your own notes" },
        { status: 403 }
      );
    }

    const note = await prisma.note.update({
      where: { id },
      data: { content },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: "Note updated successfully",
      note,
    });
  } catch (error) {
    console.error("PUT /api/notes/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update note" },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    // Check if note exists and belongs to user
    const existing = await prisma.note.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    if (existing.userId !== session.user.id) {
      return NextResponse.json(
        { error: "You can only delete your own notes" },
        { status: 403 }
      );
    }

    await prisma.note.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Note deleted successfully",
    });
  } catch (error) {
    console.error("DELETE /api/notes/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete note" },
      { status: 500 }
    );
  }
}
