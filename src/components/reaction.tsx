"use client";

import { updateReaction } from "@/actions/reaction";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { startTransition, useOptimistic } from "react";

export const ReactionsSection = ({
  sourceId,
  reaction,
  articleId,
}: {
  articleId: string;
  sourceId: string;
  reaction: "LIKE" | "DISLIKE" | null;
}) => {
  const [optimisticReaction, setOptimisticReaction] =
    useOptimistic<typeof reaction>(reaction);

  const onReactHandler = (reactType: "LIKE" | "DISLIKE") => {
    startTransition(async () => {
      const newReaction = reactType === optimisticReaction ? null : reactType;
      setOptimisticReaction(newReaction);

      const updated = await updateReaction({
        reaction: newReaction,
        articleId,
      });

      if (updated.success) console.log("reaction updated successfully");
    });
  };

  return (
    <div className="flex shrink-0 items-start gap-1">
      <button
        onClick={() => {
          onReactHandler("LIKE");
        }}
        id="likeBtn"
        aria-label={`Mark ${sourceId} as useful`}
        aria-pressed={optimisticReaction === "LIKE"}
        className="rounded-full p-1.5 text-[#A69A8B] transition-colors hover:bg-[#F0E8DA] hover:text-[#755815] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#755815] dark:text-[#6E645A] dark:hover:bg-[#221D17] dark:hover:text-[#D9A441] dark:focus-visible:outline-[#D9A441]"
      >
        <ThumbsUp
          className={`h-4 w-4 ${
            optimisticReaction === "LIKE"
              ? "fill-[#755815] text-[#755815] dark:fill-[#D9A441] dark:text-[#D9A441]"
              : ""
          }`}
        />
      </button>
      <button
        id="dislikeBtn"
        onClick={() => {
          onReactHandler("DISLIKE");
        }}
        aria-label={`Mark ${sourceId} as not useful`}
        aria-pressed={optimisticReaction === "DISLIKE"}
        className="rounded-full p-1.5 text-[#A69A8B] transition-colors hover:bg-[#F0E8DA] hover:text-[#755815] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#755815] dark:text-[#6E645A] dark:hover:bg-[#221D17] dark:hover:text-[#D9A441] dark:focus-visible:outline-[#D9A441]"
      >
        <ThumbsDown
          className={`h-4 w-4 ${
            optimisticReaction === "DISLIKE"
              ? "fill-[#755815] text-[#755815] dark:fill-[#D9A441] dark:text-[#D9A441]"
              : ""
          }`}
        />
      </button>
    </div>
  );
};
