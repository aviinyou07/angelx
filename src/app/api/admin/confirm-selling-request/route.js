// POST /api/admin/confirm-selling-request
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

    // Update wallet atomically
    const wallet = await prisma.$transaction(async (prisma) => {
      const updatedWallet = await prisma.wallet.upsert({
        where: { userId: tx.userId },
        update: {
          usdtAvailable: { decrement: tx.amount },
          usdtWithdrawn: { increment: tx.amount },
        },
        create: {
          userId: tx.userId,
          usdtAvailable: 0,
          usdtDeposited: 0,
          usdtWithdrawn: tx.amount,
        },
      });

      await prisma.transaction.update({
        where: { id: tx.id },
        data: { status: "SUCCESS" },
      });

      return updatedWallet;
    });

    return NextResponse.json({ success: true, wallet });
  } catch (err) {
    console.error("Error confirming selling request:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
