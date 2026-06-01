"use client";

import { useState } from "react";
import { Plus, Search, Edit2, Trash2, Shield, Info } from "lucide-react";
import { toast } from "sonner";

interface Rol {
  id: number;
  rol: string;
}

const INITIAL_ROLES: Rol[] = [
  { id: 1, rol: "Administrador" },
  { id: 2, rol: "Vendedor" },
  { id: 3, rol: "Cliente" },
];

export default function RolesABM() {
  const [roles, setRoles] = useState<Rol[]>(INITIAL_ROLES);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRol, setEditingRol] = useState<Rol | null>(null);
  const [newRolName, setNewRolName] = useState("");

  const filteredRoles = roles.filter((r) =>
    r.rol.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenAddModal = () => {
    setEditingRol(null);
    setNewRolName("");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (rol: Rol) => {
    setEditingRol(rol);
    setNewRolName(rol.rol);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRolName.trim()) {
      toast.error("El nombre del rol no puede estar vacío");
      return;
    }

    if (editingRol) {
      // Editar
      setRoles(
        roles.map((r) => (r.id === editingRol.id ? { ...r, rol: newRolName } : r))
      );
      toast.success(`Rol "${newRolName}" actualizado con éxito (simulado)`);
    } else {
      // Crear
      const newId = roles.length > 0 ? Math.max(...roles.map((r) => r.id)) + 1 : 1;
      setRoles([...roles, { id: newId, rol: newRolName }]);
      toast.success(`Rol "${newRolName}" creado con éxito (simulado)`);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: number, name: string) => {
    if (confirm(`¿Estás seguro de que querés eliminar el rol "${name}"?`)) {
      setRoles(roles.filter((r) => r.id !== id));
      toast.success(`Rol "${name}" eliminado con éxito (simulado)`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Shield className="h-6 w-6 text-gray-700" />
            Roles
          </h1>
          <p className="text-sm text-gray-500">
            Administración de roles de usuario para el control de accesos.
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center justify-center gap-2 rounded-xl bg-gray-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 transition shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Nuevo Rol
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
          placeholder="Buscar rol..."
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
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Nombre del Rol</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
              {filteredRoles.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-10 text-center text-gray-400">
                    No se encontraron roles
                  </td>
                </tr>
              ) : (
                filteredRoles.map((rol) => (
                  <tr key={rol.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">#{rol.id}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{rol.rol}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(rol)}
                          className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition"
                          title="Editar"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(rol.id, rol.rol)}
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
              {editingRol ? "Editar Rol" : "Nuevo Rol"}
            </h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500">Nombre del Rol</label>
                <input
                  type="text"
                  placeholder="Ej. Vendedor"
                  value={newRolName}
                  onChange={(e) => setNewRolName(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-gray-900 transition"
                  required
                />
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
