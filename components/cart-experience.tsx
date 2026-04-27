"use client";

import Link from "next/link";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { ArrowRight, Minus, Plus, ShieldCheck, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";

import { Reveal } from "@/components/reveal";
import { useCart } from "@/components/cart-provider";
import { MAX_ORDER_QUANTITY } from "@/lib/limits";
import { buildOrderPreviewFromCatalog, type OrderPreview } from "@/lib/orders";
import { formatPrice, type Product } from "@/lib/products";

type CheckoutCustomer = {
  name: string;
  email: string;
  phone: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  postalCode: string;
};

type CheckoutResult = {
  tone: "neutral" | "error";
  message: string;
};

type CartItem = ReturnType<typeof useCart>["items"][number];

type RazorpaySuccessPayload = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

type RazorpayFailurePayload = {
  error?: {
    description?: string;
    reason?: string;
    step?: string;
  };
};

type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
  handler?: (response: RazorpaySuccessPayload) => void;
};

type RazorpayInstance = {
  open: () => void;
  on: (
    event: "payment.failed",
    callback: (response: RazorpayFailurePayload) => void,
  ) => void;
};

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

const initialCustomer: CheckoutCustomer = {
  name: "",
  email: "",
  phone: "",
  address1: "",
  address2: "",
  city: "",
  state: "",
  postalCode: "",
};

