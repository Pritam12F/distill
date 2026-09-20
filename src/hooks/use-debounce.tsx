"use client";

import { useEffect } from "react";

export function useDebounce<T>(callback: (input: T) => any, params: T) {
  useEffect(() => {
    const id = setTimeout(() => {
      callback(params);
    }, 2000);

    return () => {
      clearTimeout(id);
    };
  }, [callback]);
}
