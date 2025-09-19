import { getCurrentUser } from '@/lib/auth';
import prisma  from '@/lib/prisma';

export async function GET(req) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401 }
      );
    }

    // Fetch the user with wallet
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        wallet: true,
      },
    });

    if (!dbUser) {
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        { status: 404 }
      );
    }

    // Ensure wallet exists (fallback to zeros)
    const wallet = dbUser.wallet || {
      usdtAvailable: 0,
      usdtDeposited: 0,
      usdtWithdrawn: 0,
    };

    // Calculate progressing balance
    const progressing =
      wallet.usdtDeposited - wallet.usdtAvailable - wallet.usdtWithdrawn;

    return new Response(
      JSON.stringify({
        user: {
          id: dbUser.id,
          email: dbUser.email,
          fullName: dbUser.fullName,
          mobile: dbUser.mobile,
          wallet: {
            total: wallet.usdtDeposited,
            available: wallet.usdtAvailable,
            withdrawn: wallet.usdtWithdrawn,
            progressing: progressing < 0 ? 0 : progressing, // avoid negatives
          },
        },
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error('Error fetching user:', err);
    return new Response(
      JSON.stringify({ error: 'Server error' }),
      { status: 500 }
    );
  }
}
