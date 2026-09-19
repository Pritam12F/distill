"use client";

import { Trash2 } from "lucide-react";
import {
  Dispatch,
  Fragment,
  SetStateAction,
  useCallback,
  useState,
} from "react";
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function DangerZone() {
  const [modalState, setModalState] = useState(false);

  return (
    <Fragment>
      <section className="flex flex-col gap-4">
        <p className="text-xs font-medium tracking-widest uppercase text-[#8A3A24] dark:text-[#D98A70]">
          Danger zone
        </p>

        <p className="text-sm text-[#6E645A] dark:text-[#A69A8B]">
          Deleting your account removes every digest and topic. This can&apos;t
          be undone.
        </p>

        <button
          type="button"
          onClick={() => {
            setModalState(true);
          }}
          className="inline-flex cursor-pointer w-fit items-center gap-2 rounded-full border border-[#E8CFC6] px-4 py-2 text-sm font-medium text-[#8A3A24] transition-colors hover:bg-[#F7E7E1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#755815] dark:border-[#3A2019] dark:text-[#D98A70] dark:hover:bg-[#2A1A15] dark:focus-visible:ring-[#D9A441]"
        >
          <Trash2 className="size-4" aria-hidden="true" />
          Delete account
        </button>
      </section>
      <ConfirmDeleteDialog isOpen={modalState} setOpen={setModalState} />
    </Fragment>
  );
}

export function ConfirmDeleteDialog({
  isOpen,
  setOpen,
}: {
  isOpen: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const session = authClient.useSession();
  const navigate = useRouter();

  const onConfirm = useCallback(async () => {
    if (!session) {
      return;
    }

    try {
      const resp = await authClient.deleteUser();

      if (resp.data?.success) {
        toast("Logged out");
        navigate.push("/");
      }
    } catch {
      toast.error("Error signing out");
    }
  }, [setOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={() => setOpen((s) => !s)}>
      <DialogContent className="gap-0 border-[#DCD2C2] bg-[#FBF6EE] p-7 sm:max-w-[440px] dark:border-[#332C24] dark:bg-[#1C1814]">
        <DialogHeader className="space-y-2 text-left">
          <DialogTitle className="font-serif text-xl font-normal tracking-tight text-[#1A1714] dark:text-[#F3EDE3]">
            Delete your account?
          </DialogTitle>
          <DialogDescription className="text-sm leading-relaxed text-[#6E645A] dark:text-[#A69A8B]">
            Every digest, topic and reaction will be removed. This can&apos;t be
            undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-7 flex-row justify-end gap-2.5 sm:gap-2.5">
          <Button
            onClick={() => setOpen(false)}
            className="h-auto cursor-pointer rounded-full border border-[#DCD2C2] bg-transparent px-4 py-2 text-[13px] font-normal text-[#6E645A] transition-colors hover:border-[#755815] hover:bg-transparent hover:text-[#755815] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#755815] dark:border-[#332C24] dark:text-[#A69A8B] dark:hover:border-[#D9A441] dark:hover:text-[#D9A441] dark:focus-visible:outline-[#D9A441]"
          >
            Cancel
          </Button>

          <Button
            onClick={onConfirm}
            className="h-auto cursor-pointer rounded-full bg-[#8A3A24] px-4 py-2 text-[13px] font-normal text-[#FBF6EE] transition-colors hover:bg-[#73301E] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8A3A24] dark:bg-[#B8563A] dark:text-[#FBF6EE] dark:hover:bg-[#A04A31] dark:focus-visible:outline-[#B8563A]"
          >
            Delete account
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
