import Link from "next/link";
import { Reveal } from "@/components/reveal";

export default function NotFound() {
  return (
    <main className="page-shell py-12 md:py-16">
      <Reveal as="section" className="section-panel p-10 text-center md:p-14">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-5">
          <p className="eyebrow">404</p>
          <h1 className="section-title text-white">This page is not on the rack.</h1>
          <p className="section-copy max-w-xl">
            The route may be outdated, or the product has moved. Head back to the storefront and take a fresh path.
          </p>
          <Link
            href="/store"
            className="button-primary inline-flex items-center gap-2 px-5 py-3.5"
          >
            Return to store
          </Link>
        </div>
      </Reveal>
    </main>
  );
}
