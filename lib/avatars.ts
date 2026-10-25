// lib/avatars.ts

export type AvatarReactionPose = "IDLE" | "SUBMITTING" | "PASSED" | "FAILED" | "HINT";

export interface AvatarReactionConfig {
  row: number;        // 0-indexed row in the sprite sheet grid
  frameCount: number; // number of frames in this row's animation loop
  fps: number;        // playback speed for this reaction
}

export interface AvatarDefinition {
  id: string;
  name: string;
  description: string;
  previewImage: string; // static thumbnail for the onboarding grid
  spriteSheet: string;  // full sprite sheet asset path
  sheetColumns: number;  // grid columns (== widest reaction's frameCount)
  sheetRows: number;     // grid rows (== number of reaction states used)
  reactions: Record<AvatarReactionPose, AvatarReactionConfig>;
}

export const DEFAULT_AVATAR_ID = "pixel_wizard";

export const AVATARS: Record<string, AvatarDefinition> = {
  blonde_student: {
    id: "blonde_student",
    name: "Jamie",
    description: "A focused student avatar, always ready to debug.",
    previewImage: "/avatars/blonde_student/preview.png",
    spriteSheet: "/avatars/blonde_student/spritesheet.png",
    sheetColumns: 6,
    sheetRows: 5,
    reactions: {
      IDLE: { row: 0, frameCount: 4, fps: 4 },
      SUBMITTING: { row: 1, frameCount: 6, fps: 8 },
      PASSED: { row: 2, frameCount: 6, fps: 10 },
      FAILED: { row: 3, frameCount: 4, fps: 6 },
      HINT: { row: 4, frameCount: 5, fps: 6 },
    },
  },
  pixel_wizard: {
    id: "pixel_wizard",
    name: "Pixel Wizard",
    description: "A retro 8-bit wizard who conjures fixes with a wand.",
    previewImage: "/avatars/pixel_wizard/preview.png",
    spriteSheet: "/avatars/pixel_wizard/spritesheet.png",
    sheetColumns: 6,
    sheetRows: 5,
    reactions: {
      IDLE: { row: 0, frameCount: 4, fps: 3 },
      SUBMITTING: { row: 1, frameCount: 6, fps: 8 },
      PASSED: { row: 2, frameCount: 6, fps: 10 },
      FAILED: { row: 3, frameCount: 4, fps: 5 },
      HINT: { row: 4, frameCount: 6, fps: 6 },
    },
  },
  cyber_coder: {
    id: "cyber_coder",
    name: "Cyber Coder",
    description: "A neon-lit hacker-aesthetic avatar for the terminally online.",
    previewImage: "/avatars/cyber_coder/preview.png",
    spriteSheet: "/avatars/cyber_coder/spritesheet.png",
    sheetColumns: 6,
    sheetRows: 5,
    reactions: {
      IDLE: { row: 0, frameCount: 5, fps: 4 },
      SUBMITTING: { row: 1, frameCount: 6, fps: 9 },
      PASSED: { row: 2, frameCount: 6, fps: 12 },
      FAILED: { row: 3, frameCount: 4, fps: 5 },
      HINT: { row: 4, frameCount: 5, fps: 6 },
    },
  },
};

export const AVATAR_LIST: AvatarDefinition[] = Object.values(AVATARS);

export function getAvatar(avatarId: string): AvatarDefinition {
  return AVATARS[avatarId] ?? AVATARS[DEFAULT_AVATAR_ID];
}

export function isValidAvatarId(avatarId: string): boolean {
  return Object.prototype.hasOwnProperty.call(AVATARS, avatarId);
}