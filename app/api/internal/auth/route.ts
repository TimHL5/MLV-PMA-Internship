import { NextRequest, NextResponse } from 'next/server';
import { validateAccessCode, setAuthCookie, clearAuthCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();
    
    if (!code) {
      return NextResponse.json(
        { error: 'Access code is required' },
        { status: 400 }
      );
    }

    if (validateAccessCode(code)) {
      await setAuthCookie();
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: 'Invalid access code' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    await clearAuthCookie();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    );
  }
}
