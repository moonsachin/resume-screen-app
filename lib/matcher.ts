import Groq from "groq-sdk";

let groqClient: Groq | null = null;

function getGroqClient(): Groq {
  if (!groqClient) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) throw new Error("GROQ_API_KEY is not set");
    groqClient = new Groq({ apiKey });
  }
  return groqClient;
}

export interface MatchResult {
  score: number;
  skillMatchPercent: number;
  matchedSkills: string[];
  missingSkills: string[];
  strengths: string[];
  weaknesses: string[];
  experienceRelevance: string;
  recommendation: string;
}

const MATCH_PROMPT = `You are an expert recruiter AI.
Compare the candidate resume with the job description below.
Return ONLY valid JSON — no markdown, no explanation, no code blocks.

Return exactly this structure:
{
  "score": 0,
  "skillMatchPercent": 0,
  "matchedSkills": [],
  "missingSkills": [],
  "strengths": [],
  "weaknesses": [],
  "experienceRelevance": "",
  "recommendation": "Strong Fit"
}

Scoring rules:
- score: 0-100 overall fit score
- skillMatchPercent: 0-100 percentage of required skills matched
- matchedSkills: array of skills the candidate has that match the job
- missingSkills: array of required skills the candidate is missing
- strengths: 2-4 bullet points about candidate strengths for this role
- weaknesses: 1-3 bullet points about gaps or concerns
- experienceRelevance: 1-2 sentence assessment of experience relevance
- recommendation: one of "Strong Fit", "Good Fit", "Moderate Fit", "Weak Fit"

`;

/**
 * Run AI matching between a resume and a job description
 */
export async function matchResumeToJob(
  resumeText: string,
  jobDescription: string,
  jobTitle: string,
  requiredSkills: string[],
  optionalSkills: string[],
  experienceRequired: number | null
): Promise<MatchResult> {
  const client = getGroqClient();

  const prompt = `${MATCH_PROMPT}
JOB TITLE: ${jobTitle}
REQUIRED SKILLS: ${requiredSkills.join(", ") || "Not specified"}
OPTIONAL SKILLS: ${optionalSkills.join(", ") || "Not specified"}
EXPERIENCE REQUIRED: ${experienceRequired ? `${experienceRequired} years` : "Not specified"}
JOB DESCRIPTION:
${jobDescription.slice(0, 2000)}

CANDIDATE RESUME:
${resumeText.slice(0, 4000)}
`;

  const completion = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.1,
    max_tokens: 1024,
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) throw new Error("Empty response from Groq");

  return parseMatchResult(content);
}

function parseMatchResult(content: string): MatchResult {
  let cleaned = content.trim();

  // Strip markdown code fences
  if (cleaned.startsWith("```json")) cleaned = cleaned.slice(7);
  else if (cleaned.startsWith("```")) cleaned = cleaned.slice(3);
  if (cleaned.endsWith("```")) cleaned = cleaned.slice(0, -3);
  cleaned = cleaned.trim();

  // Extract JSON object
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start !== -1 && end !== -1) cleaned = cleaned.slice(start, end + 1);

  let parsed: Partial<MatchResult>;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    console.error("Failed to parse match JSON:", cleaned.slice(0, 200));
    throw new Error("Failed to parse AI match response");
  }

  const validRecommendations = ["Strong Fit", "Good Fit", "Moderate Fit", "Weak Fit"];
  const recommendation = validRecommendations.includes(parsed.recommendation || "")
    ? (parsed.recommendation as string)
    : "Moderate Fit";

  return {
    score: Math.min(100, Math.max(0, Number(parsed.score) || 0)),
    skillMatchPercent: Math.min(100, Math.max(0, Number(parsed.skillMatchPercent) || 0)),
    matchedSkills: Array.isArray(parsed.matchedSkills)
      ? parsed.matchedSkills.map(String).filter(Boolean)
      : [],
    missingSkills: Array.isArray(parsed.missingSkills)
      ? parsed.missingSkills.map(String).filter(Boolean)
      : [],
    strengths: Array.isArray(parsed.strengths)
      ? parsed.strengths.map(String).filter(Boolean)
      : [],
    weaknesses: Array.isArray(parsed.weaknesses)
      ? parsed.weaknesses.map(String).filter(Boolean)
      : [],
    experienceRelevance: String(parsed.experienceRelevance || ""),
    recommendation,
  };
}

/**
 * Run matching for multiple resumes with concurrency control
 */
export async function matchAllResumesToJob(
  resumes: Array<{
    id: string;
    extractedText: string | null;
    skills: string[] | null;
    experienceYears: number | null;
    summary: string | null;
    candidateName: string;
  }>,
  job: {
    title: string;
    description: string;
    requiredSkills: string[];
    optionalSkills: string[];
    experienceRequired: number | null;
  },
  concurrency = 3,
  onProgress?: (completed: number, total: number) => void
): Promise<Array<{ resumeId: string; result: MatchResult | null; error?: string }>> {
  const results: Array<{ resumeId: string; result: MatchResult | null; error?: string }> = [];
  let completed = 0;

  // Process in batches to respect rate limits
  for (let i = 0; i < resumes.length; i += concurrency) {
    const batch = resumes.slice(i, i + concurrency);

    const batchResults = await Promise.all(
      batch.map(async (resume) => {
        // Build resume text from available data
        const resumeText =
          resume.extractedText ||
          [
            resume.summary,
            resume.skills?.length ? `Skills: ${resume.skills.join(", ")}` : "",
            resume.experienceYears ? `Experience: ${resume.experienceYears} years` : "",
          ]
            .filter(Boolean)
            .join("\n\n");

        if (!resumeText.trim()) {
          return {
            resumeId: resume.id,
            result: null,
            error: "No resume text available",
          };
        }

        // Retry logic: up to 2 attempts
        for (let attempt = 1; attempt <= 2; attempt++) {
          try {
            const result = await matchResumeToJob(
              resumeText,
              job.description,
              job.title,
              job.requiredSkills,
              job.optionalSkills,
              job.experienceRequired
            );
            return { resumeId: resume.id, result };
          } catch (err) {
            if (attempt === 2) {
              console.error(`Match failed for resume ${resume.id}:`, err);
              return {
                resumeId: resume.id,
                result: null,
                error: (err as Error).message,
              };
            }
            // Wait 1s before retry
            await new Promise((r) => setTimeout(r, 1000));
          }
        }

        return { resumeId: resume.id, result: null, error: "Max retries exceeded" };
      })
    );

    results.push(...batchResults);
    completed += batch.length;
    onProgress?.(completed, resumes.length);

    // Small delay between batches to avoid rate limits
    if (i + concurrency < resumes.length) {
      await new Promise((r) => setTimeout(r, 500));
    }
  }

  return results;
}
