import { NextResponse } from "next/server";
import { productoSchema } from "@/lib/schemas/productos";
import {
  getAllProductsCore,
  createProductCore
} from "@/lib/services/productosCore";

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

// GET /api/v1/productos - Listar productos
export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const productsList = await getAllProductsCore();
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

    const result = await createProductCore(parsed.data);
    return NextResponse.json({ success: true, data: result }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/v1/productos:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
