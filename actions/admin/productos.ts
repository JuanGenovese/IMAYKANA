"use server";

import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

const productoSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  category: z.string().min(1, "La categoría es obligatoria"),
  size: z.string().min(1, "El talle es obligatorio"),
  color: z.string().min(1, "El color es obligatorio"),
  descriptionSummary: z.string().default(""),
  specificMeasurements: z.string().default(""),
  status: z.enum(["AVAILABLE", "RESERVED", "SOLD"]).default("AVAILABLE"),
  photoUrls: z.array(z.string().url()).default([]),
});

async function verifyAdmin() {
  const session = await auth();
  if (!session) throw new Error("Sin autorización");
}

export async function crearProducto(data: unknown) {
  await verifyAdmin();
  const parsed = productoSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }
  await db.insert(products).values(parsed.data);
  revalidatePath("/dashboard/productos");
  return { success: true };
}

export async function actualizarProducto(id: number, data: unknown) {
  await verifyAdmin();
  const parsed = productoSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }
  await db.update(products).set(parsed.data).where(eq(products.id, id));
  revalidatePath("/dashboard/productos");
  return { success: true };
}

export async function eliminarProducto(id: number) {
  await verifyAdmin();
  await db.delete(products).where(eq(products.id, id));
  revalidatePath("/dashboard/productos");
  return { success: true };
}
