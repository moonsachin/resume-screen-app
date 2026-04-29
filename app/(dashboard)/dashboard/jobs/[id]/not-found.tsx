import { Briefcase } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function JobNotFound() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-md w-full">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <Briefcase className="h-12 w-12 text-gray-300 mb-4" aria-hidden="true" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Job Not Found</h2>
          <p className="text-sm text-gray-500 mb-6">
            The job you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/dashboard/jobs">
            <Button>Back to Jobs</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
