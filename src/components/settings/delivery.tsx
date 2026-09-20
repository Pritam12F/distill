"use client";

import { ChevronRight } from "lucide-react";
import { SectionLabel } from "./section-label";
import { changeBriefing } from "@/actions/change-briefing";
import { startTransition, useCallback, useOptimistic } from "react";
import { toast } from "sonner";

export function DeliverySettings() {
  const [deliveryState, setDeliveryState] = useOptimistic<{
    paused?: boolean | null;
  }>({});

  const handleBriefingChange = useCallback(() => {
    startTransition(async () => {
      const nextState = !deliveryState.paused;
      setDeliveryState({ paused: nextState });

      const { success } = await changeBriefing(nextState);

      if (success) {
        toast(`Briefing was ${nextState ? "resumed" : "paused"}`);
      }
    });
  }, [deliveryState]);

  return (
    <section className="flex flex-col gap-4">
      <SectionLabel>Delivery</SectionLabel>

      <div className="flex flex-col">
        <button
          type="button"
          className="flex items-center justify-between gap-4 border-b border-[#DCD2C2] py-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#755815] dark:border-[#332C24] dark:focus-visible:ring-[#D9A441]"
        >
          <span className="text-sm text-[#1A1714] dark:text-[#F3EDE3]">
            Time
          </span>
          <span className="flex items-center gap-1 text-sm text-[#6E645A] dark:text-[#A69A8B]">
            7:00 AM
            <ChevronRight className="size-4" aria-hidden="true" />
          </span>
        </button>

        <button
          type="button"
          className="flex items-center justify-between gap-4 border-b border-[#DCD2C2] py-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#755815] dark:border-[#332C24] dark:focus-visible:ring-[#D9A441]"
        >
          <span className="text-sm text-[#1A1714] dark:text-[#F3EDE3]">
            Timezone
          </span>
          <span className="flex items-center gap-1 text-sm text-[#6E645A] dark:text-[#A69A8B]">
            Asia/Kolkata
            <ChevronRight className="size-4" aria-hidden="true" />
          </span>
        </button>
      </div>

      <div className="flex items-center justify-between gap-4 pt-1">
        <span
          onClick={handleBriefingChange}
          className="text-sm text-[#1A1714] dark:text-[#F3EDE3]"
        >
          Pause briefings
        </span>
        <button
          type="button"
          role="switch"
          aria-checked="false"
          className="relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border border-[#DCD2C2] bg-[#F0E8DA] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#755815] dark:border-[#332C24] dark:bg-[#221D17] dark:focus-visible:ring-[#D9A441]"
        >
          <span className="ml-0.5 size-5 rounded-full bg-[#FBF6EE] transition-transform dark:bg-[#A69A8B]" />
        </button>
      </div>
      <p className="-mt-2 text-sm text-[#A69A8B] dark:text-[#6E645A]">
        Stop receiving emails without losing your topics.
      </p>
    </section>
  );
}
