import Link from "next/link";

const brandEmail = process.env.NEXT_PUBLIC_BRAND_EMAIL ?? "dualitymerch@gmail.com";

export function SiteFooter() {
  return (
    <footer className="pb-12 pt-28 md:pb-14 md:pt-36">
      <div className="page-shell">
        <div className="footer-bridge" aria-hidden="true" />
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="brand-mark shrink-0" />
              <div>
                <p className="font-display text-2xl text-white">
                  Duality
                </p>
                <p className="text-[0.68rem] uppercase tracking-[0.24em] text-white/32">
                  Meme shirts
                </p>
              </div>
            </div>
            <p className="max-w-md text-sm leading-8 text-white/46">
              Clothes that help internet-native people recognize each other in real life.
            </p>
          </div>

          <div className="grid gap-8 text-sm text-white/52 sm:grid-cols-2">
            <div className="space-y-3">
              <p className="eyebrow">Explore</p>
              <Link href="/store" className="block transition hover:text-white">
                Store
              </Link>
              <Link href="/cart" className="block transition hover:text-white">
                Cart
              </Link>
              <Link href="/account" className="block transition hover:text-white">
                Account
              </Link>
            </div>

            <div className="space-y-3">
              <p className="eyebrow">Contact</p>
              <a href={`mailto:${brandEmail}`} className="block transition hover:text-white">
                {brandEmail}
              </a>
              <p>Secure checkout</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
