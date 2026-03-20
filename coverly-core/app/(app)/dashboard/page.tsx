import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();
  const userId = session?.user?.id;
  const isAdmin = session?.user?.role === "ADMIN";

  // Conteos dinámicos desde la base de datos
  const [clientCount, recommendationCount, latestClients] = await Promise.all([
    prisma.client.count({
      where: isAdmin ? {} : { agentId: userId },
    }),
    prisma.recommendation.count({
      where: isAdmin ? {} : { agentId: userId },
    }),
    prisma.client.findMany({
      where: isAdmin ? {} : { agentId: userId },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        createdAt: true,
        riskLevel: true,
      },
    }),
  ]);

  const riskColorMap: Record<string, string> = {
    LOW: "bg-emerald-100 text-emerald-700",
    MEDIUM: "bg-yellow-100 text-yellow-700",
    HIGH: "bg-red-100 text-red-700",
  };

  const riskLabelMap: Record<string, string> = {
    LOW: "Riesgo Bajo",
    MEDIUM: "Riesgo Medio",
    HIGH: "Riesgo Alto",
  };

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
          <p className="text-2xl font-bold text-graphite">{clientCount}</p>
        </div>

        <div className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-2 h-full bg-green-500"></div>
          <h3 className="text-sm font-semibold text-slate mb-1">
            Recomendaciones Generadas
          </h3>
          <p className="text-2xl font-bold text-green-600">
            {recommendationCount}
          </p>
        </div>
      </div>

      <section className="mt-10 p-6 bg-white rounded-xl border border-gray-100 shadow-sm min-h-100">
        <h2 className="text-xl font-bold text-trust-blue border-b border-gray-100 pb-4 mb-4">
          Últimos Clientes
        </h2>

        {latestClients.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center text-slate">
            <span className="text-4xl mb-4 opacity-50">📭</span>
            <p className="font-medium">Todavía no hay clientes creados.</p>
            <p className="text-sm mt-2">
              Visita &quot;Nuevo Cliente&quot; en el menú para crear el primero.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {latestClients.map((client) => (
              <div
                key={client.id}
                className="flex items-center justify-between py-3"
              >
                <div>
                  <p className="font-semibold text-graphite">
                    {client.firstName} {client.lastName}
                  </p>
                  <p className="text-sm text-slate">{client.email || "Sin correo"}</p>
                </div>
                <div className="flex items-center gap-3">
                  {client.riskLevel && (
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        riskColorMap[client.riskLevel] ||
                        "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {riskLabelMap[client.riskLevel] || client.riskLevel}
                    </span>
                  )}
                  <span className="text-xs text-slate">
                    {format(new Date(client.createdAt), "dd MMM yyyy", {
                      locale: es,
                    })}
                  </span>
                  <Link
                    href={`/clients`}
                    className="text-xs text-trust-blue hover:underline"
                  >
                    Ver →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
