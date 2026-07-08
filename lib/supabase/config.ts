export function getSupabaseConfig() {
  const entorno = process.env.NEXT_PUBLIC_ENTORNO;

  if (!entorno || !["local", "dev", "prod"].includes(entorno)) {
    throw new Error(
      `Error de configuración: La variable de entorno NEXT_PUBLIC_ENTORNO debe ser 'local', 'dev' o 'prod'. Valor actual: '${entorno}'`
    );
  }

  let url: string | undefined;
  let anonKey: string | undefined;

  if (entorno === "local") {
    url = process.env.NEXT_PUBLIC_SUPABASE_URL_LOCAL;
    anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_LOCAL;
  } else if (entorno === "dev") {
    url = process.env.NEXT_PUBLIC_SUPABASE_URL_DEV;
    anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_DEV;
  } else {
    url = process.env.NEXT_PUBLIC_SUPABASE_URL_PROD;
    anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_PROD;
  }

  return {
    url: url || "https://placeholder.supabase.co",
    anonKey: anonKey || "placeholder-key",
  };
}
