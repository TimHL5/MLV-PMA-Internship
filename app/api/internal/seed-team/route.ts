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

    // Also clear related data to avoid foreign key issues
    await sql`DELETE FROM submissions`;
    await sql`DELETE FROM high_fives`;
    await sql`DELETE FROM coffee_chats`;
    await sql`DELETE FROM one_on_ones`;
    await sql`DELETE FROM tasks`;

    // Add team members - MLV 2026 Cohort
    const teamMembers = [
      // Admins (Co-founders)
      { name: 'Tim', email: 'tim@mlvignite.com', role: 'admin', location: 'Boston' },
      { name: 'Dylan', email: 'dylan@mlvignite.com', role: 'admin', location: 'Hong Kong' },
      // Interns
      { name: 'Tina', email: 'tina@mlvignite.com', role: 'intern', location: null },
      { name: 'Vanessa', email: 'vanessa@mlvignite.com', role: 'intern', location: null },
      { name: 'Kim', email: 'kim@mlvignite.com', role: 'intern', location: null },
      { name: 'Linh', email: 'linh@mlvignite.com', role: 'intern', location: null },
      { name: 'Tiffany', email: 'tiffany@mlvignite.com', role: 'intern', location: null },
    ];

    const inserted = [];
    for (const member of teamMembers) {
      const result = await sql`
        INSERT INTO interns (name, email, role, location)
        VALUES (${member.name}, ${member.email}, ${member.role}, ${member.location})
        RETURNING *
      `;
      inserted.push(result[0]);
    }

    // Create a default active sprint
    await sql`DELETE FROM sprints`;
    await sql`
      INSERT INTO sprints (name, start_date, end_date, is_active)
      VALUES ('Sprint 1 - Jan 16-23', '2025-01-16', '2025-01-23', true)
    `;

    return NextResponse.json({
      success: true,
      message: 'Team seeded successfully!',
      team: {
        admins: inserted.filter(m => m.role === 'admin').map(m => m.name),
        interns: inserted.filter(m => m.role === 'intern').map(m => m.name),
      },
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
