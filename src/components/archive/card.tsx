"use client";

import {
  AllDigestsPerTopicType,
  getAllDigests,
} from "@/actions/get-all-digests";
import { ArchiveSkeleton } from "./loading";
import { useEffect, useMemo, useState } from "react";
import { ArchiveCard } from "@/app/(main)/archive/page";
import { errorDecoder } from "@/utils/error-decoder";
import { useInView } from "react-intersection-observer";

export function LoaderWrapper() {
  const [loadedGroups, setLoadedGroups] = useState<
    {
      name: string;
      digests: AllDigestsPerTopicType[];
      hasNext: boolean;
    }[]
  >([]);
  const [pageNum, setPageNum] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const { ref, inView } = useInView({
    /* Optional options */
    threshold: 0,
  });

  useEffect(() => {
    if (inView) {
      console.log("In view");
      async function setter() {
        try {
          const nextPage = pageNum + 1;

          const { groups, success } = await getAllDigests(nextPage);

          if (success && groups && groups.length) {
            setLoadedGroups(groups);
            setPageNum(nextPage);
          }
        } catch (err) {
          console.error(errorDecoder(err));
        }
      }

      setter();
    }
  }, [inView, setLoadedGroups, setPageNum]);

  const hasMore = useMemo(() => {
    return loadedGroups.some((g) => g.hasNext);
  }, [loadedGroups]);

  return (
    <div className="bg-red-500">
      {loadedGroups &&
        loadedGroups.length > 0 &&
        loadedGroups.map((g) => {
          if (g.digests.length) {
            return (
              <section
                key={g.digests[0].topicId}
                className="flex flex-col gap-4"
              >
                <h2 className="text-xs font-medium uppercase tracking-widest text-[#A69A8B] dark:text-[#6E645A]">
                  {g.name}
                </h2>
                <div className="flex flex-col gap-3">
                  {g.digests.map((digest) => (
                    <ArchiveCard key={digest.id} {...digest} />
                  ))}
                </div>
              </section>
            );
          }
        })}
      <ArchiveSkeleton ref={ref} hasMore={hasMore} />
    </div>
  );
}
