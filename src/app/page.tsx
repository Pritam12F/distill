import { DigestCard } from "@/components/digest-card";
import { Landing } from "@/components/landing";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user.id) return <Landing />;

  async function getDigests(userId: string) {
    const sortedDigests = await prisma.digest.findMany({
      where: {
        id: userId,
      },
      orderBy: {
        createdAt: "asc",
      },
      include: {
        topic: true,
        articles: {
          select: {
            sourceId: true,
          },
        },
      },
    });

    const currentTime = new Date();
    const currentDate = currentTime.getDate();

    const currentISO = new Date().toISOString().split("T")[0];
    const prevISO = new Date(currentTime.setDate(currentDate - 1))
      .toISOString()
      .split("T")[0];

    const currDigests = sortedDigests
      .filter((d) => d.createdAt.toISOString().split("T")[0] === currentISO)
      .map((m, i) => ({
        id: m.id,
        topic: m.topic.name,
        headline: m.headline,
        consensus: m.consensus,
        hasConflict: m.conflict,
        date: m.createdAt.toISOString().split("T")[0],
        isUnread: true,
        accentIndex: i,
        sourceCount: m.articles.length,
      }));

    const prevDigests = sortedDigests
      .filter((d) => d.createdAt.toISOString().split("T")[0] === prevISO)
      .map((m, i) => ({
        id: m.id,
        topic: m.topic.name,
        headline: m.headline,
        consensus: m.consensus,
        hasConflict: m.conflict ?? false,
        date: m.createdAt.toISOString().split("T")[0],
        isUnread: true,
        accentIndex: i,
        sourceCount: m.articles.length,
      }));

    return {
      currDigests,
      prevDigests,
    };
  }

  const { currDigests, prevDigests } = await getDigests(session.user.id);

  return (
    <div className="min-h-screen bg-[#FBF6EE] p-8 dark:bg-[#14110E]">
      <div className="mx-auto flex max-w-md flex-col gap-3">
        {currDigests.map((digestProps) => {
          return <DigestCard {...digestProps} />;
        })}
      </div>
      <div className="mx-auto flex max-w-md flex-col gap-3 opacity-20">
        {prevDigests.map((digestProps) => {
          return <DigestCard {...digestProps} />;
        })}
      </div>
    </div>
  );
}
