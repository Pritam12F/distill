import { DangerZone } from "@/components/settings/danger-zone";
import { TopicChooser } from "@/components/settings/topic-chooser";
import { SUGGESTED_TOPICS } from "@/constants/constants";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { X, Plus, ChevronRight, LogOut, Trash2 } from "lucide-react";
import { redirect } from "next/navigation";

const SELECTED_TOPICS = [
  "Artificial intelligence",
  "Web development",
  "Cybersecurity",
];

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-medium tracking-widest uppercase text-[#6E645A] dark:text-[#A69A8B]">
      {children}
    </p>
  );
}

export default async function SettingsPage() {
  const session = await getSession();

  if (!session) {
    redirect("/");
  }

  const topics = await prisma.user.findFirst({
    where: {
      id: session.user.id,
    },
    select: {
      topics: true,
    },
  });

  return (
    <main className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <header className="mb-12">
        <h1 className="font-serif tracking-tight text-3xl text-[#1A1714] dark:text-[#F3EDE3]">
          Settings
        </h1>
        <p className="mt-2 text-[#6E645A] dark:text-[#A69A8B]">
          Manage what you follow and how it arrives.
        </p>
      </header>

      <div className="flex flex-col gap-12">
        {/* TOPICS */}
        <TopicChooser />

        <hr className="border-t border-[#DCD2C2] dark:border-[#332C24]" />

        {/* DELIVERY */}
        <section className="flex flex-col gap-4">
          <SectionLabel>Delivery</SectionLabel>

          <div className="flex flex-col">
            <button
              type="button"
              className="flex items-center justify-between gap-4 border-b border-[#DCD2C2] py-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#755815] dark:border-[#332C24] dark:focus-visible:ring-[#D9A441]"
            >
              <span className="text-sm text-[#1A1714] dark:text-[#F3EDE3]">
                Time
              </span>
              <span className="flex items-center gap-1 text-sm text-[#6E645A] dark:text-[#A69A8B]">
                7:00 AM
                <ChevronRight className="size-4" aria-hidden="true" />
              </span>
            </button>

            <button
              type="button"
              className="flex items-center justify-between gap-4 border-b border-[#DCD2C2] py-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#755815] dark:border-[#332C24] dark:focus-visible:ring-[#D9A441]"
            >
              <span className="text-sm text-[#1A1714] dark:text-[#F3EDE3]">
                Timezone
              </span>
              <span className="flex items-center gap-1 text-sm text-[#6E645A] dark:text-[#A69A8B]">
                Asia/Kolkata
                <ChevronRight className="size-4" aria-hidden="true" />
              </span>
            </button>
          </div>

          <div className="flex items-center justify-between gap-4 pt-1">
            <span className="text-sm text-[#1A1714] dark:text-[#F3EDE3]">
              Pause briefings
            </span>
            <button
              type="button"
              role="switch"
              aria-checked="false"
              className="relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border border-[#DCD2C2] bg-[#F0E8DA] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#755815] dark:border-[#332C24] dark:bg-[#221D17] dark:focus-visible:ring-[#D9A441]"
            >
              <span className="ml-0.5 size-5 rounded-full bg-[#FBF6EE] transition-transform dark:bg-[#A69A8B]" />
            </button>
          </div>
          <p className="-mt-2 text-sm text-[#A69A8B] dark:text-[#6E645A]">
            Stop receiving emails without losing your topics.
          </p>
        </section>

        <hr className="border-t border-[#DCD2C2] dark:border-[#332C24]" />

        {/* ACCOUNT */}
        <section className="flex flex-col gap-4">
          <SectionLabel>Account</SectionLabel>

          <div className="flex flex-col">
            <div className="flex items-center justify-between gap-4 border-b border-[#DCD2C2] py-3 dark:border-[#332C24]">
              <span className="text-sm text-[#1A1714] dark:text-[#F3EDE3]">
                Email
              </span>
              <span className="text-sm text-[#6E645A] dark:text-[#A69A8B]">
                {session.user.email}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4 border-b border-[#DCD2C2] py-3 dark:border-[#332C24]">
              <span className="text-sm text-[#1A1714] dark:text-[#F3EDE3]">
                Member since
              </span>
              <span className="text-sm text-[#6E645A] dark:text-[#A69A8B]">
                {session.user.createdAt.toLocaleDateString("en-gb", {
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>

          <button
            type="button"
            className="inline-flex w-fit items-center gap-2 rounded-full border border-[#DCD2C2] px-4 py-2 text-sm font-medium text-[#1A1714] transition-colors hover:border-[#755815] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#755815] dark:border-[#332C24] dark:text-[#F3EDE3] dark:hover:border-[#D9A441] dark:focus-visible:ring-[#D9A441]"
          >
            <LogOut className="size-4" aria-hidden="true" />
            Sign out
          </button>
        </section>

        <hr className="border-t border-[#DCD2C2] dark:border-[#332C24]" />

        {/* DANGER */}
        <DangerZone />
      </div>
    </main>
  );
}
