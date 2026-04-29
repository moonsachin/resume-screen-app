import { Resend } from "resend";

// Lazy initialization to avoid build-time errors
let resend: Resend | null = null;

function getResendClient(): Resend {
  if (!resend && process.env.RESEND_API_KEY) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  if (!resend) {
    throw new Error("Resend client not initialized. RESEND_API_KEY is missing.");
  }
  return resend;
}

export interface EmailTemplate {
  subject: string;
  body: string;
}

export interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

/**
 * Send email using Resend
 */
export async function sendEmail({
  to,
  subject,
  html,
  from = "ResumeAI <onboarding@resend.dev>",
}: SendEmailParams): Promise<{ success: boolean; error?: string; messageId?: string }> {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.warn("RESEND_API_KEY not set, skipping email send");
      return { success: false, error: "Email service not configured" };
    }

    const resendClient = getResendClient();
    const { data, error } = await resendClient.emails.send({
      from,
      to,
      subject,
      html,
    });

    if (error) {
      console.error("Resend error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error("Email send error:", error);
    return { success: false, error: (error as Error).message };
  }
}

/**
 * Email templates
 */
export const emailTemplates = {
  shortlisted: (data: {
    candidateName: string;
    jobTitle: string;
    company: string;
  }): EmailTemplate => ({
    subject: `You've been shortlisted for ${data.jobTitle}`,
    body: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #10b981;">Congratulations, ${data.candidateName}!</h2>
        <p>We're pleased to inform you that you've been shortlisted for the position of <strong>${data.jobTitle}</strong> at ${data.company}.</p>
        <p>Your profile stood out among many qualified candidates, and we're excited to move forward with your application.</p>
        <h3>Next Steps:</h3>
        <ul>
          <li>Our team will review your application in detail</li>
          <li>You'll hear from us within 3-5 business days</li>
          <li>We may reach out to schedule an interview</li>
        </ul>
        <p>Thank you for your interest in joining our team!</p>
        <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
          Best regards,<br>
          ${data.company} Hiring Team
        </p>
      </div>
    `,
  }),

  interviewScheduled: (data: {
    candidateName: string;
    jobTitle: string;
    company: string;
    interviewDate?: string;
    interviewTime?: string;
  }): EmailTemplate => ({
    subject: `Interview Invitation - ${data.company}`,
    body: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #10b981;">Interview Invitation</h2>
        <p>Dear ${data.candidateName},</p>
        <p>We're excited to invite you for an interview for the <strong>${data.jobTitle}</strong> position at ${data.company}.</p>
        ${
          data.interviewDate && data.interviewTime
            ? `
        <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Date:</strong> ${data.interviewDate}</p>
          <p style="margin: 5px 0;"><strong>Time:</strong> ${data.interviewTime}</p>
        </div>
        `
            : ""
        }
        <h3>What to Expect:</h3>
        <ul>
          <li>Technical discussion about your experience</li>
          <li>Questions about your skills and projects</li>
          <li>Opportunity to ask questions about the role</li>
          <li>Duration: Approximately 45-60 minutes</li>
        </ul>
        <p>Please confirm your availability by replying to this email.</p>
        <p>We look forward to speaking with you!</p>
        <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
          Best regards,<br>
          ${data.company} Hiring Team
        </p>
      </div>
    `,
  }),

  rejection: (data: {
    candidateName: string;
    jobTitle: string;
    company: string;
  }): EmailTemplate => ({
    subject: `Update on your application - ${data.company}`,
    body: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Application Update</h2>
        <p>Dear ${data.candidateName},</p>
        <p>Thank you for your interest in the <strong>${data.jobTitle}</strong> position at ${data.company} and for taking the time to apply.</p>
        <p>After careful consideration, we've decided to move forward with other candidates whose qualifications more closely match our current needs.</p>
        <p>We were impressed by your background and encourage you to apply for future opportunities that align with your skills and experience.</p>
        <p>We wish you the best in your job search and future career endeavors.</p>
        <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
          Best regards,<br>
          ${data.company} Hiring Team
        </p>
      </div>
    `,
  }),

  custom: (data: {
    candidateName: string;
    subject: string;
    body: string;
  }): EmailTemplate => ({
    subject: data.subject,
    body: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <p>Dear ${data.candidateName},</p>
        ${data.body}
      </div>
    `,
  }),
};

/**
 * Generate email from template
 */
export function generateEmail(
  type: "shortlisted" | "interviewScheduled" | "rejection" | "custom",
  data: Record<string, string>
): EmailTemplate {
  switch (type) {
    case "shortlisted":
      return emailTemplates.shortlisted(data as Parameters<typeof emailTemplates.shortlisted>[0]);
    case "interviewScheduled":
      return emailTemplates.interviewScheduled(
        data as Parameters<typeof emailTemplates.interviewScheduled>[0]
      );
    case "rejection":
      return emailTemplates.rejection(data as Parameters<typeof emailTemplates.rejection>[0]);
    case "custom":
      return emailTemplates.custom(data as Parameters<typeof emailTemplates.custom>[0]);
    default:
      throw new Error(`Unknown email type: ${type}`);
  }
}
