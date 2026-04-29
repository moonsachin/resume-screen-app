import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendEmail, generateEmail } from "@/lib/email";
import { z } from "zod";

const bulkEmailSchema = z.object({
  matchIds: z.array(z.string()).min(1),
  type: z.enum(["SHORTLISTED", "INTERVIEW_SCHEDULED", "REJECTION", "CUSTOM"]),
  subject: z.string().optional(),
  body: z.string().optional(),
  interviewDate: z.string().optional(),
  interviewTime: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = bulkEmailSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { matchIds, type, subject, body: customBody, interviewDate, interviewTime } = parsed.data;

    // Get all matches
    const matches = await prisma.match.findMany({
      where: { id: { in: matchIds } },
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
    });

    if (matches.length === 0) {
      return NextResponse.json({ error: "No matches found" }, { status: 404 });
    }

    const results = {
      sent: 0,
      failed: 0,
      total: matches.length,
    };

    // Send emails with delay to avoid rate limiting
    for (const match of matches) {
      const emailData: Record<string, string> = {
        candidateName: match.resume.candidateName,
        jobTitle: match.job.title,
        company: match.job.company,
        subject: subject || "",
        body: customBody || "",
      };

      if (interviewDate) emailData.interviewDate = interviewDate;
      if (interviewTime) emailData.interviewTime = interviewTime;

      const emailTemplate = generateEmail(
        type.toLowerCase() as "shortlisted" | "interviewScheduled" | "rejection" | "custom",
        emailData
      );

      const result = await sendEmail({
        to: match.resume.email,
        subject: emailTemplate.subject,
        html: emailTemplate.body,
      });

      // Log email
      await prisma.emailLog.create({
        data: {
          matchId: match.id,
          type,
          subject: emailTemplate.subject,
          body: emailTemplate.body,
          status: result.success ? "SENT" : "FAILED",
          sentAt: result.success ? new Date() : null,
          error: result.error,
        },
      });

      if (result.success) {
        results.sent++;
      } else {
        results.failed++;
      }

      // Small delay between emails
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    return NextResponse.json({
      message: "Bulk email completed",
      results,
    });
  } catch (error) {
    console.error("POST /api/email/bulk error:", error);
    return NextResponse.json(
      { error: "Failed to send bulk emails" },
      { status: 500 }
    );
  }
}
