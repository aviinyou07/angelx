import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';

// 1️⃣ Helper to get current user from JWT
async function getCurrentUser(req) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: payload.id } });
    return user || null;
  } catch (err) {
    return null;
  }
}

// 2️⃣ GET: fetch all bank cards for the current user
export async function GET(req) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }

    const bankCards = await prisma.bankCard.findMany({
      where: { userId: user.id },
      select: {
        id: true,
        accountNo: true,
        ifsc: true,
        payeeName: true,
        createdAt: true,
      },
    });

    return new Response(JSON.stringify({ banks: bankCards }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Server error' }), { status: 500 });
  }
}

// 3️⃣ POST: add a new bank card
export async function POST(req) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }

    const { accountNo, ifsc, payeeName } = await req.json();
    if (!accountNo || !ifsc || !payeeName) {
      return new Response(JSON.stringify({ message: 'All fields are required' }), { status: 400 });
    }

    // Check for duplicate account
    const existingCard = await prisma.bankCard.findFirst({
      where: { userId: user.id, accountNo },
    });

    if (existingCard) {
      return new Response(JSON.stringify({ message: 'This account is already linked.' }), { status: 400 });
    }

    const bankCard = await prisma.bankCard.create({
      data: { userId: user.id, accountNo, ifsc, payeeName },
    });

    return new Response(JSON.stringify({ message: 'Bank card added successfully!', bankCard }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Server error' }), { status: 500 });
  }
}

// 4️⃣ DELETE: remove a bank card
export async function DELETE(req) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }

    const { id } = await req.json();
    if (!id) {
      return new Response(JSON.stringify({ message: 'Bank card ID required' }), { status: 400 });
    }

    const bankCard = await prisma.bankCard.findUnique({
      where: { id },
    });

    if (!bankCard || bankCard.userId !== user.id) {
      return new Response(JSON.stringify({ message: 'Bank card not found or not yours' }), { status: 404 });
    }

    await prisma.bankCard.delete({
      where: { id },
    });

    return new Response(JSON.stringify({ message: 'Bank card deleted successfully' }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Server error' }), { status: 500 });
  }
}
