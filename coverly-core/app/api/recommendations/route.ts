import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { evaluateClient } from "@/lib/engine";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import { apiHandler, apiError } from "@/lib/api-handler";

export const POST = auth(
  apiHandler(async (req: any) => {
    if (!req.auth) {
      return apiError({
        message: "Unauthorized",
        status: 401,
        code: "ERR_401",
      });
    }

    const body = await req.json();
    const { clientId } = body;

    if (!clientId) {
      return apiError({
        message: "Falta el ID del cliente.",
        status: 400,
        code: "ERR_400",
      });
    }

    const client = await prisma.client.findUnique({
      where: { id: clientId },
    });

    if (!client) {
      return apiError({
        message: "Cliente no encontrado.",
        status: 404,
        code: "ERR_404",
      });
    }

    const evaluationResult = await evaluateClient(clientId);

    if (!evaluationResult?.recommendationId) {
      throw new Error("Respuesta inválida del motor de recomendación.");
    }

    const recommendation = await prisma.recommendation.create({
      data: {
        id: evaluationResult.recommendationId,
        clientId: client.id,
        agentId: req.auth.user.id,
        status: "GENERATED",
        globalScore: evaluationResult.globalScore,
      },
    });

    const productsData = evaluationResult.recommendedProducts.map((p) => ({
      recommendationId: recommendation.id,
      productId: p.productId,
      matchScore: p.matchScore,
      finalPrice: p.finalPrice,
      justifications: p.reasons,
    }));

    if (productsData.length > 0) {
      await prisma.recommendedProduct.createMany({
        data: productsData,
      });
    }

    const completeRecommendation = await prisma.recommendation.findUnique({
      where: { id: recommendation.id },
      include: {
        products: {
          include: { product: true },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          recommendation: completeRecommendation,
          excluded: evaluationResult.excludedProducts,
        },
      },
      { status: 201 },
    );
  }),
);

export const GET = auth(async (req) => {
  if (!req.auth) {
    return NextResponse.json(
      { success: false, error: { code: "ERR_401", message: "Unauthorized" } },
      { status: 401 },
    );
  }

  try {
    const isAdmin = req.auth.user.role === "ADMIN";
    const agentId = req.auth.user.id;

    const url = new URL(req.url);
    const clientId = url.searchParams.get("clientId");

    const recommendations = await prisma.recommendation.findMany({
      where: {
        ...(isAdmin ? {} : { agentId }),
        ...(clientId ? { clientId } : {}),
      },
      orderBy: { createdAt: "desc" },
      include: {
        client: {
          select: { id: true, firstName: true, lastName: true },
        },
        products: {
          include: {
            product: {
              select: { id: true, name: true, type: true },
            },
          },
        },
      },
    });

    return NextResponse.json({ success: true, data: recommendations });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "ERR_500",
          message: "Error al obtener recomendaciones.",
          details: error.message,
        },
      },
      { status: 500 },
    );
  }
});
