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

    const searchParams = req.nextUrl.searchParams;
    const type = searchParams.get("type");
    const isActive = searchParams.get("isActive") === "true" ? true : undefined;

    const products = await prisma.product.findMany({
      where: {
        ...(type && { type }),
        ...(isActive !== undefined && { isActive }),
      },
      include: {
        coverages: true,
      },
    });

    return NextResponse.json({ success: true, data: products });
  }),
);
