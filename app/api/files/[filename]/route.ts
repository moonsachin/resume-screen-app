import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

const UPLOAD_DIR = process.env.UPLOAD_DIR || "/tmp/uploads";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    
    // Security: Prevent directory traversal
    if (filename.includes("..") || filename.includes("/")) {
      return NextResponse.json(
        { error: "Invalid filename" },
        { status: 400 }
      );
    }

    const filePath = path.join(UPLOAD_DIR, filename);

    // Check if file exists
    if (!existsSync(filePath)) {
      return NextResponse.json(
        { error: "File not found" },
        { status: 404 }
      );
    }

    // Read file
    const fileBuffer = await readFile(filePath);
    
    // Determine content type based on extension
    const ext = path.extname(filename).toLowerCase();
    const contentType = ext === ".pdf" ? "application/pdf" : "application/octet-stream";

    // Return file
    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `inline; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("File serve error:", error);
    return NextResponse.json(
      { error: "Failed to serve file" },
      { status: 500 }
    );
  }
}
