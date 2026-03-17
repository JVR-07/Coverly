import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const GET = auth(async (req) => {
  if (!req.auth) {
    return NextResponse.json({ success: false, error: { message: "Unauthorized" } }, { status: 401 });
  }

  try {
    const searchParams = req.nextUrl.searchParams;
    const role = searchParams.get('role');

    const users = await prisma.user.findMany({
      where: {
        role: role ? (role as any) : undefined
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true
      }
    });

    return NextResponse.json({ success: true, data: users });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: { message: "Server error fetching users", details: error.message } }, { status: 500 });
  }
});

export const POST = auth(async (req) => {
  if (!req.auth || req.auth.user.role !== "ADMIN") {
    return NextResponse.json({ success: false, error: { message: "Forbidden. Admins only." } }, { status: 403 });
  }

  try {
    const body = await req.json();
    const passwordHash = await bcrypt.hash(body.password, 10);
    
    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        role: body.role,
        passwordHash
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true
      }
    });

    return NextResponse.json({ success: true, data: user }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: { message: "Error creating user", details: error.message } }, { status: 400 });
  }
});
