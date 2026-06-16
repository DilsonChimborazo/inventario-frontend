export interface Producto {
  id: number;
  nombre: string;
  cantidadInicial: number;
  cantidadVerificada?: number;
  fechaVerificacion?: string;
  turnoVerificacion?: string;
  estado: string;
  turno: string;
  fechaRegistro: string;
}

export interface ResumenInventario {
  total: number;
  pendientes: number;
  correctos: number;
  diferencias: number;
}
