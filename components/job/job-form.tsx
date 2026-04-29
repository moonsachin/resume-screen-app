"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { jobSchema, type JobFormData } from "@/lib/validations/job";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus, X } from "lucide-react";
import { toast } from "sonner";

interface JobFormProps {
  initialData?: Partial<JobFormData> & { id?: string };
  mode: "create" | "edit";
}

export function JobForm({ initialData, mode }: JobFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requiredSkillInput, setRequiredSkillInput] = useState("");
  const [optionalSkillInput, setOptionalSkillInput] = useState("");

  const form = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: initialData?.title || "",
      company: initialData?.company || "",
      location: initialData?.location || "",
      employmentType: initialData?.employmentType || "FULL_TIME",
      experienceRequired: initialData?.experienceRequired ?? undefined,
      requiredSkills: initialData?.requiredSkills || [],
      optionalSkills: initialData?.optionalSkills || [],
      salaryRange: initialData?.salaryRange || "",
      description: initialData?.description || "",
      status: initialData?.status || "DRAFT",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = form;

  const requiredSkills = watch("requiredSkills");
  const optionalSkills = watch("optionalSkills");

  const addRequiredSkill = () => {
    const skill = requiredSkillInput.trim();
    if (skill && !requiredSkills.includes(skill)) {
      setValue("requiredSkills", [...requiredSkills, skill]);
      setRequiredSkillInput("");
    }
  };

  const removeRequiredSkill = (skill: string) => {
    setValue(
      "requiredSkills",
      requiredSkills.filter((s) => s !== skill)
    );
  };

  const addOptionalSkill = () => {
    const skill = optionalSkillInput.trim();
    if (skill && !optionalSkills.includes(skill)) {
      setValue("optionalSkills", [...optionalSkills, skill]);
      setOptionalSkillInput("");
    }
  };

  const removeOptionalSkill = (skill: string) => {
    setValue(
      "optionalSkills",
      optionalSkills.filter((s) => s !== skill)
    );
  };

  const onSubmit = async (data: JobFormData) => {
    setIsSubmitting(true);
    try {
      const url =
        mode === "create"
          ? "/api/jobs"
          : `/api/jobs/${initialData?.id}`;
      const method = mode === "create" ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to save job");
      }

      toast.success(
        mode === "create" ? "Job created successfully" : "Job updated successfully"
      );
      router.push("/dashboard/jobs");
      router.refresh();
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Job Title *</Label>
            <Input
              id="title"
              {...register("title")}
              placeholder="e.g. Senior Software Engineer"
            />
            {errors.title && (
              <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="company">Company *</Label>
            <Input
              id="company"
              {...register("company")}
              placeholder="e.g. Acme Corp"
            />
            {errors.company && (
              <p className="text-sm text-red-600 mt-1">{errors.company.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                {...register("location")}
                placeholder="e.g. San Francisco, CA"
              />
              {errors.location && (
                <p className="text-sm text-red-600 mt-1">{errors.location.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="employmentType">Employment Type *</Label>
              <select
                id="employmentType"
                {...register("employmentType")}
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="FULL_TIME">Full-time</option>
                <option value="PART_TIME">Part-time</option>
                <option value="CONTRACT">Contract</option>
                <option value="REMOTE">Remote</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="experienceRequired">Experience Required (years)</Label>
              <Input
                id="experienceRequired"
                type="number"
                step="0.5"
                {...register("experienceRequired", {
                  setValueAs: (v) => (v === "" ? null : parseFloat(v)),
                })}
                placeholder="e.g. 3"
              />
              {errors.experienceRequired && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.experienceRequired.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="salaryRange">Salary Range</Label>
              <Input
                id="salaryRange"
                {...register("salaryRange")}
                placeholder="e.g. $100k - $150k"
              />
              {errors.salaryRange && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.salaryRange.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="status">Status *</Label>
            <select
              id="status"
              {...register("status")}
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="DRAFT">Draft</option>
              <option value="OPEN">Open</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Skills</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="requiredSkills">Required Skills</Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="requiredSkills"
                value={requiredSkillInput}
                onChange={(e) => setRequiredSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addRequiredSkill();
                  }
                }}
                placeholder="Type a skill and press Enter"
              />
              <Button
                type="button"
                onClick={addRequiredSkill}
                variant="outline"
                size="icon"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {requiredSkills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-sm"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeRequiredSkill(skill)}
                    className="hover:text-emerald-900 cursor-pointer"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="optionalSkills">Optional Skills</Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="optionalSkills"
                value={optionalSkillInput}
                onChange={(e) => setOptionalSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addOptionalSkill();
                  }
                }}
                placeholder="Type a skill and press Enter"
              />
              <Button
                type="button"
                onClick={addOptionalSkill}
                variant="outline"
                size="icon"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {optionalSkills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-sm"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeOptionalSkill(skill)}
                    className="hover:text-gray-900 cursor-pointer"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Job Description</CardTitle>
        </CardHeader>
        <CardContent>
          <Label htmlFor="description">Description *</Label>
          <textarea
            id="description"
            {...register("description")}
            rows={10}
            className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 mt-1"
            placeholder="Describe the role, responsibilities, and requirements..."
          />
          {errors.description && (
            <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-3 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {mode === "create" ? "Create Job" : "Update Job"}
        </Button>
      </div>
    </form>
  );
}
