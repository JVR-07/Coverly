import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const GET = auth(async (req) => {
  if (!req.auth) {
    return NextResponse.json(
      { success: false, error: { code: "ERR_401", message: "Unauthorized" } },
      { status: 401 },
    );
  }

  try {
    const now = new Date();
    const promotions = await prisma.promotion.findMany({
      where: {
        isActive: true,
        OR: [{ expiresAt: null }, { expiresAt: { gte: now } }],
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: promotions });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "ERR_500",
          message: "Error al obtener promociones.",
          details: error.message,
        },
      },
      { status: 500 },
    );
  }
});

export const POST = auth(async (req) => {
  if (!req.auth) {
    return NextResponse.json(
      { success: false, error: { code: "ERR_401", message: "Unauthorized" } },
      { status: 401 },
    );
  }

  if (req.auth.user.role !== "ADMIN") {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "ERR_403",
          message:
            "Forbidden. Solo los administradores pueden crear promociones.",
        },
      },
      { status: 403 },
    );
  }

  try {
    const body = await req.json();

    if (!body.name || !body.discountPercent) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "ERR_400",
            message: "Los campos 'name' y 'discountPercent' son requeridos.",
          },
        },
        { status: 400 },
      );
    }

    const promotion = await prisma.promotion.create({
      data: {
        name: body.name,
        description: body.description || null,
        discountPercent: body.discountPercent,
        isActive: body.isActive !== undefined ? body.isActive : true,
        expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
      },
    });

    return NextResponse.json(
      { success: true, data: promotion },
      { status: 201 },
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "ERR_500",
          message: "Error al crear promoción.",
          details: error.message,
        },
      },
      { status: 500 },
    );
  }
});
