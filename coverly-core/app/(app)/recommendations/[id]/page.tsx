"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, Chip, Separator, Button, Skeleton } from "@heroui/react";
import {
  Car,
  Heart,
  Home,
  Smartphone,
  Check,
  X,
  ArrowLeft,
  Target,
  ShieldCheck,
  Package,
  Calendar,
  AlertCircle,
} from "lucide-react";

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
    coverages?: {
      id: string;
      name: string;
      description?: string;
      value: string | null;
    }[];
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
  PRESENTED: {
    label: "Presentada",
    bg: "bg-yellow-100",
    text: "text-yellow-700",
  },
  ACCEPTED: {
    label: "Aceptada",
    bg: "bg-emerald-100",
    text: "text-emerald-700",
  },
  REJECTED: { label: "Rechazada", bg: "bg-red-100", text: "text-red-700" },
};

const typeIconMap: Record<string, React.ReactNode> = {
  AUTO: <Car className="text-trust-blue" size={24} />,
  LIFE: <Heart className="text-red-500" size={24} />,
  FIRE: <Home className="text-orange-500" size={24} />,
  MOBILE: <Smartphone className="text-emerald-500" size={24} />,
};

export default function RecommendationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [recommendation, setRecommendation] = useState<Recommendation | null>(
    null,
  );
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
              <Card.Content className="p-6 space-y-3">
                <Skeleton className="w-3/5 h-6 rounded-lg" />
                <Skeleton className="w-full h-4 rounded-lg" />
                <Skeleton className="w-full h-4 rounded-lg" />
                <Skeleton className="w-2/3 h-4 rounded-lg" />
              </Card.Content>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!recommendation) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-center text-slate">
        <AlertCircle size={64} className="text-gray-300 mb-4" />
        <p className="font-medium text-lg text-slate">
          Recomendación no encontrada.
        </p>
        <Button
          className="mt-6 font-semibold rounded-full"
          variant="ghost"
          onPress={() => router.push("/recommendations")}
        >
          <ArrowLeft size={18} className="mr-2" />
          Volver a recomendaciones
        </Button>
      </div>
    );
  }

  const st = statusMap[recommendation.status] || statusMap.GENERATED;

  return (
    <div className="space-y-6">
      <button
        onClick={() => router.push("/recommendations")}
        className="text-sm text-slate hover:text-trust-blue transition-colors flex items-center gap-2 group"
      >
        <ArrowLeft
          size={16}
          className="group-hover:-translate-x-1 transition-transform"
        />
        <span>Todas las recomendaciones</span>
      </button>

      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-trust-blue">
            Recomendación para {recommendation.client.firstName}{" "}
            {recommendation.client.lastName}
          </h1>
          <div className="flex items-center gap-2 text-slate text-sm mt-1">
            <Calendar size={14} />
            <span>
              Generada el{" "}
              {new Date(recommendation.createdAt).toLocaleDateString("es-MX", {
                day: "2-digit",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-trust-blue/5 border border-trust-blue/10 rounded-2xl px-5 py-3 text-center flex flex-col items-center justify-center min-w-[100px]">
            <div className="flex items-center gap-2">
              <Target size={18} className="text-trust-blue shadow-sm" />
              <p className="text-3xl font-bold text-trust-blue">
                {Number(recommendation.globalScore).toFixed(1)}
              </p>
            </div>
            <p className="text-[10px] text-slate uppercase tracking-widest font-bold mt-1">
              Score Global
            </p>
          </div>
          <span
            className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full ${st.bg} ${st.text}`}
          >
            {st.label}
          </span>
        </div>
      </header>

      {recommendation.status === "GENERATED" && (
        <div className="flex items-center gap-3 p-5 bg-gradient-to-r from-trust-blue/5 to-transparent rounded-2xl border border-trust-blue/10 shadow-sm animate-fade-in">
          <p className="text-sm text-graphite font-medium flex-1">
            ¿Ya presentaste esta oferta al cliente? Marca el resultado:
          </p>
          <div className="flex items-center gap-3">
            <Button
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-sm px-4 h-10 transition-all hover:scale-105 rounded-full flex items-center justify-center gap-2"
              variant="primary"
              onPress={() => updateStatus("ACCEPTED")}
            >
              {!updating && <Check size={16} />}
              <span>{updating ? "Procesando..." : "Aceptada"}</span>
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="text-red-500 border-red-100 hover:bg-red-50 font-bold px-4 h-10 transition-all rounded-full flex items-center justify-center gap-2"
              onPress={() => updateStatus("REJECTED")}
            >
              {!updating && <X size={16} />}
              <span>{updating ? "..." : "Rechazada"}</span>
            </Button>
          </div>
        </div>
      )}

      <Separator className="bg-gray-100" />

      {/* Recommended products grid */}
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
                <Card.Header className="px-6 pt-5 pb-3 border-b border-gray-50 mb-1">
                  <div className="flex items-start justify-between w-full">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-gray-50 rounded-xl group-hover:bg-trust-blue/5 transition-colors">
                        {icon || <Package />}
                      </div>
                      <div>
                        <p className="font-extrabold text-trust-blue text-lg leading-tight">
                          {rp.product.name}
                        </p>
                        <div className="mt-1 flex items-center gap-1.5">
                          <span className="text-[9px] font-bold uppercase tracking-widest text-slate bg-gray-100 px-2 py-0.5 rounded">
                            {rp.product.type}
                          </span>
                        </div>
                      </div>
                    </div>
                    {index === 0 && (
                      <div className="flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700 shadow-sm border border-emerald-200">
                        <ShieldCheck size={12} />
                        <span>Recomendado</span>
                      </div>
                    )}
                  </div>
                </Card.Header>
                <Card.Content className="px-6 py-4 space-y-4">
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
                          $
                          {Number(rp.product.priceBase).toLocaleString("es-MX")}
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
                </Card.Content>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
