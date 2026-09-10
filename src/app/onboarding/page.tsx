import { TopicChooser } from "@/components/topic-chooser";
import { SUGGESTED_TOPICS } from "@/constants/constants";

export default function OnboardingPage() {
  const [one, two, three] = Array.from({ length: 3 }).map(() =>
    Math.floor(Math.random() * SUGGESTED_TOPICS.length),
  );

  return (
    <main className="min-h-screen bg-[#FBF6EE] dark:bg-[#14110E] text-[#1A1714] dark:text-[#F3EDE3] flex flex-col justify-center items-center px-4 py-16">
      <div className="w-full max-w-2xl mx-auto flex flex-col gap-12">
        {/* Header */}
        <header className="flex flex-col gap-4">
          <span className="text-xs font-medium tracking-[0.2em] uppercase text-[#A69A8B] dark:text-[#6E645A]">
            STEP 1 OF 1
          </span>
          <h1 className="font-serif tracking-tight text-4xl sm:text-5xl text-[#1A1714] dark:text-[#F3EDE3]">
            What should we read for you?
          </h1>
          <p className="text-base leading-relaxed text-[#6E645A] dark:text-[#A69A8B]">
            Pick up to five topics. Each one gets its own briefing every
            morning, synthesised from the sources we follow.
          </p>
        </header>

        <TopicChooser selectedIndices={[one, two, three]} />
      </div>
    </main>
  );
}
