import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const GET = auth(async (req, { params }: { params: Promise<{ id: string }> }) => {
  if (!req.auth) {
    return NextResponse.json(
      { success: false, error: { code: "ERR_401", message: "Unauthorized" } },
      { status: 401 },
    );
  }

  try {
    const { id } = await params;

    const recommendation = await prisma.recommendation.findUnique({
      where: { id },
      include: {
        client: {
          select: { id: true, firstName: true, lastName: true },
        },
        products: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                type: true,
                priceBase: true,
                description: true,
                coverages: {
                  select: { id: true, name: true, description: true, value: true },
                },
              },
            },
          },
        },
      },
    });

    if (!recommendation) {
      return NextResponse.json(
        { success: false, error: { code: "ERR_404", message: "Recomendación no encontrada." } },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: recommendation });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "ERR_500", message: error.message } },
      { status: 500 },
    );
  }
});

export const PATCH = auth(async (req, { params }: { params: Promise<{ id: string }> }) => {
  if (!req.auth) {
    return NextResponse.json(
      { success: false, error: { code: "ERR_401", message: "Unauthorized" } },
      { status: 401 },
    );
  }

  try {
    const { id } = await params;
    const body = await req.json();

    const validStatuses = ["GENERATED", "PRESENTED", "ACCEPTED", "REJECTED"];
    if (body.status && !validStatuses.includes(body.status)) {
      return NextResponse.json(
        { success: false, error: { code: "ERR_400", message: `Status debe ser uno de: ${validStatuses.join(", ")}` } },
        { status: 400 },
      );
    }

    const recommendation = await prisma.recommendation.update({
      where: { id },
      data: {
        ...(body.status && { status: body.status }),
        ...(body.rejectionReason && { rejectionReason: body.rejectionReason }),
      },
      include: {
        client: {
          select: { id: true, firstName: true, lastName: true },
        },
        products: {
          include: {
            product: {
              select: { id: true, name: true, type: true, priceBase: true },
            },
          },
        },
      },
    });

    return NextResponse.json({ success: true, data: recommendation });
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json(
        { success: false, error: { code: "ERR_404", message: "Recomendación no encontrada." } },
        { status: 404 },
      );
    }
    return NextResponse.json(
      { success: false, error: { code: "ERR_500", message: error.message } },
      { status: 500 },
    );
  }
});
