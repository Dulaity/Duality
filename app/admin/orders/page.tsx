import { OrderActions } from "@/components/admin/order-actions";
import { prisma } from "@/lib/prisma";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: {
      items: {
        orderBy: {
          name: "asc",
        },
      },
      user: {
        select: {
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 50,
  });

  return (
    <section className="section-panel p-6 md:p-8">
      <div>
        <p className="eyebrow">Orders</p>
        <h2 className="font-display text-4xl text-white">
          Fulfillment desk.
        </h2>
      </div>

      <div className="mt-8 grid gap-5">
        {orders.length > 0 ? (
          orders.map((order) => (
            <article key={order.id} className="admin-order-card">
              <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_24rem]">
                <div className="space-y-4">
                  <div>
                    <p className="eyebrow">{formatDate(order.createdAt)}</p>
                    <h3 className="font-display text-3xl text-white">
                      {order.code}
                    </h3>
                    <p className="text-sm leading-7 text-white/52">
                      {order.customerName} / {order.email || order.user?.email}
                    </p>
                    <p className="text-sm leading-7 text-white/52">
                      {order.address1}, {order.city}, {order.state} {order.postalCode}
                    </p>
                  </div>

                  <div className="grid gap-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="admin-list-row">
                        <span>
                          {item.name} / {item.size}
                        </span>
                        <small>
                          Qty {item.quantity} / {order.totalLabel}
                        </small>
                      </div>
                    ))}
                  </div>
                </div>

                <OrderActions
                  orderId={order.id}
                  status={order.status}
                  fulfillmentStatus={order.fulfillmentStatus}
                />
              </div>
            </article>
          ))
        ) : (
          <div className="admin-order-card">
            <p className="eyebrow">No orders</p>
            <h3 className="mt-3 font-display text-3xl text-white">
              Orders will appear here after checkout.
            </h3>
          </div>
        )}
      </div>
    </section>
  );
}
