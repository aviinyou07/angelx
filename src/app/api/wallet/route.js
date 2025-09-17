import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req) {
  const user = await getCurrentUser(req);

  if (!user) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
  }

  try {
    let wallet = await prisma.wallet.findUnique({
      where: { userId: user.id },
    });

    // If wallet somehow doesn't exist, create it automatically
    if (!wallet) {
      wallet = await prisma.wallet.create({
        data: {
          userId: user.id,
          usdtAvailable: 0,
          usdtDeposited: 0,
          usdtWithdrawn: 0,
        },
      });
      console.log(`Wallet created for userId: ${user.id}`);
    }

    return new Response(JSON.stringify(wallet), { status: 200 });
  } catch (err) {
    console.error("Wallet fetch error:", err);
    return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
  }
}
