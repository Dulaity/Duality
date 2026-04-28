import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { ArrowLeft, ShoppingBag } from "lucide-react";

import { Reveal } from "@/components/reveal";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Orders",
  description: "View your recent Duality orders.",
};

function formatOrderDate(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
  }).format(date);
}

function humanizeStatus(status: string) {
  return status
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default async function AccountOrdersPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/signin?callbackUrl=/account/orders");
  }

  const orders = await prisma.order.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      items: {
        orderBy: {
          name: "asc",
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 12,
  });

  return (
    <main className="page-shell flex flex-col gap-10 pb-16 pt-5 md:gap-16 md:pb-24 md:pt-10">
      <Reveal as="section" className="space-y-4 pt-1 md:space-y-6 md:pt-6">
        <Link
          href="/account"
          className="button-secondary inline-flex w-fit items-center gap-2 px-4 py-2.5"
        >
          <ArrowLeft className="h-4 w-4" />
          Account
        </Link>

        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <p className="eyebrow">Order history</p>
            <h1 className="section-title text-white">Recent orders.</h1>
            <p className="section-copy max-w-xl">
              Track the shirts you checked out while signed in.
            </p>
          </div>

          <Link
            href="/store"
            className="button-primary inline-flex items-center justify-center gap-2 px-5 py-3.5"
          >
            <ShoppingBag className="h-4 w-4" />
            Shop more
          </Link>
        </div>
      </Reveal>

      {orders.length === 0 ? (
        <Reveal as="section" className="section-panel p-8 text-center md:p-12">
          <p className="eyebrow">No orders yet</p>
          <h2 className="mt-4 font-display text-4xl text-white">
            Your rack is empty.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-8 text-white/52">
            Orders appear here after a signed-in checkout is verified.
          </p>
          <Link
            href="/store"
            className="button-primary mt-6 inline-flex items-center justify-center gap-2 px-5 py-3.5"
          >
            Browse store
          </Link>
        </Reveal>
      ) : (
        <section className="grid gap-6 md:gap-8">
          {orders.map((order, index) => (
            <Reveal
              key={order.id}
              as="article"
              className="section-panel p-6 md:p-8"
              delay={index * 50}
            >
              <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_16rem] lg:items-start">
                <div className="space-y-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-2">
                      <p className="eyebrow">{formatOrderDate(order.createdAt)}</p>
                      <h2 className="font-display text-4xl text-white">
                        {order.code}
                      </h2>
                    </div>
                    <span className="filter-chip filter-chip-active w-fit">
                      {humanizeStatus(order.status)}
                    </span>
                  </div>

                  <div className="grid gap-3">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-col gap-1 border-t border-white/8 pt-3 text-sm leading-7 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <span className="font-semibold text-white">
                          {item.name}
                        </span>
                        <span className="text-white/46">
                          Size {item.size} / Qty {item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="info-rows">
                  <div className="info-row">
                    <span className="text-white/34">Total</span>
                    <span>{order.totalLabel}</span>
                  </div>
                  <div className="info-row">
                    <span className="text-white/34">Fulfillment</span>
                    <span>{humanizeStatus(order.fulfillmentStatus)}</span>
                  </div>
                  <div className="info-row">
                    <span className="text-white/34">Ship to</span>
                    <span className="max-w-[14rem] text-right">
                      {order.city}, {order.state}
                    </span>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </section>
      )}
    </main>
  );
}
