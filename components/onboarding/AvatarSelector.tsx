"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AVATAR_LIST, DEFAULT_AVATAR_ID } from "@/lib/avatars";
import { setUserAvatar } from "@/app/actions/user";

interface AvatarSelectorProps {
  redirectTo?: string;
}

export default function AvatarSelector({
  redirectTo = "/lessons/document-structure",
}: AvatarSelectorProps) {
  const [selectedId, setSelectedId] = useState<string>(DEFAULT_AVATAR_ID);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleConfirm = () => {
    setError(null);
    startTransition(async () => {
      try {        await setUserAvatar(selectedId);
        router.push(redirectTo);
      } catch (err) {
        console.error(err);
        setError("Couldn't save your avatar — try again.");
      }
    });
  };

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 p-8 text-center">
      <div>
        <h1 className="text-2xl font-bold text-white">Choose your avatar</h1>
        <p className="mt-1 text-sm text-slate-400">
          They'll cheer you on (or point out what's missing) as you work through lessons.
        </p>
      </div>

      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
        {AVATAR_LIST.map((avatar) => {
          const isSelected = avatar.id === selectedId;
          return (
            <button
              key={avatar.id}
              type="button"
              onClick={() => setSelectedId(avatar.id)}
              className={`flex flex-col items-center gap-3 rounded-xl border p-4 transition-colors ${
                isSelected
                  ? "border-blue-500 bg-blue-500/10"
                  : "border-white/10 bg-white/5 hover:border-white/20"
              }`}
            >
              <div className="relative h-24 w-24 overflow-hidden rounded-lg bg-black/20">
                <Image
                  src={avatar.previewImage}
                  alt={avatar.name}
                  fill
                  className="object-contain"
                  sizes="96px"
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{avatar.name}</p>
                <p className="mt-1 text-xs text-slate-400">{avatar.description}</p>
              </div>
              {isSelected && (
                <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs font-medium text-white">
                  Selected
                </span>
              )}
            </button>
          );
        })}
      </div>

      {error && <p className="text-sm text-rose-400">{error}</p>}

      <button
        type="button"
        onClick={handleConfirm}
        disabled={isPending}
        className="rounded-md bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-500 disabled:opacity-60"
      >
        {isPending ? "Saving…" : "Start Learning"}
      </button>
    </div>
  );
}