function CartCheckoutPanel({
  gatewayReady,
  items,
  preview,
  sessionName,
  sessionEmail,
}: {
  gatewayReady: boolean;
  items: CartItem[];
  preview: OrderPreview | null;
  sessionName: string;
  sessionEmail: string;
}) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement | null>(null);
  const [customer, setCustomer] = useState<CheckoutCustomer>(() => ({
    ...initialCustomer,
    name: sessionName,
    email: sessionEmail,
  }));
  const [checkoutState, setCheckoutState] = useState<
    "idle" | "creating" | "paying" | "verifying"
  >("idle");
  const [result, setResult] = useState<CheckoutResult>({
    tone: "neutral",
    message: "Secure payments run through Razorpay.",
  });

  function updateCustomerField<Field extends keyof CheckoutCustomer>(
    field: Field,
    value: CheckoutCustomer[Field],
  ) {
    setCustomer((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function verifyPayment(response: RazorpaySuccessPayload) {
    setCheckoutState("verifying");
    setResult({
      tone: "neutral",
      message: "Verifying payment.",
    });

    const verificationResponse = await fetch("/api/checkout/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(response),
    });

    const payload = await verificationResponse.json();

    if (!verificationResponse.ok && verificationResponse.status !== 202) {
      setCheckoutState("idle");
      setResult({
        tone: "error",
        message: payload.error ?? "Payment verification failed.",
      });
      return;
    }

    const params = new URLSearchParams({
      order_code: payload.order.code,
    });

    if (payload.status === "processing") {
      params.set("status", "processing");
    }

    router.push(`/checkout/success?${params.toString()}`);
  }

  async function handleCheckout() {
    if (!formRef.current?.reportValidity()) {
      return;
    }

    if (!gatewayReady || !window.Razorpay) {
      setResult({
        tone: "error",
        message: "The payment gateway is still loading.",
      });
      return;
    }

    setCheckoutState("creating");
    setResult({
      tone: "neutral",
      message: "Preparing checkout.",
    });

    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ items, customer }),
    });

    const payload = await response.json();

    if (!response.ok) {
      setCheckoutState("idle");
      setResult({
        tone: "error",
        message: payload.error ?? "Checkout could not be started.",
      });
      return;
    }

    if (payload.mode !== "razorpay" || !payload.checkout) {
      setCheckoutState("idle");
      setResult({
        tone: payload.mode === "unavailable" ? "error" : "neutral",
        message: payload.message ?? "Checkout is unavailable right now.",
      });
      return;
    }

    const checkout = payload.checkout as {
      key: string;
      orderId: string;
      amount: number;
      currency: string;
      name: string;
      description: string;
      prefill: {
        name: string;
        email: string;
        contact: string;
      };
    };

    const razorpay = new window.Razorpay({
      key: checkout.key,
      amount: checkout.amount,
      currency: checkout.currency,
      name: checkout.name,
      description: checkout.description,
      order_id: checkout.orderId,
      prefill: checkout.prefill,
      theme: {
        color: "#111111",
      },
      modal: {
        ondismiss: () => {
          setCheckoutState("idle");
          setResult({
            tone: "neutral",
            message: "Checkout was closed before payment finished.",
          });
        },
      },
      handler: (gatewayResponse) => {
        void verifyPayment(gatewayResponse);
      },
    });

    razorpay.on("payment.failed", (event) => {
      setCheckoutState("idle");
      setResult({
        tone: "error",
        message:
          event.error?.description ??
          event.error?.reason ??
          "Payment failed. Please try again.",
      });
    });

    setCheckoutState("paying");
    razorpay.open();
  }

  return (
    <div className="section-panel p-6 md:p-8 xl:sticky xl:top-28">
      <div className="space-y-10">
        <div className="space-y-3">
          <p className="eyebrow">Checkout</p>
          <h2 className="font-display text-4xl text-white">
            Delivery details.
          </h2>
        </div>

        <form ref={formRef} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm text-white/60">
              <span>Full name</span>
              <input
                required
                className="field"
                value={customer.name}
                onChange={(event) => updateCustomerField("name", event.target.value)}
                placeholder="Your full name"
              />
            </label>

            <label className="space-y-2 text-sm text-white/60">
              <span>Email</span>
              <input
                required
                type="email"
                className="field"
                value={customer.email}
                onChange={(event) => updateCustomerField("email", event.target.value)}
                placeholder="you@example.com"
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm text-white/60">
              <span>Phone</span>
              <input
                required
                inputMode="tel"
                pattern="[0-9+\\-\\s()]{10,20}"
                className="field"
                value={customer.phone}
                onChange={(event) => updateCustomerField("phone", event.target.value)}
                placeholder="+91 98765 43210"
              />
            </label>

            <label className="space-y-2 text-sm text-white/60">
              <span>PIN code</span>
              <input
                required
                inputMode="numeric"
                pattern="[1-9][0-9]{5}"
                className="field"
                value={customer.postalCode}
                onChange={(event) => updateCustomerField("postalCode", event.target.value)}
                placeholder="500001"
              />
            </label>
          </div>

          <label className="space-y-2 text-sm text-white/60">
            <span>Address line 1</span>
            <input
              required
              className="field"
              value={customer.address1}
              onChange={(event) => updateCustomerField("address1", event.target.value)}
              placeholder="House number, street, area"
            />
          </label>

          <label className="space-y-2 text-sm text-white/60">
            <span>Address line 2</span>
            <input
              className="field"
              value={customer.address2}
              onChange={(event) => updateCustomerField("address2", event.target.value)}
              placeholder="Apartment, landmark, or optional details"
            />
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm text-white/60">
              <span>City</span>
              <input
                required
                className="field"
                value={customer.city}
                onChange={(event) => updateCustomerField("city", event.target.value)}
                placeholder="Hyderabad"
              />
            </label>

            <label className="space-y-2 text-sm text-white/60">
              <span>State</span>
              <input
                required
                className="field"
                value={customer.state}
                onChange={(event) => updateCustomerField("state", event.target.value)}
                placeholder="State / Region"
              />
            </label>
          </div>
        </form>

        <div className="border-t border-white/8 pt-8">
          <div className="space-y-4 text-sm text-white/58">
            <div className="flex items-center justify-between gap-4">
              <span>Subtotal</span>
              <span>{preview ? formatPrice(preview.subtotal) : "-"}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span>Shipping</span>
              <span>{preview ? formatPrice(preview.shipping) : "-"}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span>Estimated tax</span>
              <span>{preview ? formatPrice(preview.tax) : "-"}</span>
            </div>
            <div className="flex items-center justify-between gap-4 border-t border-white/10 pt-4 text-lg font-semibold text-white">
              <span>Total</span>
              <span>{preview ? preview.totalLabel : "-"}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => void handleCheckout()}
            disabled={checkoutState !== "idle"}
            className="button-primary mt-6 inline-flex w-full items-center justify-center gap-2 px-5 py-3.5 disabled:cursor-wait disabled:opacity-70"
          >
            <ShieldCheck className="h-4 w-4" />
            {checkoutState === "creating"
              ? "Preparing checkout..."
              : checkoutState === "paying"
                ? "Checkout open..."
                : checkoutState === "verifying"
                  ? "Verifying payment..."
                  : "Pay securely"}
          </button>

          <p
            className={`mt-4 text-sm leading-8 ${
              result.tone === "error" ? "text-white" : "text-white/46"
            }`}
          >
            {result.message}
          </p>
        </div>
      </div>
    </div>
  );
}

