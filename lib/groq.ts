import Groq from "groq-sdk";

// Lazy-initialize Groq client
let groqClient: Groq | null = null;

function getGroqClient(): Groq {
  if (!groqClient) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error("GROQ_API_KEY environment variable is not set");
    }
    groqClient = new Groq({ apiKey });
  }
  return groqClient;
}

export interface ParsedCandidateData {
  candidateName: string;
  email: string;
  phone: string;
  skills: string[];
  experienceYears: number;
  education: Array<{
    degree: string;
    institution: string;
    year?: string;
  }>;
  projects: Array<{
    name: string;
    description: string;
    technologies?: string[];
  }>;
  summary: string;
}

const EXTRACTION_PROMPT = `Extract candidate details from this resume and return valid JSON only. Do not include any explanation, markdown, or code blocks — just raw JSON.

Return this exact structure:
{
  "candidateName": "",
  "email": "",
  "phone": "",
  "skills": [],
  "experienceYears": 0,
  "education": [
    {
      "degree": "",
      "institution": "",
      "year": ""
    }
  ],
  "projects": [
    {
      "name": "",
      "description": "",
      "technologies": []
    }
  ],
  "summary": ""
}

Rules:
- If a value is missing, use empty string "" or empty array []
- experienceYears should be a number (e.g. 3 or 3.5)
- skills should be an array of strings
- Return ONLY valid JSON, nothing else

Resume text:
`;

/**
 * Use Groq API to extract structured candidate data from resume text
 */
export async function extractCandidateDataWithGroq(
  resumeText: string
): Promise<ParsedCandidateData> {
  const client = getGroqClient();

  // Truncate text to avoid token limits (keep first 8000 chars)
  const truncatedText = resumeText.slice(0, 8000);

  const completion = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "user",
        content: EXTRACTION_PROMPT + truncatedText,
      },
    ],
    temperature: 0.1,
    max_tokens: 2048,
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) {
    throw new Error("Groq returned empty response");
  }

  return parseGroqResponse(content);
}

/**
 * Parse and validate the JSON response from Groq
 */
function parseGroqResponse(content: string): ParsedCandidateData {
  // Strip markdown code blocks if present
  let cleaned = content.trim();
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.slice(7);
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.slice(3);
  }
  if (cleaned.endsWith("```")) {
    cleaned = cleaned.slice(0, -3);
  }
  cleaned = cleaned.trim();

  // Find JSON object boundaries
  const jsonStart = cleaned.indexOf("{");
  const jsonEnd = cleaned.lastIndexOf("}");
  if (jsonStart !== -1 && jsonEnd !== -1) {
    cleaned = cleaned.slice(jsonStart, jsonEnd + 1);
  }

  let parsed: Partial<ParsedCandidateData>;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    console.error("Failed to parse Groq JSON response:", cleaned);
    throw new Error("Failed to parse AI response as JSON");
  }

  // Normalize and validate the response
  return {
    candidateName: String(parsed.candidateName || ""),
    email: String(parsed.email || ""),
    phone: String(parsed.phone || ""),
    skills: Array.isArray(parsed.skills)
      ? parsed.skills.map(String).filter(Boolean)
      : [],
    experienceYears: Number(parsed.experienceYears) || 0,
    education: Array.isArray(parsed.education)
      ? parsed.education.map((edu) => ({
          degree: String((edu as { degree?: string }).degree || ""),
          institution: String((edu as { institution?: string }).institution || ""),
          year: String((edu as { year?: string }).year || ""),
        }))
      : [],
    projects: Array.isArray(parsed.projects)
      ? parsed.projects.map((proj) => ({
          name: String((proj as { name?: string }).name || ""),
          description: String((proj as { description?: string }).description || ""),
          technologies: Array.isArray((proj as { technologies?: unknown[] }).technologies)
            ? (proj as { technologies: unknown[] }).technologies.map(String)
            : [],
        }))
      : [],
    summary: String(parsed.summary || ""),
  };
}

/**
 * Fallback: extract basic info from text using regex when Groq fails
 */
export function extractBasicInfoFallback(text: string): Partial<ParsedCandidateData> {
  const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w{2,}/);
  const phoneMatch = text.match(/(\+?\d[\d\s\-().]{8,}\d)/);

  return {
    candidateName: "",
    email: emailMatch?.[0] || "",
    phone: phoneMatch?.[0]?.trim() || "",
    skills: [],
    experienceYears: 0,
    education: [],
    projects: [],
    summary: "",
  };
}
