import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";

import { DeleteProductModal } from "../components/inventory/DeleteProductModal";
import { InventoryHeader } from "../components/inventory/InventoryHeader";
import { ProductForm } from "../components/inventory/ProductForm";
import { ProductTable } from "../components/inventory/ProductTable";
import { VerifyProductModal } from "../components/inventory/VerifyProductModal";

import { api } from "../service/api";
import type { Producto } from "../types/producto";
import { exportInventoryToExcel } from "../utils/exportInventory";
import { calcularResumen } from "../utils/producto";

export default function Home() {
  const [nombre, setNombre] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [errorFormulario, setErrorFormulario] = useState("");

  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [finalizando, setFinalizando] = useState(false);

  const [productoAVerificar, setProductoAVerificar] =
    useState<Producto | null>(null);
  const [cantidadVerificada, setCantidadVerificada] = useState("");
  const [errorModal, setErrorModal] = useState("");


  const [productoAEliminar, setProductoAEliminar] =
    useState<Producto | null>(null);

  const [productoAEditar, setProductoAEditar] =
    useState<Producto | null>(null);

  const [nombreEdit, setNombreEdit] = useState("");
  const [cantidadEdit, setCantidadEdit] = useState("");
  const [errorEdit, setErrorEdit] = useState("");

  const resumen = useMemo(
    () => calcularResumen(productos),
    [productos]
  );

  async function cargarProductos() {
    const { data } = await api.get<Producto[]>("/productos");
    setProductos(data);
  }

  async function registrarProducto(event: FormEvent) {
    event.preventDefault();
    setErrorFormulario("");

    const nombreLimpio = nombre.trim();
    const cantidadNumerica = Number(cantidad);

    if (!nombreLimpio || !cantidad) {
      setErrorFormulario("Completa el nombre y la cantidad.");
      return;
    }

    if (Number.isNaN(cantidadNumerica) || cantidadNumerica < 0) {
      setErrorFormulario("La cantidad debe ser un numero valido.");
      return;
    }

    await api.post("/productos", {
      nombre: nombreLimpio,
      cantidadInicial: cantidadNumerica,
    });

    setNombre("");
    setCantidad("");
    await cargarProductos();
  }

  function actualizarNombre(value: string) {
    setNombre(value);
    setErrorFormulario("");
  }

  function actualizarCantidad(value: string) {
    setCantidad(value);
    setErrorFormulario("");
  }

  function abrirModalVerificacion(producto: Producto) {
    setProductoAVerificar(producto);
    setCantidadVerificada(
      producto.cantidadVerificada?.toString() ?? ""
    );
    setErrorModal("");
  }

  function cerrarModalVerificacion() {
    setProductoAVerificar(null);
    setCantidadVerificada("");
    setErrorModal("");
  }

  async function verificarProducto(event: FormEvent) {
    event.preventDefault();
    setErrorModal("");

    if (!productoAVerificar || !cantidadVerificada) {
      setErrorModal("Ingresa la cantidad verificada.");
      return;
    }

    const cantidadNumerica = Number(cantidadVerificada);

    if (Number.isNaN(cantidadNumerica) || cantidadNumerica < 0) {
      setErrorModal("La cantidad debe ser un numero valido.");
      return;
    }

    await api.patch(
      `/productos/${productoAVerificar.id}/verificar`,
      {
        cantidadVerificada: cantidadNumerica,
      }
    );

    cerrarModalVerificacion();
    await cargarProductos();
  }

  function actualizarCantidadVerificada(value: string) {
    setCantidadVerificada(value);
    setErrorModal("");
  }

  async function eliminarProducto() {
    if (!productoAEliminar) return;

    await api.delete(`/productos/${productoAEliminar.id}`);
    setProductoAEliminar(null);
    await cargarProductos();
  }

  function abrirModalEditar(producto: Producto) {
    setProductoAEditar(producto);
    setNombreEdit(producto.nombre);
    setCantidadEdit(producto.cantidadInicial.toString());
    setErrorEdit("");
  }

  function cerrarModalEditar() {
    setProductoAEditar(null);
    setNombreEdit("");
    setCantidadEdit("");
    setErrorEdit("");
  }

  async function guardarEdicion(event: FormEvent) {
    event.preventDefault();
    setErrorEdit("");

    const nombreLimpio = nombreEdit.trim();
    const cantidadNumerica = Number(cantidadEdit);

    if (!nombreLimpio || Number.isNaN(cantidadNumerica) || cantidadNumerica < 0) {
      setErrorEdit("Datos inválidos");
      return;
    }

    if (!productoAEditar) return;

    await api.patch(`/productos/${productoAEditar.id}`, {
      nombre: nombreLimpio,
      cantidadInicial: cantidadNumerica,
    });

    cerrarModalEditar();
    await cargarProductos();
  }

  async function finalizarInventario() {
    if (productos.length === 0 || finalizando) return;

    setFinalizando(true);

    try {
      const { data } = await api.post<Producto[]>(
        "/productos/finalizar"
      );

      if (data.length > 0) {
        exportInventoryToExcel(data);
      }

      setProductos([]);
    } finally {
      setFinalizando(false);
    }
  }

  useEffect(() => {
    let activo = true;

    api
      .get<Producto[]>("/productos")
      .then(({ data }) => {
        if (activo) setProductos(data);
      })
      .finally(() => {
        if (activo) setCargando(false);
      });

    return () => {
      activo = false;
    };
  }, []);

  return (
    <main className="min-h-screen bg-slate-100 text-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <InventoryHeader
          resumen={resumen}
          finalizando={finalizando}
          onFinalize={finalizarInventario}
        />

        <ProductForm
          nombre={nombre}
          cantidad={cantidad}
          error={errorFormulario}
          onNombreChange={actualizarNombre}
          onCantidadChange={actualizarCantidad}
          onSubmit={registrarProducto}
        />

        <ProductTable
          productos={productos}
          cargando={cargando}
          onVerify={abrirModalVerificacion}
          onDelete={setProductoAEliminar}
          onEdit={abrirModalEditar}
        />
      </div>

      {/* VERIFY MODAL */}
      {productoAVerificar && (
        <VerifyProductModal
          producto={productoAVerificar}
          cantidadVerificada={cantidadVerificada}
          error={errorModal}
          onCantidadChange={actualizarCantidadVerificada}
          onClose={cerrarModalVerificacion}
          onSubmit={verificarProducto}
        />
      )}

      {/* DELETE MODAL */}
      {productoAEliminar && (
        <DeleteProductModal
          producto={productoAEliminar}
          onClose={() => setProductoAEliminar(null)}
          onConfirm={eliminarProducto}
        />
      )}

      {/* EDIT MODAL */}
      {productoAEditar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <form
            onSubmit={guardarEdicion}
            className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-2xl"
          >
            <p className="text-sm font-semibold uppercase text-blue-500">
              Editar producto
            </p>

            <h2 className="mt-1 text-2xl font-bold">
              {productoAEditar.nombre}
            </h2>

            <div className="mt-4 space-y-3">
              <input
                value={nombreEdit}
                onChange={(e) => setNombreEdit(e.target.value)}
                className="w-full rounded-md border px-3 py-2 text-sm"
                placeholder="Nombre"
              />

              <input
                type="number"
                value={cantidadEdit}
                onChange={(e) => setCantidadEdit(e.target.value)}
                className="w-full rounded-md border px-3 py-2 text-sm"
                placeholder="Cantidad"
              />

              {errorEdit && (
                <p className="text-sm text-red-500">{errorEdit}</p>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={cerrarModalEditar}
                className="h-10 rounded-md border px-4 text-sm"
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="h-10 rounded-md bg-blue-600 px-4 text-sm text-white"
              >
                Guardar
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}