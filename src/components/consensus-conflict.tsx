"use client";

import { useDigestProvider } from "@/context/digest-details";
import { useEffect, useRef } from "react";

/** Inline source marker. In production these are parsed out of the digest text. */
function citeGen({ id, url }: { id: string; url: string }) {
  return `<a
      id=${id}
      href=${url}
      className="ml-0.5 align-super text-[11px] text-[#755815] no-underline hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#755815] dark:text-[#D9A441] dark:focus-visible:outline-[#D9A441]"
    >
      ${id}
    </a>`;
}

export function parseSources(
  articles: { sourceId: string; url: string }[],
  input?: string | null,
) {
  if (!input || !articles.length) {
    return null;
  }

  let result = "";
  let currentIdx = 0;
  const matches = input.matchAll(/\[S(\d+)\]/g);

  for (const match of matches) {
    const index = match.index;

    const source = articles.find((art) => art.sourceId === match[0])!;
    const element = citeGen({ id: source.sourceId, url: source.url });

    const replaced = input.slice(currentIdx, index).concat(element);

    result += replaced;
    currentIdx = index + match.length;
  }

  if (input[currentIdx]) {
    result += input.slice(currentIdx + 1, input.length);
  }

  const domParser = new DOMParser();
  const doc = domParser.parseFromString(result, "text/html");

  return doc;
}

export default function ConsensusAndConflict({
  digestId,
}: {
  digestId: string;
}) {
  const { digestDetails } = useDigestProvider({ digestId });

  const consensusRef = useRef<HTMLParagraphElement | null>(null);
  const conflictRef = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    if (!digestDetails || !consensusRef.current || !conflictRef.current) {
      return;
    }

    const parsedConsensusDoc = parseSources(
      digestDetails.articles.map((a) => ({ sourceId: a.sourceId, url: a.url })),
      digestDetails.consensus,
    );

    const parsedConflictDoc = parseSources(
      digestDetails.articles.map((a) => ({ sourceId: a.sourceId, url: a.url })),
      digestDetails.conflict,
    );

    if (!parsedConsensusDoc || !parsedConflictDoc) {
      return;
    }

    consensusRef.current.appendChild(parsedConsensusDoc.body);
    conflictRef.current.appendChild(parsedConflictDoc);
  }, [digestDetails, consensusRef, conflictRef]);

  return (
    <p>
      <section className="mt-10 space-y-5 text-[17px] leading-8 text-[#3D372F] dark:text-[#C9C0B3]">
        <p ref={consensusRef}></p>
      </section>
      <section className="mt-9 rounded-2xl bg-[#FBF0DC] px-6 py-5 dark:bg-[#2A2318]">
        <h2 className="text-[11px] uppercase tracking-[0.16em] text-[#8A6A18] dark:text-[#D9A441]">
          Where it&apos;s unclear
        </h2>
        <p
          ref={conflictRef}
          className="mt-3 text-[15px] leading-7 text-[#4A4034] dark:text-[#C3B8A5]"
        ></p>
      </section>
    </p>
  );
}
