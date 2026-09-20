import { AccountMenu } from "@/components/account-menu";
import { DangerZone } from "@/components/settings/danger-zone";
import { DeliverySettings } from "@/components/settings/delivery";
import { TopicChooser } from "@/components/settings/topic-chooser";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const session = await getSession();

  if (!session) {
    redirect("/");
  }

  const user = await prisma.user.findFirst({
    where: {
      id: session.user.id,
    },
    select: {
      topics: true,
    },
  });

  if (!user) {
    redirect("/");
  }

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
        <TopicChooser topics={user.topics} />

        <hr className="border-t border-[#DCD2C2] dark:border-[#332C24]" />

        {/* DELIVERY */}
        <DeliverySettings />

        <hr className="border-t border-[#DCD2C2] dark:border-[#332C24]" />

        {/* ACCOUNT */}
        <AccountMenu />

        <hr className="border-t border-[#DCD2C2] dark:border-[#332C24]" />

        {/* DANGER */}
        <DangerZone />
      </div>
    </main>
  );
}
