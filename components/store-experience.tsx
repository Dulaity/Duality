"use client";

import { Search } from "lucide-react";
import { useDeferredValue, useState } from "react";

import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/reveal";
import { shirtCategories, type Product } from "@/lib/products";

const sortOptions = [
  { label: "Featured", value: "featured" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
];

export function StoreExperience({ products }: { products: Product[] }) {
  const [query, setQuery] = useState("");
  const [collection, setCollection] = useState("All");
  const [fit, setFit] = useState("All");
  const [sort, setSort] = useState("featured");
  const deferredQuery = useDeferredValue(query);
  const collections = ["All", ...shirtCategories];
  const fits = [
    "All",
    ...Array.from(new Set(products.map((product) => product.fit))),
  ];

  const visibleProducts = [...products]
    .filter((product) => {
      const matchesCollection =
        collection === "All" || product.collection === collection;
      const matchesFit = fit === "All" || product.fit === fit;
      const normalizedQuery = deferredQuery.trim().toLowerCase();
      const matchesQuery =
        normalizedQuery.length === 0 ||
        product.name.toLowerCase().includes(normalizedQuery) ||
        product.collection.toLowerCase().includes(normalizedQuery) ||
        product.description.toLowerCase().includes(normalizedQuery) ||
        product.category.toLowerCase().includes(normalizedQuery);

      return matchesCollection && matchesFit && matchesQuery;
    })
    .sort((left, right) => {
      if (sort === "price-asc") {
        return left.price - right.price;
      }

      if (sort === "price-desc") {
        return right.price - left.price;
      }

      return 0;
    });

  return (
    <main className="page-shell flex flex-col gap-14 pb-20 pt-8 md:gap-16 md:pb-24 md:pt-10">
      <Reveal as="section" className="space-y-5 pt-2 md:pt-6">
        <p className="eyebrow">Store</p>
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <h1 className="display-title max-w-4xl text-white">
            Pick your
            <br />
            poison.
          </h1>
          <p className="display-copy max-w-md">
            Browse brainrot, sports trauma, anime delusions, and contrasting designs without digging through the entire internet.
          </p>
        </div>
      </Reveal>

      <Reveal as="section" className="section-panel store-filter-panel p-5 md:p-7">
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_16rem]">
          <label className="space-y-2 text-sm text-white/50">
            <span>Search</span>
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/28" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="field field-with-leading-icon"
                placeholder="Search jokes, anime, sports, contrast..."
              />
            </div>
          </label>

          <label className="space-y-2 text-sm text-white/50">
            <span>Sort</span>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              className="field"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-5 grid gap-5 xl:grid-cols-2">
          <div className="space-y-3">
            <p className="eyebrow">Category</p>
            <div className="chip-scroll">
              <div className="chip-row">
                {collections.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setCollection(option)}
                    className={`filter-chip ${collection === option ? "filter-chip-active" : ""}`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <p className="eyebrow">Fit</p>
            <div className="chip-scroll">
              <div className="chip-row">
                {fits.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setFit(option)}
                    className={`filter-chip ${fit === option ? "filter-chip-active" : ""}`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal
        as="section"
        className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
      >
        <p className="eyebrow">{visibleProducts.length} pieces visible</p>
        <p className="text-sm text-white/40">
          Brainrot / Sports trauma / Anime delusions / Contrasting designs
        </p>
      </Reveal>

      {visibleProducts.length > 0 ? (
        <section className="grid gap-16 xl:grid-cols-2">
          {visibleProducts.map((product, index) => (
            <Reveal key={product.slug} delay={index * 60}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </section>
      ) : (
        <Reveal as="section" className="section-panel p-10 text-center md:p-14">
          <p className="eyebrow">No match</p>
          <h2 className="mt-4 font-display text-4xl text-white">
            Adjust the filters.
          </h2>
        </Reveal>
      )}
    </main>
  );
}
