export function getSupabaseConfig() {
  const isLocal = process.env.NEXT_PUBLIC_ENTORNO === "local";

  const url = isLocal
    ? process.env.NEXT_PUBLIC_SUPABASE_URL_LOCAL
    : process.env.NEXT_PUBLIC_SUPABASE_URL_PROD;

  const anonKey = isLocal
    ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_LOCAL
    : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_PROD;

  return {
    url: url || "https://placeholder.supabase.co",
    anonKey: anonKey || "placeholder-key",
  };
}
