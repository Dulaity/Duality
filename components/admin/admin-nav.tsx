"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const adminLinks = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/ideas", label: "Idea submissions" },
  { href: "/admin/users", label: "Accounts" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="admin-nav" aria-label="Admin navigation">
      {adminLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`admin-nav-link ${
            pathname === link.href || pathname.startsWith(`${link.href}/`)
              ? "admin-nav-link-active"
              : ""
          }`}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
