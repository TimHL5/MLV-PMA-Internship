import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.POSTGRES_URL!);

// Shared seed function
async function seedTeam(key: string | null) {
  if (key !== 'mlv2026setup') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Clear existing interns
    await sql`DELETE FROM interns`;

    // Add team members
    const teamMembers = [
      // Admins
      { name: 'Tim', email: 'tim@mlv.com', role: 'admin' },
      { name: 'Dylan', email: 'dylan@mlv.com', role: 'admin' },
      // Interns
      { name: 'Tina', email: 'tina@mlv.com', role: 'intern' },
      { name: 'Kim Ha', email: 'kimha@mlv.com', role: 'intern' },
      { name: 'Linh', email: 'linh@mlv.com', role: 'intern' },
      { name: 'Kim', email: 'kim@mlv.com', role: 'intern' },
      { name: 'Tiffany', email: 'tiffany@mlv.com', role: 'intern' },
    ];

    const inserted = [];
    for (const member of teamMembers) {
      const result = await sql`
        INSERT INTO interns (name, email, role)
        VALUES (${member.name}, ${member.email}, ${member.role})
        RETURNING *
      `;
      inserted.push(result[0]);
    }

    return NextResponse.json({
      success: true,
      message: 'Team members updated',
      members: inserted
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json(
      { error: 'Failed to seed team members', details: String(error) },
      { status: 500 }
    );
  }
}

// GET /api/internal/seed-team?key=mlv2026setup - Seed via browser
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key');
  return seedTeam(key);
}

// POST /api/internal/seed-team?key=mlv2026setup - Seed via API call
export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key');
  return seedTeam(key);
}
