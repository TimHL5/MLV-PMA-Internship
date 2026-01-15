import { neon } from '@neondatabase/serverless';

// Create a SQL query function using the connection string from environment
export const sql = neon(process.env.POSTGRES_URL!);

// Types for our database tables
export interface Intern {
  id: number;
  name: string;
  email: string | null;
  created_at: Date;
}

export interface Sprint {
  id: number;
  name: string;
  start_date: Date | null;
  end_date: Date | null;
}

export interface Submission {
  id: number;
  intern_id: number;
  sprint_id: number;
  goals: string;
  deliverables: string;
  blockers: string | null;
  reflection: string | null;
  submitted_at: Date;
  // Joined fields
  intern_name?: string;
  sprint_name?: string;
}

// Database query functions
export async function getInterns(): Promise<Intern[]> {
  const result = await sql`SELECT * FROM interns ORDER BY name`;
  return result as Intern[];
}

export async function createIntern(name: string, email?: string): Promise<Intern> {
  const result = await sql`
    INSERT INTO interns (name, email) 
    VALUES (${name}, ${email || null})
    RETURNING *
  `;
  return result[0] as Intern;
}

export async function getSprints(): Promise<Sprint[]> {
  const result = await sql`SELECT * FROM sprints ORDER BY start_date DESC`;
  return result as Sprint[];
}

export async function createSprint(name: string, startDate?: string, endDate?: string): Promise<Sprint> {
  const result = await sql`
    INSERT INTO sprints (name, start_date, end_date) 
    VALUES (${name}, ${startDate || null}, ${endDate || null})
    RETURNING *
  `;
  return result[0] as Sprint;
}

export async function getSubmissions(filters?: {
  internId?: number;
  sprintId?: number;
}): Promise<Submission[]> {
  if (filters?.internId && filters?.sprintId) {
    const result = await sql`
      SELECT s.*, i.name as intern_name, sp.name as sprint_name
      FROM submissions s
      JOIN interns i ON s.intern_id = i.id
      JOIN sprints sp ON s.sprint_id = sp.id
      WHERE s.intern_id = ${filters.internId} AND s.sprint_id = ${filters.sprintId}
      ORDER BY s.submitted_at DESC
    `;
    return result as Submission[];
  } else if (filters?.internId) {
    const result = await sql`
      SELECT s.*, i.name as intern_name, sp.name as sprint_name
      FROM submissions s
      JOIN interns i ON s.intern_id = i.id
      JOIN sprints sp ON s.sprint_id = sp.id
      WHERE s.intern_id = ${filters.internId}
      ORDER BY s.submitted_at DESC
    `;
    return result as Submission[];
  } else if (filters?.sprintId) {
    const result = await sql`
      SELECT s.*, i.name as intern_name, sp.name as sprint_name
      FROM submissions s
      JOIN interns i ON s.intern_id = i.id
      JOIN sprints sp ON s.sprint_id = sp.id
      WHERE s.sprint_id = ${filters.sprintId}
      ORDER BY s.submitted_at DESC
    `;
    return result as Submission[];
  } else {
    const result = await sql`
      SELECT s.*, i.name as intern_name, sp.name as sprint_name
      FROM submissions s
      JOIN interns i ON s.intern_id = i.id
      JOIN sprints sp ON s.sprint_id = sp.id
      ORDER BY s.submitted_at DESC
    `;
    return result as Submission[];
  }
}

export async function createSubmission(data: {
  internId: number;
  sprintId: number;
  goals: string;
  deliverables: string;
  blockers?: string;
  reflection?: string;
}): Promise<Submission> {
  const result = await sql`
    INSERT INTO submissions (intern_id, sprint_id, goals, deliverables, blockers, reflection) 
    VALUES (${data.internId}, ${data.sprintId}, ${data.goals}, ${data.deliverables}, ${data.blockers || null}, ${data.reflection || null})
    RETURNING *
  `;
  return result[0] as Submission;
}

export async function getSubmissionStats(sprintId?: number) {
  const totalInternsResult = await sql`SELECT COUNT(*) as count FROM interns`;
  const totalInterns = Number(totalInternsResult[0].count);

  let submittedThisSprint = 0;
  let totalSubmissions = 0;

  if (sprintId) {
    const submittedResult = await sql`
      SELECT COUNT(DISTINCT intern_id) as count 
      FROM submissions 
      WHERE sprint_id = ${sprintId}
    `;
    submittedThisSprint = Number(submittedResult[0].count);

    const totalResult = await sql`
      SELECT COUNT(*) as count 
      FROM submissions 
      WHERE sprint_id = ${sprintId}
    `;
    totalSubmissions = Number(totalResult[0].count);
  } else {
    const totalResult = await sql`SELECT COUNT(*) as count FROM submissions`;
    totalSubmissions = Number(totalResult[0].count);
  }

  return {
    totalInterns,
    submittedThisSprint,
    totalSubmissions,
    missingSubmissions: totalInterns - submittedThisSprint,
  };
}
