import Image from 'next/image'
import { ArrowUpRight, Check, Eye, Focus, Sparkles, Workflow } from 'lucide-react'

const features = [
  {
    title: 'See the signal',
    text: 'Turn scattered inputs into a clear view of what matters next, without adding another layer of busywork.',
    icon: Eye,
  },
  {
    title: 'Move with intent',
    text: 'Keep projects, people, and priorities moving together with simple workflows that feel natural to use.',
    icon: Workflow,
  },
  {
    title: 'Make room for better',
    text: 'Automate the repetitive parts so your team can spend more time thinking, making, and doing meaningful work.',
    icon: Focus,
  },
]

const reading = [
  { source: 'The Atlantic', initials: 'TA', title: 'Why the grid is the real constraint on clean energy', time: '90 sec' },
  { source: 'Nature', initials: 'N', title: 'What protein folding got right, and what it missed', time: '75 sec' },
  { source: 'Stratechery', initials: 'S', title: 'The unbundling nobody priced in', time: '60 sec' },
]

const summaryPoints = [
  'Transmission, not generation, is the bottleneck.',
  'Queues average four years in three US regions.',
  'Permitting is the fix, not more capacity.',
]

export default function Page() {
  return (
    <main className="min-h-screen bg-[#FBF6EE] text-[#1A1714] dark:bg-[#14110E] dark:text-[#F3EDE3]">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 lg:px-10">
        <span className="font-serif text-2xl tracking-tight">
          northstar<span className="text-[#755815] dark:text-[#D9A441]">.</span>
        </span>
        <a
          href="#contact"
          className="inline-flex items-center rounded-full bg-[#1A1714] px-5 py-2.5 text-sm font-medium text-[#FBF6EE] transition-transform hover:-translate-y-0.5 dark:bg-[#F3EDE3] dark:text-[#14110E]"
        >
          Request access <ArrowUpRight className="ml-2 h-4 w-4" />
        </a>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pb-20 pt-16 lg:px-10 lg:pb-28 lg:pt-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div>
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#DCD2C2] bg-[#F0E8DA] px-4 py-2 text-xs text-[#6E645A] dark:border-[#332C24] dark:bg-[#221D17] dark:text-[#A69A8B]">
              <Sparkles className="h-3.5 w-3.5 text-[#755815] dark:text-[#D9A441]" /> AI-powered reading, distilled
            </div>

            <h1 className="font-serif text-5xl leading-[1.02] tracking-[-0.03em] text-balance sm:text-6xl">
              Make room for <em className="text-[#755815] dark:text-[#D9A441]">the signal.</em>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-[#6E645A] dark:text-[#A69A8B]">
              Northstar turns the articles shaping the world into clear, useful summaries—across technology,
              business, science, culture, and beyond.
            </p>

            <a
              href="#contact"
              className="group mt-8 inline-flex w-fit items-center rounded-full bg-[#1A1714] px-6 py-4 text-sm font-medium text-[#FBF6EE] dark:bg-[#F3EDE3] dark:text-[#14110E]"
            >
              Find your northstar
              <ArrowUpRight className="ml-3 h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </a>
          </div>

          {/* Brand mark */}
          <div className="flex justify-center rounded-[2rem] bg-[#F0E8DA] p-8 lg:p-10 dark:bg-[#221D17]">
            <svg
              viewBox="0 0 400 400"
              role="img"
              aria-label="Scattered signals converging into a north star"
              className="w-full max-w-[340px] text-[#755815] dark:text-[#D9A441]"
            >
              <circle cx="200" cy="200" r="190" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.2" />
              <circle cx="200" cy="200" r="140" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.2" />
              <circle cx="200" cy="200" r="90" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.2" />
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
          <Image
            src="/northstar-articles-brand.png"
            alt="Open articles converging toward a north star"
            fill
            className="object-cover opacity-90"
            priority
            sizes="(max-width: 1024px) 100vw, 1152px"
          />
          <div className="absolute inset-0 bg-[#1A1714]/55 dark:bg-[#14110E]/60" />

          <div className="relative z-10 flex flex-col justify-between gap-12 p-8 text-[#FBF6EE] lg:min-h-[480px] lg:flex-row lg:items-end lg:p-12 dark:text-[#F3EDE3]">
            <div className="max-w-md">
              <p className="mb-4 text-xs uppercase tracking-[0.22em] opacity-75">Your reading, this morning</p>
              <p className="font-serif text-3xl leading-tight lg:text-5xl">
                Clarity from every corner of the world.
              </p>
            </div>

            <div className="w-full space-y-3 lg:max-w-sm">
              {reading.map((item) => (
                <div
                  key={item.title}
                  className="flex items-start gap-3 rounded-2xl border border-[#FBF6EE]/20 bg-[#FBF6EE]/10 p-4 backdrop-blur-sm dark:border-[#F3EDE3]/20 dark:bg-[#F3EDE3]/10"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FBF6EE]/20 text-[11px] font-medium dark:bg-[#F3EDE3]/20">
                    {item.initials}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[11px] uppercase tracking-[0.14em] opacity-70">{item.source}</p>
                    <p className="mt-1 text-sm leading-5">{item.title}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-[#FBF6EE]/15 px-2.5 py-1 text-[11px] dark:bg-[#F3EDE3]/15">
                    {item.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What it does */}
      <section className="mx-auto max-w-6xl px-6 pb-20 lg:px-10 lg:pb-28">
        <div className="grid gap-px overflow-hidden rounded-3xl border border-[#DCD2C2] bg-[#DCD2C2] md:grid-cols-3 dark:border-[#332C24] dark:bg-[#332C24]">
          {features.map((feature) => (
            <article key={feature.title} className="bg-[#FBF6EE] p-8 dark:bg-[#14110E]">
              <feature.icon
                aria-hidden="true"
                className="mb-6 h-10 w-10 stroke-[1] text-[#755815] dark:text-[#D9A441]"
              />
              <h2 className="font-serif text-2xl tracking-tight">{feature.title}</h2>
              <p className="mt-3 text-sm leading-6 text-[#6E645A] dark:text-[#A69A8B]">{feature.text}</p>
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
              Ready to find your northstar?
            </h2>
            <p className="mt-5 max-w-md text-base leading-7 opacity-85">
              Free for your first 20 articles. No card, no onboarding call, no newsletter you did not ask for.
            </p>
            <a
              href="mailto:hello@northstar.work"
              className="mt-8 inline-flex w-fit items-center rounded-full bg-[#FBF6EE] px-6 py-4 text-sm font-medium text-[#755815] dark:bg-[#14110E] dark:text-[#D9A441]"
            >
              Request access <ArrowUpRight className="ml-3 h-4 w-4" />
            </a>
          </div>

          {/* Sample summary card */}
          <div className="rounded-3xl bg-[#FBF6EE] p-6 text-[#1A1714] lg:p-7 dark:bg-[#14110E] dark:text-[#F3EDE3]">
            <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.16em] text-[#6E645A] dark:text-[#A69A8B]">
              <span>Sample summary</span>
              <span>90 sec</span>
            </div>
            <p className="mt-4 font-serif text-xl leading-snug tracking-tight">
              Transmission, not generation, is what is holding renewables back.
            </p>
            <ul className="mt-5 space-y-3">
              {summaryPoints.map((point) => (
                <li key={point} className="flex gap-2.5 text-sm leading-6 text-[#6E645A] dark:text-[#A69A8B]">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#755815] dark:text-[#D9A441]" />
                  {point}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-2 border-t border-[#DCD2C2] pt-5 dark:border-[#332C24]">
              {['Energy', 'Policy'].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-[#F0E8DA] px-3 py-1 text-xs text-[#6E645A] dark:bg-[#221D17] dark:text-[#A69A8B]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-8 text-xs text-[#6E645A] sm:flex-row sm:items-center sm:justify-between lg:px-10 dark:text-[#A69A8B]">
        <span className="font-serif text-xl text-[#1A1714] dark:text-[#F3EDE3]">
          northstar<span className="text-[#755815] dark:text-[#D9A441]">.</span>
        </span>
        <div className="flex gap-6">
          <a href="mailto:hello@northstar.work" className="hover:text-[#1A1714] dark:hover:text-[#F3EDE3]">
            hello@northstar.work
          </a>
          <span>© 2026</span>
        </div>
      </footer>
    </main>
  )
}
