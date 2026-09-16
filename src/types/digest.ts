import { DigestArticle } from "@prisma/client";

export type DigestCardProps = {
  id: string;
  topic: string;
  headline: string;
  sourceCount: number;
  hasConflict?: string | null;
  date: string; // "Jun 10" or "Today"
  isUnread?: boolean;
  accentIndex: number; // 0-4, picks the topic chip color
};

export type SampleArticleType = {
  source: string;
  initials: string;
  title: string;
  time: string;
};

export type SampleOtherDataType = {
  conflict: string;
  headline: string;
  summaryPoints: string[];
  topic: string;
};

export type LandingSampleType = {
  error?: string;
  data?: SampleOtherDataType & {
    articles: SampleArticleType[];
  };
};

export type DailySummaryResult = {
  error?: string;
  data?: SampleOtherDataType & {
    articles: Pick<DigestArticle, "url" | "publishedAt" | "title">[];
  };
};
