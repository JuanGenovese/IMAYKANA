import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { admins } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { authConfig } from "./auth.config";

async function getAdmin(email: string) {
  const result = await db
    .select()
    .from(admins)
    .where(eq(admins.email, email))
    .limit(1);
  return result[0] ?? null;
}

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (!parsedCredentials.success) return null;

        const { email, password } = parsedCredentials.data;
        const admin = await getAdmin(email);
        if (!admin) return null;

        const passwordsMatch = await bcrypt.compare(
          password,
          admin.passwordHash,
        );
        if (!passwordsMatch) return null;

        return { id: String(admin.id), name: admin.name, email: admin.email };
      },
    }),
  ],
});
