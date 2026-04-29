import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { extractTextFromFile, validateFile } from "@/lib/parser";
import {
  extractCandidateDataWithGroq,
  extractBasicInfoFallback,
} from "@/lib/groq";

const MAX_FILE_SIZE_MB = Number(process.env.MAX_FILE_SIZE_MB) || 10;
// Use /tmp directory for serverless environments (Vercel/Netlify)
const UPLOAD_DIR = process.env.UPLOAD_DIR || "/tmp/uploads";
const isProduction = process.env.NODE_ENV === "production";

export async function POST(request: NextRequest) {
  try {
    // Auth check
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized. Please login to upload resumes." },
        { status: 401 }
      );
    }

    // Parse multipart form data
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided. Please select a file to upload." },
        { status: 400 }
      );
    }

    // Validate file
    const validation = validateFile(file.name, file.size, MAX_FILE_SIZE_MB);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // Ensure upload directory exists
    if (!existsSync(UPLOAD_DIR)) {
      try {
        await mkdir(UPLOAD_DIR, { recursive: true });
      } catch (mkdirError) {
        console.error("Failed to create upload directory:", mkdirError);
        return NextResponse.json(
          { error: "Server configuration error. Please contact support." },
          { status: 500 }
        );
      }
    }

    // Generate unique filename
    const ext = path.extname(file.name).toLowerCase();
    const timestamp = Date.now();
    const safeName = file.name
      .replace(ext, "")
      .replace(/[^a-zA-Z0-9]/g, "-")
      .slice(0, 40);
    const filename = `${timestamp}-${safeName}${ext}`;
    const filePath = path.join(UPLOAD_DIR, filename);
    
    // For production (serverless), store in /tmp and use external storage URL
    // For development, use local public/uploads
    const fileUrl = isProduction 
      ? `/api/files/${filename}` // Temporary - will be replaced with cloud storage
      : `/uploads/${filename}`;

    // Save file to disk
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Extract text from file
    let extractedText = "";
    try {
      extractedText = await extractTextFromFile(filePath);
    } catch (parseError) {
      console.error("Text extraction failed:", parseError);
      // Continue with empty text — don't fail the upload
    }

    // Extract structured data using Groq AI
    let candidateData;
    if (extractedText) {
      try {
        candidateData = await extractCandidateDataWithGroq(extractedText);
      } catch (groqError) {
        console.error("Groq extraction failed, using fallback:", groqError);
        candidateData = extractBasicInfoFallback(extractedText);
      }
    } else {
      candidateData = {
        candidateName: "",
        email: "",
        phone: "",
        skills: [],
        experienceYears: 0,
        education: [],
        projects: [],
        summary: "",
      };
    }

    // Save to database
    const resume = await prisma.resume.create({
      data: {
        candidateName: candidateData.candidateName || "Unknown Candidate",
        email: candidateData.email || "",
        phone: candidateData.phone || "",
        fileUrl,
        fileSize: file.size,
        fileType: ext.replace(".", ""),
        extractedText: extractedText || null,
        skills: candidateData.skills || [],
        experienceYears: candidateData.experienceYears || 0,
        education: candidateData.education || [],
        projects: candidateData.projects || [],
        summary: candidateData.summary || "",
      },
    });

    return NextResponse.json(
      {
        message: "Resume uploaded and parsed successfully",
        resume: {
          id: resume.id,
          candidateName: resume.candidateName,
          email: resume.email,
          fileUrl: resume.fileUrl,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to process resume. Please try again." },
      { status: 500 }
    );
  }
}
