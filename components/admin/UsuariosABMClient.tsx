"use client";

import { useState, useTransition } from "react";
import { Plus, Search, Edit2, Trash2, Users, Check, X, UserMinus } from "lucide-react";
import { toast } from "sonner";
import { type Usuario as DbUsuario } from "@/lib/db/schema";
import {
  actualizarUsuario,
  eliminarUsuario,
  procesarSolicitudVendedor,
} from "@/actions/usuarios";

export type UsuarioWithRol = DbUsuario & {
  rol: {
    id: number;
    rol: string;
  };
};

const ROLES = [
  { id: 1, rol: "Admin" },
  { id: 2, rol: "Vendedor" },
  { id: 3, rol: "Cliente" },
];

export function UsuariosABMClient({ initialUsers }: { initialUsers: UsuarioWithRol[] }) {
  const [users, setUsers] = useState<UsuarioWithRol[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UsuarioWithRol | null>(null);
  const [isPending, startTransition] = useTransition();

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    nDni: "",
    email: "",
    idRol: 3,
    solicitudVendedor: false,
  });

  const filteredUsers = users.filter(
    (u) =>
      u.nombre.toLowerCase().includes(search.toLowerCase()) ||
      u.apellido.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.nDni.includes(search)
  );

  const handleOpenAddModal = () => {
    toast.info("Por seguridad, los nuevos usuarios deben registrarse ellos mismos desde la pantalla de ingreso. Una vez creados, podrás gestionar sus roles desde acá.");
  };

  const handleOpenEditModal = (user: UsuarioWithRol) => {
    setEditingUser(user);
    setFormData({
      nombre: user.nombre,
      apellido: user.apellido,
      nDni: user.nDni,
      email: user.email,
      idRol: user.idRol,
      solicitudVendedor: !!user.solicitudVendedor,
    });
    setIsModalOpen(true);
  };

  const handleApproveSeller = (user: UsuarioWithRol) => {
    startTransition(async () => {
      const res = await procesarSolicitudVendedor(user.id, true);
      if (res.success) {
        setUsers(
          users.map((u) =>
            u.id === user.id
              ? {
                  ...u,
                  idRol: 2,
                  solicitudVendedor: false,
                  rol: { id: 2, rol: "Vendedor" },
                }
              : u
          )
        );
        toast.success(`Solicitud aprobada: ${user.nombre} ahora es Vendedor.`);
      } else {
        toast.error(res.error || "Ocurrió un error al aprobar la solicitud.");
      }
    });
  };

  const handleRejectSeller = (user: UsuarioWithRol) => {
    startTransition(async () => {
      const res = await procesarSolicitudVendedor(user.id, false);
      if (res.success) {
        setUsers(
          users.map((u) =>
            u.id === user.id ? { ...u, solicitudVendedor: false } : u
          )
        );
        toast.success(`Solicitud de vendedor rechazada para ${user.nombre}.`);
      } else {
        toast.error(res.error || "Ocurrió un error al rechazar la solicitud.");
      }
    });
  };

  const handleDemoteSeller = (user: UsuarioWithRol) => {
    startTransition(async () => {
      const res = await procesarSolicitudVendedor(user.id, false); // Esto quita el rol de vendedor volviendo a su rol base
      if (res.success) {
        // Asignamos cliente (rol 3) como valor por defecto al quitarle rol de vendedor
        const resRol = await actualizarUsuario(user.id, {
          nombre: user.nombre,
          apellido: user.apellido,
          nDni: user.nDni,
          email: user.email,
          idRol: 3,
          solicitudVendedor: false,
        });
        if (resRol.success) {
          setUsers(
            users.map((u) =>
              u.id === user.id
                ? {
                    ...u,
                    idRol: 3,
                    solicitudVendedor: false,
                    rol: { id: 3, rol: "Cliente" },
                  }
                : u
            )
          );
          toast.info(`${user.nombre} ha sido degradado a Cliente.`);
        } else {
          toast.error(resRol.error || "Error al actualizar el rol.");
        }
      } else {
        toast.error(res.error || "Ocurrió un error al degradar al usuario.");
      }
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.nombre.trim() ||
      !formData.apellido.trim() ||
      !formData.email.trim() ||
      !formData.nDni.trim()
    ) {
      toast.error("Por favor completá todos los campos");
      return;
    }

    if (editingUser) {
      startTransition(async () => {
        const res = await actualizarUsuario(editingUser.id, formData);
        if (res.success) {
          const selectedRolName =
            ROLES.find((r) => r.id === formData.idRol)?.rol || "Cliente";
          setUsers(
            users.map((u) =>
              u.id === editingUser.id
                ? {
                    ...u,
                    ...formData,
                    rol: { id: formData.idRol, rol: selectedRolName },
                  }
                : u
            )
          );
          toast.success(
            `Usuario "${formData.nombre} ${formData.apellido}" actualizado con éxito.`
          );
          setIsModalOpen(false);
        } else {
          toast.error(res.error || "No se pudo actualizar el usuario.");
        }
      });
    }
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`¿Estás seguro de que querés eliminar al usuario "${name}"?`)) {
      startTransition(async () => {
        const res = await eliminarUsuario(id);
        if (res.success) {
          setUsers(users.filter((u) => u.id !== id));
          toast.success(`Usuario "${name}" eliminado con éxito.`);
        } else {
          toast.error(res.error || "No se pudo eliminar el usuario.");
        }
      });
    }
  };

  const getRolName = (idRol: number) => {
    return ROLES.find((r) => r.id === idRol)?.rol || "Desconocido";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="h-6 w-6 text-gray-700" />
            Usuarios
          </h1>
          <p className="text-sm text-gray-500">
            Administración de perfiles de usuario vinculados al sistema.
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center justify-center gap-2 rounded-xl bg-gray-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 transition shadow-sm cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Nuevo Usuario
        </button>
      </div>

      <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-sm max-w-md">
        <Search className="h-4 w-4 text-gray-400 shrink-0" />
        <input
          type="text"
          placeholder="Buscar por nombre, email o DNI..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-sm bg-transparent outline-none text-gray-800 placeholder-gray-400"
          disabled={isPending}
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-500">
                <th className="px-6 py-4">Usuario</th>
                <th className="px-6 py-4">DNI</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Rol</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-400">
                    No se encontraron usuarios
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      {user.nombre} {user.apellido}
                    </td>
                    <td className="px-6 py-4 font-mono text-gray-600">{user.nDni}</td>
                    <td className="px-6 py-4 text-gray-600">{user.email}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 items-start">
                        <span
                          className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold ring-1 ring-inset ${
                            user.idRol === 1
                              ? "bg-purple-50 text-purple-700 ring-purple-700/10"
                              : user.idRol === 2
                              ? "bg-emerald-50 text-emerald-700 ring-emerald-600/10"
                              : "bg-gray-50 text-gray-600 ring-gray-500/10"
                          }`}
                        >
                          {getRolName(user.idRol)}
                        </span>
                        {user.solicitudVendedor && (
                          <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-800 ring-1 ring-inset ring-amber-600/20 animate-pulse">
                            Solicitud Vendedor
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-medium">
                      <div className="flex justify-end gap-2">
                        {user.solicitudVendedor && (
                          <>
                            <button
                              onClick={() => handleApproveSeller(user)}
                              disabled={isPending}
                              className="rounded-lg border border-emerald-100 p-2 text-emerald-600 hover:bg-emerald-50 transition cursor-pointer disabled:opacity-50"
                              title="Aprobar Vendedor"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleRejectSeller(user)}
                              disabled={isPending}
                              className="rounded-lg border border-amber-100 p-2 text-amber-600 hover:bg-amber-50 transition cursor-pointer disabled:opacity-50"
                              title="Rechazar Solicitud"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </>
                        )}
                        {user.idRol === 2 && !user.solicitudVendedor && (
                          <button
                            onClick={() => handleDemoteSeller(user)}
                            disabled={isPending}
                            className="rounded-lg border border-gray-200 p-2 text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition cursor-pointer disabled:opacity-50"
                            title="Quitar Rol Vendedor"
                          >
                            <UserMinus className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleOpenEditModal(user)}
                          disabled={isPending}
                          className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition cursor-pointer disabled:opacity-50"
                          title="Editar"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() =>
                            handleDelete(user.id, `${user.nombre} ${user.apellido}`)
                          }
                          disabled={isPending}
                          className="rounded-lg border border-red-100 p-2 text-red-600 hover:bg-red-50 transition cursor-pointer disabled:opacity-50"
                          title="Eliminar"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Alta/Edición */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              {editingUser ? "Editar Usuario" : "Nuevo Usuario"}
            </h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500">Nombre</label>
                  <input
                    type="text"
                    placeholder="Ej. Juan"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-gray-900 transition"
                    disabled={isPending}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500">Apellido</label>
                  <input
                    type="text"
                    placeholder="Ej. Pérez"
                    value={formData.apellido}
                    onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-gray-900 transition"
                    disabled={isPending}
                    required
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500">DNI</label>
                <input
                  type="text"
                  placeholder="Ej. 35444888"
                  value={formData.nDni}
                  onChange={(e) => setFormData({ ...formData, nDni: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-gray-900 transition"
                  disabled={isPending}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500">Email</label>
                <input
                  type="email"
                  placeholder="Ej. juan.perez@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-gray-900 transition"
                  disabled={isPending}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500">Rol</label>
                <select
                  value={formData.idRol}
                  onChange={(e) => {
                    const newRol = Number(e.target.value);
                    setFormData({
                      ...formData,
                      idRol: newRol,
                      solicitudVendedor:
                        newRol === 3 ? formData.solicitudVendedor : false,
                    });
                  }}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-gray-900 transition bg-none"
                  disabled={isPending}
                >
                  {ROLES.map((rol) => (
                    <option key={rol.id} value={rol.id}>
                      {rol.rol}
                    </option>
                  ))}
                </select>
              </div>
              {formData.idRol === 3 && (
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="solicitudVendedor"
                    checked={formData.solicitudVendedor}
                    onChange={(e) =>
                      setFormData({ ...formData, solicitudVendedor: e.target.checked })
                    }
                    className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                    disabled={isPending}
                  />
                  <label
                    htmlFor="solicitudVendedor"
                    className="text-xs font-semibold text-gray-600 select-none cursor-pointer"
                  >
                    Tiene solicitud de vendedor pendiente
                  </label>
                </div>
              )}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition cursor-pointer"
                  disabled={isPending}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gray-950 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 transition shadow-sm cursor-pointer disabled:opacity-50"
                  disabled={isPending}
                >
                  {isPending ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
