import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { ArrowRight, Code2, Sparkles, Terminal, Trophy, Bot, Star } from "lucide-react";

export default async function Home() {
  const { userId } = await auth();

  return (
    <div className="min-h-screen bg-[#0b0e14] text-slate-100 flex flex-col justify-between relative overflow-hidden">
      {/* Background Glow Effect */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[380px] bg-indigo-600/15 blur-[140px] rounded-full pointer-events-none" />

      {/* Whimsical Floating Background Elements (Sticker / Y2K Vibe) */}
      <div className="absolute top-28 left-[10%] hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-mono -rotate-6 animate-pulse pointer-events-none shadow-lg">
        <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
        <span>&lt;/code-utopia&gt;</span>
      </div>

      <div className="absolute top-44 right-[12%] hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-mono rotate-6 pointer-events-none shadow-lg">
        <Bot className="w-4 h-4 text-indigo-400" />
        <span>Byte says hi! 👾</span>
      </div>

      <div className="absolute bottom-32 left-[15%] hidden lg:block text-indigo-500/20 font-mono text-2xl font-bold select-none pointer-events-none -rotate-12">
        {userId ? "console.log('Welcome Back!')" : "const learn = true;"}
      </div>

      {/* Top Nav */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex justify-between items-center z-10">
        <div className="flex items-center gap-2.5 font-bold text-lg tracking-tight group cursor-pointer">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-mono shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition-transform">
            Z
          </div>
          <span className="tracking-wide">CodeTopia<span className="text-indigo-400">Z</span></span>
        </div>
        <div className="flex items-center gap-4">
          {userId ? (
            <Link
              href="/lessons/headings-and-paragraphs"
              className="text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl transition-all shadow-lg shadow-indigo-600/20 hover:scale-105"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <SignInButton mode="modal">
                <button className="text-sm font-medium text-slate-300 hover:text-white transition-colors cursor-pointer">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl transition-all shadow-lg shadow-indigo-600/20 hover:scale-105 cursor-pointer">
                  Get Started
                </button>
              </SignUpButton>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="w-full max-w-5xl mx-auto px-6 py-12 sm:py-16 text-center z-10 flex flex-col items-center">
        {/* Badge Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-6 shadow-inner">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-spin" style={{ animationDuration: '4s' }} />
          <span>Your Gamified Web Development Playground</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-3xl leading-[1.1] mb-6 text-white">
          Master code through <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">doing, not just reading.</span>
        </h1>

        <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mb-10 leading-relaxed">
          Master web development, programming, and digital literacy with hands-on code challenges and interactive lessons.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center mb-20">
          {userId ? (
            <Link
              href="/lessons/headings-and-paragraphs"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-8 py-4 rounded-2xl transition-all shadow-xl shadow-indigo-600/25 group hover:scale-105"
            >
              <span>Continue Learning</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </Link>
          ) : (
            <>
              <SignUpButton mode="modal">
                <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-8 py-4 rounded-2xl transition-all shadow-xl shadow-indigo-600/25 group cursor-pointer hover:scale-105">
                  <span>Start Learning Now</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </button>
              </SignUpButton>

              <SignInButton mode="modal">
                <button className="w-full sm:w-auto flex items-center justify-center bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white font-medium px-8 py-4 rounded-2xl border border-slate-800 transition-all cursor-pointer hover:scale-105">
                  Sign In to Account
                </button>
              </SignInButton>
            </>
          )}
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-sm hover:border-indigo-500/40 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-110 transition-transform">
              <Code2 className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-200 mb-2">Interactive Challenges</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Write live HTML, CSS, and JavaScript directly in your browser with immediate feedback.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-sm hover:border-purple-500/40 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4 group-hover:scale-110 transition-transform">
              <Terminal className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-200 mb-2">Automated Validation</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Custom validation rules test your code structure and logic automatically upon submission.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-sm hover:border-pink-500/40 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 mb-4 group-hover:scale-110 transition-transform">
              <Trophy className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-200 mb-2">Structured Curriculum</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Progress seamlessly from core HTML layouts to advanced DOM manipulation and JavaScript logic.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-8 border-t border-slate-900/80 text-center text-sm text-slate-500 z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>© {new Date().getFullYear()} CodeTopiaZ. Built with passion for creators.</p>
        <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>All systems operational</span>
        </div>
      </footer>
    </div>
  );
}