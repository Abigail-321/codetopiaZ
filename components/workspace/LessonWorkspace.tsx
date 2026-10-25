"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import type {
  LessonWithModule,
  ModuleWithLessons,
  CodeFiles,
  SubmitState,
} from "@/lib/type";
import type { RuleResult } from "@/lib/validation/engine";
import type { AvatarReactionPose } from "@/lib/avatars";
import { getStarterFiles } from "@/lib/code";
import { submitLesson } from "@/app/actions/progress";
import Sidebar from "./Sidebar";
import InstructionsPane from "./InstructionsPane";
import CodeEditorPane from "./CodeEditorPane";
import PreviewPane from "./PreviewPane";
import AvatarSprite from "./AvatarSprite";
import Toast from "./Toast";

interface LessonWorkspaceProps {
  lesson: LessonWithModule;
  modules: ModuleWithLessons[];
  completedLessonIds: string[];
  avatarId?: string;
}

export default function LessonWorkspace({
  lesson,
  modules,
  completedLessonIds,
  avatarId = "cat",
}: LessonWorkspaceProps) {
  // Parent page passes key={lesson.id}, so this component remounts per lesson
  // and all state starts fresh.
  const starterFiles = useMemo(() => getStarterFiles(lesson), [lesson]);
  const [code, setCode] = useState<CodeFiles>(starterFiles);
  const [previewCode, setPreviewCode] = useState<CodeFiles>(starterFiles);
  const [runCount, setRunCount] = useState(0);
  const [completedIds, setCompletedIds] = useState(new Set(completedLessonIds));
  const [submitState, setSubmitState] = useState<SubmitState>(
    completedLessonIds.includes(lesson.id) ? "passed" : "idle"
  );
  const [ruleResults, setRuleResults] = useState<RuleResult[]>([]);
  const [toast, setToast] = useState<{
    message: string;
    variant: "success" | "error";
  } | null>(null);
  const [avatarPose, setAvatarPose] = useState<AvatarReactionPose>("IDLE");
  const [avatarDialogue, setAvatarDialogue] = useState("Let's write some code!");

  // 1. ADDED: Counter to force PreviewPane iframe re-execution on manual run/refresh
  const [runKey, setRunKey] = useState<number>(0);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flatLessons = useMemo(() => modules.flatMap((m) => m.lessons), [modules]);
  const currentIndex = flatLessons.findIndex((l) => l.id === lesson.id);
  const nextLesson = flatLessons[currentIndex + 1] ?? null;

  // Live preview: refresh shortly after typing stops.
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setPreviewCode(code), 600);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [code]);

  // 2. UPDATED: Increment runKey on manual run so iframe resets immediately
  const handleRun = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setPreviewCode(code);
    setRunKey((prev) => prev + 1);
    setRunCount((c) => c + 1);
  }, [code]);

  const handleReset = useCallback(() => {
    setCode(starterFiles);
    setPreviewCode(starterFiles);
    setRuleResults([]);
    setSubmitState(completedIds.has(lesson.id) ? "passed" : "idle");
    setAvatarPose("IDLE");
    setAvatarDialogue("Fresh start. Let's go!");
    setRunKey((prev) => prev + 1);
    setRunCount((c) => c + 1);
  }, [starterFiles, completedIds, lesson.id]);

  const handleSubmit = useCallback(async () => {
    setSubmitState("submitting");
    setAvatarPose("SUBMITTING");
    setAvatarDialogue("Let me take a look...");
    try {
      const { success, results, avatarReaction } = await submitLesson(
        lesson.id,
        lesson.slug,
        code
      );
      setRuleResults(results);
      setAvatarPose(avatarReaction.pose as AvatarReactionPose);
      setAvatarDialogue(avatarReaction.dialogue);

      if (success) {
        setSubmitState("passed");
        setCompletedIds((prev) => new Set(prev).add(lesson.id));
        setToast({ message: "Lesson complete! Nice work.", variant: "success" });
      } else {
        setSubmitState("failed");
        setToast({
          message: "Not quite. Check the checklist below the editor.",
          variant: "error",
        });
      }
    } catch (err) {
      console.error(err);
      setSubmitState("failed");
      setAvatarPose("FAILED");
      setAvatarDialogue("Something broke on our end. Try again.");
      setToast({ message: "Something went wrong submitting.", variant: "error" });
    }
  }, [lesson.id, lesson.slug, code]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#0b0e14] text-slate-200">
      <Sidebar
        modules={modules}
        currentSlug={lesson.slug}
        completedLessonIds={completedIds}
      />
      <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)]">
        {/* Instructions + avatar */}
        <div className="flex min-h-0 flex-col bg-[#0d1117] [&>section]:min-h-0 [&>section]:flex-1">
          <InstructionsPane lesson={lesson} />
          <div className="flex items-center gap-3 border-r border-t border-white/10 p-3 bg-[#12161f]">
            <AvatarSprite avatarId={avatarId} pose={avatarPose} size={64} />
            <p className="text-sm text-slate-300 font-medium">{avatarDialogue}</p>
          </div>
        </div>

        <CodeEditorPane
          code={code}
          onChange={setCode}
          onRun={handleRun}
          onReset={handleReset}
          onSubmit={handleSubmit}
          submitState={submitState}
          ruleResults={ruleResults}
          nextLesson={nextLesson as any}
        />

        {/* 3. UPDATED: PreviewPane rendered in the right-most grid column with runKey */}
        <PreviewPane
          files={previewCode}
          runKey={runCount}
          onRefresh={handleRun}
        />
      </div>

      {toast && (
        <Toast
          message={toast.message}
          variant={toast.variant}
          onDismiss={() => setToast(null)}
        />
      )}
    </div>
  );
}