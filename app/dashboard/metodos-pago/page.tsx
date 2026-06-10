"use client";

import { useState } from "react";
import { Plus, Search, Edit2, Trash2, CreditCard, Info } from "lucide-react";
import { toast } from "sonner";

interface MetodoPago {
  id: number;
  metodo: string;
}

const INITIAL_METHODS: MetodoPago[] = [
  { id: 1, metodo: "Efectivo" },
  { id: 2, metodo: "Transferencia Bancaria" },
  { id: 3, metodo: "Mercado Pago" },
];

export default function MetodosPagoABM() {
  const [methods, setMethods] = useState<MetodoPago[]>(INITIAL_METHODS);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState<MetodoPago | null>(null);
  const [newMethodName, setNewMethodName] = useState("");

  const filteredMethods = methods.filter((m) =>
    m.metodo.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenAddModal = () => {
    setEditingMethod(null);
    setNewMethodName("");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (method: MetodoPago) => {
    setEditingMethod(method);
    setNewMethodName(method.metodo);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMethodName.trim()) {
      toast.error("El nombre del método de pago no puede estar vacío");
      return;
    }

    if (editingMethod) {
      setMethods(
        methods.map((m) => (m.id === editingMethod.id ? { ...m, metodo: newMethodName } : m))
      );
      toast.success(`Método "${newMethodName}" actualizado con éxito (simulado)`);
    } else {
      const newId = methods.length > 0 ? Math.max(...methods.map((m) => m.id)) + 1 : 1;
      setMethods([...methods, { id: newId, metodo: newMethodName }]);
      toast.success(`Método "${newMethodName}" creado con éxito (simulado)`);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: number, name: string) => {
    if (confirm(`¿Estás seguro de que querés eliminar el método "${name}"?`)) {
      setMethods(methods.filter((m) => m.id !== id));
      toast.success(`Método "${name}" eliminado con éxito (simulado)`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <CreditCard className="h-6 w-6 text-gray-700" />
            Métodos de Pago
          </h1>
          <p className="text-sm text-gray-500">
            Administración de métodos de pago aceptados para las transacciones.
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center justify-center gap-2 rounded-xl bg-gray-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 transition shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Nuevo Método
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
          placeholder="Buscar método..."
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
                <th className="px-6 py-4">Método de Pago</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
              {filteredMethods.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-10 text-center text-gray-400">
                    No se encontraron métodos de pago
                  </td>
                </tr>
              ) : (
                filteredMethods.map((method) => (
                  <tr key={method.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">#{method.id}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{method.metodo}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(method)}
                          className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition"
                          title="Editar"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(method.id, method.metodo)}
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
              {editingMethod ? "Editar Método de Pago" : "Nuevo Método de Pago"}
            </h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500">Método de Pago</label>
                <input
                  type="text"
                  placeholder="Ej. Mercado Pago"
                  value={newMethodName}
                  onChange={(e) => setNewMethodName(e.target.value)}
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
