import { type ProductoConRelaciones } from "./Interface";


import {
  getProductByIdCore,
  getAvailableProductsCore,
  getFeaturedProductsCore
} from "../../../services/productosCore";

export async function getAvailableProducts(): Promise<ProductoConRelaciones[]> {
  return await getAvailableProductsCore();
}


export async function getFeaturedProducts(limit?: number): Promise<ProductoConRelaciones[]> {
  return await getFeaturedProductsCore(limit);
}


export async function getProductById(id: number): Promise<ProductoConRelaciones | null> {
  return await getProductByIdCore(id);
}


export function formatARS(value: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);
}
