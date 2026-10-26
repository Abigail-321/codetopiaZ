import { notFound } from "next/navigation";
import { getModules, getLessonBySlug } from "@/app/actions/lessons";
import { getCompletedLessonIds } from "@/app/actions/progress";
import { getCurrentUserAvatarId } from "@/app/actions/user";
import LessonWorkspace from "@/components/workspace/LessonWorkspace";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function LessonPage({ params }: PageProps) {
  const { slug } = await params;

  const [lesson, modules, completedLessonIds, avatarId] = await Promise.all([
    getLessonBySlug(slug),
    getModules(),
    getCompletedLessonIds(),
    getCurrentUserAvatarId(),
  ]);

  if (!lesson) notFound();

  return (
    <LessonWorkspace
      key={lesson.id}
      lesson={lesson as any}
      modules={modules as any}
      completedLessonIds={completedLessonIds}
      avatarId={avatarId}
    />
  );
}