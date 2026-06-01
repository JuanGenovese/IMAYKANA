"use client";

import { useState } from "react";
import { Plus, Search, Edit2, Trash2, GitFork, Info } from "lucide-react";
import { toast } from "sonner";

interface TalleXCategoria {
  id: number;
  idTalle: number;
  idCategoria: number;
}

interface Talle {
  id: number;
  talle: string;
}

interface Categoria {
  id: number;
  categoria: string;
}

const TALLES: Talle[] = [
  { id: 1, talle: "S" },
  { id: 2, talle: "M" },
  { id: 3, talle: "L" },
  { id: 4, talle: "38" },
  { id: 5, talle: "40" },
];

const CATEGORIAS: Categoria[] = [
  { id: 1, categoria: "Campera" },
  { id: 2, categoria: "Pantalon" },
  { id: 3, categoria: "Remera" },
];

const INITIAL_MAPPINGS: TalleXCategoria[] = [
  { id: 1, idCategoria: 1, idTalle: 1 }, // Campera -> S
  { id: 2, idCategoria: 1, idTalle: 2 }, // Campera -> M
  { id: 3, idCategoria: 2, idTalle: 4 }, // Pantalon -> 38
  { id: 4, idCategoria: 2, idTalle: 5 }, // Pantalon -> 40
  { id: 5, idCategoria: 3, idTalle: 1 }, // Remera -> S
];

export default function TallesCategoriasABM() {
  const [mappings, setMappings] = useState<TalleXCategoria[]>(INITIAL_MAPPINGS);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMapping, setEditingMapping] = useState<TalleXCategoria | null>(null);

  const [formData, setFormData] = useState({
    idCategoria: 1,
    idTalle: 1,
  });

  const getCategoryName = (id: number) => {
    return CATEGORIAS.find((c) => c.id === id)?.categoria || "Desconocida";
  };

  const getTalleName = (id: number) => {
    return TALLES.find((t) => t.id === id)?.talle || "Desconocido";
  };

  const filteredMappings = mappings.filter((m) => {
    const catName = getCategoryName(m.idCategoria).toLowerCase();
    const sizeName = getTalleName(m.idTalle).toLowerCase();
    return (
      catName.includes(search.toLowerCase()) || sizeName.includes(search.toLowerCase())
    );
  });

  const handleOpenAddModal = () => {
    setEditingMapping(null);
    setFormData({
      idCategoria: CATEGORIAS[0]?.id || 1,
      idTalle: TALLES[0]?.id || 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (mapping: TalleXCategoria) => {
    setEditingMapping(mapping);
    setFormData({
      idCategoria: mapping.idCategoria,
      idTalle: mapping.idTalle,
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    // Validar duplicado
    const isDuplicate = mappings.some(
      (m) =>
        m.idCategoria === formData.idCategoria &&
        m.idTalle === formData.idTalle &&
        (!editingMapping || m.id !== editingMapping.id)
    );

    if (isDuplicate) {
      toast.error("Esta asociación de Talle y Categoría ya existe");
      return;
    }

    if (editingMapping) {
      setMappings(
        mappings.map((m) => (m.id === editingMapping.id ? { ...m, ...formData } : m))
      );
      toast.success(
        `Relación "${getCategoryName(formData.idCategoria)} - Talle ${getTalleName(
          formData.idTalle
        )}" actualizada con éxito (simulado)`
      );
    } else {
      const newId = mappings.length > 0 ? Math.max(...mappings.map((m) => m.id)) + 1 : 1;
      setMappings([...mappings, { id: newId, ...formData }]);
      toast.success(
        `Relación "${getCategoryName(formData.idCategoria)} - Talle ${getTalleName(
          formData.idTalle
        )}" creada con éxito (simulado)`
      );
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: number, catName: string, talleName: string) => {
    if (
      confirm(
        `¿Estás seguro de que querés eliminar la asociación "${catName} - Talle ${talleName}"?`
      )
    ) {
      setMappings(mappings.filter((m) => m.id !== id));
      toast.success(
        `Relación "${catName} - Talle ${talleName}" eliminada con éxito (simulado)`
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <GitFork className="h-6 w-6 text-gray-700" />
            Talles por Categoría
          </h1>
          <p className="text-sm text-gray-500">
            Administración de la asociación de talles permitidos según cada categoría de prenda.
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center justify-center gap-2 rounded-xl bg-gray-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 transition shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Nueva Asociación
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
          placeholder="Buscar por categoría o talle..."
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
                <th className="px-6 py-4">Talle</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
              {filteredMappings.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-gray-400">
                    No se encontraron asociaciones
                  </td>
                </tr>
              ) : (
                filteredMappings.map((map) => {
                  const catName = getCategoryName(map.idCategoria);
                  const talleName = getTalleName(map.idTalle);
                  return (
                    <tr key={map.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">#{map.id}</td>
                      <td className="px-6 py-4 font-semibold text-gray-900 capitalize">{catName}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center rounded-md bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600 ring-1 ring-inset ring-gray-500/10">
                          Talle {talleName}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleOpenEditModal(map)}
                            className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition"
                            title="Editar"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(map.id, catName, talleName)}
                            className="rounded-lg border border-red-100 p-2 text-red-600 hover:bg-red-50 transition"
                            title="Eliminar"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
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
              {editingMapping ? "Editar Asociación" : "Nueva Asociación"}
            </h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500">Categoría</label>
                <select
                  value={formData.idCategoria}
                  onChange={(e) =>
                    setFormData({ ...formData, idCategoria: Number(e.target.value) })
                  }
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-gray-900 transition bg-none"
                >
                  {CATEGORIAS.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.categoria}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500">Talle</label>
                <select
                  value={formData.idTalle}
                  onChange={(e) =>
                    setFormData({ ...formData, idTalle: Number(e.target.value) })
                  }
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-gray-900 transition bg-none"
                >
                  {TALLES.map((talle) => (
                    <option key={talle.id} value={talle.id}>
                      Talle {talle.talle}
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
