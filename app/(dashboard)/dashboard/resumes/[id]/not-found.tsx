import Link from "next/link";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ResumeNotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <FileText className="h-16 w-16 text-gray-300 mb-4" aria-hidden="true" />
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Resume Not Found</h2>
      <p className="text-gray-500 mb-6 max-w-sm">
        The resume you&apos;re looking for doesn&apos;t exist or may have been deleted.
      </p>
      <Link href="/dashboard/resumes">
        <Button>Back to Resumes</Button>
      </Link>
    </div>
  );
}
