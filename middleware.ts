import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

export const { auth: middleware } = NextAuth(authConfig);

export const config = {
  // Configuración oficial de matcher de Next.js / Auth.js
  // Excluye rutas de api, _next/static, _next/image, favicon.ico
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
