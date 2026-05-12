import type { Product } from "@/lib/db/schema";

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
};

export type Indice = Record<string, Product>;
