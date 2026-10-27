'use client';

import Link from "next/link";
import { useAuth, SignInButton, SignUpButton } from "@clerk/nextjs";

export default function HomeAuthButtons() {
  const { isSignedIn, isLoaded } = useAuth();

  // Show a lightweight skeleton while Clerk loads to prevent hydration layout shifts
  if (!isLoaded) {
    return (
      <div className="flex flex-col sm:flex-row gap-4 mt-2">
        <div className="h-12 w-36 animate-pulse rounded-lg bg-indigo-600/50" />
      </div>
    );
  }

  if (isSignedIn) {
    return (
      <div className="flex flex-col sm:flex-row gap-4 mt-2">
        <Link
          href="/lessons/headings-and-text"
          className="flex h-12 items-center justify-center rounded-lg bg-indigo-600 px-6 font-semibold text-white hover:bg-indigo-500 transition-colors"
        >
          Start Learning
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 mt-2">
      <SignUpButton mode="modal">
        <button className="flex h-12 items-center justify-center rounded-lg bg-indigo-600 px-6 font-semibold text-white hover:bg-indigo-500 transition-colors">
          Start Learning
        </button>
      </SignUpButton>

      <SignInButton mode="modal">
        <button className="flex h-12 items-center justify-center rounded-lg border border-slate-700 bg-slate-900/50 px-6 font-semibold text-slate-300 hover:border-slate-600 hover:bg-slate-800 transition-colors">
          Sign In
        </button>
      </SignInButton>
    </div>
  );
}