"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState, useTransition } from "react";

import { DualityStage } from "@/components/duality-stage";
import { Reveal } from "@/components/reveal";

type SocialProvider = {
  id: string;
  name: string;
};

function getSignInErrorMessage(error: string | undefined) {
  switch (error) {
    case "CredentialsSignin":
      return "Invalid email or password.";
    case "OAuthAccountNotLinked":
      return "This email is already registered with a different sign-in method.";
    case "AccessDenied":
      return "Access was denied by the sign-in provider.";
    case "Configuration":
      return "Authentication is not configured correctly yet.";
    default:
      return "";
  }
}

export function SignInForm({
  callbackUrl,
  error,
  socialProviders,
}: {
  callbackUrl: string;
  error?: string;
  socialProviders: SocialProvider[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(getSignInErrorMessage(error));

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    startTransition(async () => {
      setMessage("");

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl,
      });

      if (result?.error) {
        setMessage(getSignInErrorMessage(result.error) || "Unable to sign in.");
        return;
      }

      router.push(result?.url ?? callbackUrl);
      router.refresh();
    });
  }

  return (
    <main className="page-shell py-10 md:py-14">
      <div className="grid gap-10 xl:grid-cols-[0.92fr_1.08fr] xl:items-center">
        <Reveal className="space-y-6">
          <p className="eyebrow">Customer account</p>
          <h1 className="section-title max-w-lg text-white">
            Sign in and keep the checkout fast.
          </h1>
          <p className="section-copy max-w-md">
            Use Google, Microsoft, or your email and password.
          </p>
          <DualityStage
            label="Account"
            meta="Secure"
            title="Sign In"
            footer="Protected session and server-side access checks."
            className="max-w-2xl"
          />
        </Reveal>

        <Reveal className="section-panel p-6 md:p-8" delay={90}>
          <div className="space-y-6">
            {socialProviders.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {socialProviders.map((provider) => (
                  <button
                    key={provider.id}
                    type="button"
                    onClick={() => void signIn(provider.id, { callbackUrl })}
                    className="button-secondary inline-flex items-center justify-center px-5 py-3.5"
                  >
                    {provider.name}
                  </button>
                ))}
              </div>
            ) : null}

            <div className="flex items-center gap-4 text-xs uppercase tracking-[0.24em] text-white/22">
              <span className="h-px flex-1 bg-white/8" />
              <span>Email</span>
              <span className="h-px flex-1 bg-white/8" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="space-y-2 text-sm text-white/62">
                <span>Email</span>
                <input
                  required
                  type="email"
                  className="field"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                />
              </label>

              <label className="space-y-2 text-sm text-white/62">
                <span>Password</span>
                <input
                  required
                  type="password"
                  className="field"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                />
              </label>

              <button
                type="submit"
                disabled={isPending}
                className="button-primary inline-flex w-full items-center justify-center px-5 py-3.5 disabled:cursor-wait disabled:opacity-70"
              >
                {isPending ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <div className="flex flex-col gap-3 text-sm leading-8">
              <p className={message ? "text-white" : "text-white/42"}>
                {message || "Your session stays protected with secure cookies."}
              </p>
              <p className="text-white/42">
                New here?{" "}
                <Link href="/signup" className="text-white underline underline-offset-4">
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </main>
  );
}
