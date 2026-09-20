"use client";

import { useCallback, useRef } from "react";

export function useDebounce<T extends (...args: any[]) => Promise<void>>(
  callback: T,
  delay = 2500,
) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(async () => {
        await callback(...args);
      }, delay);
    },
    [delay, callback],
  );

  return debouncedCallback;
}
