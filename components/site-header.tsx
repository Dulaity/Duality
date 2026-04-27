"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import { useSession } from "next-auth/react";

import { SignOutButton } from "@/components/sign-out-button";
import { useCart } from "@/components/cart-provider";

const navigation = [
  { href: "/store", label: "Store" },
  { href: "/#featured", label: "Featured" },
  { href: "/#custom-drop", label: "Submit Joke" },
];

function isActivePath(currentPath: string, href: string) {
  if (href.startsWith("/#")) {
    return currentPath === "/";
  }

  return currentPath.startsWith(href);
}

export function SiteHeader() {
  const pathname = usePathname();
  const { cartCount, hydrated } = useCart();
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated" && Boolean(session?.user);

  return (
    <header className="site-header-shell">
      <div className="page-shell pb-3 pt-4 md:pb-4 md:pt-5">
        <div className="site-header-bar">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <span className="brand-mark shrink-0" />
            <div className="min-w-0">
              <p className="truncate font-display text-xl text-white">
                Duality
              </p>
              <p className="truncate text-[0.64rem] uppercase tracking-[0.24em] text-white/34">
                Memewear
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-2 md:flex">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-link ${isActivePath(pathname, item.href) ? "nav-link-active" : ""}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {status === "loading" ? null : isAuthenticated ? (
              <>
                <div className="header-action-group hidden md:flex">
                  <Link
                    href="/account"
                    className="header-action-link header-action-link-active"
                  >
                    Account
                  </Link>
                  <SignOutButton className="header-action-link" />
                </div>
              </>
            ) : (
              <>
                <div className="header-action-group hidden md:flex">
                  <Link href="/signin" className="header-action-link">
                    Sign in
                  </Link>
                  <Link
                    href="/signup"
                    className="header-action-link header-action-link-active"
                  >
                    Create account
                  </Link>
                </div>
              </>
            )}

            <Link
              href={isAuthenticated ? "/account" : "/signin"}
              className="button-secondary inline-flex items-center justify-center px-3 py-2 text-sm md:hidden"
            >
              {isAuthenticated ? "Account" : "Sign in"}
            </Link>

            <Link
              href="/cart"
              className="button-secondary inline-flex items-center gap-2 px-4 py-2.5"
            >
              <ShoppingBag className="h-4 w-4" />
              <span className="hidden sm:inline">Cart</span>
              <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-black">
                {hydrated ? cartCount : 0}
              </span>
            </Link>
          </div>
        </div>

        <nav className="mobile-scroll md:hidden">
          <div className="mt-3 flex gap-2 pb-1">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-link whitespace-nowrap ${isActivePath(pathname, item.href) ? "nav-link-active" : ""}`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}
