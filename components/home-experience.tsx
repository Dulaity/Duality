"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { CustomDropForm } from "@/components/custom-drop-form";
import { MemeDropWall } from "@/components/meme-drop-wall";
import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/reveal";
import type { Product } from "@/lib/products";

export function HomeExperience({
  featuredProducts,
}: {
  featuredProducts: Product[];
}) {
  return (
    <main className="page-shell flex flex-col gap-12 pb-16 pt-5 md:gap-28 md:pb-24 md:pt-10">
      <Reveal as="section" className="hero-grid pt-1 md:pt-6">
        <div className="space-y-6 md:space-y-8">
          <div className="hero-band">
            <p className="eyebrow">Duality / Meme Lab</p>
            <h1 className="display-title text-white">
              Wear the
              <br />
              internet.
            </h1>
            <p className="display-copy max-w-xl">
              Unwearable memes, dark humor, and niche designs for people who get it.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/store"
              className="button-primary inline-flex items-center justify-center gap-2 px-6 py-3.5"
            >
              Shop shirts
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/#custom-drop"
              className="button-secondary inline-flex items-center justify-center px-6 py-3.5"
            >
              Submit a cursed idea
            </Link>
          </div>

          <div className="stat-strip">
            <span>Wearable internet culture</span>
            <span>If you get it, you get it</span>
            <span>Fashion with lore</span>
          </div>
        </div>

        <MemeDropWall products={featuredProducts} />
      </Reveal>

      <Reveal
        as="section"
        id="featured"
        className="space-y-8 border-t border-white/8 pt-10 md:space-y-12 md:pt-16"
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <p className="eyebrow">Featured</p>
            <h2 className="section-title text-white">Conversation starters.</h2>
          </div>
          <p className="section-copy max-w-md">
            Clothes that help internet-native people recognize each other in real life.
          </p>
        </div>

        <div className="grid gap-10 md:gap-14 xl:grid-cols-2">
          {featuredProducts.map((product, index) => (
            <Reveal
              key={product.slug}
              delay={index * 80}
              className="h-full"
            >
              <ProductCard product={product} compact={index > 1} />
            </Reveal>
          ))}
        </div>
      </Reveal>

      <Reveal
        as="section"
        className="grid gap-6 border-t border-white/8 pt-10 md:gap-8 md:pt-16 xl:grid-cols-[0.7fr_1.3fr] xl:items-start"
      >
        <div className="space-y-3">
          <p className="eyebrow">About Duality</p>
          <h2 className="section-title max-w-lg text-white">
            Wearable internet culture.
          </h2>
        </div>

        <div className="section-panel space-y-6 p-6 md:p-8">
          <p className="section-copy">
            We started Duality because every clothing brand looked the same.
          </p>
          <p className="section-copy">
            We wanted shirts that felt like internet culture: weird, niche,
            ironic, and unexpectedly relatable.
          </p>
          <p className="section-copy">
            Some designs are memes. Some are dark humor. Some make absolutely
            no sense unless you&apos;ve spent too much time online.
          </p>
          <p className="section-copy font-semibold text-white">
            That&apos;s the point.
          </p>
        </div>
      </Reveal>

      <Reveal
        as="section"
        id="custom-drop"
        className="grid gap-7 border-t border-white/8 pt-10 md:gap-10 md:pt-14 xl:grid-cols-[0.76fr_1.24fr] xl:items-start"
      >
        <div className="space-y-5">
          <p className="eyebrow">Submit a joke</p>
          <h2 className="section-title max-w-lg text-white">
            Got a shirt idea that absolutely should not exist?
          </h2>
          <p className="section-copy max-w-md">
            Send us your cursed idea. We might actually print it.
          </p>
          <div className="stat-strip">
            <span>Designed like a late-night group chat</span>
            <span>Your humor, but embroidered</span>
            <span>Low attention span fashion</span>
          </div>
        </div>

        <CustomDropForm />
      </Reveal>
    </main>
  );
}
