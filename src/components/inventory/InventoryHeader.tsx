import type { ResumenInventario } from "../../types/producto";

interface InventoryHeaderProps {
  resumen: ResumenInventario;
  finalizando: boolean;
  onFinalize: () => void;
}

export function InventoryHeader({
  resumen,
  finalizando,
  onFinalize,
}: InventoryHeaderProps) {
  const sinProductos = resumen.total === 0;

  return (
    <header className="mb-6 flex flex-col gap-4 border-b border-slate-200 pb-6 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Control operativo
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-normal text-slate-950 sm:text-4xl">
          Inventario
        </h1>
        <button
          type="button"
          onClick={onFinalize}
          disabled={sinProductos || finalizando}
          className="mt-4 h-10 rounded-md bg-slate-950 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-200 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {finalizando
            ? "Finalizando..."
            : "Finalizar inventario"}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <SummaryCard label="Total" value={resumen.total} />
        <SummaryCard
          label="Pendientes"
          value={resumen.pendientes}
          valueClassName="text-amber-600"
        />
        <SummaryCard
          label="Correctos"
          value={resumen.correctos}
          valueClassName="text-emerald-600"
        />
        <SummaryCard
          label="Diferencias"
          value={resumen.diferencias}
          valueClassName="text-rose-600"
        />
      </div>
    </header>
  );
}

interface SummaryCardProps {
  label: string;
  value: number;
  valueClassName?: string;
}

function SummaryCard({
  label,
  value,
  valueClassName = "",
}: SummaryCardProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <p className="text-xs font-medium text-slate-500">
        {label}
      </p>
      <p className={`mt-1 text-2xl font-bold ${valueClassName}`}>
        {value}
      </p>
    </div>
  );
}
