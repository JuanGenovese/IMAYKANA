"use client";

import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import type { ProductoConRelaciones } from "@/lib/db/schema";
import { Pencil, Image as ImageIcon, X } from "lucide-react";
import Image from "next/image";
import { EliminarProductoButton } from "./EliminarProductoButton";
import { ProductoForm, type FormMetadata } from "./ProductoForm";

const statusLabel: Record<string, string> = {
  Disponible: "Disponible",
  Reservado: "Reservado",
  Vendido: "Vendido",
};

const statusColors: Record<string, string> = {
  Disponible: "bg-green-100 text-green-700",
  Reservado: "bg-yellow-100 text-yellow-700",
  Vendido: "bg-gray-100 text-gray-500",
};

interface ProductosDataTableProps {
  data: ProductoConRelaciones[];
  metadata: FormMetadata;
  initialSearch?: string;
}

export function ProductosDataTable({
  data,
  metadata,
  initialSearch = "",
}: ProductosDataTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [globalFilter, setGlobalFilter] = useState(initialSearch);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductoConRelaciones | undefined>(undefined);

  const openNewProductModal = () => {
    setSelectedProduct(undefined);
    setIsModalOpen(true);
  };

  const openEditProductModal = (product: ProductoConRelaciones) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(undefined);
  };

  const columns: ColumnDef<ProductoConRelaciones>[] = [
    {
      id: "thumbnail",
      header: "",
      cell: ({ row }) => {
        const photo = row.original.imagenes?.[0]?.url;
        return (
          <div className="relative h-10 w-10 overflow-hidden rounded-md border border-gray-100 bg-gray-50">
            {photo ? (
              <Image
                src={photo}
                alt={row.original.nombre}
                fill
                className="object-cover"
                sizes="40px"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-gray-300">
                <ImageIcon className="h-5 w-5" />
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "nombre",
      header: "Nombre",
      cell: ({ row }) => {
        const isFeatured = row.original.destacado;
        const featuredPos = row.original.destacadoPos;
        return (
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900">{row.original.nombre}</span>
              {isFeatured && (
                <span className="inline-flex items-center gap-0.5 rounded-full bg-primary px-2 py-0.5 text-[10px] font-medium text-white border border-white shadow-sm">
                  Destacado {featuredPos ? `#${featuredPos}` : ""}
                </span>
              )}
            </div>
            <span className="text-xs text-gray-500 lg:hidden">
              {row.original.talleXCategoria?.categoria?.categoria}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "talleXCategoria.categoria.categoria",
      header: "Categoría",
      cell: ({ row }) => (
        <span className="hidden lg:inline">
          {row.original.talleXCategoria?.categoria?.categoria}
        </span>
      ),
    },
    {
      accessorKey: "talleXCategoria.talle.talle",
      header: "Talle",
      cell: ({ row }) => (
        <span>{row.original.talleXCategoria?.talle?.talle}</span>
      ),
    },
    { accessorKey: "color", header: "Color" },
    {
      accessorKey: "estado.estado",
      header: "Estado",
      cell: ({ row }) => {
        const s = row.original.estado?.estado ?? "Disponible";
        return (
          <span
            className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[s] ?? "bg-gray-100 text-gray-600"}`}
          >
            {statusLabel[s] ?? s}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => openEditProductModal(row.original)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
            title="Editar"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <EliminarProductoButton id={row.original.id} variant="icon" />
        </div>
      ),
    },
  ];

  // Sincroniza globalFilter con URL (?q=...)
  const updateSearch = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set("q", value);
      } else {
        params.delete("q");
      }
      router.replace(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams],
  );

  // Debounce para evitar pushes excesivos
  useEffect(() => {
    const timeout = setTimeout(() => updateSearch(globalFilter), 300);
    return () => clearTimeout(timeout);
  }, [globalFilter, updateSearch]);

  const table = useReactTable({
    data,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  return (
    <div className="flex flex-col gap-4">
      {/* Barra de búsqueda + botón nuevo */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="search"
          placeholder="Buscar producto..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900 sm:max-w-sm"
        />
        <button
          onClick={openNewProductModal}
          className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition whitespace-nowrap shadow-sm"
        >
          + Nuevo Producto
        </button>
      </div>

      {/* Vista de escritorio: Tabla */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id} className="border-b border-gray-100 bg-gray-50">
                {hg.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-10 text-center text-gray-400"
                >
                  No se encontraron productos.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3 text-gray-700">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Vista móvil: Cards */}
      <div className="flex flex-col gap-3 md:hidden">
        {table.getRowModel().rows.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-gray-400 shadow-sm">
            No se encontraron productos.
          </div>
        ) : (
          table.getRowModel().rows.map((row) => {
            const p = row.original;
            const photo = p.imagenes?.[0]?.url;
            const s = p.estado?.estado ?? "Disponible";
            return (
              <div
                key={row.id}
                className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-3 shadow-sm hover:border-gray-200 transition"
              >
                {/* Thumbnail */}
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
                  {photo ? (
                    <Image
                      src={photo}
                      alt={p.nombre}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-gray-300">
                      <ImageIcon className="h-6 w-6" />
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex flex-1 flex-col min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <span className="font-semibold text-gray-900 truncate text-sm">
                      {p.nombre}
                    </span>
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium shrink-0 ${statusColors[s] ?? "bg-gray-100 text-gray-600"}`}
                    >
                      {statusLabel[s] ?? s}
                    </span>
                  </div>

                  <span className="text-xs text-gray-500 mt-0.5">
                    {p.talleXCategoria?.categoria?.categoria || "Sin categoría"}
                  </span>

                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-600 font-medium">
                    <span className="bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                      Talle: {p.talleXCategoria?.talle?.talle || "-"}
                    </span>
                    {p.color && (
                      <span className="bg-gray-50 px-2 py-0.5 rounded border border-gray-100 truncate max-w-[120px]">
                        Color: {p.color}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 shrink-0 self-stretch justify-center pl-3 border-l border-gray-100">
                  <button
                    onClick={() => openEditProductModal(p)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
                    title="Editar"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <EliminarProductoButton id={p.id} variant="icon" />
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Paginación */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>
          Página {table.getState().pagination.pageIndex + 1} de{" "}
          {table.getPageCount()}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="rounded-lg border border-gray-200 px-3 py-1.5 hover:bg-gray-100 disabled:opacity-40 transition"
          >
            ← Anterior
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="rounded-lg border border-gray-200 px-3 py-1.5 hover:bg-gray-100 disabled:opacity-40 transition"
          >
            Siguiente →
          </button>
        </div>
      </div>

      {/* Modal flotante */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm transition-opacity duration-300">
          <div className="relative w-full max-w-3xl transform rounded-2xl bg-white shadow-2xl transition-all duration-300 flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 p-5">
              <h2 className="text-xl font-bold text-gray-900">
                {selectedProduct ? "Editar Producto" : "Nuevo Producto"}
              </h2>
              <button
                onClick={closeModal}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition"
              >
                <span className="sr-only">Cerrar</span>
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <ProductoForm
                producto={selectedProduct}
                metadata={metadata}
                onClose={closeModal}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
