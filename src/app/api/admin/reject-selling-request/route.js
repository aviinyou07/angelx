// POST /api/admin/reject-selling-request
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { transactionId } = await req.json();
    if (!transactionId) {
      return NextResponse.json({ error: "Missing transactionId" }, { status: 400 });
    }

    const tx = await prisma.transaction.findUnique({ where: { id: Number(transactionId) } });
    if (!tx || tx.status !== "PENDING") {
      return NextResponse.json({ error: "Transaction not found or already processed" }, { status: 404 });
    }

    await prisma.transaction.update({
      where: { id: tx.id },
      data: { status: "FAILED" },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error rejecting selling request:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
