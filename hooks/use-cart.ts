"use client";

import { useCartContext } from "@/components/cart-provider";

export function useCart() {
  return useCartContext();
}

