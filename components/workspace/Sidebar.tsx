import Link from "next/link";
import type { ModuleWithLessons, TrackSummary } from "@/lib/type";

interface SidebarProps {
  modules: ModuleWithLessons[];
  currentSlug: string;
  completedLessonIds: Set<string>;
}

interface TrackGroup {
  track: TrackSummary;
  modules: ModuleWithLessons[];
}

// getModules() returns modules already ordered, so a track's modules are
// contiguous. Grouping consecutive entries preserves that order.
function groupByTrack(modules: ModuleWithLessons[]): TrackGroup[] {
  const groups: TrackGroup[] = [];
  for (const m of modules) {
    const last = groups[groups.length - 1];
    if (last && last.track.id === m.track.id) {
      last.modules.push(m);
    } else {
      groups.push({ track: m.track, modules: [m] });
    }
  }
  return groups;
}

export default function Sidebar({
  modules,
  currentSlug,
  completedLessonIds,
}: SidebarProps) {
  const trackGroups = groupByTrack(modules);

  return (
    <aside className="hidden w-72 shrink-0 flex-col overflow-y-auto border-r border-white/10 bg-[#0d1117] p-4 lg:flex">
      <div className="mb-6 flex items-center gap-3 rounded-lg bg-blue-600/10 p-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-blue-500 text-lg">
          🎓
        </div>
        <div>
          <p className="text-sm font-bold text-white">CodeTopiaZ</p>
          <p className="text-xs text-slate-400">Interactive course</p>
        </div>
      </div>

      <nav className="flex flex-col gap-8">
        {trackGroups.map(({ track, modules: trackModules }) => (
          <div key={track.id}>
            <p className="mb-3 px-2 text-[11px] font-bold uppercase tracking-widest text-blue-400">
              {track.title}
            </p>

            <div className="flex flex-col gap-5">
              {trackModules.map((module) => (
                <div key={module.id}>
                  <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {module.title}
                  </p>
                  <ul className="flex flex-col gap-1">
                    {module.lessons.map((lesson) => {
                      const isActive = lesson.slug === currentSlug;
                      const isDone = completedLessonIds.has(lesson.id);
                      return (
                        <li key={lesson.id}>
                          <Link
                            href={`/lessons/${lesson.slug}`}
                            className={`flex items-center justify-between rounded-md px-2 py-2 text-sm transition-colors ${
                              isActive
                                ? "bg-blue-600/90 font-medium text-white"
                                : "text-slate-300 hover:bg-white/5"
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              {isDone ? (
                                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[10px] text-white">
                                  ✓
                                </span>
                              ) : (
                                <span
                                  className={`h-2 w-2 rounded-full border ${
                                    isActive
                                      ? "border-white bg-white"
                                      : "border-slate-500"
                                  }`}
                                />
                              )}
                              {lesson.title}
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}