"use client";

import { SectionLabel } from "@/app/(main)/settings/page";
import { SUGGESTED_TOPICS } from "@/constants/constants";
import { Topic } from "@prisma/client";
import { Plus, X } from "lucide-react";
import { useState } from "react";

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
  const [selectedTopics, setSelectedTopics] = useState<Topic[]>([...topics]);

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
                setSelectedTopics((s) => {
                  const current = s;

                  return current.splice(
                    current.findIndex((c) => c.id === topic.id),
                  );
                });
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
        className="inline-flex w-fit items-center gap-2 rounded-full border border-[#DCD2C2] px-4 py-2 text-sm font-medium text-[#1A1714] transition-colors hover:border-[#755815] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#755815] dark:border-[#332C24] dark:text-[#F3EDE3] dark:hover:border-[#D9A441] dark:focus-visible:ring-[#D9A441]"
      >
        <Plus className="size-4" aria-hidden="true" />
        Add topic
      </button>

      {/* Expanded add-topic view */}
      <div className="mt-2 flex flex-col gap-3 rounded-2xl border border-[#DCD2C2] p-4 dark:border-[#332C24]">
        <p className="text-sm text-[#6E645A] dark:text-[#A69A8B]">
          Pick up to 2 more
        </p>
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_TOPICS.map((topic, i) => (
            <button
              key={`${topic.name}${1 + i}`}
              type="button"
              className={`rounded-full border border-transparent px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#755815] dark:focus-visible:ring-[#D9A441] ${CHIP_COLORS[(i + 3) % CHIP_COLORS.length]}`}
            >
              {topic.name}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
