"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Button,
  Skeleton,
} from "@nextui-org/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { es } from "date-fns/locale";

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
        <Button
          as={Link}
          href="/clients/new"
          color="primary"
          radius="full"
          className="bg-insight-teal text-white font-semibold"
        >
          ＋ Nuevo Cliente
        </Button>
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
          <Table
            aria-label="Tabla de clientes"
            classNames={{
              wrapper: "bg-transparent p-0 overflow-x-auto w-full block",
              th: "bg-gray-50 text-slate font-semibold text-sm py-4 border-b border-gray-100 uppercase tracking-wider whitespace-nowrap",
              td: "py-4 border-b border-gray-50 whitespace-nowrap",
              tr: "cursor-pointer",
            }}
            selectionMode="single"
            onRowAction={(key) => router.push(`/clients/${String(key)}`)}
          >
            <TableHeader>
              <TableColumn>NOMBRE COMPLETO</TableColumn>
              <TableColumn>CORREO</TableColumn>
              <TableColumn>FECHA DE REGISTRO</TableColumn>
              <TableColumn>NIVEL DE RIESGO</TableColumn>
              <TableColumn>INTERESES</TableColumn>
            </TableHeader>
            <TableBody emptyContent="No hay clientes registrados aún. ¡Añade el primero!">
              {clients.map((client) => (
                <TableRow
                  key={client.id}
                  className="hover:bg-soft-light transition-colors"
                >
                  <TableCell className="font-semibold text-trust-blue">
                    {client.firstName} {client.lastName}
                  </TableCell>
                  <TableCell className="text-slate">
                    {client.email || "No especificado"}
                  </TableCell>
                  <TableCell className="text-slate">
                    {format(new Date(client.createdAt), "dd MMM yyyy", {
                      locale: es,
                    })}
                  </TableCell>
                  <TableCell>
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
                  </TableCell>
                  <TableCell>
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
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
