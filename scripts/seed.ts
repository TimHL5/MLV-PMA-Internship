// Run this script to seed initial data
// Usage: npx tsx scripts/seed.ts

import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const sql = neon(process.env.POSTGRES_URL!);

async function seed() {
  console.log('🌱 Seeding database...\n');

  // Clear existing interns first
  console.log('Clearing existing interns...');
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

  console.log('Adding team members...');
  for (const member of teamMembers) {
    try {
      await sql`
        INSERT INTO interns (name, email, role)
        VALUES (${member.name}, ${member.email}, ${member.role})
        ON CONFLICT DO NOTHING
      `;
      console.log(`  ✓ ${member.name} (${member.role})`);
    } catch (e) {
      console.log(`  ⚠ ${member.name} may already exist`);
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
