"use client";

import { useLanding } from "@/hooks/use-landing";
import { formatDateShortHand } from "@/utils/format-date";
import { Check } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";

export function SampleArticles() {
  const { articles, error } = useLanding();

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <div className="w-full space-y-3 lg:max-w-sm">
      {articles &&
        articles.length > 0 &&
        articles.map((item) => {
          const published = formatDateShortHand(item.publishedAt);

          return (
            <div
              key={item.id ?? item.source ?? item.title}
              className="flex items-start gap-3 rounded-2xl border border-[#FBF6EE]/20 bg-[#FBF6EE]/10 p-4 backdrop-blur-sm dark:border-[#F3EDE3]/20 dark:bg-[#F3EDE3]/10"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FBF6EE]/20 text-[11px] font-medium dark:bg-[#F3EDE3]/20">
                {item.initials}
              </span>

              <div className="min-w-0 flex-1">
                <p className="truncate text-[11px] uppercase tracking-[0.14em] opacity-70">
                  {item.source}
                </p>
                <p className="mt-1 line-clamp-2 text-sm leading-5">
                  {item.title}
                </p>
              </div>

              {published && (
                <span className="shrink-0 rounded-full bg-[#FBF6EE]/15 px-2.5 py-1 text-[11px] dark:bg-[#F3EDE3]/15">
                  {published}
                </span>
              )}
            </div>
          );
        })}
    </div>
  );
}

export function SampleSummary() {
  const { articles, error, summaryPoints, headline, topic, conflict } =
    useLanding();

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <div className="rounded-3xl bg-[#FBF6EE] p-6 text-[#1A1714] lg:p-7 dark:bg-[#14110E] dark:text-[#F3EDE3]">
      <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.16em] text-[#6E645A] dark:text-[#A69A8B]">
        <span>Today&apos;s digest</span>
        <span>{articles?.length} sources</span>
      </div>
      <p className="mt-4 font-serif text-xl leading-snug tracking-tight">
        {headline ?? "No headline"}
      </p>
      <ul className="mt-5 space-y-3">
        {summaryPoints?.map((point) => (
          <li
            key={point}
            className="flex gap-2.5 text-sm leading-6 text-[#6E645A] dark:text-[#A69A8B]"
          >
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#755815] dark:text-[#D9A441]" />
            {point}
          </li>
        ))}
      </ul>
      <div className="mt-6 flex flex-wrap gap-2 border-t border-[#DCD2C2] pt-5 dark:border-[#332C24]">
        {[topic, conflict].map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-[#F0E8DA] px-3 py-1 text-xs text-[#6E645A] dark:bg-[#221D17] dark:text-[#A69A8B]"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
