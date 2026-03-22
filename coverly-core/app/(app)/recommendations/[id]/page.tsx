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

const statusMap: Record<string, { label: string; bg: string; text: string }> = {
  GENERATED: { label: "Generada", bg: "bg-gray-100", text: "text-gray-700" },
  PRESENTED: { label: "Presentada", bg: "bg-yellow-100", text: "text-yellow-700" },
  ACCEPTED: { label: "Aceptada", bg: "bg-emerald-100", text: "text-emerald-700" },
  REJECTED: { label: "Rechazada", bg: "bg-red-100", text: "text-red-700" },
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
          <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full ${st.bg} ${st.text}`}>
            {st.label}
          </span>
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
            className="text-white font-semibold shadow-sm"
            radius="full"
            isLoading={updating}
            onPress={() => updateStatus("ACCEPTED")}
          >
            ✓ Aceptada
          </Button>
          <Button
            size="sm"
            color="danger"
            variant="flat"
            className="font-semibold shadow-sm text-red-600 bg-red-50 hover:bg-red-100 border border-red-200"
            radius="full"
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendation.products.map((rp, index) => {
            const icon = typeIconMap[rp.product.type] || "📦";
            return (
              <Card
                key={rp.productId}
                className={`bg-white border rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden ${
                  index === 0
                    ? "border-insight-teal/40 ring-1 ring-insight-teal/20"
                    : "border-gray-100 hover:border-insight-teal"
                }`}
              >
                <CardHeader className="px-6 pt-5 pb-2">
                  <div className="flex items-start justify-between w-full">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{icon}</span>
                      <div>
                        <p className="font-bold text-trust-blue text-lg leading-tight">
                          {rp.product.name}
                        </p>
                        <div className="mt-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-trust-blue text-white shadow-sm self-start inline-block">
                          {rp.product.type}
                        </div>
                      </div>
                    </div>
                    {index === 0 && (
                      <div className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700 shrink-0">
                        ⭐ Mejor opción
                      </div>
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
                </CardBody>
              </Card>
            );
          })}
        </div>
      </section>

    </div>
  );
}
