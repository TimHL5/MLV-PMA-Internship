import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.POSTGRES_URL!);

// POST /api/internal/seed-team - Reset and seed team members
// This is a one-time setup endpoint
export async function POST(request: Request) {
  try {
    // Check for secret key (basic protection)
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    if (key !== 'mlv2026setup') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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
      { error: 'Failed to seed team members' },
      { status: 500 }
    );
  }
}
