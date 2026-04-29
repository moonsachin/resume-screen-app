import { z } from "zod";

export const jobSchema = z.object({
  title: z
    .string()
    .min(1, "Job title is required")
    .min(3, "Job title must be at least 3 characters")
    .max(100, "Job title must be less than 100 characters"),
  company: z
    .string()
    .min(1, "Company name is required")
    .max(100, "Company name must be less than 100 characters"),
  location: z.string().max(100, "Location must be less than 100 characters").optional(),
  employmentType: z.enum(["FULL_TIME", "PART_TIME", "CONTRACT", "REMOTE"]),
  experienceRequired: z
    .number()
    .min(0, "Experience cannot be negative")
    .max(50, "Experience must be less than 50 years")
    .optional()
    .nullable(),
  requiredSkills: z.array(z.string()),
  optionalSkills: z.array(z.string()),
  salaryRange: z.string().max(50, "Salary range must be less than 50 characters").optional(),
  description: z
    .string()
    .min(1, "Job description is required")
    .min(50, "Job description must be at least 50 characters")
    .max(5000, "Job description must be less than 5000 characters"),
  status: z.enum(["DRAFT", "OPEN", "CLOSED"]),
});

export type JobFormData = z.infer<typeof jobSchema>;
