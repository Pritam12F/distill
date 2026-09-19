"use client";

import { Mail, MessageCircle, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { XIcon } from "@/icons";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function DigestShare({
  baseUrl,
  isOwner,
}: {
  baseUrl: string;
  isOwner: boolean;
}) {
  const [dialogState, setDialogState] = useState(Boolean(false));
  const [value, setValue] = useState("");
  const [focus, setFocus] = useState(false);

  const pathName = usePathname();

  const fullUrl = useMemo(() => `${baseUrl}${pathName}`, [baseUrl]);

  async function setClipboard(text: string) {
    const type = "text/plain";
    const clipboardItemData = {
      [type]: text,
    };
    const clipboardItem = new ClipboardItem(clipboardItemData);
    await navigator.clipboard.write([clipboardItem]);
  }

  return (
    <Dialog
      open={dialogState}
      onOpenChange={() => {
        setDialogState((s) => !s);
      }}
    >
      <DialogClose className="text-[#A69A8B] hover:text-[#1A1714] dark:text-[#6E645A] dark:hover:text-[#F3EDE3] cursor-pointer" />
      <footer className="mt-12 flex items-center justify-between border-t border-[#DCD2C2] pt-6 dark:border-[#332C24]">
        <DialogTrigger className="inline-flex items-center gap-2 rounded-full border border-[#DCD2C2] px-4 py-2 text-sm text-[#1A1714] transition-colors hover:border-[#755815] hover:text-[#755815] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#755815] dark:border-[#332C24] dark:text-[#A69A8B] dark:hover:border-[#D9A441] dark:hover:text-[#D9A441] dark:focus-visible:outline-[#D9A441]">
          {isOwner ? (
            <>
              <Share2 className="h-4 w-4" />
              Share this digest
            </>
          ) : (
            <Link
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              href={"/"}
            >
              Get your own briefing
            </Link>
          )}
        </DialogTrigger>

        <span className="text-xs text-[#A69A8B] dark:text-[#6E645A]">
          Distill
        </span>
      </footer>

      <DialogContent className="gap-0 border-[#DCD2C2] bg-[#FBF6EE] p-7 sm:max-w-[440px] dark:border-[#332C24] dark:bg-[#1C1814]">
        <DialogHeader className="space-y-2 text-left">
          <DialogTitle className="font-serif text-xl font-normal tracking-tight text-[#1A1714] dark:text-[#F3EDE3]">
            Share this digest
          </DialogTitle>
          <DialogDescription className="text-sm leading-relaxed text-[#6E645A] dark:text-[#A69A8B]">
            Anyone with this link can read it. They won&apos;t need an account.
          </DialogDescription>
        </DialogHeader>

        {/* Link field */}
        <div className="mt-6 flex items-center gap-2 rounded-[10px] border border-[#DCD2C2] p-1 pl-3 dark:border-[#332C24]">
          <Input
            readOnly
            autoFocus={focus}
            placeholder={fullUrl.slice(0, 40).concat("...")}
            value={value}
            onFocus={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setValue(fullUrl);
              setFocus(true);
            }}
            onBlur={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setValue("");
              setFocus(false);
            }}
            className="h-auto transition-colors delay-150 duration-300 ease-in-out flex-1 truncate border-0 bg-transparent p-0 text-[13px] text-[#332C24] shadow-none focus-visible:ring-0 dark:text-[#A69A8B]"
          />
          <Button
            onClick={async () => {
              if (typeof navigator === undefined) {
                return;
              }

              await setClipboard(fullUrl);
              toast.success("Copied digest url");
            }}
            className="h-auto shrink-0 cursor-pointer rounded-[7px] bg-[#755815] px-3.5 py-2 text-[13px] font-normal text-[#FBF6EE] transition-colors hover:bg-[#5F4711] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#755815] dark:bg-[#D9A441] dark:text-[#14110E] dark:hover:bg-[#C4932F] dark:focus-visible:outline-[#D9A441]"
          >
            Copy
          </Button>
        </div>

        {/* Share targets */}
        <p className="mt-6 text-[11px] uppercase tracking-[0.16em] text-[#A69A8B] dark:text-[#6E645A]">
          Or share to
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          <button className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[#DCD2C2] px-3.5 py-2 text-[13px] text-[#6E645A] transition-colors hover:border-[#755815] hover:text-[#755815] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#755815] dark:border-[#332C24] dark:text-[#A69A8B] dark:hover:border-[#D9A441] dark:hover:text-[#D9A441] dark:focus-visible:outline-[#D9A441]">
            <XIcon className="h-[15px] w-[15px]" aria-hidden="true" />
            Twitter
          </button>

          <button className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[#DCD2C2] px-3.5 py-2 text-[13px] text-[#6E645A] transition-colors hover:border-[#755815] hover:text-[#755815] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#755815] dark:border-[#332C24] dark:text-[#A69A8B] dark:hover:border-[#D9A441] dark:hover:text-[#D9A441] dark:focus-visible:outline-[#D9A441]">
            <MessageCircle className="h-[15px] w-[15px]" aria-hidden="true" />
            WhatsApp
          </button>

          <button className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[#DCD2C2] px-3.5 py-2 text-[13px] text-[#6E645A] transition-colors hover:border-[#755815] hover:text-[#755815] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#755815] dark:border-[#332C24] dark:text-[#A69A8B] dark:hover:border-[#D9A441] dark:hover:text-[#D9A441] dark:focus-visible:outline-[#D9A441]">
            <Mail className="h-[15px] w-[15px]" aria-hidden="true" />
            Email
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
