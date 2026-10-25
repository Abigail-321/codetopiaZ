"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { CodeFiles } from "@/lib/type";
import { buildPreviewDocument, isPreviewErrorMessage } from "@/lib/code";

const MAX_ERRORS = 5;

interface PreviewError {
  message: string;
  line?: number;
}

interface PreviewPaneProps {
  files: CodeFiles;
  /** Bump to force the iframe to remount, which re-executes the student's JS from scratch. */
  runKey: number;
  onRefresh: () => void;
}

export default function PreviewPane({ files, runKey, onRefresh }: PreviewPaneProps) {
  const srcDoc = useMemo(() => buildPreviewDocument(files), [files]);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Errors belong to one specific run of one specific document. When either
  // changes, drop the old ones during render (React's recommended "adjust
  // state on prop change" pattern), before the new iframe can report anything.
  const docKey = `${runKey}:${srcDoc}`;
  const [errorsDocKey, setErrorsDocKey] = useState(docKey);
  const [errors, setErrors] = useState<PreviewError[]>([]);
  if (errorsDocKey !== docKey) {
    setErrorsDocKey(docKey);
    setErrors([]);
  }

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // A sandboxed iframe has an opaque origin ("null"), so origin checks are
      // useless. Identify the sender by window identity instead.
      if (event.source !== iframeRef.current?.contentWindow) return;
      if (!isPreviewErrorMessage(event.data)) return;

      const message = event.data.message.slice(0, 500);
      const line =
        typeof event.data.line === "number" ? event.data.line : undefined;

      setErrors((prev) => {
        if (prev.length >= MAX_ERRORS) return prev;
        if (prev.some((e) => e.message === message && e.line === line)) {
          return prev; // dedupe repeats (e.g. an erroring setInterval)
        }
        return [...prev, { message, line }];
      });
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <section className="flex min-h-0 flex-col bg-[#0d1117]">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
        <p className="flex items-center gap-2 text-xs font-medium text-slate-400">
          👁 Preview
        </p>
        <button
          type="button"
          onClick={onRefresh}
          className="flex items-center gap-1 text-xs text-slate-400 transition-colors hover:text-white"
        >
          ⟳ Refresh
        </button>
      </div>

      <div className="flex items-center gap-2 border-b border-white/10 bg-[#161b22] px-4 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
        <span className="ml-3 rounded bg-black/30 px-2 py-0.5 text-xs text-slate-400">
          localhost:3000/index.html
        </span>
      </div>

      <iframe
        key={runKey}
        ref={iframeRef}
        title="Live preview"
        srcDoc={srcDoc}
        sandbox="allow-scripts"
        className="min-h-0 flex-1 bg-white"
      />

      {errors.length > 0 && (
        <div
          role="alert"
          className="max-h-40 shrink-0 overflow-y-auto border-t border-rose-500/30 bg-rose-950/40 px-4 py-3"
        >
          <p className="mb-1 text-xs font-semibold text-rose-300">
            {errors.length === 1 ? "JavaScript error" : "JavaScript errors"}
          </p>
          <ul className="flex flex-col gap-1">
            {errors.map((err, i) => (
              <li key={i} className="font-mono text-xs text-rose-200">
                {err.line !== undefined && (
                  <span className="text-rose-400">script.js line {err.line}: </span>
                )}
                {err.message}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}