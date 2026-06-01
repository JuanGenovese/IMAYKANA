import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AdminNav } from "@/components/admin/AdminNav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log("user", user);

  if (!user) redirect("/login");

  return (
    <div className="flex min-h-screen flex-col lg:flex-row bg-gray-50">
      {/* Responsive Navigation Component */}
      <AdminNav userEmail={user.email} />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Desktop Header */}
        <header className="hidden h-16 items-center justify-between border-b border-gray-200 bg-white px-6 lg:flex">
          <span className="text-sm font-semibold text-gray-700">
            Panel de Administración
          </span>
          <div className="ml-auto flex items-center gap-3">
            <span className="text-sm text-gray-500">{user.email}</span>
            <form
              action={async () => {
                "use server";
                const supabase = await createSupabaseServerClient();
                await supabase.auth.signOut();
                redirect("/login");
              }}
            >
              <button
                type="submit"
                className="rounded-lg border border-gray-200 px-3.5 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition"
              >
                Salir
              </button>
            </form>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-4 md:p-6 min-w-0 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
