export type Article = {
  id: string;
  title: string;
  url: string;
  oneLine?: string;
  publishedAt?: string | Date | null;
};

export type EmailDigest = {
  topic: string;
  topicId: string;
  headline: string;
  consensus: string;
  conflict: string | null;
  signal: string;
  articles: Article[];
};

export type EmailProps = {
  userName: string;
  date: string;
  emailTitle: string;
  digests: EmailDigest[];
  baseUrl: string;
  unsubscribeUrl: string;
};

export type SendEmail = EmailProps & {
  userEmail: string;
};
