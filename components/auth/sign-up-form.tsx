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

export function SignUpForm({
  callbackUrl,
  socialProviders,
}: {
  callbackUrl: string;
  socialProviders: SocialProvider[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    startTransition(async () => {
      setMessage("");

      const registerResponse = await fetch("/api/account/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          confirmPassword,
        }),
      });

      const registerPayload = await registerResponse.json();

      if (!registerResponse.ok) {
        setMessage(registerPayload.error ?? "Unable to create your account.");
        return;
      }

      const signInResult = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl,
      });

      if (signInResult?.error) {
        setMessage("Your account was created. Please sign in.");
        router.push("/signin");
        return;
      }

      router.push(signInResult?.url ?? callbackUrl);
      router.refresh();
    });
  }

  return (
    <main className="page-shell py-10 md:py-14">
      <div className="grid gap-10 xl:grid-cols-[0.92fr_1.08fr] xl:items-center">
        <Reveal className="space-y-6">
          <p className="eyebrow">Create account</p>
          <h1 className="section-title max-w-lg text-white">
            Open your customer account.
          </h1>
          <p className="section-copy max-w-md">
            Save your sign-in, move faster through checkout, and keep your account ready for future releases.
          </p>
          <DualityStage
            label="Customer"
            meta="Duality"
            title="Join Us"
            footer="Email and password, Google, or Microsoft."
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
                <span>Name</span>
                <input
                  required
                  className="field"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Your full name"
                />
              </label>

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

              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2 text-sm text-white/62">
                  <span>Password</span>
                  <input
                    required
                    type="password"
                    className="field"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="At least 10 characters"
                  />
                </label>

                <label className="space-y-2 text-sm text-white/62">
                  <span>Confirm password</span>
                  <input
                    required
                    type="password"
                    className="field"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder="Re-enter password"
                  />
                </label>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="button-primary inline-flex w-full items-center justify-center px-5 py-3.5 disabled:cursor-wait disabled:opacity-70"
              >
                {isPending ? "Creating account..." : "Create account"}
              </button>
            </form>

            <div className="flex flex-col gap-3 text-sm leading-8">
              <p className={message ? "text-white" : "text-white/42"}>
                {message ||
                  "Passwords must be at least 10 characters with uppercase, lowercase, and a number."}
              </p>
              <p className="text-white/42">
                Already have an account?{" "}
                <Link href="/signin" className="text-white underline underline-offset-4">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </main>
  );
}
