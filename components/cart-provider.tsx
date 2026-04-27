"use client";

import {
  createContext,
  startTransition,
  useContext,
  useEffect,
  useState,
} from "react";

import { MAX_ORDER_QUANTITY } from "@/lib/limits";

type CartItem = {
  slug: string;
  size: string;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  cartCount: number;
  hydrated: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (slug: string, size: string) => void;
  updateQuantity: (slug: string, size: string, quantity: number) => void;
  clearCart: () => void;
};

const CART_KEY = "duality-cart-v1";
const CartContext = createContext<CartContextValue | null>(null);

function sanitizeItems(items: CartItem[]) {
  let runningTotal = 0;

  return items.reduce<CartItem[]>((result, item) => {
    if (
      typeof item.slug !== "string" ||
      typeof item.size !== "string" ||
      typeof item.quantity !== "number"
    ) {
      return result;
    }

    const remainingQuantity = MAX_ORDER_QUANTITY - runningTotal;

    if (remainingQuantity <= 0) {
      return result;
    }

    const quantity = Math.max(1, Math.min(item.quantity, remainingQuantity));
    runningTotal += quantity;

    result.push({
      ...item,
      quantity,
    });

    return result;
  }, []);
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const rawValue = window.localStorage.getItem(CART_KEY);

      if (rawValue) {
        const parsedValue = JSON.parse(rawValue) as CartItem[];
        setItems(sanitizeItems(parsedValue));
      }
    } catch {
      window.localStorage.removeItem(CART_KEY);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    window.localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [hydrated, items]);

  function addItem(nextItem: CartItem) {
    startTransition(() => {
      setItems((currentItems) => {
        const existingItem = currentItems.find(
          (item) => item.slug === nextItem.slug && item.size === nextItem.size,
        );
        const currentTotal = currentItems.reduce(
          (sum, item) => sum + item.quantity,
          0,
        );
        const existingQuantity = existingItem?.quantity ?? 0;
        const quantityOutsideCurrentLine = currentTotal - existingQuantity;
        const maxQuantityForLine = Math.max(
          0,
          MAX_ORDER_QUANTITY - quantityOutsideCurrentLine,
        );
        const nextQuantity = Math.min(
          existingQuantity + nextItem.quantity,
          maxQuantityForLine,
        );

        if (nextQuantity <= 0) {
          return currentItems;
        }

        if (!existingItem) {
          return [
            ...currentItems,
            {
              ...nextItem,
              quantity: nextQuantity,
            },
          ];
        }

        return currentItems.map((item) =>
          item.slug === nextItem.slug && item.size === nextItem.size
            ? { ...item, quantity: nextQuantity }
            : item,
        );
      });
    });
  }

  function removeItem(slug: string, size: string) {
    startTransition(() => {
      setItems((currentItems) =>
        currentItems.filter((item) => !(item.slug === slug && item.size === size)),
      );
    });
  }

  function updateQuantity(slug: string, size: string, quantity: number) {
    startTransition(() => {
      setItems((currentItems) => {
        const quantityOutsideCurrentLine = currentItems
          .filter((item) => !(item.slug === slug && item.size === size))
          .reduce((sum, item) => sum + item.quantity, 0);
        const maxQuantityForLine = Math.max(
          1,
          MAX_ORDER_QUANTITY - quantityOutsideCurrentLine,
        );

        return currentItems
          .map((item) =>
            item.slug === slug && item.size === size
              ? {
                  ...item,
                  quantity: Math.max(1, Math.min(maxQuantityForLine, quantity)),
                }
              : item,
          )
          .filter((item) => item.quantity > 0);
      });
    });
  }

  function clearCart() {
    startTransition(() => {
      setItems([]);
    });
  }

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        cartCount,
        hydrated,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}
