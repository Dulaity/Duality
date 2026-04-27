import { UserActions } from "@/components/admin/user-actions";
import { requireAdminPage } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/products";

export default async function AdminUsersPage() {
  const admin = await requireAdminPage("/admin/users");
  const users = await prisma.user.findMany({
    include: {
      accounts: {
        select: {
          provider: true,
        },
      },
      orders: {
        select: {
          total: true,
          status: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <section className="section-panel p-6 md:p-8">
      <div>
        <p className="eyebrow">Accounts</p>
        <h2 className="font-display text-4xl text-white">
          Customer access.
        </h2>
      </div>

      <div className="admin-table mt-8">
        <div className="admin-table-row admin-table-head admin-user-row">
          <span>User</span>
          <span>Login</span>
          <span>Orders</span>
          <span>Revenue</span>
          <span>Manage</span>
        </div>
        {users.map((user) => {
          const revenue = user.orders
            .filter((order) => order.status === "captured")
            .reduce((sum, order) => sum + order.total, 0);
          const loginMethods = [
            user.passwordHash ? "Email" : null,
            ...user.accounts.map((account) => account.provider),
          ].filter(Boolean);

          return (
            <div key={user.id} className="admin-table-row admin-user-row">
              <span>
                <strong>{user.name ?? "Unnamed user"}</strong>
                <small>
                  {user.email ?? "No email"} / {user.role}
                </small>
              </span>
              <span>{loginMethods.join(", ") || "Unknown"}</span>
              <span>{user.orders.length}</span>
              <span>{formatPrice(revenue)}</span>
              <UserActions
                userId={user.id}
                currentRole={user.role}
                disabled={user.id === admin.id}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}
