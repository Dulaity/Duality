import type { Metadata } from "next";
import Link from "next/link";

import { AdminNav } from "@/components/admin/admin-nav";
import { requireAdminPage } from "@/lib/admin";

export const metadata: Metadata = {
  title: "Admin",
  description: "Duality store administration.",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await requireAdminPage("/admin");

  return (
    <main className="page-shell flex flex-col gap-10 pb-20 pt-8 md:pb-24 md:pt-10">
      <section className="admin-shell">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <p className="eyebrow">Admin console</p>
            <h1 className="section-title text-white">Run the store.</h1>
            <p className="section-copy max-w-xl">
              Signed in as {admin.email}. Product, order, and account changes here affect the live store.
            </p>
          </div>

          <Link
            href="/store"
            className="button-secondary inline-flex w-fit items-center justify-center px-5 py-3.5"
          >
            View storefront
          </Link>
        </div>

        <AdminNav />
      </section>

      {children}
    </main>
  );
}
