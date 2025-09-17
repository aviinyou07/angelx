// /app/api/admin/users/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req) {
  try {
    // Fetch all users along with wallet, bank cards, and transactions
    const users = await prisma.user.findMany({
      include: {
        wallet: true,
        bankCards: true,
        transactions: {
          orderBy: { createdAt: "desc" }, // latest transactions first
        },
      },
      orderBy: { id: "asc" },
    });

    return NextResponse.json({ success: true, users });
  } catch (err) {
    console.error("Error fetching users:", err);
    return NextResponse.json(
      { error: "An unexpected server error occurred" },
      { status: 500 }
    );
  }
}
