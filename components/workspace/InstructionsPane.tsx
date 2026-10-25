import ReactMarkdown from "react-markdown";
import type { LessonWithModule } from "@/lib/type";

interface InstructionsPaneProps {
  lesson: LessonWithModule;
}

export default function InstructionsPane({ lesson }: InstructionsPaneProps) {
  return (
    <section className="flex flex-col overflow-y-auto border-r border-white/10 bg-[#0d1117] p-6">
      <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-blue-400">
        💡 {lesson.module.track.title} · {lesson.module.title}
      </p>
      <h1 className="mb-4 text-2xl font-bold text-white">{lesson.title}</h1>
      <div className="prose prose-invert prose-sm max-w-none prose-headings:text-white prose-li:marker:text-blue-400">
        <ReactMarkdown>{lesson.instructionsMarkdown ?? ""}</ReactMarkdown>
      </div>
    </section>
  );
}