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
    if (role !== "ADMIN" && role !== "SUPERVISOR") {
      return apiError({
        message: "Acceso denegado.",
        status: 403,
        code: "ERR_403",
      });
    }

    const searchParams = req.nextUrl.searchParams;
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const dateFilter: { createdAt?: { gte?: Date; lte?: Date } } = {};
    if (startDate || endDate) {
      dateFilter.createdAt = {};
      if (startDate) dateFilter.createdAt.gte = new Date(startDate);
      if (endDate)
        dateFilter.createdAt.lte = new Date(endDate + "T23:59:59.999Z");
    }

    const [totalQuotes, acceptedRecommendations, rejectedRecommendations] =
      await Promise.all([
        prisma.recommendation.count({ where: dateFilter }),
        prisma.recommendation.count({
          where: { ...dateFilter, status: "ACCEPTED" },
        }),
        prisma.recommendation.count({
          where: { ...dateFilter, status: "REJECTED" },
        }),
      ]);

    const conversionRate =
      totalQuotes > 0
        ? Math.round((acceptedRecommendations / totalQuotes) * 10000) / 100
        : 0;

    const revenueResult = await prisma.recommendedProduct.aggregate({
      _sum: { finalPrice: true },
      where: {
        recommendation: {
          status: "ACCEPTED",
          ...dateFilter,
        },
      },
    });

    const totalRevenue = Number(revenueResult._sum.finalPrice || 0);

    return NextResponse.json({
      success: true,
      data: {
        totalQuotes,
        acceptedRecommendations,
        rejectedRecommendations,
        conversionRate,
        totalRevenue,
      },
    });
  }),
);
