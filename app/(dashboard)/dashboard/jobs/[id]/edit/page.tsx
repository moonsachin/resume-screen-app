import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { JobForm } from "@/components/job/job-form";

interface EditJobPageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "Edit Job — ResumeAI",
  description: "Edit job posting",
};

async function getJob(id: string) {
  return prisma.job.findUnique({
    where: { id },
  });
}

export default async function EditJobPage({ params }: EditJobPageProps) {
  const { id } = await params;
  const job = await getJob(id);

  if (!job) {
    notFound();
  }

  const initialData = {
    id: job.id,
    title: job.title,
    company: job.company,
    location: job.location || undefined,
    employmentType: job.employmentType,
    experienceRequired: job.experienceRequired ?? undefined,
    requiredSkills: Array.isArray(job.requiredSkills)
      ? (job.requiredSkills as string[])
      : [],
    optionalSkills: Array.isArray(job.optionalSkills)
      ? (job.optionalSkills as string[])
      : [],
    salaryRange: job.salaryRange || undefined,
    description: job.description,
    status: job.status,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Job</h1>
        <p className="text-gray-500 mt-1">Update job posting details</p>
      </div>

      <JobForm mode="edit" initialData={initialData} />
    </div>
  );
}
