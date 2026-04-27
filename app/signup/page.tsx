import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";

import { SignUpForm } from "@/components/auth/sign-up-form";
import { authOptions, getEnabledSocialProviders } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create a Duality customer account.",
};

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/account");
  }

  const { callbackUrl } = await searchParams;

  return (
    <SignUpForm
      callbackUrl={callbackUrl ?? "/account"}
      socialProviders={getEnabledSocialProviders()}
    />
  );
}
