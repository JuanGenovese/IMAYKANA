"use client";

import { useState } from "react";
import { Plus, Search, Edit2, Trash2, FolderOpen, X, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Categoria, Talle } from "@/lib/db/schema";
import {
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
} from "@/actions/categorias";

type CategoriaConTalles = Categoria & {
  talles: Talle[];
};

interface CategoriaResult {
  success?: boolean;
  error?: string;
  categoria?: CategoriaConTalles;
  requiresConfirmation?: boolean;
  affectedCount?: number;
  productos?: { id: number; nombre: string }[];
}

interface CategoriasABMClientProps {
  initialCategories: CategoriaConTalles[];
}

export function CategoriasABMClient({ initialCategories }: CategoriasABMClientProps) {
  const [categories, setCategories] = useState<CategoriaConTalles[]>(initialCategories);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoriaConTalles | null>(null);
  const [name, setName] = useState("");
  const [tallesList, setTallesList] = useState<string[]>([]);
  const [talleInput, setTalleInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modal de confirmación de desvinculación
  const [pendingAction, setPendingAction] = useState<{
    type: "update" | "delete";
    id: number;
    nombre: string;
    tallesList?: string[];
    productos: Array<{ id: number; nombre: string }>;
  } | null>(null);

  const filteredCategories = categories.filter((c) =>
    c.categoria.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenAddModal = () => {
    setEditingCategory(null);
    setName("");
    setTallesList([]);
    setTalleInput("");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cat: CategoriaConTalles) => {
    setEditingCategory(cat);
    setName(cat.categoria);
    setTallesList(cat.talles.map((t) => t.talle));
    setTalleInput("");
    setIsModalOpen(true);
  };

  const handleAddTalle = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleaned = talleInput.trim().toUpperCase();
    if (!cleaned) return;
    if (tallesList.includes(cleaned)) {
      toast.warning(`El talle "${cleaned}" ya está agregado.`);
      return;
    }
    setTallesList([...tallesList, cleaned]);
    setTalleInput("");
  };

  const handleRemoveTalle = (t: string) => {
    setTallesList(tallesList.filter((item) => item !== t));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      toast.error("El nombre de la categoría no puede estar vacío");
      return;
    }
    if (tallesList.length === 0) {
      toast.error("Tenés que agregar al menos un talle para esta categoría.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingCategory) {
        const res = (await actualizarCategoria(editingCategory.id, trimmed, tallesList)) as CategoriaResult;
        if (res.requiresConfirmation) {
          setPendingAction({
            type: "update",
            id: editingCategory.id,
            nombre: trimmed,
            tallesList: tallesList,
            productos: res.productos || [],
          });
          setIsSubmitting(false);
          return;
        }

        if (res.error) {
          toast.error(res.error);
        } else if (res.categoria) {
          setCategories(
            categories.map((c) =>
              c.id === editingCategory.id ? (res.categoria as CategoriaConTalles) : c
            )
          );
          toast.success(`Categoría "${trimmed}" actualizada con éxito.`);
          setIsModalOpen(false);
        }
      } else {
        const res = (await crearCategoria(trimmed, tallesList)) as CategoriaResult;
        if (res.error) {
          toast.error(res.error);
        } else if (res.categoria) {
          setCategories([...categories, res.categoria as CategoriaConTalles]);
          toast.success(`Categoría "${trimmed}" creada con éxito.`);
          setIsModalOpen(false);
        }
      }
    } catch (err) {
      toast.error("Hubo un error inesperado al guardar.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number, catName: string) => {
    const res = (await eliminarCategoria(id)) as CategoriaResult;
    if (res.requiresConfirmation) {
      setPendingAction({
        type: "delete",
        id,
        nombre: catName,
        productos: res.productos || [],
      });
      return;
    }

    if (res.error) {
      toast.error(res.error);
    } else {
      setCategories(categories.filter((c) => c.id !== id));
      toast.success(`Categoría "${catName}" eliminada con éxito.`);
    }
  };

  const handleConfirmPendingAction = async () => {
    if (!pendingAction) return;
    setIsSubmitting(true);
    const toastId = toast.loading("Procesando cambios...");
    try {
      if (pendingAction.type === "update") {
        const res = (await actualizarCategoria(
          pendingAction.id,
          pendingAction.nombre,
          pendingAction.tallesList || [],
          true
        )) as CategoriaResult;
        if (res.error) {
          toast.error(res.error, { id: toastId });
        } else if (res.categoria) {
          setCategories(
            categories.map((c) =>
              c.id === pendingAction.id ? (res.categoria as CategoriaConTalles) : c
            )
          );
          toast.success(`Categoría "${pendingAction.nombre}" actualizada con éxito.`, {
            id: toastId,
          });
          setIsModalOpen(false);
          setPendingAction(null);
        }
      } else if (pendingAction.type === "delete") {
        const res = (await eliminarCategoria(pendingAction.id, true)) as CategoriaResult;
        if (res.error) {
          toast.error(res.error, { id: toastId });
        } else {
          setCategories(categories.filter((c) => c.id !== pendingAction.id));
          toast.success(`Categoría "${pendingAction.nombre}" eliminada con éxito.`, {
            id: toastId,
          });
          setPendingAction(null);
        }
      }
    } catch (err) {
      toast.error("Error al procesar la confirmación.", { id: toastId });
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FolderOpen className="h-6 w-6 text-gray-700" />
            Categorías
          </h1>
          <p className="text-sm text-gray-500">
            Administración de las categorías generales de prendas para el catálogo.
          </p>
        </div>
        <Button
          onClick={handleOpenAddModal}
          className="flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2.5 text-sm font-semibold transition shadow-sm h-auto"
        >
          <Plus className="h-4 w-4" />
          Nueva Categoría
        </Button>
      </div>

      <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-sm max-w-md">
        <Search className="h-4 w-4 text-gray-400 shrink-0" />
        <input
          type="text"
          placeholder="Buscar por categoría..."
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
                <th className="px-6 py-4">Talles Asociados</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
              {filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-gray-400">
                    No se encontraron categorías
                  </td>
                </tr>
              ) : (
                filteredCategories.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-gray-900 font-medium">#{c.id}</td>
                    <td className="px-6 py-4 font-semibold text-gray-900 capitalize text-base">
                      {c.categoria}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {c.talles.map((t) => (
                          <span
                            key={t.id}
                            className="bg-neutral-100 text-neutral-800 text-[11px] font-semibold px-2 py-0.5 rounded-lg border border-neutral-200/40 uppercase"
                          >
                            {t.talle}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(c)}
                          className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition"
                          title="Editar"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(c.id, c.categoria)}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-sm p-4 animate-in fade-in duration-200 overflow-y-auto">
          <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              {editingCategory ? "Editar Categoría" : "Nueva Categoría"}
            </h2>
            <form onSubmit={handleSave} className="space-y-4 flex-1 overflow-y-auto pr-1">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500">Nombre de la Categoría</label>
                <Input
                  type="text"
                  placeholder="Ej. Camperas, Pantalones..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isSubmitting}
                  required
                  className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm"
                />
              </div>

              {/* Apartado de talles */}
              <div className="space-y-2.5 border-t border-gray-100 pt-4">
                <label className="text-xs font-semibold text-gray-500">Talles de la Categoría (Mínimo 1)</label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Ej. S, M, L, 42..."
                    value={talleInput}
                    onChange={(e) => setTalleInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTalle();
                      }
                    }}
                    disabled={isSubmitting}
                    className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm"
                  />
                  <Button
                    type="button"
                    onClick={() => handleAddTalle()}
                    disabled={isSubmitting}
                    className="rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 px-4 font-semibold text-sm transition"
                  >
                    Agregar
                  </Button>
                </div>

                {/* Lista de talles cargados */}
                <div className="flex flex-wrap gap-1.5 min-h-[40px] p-2 bg-gray-50 rounded-xl border border-gray-150">
                  {tallesList.length === 0 ? (
                    <span className="text-xs text-gray-400 self-center">Sin talles agregados.</span>
                  ) : (
                    tallesList.map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center gap-1 bg-white text-gray-800 text-[11px] font-bold px-2 py-1 rounded-lg border border-gray-200 shadow-sm uppercase"
                      >
                        {t}
                        <button
                          type="button"
                          onClick={() => handleRemoveTalle(t)}
                          disabled={isSubmitting}
                          className="text-gray-400 hover:text-red-500 transition ml-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                  className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 text-sm font-semibold transition shadow-sm"
                >
                  {isSubmitting ? "Guardando..." : "Guardar"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Advertencia de prendas vinculadas */}
      {pendingAction && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-gray-150 animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-red-600 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600 shrink-0 animate-bounce" />
              Prendas Vinculadas Detectadas
            </h3>
            <p className="mt-3 text-sm text-gray-650 leading-relaxed font-semibold">
              Esta categoría (o sus talles modificados) está siendo utilizada por las siguientes prendas:
            </p>
            
            {/* Lista de prendas afectadas */}
            <div className="mt-3 max-h-40 overflow-y-auto border border-red-100 rounded-xl p-3 bg-red-50/30 divide-y divide-red-100/50">
              {pendingAction.productos.map((p) => (
                <div key={p.id} className="text-xs text-gray-700 font-medium py-1.5 capitalize">
                  • {p.nombre} (Ref: #{p.id})
                </div>
              ))}
            </div>

            <p className="mt-4 text-xs text-gray-500 leading-relaxed">
              <strong>Atención:</strong> Al confirmar, se desvinculará esta categoría de las prendas mencionadas y se las pasará automáticamente al estado <strong>&quot;No disponible&quot;</strong> por seguridad.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row justify-end gap-2.5">
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
                onClick={() => setPendingAction(null)}
                className="w-full sm:w-auto rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
              >
                Cancelar
              </Button>
              <Button
                type="button"
                disabled={isSubmitting}
                onClick={handleConfirmPendingAction}
                className="w-full sm:w-auto rounded-xl bg-red-600 text-white hover:bg-red-700 px-4 py-2 text-sm font-semibold transition shadow-sm"
              >
                Desvincular y deshabilitar prendas
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
