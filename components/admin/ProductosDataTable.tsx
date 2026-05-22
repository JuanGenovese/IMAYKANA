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
import Link from "next/link";
import { Pencil, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { EliminarProductoButton } from "./EliminarProductoButton";

const statusLabel: Record<string, string> = {
  AVAILABLE: "Disponible",
  RESERVED: "Reservado",
  SOLD: "Vendido",
};

const statusColors: Record<string, string> = {
  AVAILABLE: "bg-green-100 text-green-700",
  RESERVED: "bg-yellow-100 text-yellow-700",
  SOLD: "bg-gray-100 text-gray-500",
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
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium text-gray-900">{row.original.nombre}</span>
        <span className="text-xs text-gray-500 lg:hidden">
          {row.original.talleXCategoria?.categoria?.categoria}
        </span>
      </div>
    ),
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
      const s = row.original.estado?.estado ?? "AVAILABLE";
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
        <Link
          href={`/dashboard/productos/${row.original.id}`}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
          title="Editar"
        >
          <Pencil className="h-4 w-4" />
        </Link>
        <EliminarProductoButton id={row.original.id} variant="icon" />
      </div>
    ),
  },
];

interface ProductosDataTableProps {
  data: ProductoConRelaciones[];
  initialSearch?: string;
}

export function ProductosDataTable({
  data,
  initialSearch = "",
}: ProductosDataTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [globalFilter, setGlobalFilter] = useState(initialSearch);

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
          className="w-full max-w-xs rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900 sm:max-w-sm"
        />
        <Link
          href="/dashboard/productos/nuevo"
          className="inline-flex items-center justify-center rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700 transition whitespace-nowrap"
        >
          + Nuevo Producto
        </Link>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
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
    </div>
  );
}
