import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Create Account — ResumeAI",
  description: "Create a new ResumeAI account",
};

export default function RegisterPage() {
  return (
    <>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Create account</h2>
        <p className="text-sm text-gray-500 mt-1">
          Get started with ResumeAI today
        </p>
      </div>

      <RegisterForm />
    </>
  );
}
