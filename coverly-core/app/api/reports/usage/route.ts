import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { apiHandler, apiError } from "@/lib/api-handler";

export const GET = auth(
  apiHandler(async (req: any) => {
    if (!req.auth) {
      return apiError({
        message: "Unauthorized",
        status: 401,
        code: "ERR_401",
      });
    }

    const role = req.auth.user.role;
    const searchParams = req.nextUrl.searchParams;
    const agentId = searchParams.get("agentId");

    const targetAgentId =
      role === "AGENT" ? req.auth.user.id : agentId || req.auth.user.id;

    if (role === "AGENT" && agentId && agentId !== req.auth.user.id) {
      return apiError({
        message: "Acceso denegado.",
        status: 403,
        code: "ERR_403",
      });
    }

    const [
      clientsProfiled,
      recommendationsGenerated,
      acceptedCount,
      rejectedCount,
    ] = await Promise.all([
      prisma.client.count({ where: { agentId: targetAgentId } }),
      prisma.recommendation.count({ where: { agentId: targetAgentId } }),
      prisma.recommendation.count({
        where: { agentId: targetAgentId, status: "ACCEPTED" },
      }),
      prisma.recommendation.count({
        where: { agentId: targetAgentId, status: "REJECTED" },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        agentId: targetAgentId,
        clientsProfiled,
        recommendationsGenerated,
        acceptedCount,
        rejectedCount,
        conversionRate:
          recommendationsGenerated > 0
            ? Math.round((acceptedCount / recommendationsGenerated) * 10000) /
              100
            : 0,
      },
    });
  }),
);
