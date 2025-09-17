// GET /api/admin/pending-selling-requests
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const requests = await prisma.transaction.findMany({
      where: { status: "PENDING", type: "SELL" },
      include: {
        user: { select: { id: true, email: true, fullName: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ requests });
  } catch (err) {
    console.error("Error fetching pending selling requests:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
