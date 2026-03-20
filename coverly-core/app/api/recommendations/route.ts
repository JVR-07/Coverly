import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { evaluateClient } from "@/lib/engine";
import { prisma } from "@/lib/prisma";

export const POST = auth(async (req) => {
  if (!req.auth) {
    return NextResponse.json(
      { success: false, error: { code: "ERR_401", message: "Unauthorized" } },
      { status: 401 },
    );
  }

  try {
    const body = await req.json();
    const { clientId } = body;

    if (!clientId) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "ERR_400",
            message: "El campo 'clientId' es requerido.",
          },
        },
        { status: 400 },
      );
    }

    const engineResult = await evaluateClient(clientId);

    const agentId = req.auth.user.id;

    const recommendation = await prisma.recommendation.create({
      data: {
        clientId,
        agentId,
        status: "GENERATED",
        globalScore: engineResult.globalScore,
        products: {
          create: engineResult.recommendedProducts.map((rp) => ({
            productId: rp.productId,
            matchScore: rp.matchScore,
            finalPrice: rp.finalPrice,
            justifications: rp.reasons,
          })),
        },
      },
      include: {
        products: {
          include: {
            product: {
              select: { id: true, name: true, type: true, priceBase: true },
            },
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          recommendation,
          engineResult,
        },
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("API recommendations error:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "ERR_500",
          message: error.message || "Error al generar recomendación.",
        },
      },
      { status: 500 },
    );
  }
});

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
