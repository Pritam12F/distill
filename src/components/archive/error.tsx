import Link from "next/link";

export function EmptyState() {
  return (
    <div className="flex flex-col gap-16">
      <div className="flex items-center gap-4">
        <div className="h-px flex-1 bg-[#DCD2C2] dark:bg-[#332C24]" />
        <span className="text-xs font-medium uppercase tracking-widest text-[#A69A8B] dark:text-[#6E645A]">
          Empty state
        </span>
        <div className="h-px flex-1 bg-[#DCD2C2] dark:bg-[#332C24]" />
      </div>

      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <h2 className="font-serif text-2xl tracking-tight text-[#1A1714] dark:text-[#F3EDE3]">
          Nothing here yet.
        </h2>
        <p className="text-[#6E645A] dark:text-[#A69A8B]">
          Your briefings will show up here once they arrive.
        </p>
        <Link
          href="/"
          className="mt-3 rounded-full bg-[#755815] px-6 py-2.5 text-sm font-medium text-[#FBF6EE] transition-colors hover:bg-[#5F4711] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#755815] dark:bg-[#D9A441] dark:text-[#14110E] dark:hover:bg-[#C4932F] dark:focus-visible:ring-[#D9A441]"
        >
          Back home
        </Link>
      </div>
    </div>
  );
}
