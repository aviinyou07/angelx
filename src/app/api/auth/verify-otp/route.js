import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';

export async function POST(req) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return new Response(JSON.stringify({ error: 'Email and OTP are required' }), { status: 400 });
    }

    // Find user in DB
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || user.otp !== otp) {
      return new Response(JSON.stringify({ error: 'Invalid OTP' }), { status: 401 });
    }

    if (user.otpExpiry < new Date()) {
      return new Response(JSON.stringify({ error: 'OTP expired' }), { status: 401 });
    }

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET not defined');
      return new Response(JSON.stringify({ error: 'Server misconfiguration' }), { status: 500 });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Clear OTP
    await prisma.user.update({
      where: { email },
      data: { otp: null, otpExpiry: null },
    });

    // Ensure wallet exists
    let wallet = await prisma.wallet.findUnique({ where: { userId: user.id } });
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

    // Redirect logic
    const redirectTo = user.fullName && user.mobile ? '/admin/dashboard' : '/complete-profile';

    return new Response(
      JSON.stringify({
        token,
        redirectTo,
        message: 'OTP verified successfully',
        wallet,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
}
