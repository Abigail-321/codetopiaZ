import type { Track, Module, Lesson } from "@prisma/client";

/** Slim shapes for navigation: only what the sidebar needs. */
export type TrackSummary = Pick<Track, "id" | "title" | "slug" | "orderIndex">;
export type LessonSummary = Pick<Lesson, "id" | "slug" | "title" | "orderIndex">;

export type ModuleWithLessons = Pick<
  Module,
  "id" | "title" | "slug" | "orderIndex"
> & {
  track: TrackSummary;
  lessons: LessonSummary[];
};

/** The open lesson, minus solution code, which never leaves the server. */
export type ClientLesson = Omit<
  Lesson,
  "solutionCodeHtml" | "solutionCodeCss" | "solutionCodeJs"
>;

export type LessonWithModule = ClientLesson & {
  module: Module & { track: Track };
};

export type CodeFiles = { html: string; css: string; js: string };
export type CodeFileKey = keyof CodeFiles;
export type SubmitState = "idle" | "submitting" | "passed" | "failed";