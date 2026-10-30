import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { 
  ArrowRight, 
  Code2, 
  Sparkles, 
  Terminal, 
  Trophy, 
  Bot, 
  CheckCircle2, 
  Zap, 
  Flame, 
  Layers 
} from "lucide-react";

export default async function Home() {
  const { userId } = await auth();

  return (
    <div className="min-h-screen bg-[#0b0e14] text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans selection:bg-indigo-500 selection:text-white">
      {/* Background Glow Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[450px] bg-gradient-to-tr from-indigo-600/20 via-purple-600/20 to-pink-500/10 blur-[150px] rounded-full pointer-events-none" />

      {/* Floating Sticker Badges */}
      <div className="absolute top-32 left-[8%] hidden xl:flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-slate-900/90 border border-purple-500/40 text-purple-300 text-xs font-mono -rotate-6 shadow-xl hover:scale-110 transition-transform cursor-pointer">
        <span className="text-pink-400">⚡</span>
        <span>&lt;HTML5 /&gt;</span>
      </div>

      <div className="absolute top-52 right-[8%] hidden xl:flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-slate-900/90 border border-indigo-500/40 text-indigo-300 text-xs font-mono rotate-6 shadow-xl hover:scale-110 transition-transform cursor-pointer">
        <Zap className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
        <span>const byte = new Mentor();</span>
      </div>

      <div className="absolute bottom-40 left-[5%] hidden xl:flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-slate-900/90 border border-emerald-500/40 text-emerald-300 text-xs font-mono rotate-3 shadow-xl hover:scale-110 transition-transform cursor-pointer">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
        <span>Tests: 4/4 Passed</span>
      </div>

      {/* Top Nav */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex justify-between items-center z-10">
        <div className="flex items-center gap-2.5 font-bold text-lg tracking-tight group cursor-pointer">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white font-mono shadow-lg shadow-indigo-600/30 group-hover:rotate-6 transition-transform">
            Z
          </div>
          <span className="tracking-wide">CodeTopia<span className="text-indigo-400">Z</span></span>
        </div>

        <div className="flex items-center gap-4">
          {userId ? (
            <Link
              href="/lessons/headings-and-paragraphs"
              className="text-sm font-medium bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-600/25 hover:scale-105"
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
                <button className="text-sm font-medium bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-600/25 hover:scale-105 cursor-pointer">
                  Get Started
                </button>
              </SignUpButton>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="w-full max-w-6xl mx-auto px-6 pt-12 pb-20 text-center z-10 flex flex-col items-center">
        {/* Badge Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-6 shadow-inner backdrop-blur-md">
          <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
          <span>Interactive Web Development Playground</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl leading-[1.1] mb-6 text-white">
          Master frontend code through <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">interactive challenge feedback.</span>
        </h1>

        <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mb-10 leading-relaxed">
          Level up your HTML, CSS, and JS skills with live code challenges, automated submission checks, and your dynamic pixel mentor Byte.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center mb-16">
          {userId ? (
            <Link
              href="/lessons/headings-and-paragraphs"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold px-8 py-4 rounded-2xl transition-all shadow-xl shadow-indigo-600/30 group hover:scale-105"
            >
              <span>Continue Learning</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </Link>
          ) : (
            <>
              <SignUpButton mode="modal">
                <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold px-8 py-4 rounded-2xl transition-all shadow-xl shadow-indigo-600/30 group cursor-pointer hover:scale-105">
                  <span>Start Learning Free</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </button>
              </SignUpButton>

              <SignInButton mode="modal">
                <button className="w-full sm:w-auto flex items-center justify-center bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white font-semibold px-8 py-4 rounded-2xl border border-slate-800 transition-all cursor-pointer hover:scale-105">
                  Sign In to Account
                </button>
              </SignInButton>
            </>
          )}
        </div>

        {/* Hero Interactive IDE Mockup Box */}
        <div className="w-full max-w-4xl rounded-2xl bg-slate-950 border border-slate-800/80 shadow-2xl shadow-indigo-500/10 overflow-hidden mb-16 text-left relative group">
          {/* Window Header */}
          <div className="px-4 py-3 bg-slate-900/90 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="ml-2 text-xs font-mono text-slate-400">index.html — CodeTopiaZ IDE</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Auto-Validated</span>
            </div>
          </div>

          {/* IDE Content */}
          <div className="p-6 font-mono text-xs sm:text-sm text-slate-300 leading-relaxed overflow-x-auto bg-slate-950/90">
            <div><span className="text-purple-400">&lt;div</span> <span className="text-indigo-300">class</span>=<span className="text-emerald-300">"challenge-container"</span><span className="text-purple-400">&gt;</span></div>
            <div className="pl-4"><span className="text-purple-400">&lt;h1</span> <span className="text-indigo-300">class</span>=<span className="text-emerald-300">"title"</span><span className="text-purple-400">&gt;</span>Welcome to CodeTopiaZ<span className="text-purple-400">&lt;/h1&gt;</span></div>
            <div className="pl-4"><span className="text-purple-400">&lt;p&gt;</span>Byte is ready to review your solution...<span className="text-purple-400">&lt;/p&gt;</span></div>
            <div className="pl-4"><span className="text-purple-400">&lt;button</span> <span className="text-indigo-300">onClick</span>=<span className="text-emerald-300">{"{validateCode}"}</span><span className="text-purple-400">&gt;</span>Submit Code<span className="text-purple-400">&lt;/button&gt;</span></div>
            <div><span className="text-purple-400">&lt;/div&gt;</span></div>
          </div>

          {/* Byte Avatar Badge Floating Inside IDE */}
          <div className="absolute bottom-4 right-4 bg-slate-900/95 border border-indigo-500/30 rounded-xl p-3 flex items-center gap-3 shadow-lg backdrop-blur-md">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <Bot className="w-5 h-5 text-indigo-200" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                Byte <span className="text-[10px] text-indigo-400 font-mono">v1.0</span>
              </div>
              <div className="text-[11px] text-slate-400">"Clean syntax! You're ready to submit."</div>
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-sm hover:border-indigo-500/50 hover:bg-slate-900/60 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-110 transition-transform">
              <Code2 className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-200 mb-2">Interactive Challenges</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Write live HTML, CSS, and JavaScript directly in your browser with real-time feedback.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-sm hover:border-purple-500/50 hover:bg-slate-900/60 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4 group-hover:scale-110 transition-transform">
              <Terminal className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-200 mb-2">Automated Validation</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Custom test rules check your DOM structure and logic instantly upon submission.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-sm hover:border-pink-500/50 hover:bg-slate-900/60 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 mb-4 group-hover:scale-110 transition-transform">
              <Trophy className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-200 mb-2">Gamified Curriculum</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Track module completions, earn badges, and build full projects step by step.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-8 border-t border-slate-900/80 text-center text-sm text-slate-500 z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>© {new Date().getFullYear()} CodeTopiaZ. Interactive Web Development Platform.</p>
        <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>All systems operational</span>
        </div>
      </footer>
    </div>
  );
}