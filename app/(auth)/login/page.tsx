import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Sign In — ResumeAI",
  description: "Sign in to your ResumeAI account",
};

interface LoginPageProps {
  searchParams: Promise<{ registered?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const justRegistered = params.registered === "true";

  return (
    <>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Welcome back</h2>
        <p className="text-sm text-gray-500 mt-1">
          Sign in to your account to continue
        </p>
      </div>

      {justRegistered && (
        <div
          role="status"
          className="mb-5 rounded-md bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700"
        >
          Account created successfully! Please sign in.
        </div>
      )}

      <LoginForm />
    </>
  );
}
