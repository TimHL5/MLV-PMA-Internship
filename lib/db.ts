import { neon } from '@neondatabase/serverless';
import type {
  Intern,
  LegacySprint as Sprint,
  LegacySubmission as Submission,
  LegacyHighFive as HighFive,
  HighFiveCategory,
  OneOnOne,
  CoffeeChat,
  CoffeeChatStatus,
  Task,
  TaskStatus,
  TaskPriority,
  TaskComment,
} from './types';

// Legacy dashboard types for Neon-based internal routes
interface DashboardStats {
  totalInterns: number;
  submittedThisSprint: number;
  missingSubmissions: number;
  totalSubmissions: number;
  highFivesGiven: number;
  tasksCompleted: number;
  averageMood: number | null;
}

interface SubmissionStatus {
  intern: Intern;
  hasSubmitted: boolean;
  submittedAt: Date | null;
}

interface InternProgress {
  intern: Intern;
  totalSubmissions: number;
  currentStreak: number;
  highFivesReceived: number;
  averageMood: number | null;
  tasksCompleted: number;
  submissionHistory: {
    sprint: Sprint;
    submitted: boolean;
    submittedAt: Date | null;
  }[];
  recentHighFives: HighFive[];
}

// Re-export types for convenience
export type {
  Intern,
  Sprint,
  Submission,
  HighFive,
  HighFiveCategory,
  OneOnOne,
  CoffeeChat,
  CoffeeChatStatus,
  Task,
  TaskStatus,
  TaskPriority,
  TaskComment,
  DashboardStats,
  SubmissionStatus,
  InternProgress,
};

// Create a SQL query function using the connection string from environment
const rawSql = process.env.POSTGRES_URL
  ? neon(process.env.POSTGRES_URL)
  : null;

// Wrapper to ensure results are always an array
type SqlValues = string | number | boolean | null | undefined | Date;
// eslint-disable-next-line
export const sql = async (strings: TemplateStringsArray, ...values: SqlValues[]): Promise<any[]> => {
  if (!rawSql) return [];
  const result = await rawSql(strings, ...values);
  return result as unknown[];
};

// ==========================================
// INTERNS
// ==========================================

export async function getInterns(): Promise<Intern[]> {
  const result = await sql`SELECT * FROM interns ORDER BY name`;
  return result as Intern[];
}

export async function getInternById(id: number): Promise<Intern | null> {
  const result = await sql`SELECT * FROM interns WHERE id = ${id}`;
  return result[0] as Intern || null;
}

export async function createIntern(
  name: string,
  email?: string,
  location?: string,
  timezone?: string,
  role: 'intern' | 'admin' = 'intern'
): Promise<Intern> {
  const result = await sql`
    INSERT INTO interns (name, email, location, timezone, role)
    VALUES (${name}, ${email || null}, ${location || null}, ${timezone || null}, ${role})
    RETURNING *
  `;
  return result[0] as Intern;
}

export async function updateIntern(
  id: number,
  data: Partial<Pick<Intern, 'name' | 'email' | 'avatar_url' | 'location' | 'timezone' | 'role'>>
): Promise<Intern> {
  const result = await sql`
    UPDATE interns
    SET
      name = COALESCE(${data.name ?? null}, name),
      email = COALESCE(${data.email ?? null}, email),
      avatar_url = COALESCE(${data.avatar_url ?? null}, avatar_url),
      location = COALESCE(${data.location ?? null}, location),
      timezone = COALESCE(${data.timezone ?? null}, timezone),
      role = COALESCE(${data.role ?? null}, role),
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `;
  return result[0] as Intern;
}

// ==========================================
// SPRINTS
// ==========================================

export async function getSprints(): Promise<Sprint[]> {
  const result = await sql`SELECT * FROM sprints ORDER BY start_date DESC NULLS LAST`;
  return result as Sprint[];
}

export async function getSprintById(id: number): Promise<Sprint | null> {
  const result = await sql`SELECT * FROM sprints WHERE id = ${id}`;
  return result[0] as Sprint || null;
}

export async function getActiveSprint(): Promise<Sprint | null> {
  const result = await sql`SELECT * FROM sprints WHERE is_active = true LIMIT 1`;
  if (result[0]) return result[0] as Sprint;
  // Fallback to most recent sprint
  const fallback = await sql`SELECT * FROM sprints ORDER BY start_date DESC NULLS LAST LIMIT 1`;
  return fallback[0] as Sprint || null;
}

