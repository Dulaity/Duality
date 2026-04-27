import type { Metadata } from "next";

import { StoreExperience } from "@/components/store-experience";

export const metadata: Metadata = {
  title: "Store",
  description:
    "Browse Duality meme shirts, sports merch, anime merch, and unwearable joke tees.",
};

export default function StorePage() {
  return <StoreExperience />;
}
