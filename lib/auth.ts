import { cookies } from 'next/headers';

const ACCESS_CODE = process.env.ACCESS_CODE || 'mlv2026internal';
const COOKIE_NAME = 'mlv_internal_auth';
const COOKIE_MAX_AGE = 60 * 60 * 24; // 24 hours

export function validateAccessCode(code: string): boolean {
  return code === ACCESS_CODE;
}

export async function setAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, 'authenticated', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  });
}

export async function clearAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get(COOKIE_NAME);
  return authCookie?.value === 'authenticated';
}
