"use client";

import * as React from "react";

export type CartItem = {
  productId: string;
  size: string;
  quantity: number;
  price?: number;
};

type CartState = {
  items: CartItem[];
};

type CartContextValue = CartState & {
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, size: CartItem["size"]) => void;
  setQuantity: (
    productId: string,
    size: CartItem["size"],
    quantity: number,
  ) => void;
  clear: () => void;
  count: number;
};

const CART_STORAGE_KEY = "imaykana_cart_v1";

const CartContext = React.createContext<CartContextValue | null>(null);

function loadCart(): CartState {
  if (typeof window === "undefined") return { items: [] };
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return { items: [] };
    const parsed = JSON.parse(raw) as CartState;
    if (!parsed?.items?.length) return { items: [] };
    return parsed;
  } catch {
    return { items: [] };
  }
}

function saveCart(state: CartState) {
  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<CartState>({ items: [] });
  const didHydrate = React.useRef(false);

  React.useEffect(() => {
    setState(loadCart());
    didHydrate.current = true;
  }, []);

  React.useEffect(() => {
    if (!didHydrate.current) return;
    saveCart(state);
  }, [state]);

  const value = React.useMemo<CartContextValue>(() => {
    const count = state.items.reduce((acc, it) => acc + it.quantity, 0);

    return {
      ...state,
      count,
      addItem: (item) => {
        setState((prev) => {
          const next = [...prev.items];
          const idx = next.findIndex(
            (i) => i.productId === item.productId && i.size === item.size,
          );
          if (idx >= 0) {
            next[idx] = {
              ...next[idx],
              quantity: next[idx].quantity + item.quantity,
            };
          } else {
            next.push(item);
          }
          return { items: next };
        });
      },
      removeItem: (productId, size) => {
        setState((prev) => ({
          items: prev.items.filter(
            (i) => !(i.productId === productId && i.size === size),
          ),
        }));
      },
      setQuantity: (productId, size, quantity) => {
        setState((prev) => {
          const q = Math.max(1, Math.min(99, Math.floor(quantity || 1)));
          return {
            items: prev.items.map((i) =>
              i.productId === productId && i.size === size
                ? { ...i, quantity: q }
                : i,
            ),
          };
        });
      },
      clear: () => setState({ items: [] }),
    };
  }, [state]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCartContext() {
  const ctx = React.useContext(CartContext);
  if (!ctx) throw new Error("useCartContext must be used within CartProvider");
  return ctx;
}
