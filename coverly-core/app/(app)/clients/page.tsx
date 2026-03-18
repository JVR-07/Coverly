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
} from "@nextui-org/react";
import Link from "next/link";
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

  const riskColorMap: Record<
    string,
    "success" | "warning" | "danger" | "default"
  > = {
    LOW: "success",
    MEDIUM: "warning",
    HIGH: "danger",
    default: "default",
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
          className="font-medium"
        >
          ＋ Nuevo Cliente
        </Button>
      </header>

      {loading ? (
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
          <Table
            aria-label="Tabla de clientes"
            classNames={{
              wrapper: "bg-transparent p-0",
              th: "bg-gray-50 text-slate font-semibold text-sm py-4 border-b border-gray-100 uppercase tracking-wider",
              td: "py-4 border-b border-gray-50",
            }}
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
                    <Chip
                      color={riskColorMap[client.riskLevel] || "default"}
                      size="sm"
                      variant="dot"
                      className="border-none"
                    >
                      {riskLabelMap[client.riskLevel] ||
                        client.riskLevel ||
                        "N/A"}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {client.needs.map((need) => (
                        <Chip
                          key={need}
                          size="sm"
                          variant="flat"
                          className="bg-trust-blue/10 text-trust-blue border border-trust-blue/20"
                        >
                          {need}
                        </Chip>
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
