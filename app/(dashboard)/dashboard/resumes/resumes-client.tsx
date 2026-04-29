"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ResumeUpload } from "@/components/resume/resume-upload";
import { ResumeTable } from "@/components/resume/resume-table";

interface Resume {
  id: string;
  candidateName: string;
  email: string;
  phone: string | null;
  fileUrl: string;
  fileSize: number | null;
  fileType: string | null;
  skills: string[] | null;
  experienceYears: number | null;
  summary: string | null;
  createdAt: Date;
  _count: { matches: number };
}

interface ResumesClientProps {
  initialResumes: Resume[];
}

export function ResumesClient({ initialResumes }: ResumesClientProps) {
  const router = useRouter();
  const [resumes, setResumes] = useState(initialResumes);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Update state when initialResumes changes (after router.refresh())
  useEffect(() => {
    setResumes(initialResumes);
  }, [initialResumes]);

  const handleUploadSuccess = async () => {
    setIsRefreshing(true);
    
    // Fetch fresh data from API
    try {
      const response = await fetch('/api/resumes');
      if (response.ok) {
        const data = await response.json();
        setResumes(data.resumes || []);
      }
    } catch (error) {
      console.error('Failed to refresh resumes:', error);
    } finally {
      setIsRefreshing(false);
    }
    
    // Also trigger server-side refresh
    router.refresh();
  };

  const handleDelete = async () => {
    // Fetch fresh data after delete
    try {
      const response = await fetch('/api/resumes');
      if (response.ok) {
        const data = await response.json();
        setResumes(data.resumes || []);
      }
    } catch (error) {
      console.error('Failed to refresh resumes:', error);
    }
    
    router.refresh();
  };

  return (
    <>
      <ResumeUpload onUploadSuccess={handleUploadSuccess} />
      <ResumeTable
        initialResumes={resumes}
        onDelete={handleDelete}
      />
    </>
  );
}
