"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { isValidAvatarId, DEFAULT_AVATAR_ID } from "@/lib/avatars";

export async function setUserAvatar(avatarId: string): Promise<void> {
  const { userId: clerkUserId } = await auth();
  if (!clerkUserId) {
    throw new Error("Not authenticated");
  }

  if (!isValidAvatarId(avatarId)) {
    throw new Error("Invalid avatar selection");
  }

  await prisma.user.upsert({
    where: { clerkUserId },
    update: { avatarId },
    create: {
      clerkUserId,
      email: `${clerkUserId}@example.com`,
      role: "STUDENT",
      avatarId,
    },
  });
}

export async function getCurrentUserAvatarId(): Promise<string> {
  const { userId: clerkUserId } = await auth();
  if (!clerkUserId) return DEFAULT_AVATAR_ID;

  const user = await prisma.user.findUnique({
    where: { clerkUserId },
    select: { avatarId: true },
  });

  return user?.avatarId ?? DEFAULT_AVATAR_ID;
}