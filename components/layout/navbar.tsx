"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  GitMerge,
  LogOut,
  User,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { GlobalSearch } from "@/components/search/global-search";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/resumes", label: "Resumes", icon: FileText },
  { href: "/dashboard/jobs", label: "Jobs", icon: Briefcase },
  { href: "/dashboard/matches", label: "Matches", icon: GitMerge },
];

export function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2 shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
              <FileText className="h-4 w-4 text-white" aria-hidden="true" />
            </div>
            <span className="font-bold text-gray-900 hidden sm:block">ResumeAI</span>
          </Link>

          {/* Global Search */}
          <div className="flex-1 max-w-md hidden lg:block">
            <GlobalSearch />
          </div>

          {/* Nav links */}
          <nav aria-label="Main navigation" className="hidden md:flex items-center gap-1">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  pathname === href
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                )}
                aria-current={pathname === href ? "page" : undefined}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {label}
              </Link>
            ))}
          </nav>

          {/* User menu */}
          <div className="relative shrink-0">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
              aria-expanded={userMenuOpen}
              aria-haspopup="true"
              aria-label="User menu"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100">
                <User className="h-4 w-4 text-indigo-600" aria-hidden="true" />
              </div>
              <span className="hidden sm:block font-medium">
                {session?.user?.name}
              </span>
              {session?.user?.role && (
                <Badge variant="secondary" className="hidden sm:inline-flex text-xs">
                  {session.user.role}
                </Badge>
              )}
              <ChevronDown className="h-4 w-4 text-gray-400" aria-hidden="true" />
            </button>

            {userMenuOpen && (
              <div
                className="absolute right-0 mt-1 w-48 rounded-md border border-gray-200 bg-white py-1 shadow-lg"
                role="menu"
                aria-label="User options"
              >
                <div className="border-b border-gray-100 px-4 py-2">
                  <p className="text-xs text-gray-500">Signed in as</p>
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {session?.user?.email}
                  </p>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                  role="menuitem"
                >
                  <LogOut className="h-4 w-4" aria-hidden="true" />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
