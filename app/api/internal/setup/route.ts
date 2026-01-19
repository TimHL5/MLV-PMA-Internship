import { NextResponse } from 'next/server';

// DEPRECATED: This route used the old Neon database
// The platform now uses Supabase. See /supabase-setup/ for setup instructions.

// GET /api/internal/setup - Returns deprecation message
export async function GET() {
  return NextResponse.json({
    deprecated: true,
    message: 'This API route is deprecated. The platform now uses Supabase.',
    instructions: 'See /supabase-setup/ folder for Supabase setup instructions.',
    newDashboard: '/mlv/pma-internship-2026'
  });
}
