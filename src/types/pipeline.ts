export type ArticleType = {
  id: string;
  title?: string | null;
  topic?: string;
  url?: string;
  article: string;
  siteName?: string | null;
  length: number;
  publishedAt?: Date | string | null;
  keywordRelevancy?: number;
  contentRelevancy?: number;
};

export type NewsSourceType = {
  title?: string;
  url: string;
  publishedAt?: Date | string;
  source?: string;
  topic?: string;
};

export type ArticleWithTopic = {
  topic: string;
  articles: ArticleType[];
};

export type TopicsType = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  name: string;
  sources: string[];
};

export type PipelineMessageType = {
  success: boolean;
  message: string;
};

export type DigestRepoType = {
  digestCount: number;
  articleCount: number;
  digests: {
    id: string;
    headline: string;
    topicId: string;
    articles: {
      id: string;
      title: string;
      url: string;
    }[];
  }[];
};

export type CoreSuccessType = {
  success: boolean;
  message: string;
  digestCount: number;
  articleCount: number;
  digests: {
    topic: string;
    articles: {
      title: string;
      id: string;
      url: string;
    }[];
    id: string;
    createdAt: Date;
    headline: string;
    consensus: string;
    conflict: string | null;
    signal: string;
    topicId: string;
    hasRead: boolean | null;
  }[];
};

export type PiplelineFinalOutput =
  | PipelineMessageType
  | (PipelineMessageType & DigestRepoType)[];
