// app/actions/progress.ts
"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { evaluateSubmission } from "@/lib/validation/engine";

interface CodePayload {
  html: string;
  css: string;
  js: string;
}

async function getDevOrClerkUserId(): Promise<string> {
  try {
    const { userId } = await auth();
    if (userId) return userId;
  } catch {
    // Auth context omitted or unconfigured locally
  }
  return "dev_user_mock";
}

async function getOrCreateUser(clerkUserId: string) {
  return await prisma.user.upsert({
    where: { clerkUserId },
    update: {},
    create: {
      clerkUserId,
      email: `${clerkUserId}@example.com`,
      role: "STUDENT",
    },
  });
}

export async function submitLesson(
  lessonId: string,
  lessonSlug: string,
  code: CodePayload
) {
  const clerkUserId = await getDevOrClerkUserId();
  const user = await getOrCreateUser(clerkUserId);

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: { validationRules: { orderBy: { orderIndex: "asc" } } },
  });

  if (!lesson) {
    throw new Error("Lesson not found");
  }

  const outcome = await evaluateSubmission(
    code.html,
    code.css,
    code.js,
    lesson.validationRules.map((r) => ({
      id: r.id,
      type: r.type,
      config: r.config as any,
      successMessage: r.successMessage,
      failureMessage: r.failureMessage,
      hintMessage: r.hintMessage,
    }))
  );

  await prisma.userProgress.upsert({
    where: { userId_lessonId: { userId: user.id, lessonId } },
    update: {
      completed: outcome.success,
      score: outcome.success ? 100 : 0,
      lastSubmittedCode: JSON.stringify(code),
    },
    create: {
      userId: user.id,
      lessonId,
      completed: outcome.success,
      score: outcome.success ? 100 : 0,
      lastSubmittedCode: JSON.stringify(code),
    },
  });

  return outcome; // Returns { success, results, avatarReaction }
}

export async function getCompletedLessonIds(): Promise<string[]> {
  const clerkUserId = await getDevOrClerkUserId();
  const user = await prisma.user.findUnique({ where: { clerkUserId } });
  if (!user) return [];

  const completed = await prisma.userProgress.findMany({
    where: { userId: user.id, completed: true },
    select: { lessonId: true },
  });

  return completed.map((c) => c.lessonId);
}