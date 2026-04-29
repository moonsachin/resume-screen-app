import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Sparkles, 
  Zap, 
  Users, 
  TrendingUp, 
  CheckCircle2,
  ArrowRight,
  FileText,
  GitMerge,
  Mail,
  BarChart3
} from "lucide-react";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">ResumeAI</span>
          </div>
          <div className="flex items-center gap-4">
            {session ? (
              <Link href="/dashboard">
                <Button className="cursor-pointer">Go to Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="cursor-pointer">Login</Button>
                </Link>
                <Link href="/register">
                  <Button className="cursor-pointer">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            AI-Powered Recruitment Platform
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Find the Perfect Candidate with{" "}
            <span className="text-indigo-600">AI Matching</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Upload resumes, create job postings, and let our AI match the best candidates instantly. 
            Save time, reduce bias, and hire smarter.
          </p>
          <div className="flex items-center justify-center gap-4">
            {session ? (
              <Link href="/dashboard">
                <Button size="lg" className="gap-2 cursor-pointer">
                  Go to Dashboard
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/register">
                  <Button size="lg" className="gap-2 cursor-pointer">
                    Start Free Trial
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline" className="cursor-pointer">
                    Login
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything You Need to Hire Better
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Powerful features designed to streamline your recruitment process
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Feature 1 */}
          <Card className="border-2 hover:border-indigo-200 transition-colors cursor-pointer">
            <CardContent className="p-6">
              <div className="h-12 w-12 rounded-lg bg-indigo-100 flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Smart Resume Parsing
              </h3>
              <p className="text-gray-600 text-sm">
                AI extracts skills, experience, and education from resumes automatically
              </p>
            </CardContent>
          </Card>

          {/* Feature 2 */}
          <Card className="border-2 hover:border-indigo-200 transition-colors cursor-pointer">
            <CardContent className="p-6">
              <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center mb-4">
                <GitMerge className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                AI Matching Engine
              </h3>
              <p className="text-gray-600 text-sm">
                Match candidates to jobs with 90%+ accuracy using advanced AI
              </p>
            </CardContent>
          </Card>

          {/* Feature 3 */}
          <Card className="border-2 hover:border-indigo-200 transition-colors cursor-pointer">
            <CardContent className="p-6">
              <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Analytics Dashboard
              </h3>
              <p className="text-gray-600 text-sm">
                Track metrics, visualize data, and make informed hiring decisions
              </p>
            </CardContent>
          </Card>

          {/* Feature 4 */}
          <Card className="border-2 hover:border-indigo-200 transition-colors cursor-pointer">
            <CardContent className="p-6">
              <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
                <Mail className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Email Automation
              </h3>
              <p className="text-gray-600 text-sm">
                Send bulk emails, schedule interviews, and automate communication
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-indigo-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">90%</div>
              <div className="text-indigo-200">Matching Accuracy</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">10x</div>
              <div className="text-indigo-200">Faster Screening</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50%</div>
              <div className="text-indigo-200">Time Saved</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">100+</div>
              <div className="text-indigo-200">Companies Trust Us</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600">
            Get started in 3 simple steps
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-indigo-600">1</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Upload Resumes
            </h3>
            <p className="text-gray-600">
              Bulk upload resumes in PDF or DOCX format. AI parses them automatically.
            </p>
          </div>

          <div className="text-center">
            <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-indigo-600">2</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Create Jobs
            </h3>
            <p className="text-gray-600">
              Add job descriptions with required skills and experience levels.
            </p>
          </div>

          <div className="text-center">
            <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-indigo-600">3</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Get Matches
            </h3>
            <p className="text-gray-600">
              AI ranks candidates by fit score. Review top matches and hire faster.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
              Why Choose ResumeAI?
            </h2>
            <div className="space-y-4">
              {[
                "Save 10+ hours per week on resume screening",
                "Reduce hiring bias with objective AI scoring",
                "Find hidden gems with skill-based matching",
                "Track candidates through hiring pipeline",
                "Send automated emails to candidates",
                "Export data and generate reports",
              ].map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green-600 shrink-0 mt-0.5" />
                  <span className="text-lg text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-12 text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Hiring?
          </h2>
          <p className="text-xl mb-8 text-indigo-100">
            Join hundreds of companies using AI to hire better, faster.
          </p>
          {session ? (
            <Link href="/dashboard">
              <Button size="lg" variant="secondary" className="gap-2 cursor-pointer">
                Go to Dashboard
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          ) : (
            <Link href="/register">
              <Button size="lg" variant="secondary" className="gap-2 cursor-pointer">
                Start Free Trial
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded bg-indigo-600 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="font-semibold text-gray-900">ResumeAI</span>
            </div>
            <p className="text-sm text-gray-600">
              © 2026 ResumeAI. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <Link href="/login" className="hover:text-indigo-600 cursor-pointer">Login</Link>
              <Link href="/register" className="hover:text-indigo-600 cursor-pointer">Sign Up</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
