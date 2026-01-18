import { NextResponse } from 'next/server';
import { signOut, getCurrentUser } from '@/lib/supabase/auth';

// Get current user info
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    return NextResponse.json(user);
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json({ error: 'Authentication check failed' }, { status: 500 });
  }
}

// Sign out
export async function DELETE() {
  try {
    await signOut();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ error: 'Logout failed' }, { status: 500 });
  }
}
