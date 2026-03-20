import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const PATCH = auth(async (req, { params }) => {
  if (!req.auth || req.auth.user.role !== "ADMIN") {
    return NextResponse.json(
      {
        success: false,
        error: { code: "ERR_403", message: "Forbidden. Admins only." },
      },
      { status: 403 },
    );
  }

  try {
    const { id } = await params!;
    const body = await req.json();

    if (typeof body.isActive !== "boolean") {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "ERR_400",
            message: "El campo 'isActive' (boolean) es requerido.",
          },
        },
        { status: 400 },
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { isActive: body.isActive },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ success: true, data: updatedUser });
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json(
        {
          success: false,
          error: { code: "ERR_404", message: "Usuario no encontrado." },
        },
        { status: 404 },
      );
    }
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "ERR_500",
          message: "Error actualizando usuario.",
          details: error.message,
        },
      },
      { status: 500 },
    );
  }
});
