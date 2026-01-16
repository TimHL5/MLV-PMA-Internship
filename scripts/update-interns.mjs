// Run this script to update interns
// Usage: node scripts/update-interns.mjs

import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const sql = neon(process.env.POSTGRES_URL);

async function updateInterns() {
  console.log('🔄 Updating team members...\n');

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
      `;
      console.log(`  ✓ ${member.name} (${member.role})`);
    } catch (e) {
      console.log(`  ⚠ ${member.name}: ${e.message}`);
    }
  }

  console.log('\n✅ Team members updated!');
}

updateInterns().catch(console.error);
