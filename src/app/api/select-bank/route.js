import prisma from "@/lib/prisma";

export async function POST(req) {
  try {
    const { userId, bankId } = await req.json();

    // Verify the bank exists
    const bank = await prisma.bank.findUnique({
      where: { id: bankId },
    });

    if (!bank) {
      return new Response(JSON.stringify({ message: "Bank not found" }), { status: 404 });
    }

    // Save selected bank for user (example: update user table)
    await prisma.user.update({
      where: { id: userId },
      data: { selectedBankId: bankId },
    });

    return new Response(JSON.stringify({ message: "Bank selected", bank }), { status: 200 });
  } catch (error) {
    console.error("Error selecting bank:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), { status: 500 });
  }
}
