import Link from "next/link";
import { DigestCard, DigestCardProps } from "./digest-card";

type HomePageProps = {
  currDigests: DigestCardProps[];
  prevDigests: DigestCardProps[];
};

export function HomePage({ currDigests, prevDigests }: HomePageProps) {
  return (
    <div className="min-h-screen bg-[#FBF6EE] p-8 dark:bg-[#14110E]">
      <div className="mx-auto flex max-w-2xl flex-col gap-10">
        <section className="flex flex-col gap-3">
          <span className="text-[11px] uppercase tracking-[0.16em] text-[#6E645A] dark:text-[#A69A8B]">
            Today
          </span>

          {currDigests.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-lg border border-[#DCD2C2] bg-[#F0E8DA] px-6 py-16 text-center dark:border-[#332C24] dark:bg-[#221D17]">
              <h2 className="font-serif tracking-tight text-xl text-[#1A1714] dark:text-[#F3EDE3]">
                Your first briefing is on its way.
              </h2>
              <p className="max-w-sm text-sm text-[#6E645A] dark:text-[#A69A8B]">
                Digests arrive each morning at 7am with the stories that matter
                most to your topics.
              </p>
              <Link
                href="/settings"
                className="mt-2 rounded-full border border-[#DCD2C2] px-4 py-1.5 text-sm text-[#755815] transition-colors hover:bg-[#F0E8DA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#755815] dark:border-[#332C24] dark:text-[#D9A441] dark:hover:bg-[#221D17] dark:focus-visible:ring-[#D9A441]"
              >
                Manage your topics
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {currDigests.map((digestProps) => {
                return <DigestCard key={digestProps.id} {...digestProps} />;
              })}
            </div>
          )}
        </section>

        {prevDigests.length > 0 && (
          <section className="flex flex-col gap-3">
            <span className="text-[11px] uppercase tracking-[0.16em] text-[#6E645A] dark:text-[#A69A8B]">
              Yesterday
            </span>
            <div className="flex flex-col gap-3 opacity-60">
              {prevDigests.map((digestCardProps) => {
                return (
                  <DigestCard key={digestCardProps.id} {...digestCardProps} />
                );
              })}
            </div>
          </section>
        )}

        <div className="flex justify-center">
          <Link
            href="/archive"
            className="text-sm text-[#6E645A] underline-offset-4 transition-colors hover:text-[#1A1714] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#755815] dark:text-[#A69A8B] dark:hover:text-[#F3EDE3] dark:focus-visible:ring-[#D9A441]"
          >
            View full archive
          </Link>
        </div>
      </div>
    </div>
  );
}
