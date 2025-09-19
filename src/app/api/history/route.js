import { getCurrentUser } from '@/lib/auth';
import prisma  from '@/lib/prisma';

export async function GET(req) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    // Fetch last 20 transactions for this user
    const history = await prisma.transaction.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    return new Response(
      JSON.stringify({ history }),
      { status: 200 }
    );
  } catch (err) {
    console.error('Error fetching history:', err);
    return new Response(
      JSON.stringify({ error: 'Server error' }),
      { status: 500 }
    );
  }
}
