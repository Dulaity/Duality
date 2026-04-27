"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { CustomDropForm } from "@/components/custom-drop-form";
import { ProductCard } from "@/components/product-card";
import { DualityStage } from "@/components/duality-stage";
import { Reveal } from "@/components/reveal";
import { featuredProducts } from "@/lib/products";

export function HomeExperience() {
  return (
    <main className="page-shell flex flex-col gap-20 pb-20 pt-8 md:gap-28 md:pb-24 md:pt-10">
      <Reveal as="section" className="hero-grid pt-2 md:pt-6">
        <div className="space-y-8">
          <div className="hero-band">
            <p className="eyebrow">Duality / Meme Lab</p>
            <h1 className="display-title text-white">
              Wear the joke
              <br />
              anyway.
            </h1>
            <p className="display-copy max-w-xl">
              Meme shirts, anime chaos, and sports merch for jokes that probably should have stayed in the group chat.
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
              Submit a joke
            </Link>
          </div>

          <div className="stat-strip">
            <span>Meme shirts</span>
            <span>Sports merch</span>
            <span>Anime merch</span>
          </div>
        </div>

        <DualityStage
          label="New idea"
          meta="Unwearable"
          title="Group Chat"
          footer="Loud shirts for quiet intrusive thoughts."
          large
        />
      </Reveal>

      <Reveal
        as="section"
        id="featured"
        className="space-y-10 border-t border-white/8 pt-14 md:space-y-12 md:pt-16"
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <p className="eyebrow">Featured</p>
            <h2 className="section-title text-white">Fresh bad decisions.</h2>
          </div>
          <p className="section-copy max-w-md">
            The current rack: meme shirts, sports jokes, and anime tees with too much personality.
          </p>
        </div>

        <div className="grid gap-14 xl:grid-cols-2">
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
        id="custom-drop"
        className="grid gap-10 border-t border-white/8 pt-14 xl:grid-cols-[0.76fr_1.24fr] xl:items-start"
      >
        <div className="space-y-5">
          <p className="eyebrow">Submit a joke</p>
          <h2 className="section-title max-w-lg text-white">
            Got a shirt idea that should not exist?
          </h2>
          <p className="section-copy max-w-md">
            Send the joke, quantity, and context. If it works on a tee, it can become a run.
          </p>
          <div className="stat-strip">
            <span>Custom meme runs</span>
            <span>Team orders</span>
            <span>Fast replies</span>
          </div>
        </div>

        <CustomDropForm />
      </Reveal>
    </main>
  );
}
