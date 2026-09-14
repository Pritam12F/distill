"use client";

import { LandingSampleContext } from "@/context/landing-samples";
import { useContext } from "react";

export function useLanding() {
  const context = useContext(LandingSampleContext);

  if (context === undefined) {
    throw new Error(
      "useLanding should be use within <LandingSampleContextProvider/>",
    );
  }

  return {
    error: context.error,
    conflict: context.data?.conflict,
    summaryPoints: context.data?.summaryPoints,
    headline: context.data?.headline,
    articles: context.data?.articles,
    topic: context.data?.topic,
  };
}