export async function createSprint(
  name: string,
  startDate?: string,
  endDate?: string,
  description?: string
): Promise<Sprint> {
  const result = await sql`
    INSERT INTO sprints (name, start_date, end_date, description)
    VALUES (${name}, ${startDate || null}, ${endDate || null}, ${description || null})
    RETURNING *
  `;
  return result[0] as Sprint;
}

export async function setActiveSprint(id: number): Promise<Sprint> {
  // Deactivate all sprints first
  await sql`UPDATE sprints SET is_active = false`;
  // Activate the selected sprint
  const result = await sql`
    UPDATE sprints SET is_active = true WHERE id = ${id}
    RETURNING *
  `;
  return result[0] as Sprint;
}

// ==========================================
// SUBMISSIONS
// ==========================================

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
  mood?: number;
  hoursWorked?: number;
}): Promise<Submission> {
  const result = await sql`
    INSERT INTO submissions (intern_id, sprint_id, goals, deliverables, blockers, reflection, mood, hours_worked)
    VALUES (${data.internId}, ${data.sprintId}, ${data.goals}, ${data.deliverables}, ${data.blockers || null}, ${data.reflection || null}, ${data.mood || null}, ${data.hoursWorked || null})
    ON CONFLICT (intern_id, sprint_id)
    DO UPDATE SET
      goals = EXCLUDED.goals,
      deliverables = EXCLUDED.deliverables,
      blockers = EXCLUDED.blockers,
      reflection = EXCLUDED.reflection,
      mood = EXCLUDED.mood,
      hours_worked = EXCLUDED.hours_worked,
      updated_at = NOW()
    RETURNING *
  `;
  return result[0] as Submission;
}

export async function getSubmissionStats(sprintId?: number): Promise<DashboardStats> {
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

  // High fives count
  const highFivesResult = await sql`SELECT COUNT(*) as count FROM high_fives`;
  const highFivesGiven = Number(highFivesResult[0]?.count || 0);

  // Tasks completed
  const tasksResult = await sql`SELECT COUNT(*) as count FROM tasks WHERE status = 'done'`;
  const tasksCompleted = Number(tasksResult[0]?.count || 0);

  // Average mood
  const moodResult = await sql`SELECT AVG(mood) as avg FROM submissions WHERE mood IS NOT NULL`;
  const averageMood = moodResult[0]?.avg ? Number(moodResult[0].avg) : null;

  return {
    totalInterns,
    submittedThisSprint,
    totalSubmissions,
    missingSubmissions: totalInterns - submittedThisSprint,
    highFivesGiven,
    tasksCompleted,
    averageMood,
  };
}

// ==========================================
// SUBMISSION STATUS (Who's Missing Board)
// ==========================================

export async function getSubmissionStatus(sprintId: number): Promise<SubmissionStatus[]> {
  const interns = await getInterns();
  const submissions = await sql`
    SELECT intern_id, submitted_at
    FROM submissions
    WHERE sprint_id = ${sprintId}
  `;

  const submissionMap = new Map(
    (submissions as { intern_id: number; submitted_at: Date }[]).map((s) => [s.intern_id, s.submitted_at])
  );

  return interns.map(intern => ({
    intern,
    hasSubmitted: submissionMap.has(intern.id),
    submittedAt: submissionMap.get(intern.id) || null,
  }));
}

export async function getMissingInterns(sprintId: number): Promise<Intern[]> {
  const result = await sql`
    SELECT i.*
    FROM interns i
    LEFT JOIN submissions s ON i.id = s.intern_id AND s.sprint_id = ${sprintId}
    WHERE s.id IS NULL
    ORDER BY i.name
  `;
  return result as Intern[];
}

// ==========================================
// HIGH FIVES (Peer Recognition)
// ==========================================

