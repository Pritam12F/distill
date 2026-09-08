"use client";

import { DialogType, useDialogContextProvider } from "@/context/dialog-states";
import { Share2 } from "lucide-react";
import { useEffect } from "react";

export default function DigestFooter({ id, state }: DialogType) {
  const { states, stateChangeHandler } = useDialogContextProvider();

  useEffect(() => {
    if (!id || !state) {
      return;
    }

    stateChangeHandler({ id, state });
  }, [id, state]);

  return (
    <footer className="mt-12 flex items-center justify-between border-t border-[#DCD2C2] pt-6 dark:border-[#332C24]">
      <button
        onClick={() => {
          stateChangeHandler({ id, state: !states[id] });
        }}
        className="inline-flex items-center gap-2 rounded-full border border-[#DCD2C2] px-4 py-2 text-sm text-[#6E645A] transition-colors hover:border-[#755815] hover:text-[#755815] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#755815] dark:border-[#332C24] dark:text-[#A69A8B] dark:hover:border-[#D9A441] dark:hover:text-[#D9A441] dark:focus-visible:outline-[#D9A441]"
      >
        <Share2 className="h-4 w-4" />
        Share this digest
      </button>

      <span className="text-xs text-[#A69A8B] dark:text-[#6E645A]">
        Distill
      </span>
    </footer>
  );
}
