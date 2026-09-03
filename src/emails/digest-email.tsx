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
  oneLine?: string;
  publishedAt?: string | Date | null;
};

type Digest = {
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
  digests: Digest[];
  baseUrl: string;
  unsubscribeUrl: string;
};

const chipColors = [
  { backgroundColor: "#eee8ff", color: "#6046b8" },
  { backgroundColor: "#e5f5ed", color: "#26734d" },
  { backgroundColor: "#fff2d7", color: "#94651c" },
  { backgroundColor: "#ffe9e3", color: "#a44d38" },
  { backgroundColor: "#e4f0fb", color: "#32658f" },
];

function formatDate(value: string | Date | null) {
  if (!value) return null;
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(d);
}

export function DigestEmail({
  userName,
  date,
  emailTitle,
  digests,
  baseUrl,
  unsubscribeUrl,
}: EmailProps) {
  const plural = digests.length === 1 ? "" : "s";

  return (
    <Html>
      <Head />
      <Preview>{`${emailTitle} — ${digests.length} topic${plural} distilled for you.`}</Preview>
      <Body style={s.body}>
        <Container style={s.container}>
          <Section style={s.header}>
            <Text style={s.wordmark}>DISTILL</Text>
            <Text style={s.eyebrow}>YOUR DAILY BRIEFING</Text>
            <Text style={s.title}>{emailTitle}</Text>
            <Text style={s.meta}>
              {date} · {digests.length} topic{plural}
            </Text>
            <Text style={s.greeting}>Good morning, {userName}.</Text>
          </Section>

          {digests.length === 0 ? (
            <Section style={s.empty}>
              <Text style={s.emptyTitle}>A quiet day in the news.</Text>
              <Text style={s.paragraph}>
                No digests are ready yet. Check back soon for your next briefing.
              </Text>
            </Section>
          ) : (
            digests.map((digest, i) => (
              <Section key={digest.topicId} style={s.digest}>
                <Text style={{ ...s.chip, ...chipColors[i % chipColors.length] }}>
                  {digest.topic}
                </Text>

                <Text style={s.headline}>{digest.headline}</Text>
                <Text style={s.paragraph}>{digest.consensus}</Text>

                {digest.conflict ? (
                  <Section style={s.conflictPanel}>
                    <Text style={s.conflictLabel}>WHERE IT&apos;S UNCLEAR</Text>
                    <Text style={s.panelText}>{digest.conflict}</Text>
                  </Section>
                ) : null}

                <Section style={s.signalPanel}>
                  <Text style={s.signalLabel}>THE SIGNAL</Text>
                  <Text style={s.panelText}>{digest.signal}</Text>
                </Section>

                <Text style={s.sourcesLabel}>SOURCES</Text>
                {digest.articles.map((article) => {
                  const published = formatDate(article.publishedAt?? new Date());
                  return (
                    <Section key={article.id} style={s.article}>
                      <Link href={article.url} style={s.articleTitle}>
                        {article.title}
                      </Link>
                      <Text style={s.articleSummary}>
                        {article.oneLine}
                        {published ? <span style={s.published}> · {published}</span> : null}
                      </Text>
                    </Section>
                  );
                })}

                <Link href={`${baseUrl}/digest/${digest.topicId}`} style={s.readLink}>
                  Read full digest →
                </Link>

                {i < digests.length - 1 ? <Hr style={s.divider} /> : null}
              </Section>
            ))
          )}

          <Section style={s.footer}>
            <Text style={s.footerLinks}>
              <Link href={`${baseUrl}/settings`} style={s.footerLink}>
                Manage topics
              </Link>
              {" · "}
              <Link href={unsubscribeUrl} style={s.footerLink}>
                Unsubscribe
              </Link>
            </Text>
            <Text style={s.copyright}>
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
  date: "Tuesday, 16 September 2025",
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
          oneLine: "New projects are changing how renewables reach the evening peak.",
          publishedAt: "2025-09-14",
        },
      ],
    },
  ],
} satisfies EmailProps;

const s = {
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
    fontFamily: "Georgia, Times New Roman, serif",
    fontSize: "34px",
    fontWeight: "400",
    letterSpacing: "-0.7px",
    lineHeight: "1.12",
    margin: "0 0 13px",
  },
  meta: { color: "#68717d", fontSize: "13px", margin: 0 },
  greeting: { color: "#68717d", fontSize: "14px", margin: "25px 0 0" },
  digest: { padding: "34px 0 0" },
  chip: {
    borderRadius: "4px",
    display: "inline-block",
    fontSize: "11px",
    fontWeight: "700",
    letterSpacing: "0.4px",
    margin: "0 0 15px",
    padding: "6px 9px",
  },
  headline: {
    fontFamily: "Georgia, Times New Roman, serif",
    fontSize: "24px",
    fontWeight: "400",
    lineHeight: "1.22",
    margin: "0 0 14px",
  },
  paragraph: { color: "#454d57", fontSize: "15px", lineHeight: "1.65", margin: 0 },
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
  conflictLabel: {
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
  panelText: { color: "#4b463b", fontSize: "14px", lineHeight: "1.55", margin: 0 },
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
  articleSummary: { color: "#77808b", fontSize: "13px", lineHeight: "1.5", margin: "4px 0 0" },
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
  empty: { padding: "48px 0 62px" },
  emptyTitle: {
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
  copyright: { color: "#a0a6ad", fontSize: "11px", margin: 0 },
};

export default DigestEmail;