export async function getHighFives(filters?: {
  toInternId?: number;
  fromInternId?: number;
  sprintId?: number;
  limit?: number;
}): Promise<HighFive[]> {
  const limit = filters?.limit || 50;

  if (filters?.toInternId) {
    const result = await sql`
      SELECT h.*,
        fi.name as from_intern_name, fi.avatar_url as from_intern_avatar,
        ti.name as to_intern_name, ti.avatar_url as to_intern_avatar
      FROM high_fives h
      JOIN interns fi ON h.from_intern_id = fi.id
      JOIN interns ti ON h.to_intern_id = ti.id
      WHERE h.to_intern_id = ${filters.toInternId}
      ORDER BY h.created_at DESC
      LIMIT ${limit}
    `;
    return result as HighFive[];
  }

  if (filters?.fromInternId) {
    const result = await sql`
      SELECT h.*,
        fi.name as from_intern_name, fi.avatar_url as from_intern_avatar,
        ti.name as to_intern_name, ti.avatar_url as to_intern_avatar
      FROM high_fives h
      JOIN interns fi ON h.from_intern_id = fi.id
      JOIN interns ti ON h.to_intern_id = ti.id
      WHERE h.from_intern_id = ${filters.fromInternId}
      ORDER BY h.created_at DESC
      LIMIT ${limit}
    `;
    return result as HighFive[];
  }

  if (filters?.sprintId) {
    const result = await sql`
      SELECT h.*,
        fi.name as from_intern_name, fi.avatar_url as from_intern_avatar,
        ti.name as to_intern_name, ti.avatar_url as to_intern_avatar
      FROM high_fives h
      JOIN interns fi ON h.from_intern_id = fi.id
      JOIN interns ti ON h.to_intern_id = ti.id
      WHERE h.sprint_id = ${filters.sprintId}
      ORDER BY h.created_at DESC
      LIMIT ${limit}
    `;
    return result as HighFive[];
  }

  const result = await sql`
    SELECT h.*,
      fi.name as from_intern_name, fi.avatar_url as from_intern_avatar,
      ti.name as to_intern_name, ti.avatar_url as to_intern_avatar
    FROM high_fives h
    JOIN interns fi ON h.from_intern_id = fi.id
    JOIN interns ti ON h.to_intern_id = ti.id
    ORDER BY h.created_at DESC
    LIMIT ${limit}
  `;
  return result as HighFive[];
}

export async function createHighFive(data: {
  fromInternId: number;
  toInternId: number;
  message: string;
  category?: HighFiveCategory;
  sprintId?: number;
}): Promise<HighFive> {
  const result = await sql`
    INSERT INTO high_fives (from_intern_id, to_intern_id, message, category, sprint_id)
    VALUES (${data.fromInternId}, ${data.toInternId}, ${data.message}, ${data.category || null}, ${data.sprintId || null})
    RETURNING *
  `;
  return result[0] as HighFive;
}

export async function getHighFiveCount(internId: number): Promise<number> {
  const result = await sql`
    SELECT COUNT(*) as count FROM high_fives WHERE to_intern_id = ${internId}
  `;
  return Number(result[0].count);
}

// ==========================================
// ONE-ON-ONES (1:1 Prep & Notes)
// ==========================================

export async function getOneOnOnes(filters?: {
  internId?: number;
  sprintId?: number;
}): Promise<OneOnOne[]> {
  if (filters?.internId && filters?.sprintId) {
    const result = await sql`
      SELECT o.*, i.name as intern_name, i.avatar_url as intern_avatar, s.name as sprint_name
      FROM one_on_ones o
      JOIN interns i ON o.intern_id = i.id
      LEFT JOIN sprints s ON o.sprint_id = s.id
      WHERE o.intern_id = ${filters.internId} AND o.sprint_id = ${filters.sprintId}
      ORDER BY o.scheduled_at DESC
    `;
    return result as OneOnOne[];
  }

  if (filters?.internId) {
    const result = await sql`
      SELECT o.*, i.name as intern_name, i.avatar_url as intern_avatar, s.name as sprint_name
      FROM one_on_ones o
      JOIN interns i ON o.intern_id = i.id
      LEFT JOIN sprints s ON o.sprint_id = s.id
      WHERE o.intern_id = ${filters.internId}
      ORDER BY o.scheduled_at DESC
    `;
    return result as OneOnOne[];
  }

  if (filters?.sprintId) {
    const result = await sql`
      SELECT o.*, i.name as intern_name, i.avatar_url as intern_avatar, s.name as sprint_name
      FROM one_on_ones o
      JOIN interns i ON o.intern_id = i.id
      LEFT JOIN sprints s ON o.sprint_id = s.id
      WHERE o.sprint_id = ${filters.sprintId}
      ORDER BY o.scheduled_at DESC
    `;
    return result as OneOnOne[];
  }

  const result = await sql`
    SELECT o.*, i.name as intern_name, i.avatar_url as intern_avatar, s.name as sprint_name
    FROM one_on_ones o
    JOIN interns i ON o.intern_id = i.id
    LEFT JOIN sprints s ON o.sprint_id = s.id
    ORDER BY o.scheduled_at DESC
  `;
  return result as OneOnOne[];
}

