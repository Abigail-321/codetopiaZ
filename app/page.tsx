import Link from "next/link";
import { SignInButton, SignUpButton, SignedIn, SignedOut } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0b0e14] px-6 text-slate-200">
      <main className="flex max-w-2xl flex-col items-center text-center gap-8">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl text-white">
          Welcome to <span className="text-indigo-500">CodeTopiaZ</span>
        </h1>
        <p className="text-lg text-slate-400 max-w-lg">
          Master web development, programming, and digital literacy with hands-on code challenges and interactive lessons.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-2">
          {/* If the user is already logged in, jump straight into the first lesson */}
          <SignedIn>
            <Link
              href="/lessons/headings-and-text"
              className="flex h-12 items-center justify-center rounded-lg bg-indigo-600 px-6 font-semibold text-white hover:bg-indigo-500 transition-colors"
            >
              Start Learning
            </Link>
          </SignedIn>

          {/* If signed out, trigger Clerk sign-up / sign-in popups */}
          <SignedOut>
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
          </SignedOut>
        </div>
      </main>
    </div>
  );
}