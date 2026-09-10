"use client";

import { onBoardUser } from "@/actions/onboard";
import { SUGGESTED_TOPICS, topicColors } from "@/constants/constants";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { MouseEvent, useCallback, useState } from "react";
import { Fragment } from "react/jsx-runtime";
import { toast } from "sonner";

type TopicChooserProps = {
  selectedIndices: [number, number, number];
};

export function TopicChooser({ selectedIndices }: TopicChooserProps) {
  const [selectedIndexes, setSelectedIndexes] = useState([...selectedIndices]);

  const navigate = useRouter();

  const logicHandler = useCallback(
    (size: number, currentSet: Set<number>, topicIdx: number) => {
      switch (size) {
        case 3: {
          if (currentSet.has(topicIdx)) {
            return {
              newIndexes: [...currentSet],
              message: "Minimum 3 topics must be selected",
            };
          }

          const tempSet = currentSet.add(topicIdx);
          return {
            newIndexes: [...tempSet],
          };
        }
        case 4: {
          if (currentSet.has(topicIdx)) {
            currentSet.delete(topicIdx);

            return {
              newIndexes: [...currentSet],
            };
          }

          const tempSet = currentSet.add(topicIdx);

          return {
            newIndexes: [...tempSet],
          };
        }

        case 5: {
          if (currentSet.has(topicIdx)) {
            currentSet.delete(topicIdx);

            return {
              newIndexes: [...currentSet],
            };
          }

          return {
            newIndexes: [...currentSet],
            message: "Maximum 5 topics must be selected",
          };
        }

        default:
          break;
      }
    },
    [setSelectedIndexes],
  );

  const onTopicClick = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();

      const topic = e.currentTarget.getAttribute("data-topic")!;
      const topicIdx = SUGGESTED_TOPICS.findIndex((t) => t.name === topic);
      const currSelected = new Set(selectedIndexes);

      const { newIndexes, message } = logicHandler(
        currSelected.size,
        currSelected,
        topicIdx,
      )!;

      setSelectedIndexes(() => [...newIndexes]);

      if (message) {
        toast(message);
      }
    },
    [setSelectedIndexes, selectedIndices, logicHandler],
  );

  return (
    <Fragment>
      {/* Topic chips */}
      <div className="flex flex-wrap gap-3">
        {SUGGESTED_TOPICS.map((topic, index) => {
          const isSelected = selectedIndexes.includes(index);
          const colorClasses = topicColors[index % topicColors.length];

          return (
            <button
              key={topic.name}
              data-topic={topic.name}
              type="button"
              onClick={onTopicClick}
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors border ${
                isSelected
                  ? "border-[#755815] dark:border-[#D9A441]"
                  : "border-transparent"
              } ${colorClasses} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#755815] dark:focus-visible:ring-[#D9A441] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FBF6EE] dark:focus-visible:ring-offset-[#14110E]`}
            >
              {isSelected && (
                <Check className="size-3.5 shrink-0" aria-hidden="true" />
              )}
              {topic.name}
            </button>
          );
        })}
      </div>

      {/* Footer bar */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between border-t border-[#DCD2C2] dark:border-[#332C24] pt-6">
          <span className="text-sm text-[#6E645A] dark:text-[#A69A8B]">
            3 of 5 selected
          </span>
          <button
            type="button"
            disabled={false}
            onClick={async (e) => {
              e.stopPropagation();
              e.preventDefault();

              const fullTopics = SUGGESTED_TOPICS.filter((_t, i) =>
                selectedIndexes.includes(i),
              ).map(({ name, sources }) => ({
                name,
                sources,
              }));

              const onBoardedResult = await onBoardUser(fullTopics);

              if (onBoardedResult && onBoardedResult.success) {
                toast(onBoardedResult.message);

                revalidatePath("/");
                navigate.push("/");
              }
            }}
            className="rounded-full px-6 py-2.5 text-sm font-medium bg-[#755815] text-[#FBF6EE] hover:bg-[#5F4711] dark:bg-[#D9A441] dark:text-[#14110E] dark:hover:bg-[#C4932F] transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#755815] dark:focus-visible:ring-[#D9A441] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FBF6EE] dark:focus-visible:ring-offset-[#14110E]"
          >
            Start my briefing
          </button>
        </div>
        <p className="text-center text-xs text-[#A69A8B] dark:text-[#6E645A]">
          You can change these any time from settings.
        </p>
      </div>
    </Fragment>
  );
}
