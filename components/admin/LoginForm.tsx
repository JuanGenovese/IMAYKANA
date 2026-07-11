"use client";

import { cn } from "@/lib/utils";
import { useLoginForm } from "@/hooks/useLoginForm";
import { LoginFormHeader } from "./login-form/LoginFormHeader";
import { RegisterFields } from "./login-form/RegisterFields";
import { PasswordField } from "./login-form/PasswordField";
import { LoginFormFooter } from "./login-form/LoginFormFooter";

export function LoginForm() {
  const {
    register,
    handleSubmit,
    onSubmit,
    errors,
    isLoading,
    isRegister,
    setIsRegister,
    isResetPass,
    setIsResetPass,
    verContrasena,
    setVerContrasena,
    isSignUpSuccess,
    registeredEmail,
  } = useLoginForm();

  if (isSignUpSuccess) {
    const getMailProvider = (email: string) => {
      if (!email) return null;
      const domain = email.split("@")[1]?.toLowerCase();
      if (!domain) return null;

      if (domain.includes("gmail")) {
        return { name: "Gmail", url: "https://mail.google.com" };
      }
      if (
        domain.includes("outlook") ||
        domain.includes("hotmail") ||
        domain.includes("live") ||
        domain.includes("msn")
      ) {
        return { name: "Outlook", url: "https://outlook.live.com" };
      }
      if (domain.includes("yahoo")) {
        return { name: "Yahoo Mail", url: "https://mail.yahoo.com" };
      }
      if (domain.includes("icloud")) {
        return { name: "iCloud Mail", url: "https://www.icloud.com/mail" };
      }
      return { name: "mi correo", url: `https://mail.${domain}` };
    };

    const mailProvider = getMailProvider(registeredEmail);

    return (
      <div className="mt-10 mb-10 w-full flex flex-col items-center justify-center max-w-[420px] transition-all ease-in-out duration-300">
        <div className="w-full rounded-xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm flex flex-col items-center text-center gap-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <svg
              className="h-8 w-8"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <div className="flex flex-col gap-2 w-full">
            <h2 className="text-xl font-bold text-gray-900">
              ¡Registro completado!
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed mb-2">
              Usuario creado correctamente, por favor verifica tu casilla de correo para confirmar tu cuenta.
            </p>
            {mailProvider && (
              <a
                href={mailProvider.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-gray-900 hover:bg-gray-800 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                {mailProvider.name === "mi correo"
                  ? "Ir a mi correo"
                  : `Abrir ${mailProvider.name}`}
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "mt-10 mb-10 w-full flex flex-col items-center justify-center transition-all ease-in-out duration-300",
        isRegister && !isResetPass ? "max-w-[480px]" : "max-w-[420px]"
      )}
    >
      <LoginFormHeader isResetPass={isResetPass} isRegister={isRegister} />

      <div className="w-full relative z-10 flex flex-col">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm w-full relative z-10 mt-2"
        >
          <RegisterFields
            register={register}
            errors={errors}
            isLoading={isLoading}
            isRegister={isRegister}
            isResetPass={isResetPass}
          />

          {/*--------------- Email ----------------*/}
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-xs font-semibold text-gray-500">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              {...register("email")}
              className="rounded-lg border border-gray-300 px-3.5 py-2 text-sm outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900 disabled:opacity-50"
              disabled={isLoading}
              placeholder="imaykana@gmail.com"
            />
            {errors.email && (
              <p className="text-xs text-red-600">{errors.email.message}</p>
            )}
          </div>

          {/*------------- Contraseña -------------*/}
          <PasswordField
            register={register}
            errors={errors}
            isLoading={isLoading}
            isResetPass={isResetPass}
            isRegister={isRegister}
            verContrasena={verContrasena}
            setVerContrasena={setVerContrasena}
            setIsResetPass={setIsResetPass}
          />

          {/*--------------- Submit ---------------*/}
          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 flex items-center justify-center rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-700 disabled:opacity-60 cursor-pointer"
          >
            {isLoading
              ? isResetPass
                ? "Enviando..."
                : isRegister
                  ? "Registrando..."
                  : "Ingresando..."
              : isResetPass
                ? "Recuperar contraseña"
                : isRegister
                  ? "Registrarme"
                  : "Ingresar"}
          </button>
        </form>

        <LoginFormFooter
          isResetPass={isResetPass}
          isRegister={isRegister}
          setIsResetPass={setIsResetPass}
          setIsRegister={setIsRegister}
        />
      </div>
    </div>
  );
}
