"use client";

import * as React from "react";
import { ShoppingCart, Check } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { cn } from "@/lib/utils";

interface QuickAddCartProps {
  productId: string;
  size: string;
  className?: string;
}

export default function QuickAddCart({ productId, size, className }: QuickAddCartProps) {
  const { addItem, items } = useCart();
  const [added, setAdded] = React.useState(false);

  const normalizedSize = size || "Único";
  const isAlreadyInCart = items.some(
    (item) => item.productId === productId && item.size === normalizedSize
  );

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      productId,
      size: normalizedSize,
      quantity: 1,
      price: 0,
    });

    setAdded(true);
    setTimeout(() => {
      setAdded(false);
    }, 1500);
  };

  const isDisabled = added || isAlreadyInCart;

  return (
    <button
      type="button"
      onClick={handleAdd}
      className={cn(
        "w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow transition-all duration-300 active:scale-90",
        isDisabled
          ? "bg-emerald-600 text-white hover:bg-emerald-600 cursor-default scale-105"
          : "bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105",
        className
      )}
      aria-label="Agregar al carrito"
      disabled={isDisabled}
    >
      {isDisabled ? (
        <Check className="size-4 sm:size-5 animate-in fade-in zoom-in duration-300" />
      ) : (
        <ShoppingCart className="size-4 sm:size-5" />
      )}
    </button>
  );
}
