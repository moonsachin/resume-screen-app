"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ExportButtonProps {
  jobId?: string;
  scoreMin?: number;
  scoreMax?: number;
  recommendation?: string;
  limit?: number;
  label?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
}

export function ExportButton({
  jobId,
  scoreMin,
  scoreMax,
  recommendation,
  limit,
  label = "Export CSV",
  variant = "outline",
  size = "default",
}: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const params = new URLSearchParams();
      if (jobId) params.set("jobId", jobId);
      if (scoreMin !== undefined) params.set("scoreMin", String(scoreMin));
      if (scoreMax !== undefined) params.set("scoreMax", String(scoreMax));
      if (recommendation) params.set("recommendation", recommendation);
      if (limit) params.set("limit", String(limit));

      const response = await fetch(`/api/export/candidates?${params.toString()}`);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Export failed");
      }

      // Get filename from Content-Disposition header
      const contentDisposition = response.headers.get("Content-Disposition");
      const filenameMatch = contentDisposition?.match(/filename="(.+)"/);
      const filename = filenameMatch?.[1] || "candidates.csv";

      // Download file
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success("CSV exported successfully");
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      onClick={handleExport}
      disabled={isExporting}
      variant={variant}
      size={size}
      className="gap-2"
    >
      {isExporting ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Exporting...
        </>
      ) : (
        <>
          <Download className="h-4 w-4" />
          {label}
        </>
      )}
    </Button>
  );
}