export async function getOrCreateOneOnOne(internId: number, sprintId: number): Promise<OneOnOne> {
  // Check if exists
  const existing = await sql`
    SELECT * FROM one_on_ones WHERE intern_id = ${internId} AND sprint_id = ${sprintId}
  `;

  if (existing[0]) {
    return existing[0] as OneOnOne;
  }

  // Create new
  const result = await sql`
    INSERT INTO one_on_ones (intern_id, sprint_id)
    VALUES (${internId}, ${sprintId})
    RETURNING *
  `;
  return result[0] as OneOnOne;
}

export async function submitOneOnOnePrep(
  id: number,
  data: { proudOf?: string; needHelp?: string; questions?: string }
): Promise<OneOnOne> {
  const result = await sql`
    UPDATE one_on_ones
    SET
      proud_of = ${data.proudOf || null},
      need_help = ${data.needHelp || null},
      questions = ${data.questions || null},
      prep_submitted_at = NOW(),
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `;
  return result[0] as OneOnOne;
}

export async function addAdminNotes(
  id: number,
  data: { adminNotes?: string; actionItems?: string; completed?: boolean }
): Promise<OneOnOne> {
  const result = await sql`
    UPDATE one_on_ones
    SET
      admin_notes = COALESCE(${data.adminNotes ?? null}, admin_notes),
      action_items = COALESCE(${data.actionItems ?? null}, action_items),
      meeting_completed_at = ${data.completed ? new Date().toISOString() : null},
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `;
  return result[0] as OneOnOne;
}

// ==========================================
// COFFEE CHATS (Matching)
// ==========================================

export async function getCoffeeChats(filters?: {
  internId?: number;
  sprintId?: number;
}): Promise<CoffeeChat[]> {
  if (filters?.internId && filters?.sprintId) {
    const result = await sql`
      SELECT c.*,
        i1.name as intern_1_name, i1.avatar_url as intern_1_avatar, i1.location as intern_1_location, i1.timezone as intern_1_timezone,
        i2.name as intern_2_name, i2.avatar_url as intern_2_avatar, i2.location as intern_2_location, i2.timezone as intern_2_timezone,
        s.name as sprint_name
      FROM coffee_chats c
      JOIN interns i1 ON c.intern_1_id = i1.id
      JOIN interns i2 ON c.intern_2_id = i2.id
      LEFT JOIN sprints s ON c.sprint_id = s.id
      WHERE (c.intern_1_id = ${filters.internId} OR c.intern_2_id = ${filters.internId})
        AND c.sprint_id = ${filters.sprintId}
      ORDER BY c.created_at DESC
    `;
    return result as CoffeeChat[];
  }

  if (filters?.internId) {
    const result = await sql`
      SELECT c.*,
        i1.name as intern_1_name, i1.avatar_url as intern_1_avatar, i1.location as intern_1_location, i1.timezone as intern_1_timezone,
        i2.name as intern_2_name, i2.avatar_url as intern_2_avatar, i2.location as intern_2_location, i2.timezone as intern_2_timezone,
        s.name as sprint_name
      FROM coffee_chats c
      JOIN interns i1 ON c.intern_1_id = i1.id
      JOIN interns i2 ON c.intern_2_id = i2.id
      LEFT JOIN sprints s ON c.sprint_id = s.id
      WHERE c.intern_1_id = ${filters.internId} OR c.intern_2_id = ${filters.internId}
      ORDER BY c.created_at DESC
    `;
    return result as CoffeeChat[];
  }

  if (filters?.sprintId) {
    const result = await sql`
      SELECT c.*,
        i1.name as intern_1_name, i1.avatar_url as intern_1_avatar, i1.location as intern_1_location, i1.timezone as intern_1_timezone,
        i2.name as intern_2_name, i2.avatar_url as intern_2_avatar, i2.location as intern_2_location, i2.timezone as intern_2_timezone,
        s.name as sprint_name
      FROM coffee_chats c
      JOIN interns i1 ON c.intern_1_id = i1.id
      JOIN interns i2 ON c.intern_2_id = i2.id
      LEFT JOIN sprints s ON c.sprint_id = s.id
      WHERE c.sprint_id = ${filters.sprintId}
      ORDER BY c.created_at DESC
    `;
    return result as CoffeeChat[];
  }

  const result = await sql`
    SELECT c.*,
      i1.name as intern_1_name, i1.avatar_url as intern_1_avatar, i1.location as intern_1_location, i1.timezone as intern_1_timezone,
      i2.name as intern_2_name, i2.avatar_url as intern_2_avatar, i2.location as intern_2_location, i2.timezone as intern_2_timezone,
      s.name as sprint_name
    FROM coffee_chats c
    JOIN interns i1 ON c.intern_1_id = i1.id
    JOIN interns i2 ON c.intern_2_id = i2.id
    LEFT JOIN sprints s ON c.sprint_id = s.id
    ORDER BY c.created_at DESC
  `;
  return result as CoffeeChat[];
}

