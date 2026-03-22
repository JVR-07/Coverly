import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
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

    const clients = await prisma.client.findMany({
      where: {
        agentId: req.auth.user.role === "ADMIN" ? undefined : req.auth.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ success: true, data: clients });
  }),
);

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
    const personalData = body.personalData || {};

    const client = await prisma.client.create({
      data: {
        agentId: req.auth.user.id,
        firstName: personalData.firstName || "",
        lastName: personalData.lastName || "",
        email: personalData.contact?.email || null,
        phone: personalData.contact?.phone || null,
        dateOfBirth: personalData.dateOfBirth
          ? new Date(personalData.dateOfBirth)
          : new Date(),
        gender: personalData.gender || null,
        clientType: body.clientType || "NEW",
        economicProfile: body.economicProfile || {},
        needs: body.needs || [],
        riskLevel: body.riskLevel || "LOW",
      },
    });

    return NextResponse.json({ success: true, data: client }, { status: 201 });
  }),
);
