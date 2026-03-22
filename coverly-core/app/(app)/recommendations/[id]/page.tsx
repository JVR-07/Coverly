"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardBody,
  CardHeader,
  Chip,
  Divider,
  Button,
  Skeleton,
} from "@nextui-org/react";

interface RecommendedProduct {
  productId: string;
  matchScore: string;
  finalPrice: string;
  justifications: string[];
  product: {
    id: string;
    name: string;
    type: string;
    priceBase: string;
    description?: string;
    coverages?: { id: string; name: string; description?: string; value: string | null }[];
  };
}

interface Recommendation {
  id: string;
  status: string;
  globalScore: string;
  rejectionReason?: string;
  createdAt: string;
  client: {
    id: string;
    firstName: string;
    lastName: string;
  };
  products: RecommendedProduct[];
}

const statusMap: Record<string, { label: string; color: "success" | "warning" | "danger" | "default" }> = {
  GENERATED: { label: "Generada", color: "default" },
  PRESENTED: { label: "Presentada", color: "warning" },
  ACCEPTED: { label: "Aceptada", color: "success" },
  REJECTED: { label: "Rechazada", color: "danger" },
};

const typeIconMap: Record<string, string> = {
  AUTO: "🚗",
  LIFE: "❤️",
  FIRE: "🏠",
  MOBILE: "📱",
};

