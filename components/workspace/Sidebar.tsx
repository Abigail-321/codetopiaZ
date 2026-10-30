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

function groupByTrack(modules: ModuleWithLessons[]): TrackGroup[] {
  const groups: TrackGroup[] = [];
  if (!modules || !Array.isArray(modules)) return groups;

  for (const m of modules) {
    if (!m || !m.track) continue;

    const last = groups[groups.length - 1];
    if (last && last.track?.id === m.track.id) {
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
  // Ensure modules are sorted by track order and module order first
  const sortedModules = [...(modules || [])].sort((a, b) => {
    const trackOrderA = a.track?.orderIndex ?? 0;
    const trackOrderB = b.track?.orderIndex ?? 0;
    if (trackOrderA !== trackOrderB) return trackOrderA - trackOrderB;
    return (a.orderIndex ?? 0) - (b.orderIndex ?? 0);
  });

  const trackGroups = groupByTrack(sortedModules);

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800 p-4 flex flex-col h-full overflow-y-auto">
      {trackGroups.map((group) => (
        <div key={group.track.id} className="mb-6">
          <h3 className="text-xs font-bold text-blue-400 tracking-wider uppercase mb-2">
            {group.track.title}
          </h3>
          <div className="space-y-1">
            {group.modules.map((mod) => (
              <div key={mod.id} className="mb-3">
                <div className="text-xs font-semibold text-slate-400 px-2 mb-1">
                  {mod.title}
                </div>
                {mod.lessons.map((lesson) => {
                  const isActive = lesson.slug === currentSlug;
                  const isCompleted = completedLessonIds.has(lesson.id);
                  return (
                    <Link
                      key={lesson.id}
                      href={`/lessons/${lesson.slug}`}
                      className={`flex items-center gap-2 px-2 py-1.5 rounded text-sm transition-colors ${
                        isActive
                          ? "bg-blue-600/20 text-blue-400 font-medium"
                          : "text-slate-300 hover:bg-slate-900 hover:text-white"
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${isCompleted ? "bg-emerald-500" : "border border-slate-500"}`} />
                      <span className="truncate">{lesson.title}</span>
                    </Link>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      ))}
    </aside>
  );
}
  