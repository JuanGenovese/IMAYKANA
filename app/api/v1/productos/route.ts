import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { categorias, talles, tallesXCategoria, estados, productos, imagenes } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { productoSchema } from "./schema";

// Función de validación de autenticación por Token (API Key)
function isAuthorized(request: Request): boolean {
  const authHeader = request.headers.get("authorization");
  if (!authHeader) return false;

  const token = authHeader.replace("Bearer ", "").trim();
  const secretKey = process.env.API_SECRET_KEY;

  if (!secretKey) {
    console.error("API_SECRET_KEY is not defined in the environment variables!");
    return false;
  }

  return token === secretKey;
}

// Helper para obtener o crear la relación Talle x Categoría
async function getOrCreateTalleXCategoria(
  tx: Parameters<Parameters<typeof db.transaction>[0]>[0],
  categoryName: string,
  sizeName: string,
): Promise<number> {
  const cleanedCategory = categoryName.trim();
  const cleanedSize = sizeName.trim();

  // 1. Obtener o crear la Categoría
  let cat = await tx.query.categorias.findFirst({
    where: eq(categorias.categoria, cleanedCategory),
  });
  if (!cat) {
    const [newCat] = await tx.insert(categorias).values({ categoria: cleanedCategory }).returning();
    cat = newCat;
  }

  // 2. Obtener o crear el Talle
  let sz = await tx.query.talles.findFirst({
    where: eq(talles.talle, cleanedSize),
  });
  if (!sz) {
    const [newSz] = await tx.insert(talles).values({ talle: cleanedSize }).returning();
    sz = newSz;
  }

  // 3. Obtener o crear la relación Talle x Categoría
  let relation = await tx.query.tallesXCategoria.findFirst({
    where: and(
      eq(tallesXCategoria.idTalle, sz.id),
      eq(tallesXCategoria.idCategoria, cat.id)
    ),
  });
  if (!relation) {
    const [newRelation] = await tx.insert(tallesXCategoria).values({
      idTalle: sz.id,
      idCategoria: cat.id,
    }).returning();
    relation = newRelation;
  }

  return relation.id;
}

// GET /api/v1/productos - Listar productos
export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const productsList = await db.query.productos.findMany({
      orderBy: (productos, { desc }) => [desc(productos.id)],
      with: {
        imagenes: true,
        talleXCategoria: {
          with: {
            talle: true,
            categoria: true,
          },
        },
        estado: true,
      },
    });

    return NextResponse.json({ success: true, data: productsList });
  } catch (error) {
    console.error("Error in GET /api/v1/productos:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST /api/v1/productos - Crear un producto
export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = productoSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation Error", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, category, size, color, descriptionSummary, specificMeasurements, status, photoUrls } = parsed.data;

    const result = await db.transaction(async (tx) => {
      // 1. Obtener ID de la relación talle x categoría
      const talleXCategoriaId = await getOrCreateTalleXCategoria(tx, category, size);

      // 2. Obtener el ID del estado
      const est = await tx.query.estados.findFirst({
        where: eq(estados.estado, status),
      });
      const estadoId = est ? est.id : 1; // Default a 1 (AVAILABLE) si no existe

      // 3. Insertar el Producto
      const [productoCreado] = await tx.insert(productos).values({
        nombre: name,
        idTalleXCategoria: talleXCategoriaId,
        cantidad: 1,
        idEstado: estadoId,
        color,
        descripcion: descriptionSummary,
        medidasEspecificas: specificMeasurements,
      }).returning();

      // 4. Insertar las imágenes
      if (photoUrls.length > 0) {
        await tx.insert(imagenes).values(
          photoUrls.map((url) => ({
            url,
            idProducto: productoCreado.id,
          }))
        );
      }

      return productoCreado;
    });

    return NextResponse.json({ success: true, data: result }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/v1/productos:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
