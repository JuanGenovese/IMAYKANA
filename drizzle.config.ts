import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./lib/db/schema/index.ts",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.NEXT_PUBLIC_ENTORNO === "local"
      ? process.env.DATABASE_LOCAL_URL!
      : process.env.DATABASE_PROD_URL!,
  },
});
