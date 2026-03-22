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
  { label: string; color: "success" | "warning" | "danger" | "default" }
> = {
  GENERATED: { label: "Generada", color: "default" },
  PRESENTED: { label: "Presentada", color: "warning" },
  ACCEPTED: { label: "Aceptada", color: "success" },
  REJECTED: { label: "Rechazada", color: "danger" },
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
                <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 group-hover:border-insight-teal/30">
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
                        <Chip size="sm" color={st.color} variant="flat">
                          {st.label}
                        </Chip>
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
                            <Chip
                              key={p.productId}
                              size="sm"
                              variant="flat"
                              className="text-[10px] bg-soft-light text-graphite"
                            >
                              {p.product.type}
                            </Chip>
                          ))}
                          {rec.products.length > 3 && (
                            <Chip
                              size="sm"
                              variant="flat"
                              className="text-[10px] bg-gray-100 text-slate"
                            >
                              +{rec.products.length - 3}
                            </Chip>
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
