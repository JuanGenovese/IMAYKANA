import { LoginForm } from "@/components/admin/LoginForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            IMAYKANA Admin
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Ingresá tus credenciales para continuar
          </p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
