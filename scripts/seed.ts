// Run this script to seed initial data
// Usage: npx tsx scripts/seed.ts

import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const sql = neon(process.env.POSTGRES_URL!);

async function seed() {
  console.log('🌱 Seeding database...\n');

  // Add sample interns
  const interns = [
    { name: 'Jasmine Bai', email: 'jasmine.bai@example.com' },
    { name: 'Teddy Liu', email: 'teddy.liu@example.com' },
  ];

  console.log('Adding interns...');
  for (const intern of interns) {
    try {
      await sql`
        INSERT INTO interns (name, email) 
        VALUES (${intern.name}, ${intern.email})
        ON CONFLICT DO NOTHING
      `;
      console.log(`  ✓ ${intern.name}`);
    } catch (e) {
      console.log(`  ⚠ ${intern.name} may already exist`);
    }
  }

  // Add sample sprints
  const sprints = [
    { name: 'Sprint 1 - Jan 15-22', start_date: '2026-01-15', end_date: '2026-01-22' },
    { name: 'Sprint 2 - Jan 22-29', start_date: '2026-01-22', end_date: '2026-01-29' },
    { name: 'Sprint 3 - Jan 29-Feb 5', start_date: '2026-01-29', end_date: '2026-02-05' },
  ];

  console.log('\nAdding sprints...');
  for (const sprint of sprints) {
    try {
      await sql`
        INSERT INTO sprints (name, start_date, end_date) 
        VALUES (${sprint.name}, ${sprint.start_date}, ${sprint.end_date})
        ON CONFLICT DO NOTHING
      `;
      console.log(`  ✓ ${sprint.name}`);
    } catch (e) {
      console.log(`  ⚠ ${sprint.name} may already exist`);
    }
  }

  console.log('\n✅ Seeding complete!');
  console.log('\nYou can now run: npm run dev');
  console.log('Then visit: http://localhost:3000/internal');
  console.log('Access code: mlv2026internal');
}

seed().catch(console.error);
