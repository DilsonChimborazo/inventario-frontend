import type { Producto } from "../../types/producto";
import {
  estadoClasses,
  estadoLabels,
  formatearFecha,
} from "../../utils/producto";

interface ProductTableProps {
  productos: Producto[];
  cargando: boolean;
  onVerify: (producto: Producto) => void;
  onDelete: (producto: Producto) => void;
}

export function ProductTable({
  productos,
  cargando,
  onVerify,
  onDelete,
}: ProductTableProps) {
  return (
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-4">
        <h2 className="text-base font-semibold text-slate-950">
          Productos registrados
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1120px] text-left text-sm">
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-3">Producto</th>
              <th className="px-5 py-3">Inicial</th>
              <th className="px-5 py-3">Verificada</th>
              <th className="px-5 py-3">Registro</th>
              <th className="px-5 py-3">Validacion</th>
              <th className="px-5 py-3">Estado</th>
              <th className="px-5 py-3 text-right">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {cargando ? (
              <EmptyRow text="Cargando inventario..." />
            ) : productos.length === 0 ? (
              <EmptyRow text="Sin productos registrados." />
            ) : (
              productos.map((producto) => (
                <ProductRow
                  key={producto.id}
                  producto={producto}
                  onVerify={onVerify}
                  onDelete={onDelete}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

interface ProductRowProps {
  producto: Producto;
  onVerify: (producto: Producto) => void;
  onDelete: (producto: Producto) => void;
}

function ProductRow({
  producto,
  onVerify,
  onDelete,
}: ProductRowProps) {
  return (
    <tr className="transition hover:bg-slate-50">
      <td className="px-5 py-4 font-medium text-slate-950">
        {producto.nombre}
      </td>
      <td className="px-5 py-4 text-slate-700">
        {producto.cantidadInicial}
      </td>
      <td className="px-5 py-4 text-slate-700">
        {producto.cantidadVerificada ?? "-"}
      </td>
      <td className="px-5 py-4 text-slate-700">
        <p className="font-medium text-slate-900">
          {producto.turno}
        </p>
        <p className="mt-1 text-xs text-slate-500">
          {formatearFecha(producto.fechaRegistro)}
        </p>
      </td>
      <td className="px-5 py-4 text-slate-700">
        <p className="font-medium text-slate-900">
          {producto.turnoVerificacion ?? "-"}
        </p>
        <p className="mt-1 text-xs text-slate-500">
          {producto.fechaVerificacion
            ? formatearFecha(producto.fechaVerificacion)
            : "-"}
        </p>
      </td>
      <td className="px-5 py-4">
        <span
          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ${
            estadoClasses[producto.estado] ??
            estadoClasses.PENDIENTE
          }`}
        >
          {estadoLabels[producto.estado] ?? producto.estado}
        </span>
      </td>
      <td className="px-5 py-4">
        <div className="flex justify-end gap-2">
          <button
            onClick={() => onVerify(producto)}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100"
          >
            Verificar
          </button>
          <button
            onClick={() => onDelete(producto)}
            className="rounded-md border border-rose-200 px-3 py-2 text-sm font-semibold text-rose-700 transition hover:border-rose-300 hover:bg-rose-50 focus:outline-none focus:ring-4 focus:ring-rose-100"
          >
            Eliminar
          </button>
        </div>
      </td>
    </tr>
  );
}

function EmptyRow({ text }: { text: string }) {
  return (
    <tr>
      <td
        colSpan={7}
        className="px-5 py-10 text-center text-slate-500"
      >
        {text}
      </td>
    </tr>
  );
}
