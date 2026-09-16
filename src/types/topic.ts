export type SourceType = "rss" | "newsapi";

export type Source = {
  type: SourceType;
  value: string;
};

export type SuggestedTopic = {
  name: string;
  sources: Source[];
};
