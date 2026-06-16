import * as XLSX from "xlsx";
import type { Producto } from "../types/producto";
import { formatearFecha } from "./producto";

function formatNullableDate(value: string | undefined) {
  return value ? formatearFecha(value) : "";
}

export function exportInventoryToExcel(productos: Producto[]) {
  const rows = productos.map((producto) => ({
    Producto: producto.nombre,
    "Cantidad inicial": producto.cantidadInicial,
    "Cantidad verificada": producto.cantidadVerificada ?? "",
    Estado: producto.estado,
    "Turno registro": producto.turno,
    "Fecha registro": formatearFecha(producto.fechaRegistro),
    "Turno validacion": producto.turnoVerificacion ?? "",
    "Fecha validacion": formatNullableDate(
      producto.fechaVerificacion
    ),
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);

  worksheet["!cols"] = [
    { wch: 28 },
    { wch: 18 },
    { wch: 20 },
    { wch: 16 },
    { wch: 18 },
    { wch: 24 },
    { wch: 20 },
    { wch: 24 },
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Inventario"
  );

  const timestamp = new Date()
    .toISOString()
    .replace(/[:.]/g, "-");

  XLSX.writeFile(workbook, `inventario-${timestamp}.xlsx`);
}
