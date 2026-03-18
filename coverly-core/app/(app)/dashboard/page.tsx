import { auth } from "@/auth";

export default async function DashboardPage() {
  const session = await auth();

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-trust-blue mb-2">
          Resumen de Actividad
        </h1>
        <p className="text-slate">Tus datos en tiempo real.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-2 h-full bg-trust-blue"></div>
          <h3 className="text-sm font-semibold text-slate mb-1">Rol actual</h3>
          <p className="text-2xl font-bold text-graphite font-mono">
            {session?.user?.role || "Desconocido"}
          </p>
        </div>

        <div className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-2 h-full bg-insight-teal"></div>
          <h3 className="text-sm font-semibold text-slate mb-1">
            Clientes Registrados
          </h3>
          <p className="text-2xl font-bold text-graphite">4</p>
        </div>

        <div className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-2 h-full bg-green-500"></div>
          <h3 className="text-sm font-semibold text-slate mb-1">
            Recomendaciones Exitosas
          </h3>
          <p className="text-2xl font-bold text-green-600">2</p>
        </div>
      </div>

      <section className="mt-10 p-6 bg-white rounded-xl border border-gray-100 shadow-sm min-h-100">
        <h2 className="text-xl font-bold text-trust-blue border-b border-gray-100 pb-4 mb-4">
          Últimos Clientes
        </h2>
        <div className="flex flex-col items-center justify-center p-12 text-center text-slate">
          <span className="text-4xl mb-4 opacity-50">📭</span>
          <p className="font-medium">Todavía no hay clientes creados.</p>
          <p className="text-sm mt-2">
            Visita "Nuevo Cliente" en el menú para crear el primero.
          </p>
        </div>
      </section>
    </div>
  );
}
