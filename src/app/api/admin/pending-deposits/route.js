import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const deposits = await prisma.transaction.findMany({
      where: { status: "PENDING", type: "DEPOSIT" },
      include: { user: true }, // include user details
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ deposits });
  } catch (err) {
    console.error("Fetch deposits error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
