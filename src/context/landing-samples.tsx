"use client";

import { getDailySummary } from "@/actions/daily-summary";
import {
  DailySummaryResult,
  SampleArticleType,
  SampleOtherDataType,
} from "@/types/digest";
import { errorDecoder } from "@/utils/error-decoder";
import { createContext, useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export const LandingSampleContext = createContext<
  (DailySummaryResult & { error?: string }) | undefined
>(undefined);

export const LandingContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [articles, setArticles] = useState<SampleArticleType[]>([]);
  const [error, setError] = useState("");
  const [data, setData] = useState<SampleOtherDataType>();

  const fetchSampleSummary = useCallback(async () => {
    const { error, data } = await getDailySummary();

    if (error) {
      const errMsg = errorDecoder(error);
      setError(errMsg);
      toast.error(errMsg, { duration: 1000 });
      return;
    }

    if (data && data.articles.length > 0) {
      const articles = data.articles;

      const otherData = {
        conflict: data.conflict,
        headline: data.headline,
        summaryPoints: data.summaryPoints,
        topic: data.topic,
      };

      setData((s) => {
        if (!s) {
          return otherData;
        }

        return {
          ...s,
          ...otherData,
        };
      });
      setArticles(() => [...articles]);
    }
  }, [setArticles, setData, setError]);

  useEffect(() => {
    fetchSampleSummary();
  }, [setArticles, setData, setError, fetchSampleSummary]);

  return (
    <LandingSampleContext.Provider
      value={{
        error: error,
        data: {
          articles: articles,
          ...data!,
        },
      }}
    >
      {children}
    </LandingSampleContext.Provider>
  );
};
