import type { Producto, ResumenInventario } from "../types/producto";

export const estadoClasses: Record<string, string> = {
  CORRECTO: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  "NO COINCIDE": "bg-rose-50 text-rose-700 ring-rose-200",
  PENDIENTE: "bg-amber-50 text-amber-700 ring-amber-200",
};

export const estadoLabels: Record<string, string> = {
  CORRECTO: "Correcto",
  "NO COINCIDE": "No coincide",
  PENDIENTE: "Pendiente",
};

export function formatearFecha(fecha: string) {
  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(fecha));
}

export function calcularResumen(
  productos: Producto[]
): ResumenInventario {
  return {
    total: productos.length,
    pendientes: productos.filter(
      (producto) => producto.estado === "PENDIENTE"
    ).length,
    correctos: productos.filter(
      (producto) => producto.estado === "CORRECTO"
    ).length,
    diferencias: productos.filter(
      (producto) => producto.estado === "NO COINCIDE"
    ).length,
  };
}
