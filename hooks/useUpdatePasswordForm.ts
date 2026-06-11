"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createSupabaseClient } from "@/lib/supabase/client";
import { z } from "zod";

const esquemaActualizarContrasena = z
  .object({
    contrasena: z
      .string()
      .min(6, "La contraseña debe tener al menos 6 caracteres."),
    confirmarContrasena: z
      .string()
      .min(6, "La contraseña debe tener al menos 6 caracteres."),
  })
  .refine((datos) => datos.contrasena === datos.confirmarContrasena, {
    message: "Las contraseñas no coinciden.",
    path: ["confirmarContrasena"],
  });

type ValoresFormularioActualizarContrasena = z.infer<
  typeof esquemaActualizarContrasena
>;

export function useUpdatePasswordForm() {
  const router = useRouter();
  const supabase = createSupabaseClient();
  const [estaCargando, setEstaCargando] = useState(false);
  const [estaPermitido, setEstaPermitido] = useState(false);
  const [estaVerificando, setEstaVerificando] = useState(true);
  const [code, setCode] = useState("");
  const [verContrasena, setVerContrasena] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors: errores },
  } = useForm<ValoresFormularioActualizarContrasena>({
    resolver: zodResolver(esquemaActualizarContrasena),
    defaultValues: {
      contrasena: "",
      confirmarContrasena: "",
    },
  });

  useEffect(() => {
    const procesarAutenticacion = async () => {
      const parametros = new URLSearchParams(window.location.search);
      const codigo = parametros.get("code");

      if (codigo) {
        setCode(codigo);
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );

        setEstaPermitido(true);
        setEstaVerificando(false);
        return;
      }
      
      // If there is no code in the URL, check if there's a session already active
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setEstaPermitido(true);
      } else {
        setEstaPermitido(false);
      }
      setEstaVerificando(false);
    };

    procesarAutenticacion();
  }, [router, supabase.auth]);

  const alEnviar = async (datos: ValoresFormularioActualizarContrasena) => {
    setEstaCargando(true);
    try {
      if (code) {
        const { error: errorIntercambio } =
          await supabase.auth.exchangeCodeForSession(code);

        if (errorIntercambio) {
          console.error("Error al intercambiar código:", errorIntercambio);
          toast.error("El enlace de recuperación venció o es inválido.");
          setEstaPermitido(false);
          setEstaVerificando(false);
          return;
        }
      }

      const {
        data: { session: sesion },
      } = await supabase.auth.getSession();

      if (!sesion) {
        toast.error("Enlace de recuperación inválido o expirado.");
        setEstaPermitido(false);
        setEstaVerificando(false);
        return;
      }

      const { error: errorAuth } = await supabase.auth.updateUser({
        password: datos.contrasena,
      });

      if (errorAuth) {
        toast.error(errorAuth.message);
      } else {
        toast.success("Contraseña actualizada con éxito.");

        await supabase.auth.signOut();
        localStorage.removeItem("user");

        router.push("/login");
        router.refresh();
      }
    } catch (errorInesperado) {
      console.error("Error al actualizar la contraseña:", errorInesperado);
      toast.error("Ocurrió un error inesperado.");
    } finally {
      setEstaCargando(false);
    }
  };

  return {
    register,
    handleSubmit: (onValid: any) => handleSubmit(onValid),
    alEnviar,
    errores,
    estaCargando,
    estaPermitido,
    estaVerificando,
    verContrasena,
    setVerContrasena,
    router,
  };
}
