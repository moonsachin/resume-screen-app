import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendEmail, generateEmail } from "@/lib/email";
import { z } from "zod";

const sendEmailSchema = z.object({
  matchId: z.string(),
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
    const parsed = sendEmailSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { matchId, type, subject, body: customBody, interviewDate, interviewTime } = parsed.data;

    // Get match with resume and job details
    const match = await prisma.match.findUnique({
      where: { id: matchId },
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

    if (!match) {
      return NextResponse.json({ error: "Match not found" }, { status: 404 });
    }

    // Generate email from template
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

    // Send email
    const result = await sendEmail({
      to: match.resume.email,
      subject: emailTemplate.subject,
      html: emailTemplate.body,
    });

    // Log email
    const emailLog = await prisma.emailLog.create({
      data: {
        matchId,
        type,
        subject: emailTemplate.subject,
        body: emailTemplate.body,
        status: result.success ? "SENT" : "FAILED",
        sentAt: result.success ? new Date() : null,
        error: result.error,
      },
    });

    if (!result.success) {
      return NextResponse.json(
        { error: "Failed to send email", details: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Email sent successfully",
      emailLog,
    });
  } catch (error) {
    console.error("POST /api/email/send error:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
