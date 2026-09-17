import { DigestArticle } from "@prisma/client";

export type DigestCardProps = {
  id: string;
  topic: string;
  headline: string;
  sourceCount: number;
  hasConflict?: string | null;
  date: string; // "Jun 10" or "Today"
  hasRead: boolean | null;
  accentIndex: number; // 0-4, picks the topic chip color
};

export type SampleArticleType = Pick<
  DigestArticle,
  "publishedAt" | "title" | "id"
> & {
  initials?: string;
  source: string;
};

export type SampleOtherDataType = {
  conflict: string;
  headline: string;
  summaryPoints: string[];
  topic: string;
};

export type DailySummaryResult = {
  data?: SampleOtherDataType & {
    articles: SampleArticleType[];
  };
};

export type GetDigestsErrorType = {
  error: string;
};
