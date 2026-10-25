"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import type { CodeFiles, CodeFileKey, LessonSummary, SubmitState } from "@/lib/type";
import type { RuleResult } from "@/lib/validation/engine"; // import type: keeps jsdom out of the client bundle

const TABS: { id: CodeFileKey; label: string; placeholder: string }[] = [
  { id: "html", label: "index.html", placeholder: "<!-- Write your HTML here -->" },
  { id: "css", label: "styles.css", placeholder: "/* Write your CSS here */" },
  { id: "js", label: "script.js", placeholder: "// Write your JavaScript here" },
];

interface CodeEditorPaneProps {
  code: CodeFiles;
  onChange: (code: CodeFiles) => void;
  onRun: () => void;
  onReset: () => void;
  onSubmit: () => void;
  submitState: SubmitState;
  ruleResults: RuleResult[];
  nextLesson: LessonSummary | null;
}

export default function CodeEditorPane({
  code,
  onChange,
  onRun,
  onReset,
  onSubmit,
  submitState,
  ruleResults,
  nextLesson,
}: CodeEditorPaneProps) {
  const [activeTab, setActiveTab] = useState<CodeFileKey>("html");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const activeConfig = TABS.find((t) => t.id === activeTab) ?? TABS[0];

  // Always hands the parent the full { html, css, js } object.
  const updateActiveFile = (value: string) => {
    onChange({ ...code, [activeTab]: value });
  };

  const handleEditorKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== "Tab") return;
    e.preventDefault();
    const el = textareaRef.current;
    if (!el) return;
    const { selectionStart, selectionEnd, value } = el;
    updateActiveFile(
      value.slice(0, selectionStart) + "  " + value.slice(selectionEnd)
    );
    requestAnimationFrame(() => {
      el.selectionStart = el.selectionEnd = selectionStart + 2;
    });
  };

  const handleTabListKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const currentIndex = TABS.findIndex((t) => t.id === activeTab);
    const delta = e.key === "ArrowRight" ? 1 : -1;
    const next = TABS[(currentIndex + delta + TABS.length) % TABS.length];
    setActiveTab(next.id);
    document.getElementById(`editor-tab-${next.id}`)?.focus();
  };

  return (
    <section className="flex min-h-0 flex-col border-r border-white/10 bg-[#0b0e14]">
      {/* Tab bar + reset */}
      <div className="flex items-center justify-between border-b border-white/10 pr-4">
        <div
          role="tablist"
          aria-label="Code files"
          onKeyDown={handleTabListKeyDown}
          className="flex"
        >
          {TABS.map((tab) => {
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                id={`editor-tab-${tab.id}`}
                role="tab"
                type="button"
                aria-selected={isActive}
                aria-controls="editor-panel"
                tabIndex={isActive ? 0 : -1}
                onClick={() => setActiveTab(tab.id)}
                className={`border-b-2 px-4 py-2.5 font-mono text-xs transition-colors ${
                  isActive
                    ? "border-blue-500 text-white"
                    : "border-transparent text-slate-500 hover:text-slate-300"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-1 text-xs text-slate-400 transition-colors hover:text-white"
        >
          ↺ Reset
        </button>
      </div>

      {/* Editor for the active file */}
      <div
        id="editor-panel"
        role="tabpanel"
        aria-labelledby={`editor-tab-${activeTab}`}
        className="flex min-h-0 flex-1"
      >
        <textarea
          key={activeTab}
          ref={textareaRef}
          aria-label={`${activeConfig.label} editor`}
          value={code[activeTab]}
          onChange={(e) => updateActiveFile(e.target.value)}
          onKeyDown={handleEditorKeyDown}
          placeholder={activeConfig.placeholder}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          className="min-h-0 flex-1 resize-none bg-transparent p-4 font-mono text-sm leading-6 text-slate-200 outline-none placeholder:text-slate-600"
        />
      </div>

      {/* Validation checklist */}
      {ruleResults.length > 0 && (
        <div
          aria-live="polite"
          className="max-h-40 overflow-y-auto border-t border-white/10 bg-[#0d1117] px-4 py-3"
        >
          <ul className="flex flex-col gap-1">
            {ruleResults.map((r) => (
              <li
                key={r.ruleId}
                className={`flex items-center gap-2 text-xs ${
                  r.passed ? "text-emerald-400" : "text-rose-400"
                }`}
              >
                <span>{r.passed ? "✓" : "✕"}</span>
                {r.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Action bar */}
      <div className="flex items-center justify-end gap-3 border-t border-white/10 p-3">
        <button
          type="button"
          onClick={onRun}
          className="rounded-md border border-white/10 px-4 py-2 text-sm font-medium text-slate-200 transition-colors hover:bg-white/5"
        >
          ▶ Run Code
        </button>

        <button
          type="button"
          onClick={onSubmit}
          disabled={submitState === "submitting"}
          className={`rounded-md px-4 py-2 text-sm font-medium text-white transition-colors disabled:opacity-60 ${
            submitState === "passed"
              ? "bg-emerald-600 hover:bg-emerald-500"
              : submitState === "failed"
                ? "bg-rose-600 hover:bg-rose-500"
                : "bg-blue-600 hover:bg-blue-500"
          }`}
        >
          {submitState === "submitting"
            ? "Checking…"
            : submitState === "passed"
              ? "✓ Passed"
              : submitState === "failed"
                ? "Try Again"
                : "Submit Solution"}
        </button>

        {nextLesson && (
          <Link
            href={`/lessons/${nextLesson.slug}`}
            aria-disabled={submitState !== "passed"}
            tabIndex={submitState !== "passed" ? -1 : 0}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              submitState === "passed"
                ? "bg-white text-black hover:bg-slate-200"
                : "pointer-events-none bg-white/5 text-slate-500"
            }`}
          >
            Next Lesson →
          </Link>
        )}
      </div>
    </section>
  );
}