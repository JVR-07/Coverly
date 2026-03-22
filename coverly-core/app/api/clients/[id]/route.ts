import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";

export const GET = auth(
  async (req, { params }: { params: Promise<{ id: string }> }) => {
    if (!req.auth) {
      return NextResponse.json(
        { success: false, error: { code: "ERR_401", message: "Unauthorized" } },
        { status: 401 },
      );
    }

    try {
      const { id } = await params;

      const client = await prisma.client.findUnique({
        where: { id },
      });

      if (!client) {
        return NextResponse.json(
          {
            success: false,
            error: { code: "ERR_404", message: "Cliente no encontrado." },
          },
          { status: 404 },
        );
      }

      return NextResponse.json({ success: true, data: client });
    } catch (error: any) {
      logger.error("Error al obtener cliente", {
        route: "/api/clients/[id]",
        userId: req.auth?.user?.id,
      });
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "ERR_500",
            message: "Error al procesar la solicitud.",
          },
        },
        { status: 500 },
      );
    }
  },
);
