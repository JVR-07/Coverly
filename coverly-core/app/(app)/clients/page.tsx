"use client";

import { useEffect, useState } from "react";
import { Table, Button, Skeleton } from "@heroui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { UserPlus } from "lucide-react";

interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  createdAt: string;
  riskLevel: string;
  needs: string[];
}

export default function MisClientesPage() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/clients")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setClients(data.data);
        }
      })
      .finally(() => setLoading(false));
  }, []);

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
      <header className="flex justify-between items-end mb-8">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-trust-blue mb-2">
            Mis Clientes
          </h1>
          <p className="text-slate">
            Consulta y gestiona el perfilamiento de tu cartera de clientes.
          </p>
        </div>
        <Link href="/clients/new">
          <Button
            variant="primary"
            className="bg-trust-blue text-white font-bold rounded-full px-6 h-11 shadow-md hover:shadow-trust-blue/20 hover:scale-[1.02] transition-all flex items-center gap-2"
          >
            <UserPlus size={18} />
            <span>Nuevo Cliente</span>
          </Button>
        </Link>
      </header>

      {loading ? (
        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm p-4 space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 py-2">
              <Skeleton className="rounded-lg w-40 h-5" />
              <Skeleton className="rounded-lg w-48 h-5" />
              <Skeleton className="rounded-lg w-24 h-5" />
              <Skeleton className="rounded-lg w-20 h-6" />
              <Skeleton className="rounded-lg w-32 h-5" />
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
          {clients.length === 0 ? (
            <div className="p-12 text-center text-slate">
              No hay clientes registrados aún. ¡Añade el primero!
            </div>
          ) : (
            <Table aria-label="Tabla de clientes">
              <Table.ScrollContainer>
                <Table.Content className="w-full">
                  <Table.Header className="bg-gray-50 text-slate font-semibold text-sm border-b border-gray-100 uppercase tracking-wider">
                    <Table.Column isRowHeader className="p-4 text-left">
                      NOMBRE COMPLETO
                    </Table.Column>
                    <Table.Column className="p-4 text-left">
                      CORREO
                    </Table.Column>
                    <Table.Column className="p-4 text-left">
                      FECHA DE REGISTRO
                    </Table.Column>
                    <Table.Column className="p-4 text-left">
                      NIVEL DE RIESGO
                    </Table.Column>
                    <Table.Column className="p-4 text-left">
                      INTERESES
                    </Table.Column>
                  </Table.Header>
                  <Table.Body items={clients}>
                    {(client) => (
                      <Table.Row
                        key={client.id}
                        id={client.id}
                        className="hover:bg-soft-light transition-colors border-b border-gray-50 cursor-pointer"
                        onAction={() => router.push(`/clients/${client.id}`)}
                      >
                        <Table.Cell className="font-semibold text-trust-blue p-4">
                          {client.firstName} {client.lastName}
                        </Table.Cell>
                        <Table.Cell className="text-slate p-4">
                          {client.email || "No especificado"}
                        </Table.Cell>
                        <Table.Cell className="text-slate p-4">
                          {format(new Date(client.createdAt), "dd MMM yyyy", {
                            locale: es,
                          })}
                        </Table.Cell>
                        <Table.Cell className="p-4">
                          <span
                            className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                              riskColorMap[client.riskLevel] ||
                              "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {riskLabelMap[client.riskLevel] ||
                              client.riskLevel ||
                              "N/A"}
                          </span>
                        </Table.Cell>
                        <Table.Cell className="p-4">
                          <div className="flex gap-1.5 flex-wrap">
                            {client.needs.map((need) => (
                              <div
                                key={need}
                                className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-trust-blue text-white"
                              >
                                {need}
                              </div>
                            ))}
                          </div>
                        </Table.Cell>
                      </Table.Row>
                    )}
                  </Table.Body>
                </Table.Content>
              </Table.ScrollContainer>
            </Table>
          )}
        </div>
      )}
    </div>
  );
}
