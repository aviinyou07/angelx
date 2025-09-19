import prisma from '@/lib/prisma';
import { sendEmail } from '@/lib/mailer';
import crypto from 'crypto';

const generateOtp = () => crypto.randomInt(1000, 9999).toString();

export async function POST(req) {
  try {
    const { email } = await req.json();
    if (!email) {
      return new Response(JSON.stringify({ error: 'Email is required' }), { status: 400 });
    }

    const otp = generateOtp();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 min expiry

    // Upsert user safely for serverless
    await prisma.user.upsert({
      where: { email },
      update: { otp, otpExpiry },
      create: { email, otp, otpExpiry },
    });

    try {
      await sendEmail(email, otp);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      return new Response(JSON.stringify({ error: 'Failed to send OTP email' }), { status: 500 });
    }

    return new Response(JSON.stringify({ message: 'OTP sent to your email' }), { status: 200 });
  } catch (error) {
    console.error('Error sending OTP:', error);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
}

// Optional: prevent 405 for GET (helpful for debugging)
export async function GET() {
  return new Response(JSON.stringify({ message: "Use POST to send OTP" }), { status: 200 });
}
