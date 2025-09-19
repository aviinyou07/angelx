import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req) {
  try {
    const token = req.cookies.get("adminToken")?.value;

    if (!token) return NextResponse.json({ valid: false }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const admin = await prisma.admin.findUnique({ where: { id: decoded.id } });
    if (!admin) return NextResponse.json({ valid: false }, { status: 401 });

    return NextResponse.json({ valid: true, email: admin.email });
  } catch (err) {
    return NextResponse.json({ valid: false }, { status: 401 });
  }
}
