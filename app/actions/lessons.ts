"use server";

import { prisma } from "@/lib/prisma";

export async function getModules() {
  try {
    const modules = await prisma.module.findMany({
      where: { published: true },
      orderBy: { orderIndex: "asc" },
      include: {
        track: true, // <-- ADD THIS LINE SO TRACK IS NEVER UNDEFINED
        lessons: {
          orderBy: { orderIndex: "asc" },
          select: {
            id: true,
            title: true,
            slug: true,
            orderIndex: true,
          },
        },
      },
    });
    return modules;
  } catch (error) {
    console.error("Failed to fetch modules:", error);
    return [];
  }
}

// Fetch a single lesson by its slug
export async function getLessonBySlug(slug: string) {
  try {
    const lesson = await prisma.lesson.findFirst({
      where: { slug },
      include: {
        module: {
          select: { title: true, slug: true },
        },
      },
    });
    return lesson;
  } catch (error) {
    console.error(`Failed to fetch lesson ${slug}:`, error);
    return null;
  }
}