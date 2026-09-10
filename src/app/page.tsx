import { getDigests } from "@/actions/digest-recent";
import { Landing } from "@/components/landing";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { HomePage } from "@/components/home";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user.id) {
    return <Landing />;
  }

  const topics = await prisma.topic.count({
    where: {
      userId: session?.user.id,
    },
  });

  if (topics === 0) redirect("/onboarding");

  const { currDigests, prevDigests } = await getDigests(session.user.id);

  return <HomePage currDigests={currDigests} prevDigests={prevDigests} />;
}
