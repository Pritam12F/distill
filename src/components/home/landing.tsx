import { ArrowUpRight, Layers, Scale, Sparkles, Zap } from "lucide-react";
import { SampleArticles, SampleSummary } from "./sample-landing";
import { LandingContextProvider } from "@/context/landing-samples";

const features = [
  {
    title: "Read across sources",
    text: "Distill reads every article on your topics overnight, then tells you what the sources actually agree on—not five versions of the same story.",
    icon: Layers,
  },
  {
    title: "See where they disagree",
    text: "When two outlets report contradictory facts, that contradiction is the story. Distill surfaces it instead of burying it.",
    icon: Scale,
  },
  {
    title: "Never read twice",
    text: "Every article you have already seen is filtered out. Your briefing gets sharper the longer you use it.",
    icon: Zap,
  },
];

export async function Landing() {
  return (
    <LandingContextProvider>
      <main className="min-h-screen bg-[#FBF6EE] text-[#1A1714] dark:bg-[#14110E] dark:text-[#F3EDE3]">
        {/* Hero */}
        <section className="mx-auto max-w-6xl px-6 pb-20 pt-16 lg:px-10 lg:pb-28 lg:pt-24">
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            <div>
              <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#DCD2C2] bg-[#F0E8DA] px-4 py-2 text-xs text-[#6E645A] dark:border-[#332C24] dark:bg-[#221D17] dark:text-[#A69A8B]">
                <Sparkles className="h-3.5 w-3.5 text-[#755815] dark:text-[#D9A441]" />{" "}
                One briefing, every morning
              </div>

              <h1 className="font-serif text-5xl leading-[1.02] tracking-[-0.03em] text-balance sm:text-6xl">
                Five sources.{" "}
                <em className="text-[#755815] dark:text-[#D9A441]">
                  One briefing.
                </em>
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-8 text-[#6E645A] dark:text-[#A69A8B]">
                Pick your topics. Every morning, Distill reads the news and
                tells you what sources agree on, where they contradict each
                other, and the one thing worth remembering.
              </p>

              <a
                href="#contact"
                className="group mt-8 inline-flex w-fit items-center rounded-full bg-[#1A1714] px-6 py-4 text-sm font-medium text-[#FBF6EE] dark:bg-[#F3EDE3] dark:text-[#14110E]"
              >
                Start your briefing
                <ArrowUpRight className="ml-3 h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </a>
            </div>

            {/* Brand mark */}
            <div className="flex justify-center rounded-[2rem] bg-[#F0E8DA] p-8 lg:p-10 dark:bg-[#221D17]">
              <svg
                viewBox="0 0 400 400"
                role="img"
                aria-label="Scattered sources converging into a single signal"
                className="w-full max-w-[340px] text-[#755815] dark:text-[#D9A441]"
              >
                <circle
                  cx="200"
                  cy="200"
                  r="190"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  opacity="0.2"
                />
                <circle
                  cx="200"
                  cy="200"
                  r="140"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  opacity="0.2"
                />
                <circle
                  cx="200"
                  cy="200"
                  r="90"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  opacity="0.2"
                />
                <g opacity="0.35" fill="currentColor">
                  <circle cx="200" cy="10" r="5" />
                  <circle cx="334" cy="66" r="4" />
                  <circle cx="390" cy="200" r="5" />
                  <circle cx="334" cy="334" r="4" />
                  <circle cx="200" cy="390" r="5" />
                  <circle cx="66" cy="334" r="4" />
                  <circle cx="10" cy="200" r="5" />
                  <circle cx="66" cy="66" r="4" />
                  <circle cx="299" cy="101" r="3" />
                  <circle cx="101" cy="299" r="3" />
                  <circle cx="299" cy="299" r="3" />
                  <circle cx="101" cy="101" r="3" />
                </g>
                <path
                  d="M200 100 C204 162 238 196 300 200 C238 204 204 238 200 300 C196 238 162 204 100 200 C162 196 196 162 200 100 Z"
                  fill="currentColor"
                />
                <path
                  d="M330 60 C332 82 342 92 364 94 C342 96 332 106 330 128 C328 106 318 96 296 94 C318 92 328 82 330 60 Z"
                  fill="currentColor"
                  opacity="0.45"
                />
              </svg>
            </div>
          </div>

          {/* Panel */}
          <div className="relative mt-16 overflow-hidden rounded-[2rem] bg-[#1A1714] dark:bg-[#2A241D]">
            {/* <Image
            src="/distill-sources-brand.png"
            alt="Multiple news sources converging into a single briefing"
            fill
            className="object-cover opacity-90"
            priority
            sizes="(max-width: 1024px) 100vw, 1152px"
          /> */}
            <div className="absolute inset-0 bg-[#1A1714]/55 dark:bg-[#14110E]/60" />

            <div className="relative z-10 flex flex-col justify-between gap-12 p-8 text-[#FBF6EE] lg:min-h-[480px] lg:flex-row lg:items-end lg:p-12 dark:text-[#F3EDE3]">
              <div className="max-w-md">
                <p className="mb-4 text-xs uppercase tracking-[0.22em] opacity-75">
                  Web Development, this morning
                </p>
                <p className="font-serif text-3xl leading-tight lg:text-5xl">
                  Thirty articles in. One briefing out.
                </p>
              </div>

              <SampleArticles />
            </div>
          </div>
        </section>

        {/* What it does */}
        <section className="mx-auto max-w-6xl px-6 pb-20 lg:px-10 lg:pb-28">
          <div className="grid gap-px overflow-hidden rounded-3xl border border-[#DCD2C2] bg-[#DCD2C2] md:grid-cols-3 dark:border-[#332C24] dark:bg-[#332C24]">
            {features.map((feature) => (
              <article
                key={feature.title}
                className="bg-[#FBF6EE] p-8 dark:bg-[#14110E]"
              >
                <feature.icon
                  aria-hidden="true"
                  className="mb-6 h-10 w-10 stroke-[1] text-[#755815] dark:text-[#D9A441]"
                />
                <h2 className="font-serif text-2xl tracking-tight">
                  {feature.title}
                </h2>
                <p className="mt-3 text-sm leading-6 text-[#6E645A] dark:text-[#A69A8B]">
                  {feature.text}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section
          id="contact"
          className="relative mx-6 mb-6 overflow-hidden rounded-[2rem] bg-[#755815] px-6 py-16 text-[#FBF6EE] lg:mx-10 lg:px-16 lg:py-20 dark:bg-[#D9A441] dark:text-[#14110E]"
        >
          <svg
            viewBox="0 0 200 200"
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 -left-16 h-[380px] w-[380px] opacity-[0.12]"
          >
            <path
              d="M100 0 C108 62 138 92 200 100 C138 108 108 138 100 200 C92 138 62 108 0 100 C62 92 92 62 100 0 Z"
              fill="currentColor"
            />
          </svg>

          <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1fr_400px]">
            <div>
              <h2 className="max-w-xl font-serif text-4xl leading-tight tracking-tight lg:text-6xl">
                Stop reading five versions of the same story.
              </h2>
              <p className="mt-5 max-w-md text-base leading-7 opacity-85">
                Pick up to five topics. One email a day. No card, no onboarding
                call, unsubscribe in one click.
              </p>
              <a
                href="mailto:hello@distill.news"
                className="mt-8 inline-flex w-fit items-center rounded-full bg-[#FBF6EE] px-6 py-4 text-sm font-medium text-[#755815] dark:bg-[#14110E] dark:text-[#D9A441]"
              >
                Start free <ArrowUpRight className="ml-3 h-4 w-4" />
              </a>
            </div>

            {/* Sample summary card */}
            <SampleSummary />
          </div>
        </section>

        <footer className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-8 text-xs text-[#6E645A] sm:flex-row sm:items-center sm:justify-between lg:px-10 dark:text-[#A69A8B]">
          <span className="font-serif text-xl text-[#1A1714] dark:text-[#F3EDE3]">
            distill<span className="text-[#755815] dark:text-[#D9A441]">.</span>
          </span>
          <div className="flex gap-6">
            <a
              href="mailto:pritam@distill.devzy.live"
              className="hover:text-[#1A1714] dark:hover:text-[#F3EDE3]"
            >
              pritam@distill.devzy.live
            </a>
            <span>© 2026</span>
          </div>
        </footer>
      </main>
    </LandingContextProvider>
  );
}
