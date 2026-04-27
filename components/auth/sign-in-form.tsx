"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState, useTransition } from "react";

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

function normalizePasswordInput(value: string) {
  const trimmedValue = value.trim();
  const envPasswordPrefix = "ADMIN_" + "PASSWORD=";

  if (trimmedValue.startsWith(envPasswordPrefix)) {
    return trimmedValue
      .slice(envPasswordPrefix.length)
      .trim()
      .replace(/^["']|["']$/g, "");
  }

  return trimmedValue;
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

      try {
        const normalizedEmail = email.trim().toLowerCase();
        const normalizedPassword = normalizePasswordInput(password);

        if (!normalizedEmail || !normalizedPassword) {
          setMessage("Enter both email and password.");
          return;
        }

        const result = await signIn("credentials", {
          email: normalizedEmail,
          password: normalizedPassword,
          redirect: false,
          callbackUrl,
        });

        if (result?.error) {
          setMessage(getSignInErrorMessage(result.error) || "Unable to sign in.");
          return;
        }

        router.push(result?.url ?? callbackUrl);
        router.refresh();
      } catch {
        setMessage("Sign in could not be completed. Please try again.");
      }
    });
  }

  return (
    <main className="page-shell py-8 md:py-14">
      <div className="auth-layout">
        <Reveal className="auth-intro-panel order-2 space-y-6 xl:order-1">
          <p className="eyebrow">Customer account</p>
          <h1 className="section-title max-w-lg text-white">
            Sign in and keep the checkout fast.
          </h1>
          <p className="section-copy max-w-md">
            Use Google, Microsoft, or your email and password.
          </p>
          <div className="auth-note-grid">
            <span>Saved checkout details</span>
            <span>Recent order history</span>
            <span>Secure session cookies</span>
          </div>
        </Reveal>

        <Reveal className="auth-card section-panel order-1 p-6 md:p-8 xl:order-2" delay={90}>
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="eyebrow">Welcome back</p>
              <h2 className="font-display text-4xl text-white">Sign in.</h2>
            </div>

            {socialProviders.length > 0 ? (
              <div className="auth-social-grid">
                {socialProviders.map((provider) => (
                  <button
                    key={provider.id}
                    type="button"
                    onClick={() => void signIn(provider.id, { callbackUrl })}
                    className="button-secondary inline-flex items-center justify-center px-5 py-3.5"
                  >
                    Continue with {provider.name}
                  </button>
                ))}
              </div>
            ) : null}

            <div className="form-divider">
              <span />
              <span>Email</span>
              <span />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="space-y-2 text-sm text-white/62">
                <span>Email</span>
                <input
                  required
                  type="email"
                  name="email"
                  autoComplete="email"
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
                  name="password"
                  autoComplete="current-password"
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
              <p
                role={message ? "alert" : undefined}
                className={message ? "auth-error-message" : "text-white/42"}
              >
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
