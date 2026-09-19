"use client";

import {
  AllDigestsPerTopicType,
  getAllDigests,
} from "@/actions/get-all-digests";
import { ArchiveSkeleton } from "./loading";
import { useEffect, useRef, useState } from "react";
import useIsVisible from "@/hooks/use-is-visible";
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
  const { ref, inView } = useInView({
    /* Optional options */
    threshold: 0,
  });

  //   const fetchPaginatedData = useCallback(async () => {
  //     setIsLoading(true);
  //     if (pageNum < 1) return;

  //     if (success && groups?.length) {
  //       console.log(JSON.stringify(groups.map((g) => g.digests)));
  //       setLoadedGroups((prev) => [...prev, ...groups]);
  //     }
  //     setIsLoading(false);
  //   }, [setLoadedGroups, setIsLoading, pageNum]);

  useEffect(() => {
    if (inView) {
      console.log("In view");
      async function setter() {
        try {
          const nextPage = pageNum + 1;

          const { groups, success } = await getAllDigests(nextPage);

          if (success && groups && groups.length) {
            console.log(groups);
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
      <ArchiveSkeleton ref={ref} />
    </div>
  );
}
