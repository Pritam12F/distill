import Link from "next/link";
import { Layers, Scale } from "lucide-react";

export type DigestCardProps = {
  id: string;
  topic: string;
  headline: string;
  sourceCount: number;
  hasConflict?: string | null;
  date: string; // "Jun 10" or "Today"
  isUnread?: boolean;
  accentIndex: number; // 0-4, picks the topic chip color
};

const CHIP_STYLES = [
  "bg-[#EEEDFE] text-[#3C3489] dark:bg-[#2A2570] dark:text-[#C7C3F5]", // purple
  "bg-[#E5F5ED] text-[#26734D] dark:bg-[#1B4530] dark:text-[#8FD4AE]", // green
  "bg-[#FFF2D7] text-[#94651C] dark:bg-[#4A3312] dark:text-[#F0C878]", // amber
  "bg-[#FFE9E3] text-[#A44D38] dark:bg-[#4A2A20] dark:text-[#F0B39E]", // coral
  "bg-[#E4F0FB] text-[#32658F] dark:bg-[#1F3A52] dark:text-[#A8CDEE]", // blue
];

export function DigestCard({
  id,
  topic,
  headline,
  sourceCount,
  hasConflict,
  date,
  isUnread = false,
  accentIndex,
}: DigestCardProps) {
  const chipStyle = CHIP_STYLES[accentIndex % CHIP_STYLES.length];

  return (
    <Link
      href={`/digest/${id}`}
      className={`block rounded-2xl border border-[#DCD2C2] bg-[#FBF6EE] p-4 transition-transform duration-200 hover:-translate-y-0.5 dark:border-[#332C24] dark:bg-[#14110E] ${
        isUnread
          ? "rounded-l-none border-l-2 border-l-[#755815] dark:border-l-[#D9A441]"
          : ""
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <span
          className={`rounded-full px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.16em] ${chipStyle}`}
        >
          {topic}
        </span>
        <span className="text-xs text-[#6E645A] dark:text-[#A69A8B]">
          {date}
        </span>
      </div>

      <p className="mt-3 line-clamp-2 font-serif text-lg leading-snug tracking-tight text-[#1A1714] dark:text-[#F3EDE3]">
        {headline}
      </p>

      <div className="mt-3 flex items-center gap-3">
        <span className="flex items-center gap-1.5 text-xs text-[#6E645A] dark:text-[#A69A8B]">
          <Layers className="h-3.5 w-3.5" aria-hidden="true" />
          {sourceCount} {sourceCount === 1 ? "source" : "sources"}
        </span>
        {hasConflict && (
          <span className="flex items-center gap-1.5 rounded-full bg-[#F0E8DA] px-2.5 py-1 text-[11px] font-medium text-[#755815] dark:bg-[#221D17] dark:text-[#D9A441]">
            <Scale className="h-3.5 w-3.5" aria-hidden="true" />
            Conflict
          </span>
        )}
      </div>
    </Link>
  );
}
