"use client";

import { createTopic, deleteTopic } from "@/actions/handle-topic";
import { SUGGESTED_TOPICS } from "@/constants/constants";
import { useDebounce } from "@/hooks/use-debounce";
import { Topic } from "@prisma/client";
import { Plus, X } from "lucide-react";
import {
  Fragment,
  startTransition,
  useCallback,
  useMemo,
  useOptimistic,
} from "react";
import { SectionLabel } from "./section-label";

const CHIP_COLORS = [
  "bg-[#F0E8DA] text-[#755815] dark:bg-[#221D17] dark:text-[#D9A441]",
  "bg-[#F7E9D0] text-[#8A5A18] dark:bg-[#2A2318] dark:text-[#E0B063]",
  "bg-[#F5E3DA] text-[#8A4F35] dark:bg-[#2A1F1A] dark:text-[#D99878]",
  "bg-[#E8EDDE] text-[#5A6B3D] dark:bg-[#1F2419] dark:text-[#A8BC8A]",
  "bg-[#E2E9EC] text-[#46626E] dark:bg-[#1A2226] dark:text-[#8FB3C0]",
];

type TopicChooserProps = {
  topics: Topic[];
};

export function TopicChooser({ topics }: TopicChooserProps) {
  const [selectedTopics, setSelectedTopics] = useOptimistic<Topic[]>([
    ...topics,
  ]);
  const [expandedOpen, setExpandedOpen] = useOptimistic(false);

  const availableTopics = useMemo(() => {
    if (!selectedTopics.length) {
      return [];
    }

    const filtered = [];

    for (let i = 0; i < SUGGESTED_TOPICS.length; i++) {
      for (let j = i; j < selectedTopics.length; j++) {
        if (SUGGESTED_TOPICS[i].name !== selectedTopics[j].name) {
          const topicObj = {
            name: SUGGESTED_TOPICS[i].name,
            sources: SUGGESTED_TOPICS[i].sources
              .filter((s) => s.type === "rss")
              .map((a) => a.value),
          };

          filtered.push(topicObj);
        }
      }
    }

    return filtered;
  }, [selectedTopics]);

  const debouncedHandler = useCallback(
    async (operation: "add" | "delete", topic: Partial<Topic>) => {
      startTransition(async () => {
        if (operation === "add") {
          const currentTopics = selectedTopics;
          setSelectedTopics([...currentTopics, topic as Topic]);

          await createTopic({
            name: topic.name!,
            sources: topic.sources!,
          });
        } else if (operation === "delete") {
          const currentTopics = selectedTopics;
          currentTopics.splice(
            selectedTopics.findIndex((s) => s.id === topic.id),
          );
          setSelectedTopics((s) => currentTopics);

          await deleteTopic({
            id: topic.id!,
          });
        }
      });
    },
    [selectedTopics],
  );

  const debouncedCallback = useDebounce(debouncedHandler, 2500);

  return (
    <section className="flex flex-col gap-4">
      <SectionLabel>Topics</SectionLabel>

      <p className="text-sm text-[#6E645A] dark:text-[#A69A8B]">
        {selectedTopics.length} of 5 topics
      </p>

      <ul className="flex flex-col">
        {selectedTopics.map((topic, i) => (
          <li
            key={topic.id}
            className="flex items-center justify-between gap-4 border-b border-[#DCD2C2] py-3 first:border-t dark:border-[#332C24]"
          >
            <span
              className={`rounded-full px-3 py-1 text-sm font-medium ${CHIP_COLORS[i % CHIP_COLORS.length]}`}
            >
              {topic.name}
            </span>
            <button
              type="button"
              aria-label={`Remove ${topic}`}
              onClick={() => {
                if (selectedTopics.length <= 2) return;

                debouncedCallback("delete", topic);
              }}
              className="flex size-8 items-center justify-center rounded-full text-[#6E645A] transition-colors hover:bg-[#F0E8DA] hover:text-[#1A1714] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#755815] dark:text-[#A69A8B] dark:hover:bg-[#221D17] dark:hover:text-[#F3EDE3] dark:focus-visible:ring-[#D9A441]"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={() => {
          const topicLength = selectedTopics.length;

          if (topicLength === 5) {
            setExpandedOpen((s) => false);
            return;
          }

          if (topicLength < 5) {
            setExpandedOpen((s) => true);
            return;
          }

          setExpandedOpen((s) => false);
        }}
        className="inline-flex w-fit items-center gap-2 rounded-full border border-[#DCD2C2] px-4 py-2 text-sm font-medium text-[#1A1714] transition-colors hover:border-[#755815] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#755815] dark:border-[#332C24] dark:text-[#F3EDE3] dark:hover:border-[#D9A441] dark:focus-visible:ring-[#D9A441]"
      >
        <Plus className="size-4" aria-hidden="true" />
        {expandedOpen ? "Close" : "Add topics"}
      </button>

      {/* Expanded add-topic view */}
      {expandedOpen && (
        <Fragment>
          <p className="text-sm text-[#6E645A] dark:text-[#A69A8B]">
            Pick up to {selectedTopics.length - 5} more
          </p>
          <div className="flex flex-wrap gap-2">
            {availableTopics.map((topic, i) => (
              <button
                key={`${topic}-${i}`}
                type="button"
                onClick={() => {
                  debouncedCallback("add", topic);
                }}
                className={`rounded-full border border-transparent px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#755815] dark:focus-visible:ring-[#D9A441] ${CHIP_COLORS[(i + 3) % CHIP_COLORS.length]}`}
              >
                {topic.name}
              </button>
            ))}
          </div>
        </Fragment>
      )}
    </section>
  );
}
