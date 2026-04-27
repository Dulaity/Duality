import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";

import { Reveal } from "@/components/reveal";
import { SignOutButton } from "@/components/sign-out-button";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Account",
  description: "View your Duality customer account.",
};

const providerLabels: Record<string, string> = {
  google: "Google",
  "azure-ad": "Microsoft",
};

export default async function AccountPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/signin?callbackUrl=/account");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      accounts: {
        select: {
          provider: true,
        },
      },
    },
  });

  if (!user) {
    redirect("/signin?callbackUrl=/account");
  }

  const linkedMethods = [
    ...(user.passwordHash ? ["Email and password"] : []),
    ...user.accounts
      .map((account) => providerLabels[account.provider] ?? account.provider)
      .filter((value, index, values) => values.indexOf(value) === index),
  ];

  return (
    <main className="page-shell flex flex-col gap-14 pb-20 pt-8 md:gap-16 md:pb-24 md:pt-10">
      <Reveal as="section" className="space-y-5 pt-2 md:pt-6">
        <p className="eyebrow">Customer account</p>
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <h1 className="section-title text-white">
              Welcome back,
              <br />
              {user.name?.split(" ")[0] ?? "Customer"}.
            </h1>
            <p className="section-copy max-w-lg">
              Signed in as {user.email ?? "No email available"}.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/store"
              className="button-secondary inline-flex items-center justify-center px-5 py-3.5"
            >
              Continue shopping
            </Link>
            <SignOutButton className="button-primary inline-flex items-center justify-center px-5 py-3.5" />
          </div>
        </div>
      </Reveal>

      <section className="grid gap-8 xl:grid-cols-2">
        <Reveal className="section-panel p-6 md:p-8">
          <div className="space-y-5">
            <p className="eyebrow">Profile</p>
            <div className="info-rows">
              <div className="info-row">
                <span className="text-white/34">Name</span>
                <span className="max-w-[18rem] text-right">{user.name ?? "Not set"}</span>
              </div>
              <div className="info-row">
                <span className="text-white/34">Email</span>
                <span className="max-w-[18rem] text-right">{user.email ?? "Not set"}</span>
              </div>
              <div className="info-row">
                <span className="text-white/34">Joined</span>
                <span className="max-w-[18rem] text-right">
                  {new Intl.DateTimeFormat("en-IN", {
                    dateStyle: "medium",
                  }).format(user.createdAt)}
                </span>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal className="section-panel p-6 md:p-8" delay={80}>
          <div className="space-y-5">
            <div className="space-y-3">
              <p className="eyebrow">Access</p>
              <h2 className="font-display text-4xl text-white">
                Linked methods.
              </h2>
            </div>

            <div className="info-rows">
              {linkedMethods.map((method) => (
                <div key={method} className="info-row">
                  <span>{method}</span>
                  <span className="text-white/34">Active</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