export function CartExperience({ products }: { products: Product[] }) {
  const { data: session } = useSession();
  const { items, hydrated, removeItem, updateQuantity, clearCart, cartCount } =
    useCart();
  const [gatewayReady, setGatewayReady] = useState(false);

  const enrichedItems = items
    .map((item) => {
      const product = products.find(
        (catalogProduct) => catalogProduct.slug === item.slug,
      );

      if (!product) {
        return null;
      }

      return {
        ...item,
        product,
        lineTotal: product.price * item.quantity,
      };
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  const previewItems = enrichedItems.map(({ slug, quantity, size }) => ({
    slug,
    quantity,
    size,
  }));

  const preview =
    previewItems.length > 0
      ? buildOrderPreviewFromCatalog(previewItems, products, undefined, {
          allowDefaultFallback: false,
        })
      : null;

  if (!hydrated) {
    return (
      <main className="page-shell py-16">
        <p className="text-sm text-white/56">Loading your cart...</p>
      </main>
    );
  }

  if (enrichedItems.length === 0) {
    return (
      <main className="page-shell py-16">
        <Reveal as="section" className="section-panel p-10 text-center md:p-14">
          <p className="eyebrow">Cart</p>
          <h1 className="mt-4 font-display text-5xl text-white">
            Nothing here yet.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-8 text-white/52">
            Pick a few pieces from the line and come back when you are ready to check out.
          </p>
          <Link
            href="/store"
            className="button-primary mt-6 inline-flex items-center gap-2 px-5 py-3.5"
          >
            Browse store
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </main>
    );
  }

  return (
    <main className="page-shell flex flex-col gap-14 pb-20 pt-8 md:gap-16 md:pb-24 md:pt-10">
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
        onLoad={() => setGatewayReady(true)}
      />

      <Reveal as="section" className="space-y-5 pt-2 md:pt-6">
        <p className="eyebrow">Cart</p>
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <h1 className="section-title text-white">Review the order.</h1>
            <p className="section-copy max-w-lg">
              Finalize your pieces, delivery, and secure payment.
            </p>
          </div>

          <button
            type="button"
            onClick={clearCart}
            className="button-secondary inline-flex items-center gap-2 px-4 py-2.5"
          >
            <Trash2 className="h-4 w-4" />
            Clear cart
          </button>
        </div>
      </Reveal>

      <section className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_26rem] xl:items-start">
        <Reveal className="section-panel p-6 md:p-8">
          <div className="space-y-6">
            {enrichedItems.map(({ product, quantity, size, lineTotal }, index) => (
              <div
                key={`${product.slug}-${size}`}
                className={index === 0 ? "" : "border-t border-white/8 pt-6"}
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div className="space-y-2">
                    <p className="eyebrow">{product.collection}</p>
                    <h2 className="font-display text-3xl text-white">
                      {product.name}
                    </h2>
                    <p className="text-sm leading-8 text-white/46">
                      Size {size} / {product.subtitle}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 lg:justify-end">
                    <div className="space-y-2">
                      <div className="flex items-center rounded-full border border-white/10 bg-white/[0.03]">
                        <button
                          type="button"
                          onClick={() => updateQuantity(product.slug, size, quantity - 1)}
                          className="px-3 py-2 text-white/70 transition hover:text-white"
                          aria-label={`Decrease quantity of ${product.name}`}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="px-3 text-sm text-white">{quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(product.slug, size, quantity + 1)}
                          disabled={quantity >= MAX_ORDER_QUANTITY - (cartCount - quantity)}
                          className="px-3 py-2 text-white/70 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
                          aria-label={`Increase quantity of ${product.name}`}
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="text-center text-[0.62rem] uppercase tracking-[0.22em] text-white/28">
                        Max {MAX_ORDER_QUANTITY} total
                      </p>
                    </div>

                    <p className="min-w-24 text-right text-lg font-semibold text-white">
                      {formatPrice(lineTotal)}
                    </p>

                    <button
                      type="button"
                      onClick={() => removeItem(product.slug, size)}
                      className="button-secondary inline-flex items-center justify-center px-4 py-2.5 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={90}>
          <CartCheckoutPanel
            gatewayReady={gatewayReady}
            items={items}
            preview={preview}
            sessionName={session?.user?.name ?? ""}
            sessionEmail={session?.user?.email ?? ""}
          />
        </Reveal>
      </section>
    </main>
  );
}
