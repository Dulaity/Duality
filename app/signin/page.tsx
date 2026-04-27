import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";

import { SignInForm } from "@/components/auth/sign-in-form";
import { authOptions, getEnabledSocialProviders } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your Duality customer account.",
};

function getSafeCallbackUrl(callbackUrl: string | undefined) {
  if (!callbackUrl) {
    return "/account";
  }

  if (callbackUrl.startsWith("/") && !callbackUrl.startsWith("//")) {
    return callbackUrl;
  }

  try {
    const parsedUrl = new URL(callbackUrl);
    const configuredSiteUrl =
      process.env.NEXT_PUBLIC_SITE_URL ?? process.env.NEXTAUTH_URL;
    const siteUrl = configuredSiteUrl ? new URL(configuredSiteUrl) : null;

    if (siteUrl && parsedUrl.origin === siteUrl.origin) {
      return `${parsedUrl.pathname}${parsedUrl.search}${parsedUrl.hash}`;
    }
  } catch {
    return "/account";
  }

  return "/account";
}

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const session = await getServerSession(authOptions);
  const { callbackUrl, error } = await searchParams;
  const safeCallbackUrl = getSafeCallbackUrl(callbackUrl);

  if (session) {
    redirect(safeCallbackUrl);
  }

  return (
    <SignInForm
      callbackUrl={safeCallbackUrl}
      error={error}
      socialProviders={getEnabledSocialProviders()}
    />
  );
}
