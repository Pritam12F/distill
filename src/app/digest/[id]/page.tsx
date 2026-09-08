import ConsensusAndConflict from "@/components/consensus-conflict";
import { ReactionsSection } from "@/components/reaction";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { Share2 } from "lucide-react";
import { notFound } from "next/navigation";

export type DigestPageProps = Prisma.DigestGetPayload<{
  include: {
    articles: true;
    topic: true;
  };
}>;

const topicColors = [
  "bg-[#F0E8DA] text-[#755815] dark:bg-[#221D17] dark:text-[#D9A441]", // gold
  "bg-[#F7E9D0] text-[#8A5A18] dark:bg-[#2A2318] dark:text-[#E0B063]", // amber
  "bg-[#F5E3DA] text-[#8A4F35] dark:bg-[#2A1F1A] dark:text-[#D99878]", // clay
  "bg-[#E8EDDE] text-[#5A6B3D] dark:bg-[#1F2419] dark:text-[#A8BC8A]", // olive
  "bg-[#E2E9EC] text-[#46626E] dark:bg-[#1A2226] dark:text-[#8FB3C0]", // dusty blue
];

export default async function DigestPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const digestDetails = await prisma.digest.findFirst({
    where: {
      id,
    },
    include: {
      articles: true,
      topic: {
        select: {
          name: true,
          user: {
            select: {
              topics: {
                select: {
                  id: true,
                },
              },
            },
          },
          id: true,
        },
      },
    },
  });

  if (!digestDetails) {
    return notFound();
  }

  const topicIdx = digestDetails.topic.user.topics.findIndex(
    (t) => t.id === digestDetails.topic.id,
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
          {digestDetails.topic.name}
        </span>

        <h1 className="mt-5 font-serif text-4xl leading-[1.1] tracking-tight text-balance sm:text-[42px]">
          {digestDetails.headline}
        </h1>

        <p className="mt-5 text-sm text-[#6E645A] dark:text-[#A69A8B]">
          {digestDetails.createdAt.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
          — synthesised from {digestDetails.articles.length} sources
        </p>
      </header>

      <ConsensusAndConflict
        consensus={digestDetails.consensus}
        conflict={digestDetails.conflict}
        articles={digestDetails.articles}
      />

      {/* Signal */}
      <section className="mt-4 rounded-2xl bg-[#E8F0E6] px-6 py-6 dark:bg-[#1A2419]">
        <h2 className="text-[11px] uppercase tracking-[0.16em] text-[#4A6B3D] dark:text-[#9FC48F]">
          The signal
        </h2>
        <p className="mt-3 text-[17px] leading-8 text-[#2F3B29] dark:text-[#CBDCC2]">
          {digestDetails.signal}
        </p>
      </section>

      {/* Sources */}
      <section className="mt-14">
        <h2 className="text-[11px] uppercase tracking-[0.16em] text-[#6E645A] dark:text-[#A69A8B]">
          Sources
        </h2>

        <ul className="mt-5">
          {digestDetails.articles.map((source, i) => (
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

              <ReactionsSection
                sourceId={source.sourceId}
                articleId={source.id}
                reaction={source.reaction}
              />
            </li>
          ))}
        </ul>
      </section>

      {/* Footer */}
      
    </main>
  );
}
