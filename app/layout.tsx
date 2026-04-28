import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Manrope, Syne } from "next/font/google";
import "./globals.css";

import { AuthSessionProvider } from "@/components/auth-session-provider";
import { CartProvider } from "@/components/cart-provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const display = Syne({
  variable: "--font-display",
  subsets: ["latin"],
});

const sans = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
});

const mono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: {
    default: "Duality",
    template: "%s | Duality",
  },
  description:
    "Duality makes wearable internet culture for people with unhinged humor.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://dualitystore.store",
  ),
  keywords: [
    "Duality",
    "brainrot shirts",
    "anime delusions",
    "sports trauma",
    "dark humor shirts",
    "wearable internet culture",
  ],
  openGraph: {
    title: "Duality",
    description:
      "Unwearable memes, dark humor, and niche designs for people who get it.",
    siteName: "Duality",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffd93d",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background font-sans text-foreground">
        <AuthSessionProvider>
          <CartProvider>
            <div className="relative min-h-screen overflow-x-hidden">
              <div className="background-grid" aria-hidden="true" />
              <div className="site-aura site-aura-one" aria-hidden="true" />
              <div className="site-aura site-aura-two" aria-hidden="true" />
              <SiteHeader />
              <div className="relative z-10 flex min-h-screen flex-col">
                <div className="flex-1">{children}</div>
                <SiteFooter />
              </div>
            </div>
          </CartProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
