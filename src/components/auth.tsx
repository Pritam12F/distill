"use client";

import Link from "next/link";
import { Globe } from "lucide-react";
import { useCallback, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function AuthPage({ authType }: { authType: "signin" | "signup" }) {
  const [credentialsState, setCredentialsState] = useState<{
    email: string;
    name?: string;
    password: string;
  }>({
    email: "",
    name: "",
    password: "",
  });
  const navigate = useRouter();

  const googleHandler = useCallback(async () => {
    const { data, error } = await authClient.signIn.social({
      provider: "google",
    });

    if (error) {
      toast(error.message);
      return;
    }

    if (data) {
      toast("Logged in with google");
      navigate.push("/");
    }
  }, [authType]);

  const onInputChange = useCallback(
    ({
      email,
      password,
      name,
    }: {
      email?: string;
      password?: string;
      name?: string;
    }) => {
      if (email) {
        setCredentialsState((s) => ({
          ...s,
          email,
        }));
      } else if (password) {
        setCredentialsState((s) => ({
          ...s,
          password,
        }));
      } else if (name) {
        setCredentialsState((s) => ({
          ...s,
          name,
        }));
      }
    },
    [setCredentialsState],
  );

  const loginHandler = useCallback(async () => {
    const { data, error } = await authClient.signIn.email({
      email: credentialsState.name!,
      password: credentialsState.password,
    });

    if (error) {
      toast(error.message);
      return;
    }

    if (data) {
      toast("Signed in");
      navigate.push("/");
    }
  }, [credentialsState]);

  const signupHandler = useCallback(async () => {
    const { data, error } = await authClient.signUp.email({
      name: credentialsState.name!,
      email: credentialsState.name!,
      password: credentialsState.password,
    });

    if (error) {
      toast(error.message);
      return;
    }

    if (data) {
      toast("Registered in");
      navigate.push("/");
    }
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FBF6EE] px-4 py-16 dark:bg-[#14110E]">
      <div className="flex w-full max-w-sm flex-col items-center">
        <Link
          href="/"
          className="mb-8 rounded-md font-serif text-2xl tracking-tight text-[#1A1714] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#755815] dark:text-[#F3EDE3] dark:focus-visible:ring-[#D9A441]"
        >
          distill
          <span className="text-[#755815] dark:text-[#D9A441]">.</span>
        </Link>

        <div className="w-full rounded-2xl border border-[#DCD2C2] bg-[#FBF6EE] p-8 dark:border-[#332C24] dark:bg-[#1C1814]">
          <h1 className="font-serif text-2xl tracking-tight text-[#1A1714] dark:text-[#F3EDE3]">
            {authType === "signup"
              ? "Create your account"
              : "Login with existing account"}
          </h1>
          <p className="mt-2 text-sm text-[#6E645A] dark:text-[#A69A8B]">
            Five sources, one briefing, every morning.
          </p>

          <form
            onSubmit={authType === "signin" ? loginHandler : signupHandler}
            className="mt-8 flex flex-col gap-5"
          >
            {authType === "signup" && (
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="name"
                  className="text-sm text-[#6E645A] dark:text-[#A69A8B]"
                >
                  Name
                </label>
                <input
                  onChange={(e) => {
                    onInputChange({ name: e.target.value });
                  }}
                  id="name"
                  type="text"
                  className="rounded-lg border border-[#DCD2C2] bg-transparent px-3 py-2.5 text-[#1A1714] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#755815] dark:border-[#332C24] dark:text-[#F3EDE3] dark:focus-visible:ring-[#D9A441]"
                />
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="text-sm text-[#6E645A] dark:text-[#A69A8B]"
              >
                Email
              </label>
              <input
                onChange={(e) => {
                  onInputChange({ email: e.target.value });
                }}
                id="email"
                type="email"
                placeholder="you@example.com"
                className="rounded-lg border border-[#DCD2C2] bg-transparent px-3 py-2.5 text-[#1A1714] placeholder:text-[#A69A8B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#755815] dark:border-[#332C24] dark:text-[#F3EDE3] dark:placeholder:text-[#6E645A] dark:focus-visible:ring-[#D9A441]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="password"
                className="text-sm text-[#6E645A] dark:text-[#A69A8B]"
              >
                Password
              </label>
              <input
                onChange={(e) => {
                  onInputChange({ password: e.target.value });
                }}
                id="password"
                type="password"
                className="rounded-lg border border-[#DCD2C2] bg-transparent px-3 py-2.5 text-[#1A1714] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#755815] dark:border-[#332C24] dark:text-[#F3EDE3] dark:focus-visible:ring-[#D9A441]"
              />
              {authType === "signup" && (
                <span className="text-xs text-[#A69A8B] dark:text-[#6E645A]">
                  At least 8 characters
                </span>
              )}
            </div>

            <button
              type="submit"
              className="mt-2 w-full rounded-full bg-[#755815] px-4 py-2.5 text-sm font-medium text-[#FBF6EE] transition-colors hover:bg-[#5F4711] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#755815] dark:bg-[#D9A441] dark:text-[#14110E] dark:hover:bg-[#C4932F] dark:focus-visible:ring-[#D9A441]"
            >
              {authType === "signup" ? "Create account" : "Log in"}
            </button>
          </form>

          <div className="relative my-6 flex items-center">
            <div className="h-px w-full bg-[#DCD2C2] dark:bg-[#332C24]" />
            <span className="absolute left-1/2 -translate-x-1/2 bg-[#FBF6EE] px-3 text-xs text-[#A69A8B] dark:bg-[#1C1814] dark:text-[#6E645A]">
              or
            </span>
          </div>

          <button
            type="button"
            onClick={googleHandler}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-[#DCD2C2] px-4 py-2.5 text-sm font-medium text-[#1A1714] transition-colors hover:border-[#755815] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#755815] dark:border-[#332C24] dark:text-[#F3EDE3] dark:hover:border-[#D9A441] dark:focus-visible:ring-[#D9A441]"
          >
            <Globe className="size-4" aria-hidden="true" />
            Continue with Google
          </button>

          <p className="mt-6 text-center text-sm text-[#6E645A] dark:text-[#A69A8B]">
            {authType === "signin"
              ? "Already have an account?"
              : "Don't have an account?"}
            <Link
              href={`${authType === "signin" ? "/signup" : "/signin"}`}
              className="font-medium text-[#755815] px-2 underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#755815] dark:text-[#D9A441] dark:focus-visible:ring-[#D9A441]"
            >
              {authType === "signin" ? "Sign up" : "Sign in"}
            </Link>
          </p>
        </div>

        {authType === "signup" && (
          <p className="mt-6 text-center text-xs text-[#A69A8B] dark:text-[#6E645A]">
            By continuing you agree to our{" "}
            <Link
              href="/terms"
              className="underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#755815] dark:focus-visible:ring-[#D9A441]"
            >
              Terms
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#755815] dark:focus-visible:ring-[#D9A441]"
            >
              Privacy Policy
            </Link>
            .
          </p>
        )}
      </div>
    </main>
  );
}
