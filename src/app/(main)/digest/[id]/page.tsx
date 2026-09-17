import "dotenv/config";
import ConsensusAndConflict from "@/components/consensus-conflict";
import DigestShare from "@/components/digest-share";
import { ReactionsSection } from "@/components/reaction";
import { notFound } from "next/navigation";
import { BASE_URL, topicColors } from "@/constants/constants";
import type { Metadata, ResolvingMetadata } from "next";
import { getDigest } from "@/actions/fetch-digest";
import { getSession } from "@/lib/auth";
import { markAsRead } from "@/actions/mark-as-read";

export const revalidate = 3600;

export const generateMetadata = async (
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  },
  parent: ResolvingMetadata,
): Promise<Metadata> => {
  const { id } = await params;

  const digestDetails = await getDigest(id);
  const prevData = await parent;

  if (!digestDetails) {
    return {
      title: prevData.title,
      description: prevData.description,
    };
  }

  const { headline, signal } = digestDetails.digest;

  return {
    title: headline ?? prevData.title,
    description: signal ?? prevData.description,
  };
};

export default async function DigestPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const digestDetails = await getDigest(id);

  if (!digestDetails) {
    return notFound();
  }

  const {
    id: digestId,
    topic,
    hasRead,
    headline,
    createdAt,
    articles,
    conflict,
    consensus,
    signal,
  } = digestDetails.digest;

  const session = await getSession();
  const isOwner = session ? session.user.id === digestId : false;

  if (!hasRead && isOwner) {
    await markAsRead(digestId);
  }

  const topicIdx = digestDetails.ownerTopics.findIndex(
    (t) => t.id === topic.id,
  );

  return (
    <main className="mx-auto max-w-2xl px-6 pb-24 pt-12 text-[#1A1714] dark:text-[#F3EDE3]">
      {/* Header */}
      <header>
        <span
          className={`inline-block rounded-full px-3 py-1 text-xs ${
            topicColors[topicIdx]
          }`}
        >
          {topic.name}
        </span>

        <h1 className="mt-5 font-serif text-4xl leading-[1.1] tracking-tight text-balance sm:text-[42px]">
          {headline}
        </h1>

        <p className="mt-5 text-sm text-[#6E645A] dark:text-[#A69A8B]">
          {createdAt.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
          — synthesised from {articles.length} sources
        </p>
      </header>

      <ConsensusAndConflict
        consensus={consensus}
        conflict={conflict}
        articles={articles.map((a) => ({
          sourceId: a.sourceId,
          url: a.url,
        }))}
      />

      {/* Signal */}
      <section className="mt-4 rounded-2xl bg-[#E8F0E6] px-6 py-6 dark:bg-[#1A2419]">
        <h2 className="text-[11px] uppercase tracking-[0.16em] text-[#4A6B3D] dark:text-[#9FC48F]">
          The signal
        </h2>
        <p className="mt-3 text-[17px] leading-8 text-[#2F3B29] dark:text-[#CBDCC2]">
          {signal}
        </p>
      </section>

      {/* Sources */}
      <section className="mt-14">
        <h2 className="text-[11px] uppercase tracking-[0.16em] text-[#6E645A] dark:text-[#A69A8B]">
          Sources
        </h2>

        <ul className="mt-5">
          {articles.map((source, i) => (
            <li
              key={source.sourceId}
              id={`source-${source.sourceId}`}
              className={`flex gap-4 py-5 border-b border-[#DCD2C2] dark:border-[#332C24]`}
            >
              <span className="mt-0.5 shrink-0 text-xs text-[#A69A8B] dark:text-[#6E645A]">
                {source.sourceId}
              </span>

              <div className="min-w-0 flex-1">
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={source.url}
                  className="text-[15px] font-medium leading-6 text-[#1A1714] underline decoration-[#DCD2C2] underline-offset-4 hover:decoration-[#755815] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#755815] dark:text-[#F3EDE3] dark:decoration-[#332C24] dark:hover:decoration-[#D9A441] dark:focus-visible:outline-[#D9A441]"
                >
                  {source.title}
                </a>
                <p className="mt-1.5 text-[13px] leading-6 text-[#6E645A] dark:text-[#A69A8B]">
                  {source.oneLine}
                  {source.publishedAt && (
                    <span className="text-[#A69A8B] dark:text-[#6E645A]">
                      {" "}
                      — {source.publishedAt.toLocaleDateString()}
                    </span>
                  )}
                </p>
              </div>

              {isOwner && (
                <ReactionsSection
                  sourceId={source.sourceId}
                  articleId={source.id}
                  reaction={source.reaction}
                />
              )}
            </li>
          ))}
        </ul>
      </section>

      {/* Footer */}
      <DigestShare baseUrl={BASE_URL!} isOwner={isOwner} />
    </main>
  );
}
