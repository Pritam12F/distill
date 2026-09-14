"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getNavType } from "@/utils/find-nav-type";
import { AccountMenu } from "./account-menu";
import { AuthObjectType } from "@/types/auth";

export type NavbarType = {
  auth: AuthObjectType;
};

export default function NavbarWrapper({ auth }: NavbarType) {
  const pathname = usePathname();
  const navType = getNavType(pathname, Boolean(auth?.session));

  return (
    <main className="flex max-h-fit flex-col">
      {/* MARKETING */}
      {navType === "marketing" && <MarketingVariant auth={auth} />}

      {/* MINIMAL */}
      {navType === "minimal" && <MinimalVariant auth={auth} />}

      {/* MAIN */}
      {navType === "main" && <MainVariant auth={auth} />}
    </main>
  );
}

function MainVariant({ auth }: NavbarType) {
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
            href="/"
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

          <AccountMenu name={auth?.user.name} email={auth?.user.email} />
        </div>
      </div>
    </nav>
  );
}

function MarketingVariant({ auth }: NavbarType) {
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
            href="/signin"
            className="rounded-sm text-sm text-[#8A8075] transition-colors hover:text-[#1A1714] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#755815] dark:text-[#8A8075] dark:hover:text-[#F3EDE3] dark:focus-visible:outline-[#D9A441]"
          >
            Sign in
          </Link>

          <Link
            href="/signup"
            className="rounded-full bg-[#755815] px-4 py-2 text-sm text-[#FBF6EE] transition-colors hover:bg-[#5F4711] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#755815] dark:bg-[#D9A441] dark:text-[#14110E] dark:hover:bg-[#C4932F] dark:focus-visible:outline-[#D9A441]"
          >
            Start free
          </Link>
        </div>
      </div>
    </nav>
  );
}

function MinimalVariant({ auth }: NavbarType) {
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
        <AccountMenu name={auth?.user.name} email={auth?.user.email} />
      </div>
    </nav>
  );
}
