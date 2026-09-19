import { ForwardedRef } from "react";

export function ArchiveSkeleton({
  ref,
  hasMore,
}: {
  ref: ForwardedRef<HTMLDivElement>;
  hasMore: boolean;
}) {
  return (
    <div ref={ref} className="flex flex-col gap-3">
      {hasMore
        ? [0, 1, 2]
        : [].map((i) => (
            <div
              key={i}
              className="flex animate-pulse flex-col gap-3 rounded-2xl border border-[#DCD2C2] p-5 dark:border-[#332C24]"
            >
              <div className="flex items-center justify-between">
                <div className="h-6 w-32 rounded-full bg-[#F0E8DA] dark:bg-[#221D17]" />
                <div className="h-4 w-20 rounded bg-[#F0E8DA] dark:bg-[#221D17]" />
              </div>
              <div className="h-5 w-full rounded bg-[#F0E8DA] dark:bg-[#221D17]" />
              <div className="h-5 w-2/3 rounded bg-[#F0E8DA] dark:bg-[#221D17]" />
            </div>
          ))}
    </div>
  );
}
