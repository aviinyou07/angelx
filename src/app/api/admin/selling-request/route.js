import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

function getUserIdFromToken(req) {
  try {
    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.split(" ")[1]; // "Bearer <token>"
    if (!token) return null;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.id; // assuming JWT payload contains { id: userId }
  } catch (err) {
    console.error("Invalid token:", err);
    return null;
  }
}

export async function POST(req) {
  try {
    const { bank, amount } = await req.json();
    const userId = getUserIdFromToken(req);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!bank || !amount) {
      return NextResponse.json({ error: "Missing bank or amount" }, { status: 400 });
    }

    const transaction = await prisma.transaction.create({
      data: {
        userId,
        depositId: `SELL-${Date.now()}`,
        type: "SELL",
        amount,
        currency: "USDT",
        network: "BANK",
        address: bank.accountNo,
        status: "PENDING",
      },
    });

    return NextResponse.json({ success: true, transaction });
  } catch (err) {
    console.error("Error creating selling request:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
