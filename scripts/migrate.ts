import { neon } from '@neondatabase/serverless';
import 'dotenv/config';

const sql = neon(process.env.POSTGRES_URL!);

async function migrate() {
  console.log('Starting database migration...\n');

  try {
    // ==========================================
    // ALTER EXISTING TABLES
    // ==========================================

    console.log('1. Updating interns table...');
    await sql`
      ALTER TABLE interns
      ADD COLUMN IF NOT EXISTS avatar_url TEXT,
      ADD COLUMN IF NOT EXISTS location VARCHAR(50),
      ADD COLUMN IF NOT EXISTS timezone VARCHAR(50),
      ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'intern',
      ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW()
    `;
    console.log('   ✓ Interns table updated\n');

    console.log('2. Updating sprints table...');
    await sql`
      ALTER TABLE sprints
      ADD COLUMN IF NOT EXISTS description TEXT,
      ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT false
    `;
    console.log('   ✓ Sprints table updated\n');

    console.log('3. Updating submissions table...');
    await sql`
      ALTER TABLE submissions
      ADD COLUMN IF NOT EXISTS mood INTEGER,
      ADD COLUMN IF NOT EXISTS hours_worked INTEGER,
      ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW()
    `;
    // Add unique constraint if not exists
    await sql`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'submissions_intern_id_sprint_id_key'
        ) THEN
          ALTER TABLE submissions ADD CONSTRAINT submissions_intern_id_sprint_id_key UNIQUE (intern_id, sprint_id);
        END IF;
      END
      $$;
    `;
    // Add mood check constraint
    await sql`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'submissions_mood_check'
        ) THEN
          ALTER TABLE submissions ADD CONSTRAINT submissions_mood_check CHECK (mood >= 1 AND mood <= 5);
        END IF;
      END
      $$;
    `;
    console.log('   ✓ Submissions table updated\n');

    // ==========================================
    // CREATE NEW TABLES
    // ==========================================

    console.log('4. Creating high_fives table...');
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
    console.log('   ✓ high_fives table created\n');

    console.log('5. Creating one_on_ones table...');
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
    console.log('   ✓ one_on_ones table created\n');

    console.log('6. Creating coffee_chats table...');
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
    console.log('   ✓ coffee_chats table created\n');

    console.log('7. Creating tasks table...');
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
    console.log('   ✓ tasks table created\n');

    console.log('8. Creating task_comments table...');
    await sql`
      CREATE TABLE IF NOT EXISTS task_comments (
        id SERIAL PRIMARY KEY,
        task_id INTEGER REFERENCES tasks(id) ON DELETE CASCADE,
        intern_id INTEGER REFERENCES interns(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;
    console.log('   ✓ task_comments table created\n');

    // ==========================================
    // CREATE INDEXES
    // ==========================================

    console.log('9. Creating indexes...');
    await sql`CREATE INDEX IF NOT EXISTS idx_submissions_intern ON submissions(intern_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_submissions_sprint ON submissions(sprint_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_high_fives_to ON high_fives(to_intern_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_high_fives_from ON high_fives(from_intern_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_tasks_sprint ON tasks(sprint_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_tasks_assignee ON tasks(assignee_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_one_on_ones_intern ON one_on_ones(intern_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_coffee_chats_sprint ON coffee_chats(sprint_id)`;
    console.log('   ✓ Indexes created\n');

    console.log('==========================================');
    console.log('Migration completed successfully!');
    console.log('==========================================\n');

    // Show table counts
    const interns = await sql`SELECT COUNT(*) as count FROM interns`;
    const sprints = await sql`SELECT COUNT(*) as count FROM sprints`;
    const submissions = await sql`SELECT COUNT(*) as count FROM submissions`;
    const highFives = await sql`SELECT COUNT(*) as count FROM high_fives`;
    const oneOnOnes = await sql`SELECT COUNT(*) as count FROM one_on_ones`;
    const coffeeChats = await sql`SELECT COUNT(*) as count FROM coffee_chats`;
    const tasks = await sql`SELECT COUNT(*) as count FROM tasks`;

    console.log('Current table counts:');
    console.log(`  - Interns: ${interns[0].count}`);
    console.log(`  - Sprints: ${sprints[0].count}`);
    console.log(`  - Submissions: ${submissions[0].count}`);
    console.log(`  - High Fives: ${highFives[0].count}`);
    console.log(`  - One-on-Ones: ${oneOnOnes[0].count}`);
    console.log(`  - Coffee Chats: ${coffeeChats[0].count}`);
    console.log(`  - Tasks: ${tasks[0].count}`);

  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();
