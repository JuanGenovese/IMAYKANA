"use client";
import * as React from "react";
import type { ProductoConRelaciones as Product } from "@/lib/db/schema";

export type ResolvedCartItem = {
  productId: string;
  size: string;
  quantity: number;
  product: Product;
};

export type CartItem = {
  productId: string;
  size: string;
  quantity: number;
  price?: number;
};

export type CartState = {
  items: CartItem[];
};

export type CartContextValue = CartState & {
  addItem: (item: CartItem) => void;
  eliminarItem: (productId: string, size: CartItem["size"]) => void;
  setCantidad: (
    productId: string,
    size: CartItem["size"],
    quantity: number,
  ) => void;
  limpiar: () => void;
  count: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
};

export type Indice = Record<string, Product>;

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
  const [isOpen, setIsOpen] = React.useState(false);
  const didHydrate = React.useRef(false);

  React.useEffect(() => {
    setState(loadCart());
    didHydrate.current = true;
  }, []);

  React.useEffect(() => {
    if (!didHydrate.current) return;
    saveCart(state);
  }, [state]);

  const openCart = React.useCallback(() => setIsOpen(true), []);
  const closeCart = React.useCallback(() => setIsOpen(false), []);
  const toggleCart = React.useCallback(() => setIsOpen((prev) => !prev), []);

  const value = React.useMemo<CartContextValue>(() => {
    const count = state.items.length;

    return {
      ...state,
      count,
      isOpen,
      openCart,
      closeCart,
      toggleCart,
      addItem: (item) => {
        setState((prev) => {
          const idx = prev.items.findIndex(
            (i) => i.productId === item.productId && i.size === item.size,
          );
          if (idx >= 0) {
            return prev;
          }
          const next = [...prev.items, item];
          return { items: next };
        });
        setIsOpen(true);
      },
      eliminarItem: (productId, size) => {
        setState((prev) => ({
          items: prev.items.filter(
            (i) => !(i.productId === productId && i.size === size),
          ),
        }));
      },
      setCantidad: (productId, size, quantity) => {
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
      limpiar: () => setState({ items: [] }),
    };
  }, [state, isOpen, openCart, closeCart, toggleCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCartContext() {
  const ctx = React.useContext(CartContext);
  if (!ctx) throw new Error("useCartContext must be used within CartProvider");
  return ctx;
}
