import { prisma } from "./prisma";

export interface ExportCandidate {
  rank: number;
  candidateName: string;
  email: string;
  phone: string | null;
  score: number;
  skillMatchPercent: number | null;
  experienceYears: number | null;
  recommendation: string | null;
  missingSkills: string;
  jobTitle: string;
  jobCompany: string;
}

export interface ExportOptions {
  jobId?: string;
  scoreMin?: number;
  scoreMax?: number;
  recommendation?: string;
  limit?: number;
}

/**
 * Get candidates for CSV export
 */
export async function getCandidatesForExport(
  options: ExportOptions = {}
): Promise<ExportCandidate[]> {
  const { jobId, scoreMin, scoreMax, recommendation, limit } = options;

  const where: Record<string, unknown> = {};

  if (jobId) {
    where.jobId = jobId;
  }

  if (scoreMin !== undefined || scoreMax !== undefined) {
    where.score = {};
    if (scoreMin !== undefined) {
      (where.score as Record<string, unknown>).gte = scoreMin;
    }
    if (scoreMax !== undefined) {
      (where.score as Record<string, unknown>).lte = scoreMax;
    }
  }

  if (recommendation) {
    where.recommendation = recommendation;
  }

  const matches = await prisma.match.findMany({
    where,
    orderBy: [{ score: "desc" }, { createdAt: "desc" }],
    take: limit,
    include: {
      resume: {
        select: {
          candidateName: true,
          email: true,
          phone: true,
          experienceYears: true,
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

  return matches.map((match, index) => ({
    rank: index + 1,
    candidateName: match.resume.candidateName,
    email: match.resume.email,
    phone: match.resume.phone,
    score: Math.round(match.score),
    skillMatchPercent: match.skillMatchPercent
      ? Math.round(match.skillMatchPercent)
      : null,
    experienceYears: match.resume.experienceYears,
    recommendation: match.recommendation,
    missingSkills: Array.isArray(match.missingSkills)
      ? (match.missingSkills as string[]).join(", ")
      : "",
    jobTitle: match.job.title,
    jobCompany: match.job.company,
  }));
}

/**
 * Convert candidates to CSV format
 */
export function convertToCSV(candidates: ExportCandidate[]): string {
  const headers = [
    "Rank",
    "Candidate Name",
    "Email",
    "Phone",
    "Score",
    "Skill Match %",
    "Experience (Years)",
    "Recommendation",
    "Missing Skills",
    "Job Title",
    "Company",
  ];

  const rows = candidates.map((c) => [
    c.rank,
    c.candidateName,
    c.email,
    c.phone || "",
    c.score,
    c.skillMatchPercent || "",
    c.experienceYears || "",
    c.recommendation || "",
    c.missingSkills,
    c.jobTitle,
    c.jobCompany,
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) =>
      row
        .map((cell) => {
          // Escape quotes and wrap in quotes if contains comma
          const cellStr = String(cell);
          if (cellStr.includes(",") || cellStr.includes('"')) {
            return `"${cellStr.replace(/"/g, '""')}"`;
          }
          return cellStr;
        })
        .join(",")
    ),
  ].join("\n");

  return csvContent;
}

/**
 * Generate filename for CSV export
 */
export function generateExportFilename(jobTitle?: string): string {
  const timestamp = new Date().toISOString().split("T")[0];
  const jobPart = jobTitle
    ? jobTitle.toLowerCase().replace(/[^a-z0-9]/g, "-")
    : "all-candidates";
  return `candidates-${jobPart}-${timestamp}.csv`;
}
