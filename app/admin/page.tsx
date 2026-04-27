import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/products";

function monthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function monthLabel(key: string) {
  const [year, month] = key.split("-").map(Number);

  return new Intl.DateTimeFormat("en-IN", {
    month: "short",
  }).format(new Date(year, (month ?? 1) - 1, 1));
}

export default async function AdminDashboardPage() {
  const [orders, usersCount, productsCount, soldOutProducts, orderItems] =
    await Promise.all([
      prisma.order.findMany({
        where: {
          status: "captured",
        },
        select: {
          id: true,
          total: true,
          createdAt: true,
        },
      }),
      prisma.user.count(),
      prisma.product.count(),
      prisma.product.findMany({
        where: {
          inventory: 0,
          active: true,
        },
        orderBy: {
          updatedAt: "desc",
        },
        take: 6,
      }),
      prisma.orderItem.findMany({
        where: {
          order: {
            status: "captured",
          },
        },
        select: {
          slug: true,
          name: true,
          quantity: true,
          lineTotal: true,
        },
      }),
    ]);

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const soldUnits = orderItems.reduce((sum, item) => sum + item.quantity, 0);
  const averageOrderValue =
    orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;
  const topProducts = Array.from(
    orderItems.reduce(
      (map, item) => {
        const current = map.get(item.slug) ?? {
          slug: item.slug,
          name: item.name,
          quantity: 0,
          revenue: 0,
        };

        current.quantity += item.quantity;
        current.revenue += item.lineTotal;
        map.set(item.slug, current);

        return map;
      },
      new Map<
        string,
        { slug: string; name: string; quantity: number; revenue: number }
      >(),
    ),
  )
    .map(([, value]) => value)
    .sort((left, right) => right.quantity - left.quantity)
    .slice(0, 5);
  const monthKeys = Array.from({ length: 6 }, (_, index) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - index));

    return monthKey(date);
  });
  const monthlyRevenue = monthKeys.map((key) => {
    const revenue = orders
      .filter((order) => monthKey(order.createdAt) === key)
      .reduce((sum, order) => sum + order.total, 0);

    return {
      key,
      revenue,
    };
  });
  const maxMonthlyRevenue = Math.max(
    ...monthlyRevenue.map((item) => item.revenue),
    1,
  );

  return (
    <div className="grid gap-8">
      <section className="admin-metric-grid">
        <div className="admin-metric-card">
          <span>Total revenue</span>
          <strong>{formatPrice(totalRevenue)}</strong>
          <small>Captured payments only</small>
        </div>
        <div className="admin-metric-card">
          <span>Orders</span>
          <strong>{orders.length}</strong>
          <small>{soldUnits} shirts sold</small>
        </div>
        <div className="admin-metric-card">
          <span>Average order</span>
          <strong>{formatPrice(averageOrderValue)}</strong>
          <small>Revenue / captured orders</small>
        </div>
        <div className="admin-metric-card">
          <span>Customers</span>
          <strong>{usersCount}</strong>
          <small>{productsCount} products in catalog</small>
        </div>
      </section>

      <section className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="section-panel p-6 md:p-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow">Sales</p>
              <h2 className="font-display text-4xl text-white">
                Revenue trend.
              </h2>
            </div>
            <Link href="/admin/orders" className="button-secondary px-4 py-2.5">
              Open orders
            </Link>
          </div>

          <div className="admin-chart mt-8">
            {monthlyRevenue.map((item) => (
              <div key={item.key} className="admin-chart-column">
                <div
                  className="admin-chart-bar"
                  style={{
                    height: `${Math.max(8, (item.revenue / maxMonthlyRevenue) * 100)}%`,
                  }}
                />
                <span>{monthLabel(item.key)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="section-panel p-6 md:p-8">
          <p className="eyebrow">Sold out</p>
          <h2 className="mt-3 font-display text-4xl text-white">
            Needs restock.
          </h2>
          <div className="mt-6 grid gap-3">
            {soldOutProducts.length > 0 ? (
              soldOutProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/admin/products/${product.id}/edit`}
                  className="admin-list-row"
                >
                  <span>{product.name}</span>
                  <small>{product.sku}</small>
                </Link>
              ))
            ) : (
              <div className="admin-list-row">
                <span>No sold-out shirts</span>
                <small>Inventory is healthy</small>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="section-panel p-6 md:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Top shirts</p>
            <h2 className="font-display text-4xl text-white">
              What people bought.
            </h2>
          </div>
          <Link href="/admin/products" className="button-primary px-4 py-2.5">
            Manage products
          </Link>
        </div>

        <div className="admin-table mt-8">
          <div className="admin-table-row admin-table-head">
            <span>Product</span>
            <span>Units</span>
            <span>Revenue</span>
          </div>
          {topProducts.length > 0 ? (
            topProducts.map((product) => (
              <div key={product.slug} className="admin-table-row">
                <span>{product.name}</span>
                <span>{product.quantity}</span>
                <span>{formatPrice(product.revenue)}</span>
              </div>
            ))
          ) : (
            <div className="admin-table-row">
              <span>No captured sales yet</span>
              <span>0</span>
              <span>{formatPrice(0)}</span>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
