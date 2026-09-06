import { getDigests } from "@/actions/digest-recent";
import { DigestCard } from "@/components/digest-card";
import { Landing } from "@/components/landing";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user.id) return <Landing />;

  const { currDigests, prevDigests } = await getDigests(session.user.id);

  return (
    <div className="min-h-screen bg-[#FBF6EE] p-8 dark:bg-[#14110E]">
      <div className="mx-auto flex max-w-md flex-col gap-3">
        {currDigests.map((digestProps) => {
          return <DigestCard {...digestProps} />;
        })}
      </div>
      <div className="mx-auto flex max-w-md flex-col gap-3 opacity-20">
        {prevDigests.map((digestCardProps) => {
          return <DigestCard {...digestCardProps} />;
        })}
      </div>
    </div>
  );
}
