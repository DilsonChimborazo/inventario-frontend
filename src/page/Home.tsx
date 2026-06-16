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
  const [productos, setProductos] = useState<Producto[]>([]);
  const [productoAVerificar, setProductoAVerificar] =
    useState<Producto | null>(null);
  const [productoAEliminar, setProductoAEliminar] =
    useState<Producto | null>(null);
  const [cantidadVerificada, setCantidadVerificada] =
    useState("");
  const [errorFormulario, setErrorFormulario] = useState("");
  const [errorModal, setErrorModal] = useState("");
  const [cargando, setCargando] = useState(true);
  const [finalizando, setFinalizando] = useState(false);

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

    if (
      Number.isNaN(cantidadNumerica) ||
      cantidadNumerica < 0
    ) {
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

  function actualizarCantidadVerificada(value: string) {
    setCantidadVerificada(value);
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

    if (
      Number.isNaN(cantidadNumerica) ||
      cantidadNumerica < 0
    ) {
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

  async function eliminarProducto() {
    if (!productoAEliminar) {
      return;
    }

    await api.delete(`/productos/${productoAEliminar.id}`);
    setProductoAEliminar(null);
    await cargarProductos();
  }

  async function finalizarInventario() {
    if (productos.length === 0 || finalizando) {
      return;
    }

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
        if (activo) {
          setProductos(data);
        }
      })
      .finally(() => {
        if (activo) {
          setCargando(false);
        }
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
        />
      </div>

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

      {productoAEliminar && (
        <DeleteProductModal
          producto={productoAEliminar}
          onClose={() => setProductoAEliminar(null)}
          onConfirm={eliminarProducto}
        />
      )}
    </main>
  );
}
