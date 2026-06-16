import type { FormEvent } from "react";
import type { Producto } from "../../types/producto";

interface VerifyProductModalProps {
  producto: Producto;
  cantidadVerificada: string;
  error: string;
  onCantidadChange: (value: string) => void;
  onClose: () => void;
  onSubmit: (event: FormEvent) => void;
}

export function VerifyProductModal({
  producto,
  cantidadVerificada,
  error,
  onCantidadChange,
  onClose,
  onSubmit,
}: VerifyProductModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 text-left shadow-2xl"
      >
        <div className="mb-5">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Verificacion
          </p>
          <h2 className="mt-1 text-2xl font-bold text-slate-950">
            {producto.nombre}
          </h2>
        </div>

        <div className="rounded-lg bg-slate-50 p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">
              Cantidad inicial
            </span>
            <span className="font-semibold text-slate-950">
              {producto.cantidadInicial}
            </span>
          </div>
        </div>

        <label className="mt-5 mb-2 block text-sm font-medium text-slate-700">
          Cantidad verificada
        </label>
        <input
          type="number"
          min="0"
          value={cantidadVerificada}
          onChange={(event) =>
            onCantidadChange(event.target.value)
          }
          autoFocus
          className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
        />

        {error && (
          <p className="mt-3 text-sm font-medium text-rose-600">
            {error}
          </p>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-md border border-slate-300 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100"
          >
            Cancelar
          </button>

          <button className="h-10 rounded-md bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200">
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
}
