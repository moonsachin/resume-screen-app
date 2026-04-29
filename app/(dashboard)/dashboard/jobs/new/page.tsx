import type { Metadata } from "next";
import { JobForm } from "@/components/job/job-form";

export const metadata: Metadata = {
  title: "New Job — ResumeAI",
  description: "Create a new job posting",
};

export default function NewJobPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Create New Job</h1>
        <p className="text-gray-500 mt-1">
          Add a new job posting to start matching candidates
        </p>
      </div>

      <JobForm mode="create" />
    </div>
  );
}
