"use client";

import { useState } from "react";
import { Plus, Search, Edit2, Trash2, Tag, Info } from "lucide-react";
import { toast } from "sonner";

interface Categoria {
  id: number;
  categoria: string;
}

const INITIAL_CATEGORIES: Categoria[] = [
  { id: 1, categoria: "Campera" },
  { id: 2, categoria: "Pantalon" },
  { id: 3, categoria: "Remera" },
];

export default function CategoriasABM() {
  const [categories, setCategories] = useState<Categoria[]>(INITIAL_CATEGORIES);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Categoria | null>(null);
  const [newCategoryName, setNewCategoryName] = useState("");

  const filteredCategories = categories.filter((c) =>
    c.categoria.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenAddModal = () => {
    setEditingCategory(null);
    setNewCategoryName("");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (category: Categoria) => {
    setEditingCategory(category);
    setNewCategoryName(category.categoria);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      toast.error("El nombre de la categoría no puede estar vacío");
      return;
    }

    if (editingCategory) {
      setCategories(
        categories.map((c) => (c.id === editingCategory.id ? { ...c, categoria: newCategoryName } : c))
      );
      toast.success(`Categoría "${newCategoryName}" actualizada con éxito (simulado)`);
    } else {
      const newId = categories.length > 0 ? Math.max(...categories.map((c) => c.id)) + 1 : 1;
      setCategories([...categories, { id: newId, categoria: newCategoryName }]);
      toast.success(`Categoría "${newCategoryName}" creada con éxito (simulado)`);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: number, name: string) => {
    if (confirm(`¿Estás seguro de que querés eliminar la categoría "${name}"?`)) {
      setCategories(categories.filter((c) => c.id !== id));
      toast.success(`Categoría "${name}" eliminada con éxito (simulado)`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Tag className="h-6 w-6 text-gray-700" />
            Categorías
          </h1>
          <p className="text-sm text-gray-500">
            Administración de las categorías de prendas para el catálogo.
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center justify-center gap-2 rounded-xl bg-gray-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 transition shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Nueva Categoría
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
          placeholder="Buscar categoría..."
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
                <th className="px-6 py-4">Categoría</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
              {filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-10 text-center text-gray-400">
                    No se encontraron categorías
                  </td>
                </tr>
              ) : (
                filteredCategories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">#{category.id}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{category.categoria}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(category)}
                          className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition"
                          title="Editar"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(category.id, category.categoria)}
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
              {editingCategory ? "Editar Categoría" : "Nueva Categoría"}
            </h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500">Nombre de la Categoría</label>
                <input
                  type="text"
                  placeholder="Ej. Remera"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
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
