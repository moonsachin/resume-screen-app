import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  // Use consistent formatting to avoid hydration mismatch
  const d = new Date(date);
  
  // Format: "Apr 28, 2026"
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[d.getMonth()];
  const day = d.getDate();
  const year = d.getFullYear();
  
  return `${month} ${day}, ${year}`;
}

export function formatScore(score: number): string {
  return `${score.toFixed(1)}%`;
}
