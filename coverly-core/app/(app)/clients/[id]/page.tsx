"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Chip, Button, Divider } from "@nextui-org/react";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Briefcase,
  DollarSign,
  Users as UsersIcon,
  ShieldCheck,
  ArrowLeft,
  BrainCircuit,
  Loader2,
} from "lucide-react";
import LoadingScreen from "@/components/ui/LoadingScreen";

interface ClientDetail {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  dateOfBirth: string;
  gender: string | null;
  clientType: string;
  riskLevel: string | null;
  economicProfile: {
    annualIncome?: number;
    occupation?: string;
    dependents?: number;
  } | null;
  needs: string[] | null;
  createdAt: string;
}

interface Recommendation {
  id: string;
  status: string;
  globalScore: string;
  createdAt: string;
  products: { product: { name: string; type: string } }[];
}

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

const statusMap: Record<
  string,
  { label: string; color: "success" | "warning" | "danger" | "default" }
> = {
  GENERATED: { label: "Generada", color: "default" },
  PRESENTED: { label: "Presentada", color: "warning" },
  ACCEPTED: { label: "Aceptada", color: "success" },
  REJECTED: { label: "Rechazada", color: "danger" },
};

export default function ClientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [client, setClient] = useState<ClientDetail | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch(`/api/clients/${id}`).then((r) => r.json()),
      fetch(`/api/recommendations?clientId=${id}`).then((r) => r.json()),
    ])
      .then(([clientData, recsData]) => {
        if (clientData.success) setClient(clientData.data);
        if (recsData.success) setRecommendations(recsData.data);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleGenerateRecommendation = async () => {
    setGenerating(true);
    try {
      const res = await fetch("/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId: id }),
      });
      const data = await res.json();
      if (data.success) {
        router.push(`/recommendations/${data.data.recommendation.id}`);
      }
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return <LoadingScreen message="Cargando perfil del cliente..." />;
  }

  if (!client) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-center text-slate">
        <User size={48} className="mb-4 opacity-50" />
        <p className="font-medium text-lg">Cliente no encontrado.</p>
        <Button
          className="mt-4"
          color="primary"
          variant="flat"
          onPress={() => router.push("/clients")}
        >
          <ArrowLeft size={16} /> Volver a clientes
        </Button>
      </div>
    );
  }

  const eco = client.economicProfile;

  return (
    <div className="space-y-6">
      <button
        onClick={() => router.push("/clients")}
        className="text-sm text-trust-blue hover:underline flex items-center gap-1"
      >
        <ArrowLeft size={14} /> Todos los clientes
      </button>

      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-trust-blue">
            {client.firstName} {client.lastName}
          </h1>
          <div className="flex items-center gap-3 mt-2">
            {client.riskLevel && (
              <span
                className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                  riskColorMap[client.riskLevel] || "bg-gray-100 text-gray-600"
                }`}
              >
                {riskLabelMap[client.riskLevel] || client.riskLevel}
              </span>
            )}
            <Chip
              size="sm"
              variant="flat"
              className="capitalize bg-trust-blue/10 text-trust-blue"
            >
              {client.clientType}
            </Chip>
          </div>
        </div>
        <Button
          color="primary"
          radius="full"
          className="bg-insight-teal text-white font-semibold flex items-center justify-center text-center h-auto min-h-10 py-2.5 leading-tight shadow-md hover:shadow-lg transition-all"
          isLoading={generating}
          startContent={
            generating ? (
              <Loader2 size={16} className="animate-coverly-spin shrink-0" />
            ) : (
              <BrainCircuit size={16} className="shrink-0" />
            )
          }
          onPress={handleGenerateRecommendation}
        >
          <span>Generar Recomendación</span>
        </Button>
      </header>

      <Divider className="bg-gray-100" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Data */}
        <section className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm">
          <h2 className="text-lg font-bold text-graphite mb-4 flex items-center gap-2">
            <User size={18} className="text-trust-blue" /> Datos Personales
          </h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Mail size={16} className="text-slate" />
              <span className="text-graphite">
                {client.email || "Sin correo"}
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Phone size={16} className="text-slate" />
              <span className="text-graphite">
                {client.phone || "Sin teléfono"}
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Calendar size={16} className="text-slate" />
              <span className="text-graphite">
                {new Date(client.dateOfBirth).toLocaleDateString("es-MX", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </section>

        {/* Economic Profile */}
        <section className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm">
          <h2 className="text-lg font-bold text-graphite mb-4 flex items-center gap-2">
            <DollarSign size={18} className="text-insight-teal" /> Perfil
            Económico
          </h2>
          {eco ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <DollarSign size={16} className="text-slate" />
                <span className="text-graphite">
                  Ingreso anual:{" "}
                  <strong>
                    ${(eco.annualIncome || 0).toLocaleString("es-MX")} MXN
                  </strong>
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Briefcase size={16} className="text-slate" />
                <span className="text-graphite">
                  {eco.occupation || "No especificada"}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <UsersIcon size={16} className="text-slate" />
                <span className="text-graphite">
                  {eco.dependents || 0} dependientes
                </span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate">
              Sin perfil económico registrado.
            </p>
          )}
        </section>
      </div>

      {/* Needs */}
      {client.needs && client.needs.length > 0 && (
        <section className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm">
          <h2 className="text-lg font-bold text-graphite mb-4 flex items-center gap-2">
            <ShieldCheck size={18} className="text-trust-blue" /> Necesidades
            Declaradas
          </h2>
          <div className="flex flex-wrap gap-2">
            {client.needs.map((need) => (
              <div
                key={need}
                className="px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-trust-blue text-white shadow-sm"
              >
                {need}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Recommendation History */}
      <section className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm">
        <h2 className="text-lg font-bold text-graphite mb-4 flex items-center gap-2">
          <BrainCircuit size={18} className="text-insight-teal" /> Historial de
          Recomendaciones
        </h2>
        {recommendations.length === 0 ? (
          <p className="text-sm text-slate">
            No hay recomendaciones generadas para este cliente.
          </p>
        ) : (
          <div className="space-y-3">
            {recommendations.map((rec) => {
              const st = statusMap[rec.status] || statusMap.GENERATED;
              return (
                <button
                  key={rec.id}
                  onClick={() => router.push(`/recommendations/${rec.id}`)}
                  className="w-full flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:border-insight-teal/30 hover:shadow-sm transition-all text-left"
                >
                  <div>
                    <p className="text-sm font-medium text-graphite">
                      Score: {Number(rec.globalScore).toFixed(1)} —{" "}
                      {rec.products.length} producto
                      {rec.products.length !== 1 ? "s" : ""}
                    </p>
                    <p className="text-xs text-slate mt-1">
                      {new Date(rec.createdAt).toLocaleDateString("es-MX", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <Chip size="sm" color={st.color} variant="flat">
                    {st.label}
                  </Chip>
                </button>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