export default function RecommendationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [compareIds, setCompareIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch(`/api/recommendations/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setRecommendation(data.data);
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  const updateStatus = async (newStatus: string) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/recommendations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setRecommendation(data.data);
      }
    } finally {
      setUpdating(false);
    }
  };

  const toggleCompare = (productId: string) => {
    setCompareIds((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) {
        next.delete(productId);
      } else if (next.size < 3) {
        next.add(productId);
      }
      return next;
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="w-2/5 h-8 rounded-lg" />
        <Skeleton className="w-1/3 h-5 rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="bg-white border border-gray-100 shadow-sm">
              <CardBody className="p-6 space-y-3">
                <Skeleton className="w-3/5 h-6 rounded-lg" />
                <Skeleton className="w-full h-4 rounded-lg" />
                <Skeleton className="w-full h-4 rounded-lg" />
                <Skeleton className="w-2/3 h-4 rounded-lg" />
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!recommendation) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-center text-slate">
        <span className="text-5xl mb-4">🔍</span>
        <p className="font-medium text-lg">Recomendación no encontrada.</p>
        <Button
          className="mt-4"
          color="primary"
          variant="flat"
          onPress={() => router.push("/recommendations")}
        >
          ← Volver a recomendaciones
        </Button>
      </div>
    );
  }

  const st = statusMap[recommendation.status] || statusMap.GENERATED;
  const comparedProducts = recommendation.products.filter((p) => compareIds.has(p.productId));

  return (
    <div className="space-y-6">
      <button
        onClick={() => router.push("/recommendations")}
        className="text-sm text-trust-blue hover:underline flex items-center gap-1"
      >
        ← Todas las recomendaciones
      </button>

      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-trust-blue">
            Recomendación para {recommendation.client.firstName}{" "}
            {recommendation.client.lastName}
          </h1>
          <p className="text-slate text-sm mt-1">
            Generada el{" "}
            {new Date(recommendation.createdAt).toLocaleDateString("es-MX", {
              day: "2-digit",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-trust-blue/5 rounded-xl px-4 py-3 text-center">
            <p className="text-3xl font-bold text-trust-blue">
              {Number(recommendation.globalScore).toFixed(1)}
            </p>
            <p className="text-[10px] text-slate uppercase tracking-wider font-medium">
              Score Global
            </p>
          </div>
          <Chip size="md" color={st.color} variant="flat" className="text-sm">
            {st.label}
          </Chip>
        </div>
      </header>

      {recommendation.status === "GENERATED" && (
        <div className="flex items-center gap-3 p-4 bg-trust-blue/5 rounded-xl border border-trust-blue/10">
          <p className="text-sm text-graphite flex-1">
            ¿Ya presentaste esta oferta al cliente?
          </p>
          <Button
            size="sm"
            color="success"
            variant="flat"
            isLoading={updating}
            onPress={() => updateStatus("ACCEPTED")}
          >
            ✓ Aceptada
          </Button>
          <Button
            size="sm"
            color="danger"
            variant="flat"
            isLoading={updating}
            onPress={() => updateStatus("REJECTED")}
          >
            ✕ Rechazada
          </Button>
        </div>
      )}

      <Divider className="bg-gray-100" />

      {/* Grid de productos recomendados */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-graphite">
            Productos Recomendados ({recommendation.products.length})
          </h2>
          {compareIds.size > 0 && (
            <Chip size="sm" color="secondary" variant="flat">
              {compareIds.size}/3 seleccionados para comparar
            </Chip>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendation.products.map((rp, index) => {
            const isSelected = compareIds.has(rp.productId);
            const icon = typeIconMap[rp.product.type] || "📦";
            return (
              <Card
                key={rp.productId}
                className={`bg-white border shadow-sm hover:shadow-md transition-all duration-200 ${
                  index === 0
                    ? "border-insight-teal/40 ring-1 ring-insight-teal/20"
                    : "border-gray-100"
                } ${isSelected ? "ring-2 ring-trust-blue/40 border-trust-blue/30" : ""}`}
              >
                <CardHeader className="px-6 pt-5 pb-2">
                  <div className="flex items-start justify-between w-full">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{icon}</span>
                      <div>
                        <p className="font-bold text-trust-blue text-lg leading-tight">
                          {rp.product.name}
                        </p>
                        <Chip
                          size="sm"
                          variant="flat"
                          className="mt-1 capitalize bg-trust-blue/10 text-trust-blue text-[10px]"
                        >
                          {rp.product.type}
                        </Chip>
                      </div>
                    </div>
                    {index === 0 && (
                      <Chip size="sm" color="success" variant="flat" className="text-[10px]">
                        ⭐ Mejor opción
                      </Chip>
                    )}
                  </div>
                </CardHeader>
                <Divider className="bg-gray-100" />
                <CardBody className="px-6 py-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-slate uppercase tracking-wider font-medium">
                        Match Score
                      </p>
                      <p className="text-2xl font-bold text-graphite">
                        {Number(rp.matchScore).toFixed(1)}
                        <span className="text-sm text-slate font-normal">
                          %
                        </span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-slate uppercase tracking-wider font-medium">
                        Precio Final
                      </p>
                      <p className="text-xl font-bold text-insight-teal">
                        ${Number(rp.finalPrice).toLocaleString("es-MX")}
                      </p>
                      {Number(rp.finalPrice) < Number(rp.product.priceBase) && (
                        <p className="text-[10px] text-slate line-through">
                          ${Number(rp.product.priceBase).toLocaleString("es-MX")}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-slate uppercase tracking-wider mb-2">
                      Justificación IA
                    </p>
                    <ul className="space-y-1">
                      {(rp.justifications || []).slice(0, 3).map((j, i) => (
                        <li
                          key={i}
                          className="text-xs text-graphite flex items-start gap-1.5"
                        >
                          <span className="text-insight-teal shrink-0 mt-0.5">
                            •
                          </span>
                          {j}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button
                    size="sm"
                    variant={isSelected ? "solid" : "bordered"}
                    color={isSelected ? "primary" : "default"}
                    className="w-full mt-2"
                    isDisabled={!isSelected && compareIds.size >= 3}
                    onPress={() => toggleCompare(rp.productId)}
                  >
                    {isSelected ? "✓ En comparación" : "Agregar a comparador"}
                  </Button>
                </CardBody>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Comparador de seguros */}
      {comparedProducts.length >= 2 && (
        <section className="mt-8">
          <Divider className="bg-gray-100 mb-6" />
          <h2 className="text-xl font-bold text-trust-blue mb-4">
            Comparador de Seguros
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left text-xs text-slate uppercase tracking-wider p-3 bg-soft-light border-b border-gray-200 w-40">
                    Característica
                  </th>
                  {comparedProducts.map((p) => (
                    <th
                      key={p.productId}
                      className="text-center text-sm font-bold text-trust-blue p-3 bg-soft-light border-b border-gray-200"
                    >
                      <span className="text-xl mr-1">
                        {typeIconMap[p.product.type] || "📦"}
                      </span>
                      {p.product.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="text-xs font-semibold text-slate uppercase tracking-wider p-3">
                    Tipo
                  </td>
                  {comparedProducts.map((p) => (
                    <td key={p.productId} className="text-center p-3">
                      <Chip
                        size="sm"
                        variant="flat"
                        className="capitalize bg-trust-blue/10 text-trust-blue"
                      >
                        {p.product.type}
                      </Chip>
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="text-xs font-semibold text-slate uppercase tracking-wider p-3">
                    Match Score
                  </td>
                  {comparedProducts.map((p) => {
                    const score = Number(p.matchScore);
                    const best = Math.max(...comparedProducts.map((cp) => Number(cp.matchScore)));
                    return (
                      <td
                        key={p.productId}
                        className={`text-center p-3 text-lg font-bold ${
                          score === best ? "text-insight-teal" : "text-graphite"
                        }`}
                      >
                        {score.toFixed(1)}%
                        {score === best && (
                          <span className="text-xs ml-1">⭐</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="text-xs font-semibold text-slate uppercase tracking-wider p-3">
                    Precio Base
                  </td>
                  {comparedProducts.map((p) => (
                    <td key={p.productId} className="text-center p-3 text-sm text-slate">
                      ${Number(p.product.priceBase).toLocaleString("es-MX")} MXN
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-100 bg-insight-teal/5">
                  <td className="text-xs font-semibold text-slate uppercase tracking-wider p-3">
                    Precio Final
                  </td>
                  {comparedProducts.map((p) => {
                    const price = Number(p.finalPrice);
                    const best = Math.min(...comparedProducts.map((cp) => Number(cp.finalPrice)));
                    return (
                      <td
                        key={p.productId}
                        className={`text-center p-3 text-lg font-bold ${
                          price === best ? "text-insight-teal" : "text-graphite"
                        }`}
                      >
                        ${price.toLocaleString("es-MX")}
                        {price === best && (
                          <span className="text-xs ml-1">💰</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="text-xs font-semibold text-slate uppercase tracking-wider p-3">
                    Justificación
                  </td>
                  {comparedProducts.map((p) => (
                    <td key={p.productId} className="p-3 align-top">
                      <ul className="space-y-1">
                        {(p.justifications || []).map((j, i) => (
                          <li key={i} className="text-xs text-graphite flex items-start gap-1">
                            <span className="text-insight-teal shrink-0">•</span>
                            {j}
                          </li>
                        ))}
                      </ul>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
