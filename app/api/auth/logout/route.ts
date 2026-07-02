import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  
  const requestUrl = new URL(request.url);
  const loginUrl = new URL("/login", requestUrl.origin);
  
  return NextResponse.redirect(loginUrl);
}
