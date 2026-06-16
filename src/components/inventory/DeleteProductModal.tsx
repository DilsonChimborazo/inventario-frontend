import type { Producto } from "../../types/producto";

interface DeleteProductModalProps {
  producto: Producto;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteProductModal({
  producto,
  onClose,
  onConfirm,
}: DeleteProductModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 text-left shadow-2xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-rose-500">
          Eliminar producto
        </p>
        <h2 className="mt-1 text-2xl font-bold text-slate-950">
          {producto.nombre}
        </h2>
        <p className="mt-4 text-sm leading-6 text-slate-600">
          Esta accion eliminara el producto del inventario.
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-md border border-slate-300 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="h-10 rounded-md bg-rose-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700 focus:outline-none focus:ring-4 focus:ring-rose-200"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
