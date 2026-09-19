import {
  AllDigestsPerTopicType,
  getAllDigests,
} from "@/actions/get-all-digests";
import { LoaderWrapper } from "@/components/archive/card";
import { EmptyState } from "@/components/archive/error";
import { ArchiveChipColors } from "@/constants/constants";
// import { PaginatedContextProvider } from "@/context/paginated-digests";
// import { usePaginated } from "@/hooks/use-paginated";
import Link from "next/link";
import { Layers, Scale } from "lucide-react";

export function ArchiveCard({
  id,
  hasRead,
  topic,
  topicIndex,
  sources,
  headline,
  conflict,
}: AllDigestsPerTopicType) {
  return (
    <Link
      href={`/digest/${id}`}
      className={`g flex flex-col gap-3 rounded-2xl border border-[#DCD2C2] bg-[#FBF6EE] p-5 transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#755815] dark:border-[#332C24] dark:bg-[#14110E] dark:focus-visible:ring-[#D9A441] ${
        hasRead
          ? ""
          : "rounded-l-none border-l-2 border-l-[#755815] dark:border-l-[#D9A441]"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <span
          className={`rounded-full px-3 py-1 text-sm font-medium ${ArchiveChipColors[topicIndex % ArchiveChipColors.length]}`}
        >
          {topic}
        </span>
        <span className="flex items-center gap-1.5 text-sm text-[#6E645A] dark:text-[#A69A8B]">
          <Layers className="size-3.5" aria-hidden="true" />
          {sources} sources
        </span>
      </div>

      <h3 className="line-clamp-2 font-serif text-lg tracking-tight text-[#1A1714] dark:text-[#F3EDE3]">
        {headline}
      </h3>

      {conflict && (
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#F0E8DA] px-3 py-1 text-xs font-medium text-[#755815] dark:bg-[#221D17] dark:text-[#D9A441]">
          <Scale className="size-3.5" aria-hidden="true" />
          Conflict
        </span>
      )}
    </Link>
  );
}

export function CardRenderer({
  groups,
}: {
  groups: {
    name: string;
    digests: AllDigestsPerTopicType[];
    hasNext: boolean;
  }[];
}) {
  return (
    <div className="flex flex-col gap-12">
      <div>{groups[0].digests[0].createdAt.toDateString()}</div>
      {groups.map((group) => (
        <section key={group.digests[0].topicId} className="flex flex-col gap-4">
          <h2 className="text-xs font-medium uppercase tracking-widest text-[#A69A8B] dark:text-[#6E645A]">
            {group.name}
          </h2>
          <div className="flex flex-col gap-3">
            {group.digests.map((digest) => (
              <ArchiveCard key={digest.id} {...digest} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export default async function ArchivePage() {
  const data = await getAllDigests(0);

  if (data.error) {
    return <EmptyState />;
  }

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-16 px-6 py-16">
      <header className="flex flex-col gap-2">
        <h1 className="font-serif text-4xl tracking-tight text-[#1A1714] dark:text-[#F3EDE3]">
          Archive
        </h1>
        <p className="text-[#6E645A] dark:text-[#A69A8B]">
          Every briefing you&apos;ve received.
        </p>
      </header>
      <CardRenderer groups={data.groups ?? []} />
      <LoaderWrapper />
    </main>
  );
}

// function ArchiveMain() {
//   const { error, isLoading, initialLoad } = usePaginated();

//   useEffect(() => {
//     if (isLoading && initialLoad) {
//       toast.loading("Loading archive", { duration: 800 });
//     }
//   }, [isLoading, initialLoad]);

//   if (error) {
//     return <EmptyState />;
//   }

//   return (

//   );
// }