export async function generateCoffeeChatPairings(sprintId: number): Promise<CoffeeChat[]> {
  const interns = await getInterns();

  // Get recent pairings to avoid repeats
  const recentPairings = await sql`
    SELECT intern_1_id, intern_2_id
    FROM coffee_chats
    WHERE sprint_id IN (
      SELECT id FROM sprints ORDER BY start_date DESC LIMIT 3
    )
  `;

  const recentPairs = new Set(
    (recentPairings as { intern_1_id: number; intern_2_id: number }[]).map((p) =>
      `${Math.min(p.intern_1_id, p.intern_2_id)}-${Math.max(p.intern_1_id, p.intern_2_id)}`
    )
  );

  // Shuffle interns
  const shuffled = [...interns].sort(() => Math.random() - 0.5);
  const pairs: { intern_1_id: number; intern_2_id: number }[] = [];

  // Create pairs avoiding recent matches
  for (let i = 0; i < shuffled.length - 1; i += 2) {
    const id1 = shuffled[i].id;
    const id2 = shuffled[i + 1].id;
    const pairKey = `${Math.min(id1, id2)}-${Math.max(id1, id2)}`;

    // Try to avoid recent pairs, but if we must, allow it
    pairs.push({ intern_1_id: id1, intern_2_id: id2 });
  }

  // Handle odd number - create a trio
  if (shuffled.length % 2 !== 0) {
    const lastIntern = shuffled[shuffled.length - 1];
    if (pairs.length > 0) {
      // Add the odd person to the first pair
      pairs.push({ intern_1_id: lastIntern.id, intern_2_id: pairs[0].intern_1_id });
    }
  }

  // Delete existing pairings for this sprint
  await sql`DELETE FROM coffee_chats WHERE sprint_id = ${sprintId}`;

  // Insert new pairings
  const results: CoffeeChat[] = [];
  for (const pair of pairs) {
    const result = await sql`
      INSERT INTO coffee_chats (intern_1_id, intern_2_id, sprint_id, status)
      VALUES (${pair.intern_1_id}, ${pair.intern_2_id}, ${sprintId}, 'pending')
      RETURNING *
    `;
    results.push(result[0] as CoffeeChat);
  }

  return results;
}

export async function updateCoffeeChatStatus(
  id: number,
  status: CoffeeChatStatus,
  notes?: string
): Promise<CoffeeChat> {
  const result = await sql`
    UPDATE coffee_chats
    SET
      status = ${status},
      completed_at = ${status === 'completed' ? new Date().toISOString() : null},
      notes = ${notes || null}
    WHERE id = ${id}
    RETURNING *
  `;
  return result[0] as CoffeeChat;
}

// ==========================================
// TASKS (Sprint Project Board)
// ==========================================

