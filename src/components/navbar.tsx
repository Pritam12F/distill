"use client";

import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { usePathname } from "next/navigation";
import { getNavType } from "@/utils/find-nav-type";

export type NavbarType = {
  authStatus: boolean;
};

export default function NavbarWrapper({ authStatus }: NavbarType) {
  const pathname = usePathname();

  const navType = getNavType(pathname, authStatus);

  return (
    <main className="flex max-h-fit flex-col">
      {/* MARKETING */}
      {navType === "marketing" && <MarketingVariant />}

      {/* MINIMAL */}
      {navType === "minimal" && <MinimalVariant />}

      {/* MAIN */}
      {navType === "main" && <MainVariant />}
    </main>
  );
}

function MainVariant() {
  const { data: session, isPending } = authClient.useSession();

  return (
    <nav className="w-full border-b h-15 border-[#DCD2C2] bg-[#FBF6EE] dark:border-[#332C24] dark:bg-[#14110E]">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="rounded-sm font-serif text-[22px] tracking-tight text-[#1A1714] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#755815] dark:text-[#F3EDE3] dark:focus-visible:outline-[#D9A441]"
        >
          distill
          <span className="text-[#755815] dark:text-[#D9A441]">.</span>
        </Link>

        <div className="flex items-center gap-7">
          <Link
            href="/home"
            aria-current="page"
            className="rounded-sm text-sm text-[#1A1714] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#755815] dark:text-[#F3EDE3] dark:focus-visible:outline-[#D9A441]"
          >
            Home
          </Link>

          <Link
            href="/archive"
            className="rounded-sm text-sm text-[#8A8075] transition-colors hover:text-[#1A1714] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#755815] dark:text-[#8A8075] dark:hover:text-[#F3EDE3] dark:focus-visible:outline-[#D9A441]"
          >
            Archive
          </Link>

          <Link
            href="/settings"
            className="rounded-sm text-sm text-[#8A8075] transition-colors hover:text-[#1A1714] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#755815] dark:text-[#8A8075] dark:hover:text-[#F3EDE3] dark:focus-visible:outline-[#D9A441]"
          >
            Settings
          </Link>

          <button
            type="button"
            aria-label="Account menu"
            className="ml-1 flex size-8 cursor-pointer bg-[#E2D9C9] text-[#5A5249] dark:bg-[#2A2419] dark:text-[#A69A8B] items-center justify-center rounded-full border border-[#DCD2C2] text-[13px] transition-colors hover:border-[#755815] hover:text-[#755815] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#755815] dark:border-[#332C24] dark:hover:border-[#D9A441] dark:hover:text-[#D9A441] dark:focus-visible:outline-[#D9A441]"
          >
            {session && !isPending ? session?.user.name[0] : "A"}
          </button>
        </div>
      </div>
    </nav>
  );
}

function MarketingVariant() {
  return (
    <nav className="w-full border-b h-15 border-[#DCD2C2] bg-[#FBF6EE] dark:border-[#332C24] dark:bg-[#14110E]">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="rounded-sm font-serif text-[22px] tracking-tight text-[#1A1714] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#755815] dark:text-[#F3EDE3] dark:focus-visible:outline-[#D9A441]"
        >
          distill
          <span className="text-[#755815] dark:text-[#D9A441]">.</span>
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href="/auth"
            className="rounded-sm text-sm text-[#8A8075] transition-colors hover:text-[#1A1714] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#755815] dark:text-[#8A8075] dark:hover:text-[#F3EDE3] dark:focus-visible:outline-[#D9A441]"
          >
            Sign in
          </Link>

          <Link
            href="/auth"
            className="rounded-full bg-[#755815] px-4 py-2 text-sm text-[#FBF6EE] transition-colors hover:bg-[#5F4711] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#755815] dark:bg-[#D9A441] dark:text-[#14110E] dark:hover:bg-[#C4932F] dark:focus-visible:outline-[#D9A441]"
          >
            Start free
          </Link>
        </div>
      </div>
    </nav>
  );
}

function MinimalVariant() {
  return (
    <nav className="w-full border-b h-15 border-[#DCD2C2] bg-[#FBF6EE] dark:border-[#332C24] dark:bg-[#14110E]">
      <div className="mx-auto flex h-14 max-w-6xl items-center px-6">
        <Link
          href="/"
          className="rounded-sm font-serif text-[22px] tracking-tight text-[#1A1714] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#755815] dark:text-[#F3EDE3] dark:focus-visible:outline-[#D9A441]"
        >
          distill
          <span className="text-[#755815] dark:text-[#D9A441]">.</span>
        </Link>
      </div>
    </nav>
  );
}
