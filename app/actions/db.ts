"use server";

import { inArray } from "drizzle-orm";
import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";

export async function getProductsByIds(ids: number[]) {
  const validIds = ids.filter((id) => !isNaN(id));
  if (validIds.length === 0) return [];

  return await db.query.products.findMany({
    where: inArray(products.id, validIds),
  });
}
