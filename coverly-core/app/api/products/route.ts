import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const GET = auth(async (req) => {
  if (!req.auth) {
    return NextResponse.json({ success: false, error: { message: "Unauthorized" } }, { status: 401 });
  }

  try {
    const searchParams = req.nextUrl.searchParams;
    const type = searchParams.get('type');
    const isActive = searchParams.get('isActive') === 'true' ? true : undefined;

    const products = await prisma.product.findMany({
      where: {
        ...(type && { type }),
        ...(isActive !== undefined && { isActive }),
      },
      include: {
        coverages: true
      }
    });

    return NextResponse.json({ success: true, data: products });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: { message: "Server error fetching products", details: error.message } }, { status: 500 });
  }
});
