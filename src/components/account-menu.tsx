"use client";

import Link from "next/link";
import { LogOut, Settings, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type AccountMenuProps = {
  name?: string | null;
  email?: string | null;
};

export function AccountMenu({ name, email }: AccountMenuProps) {
  const initial = name?.trim()?.[0]?.toUpperCase() ?? "A";

  const itemClass =
    "flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-[#4A423A] focus:bg-[#F0E8DA] focus:text-[#1A1714] dark:text-[#A69A8B] dark:focus:bg-[#221D17] dark:focus:text-[#F3EDE3]";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Account menu"
        className="ml-1 flex size-8 cursor-pointer items-center justify-center rounded-full border border-[#DCD2C2] bg-[#E2D9C9] text-[13px] text-[#5A5249] transition-colors hover:border-[#755815] hover:text-[#755815] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#755815] data-[state=open]:border-[#755815] dark:border-[#332C24] dark:bg-[#2A2419] dark:text-[#A69A8B] dark:hover:border-[#D9A441] dark:hover:text-[#D9A441] dark:focus-visible:outline-[#D9A441] dark:data-[state=open]:border-[#D9A441]"
      >
        {initial}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={10}
        className="w-56 rounded-xl border-[#DCD2C2] bg-[#FBF6EE] p-1.5 dark:border-[#332C24] dark:bg-[#1C1814]"
      >
        {(name || email) && (
          <>
            <div className="px-2.5 py-2">
              {name && (
                <p className="truncate text-sm text-[#1A1714] dark:text-[#F3EDE3]">
                  {name}
                </p>
              )}
              {email && (
                <p className="truncate text-xs text-[#8A8075] dark:text-[#6E645A]">
                  {email}
                </p>
              )}
            </div>
            <DropdownMenuSeparator className="my-1 bg-[#DCD2C2] dark:bg-[#332C24]" />
          </>
        )}

        <DropdownMenuItem className={itemClass}>
          <Link href="/profile">
            <User className="size-4 text-[#8A8075] dark:text-[#6E645A]" />
            Profile
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem className={itemClass}>
          <Link href="/settings">
            <Settings className="size-4 text-[#8A8075] dark:text-[#6E645A]" />
            Settings
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-1 bg-[#DCD2C2] dark:bg-[#332C24]" />

        <DropdownMenuItem className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-[#8A3A24] focus:bg-[#F7E7E1] focus:text-[#8A3A24] dark:text-[#D98A70] dark:focus:bg-[#2A1A15] dark:focus:text-[#D98A70]">
          <LogOut className="size-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
