"use client";

import { useState, useRef, DragEvent } from "react";
import { Upload, FileText, X, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ResumeUploadProps {
  onUploadSuccess?: () => void;
}

interface FileWithStatus {
  file: File;
  status: "pending" | "uploading" | "success" | "error";
  progress: number;
  error?: string;
}

export function ResumeUpload({ onUploadSuccess }: ResumeUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileWithStatus[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    handleFilesSelect(files);
  };

  const handleFilesSelect = (files: File[]) => {
    const maxSizeMB = Number(process.env.NEXT_PUBLIC_MAX_FILE_SIZE_MB) || 10;
    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    const validFiles: FileWithStatus[] = [];
    
    for (const file of files) {
      const ext = file.name.split(".").pop()?.toLowerCase();
      
      if (!ext || !["pdf", "docx"].includes(ext)) {
        toast.error(`${file.name}: Invalid file type. Only PDF and DOCX allowed.`);
        continue;
      }

      if (file.size > maxSizeBytes) {
        toast.error(
          `${file.name}: File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Max ${maxSizeMB}MB.`
        );
        continue;
      }

      validFiles.push({
        file,
        status: "pending",
        progress: 0,
      });
    }

    if (validFiles.length > 0) {
      setSelectedFiles((prev) => [...prev, ...validFiles]);
      toast.success(`${validFiles.length} file(s) added`);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFilesSelect(Array.from(files));
    }
  };

  const uploadFile = async (fileWithStatus: FileWithStatus, index: number): Promise<boolean> => {
    const formData = new FormData();
    formData.append("file", fileWithStatus.file);

    const maxRetries = 2;
    let attempt = 0;

    while (attempt <= maxRetries) {
      try {
        // Update status to uploading
        setSelectedFiles((prev) =>
          prev.map((f, i) =>
            i === index ? { ...f, status: "uploading" as const, progress: 0 } : f
          )
        );

        // Simulate progress
        const progressInterval = setInterval(() => {
          setSelectedFiles((prev) =>
            prev.map((f, i) =>
              i === index && f.progress < 90
                ? { ...f, progress: f.progress + 10 }
                : f
            )
          );
        }, 200);

        const response = await fetch("/api/resumes/upload", {
          method: "POST",
          body: formData,
        });

        clearInterval(progressInterval);

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Upload failed");
        }

        // Update to success
        setSelectedFiles((prev) =>
          prev.map((f, i) =>
            i === index
              ? { ...f, status: "success" as const, progress: 100 }
              : f
          )
        );

        return true;
      } catch (error) {
        attempt++;
        
        if (attempt > maxRetries) {
          // Final failure after retries
          setSelectedFiles((prev) =>
            prev.map((f, i) =>
              i === index
                ? {
                    ...f,
                    status: "error" as const,
                    progress: 0,
                    error: (error as Error).message,
                  }
                : f
            )
          );
          return false;
        }
        
        // Wait before retry
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
      }
    }

    return false;
  };

  const handleBulkUpload = async () => {
    if (selectedFiles.length === 0) return;

    setIsUploading(true);

    let successCount = 0;
    let errorCount = 0;

    // Upload files sequentially to avoid overwhelming the server
    for (let i = 0; i < selectedFiles.length; i++) {
      if (selectedFiles[i].status === "pending") {
        const success = await uploadFile(selectedFiles[i], i);
        if (success) {
          successCount++;
        } else {
          errorCount++;
        }
        // Small delay between uploads
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }

    setIsUploading(false);

    if (successCount > 0) {
      toast.success(`${successCount} resume(s) uploaded successfully!`);
      onUploadSuccess?.();
    }

    if (errorCount > 0) {
      toast.error(`${errorCount} resume(s) failed to upload`);
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClearAll = () => {
    setSelectedFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const pendingCount = selectedFiles.filter((f) => f.status === "pending").length;
  const successCount = selectedFiles.filter((f) => f.status === "success").length;
  const errorCount = selectedFiles.filter((f) => f.status === "error").length;

  return (
    <Card>
      <CardContent className="p-6">
        {selectedFiles.length === 0 ? (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",
              isDragging
                ? "border-indigo-500 bg-indigo-50"
                : "border-gray-300 hover:border-indigo-400 hover:bg-gray-50"
            )}
            onClick={() => fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
            aria-label="Upload resumes"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                fileInputRef.current?.click();
              }
            }}
          >
            <Upload
              className="mx-auto h-12 w-12 text-gray-400 mb-4"
              aria-hidden="true"
            />
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              Upload Resumes
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Drag and drop files here, or click to browse
            </p>
            <p className="text-xs text-gray-400">
              Supports PDF and DOCX files up to 10MB · Multiple files supported
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx"
              multiple
              onChange={handleFileInputChange}
              className="hidden"
              aria-label="File input"
            />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Summary */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-4 text-sm">
                <span className="text-gray-600">
                  <strong>{selectedFiles.length}</strong> file(s)
                </span>
                {successCount > 0 && (
                  <span className="text-green-600">
                    ✓ {successCount} uploaded
                  </span>
                )}
                {errorCount > 0 && (
                  <span className="text-red-600">✗ {errorCount} failed</span>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearAll}
                disabled={isUploading}
              >
                Clear All
              </Button>
            </div>

            {/* File List */}
            <div className="max-h-96 overflow-y-auto space-y-2">
              {selectedFiles.map((fileWithStatus, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <FileText
                    className="h-6 w-6 text-indigo-600 shrink-0"
                    aria-hidden="true"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {fileWithStatus.file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(fileWithStatus.file.size / 1024).toFixed(1)} KB
                    </p>
                    {fileWithStatus.status === "uploading" && (
                      <div className="mt-1">
                        <div className="w-full bg-gray-200 rounded-full h-1">
                          <div
                            className="bg-indigo-600 h-full transition-all duration-300"
                            style={{ width: `${fileWithStatus.progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                    {fileWithStatus.error && (
                      <p className="text-xs text-red-600 mt-1">
                        {fileWithStatus.error}
                      </p>
                    )}
                  </div>
                  {fileWithStatus.status === "success" && (
                    <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
                  )}
                  {fileWithStatus.status === "error" && (
                    <button
                      onClick={() => uploadFile(fileWithStatus, index)}
                      className="text-red-600 hover:text-red-700 transition-colors shrink-0 cursor-pointer"
                      aria-label="Retry upload"
                      title="Retry upload"
                    >
                      <XCircle className="h-5 w-5" />
                    </button>
                  )}
                  {fileWithStatus.status === "uploading" && (
                    <Loader2 className="h-5 w-5 text-indigo-600 animate-spin shrink-0" />
                  )}
                  {fileWithStatus.status === "pending" && !isUploading && (
                    <button
                      onClick={() => handleRemoveFile(index)}
                      className="text-gray-400 hover:text-red-600 transition-colors shrink-0 cursor-pointer"
                      aria-label="Remove file"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                onClick={handleBulkUpload}
                disabled={isUploading || pendingCount === 0}
                className="flex-1"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Uploading {successCount + 1}/{selectedFiles.length}...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    Upload {pendingCount} Resume(s)
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                Add More
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx"
                multiple
                onChange={handleFileInputChange}
                className="hidden"
                aria-label="File input"
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
