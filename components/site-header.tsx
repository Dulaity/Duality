"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CircleUserRound, ShoppingBag } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";

import { SignOutButton } from "@/components/sign-out-button";
import { useCart } from "@/components/cart-provider";

const navigation = [
  { href: "/store", label: "Store" },
  { href: "/#featured", label: "Featured" },
  { href: "/#custom-drop", label: "Submit Joke" },
];

function isActivePath(currentPath: string, href: string) {
  if (href.startsWith("/#")) {
    return false;
  }

  return currentPath.startsWith(href);
}

function AccountMenu({
  isAuthenticated,
  pathname,
}: {
  isAuthenticated: boolean;
  pathname: string;
}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div className="account-menu" ref={menuRef}>
      <button
        type="button"
        className={`account-menu-trigger ${open ? "account-menu-trigger-active" : ""}`}
        aria-label="Open account menu"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((value) => !value)}
      >
        <CircleUserRound className="h-5 w-5" aria-hidden="true" />
      </button>

      {open ? (
        <div className="account-menu-panel" role="menu">
          {isAuthenticated ? (
            <>
              <Link
                href="/account"
                className={`account-menu-item ${pathname === "/account" ? "account-menu-item-active" : ""}`}
                role="menuitem"
                onClick={() => setOpen(false)}
              >
                Account
              </Link>
              <Link
                href="/account/orders"
                className={`account-menu-item ${pathname.startsWith("/account/orders") ? "account-menu-item-active" : ""}`}
                role="menuitem"
                onClick={() => setOpen(false)}
              >
                Orders
              </Link>
              <SignOutButton className="account-menu-item account-menu-danger" />
            </>
          ) : (
            <>
              <Link
                href="/signin"
                className="account-menu-item"
                role="menuitem"
                onClick={() => setOpen(false)}
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="account-menu-item account-menu-item-active"
                role="menuitem"
                onClick={() => setOpen(false)}
              >
                Create account
              </Link>
            </>
          )}
        </div>
      ) : null}
    </div>
  );
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
            {status === "loading" ? null : (
              <AccountMenu
                key={pathname}
                isAuthenticated={isAuthenticated}
                pathname={pathname}
              />
            )}

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