export async function getTasks(filters?: {
  sprintId?: number;
  assigneeId?: number;
  status?: TaskStatus;
}): Promise<Task[]> {
  let query = sql`
    SELECT t.*,
      a.name as assignee_name, a.avatar_url as assignee_avatar,
      c.name as created_by_name,
      s.name as sprint_name
    FROM tasks t
    LEFT JOIN interns a ON t.assignee_id = a.id
    LEFT JOIN interns c ON t.created_by_id = c.id
    LEFT JOIN sprints s ON t.sprint_id = s.id
    WHERE t.parent_task_id IS NULL
  `;

  if (filters?.sprintId) {
    query = sql`
      SELECT t.*,
        a.name as assignee_name, a.avatar_url as assignee_avatar,
        c.name as created_by_name,
        s.name as sprint_name
      FROM tasks t
      LEFT JOIN interns a ON t.assignee_id = a.id
      LEFT JOIN interns c ON t.created_by_id = c.id
      LEFT JOIN sprints s ON t.sprint_id = s.id
      WHERE t.parent_task_id IS NULL AND t.sprint_id = ${filters.sprintId}
      ORDER BY t.position, t.created_at DESC
    `;
  } else if (filters?.assigneeId) {
    query = sql`
      SELECT t.*,
        a.name as assignee_name, a.avatar_url as assignee_avatar,
        c.name as created_by_name,
        s.name as sprint_name
      FROM tasks t
      LEFT JOIN interns a ON t.assignee_id = a.id
      LEFT JOIN interns c ON t.created_by_id = c.id
      LEFT JOIN sprints s ON t.sprint_id = s.id
      WHERE t.parent_task_id IS NULL AND t.assignee_id = ${filters.assigneeId}
      ORDER BY t.position, t.created_at DESC
    `;
  } else if (filters?.status) {
    query = sql`
      SELECT t.*,
        a.name as assignee_name, a.avatar_url as assignee_avatar,
        c.name as created_by_name,
        s.name as sprint_name
      FROM tasks t
      LEFT JOIN interns a ON t.assignee_id = a.id
      LEFT JOIN interns c ON t.created_by_id = c.id
      LEFT JOIN sprints s ON t.sprint_id = s.id
      WHERE t.parent_task_id IS NULL AND t.status = ${filters.status}
      ORDER BY t.position, t.created_at DESC
    `;
  } else {
    query = sql`
      SELECT t.*,
        a.name as assignee_name, a.avatar_url as assignee_avatar,
        c.name as created_by_name,
        s.name as sprint_name
      FROM tasks t
      LEFT JOIN interns a ON t.assignee_id = a.id
      LEFT JOIN interns c ON t.created_by_id = c.id
      LEFT JOIN sprints s ON t.sprint_id = s.id
      WHERE t.parent_task_id IS NULL
      ORDER BY t.position, t.created_at DESC
    `;
  }

  return query as unknown as Task[];
}

export async function getTaskById(id: number): Promise<Task | null> {
  const result = await sql`
    SELECT t.*,
      a.name as assignee_name, a.avatar_url as assignee_avatar,
      c.name as created_by_name,
      s.name as sprint_name
    FROM tasks t
    LEFT JOIN interns a ON t.assignee_id = a.id
    LEFT JOIN interns c ON t.created_by_id = c.id
    LEFT JOIN sprints s ON t.sprint_id = s.id
    WHERE t.id = ${id}
  `;

  if (!result[0]) return null;

  const task = result[0] as Task;

  // Get subtasks
  const subtasks = await sql`
    SELECT * FROM tasks WHERE parent_task_id = ${id} ORDER BY position
  `;
  task.subtasks = subtasks as Task[];

  // Get comments
  const comments = await sql`
    SELECT tc.*, i.name as intern_name, i.avatar_url as intern_avatar
    FROM task_comments tc
    JOIN interns i ON tc.intern_id = i.id
    WHERE tc.task_id = ${id}
    ORDER BY tc.created_at ASC
  `;
  task.comments = comments as TaskComment[];

  return task;
}

export async function createTask(data: {
  sprintId: number;
  title: string;
  description?: string;
  priority?: TaskPriority;
  assigneeId?: number;
  createdById?: number;
  dueDate?: string;
  estimatedHours?: number;
  parentTaskId?: number;
}): Promise<Task> {
  // Get max position
  const posResult = await sql`
    SELECT COALESCE(MAX(position), 0) + 1 as next_pos
    FROM tasks
    WHERE sprint_id = ${data.sprintId} AND parent_task_id IS NULL
  `;
  const position = posResult[0].next_pos;

  const result = await sql`
    INSERT INTO tasks (
      sprint_id, title, description, priority, assignee_id, created_by_id,
      due_date, estimated_hours, parent_task_id, position
    )
    VALUES (
      ${data.sprintId}, ${data.title}, ${data.description || null},
      ${data.priority || 'medium'}, ${data.assigneeId || null}, ${data.createdById || null},
      ${data.dueDate || null}, ${data.estimatedHours || null}, ${data.parentTaskId || null},
      ${position}
    )
    RETURNING *
  `;
  return result[0] as Task;
}

