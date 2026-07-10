import { defineConfig } from "drizzle-kit";

const entorno = process.env.NEXT_PUBLIC_ENTORNO;

if (!entorno || !["local", "dev", "prod"].includes(entorno)) {
  throw new Error(
    `Error de configuración: La variable de entorno NEXT_PUBLIC_ENTORNO debe ser 'local', 'dev' o 'prod'. Valor actual: '${entorno}'`
  );
}

let connectionString: string | undefined;

if (entorno === "local") {
  connectionString = process.env.DATABASE_LOCAL_URL;
} else if (entorno === "dev") {
  connectionString = process.env.DATABASE_DEV_URL_SESSION;
} else {
  connectionString = process.env.DATABASE_PROD_URL_SESSION;
}

if (!connectionString) {
  throw new Error(
    `Error de configuración: La variable de entorno de base de datos para el entorno '${entorno}' no está configurada.`
  );
}

const maskedUrl = connectionString.replace(/:([^@:]+)@/, ":******@");
console.log(`\n🔍 [Drizzle Config] Entorno: ${entorno} | URL: ${maskedUrl}\n`);

export default defineConfig({
  dialect: "postgresql",
  schema: "./lib/db/schema/index.ts",
  out: "./drizzle",
  dbCredentials: {
    url: connectionString,
  },
});
