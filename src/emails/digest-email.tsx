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
import { EmailProps } from "@/types/email";
import { chipColors, s } from "./styles";

function formatDate(value: string | Date | null) {
  if (!value) return null;
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
  }).format(d);
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
                No digests are ready yet. Check back soon for your next
                briefing.
              </Text>
            </Section>
          ) : (
            digests.map((digest, i) => (
              <Section key={digest.topicId} style={s.digest}>
                <Text
                  style={{ ...s.chip, ...chipColors[i % chipColors.length] }}
                >
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
                  const published = formatDate(
                    article.publishedAt ?? new Date(),
                  );
                  return (
                    <Section key={article.id} style={s.article}>
                      <Link href={article.url} style={s.articleTitle}>
                        {article.title}
                      </Link>
                      <Text style={s.articleSummary}>
                        {article.oneLine}
                        {published ? (
                          <span style={s.published}> · {published}</span>
                        ) : null}
                      </Text>
                    </Section>
                  );
                })}

                <Link
                  href={`${baseUrl}/digest/${digest.topicId}`}
                  style={s.readLink}
                >
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
