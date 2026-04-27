import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";

import { SignInForm } from "@/components/auth/sign-in-form";
import { authOptions, getEnabledSocialProviders } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your Duality customer account.",
};

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/account");
  }

  const { callbackUrl, error } = await searchParams;

  return (
    <SignInForm
      callbackUrl={callbackUrl ?? "/account"}
      error={error}
      socialProviders={getEnabledSocialProviders()}
    />
  );
}
