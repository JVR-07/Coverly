"use client";

import { useEffect, useState } from "react";
import { Card, CardBody, Chip, Skeleton } from "@nextui-org/react";
import Link from "next/link";

interface RecommendedProduct {
  productId: string;
  matchScore: string;
  finalPrice: string;
  product: {
    id: string;
    name: string;
    type: string;
  };
}

interface Recommendation {
  id: string;
  status: string;
  globalScore: string;
  createdAt: string;
  client: {
    id: string;
    firstName: string;
    lastName: string;
  };
  products: RecommendedProduct[];
}

const statusMap: Record<
  string,
  { label: string; bg: string; text: string }
> = {
  GENERATED: { label: "Generada", bg: "bg-gray-100", text: "text-gray-700" },
  PRESENTED: { label: "Presentada", bg: "bg-yellow-100", text: "text-yellow-700" },
  ACCEPTED: { label: "Aceptada", bg: "bg-emerald-100", text: "text-emerald-700" },
  REJECTED: { label: "Rechazada", bg: "bg-red-100", text: "text-red-700" },
};

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/recommendations")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setRecommendations(data.data);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-trust-blue mb-2">
          Recomendaciones
        </h1>
        <p className="text-slate">
          Historial de recomendaciones generadas para tus clientes.
        </p>
      </header>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="bg-white border border-gray-100 shadow-sm">
              <CardBody className="p-6 space-y-3">
                <Skeleton className="w-3/5 h-5 rounded-lg" />
                <Skeleton className="w-2/5 h-4 rounded-lg" />
                <Skeleton className="w-full h-4 rounded-lg" />
                <Skeleton className="w-4/5 h-4 rounded-lg" />
              </CardBody>
            </Card>
          ))}
        </div>
      ) : recommendations.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 text-center text-slate">
          <span className="text-5xl mb-4 opacity-50">🤖</span>
          <p className="font-medium text-lg">No hay recomendaciones aún.</p>
          <p className="text-sm mt-2">
            Evalúa un cliente desde su detalle para generar recomendaciones
            inteligentes.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recommendations.map((rec) => {
            const st = statusMap[rec.status] || statusMap.GENERATED;
            return (
              <Link
                key={rec.id}
                href={`/recommendations/${rec.id}`}
                className="group"
              >
                <Card className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden duration-200 group-hover:border-insight-teal">
                  <CardBody className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-bold text-graphite text-lg">
                          {rec.client.firstName} {rec.client.lastName}
                        </p>
                        <p className="text-xs text-slate mt-1">
                          {new Date(rec.createdAt).toLocaleDateString("es-MX", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${st.bg} ${st.text}`}>
                          {st.label}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mt-4 mb-3">
                      <div className="bg-trust-blue/5 rounded-lg px-3 py-2 text-center">
                        <p className="text-2xl font-bold text-trust-blue">
                          {Number(rec.globalScore).toFixed(1)}
                        </p>
                        <p className="text-[10px] text-slate uppercase tracking-wider font-medium">
                          Score
                        </p>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-graphite mb-1">
                          {rec.products.length} producto
                          {rec.products.length !== 1 ? "s" : ""} recomendado
                          {rec.products.length !== 1 ? "s" : ""}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {rec.products.slice(0, 3).map((p) => (
                            <div
                              key={p.productId}
                              className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-trust-blue text-white shadow-sm shrink-0"
                            >
                              {p.product.type}
                            </div>
                          ))}
                          {rec.products.length > 3 && (
                            <div
                              className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-slate shadow-sm shrink-0"
                            >
                              +{rec.products.length - 3}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-insight-teal font-medium group-hover:underline mt-2">
                      Ver detalle →
                    </p>
                  </CardBody>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
