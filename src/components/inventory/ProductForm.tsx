import type { FormEvent } from "react";

interface ProductFormProps {
  nombre: string;
  cantidad: string;
  error: string;
  onNombreChange: (value: string) => void;
  onCantidadChange: (value: string) => void;
  onSubmit: (event: FormEvent) => void;
}

export function ProductForm({
  nombre,
  cantidad,
  error,
  onNombreChange,
  onCantidadChange,
  onSubmit,
}: ProductFormProps) {
  return (
    <section className="mb-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <form
        onSubmit={onSubmit}
        className="grid gap-4 lg:grid-cols-[1fr_220px_auto] lg:items-end"
      >
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Producto
          </label>
          <input
            type="text"
            placeholder="Nombre del producto"
            value={nombre}
            onChange={(event) =>
              onNombreChange(event.target.value)
            }
            className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Cantidad
          </label>
          <input
            type="number"
            min="0"
            placeholder="0"
            value={cantidad}
            onChange={(event) =>
              onCantidadChange(event.target.value)
            }
            className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
        </div>

        <button className="h-11 rounded-md bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200">
          Guardar
        </button>
      </form>

      {error && (
        <p className="mt-3 text-sm font-medium text-rose-600">
          {error}
        </p>
      )}
    </section>
  );
}
