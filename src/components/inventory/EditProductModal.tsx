import { useState } from "react";
import type { Producto } from "../../types/producto";

interface EditProductModalProps {
  producto: Producto;
  onClose: () => void;
  onConfirm: (data: { nombre: string; cantidadInicial: number }) => void;
}

export function EditProductModal({
  producto,
  onClose,
  onConfirm,
}: EditProductModalProps) {
  const [nombre, setNombre] = useState(producto.nombre);
  const [cantidad, setCantidad] = useState(
    producto.cantidadInicial.toString()
  );
  const [error, setError] = useState("");

  function handleSubmit() {
    const nombreLimpio = nombre.trim();
    const cantidadNumerica = Number(cantidad);

    if (!nombreLimpio || Number.isNaN(cantidadNumerica) || cantidadNumerica < 0) {
      setError("Datos inválidos");
      return;
    }

    onConfirm({
      nombre: nombreLimpio,
      cantidadInicial: cantidadNumerica,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 text-left shadow-2xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-500">
          Editar producto
        </p>

        <h2 className="mt-1 text-2xl font-bold text-slate-950">
          {producto.nombre}
        </h2>

        <div className="mt-4 space-y-3">
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full rounded-md border px-3 py-2 text-sm"
            placeholder="Nombre"
          />

          <input
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
            className="w-full rounded-md border px-3 py-2 text-sm"
            placeholder="Cantidad"
            type="number"
          />

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-md border border-slate-300 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            className="h-10 rounded-md bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}