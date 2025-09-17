import { getCurrentUser } from '@/lib/auth';

export async function GET(req) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    // Log the user ID
    console.log('Current User ID:', user.id);

    return new Response(JSON.stringify({
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        mobile: user.mobile
      }
    }), { status: 200 });
  } catch (err) {
    console.error('Error fetching user:', err);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
}