export async function updateTask(
  id: number,
  data: Partial<Pick<Task, 'title' | 'description' | 'status' | 'priority' | 'assignee_id' | 'due_date' | 'estimated_hours' | 'actual_hours' | 'position'>>
): Promise<Task> {
  const result = await sql`
    UPDATE tasks
    SET
      title = COALESCE(${data.title ?? null}, title),
      description = COALESCE(${data.description ?? null}, description),
      status = COALESCE(${data.status ?? null}, status),
      priority = COALESCE(${data.priority ?? null}, priority),
      assignee_id = COALESCE(${data.assignee_id ?? null}, assignee_id),
      due_date = COALESCE(${data.due_date ?? null}, due_date),
      estimated_hours = COALESCE(${data.estimated_hours ?? null}, estimated_hours),
      actual_hours = COALESCE(${data.actual_hours ?? null}, actual_hours),
      position = COALESCE(${data.position ?? null}, position),
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `;
  return result[0] as Task;
}

export async function updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
  const result = await sql`
    UPDATE tasks
    SET status = ${status}, updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `;
  return result[0] as Task;
}

export async function deleteTask(id: number): Promise<void> {
  await sql`DELETE FROM tasks WHERE id = ${id}`;
}

// ==========================================
// TASK COMMENTS
// ==========================================

export async function addTaskComment(data: {
  taskId: number;
  internId: number;
  content: string;
}): Promise<TaskComment> {
  const result = await sql`
    INSERT INTO task_comments (task_id, intern_id, content)
    VALUES (${data.taskId}, ${data.internId}, ${data.content})
    RETURNING *
  `;
  return result[0] as TaskComment;
}

export async function getTaskComments(taskId: number): Promise<TaskComment[]> {
  const result = await sql`
    SELECT tc.*, i.name as intern_name, i.avatar_url as intern_avatar
    FROM task_comments tc
    JOIN interns i ON tc.intern_id = i.id
    WHERE tc.task_id = ${taskId}
    ORDER BY tc.created_at ASC
  `;
  return result as TaskComment[];
}

// ==========================================
// INTERN PROGRESS (Dashboard)
// ==========================================

export async function getInternProgress(internId: number): Promise<InternProgress | null> {
  const intern = await getInternById(internId);
  if (!intern) return null;

  // Get total submissions
  const subCountResult = await sql`
    SELECT COUNT(*) as count FROM submissions WHERE intern_id = ${internId}
  `;
  const totalSubmissions = Number(subCountResult[0].count);

  // Get high fives received
  const hfCountResult = await sql`
    SELECT COUNT(*) as count FROM high_fives WHERE to_intern_id = ${internId}
  `;
  const highFivesReceived = Number(hfCountResult[0].count);

  // Get average mood
  const moodResult = await sql`
    SELECT AVG(mood) as avg FROM submissions WHERE intern_id = ${internId} AND mood IS NOT NULL
  `;
  const averageMood = moodResult[0]?.avg ? Number(moodResult[0].avg) : null;

  // Get tasks completed
  const tasksResult = await sql`
    SELECT COUNT(*) as count FROM tasks WHERE assignee_id = ${internId} AND status = 'done'
  `;
  const tasksCompleted = Number(tasksResult[0].count);

  // Get submission history
  const sprints = await getSprints();
  const submissions = await getSubmissions({ internId });
  const submissionMap = new Map(
    submissions.map(s => [s.sprint_id, s.submitted_at])
  );

  const submissionHistory = sprints.map(sprint => ({
    sprint,
    submitted: submissionMap.has(sprint.id),
    submittedAt: submissionMap.get(sprint.id) || null,
  }));

  // Calculate streak
  let currentStreak = 0;
  for (const sh of submissionHistory) {
    if (sh.submitted) {
      currentStreak++;
    } else {
      break;
    }
  }

  // Get recent high fives
  const recentHighFives = await getHighFives({ toInternId: internId, limit: 5 });

  return {
    intern,
    totalSubmissions,
    currentStreak,
    highFivesReceived,
    averageMood,
    tasksCompleted,
    submissionHistory,
    recentHighFives,
  };
}
