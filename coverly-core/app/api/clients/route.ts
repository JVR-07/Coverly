import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const GET = auth(async (req) => {
  if (!req.auth) {
    return NextResponse.json({ success: false, error: { message: "Unauthorized" } }, { status: 401 });
  }

  try {
    const clients = await prisma.client.findMany({
      where: {
        agentId: req.auth.user.role === "ADMIN" ? undefined : req.auth.user.id
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ success: true, data: clients });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: { message: "Error fetching clients", details: error.message } }, { status: 500 });
  }
});

export const POST = auth(async (req) => {
  if (!req.auth) {
    return NextResponse.json({ success: false, error: { message: "Unauthorized" } }, { status: 401 });
  }

  try {
    const body = await req.json();
    const personalData = body.personalData || {};
    
    const client = await prisma.client.create({
      data: {
        agentId: req.auth.user.id,
        firstName: personalData.firstName || "",
        lastName: personalData.lastName || "",
        email: personalData.contact?.email || null,
        phone: personalData.contact?.phone || null,
        dateOfBirth: personalData.dateOfBirth ? new Date(personalData.dateOfBirth) : new Date(),
        gender: personalData.gender || null,
        clientType: body.clientType || "NEW",
        economicProfile: body.economicProfile || {},
        needs: body.needs || [],
        riskLevel: body.riskLevel || "LOW"
      }
    });

    return NextResponse.json({ success: true, data: client }, { status: 201 });
  } catch(error: any) {
    console.error("Failed to create client:", error);
    return NextResponse.json({ success: false, error: { message: "Error creating client", details: error.message } }, { status: 400 });
  }
});
