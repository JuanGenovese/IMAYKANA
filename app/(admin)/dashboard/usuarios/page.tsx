"use client";

import { useState } from "react";
import { Plus, Search, Edit2, Trash2, Users, Info } from "lucide-react";
import { toast } from "sonner";

interface Usuario {
  id: string;
  nombre: string;
  apellido: string;
  nDni: string;
  email: string;
  idRol: number;
}

interface Rol {
  id: number;
  rol: string;
}

const ROLES: Rol[] = [
  { id: 1, rol: "Administrador" },
  { id: 2, rol: "Vendedor" },
  { id: 3, rol: "Cliente" },
];

const INITIAL_USERS: Usuario[] = [
  {
    id: "usr-1",
    nombre: "Juan",
    apellido: "Pérez",
    nDni: "35444888",
    email: "juan.perez@example.com",
    idRol: 1,
  },
  {
    id: "usr-2",
    nombre: "María",
    apellido: "González",
    nDni: "38999111",
    email: "maria.gonzalez@example.com",
    idRol: 2,
  },
  {
    id: "usr-3",
    nombre: "Carlos",
    apellido: "Rodríguez",
    nDni: "42111222",
    email: "carlos.rod@example.com",
    idRol: 3,
  },
];

export default function UsuariosABM() {
  const [users, setUsers] = useState<Usuario[]>(INITIAL_USERS);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Usuario | null>(null);

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    nDni: "",
    email: "",
    idRol: 3,
  });

  const filteredUsers = users.filter(
    (u) =>
      u.nombre.toLowerCase().includes(search.toLowerCase()) ||
      u.apellido.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.nDni.includes(search)
  );

  const handleOpenAddModal = () => {
    setEditingUser(null);
    setFormData({
      nombre: "",
      apellido: "",
      nDni: "",
      email: "",
      idRol: 3,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user: Usuario) => {
    setEditingUser(user);
    setFormData({
      nombre: user.nombre,
      apellido: user.apellido,
      nDni: user.nDni,
      email: user.email,
      idRol: user.idRol,
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre.trim() || !formData.apellido.trim() || !formData.email.trim() || !formData.nDni.trim()) {
      toast.error("Por favor completá todos los campos");
      return;
    }

    if (editingUser) {
      setUsers(
        users.map((u) => (u.id === editingUser.id ? { ...u, ...formData } : u))
      );
      toast.success(`Usuario "${formData.nombre} ${formData.apellido}" actualizado con éxito (simulado)`);
    } else {
      const newId = `usr-${Date.now()}`;
      setUsers([...users, { id: newId, ...formData }]);
      toast.success(`Usuario "${formData.nombre} ${formData.apellido}" creado con éxito (simulado)`);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`¿Estás seguro de que querés eliminar al usuario "${name}"?`)) {
      setUsers(users.filter((u) => u.id !== id));
      toast.success(`Usuario "${name}" eliminado con éxito (simulado)`);
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
          className="flex items-center justify-center gap-2 rounded-xl bg-gray-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 transition shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Nuevo Usuario
        </button>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3 text-sm text-blue-700">
        <Info className="h-5 w-5 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold">Modo Maqueta:</span> Las operaciones de este panel se realizan en memoria local (React State) y no afectan a la base de datos Supabase/Drizzle.
        </div>
      </div>

      <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-sm max-w-md">
        <Search className="h-4 w-4 text-gray-400 shrink-0" />
        <input
          type="text"
          placeholder="Buscar por nombre, email o DNI..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-sm bg-transparent outline-none text-gray-800 placeholder-gray-400"
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
                      <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                        {getRolName(user.idRol)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(user)}
                          className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition"
                          title="Editar"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id, `${user.nombre} ${user.apellido}`)}
                          className="rounded-lg border border-red-100 p-2 text-red-600 hover:bg-red-50 transition"
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
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500">Rol</label>
                <select
                  value={formData.idRol}
                  onChange={(e) => setFormData({ ...formData, idRol: Number(e.target.value) })}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-gray-900 transition bg-none"
                >
                  {ROLES.map((rol) => (
                    <option key={rol.id} value={rol.id}>
                      {rol.rol}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gray-950 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 transition shadow-sm"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
