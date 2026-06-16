"use client";

import * as React from "react";

import { CartProvider } from "@/components/providers/cart-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}

