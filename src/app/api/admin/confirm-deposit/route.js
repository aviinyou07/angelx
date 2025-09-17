import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req) {
  try {
    const body = await req.json();
    const { transactionId } = body;

    if (!transactionId) {
      return NextResponse.json({ error: "Missing transactionId" }, { status: 400 });
    }

    const tx = await prisma.transaction.findUnique({
      where: { id: Number(transactionId) },
    });

    if (!tx || tx.status !== "PENDING") {
      return NextResponse.json({ error: "Transaction not found or already processed" }, { status: 404 });
    }

    // update wallet balances
    const wallet = await prisma.wallet.upsert({
      where: { userId: tx.userId },
      update: {
        usdtAvailable: { increment: tx.amount },
        usdtDeposited: { increment: tx.amount },
      },
      create: {
        userId: tx.userId,
        usdtAvailable: tx.amount,
        usdtDeposited: tx.amount,
      },
    });

    // mark transaction success
    await prisma.transaction.update({
      where: { id: tx.id },
      data: { status: "SUCCESS" },
    });

    return NextResponse.json({ success: true, wallet });
  } catch (err) {
    console.error("Admin confirm error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
