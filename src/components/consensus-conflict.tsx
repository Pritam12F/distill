import { Fragment } from "react/jsx-runtime";

export function parseSources(
  articles: { sourceId: string; url: string }[],
  input?: string | null,
) {
  if (!input) {
    return null;
  }

  const splitInput = input.split(/(\[S\d+\])/);

  return (
    <Fragment>
      {splitInput.map((part, i) => {
        if (/^\[S\d+\]$/.test(part)) {
          const source = articles.find(
            (art) => art.sourceId === part.slice(1, -1),
          );

          if (!source) return null;

          const { sourceId: id } = source;

          return (
            <a
              key={i}
              href={`#source-${id}`}
              className="ml-0.5 align-super text-[11px] text-[#755815] no-underline hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#755815] dark:text-[#D9A441] dark:focus-visible:outline-[#D9A441]"
            >
              {id}
            </a>
          );
        }

        return part;
      })}
    </Fragment>
  );
}

export default function ConsensusAndConflict({
  consensus,
  conflict,
  articles,
}: {
  consensus: string;
  conflict?: string | null;
  articles: {
    sourceId: string;
    url: string;
  }[];
}) {
  const parsedConsensus = parseSources(articles, consensus);
  const parsedConflict = parseSources(articles, conflict);

  return (
    <Fragment>
      <section className="mt-10 space-y-5 text-[17px] leading-8 text-[#3D372F] dark:text-[#C9C0B3]">
        <p>{parsedConsensus}</p>
      </section>
      <section className="mt-9 rounded-2xl bg-[#FBF0DC] px-6 py-5 dark:bg-[#2A2318]">
        {conflict && (
          <Fragment>
            <h2 className="text-[11px] uppercase tracking-[0.16em] text-[#8A6A18] dark:text-[#D9A441]">
              Where it&apos;s unclear
            </h2>
            <p className="mt-3 text-[15px] leading-7 text-[#4A4034] dark:text-[#C3B8A5]">
              {parsedConflict}
            </p>
          </Fragment>
        )}
      </section>
    </Fragment>
  );
}
