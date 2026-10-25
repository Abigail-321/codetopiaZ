// components/workspace/AvatarSprite.tsx
"use client";

import { useEffect, useState } from "react";
import { getAvatar, type AvatarReactionPose } from "@/lib/avatars";

interface AvatarSpriteProps {
  avatarId: string;
  pose: AvatarReactionPose;
  size?: number;
}

export default function AvatarSprite({ avatarId, pose, size = 96 }: AvatarSpriteProps) {
  const avatar = getAvatar(avatarId);
  const reaction = avatar.reactions[pose] ?? avatar.reactions.IDLE;
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    setFrame(0);
    if (reaction.frameCount <= 1) return;
    const id = setInterval(() => {
      setFrame((f) => (f + 1) % reaction.frameCount);
    }, 1000 / reaction.fps);
    return () => clearInterval(id);
  }, [pose, reaction.fps, reaction.frameCount]);

  const xPercent =
    avatar.sheetColumns > 1 ? (frame / (avatar.sheetColumns - 1)) * 100 : 0;
  const yPercent =
    avatar.sheetRows > 1 ? (reaction.row / (avatar.sheetRows - 1)) * 100 : 0;

  return (
    <div
      role="img"
      aria-label={`${avatar.name} - ${pose.toLowerCase()}`}
      style={{
        width: size,
        height: size,
        backgroundImage: `url(${avatar.spriteSheet})`,
        backgroundSize: `${avatar.sheetColumns * 100}% ${avatar.sheetRows * 100}%`,
        backgroundPosition: `${xPercent}% ${yPercent}%`,
        imageRendering: "pixelated",
      }}
    />
  );
}