import path from "path";
import fs from "fs";

/**
 * Extract raw text from a PDF file using pdf2json
 */
export async function extractTextFromPDF(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const PDFParser = require("pdf2json");
      const pdfParser = new PDFParser();

      pdfParser.on("pdfParser_dataError", (errData: any) => {
        console.error("PDF parsing error:", errData.parserError);
        reject(new Error(`Failed to parse PDF: ${errData.parserError}`));
      });

      pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
        try {
          // Extract text from all pages
          const textParts: string[] = [];
          
          if (pdfData.Pages && Array.isArray(pdfData.Pages)) {
            for (const page of pdfData.Pages) {
              if (page.Texts && Array.isArray(page.Texts)) {
                const pageText = page.Texts
                  .map((text: any) => {
                    if (text.R && Array.isArray(text.R)) {
                      return text.R.map((r: any) => 
                        decodeURIComponent(r.T || "")
                      ).join(" ");
                    }
                    return "";
                  })
                  .filter(Boolean)
                  .join(" ");
                textParts.push(pageText);
              }
            }
          }

          const extractedText = textParts.join("\n\n").trim();
          resolve(extractedText);
        } catch (error) {
          reject(new Error(`Failed to extract text from PDF: ${(error as Error).message}`));
        }
      });

      pdfParser.loadPDF(filePath);
    } catch (error) {
      console.error("PDF parser initialization error:", error);
      reject(new Error(`Failed to initialize PDF parser: ${(error as Error).message}`));
    }
  });
}

/**
 * Extract raw text from a DOCX file using mammoth
 */
export async function extractTextFromDOCX(filePath: string): Promise<string> {
  try {
    const mammoth = await import("mammoth");
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value?.trim() || "";
  } catch (error) {
    console.error("DOCX parsing error:", error);
    throw new Error(`Failed to parse DOCX: ${(error as Error).message}`);
  }
}

/**
 * Extract text from a file based on its extension
 */
export async function extractTextFromFile(filePath: string): Promise<string> {
  const ext = path.extname(filePath).toLowerCase();

  if (ext === ".pdf") {
    return extractTextFromPDF(filePath);
  } else if (ext === ".docx") {
    return extractTextFromDOCX(filePath);
  } else {
    throw new Error(`Unsupported file type: ${ext}. Only PDF and DOCX are supported.`);
  }
}

/**
 * Validate file type and size
 */
export function validateFile(
  filename: string,
  sizeBytes: number,
  maxSizeMB = 10
): { valid: boolean; error?: string } {
  const ext = path.extname(filename).toLowerCase();
  const allowedExtensions = [".pdf", ".docx"];

  if (!allowedExtensions.includes(ext)) {
    return {
      valid: false,
      error: `Invalid file type "${ext}". Only PDF and DOCX files are allowed.`,
    };
  }

  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (sizeBytes > maxSizeBytes) {
    return {
      valid: false,
      error: `File size exceeds ${maxSizeMB}MB limit. Your file is ${(sizeBytes / 1024 / 1024).toFixed(1)}MB.`,
    };
  }

  return { valid: true };
}
