import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.POSTGRES_URL!);

// GET /api/internal/setup?key=mlv2026setup - Full database setup
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key');

  if (key !== 'mlv2026setup') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const logs: string[] = [];
  const log = (msg: string) => {
    console.log(msg);
    logs.push(msg);
  };

  try {
    log('🚀 Starting full database setup...');

    // ==========================================
    // CREATE BASE TABLES
    // ==========================================

    log('1. Creating interns table...');
    await sql`
      CREATE TABLE IF NOT EXISTS interns (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE,
        avatar_url TEXT,
        location VARCHAR(50),
        timezone VARCHAR(50),
        role VARCHAR(50) DEFAULT 'intern',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;

    log('2. Creating sprints table...');
    await sql`
      CREATE TABLE IF NOT EXISTS sprints (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        start_date DATE,
        end_date DATE,
        is_active BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    log('3. Creating submissions table...');
    await sql`
      CREATE TABLE IF NOT EXISTS submissions (
        id SERIAL PRIMARY KEY,
        intern_id INTEGER REFERENCES interns(id) ON DELETE CASCADE,
        sprint_id INTEGER REFERENCES sprints(id) ON DELETE CASCADE,
        goals TEXT NOT NULL,
        deliverables TEXT NOT NULL,
        blockers TEXT,
        reflection TEXT,
        mood INTEGER CHECK (mood >= 1 AND mood <= 5),
        hours_worked INTEGER,
        submitted_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(intern_id, sprint_id)
      )
    `;

    log('4. Creating high_fives table...');
    await sql`
      CREATE TABLE IF NOT EXISTS high_fives (
        id SERIAL PRIMARY KEY,
        from_intern_id INTEGER REFERENCES interns(id) ON DELETE CASCADE,
        to_intern_id INTEGER REFERENCES interns(id) ON DELETE CASCADE,
        message TEXT NOT NULL,
        category VARCHAR(50),
        sprint_id INTEGER REFERENCES sprints(id),
        created_at TIMESTAMP DEFAULT NOW(),
        CHECK (from_intern_id != to_intern_id)
      )
    `;

    log('5. Creating one_on_ones table...');
    await sql`
      CREATE TABLE IF NOT EXISTS one_on_ones (
        id SERIAL PRIMARY KEY,
        intern_id INTEGER REFERENCES interns(id) ON DELETE CASCADE,
        sprint_id INTEGER REFERENCES sprints(id),
        scheduled_at TIMESTAMP,
        proud_of TEXT,
        need_help TEXT,
        questions TEXT,
        prep_submitted_at TIMESTAMP,
        admin_notes TEXT,
        action_items TEXT,
        meeting_completed_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;

    log('6. Creating coffee_chats table...');
    await sql`
      CREATE TABLE IF NOT EXISTS coffee_chats (
        id SERIAL PRIMARY KEY,
        intern_1_id INTEGER REFERENCES interns(id) ON DELETE CASCADE,
        intern_2_id INTEGER REFERENCES interns(id) ON DELETE CASCADE,
        sprint_id INTEGER REFERENCES sprints(id),
        status VARCHAR(20) DEFAULT 'pending',
        completed_at TIMESTAMP,
        notes TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        CHECK (intern_1_id != intern_2_id)
      )
    `;

    log('7. Creating tasks table...');
    await sql`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        sprint_id INTEGER REFERENCES sprints(id) ON DELETE CASCADE,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        status VARCHAR(20) DEFAULT 'todo',
        priority VARCHAR(20) DEFAULT 'medium',
        assignee_id INTEGER REFERENCES interns(id) ON DELETE SET NULL,
        created_by_id INTEGER REFERENCES interns(id),
        due_date DATE,
        estimated_hours INTEGER,
        actual_hours INTEGER,
        position INTEGER DEFAULT 0,
        parent_task_id INTEGER REFERENCES tasks(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;

    log('8. Creating task_comments table...');
    await sql`
      CREATE TABLE IF NOT EXISTS task_comments (
        id SERIAL PRIMARY KEY,
        task_id INTEGER REFERENCES tasks(id) ON DELETE CASCADE,
        intern_id INTEGER REFERENCES interns(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // ==========================================
    // CREATE INDEXES
    // ==========================================

    log('9. Creating indexes...');
    await sql`CREATE INDEX IF NOT EXISTS idx_submissions_intern ON submissions(intern_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_submissions_sprint ON submissions(sprint_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_high_fives_to ON high_fives(to_intern_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_high_fives_from ON high_fives(from_intern_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_tasks_sprint ON tasks(sprint_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_tasks_assignee ON tasks(assignee_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_one_on_ones_intern ON one_on_ones(intern_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_coffee_chats_sprint ON coffee_chats(sprint_id)`;

    // ==========================================
    // SEED DATA
    // ==========================================

    log('10. Clearing existing data...');
    await sql`DELETE FROM task_comments`;
    await sql`DELETE FROM tasks`;
    await sql`DELETE FROM coffee_chats`;
    await sql`DELETE FROM one_on_ones`;
    await sql`DELETE FROM high_fives`;
    await sql`DELETE FROM submissions`;
    await sql`DELETE FROM sprints`;
    await sql`DELETE FROM interns`;

    log('11. Adding team members...');
    const teamMembers = [
      { name: 'Tim', email: 'tim@mlvignite.com', role: 'admin', location: 'Boston' },
      { name: 'Dylan', email: 'dylan@mlvignite.com', role: 'admin', location: 'Hong Kong' },
      { name: 'Tina', email: 'tina@mlvignite.com', role: 'intern', location: null },
      { name: 'Vanessa', email: 'vanessa@mlvignite.com', role: 'intern', location: null },
      { name: 'Kim', email: 'kim@mlvignite.com', role: 'intern', location: null },
      { name: 'Linh', email: 'linh@mlvignite.com', role: 'intern', location: null },
      { name: 'Tiffany', email: 'tiffany@mlvignite.com', role: 'intern', location: null },
    ];

    const insertedMembers = [];
    for (const member of teamMembers) {
      const result = await sql`
        INSERT INTO interns (name, email, role, location)
        VALUES (${member.name}, ${member.email}, ${member.role}, ${member.location})
        RETURNING *
      `;
      insertedMembers.push(result[0]);
    }

    log('12. Creating active sprint...');
    await sql`
      INSERT INTO sprints (name, start_date, end_date, is_active)
      VALUES ('Sprint 1 - Jan 16-23', '2025-01-16', '2025-01-23', true)
    `;

    log('✅ Setup completed successfully!');

    return NextResponse.json({
      success: true,
      message: 'Database setup completed!',
      logs,
      team: {
        admins: insertedMembers.filter(m => m.role === 'admin').map(m => m.name),
        interns: insertedMembers.filter(m => m.role === 'intern').map(m => m.name),
      }
    });

  } catch (error) {
    log(`❌ Error: ${String(error)}`);
    return NextResponse.json({
      success: false,
      error: 'Setup failed',
      details: String(error),
      logs
    }, { status: 500 });
  }
}
