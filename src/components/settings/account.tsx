"use client";

import { authClient } from "@/lib/auth-client";
import { SectionLabel } from "./section-label";
import { redirect, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { toast } from "sonner";

export function Accounts() {
  const session = authClient.useSession();
  const navigate = useRouter();

  if (!session || !session.data) {
    redirect("/");
  }

  return (
    <section className="flex flex-col gap-4">
      <SectionLabel>Account</SectionLabel>

      <div className="flex flex-col">
        <div className="flex items-center justify-between gap-4 border-b border-[#DCD2C2] py-3 dark:border-[#332C24]">
          <span className="text-sm text-[#1A1714] dark:text-[#F3EDE3]">
            Email
          </span>
          <span className="text-sm text-[#6E645A] dark:text-[#A69A8B]">
            {session.data.user.email}
          </span>
        </div>
        <div className="flex items-center justify-between gap-4 border-b border-[#DCD2C2] py-3 dark:border-[#332C24]">
          <span className="text-sm text-[#1A1714] dark:text-[#F3EDE3]">
            Member since
          </span>
          <span className="text-sm text-[#6E645A] dark:text-[#A69A8B]">
            {session.data.user.createdAt.toLocaleDateString("en-gb", {
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={async (e) => {
          await authClient.signOut({
            fetchOptions: {
              onSuccess: () => {
                toast.info("Logged out", { duration: 500 });
                navigate.push("/");
              },
            },
          });
        }}
        className="inline-flex w-fit items-center gap-2 rounded-full border border-[#DCD2C2] px-4 py-2 text-sm font-medium text-[#1A1714] transition-colors hover:border-[#755815] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#755815] dark:border-[#332C24] dark:text-[#F3EDE3] dark:hover:border-[#D9A441] dark:focus-visible:ring-[#D9A441]"
      >
        <LogOut className="size-4" aria-hidden="true" />
        Sign out
      </button>
    </section>
  );
}
