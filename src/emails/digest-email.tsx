import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "react-email";

export type Article = {
  id: string;
  title: string;
  url: string;
  oneLine: string;
  publishedAt: string | Date | null;
};

export type Digest = {
  topic: string;
  topicId: string;
  headline: string;
  consensus: string;
  conflict: string | null;
  signal: string;
  articles: Article[];
};

export type DigestEmailProps = {
  userName: string;
  date: string;
  emailTitle: string;
  digests: Digest[];
  baseUrl: string;
  unsubscribeUrl: string;
};

const topicColors = [
  { background: "#eee8ff", color: "#6046b8" },
  { background: "#e5f5ed", color: "#26734d" },
  { background: "#fff2d7", color: "#94651c" },
  { background: "#ffe9e3", color: "#a44d38" },
  { background: "#e4f0fb", color: "#32658f" },
];

function formatPublishedAt(value: string | Date | null) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
  }).format(date);
}

export function DigestEmail({
  userName,
  date,
  emailTitle,
  digests,
  baseUrl,
  unsubscribeUrl,
}: DigestEmailProps) {
  const preview = `${emailTitle} — ${digests.length} topic${digests.length === 1 ? "" : "s"} distilled for you.`;

  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Section style={styles.header}>
            <Text style={styles.wordmark}>DISTILL</Text>
            <Text style={styles.eyebrow}>YOUR DAILY BRIEFING</Text>
            <Text style={styles.title}>{emailTitle}</Text>
            <Text style={styles.meta}>
              {date} <span style={styles.metaDot}>·</span> {digests.length}{" "}
              topic{digests.length === 1 ? "" : "s"}
            </Text>
            <Text style={styles.greeting}>Good morning, {userName}.</Text>
          </Section>

          {digests.length === 0 ? (
            <Section style={styles.emptyState}>
              <Text style={styles.emptyTitle}>A quiet day in the news.</Text>
              <Text style={styles.paragraph}>
                There are no topic digests ready yet. Check back soon for your
                next briefing.
              </Text>
            </Section>
          ) : (
            digests.map((digest, index) => {
              const topicColor = topicColors[index % topicColors.length];
              return (
                <Section key={digest.topicId} style={styles.digest}>
                  <Text
                    style={{
                      ...styles.topicChip,
                      backgroundColor: topicColor.background,
                      color: topicColor.color,
                    }}
                  >
                    {digest.topic}
                  </Text>
                  <Text style={styles.headline}>{digest.headline}</Text>
                  <Text style={styles.paragraph}>{digest.consensus}</Text>

                  {digest.conflict ? (
                    <Section style={styles.conflictPanel}>
                      <Text style={styles.panelLabel}>
                        WHERE IT&apos;S UNCLEAR
                      </Text>
                      <Text style={styles.panelText}>{digest.conflict}</Text>
                    </Section>
                  ) : null}

                  <Section style={styles.signalPanel}>
                    <Text style={styles.signalLabel}>THE SIGNAL</Text>
                    <Text style={styles.panelText}>{digest.signal}</Text>
                  </Section>

                  <Text style={styles.sourcesLabel}>SOURCES</Text>
                  {digest.articles.map((article) => {
                    const published = formatPublishedAt(article.publishedAt);
                    return (
                      <Section key={article.id} style={styles.article}>
                        <Link href={article.url} style={styles.articleTitle}>
                          {article.title}
                        </Link>
                        <Text style={styles.articleSummary}>
                          {article.oneLine}
                          {published ? (
                            <span style={styles.published}> · {published}</span>
                          ) : null}
                        </Text>
                      </Section>
                    );
                  })}

                  <Link
                    href={`${baseUrl}/digest/${digest.topicId}`}
                    style={styles.readLink}
                  >
                    Read full digest <span aria-hidden="true">→</span>
                  </Link>
                  {index < digests.length - 1 ? (
                    <Hr style={styles.divider} />
                  ) : null}
                </Section>
              );
            })
          )}

          <Section style={styles.footer}>
            <Text style={styles.footerLinks}>
              <Link
                href={`${baseUrl}/settings/topics`}
                style={styles.footerLink}
              >
                Manage topics
              </Link>
              <span style={styles.footerDot}> · </span>
              <Link href={unsubscribeUrl} style={styles.footerLink}>
                Unsubscribe
              </Link>
            </Text>
            <Text style={styles.copyright}>
              © {new Date().getFullYear()} Distill. News, clarified.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

DigestEmail.PreviewProps = {
  userName: "Maya",
  date: "Tuesday, September 16, 2025",
  emailTitle: "The morning, distilled.",
  baseUrl: "https://distill.news",
  unsubscribeUrl: "https://distill.news/unsubscribe",
  digests: [
    {
      topic: "AI & Technology",
      topicId: "ai-technology",
      headline: "AI agents are moving from demos into the daily workflow.",
      consensus:
        "The latest releases focus less on spectacle and more on dependable, repeatable work across the tools people already use.",
      conflict:
        "Benchmarks remain inconsistent: early adopters report big gains, while independent tests show results vary by task and setup.",
      signal:
        "The durable story is integration. The winners will be the products that make delegation feel ordinary, not magical.",
      articles: [
        {
          id: "1",
          title: "The new shape of AI work",
          url: "https://example.com/ai-work",
          oneLine: "Why utility is becoming the defining product feature.",
          publishedAt: "2025-09-16",
        },
        {
          id: "2",
          title: "Inside the agent platform race",
          url: "https://example.com/agents",
          oneLine: "Platforms are competing on reliability and reach.",
          publishedAt: "2025-09-15",
        },
        {
          id: "3",
          title: "A practical guide to delegation",
          url: "https://example.com/delegation",
          oneLine: "The small workflows worth handing off first.",
          publishedAt: null,
        },
      ],
    },
    {
      topic: "Climate",
      topicId: "climate",
      headline: "Clean energy is scaling, but the grid is the bottleneck.",
      consensus:
        "Investment and deployment are accelerating across solar, storage, and transmission projects worldwide.",
      conflict: null,
      signal:
        "Watch permitting and grid interconnection queues: that is where the next decade of progress will be won or delayed.",
      articles: [
        {
          id: "4",
          title: "The grid upgrade nobody can skip",
          url: "https://example.com/grid",
          oneLine: "Transmission is now the climate infrastructure story.",
          publishedAt: "2025-09-16",
        },
        {
          id: "5",
          title: "Storage gets more practical",
          url: "https://example.com/storage",
          oneLine:
            "New projects are changing how renewables reach the evening peak.",
          publishedAt: "2025-09-14",
        },
      ],
    },
    {
      topic: "Markets",
      topicId: "markets",
      headline: "Investors are pricing patience back into the economy.",
      consensus:
        "The mood has shifted from chasing every growth story to rewarding durable cash flow and clear execution.",
      conflict:
        "A resilient consumer is offsetting softer manufacturing data, leaving the path for rates unusually debated.",
      signal:
        "Quality is regaining its premium. Companies with pricing power and a real operating advantage are separating from the pack.",
      articles: [
        {
          id: "6",
          title: "The return of fundamentals",
          url: "https://example.com/fundamentals",
          oneLine: "Markets are asking harder questions of high-growth names.",
          publishedAt: "2025-09-16",
        },
        {
          id: "7",
          title: "Why rates still matter",
          url: "https://example.com/rates",
          oneLine:
            "The next move depends on a consumer that is cooling, not cracking.",
          publishedAt: "2025-09-15",
        },
        {
          id: "8",
          title: "A calmer kind of volatility",
          url: "https://example.com/volatility",
          oneLine:
            "Portfolio managers are preparing for a wider range of outcomes.",
          publishedAt: "2025-09-13",
        },
      ],
    },
  ],
} satisfies DigestEmailProps;

const styles = {
  body: {
    backgroundColor: "#f6f7f9",
    color: "#20242b",
    fontFamily: "Arial, Helvetica, sans-serif",
    margin: 0,
    padding: "32px 12px",
  },
  container: {
    backgroundColor: "#ffffff",
    margin: "0 auto",
    maxWidth: "600px",
    padding: "0 40px",
  },
  header: { padding: "42px 0 28px", borderBottom: "1px solid #e5e7eb" },
  wordmark: {
    color: "#20242b",
    fontSize: "13px",
    fontWeight: "700",
    letterSpacing: "3px",
    margin: "0 0 34px",
  },
  eyebrow: {
    color: "#89919b",
    fontSize: "10px",
    fontWeight: "700",
    letterSpacing: "1.6px",
    margin: "0 0 10px",
  },
  title: {
    color: "#20242b",
    fontFamily: "Georgia, Times New Roman, serif",
    fontSize: "34px",
    fontWeight: "400",
    letterSpacing: "-0.7px",
    lineHeight: "1.12",
    margin: "0 0 13px",
  },
  meta: { color: "#68717d", fontSize: "13px", margin: 0 },
  metaDot: { color: "#c0c5ca", padding: "0 6px" },
  greeting: {
    color: "#68717d",
    fontSize: "14px",
    lineHeight: "1.5",
    margin: "25px 0 0",
  },
  digest: { padding: "34px 0 0" },
  topicChip: {
    borderRadius: "4px",
    display: "inline-block",
    fontSize: "11px",
    fontWeight: "700",
    letterSpacing: "0.4px",
    margin: "0 0 15px",
    padding: "6px 9px",
  },
  headline: {
    color: "#20242b",
    fontFamily: "Georgia, Times New Roman, serif",
    fontSize: "24px",
    fontWeight: "400",
    lineHeight: "1.22",
    margin: "0 0 14px",
  },
  paragraph: {
    color: "#454d57",
    fontSize: "15px",
    lineHeight: "1.65",
    margin: "0",
  },
  conflictPanel: {
    backgroundColor: "#fff7e8",
    borderRadius: "5px",
    margin: "22px 0 12px",
    padding: "15px 17px",
  },
  signalPanel: {
    backgroundColor: "#edf8f1",
    borderRadius: "5px",
    margin: "22px 0 12px",
    padding: "15px 17px",
  },
  panelLabel: {
    color: "#a47320",
    fontSize: "10px",
    fontWeight: "700",
    letterSpacing: "1.3px",
    margin: "0 0 7px",
  },
  signalLabel: {
    color: "#347a51",
    fontSize: "10px",
    fontWeight: "700",
    letterSpacing: "1.3px",
    margin: "0 0 7px",
  },
  panelText: {
    color: "#4b463b",
    fontSize: "14px",
    lineHeight: "1.55",
    margin: 0,
  },
  sourcesLabel: {
    color: "#89919b",
    fontSize: "10px",
    fontWeight: "700",
    letterSpacing: "1.4px",
    margin: "28px 0 14px",
  },
  article: {
    borderBottom: "1px solid #eef0f2",
    padding: "0 0 13px",
    margin: "0 0 13px",
  },
  articleTitle: {
    color: "#2f5f91",
    display: "block",
    fontSize: "14px",
    fontWeight: "700",
    lineHeight: "1.4",
    textDecoration: "none",
  },
  articleSummary: {
    color: "#77808b",
    fontSize: "13px",
    lineHeight: "1.5",
    margin: "4px 0 0",
  },
  published: { color: "#a5abb2" },
  readLink: {
    color: "#2f5f91",
    display: "inline-block",
    fontSize: "14px",
    fontWeight: "700",
    margin: "4px 0 0",
    textDecoration: "none",
  },
  divider: { borderColor: "#e5e7eb", margin: "36px 0 0" },
  emptyState: { padding: "48px 0 62px" },
  emptyTitle: {
    color: "#20242b",
    fontFamily: "Georgia, Times New Roman, serif",
    fontSize: "22px",
    margin: "0 0 10px",
  },
  footer: {
    borderTop: "1px solid #e5e7eb",
    padding: "28px 0 40px",
    textAlign: "center" as const,
  },
  footerLinks: { fontSize: "12px", margin: "0 0 12px" },
  footerLink: { color: "#68717d", textDecoration: "underline" },
  footerDot: { color: "#b3b8bd" },
  copyright: { color: "#a0a6ad", fontSize: "11px", margin: 0 },
};

export default DigestEmail;
