"use client";

import * as React from "react";

import { CartProvider } from "@/components/providers/cart-provider";
import { CartSidebar } from "@/components/store/cart-sidebar";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      {children}
      <CartSidebar />
    </CartProvider>
  );
}

