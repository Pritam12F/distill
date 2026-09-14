export type LandingSampleType = {
  error?: string;
  data?: {
    articles: SampleArticleType[];
    conflict: string;
    headline: string;
    summaryPoints: string[];
    topic: string;
  };
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
