import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Link from "next/link";
import { Inbox } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();
  const userId = session?.user?.id;
  const isAdmin = session?.user?.role === "ADMIN";

  const [clientCount, recommendationCount, productCount, latestClients] = await Promise.all([
    prisma.client.count({
      where: isAdmin ? {} : { agentId: userId },
    }),
    prisma.recommendation.count({
      where: isAdmin ? {} : { agentId: userId },
    }),
    prisma.product.count(),
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
            Descubrimientos AI
          </h3>
          <p className="text-2xl font-bold text-green-600">
            {recommendationCount}
          </p>
        </div>

        <div className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-2 h-full bg-purple-500"></div>
          <h3 className="text-sm font-semibold text-slate mb-1">
            Catálogo Total
          </h3>
          <p className="text-2xl font-bold text-purple-600">
            {productCount}
          </p>
        </div>
      </div>

      <section className="mt-10 p-6 bg-white rounded-xl border border-gray-100 shadow-sm min-h-100">
        <h2 className="text-xl font-bold text-trust-blue border-b border-gray-100 pb-4 mb-4">
          Últimos Clientes
        </h2>

        {latestClients.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center text-slate">
            <Inbox size={40} className="mb-4 opacity-50" />
            <p className="font-medium">Todavía no hay clientes creados.</p>
            <p className="text-sm mt-2">
              Visita &quot;Nuevo Cliente&quot; en el menú para crear el primero.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            {latestClients.map((client) => (
              <Link
                href={`/clients/${client.id}`}
                key={client.id}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-soft-light transition-colors cursor-pointer group"
              >
                <div>
                  <p className="font-semibold text-graphite group-hover:text-trust-blue transition-colors">
                    {client.firstName} {client.lastName}
                  </p>
                  <p className="text-sm text-slate">
                    {client.email || "Sin correo"}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {client.riskLevel && (
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full ${
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
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
