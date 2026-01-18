import { createClient } from './server';
import type {
  Profile,
  Team,
  TeamMember,
  Sprint,
  Submission,
  HighFive,
  HighFiveCategory,
  OneOnOneNote,
  KanbanColumn,
  KanbanTask,
  TaskPriority,
  CoffeeChat,
  CoffeeChatStatus,
  DashboardStats,
  SubmissionStatus,
  MemberProgress,
} from '../types';

// ==========================================
// PROFILES
// ==========================================

export async function getProfiles(): Promise<Profile[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('full_name');

  if (error) throw error;
  return data || [];
}

export async function getProfileById(id: string): Promise<Profile | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function getProfileByEmail(email: string): Promise<Profile | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('email', email)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function createProfile(data: {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  role?: 'intern' | 'manager' | 'admin';
}): Promise<Profile> {
  const supabase = await createClient();
  const { data: profile, error } = await supabase
    .from('profiles')
    .insert({
      id: data.id,
      email: data.email,
      full_name: data.fullName,
      avatar_url: data.avatarUrl || null,
      role: data.role || 'intern',
    })
    .select()
    .single();

  if (error) throw error;
  return profile;
}

export async function updateProfile(
  id: string,
  data: Partial<Pick<Profile, 'full_name' | 'avatar_url' | 'timezone' | 'location' | 'linkedin_url' | 'role'>>
): Promise<Profile> {
  const supabase = await createClient();
  const { data: profile, error } = await supabase
    .from('profiles')
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return profile;
}

// ==========================================
// TEAMS
// ==========================================

export async function getTeams(): Promise<Team[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('teams')
    .select('*')
    .order('name');

  if (error) throw error;
  return data || [];
}

export async function getTeamById(id: string): Promise<Team | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('teams')
    .select('*')
    .eq('id', id)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function getTeamBySlug(slug: string): Promise<Team | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('teams')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function createTeam(data: {
  organizationId: string;
  name: string;
  slug: string;
}): Promise<Team> {
  const supabase = await createClient();
  const { data: team, error } = await supabase
    .from('teams')
    .insert({
      organization_id: data.organizationId,
      name: data.name,
      slug: data.slug,
    })
    .select()
    .single();

  if (error) throw error;
  return team;
}

// ==========================================
// TEAM MEMBERS
// ==========================================

export async function getTeamMembers(teamId: string): Promise<TeamMember[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('team_members')
    .select(`
      *,
      profile:profiles(*)
    `)
    .eq('team_id', teamId)
    .order('joined_at');

  if (error) throw error;
  return data || [];
}

export async function getTeamMember(teamId: string, profileId: string): Promise<TeamMember | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('team_members')
    .select(`
      *,
      profile:profiles(*)
    `)
    .eq('team_id', teamId)
    .eq('profile_id', profileId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function addTeamMember(data: {
  teamId: string;
  profileId: string;
  role?: 'member' | 'lead' | 'admin';
}): Promise<TeamMember> {
  const supabase = await createClient();
  const { data: member, error } = await supabase
    .from('team_members')
    .insert({
      team_id: data.teamId,
      profile_id: data.profileId,
      role: data.role || 'member',
    })
    .select()
    .single();

  if (error) throw error;
  return member;
}

export async function removeTeamMember(teamId: string, profileId: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('team_members')
    .delete()
    .eq('team_id', teamId)
    .eq('profile_id', profileId);

  if (error) throw error;
}

export async function updateTeamMemberRole(
  teamId: string,
  profileId: string,
  role: 'member' | 'lead' | 'admin'
): Promise<TeamMember> {
  const supabase = await createClient();
  const { data: member, error } = await supabase
    .from('team_members')
    .update({ role })
    .eq('team_id', teamId)
    .eq('profile_id', profileId)
    .select()
    .single();

  if (error) throw error;
  return member;
}

// ==========================================
// SPRINTS
// ==========================================

export async function getSprints(teamId: string): Promise<Sprint[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('sprints')
    .select('*')
    .eq('team_id', teamId)
    .order('start_date', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getSprintById(id: string): Promise<Sprint | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('sprints')
    .select('*')
    .eq('id', id)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function getActiveSprint(teamId: string): Promise<Sprint | null> {
  const supabase = await createClient();

  // First try to get active sprint
  const { data: activeSprint, error: activeError } = await supabase
    .from('sprints')
    .select('*')
    .eq('team_id', teamId)
    .eq('is_active', true)
    .single();

  if (!activeError && activeSprint) return activeSprint;

  // Fallback to most recent sprint
  const { data: recentSprint, error: recentError } = await supabase
    .from('sprints')
    .select('*')
    .eq('team_id', teamId)
    .order('start_date', { ascending: false })
    .limit(1)
    .single();

  if (recentError && recentError.code !== 'PGRST116') throw recentError;
  return recentSprint;
}

export async function createSprint(data: {
  teamId: string;
  name: string;
  startDate: string;
  endDate: string;
}): Promise<Sprint> {
  const supabase = await createClient();
  const { data: sprint, error } = await supabase
    .from('sprints')
    .insert({
      team_id: data.teamId,
      name: data.name,
      start_date: data.startDate,
      end_date: data.endDate,
      is_active: false,
    })
    .select()
    .single();

  if (error) throw error;
  return sprint;
}

export async function setActiveSprint(teamId: string, sprintId: string): Promise<Sprint> {
  const supabase = await createClient();

  // Deactivate all sprints for this team
  await supabase
    .from('sprints')
    .update({ is_active: false })
    .eq('team_id', teamId);

  // Activate the selected sprint
  const { data: sprint, error } = await supabase
    .from('sprints')
    .update({ is_active: true })
    .eq('id', sprintId)
    .select()
    .single();

  if (error) throw error;
  return sprint;
}

// ==========================================
// SUBMISSIONS
// ==========================================

export async function getSubmissions(filters?: {
  teamId?: string;
  sprintId?: string;
  profileId?: string;
}): Promise<Submission[]> {
  const supabase = await createClient();
  let query = supabase
    .from('submissions')
    .select(`
      *,
      profile:profiles(*),
      sprint:sprints(*)
    `)
    .order('created_at', { ascending: false });

  if (filters?.sprintId) {
    query = query.eq('sprint_id', filters.sprintId);
  }
  if (filters?.profileId) {
    query = query.eq('profile_id', filters.profileId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function getSubmissionById(id: string): Promise<Submission | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('submissions')
    .select(`
      *,
      profile:profiles(*),
      sprint:sprints(*)
    `)
    .eq('id', id)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function createSubmission(data: {
  sprintId: string;
  profileId: string;
  goals: string;
  deliverables: string;
  blockers?: string;
  reflection?: string;
  mood?: 'great' | 'good' | 'okay' | 'struggling';
  hoursWorked?: number;
}): Promise<Submission> {
  const supabase = await createClient();
  const { data: submission, error } = await supabase
    .from('submissions')
    .upsert({
      sprint_id: data.sprintId,
      profile_id: data.profileId,
      goals: data.goals,
      deliverables: data.deliverables,
      blockers: data.blockers || null,
      reflection: data.reflection || null,
      mood: data.mood || null,
      hours_worked: data.hoursWorked || null,
      updated_at: new Date().toISOString(),
    }, {
      onConflict: 'sprint_id,profile_id',
    })
    .select()
    .single();

  if (error) throw error;
  return submission;
}

export async function updateSubmission(
  id: string,
  data: Partial<Pick<Submission, 'goals' | 'deliverables' | 'blockers' | 'reflection' | 'mood' | 'hours_worked'>>
): Promise<Submission> {
  const supabase = await createClient();
  const { data: submission, error } = await supabase
    .from('submissions')
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return submission;
}

// ==========================================
// SUBMISSION STATUS
// ==========================================

export async function getSubmissionStatus(teamId: string, sprintId: string): Promise<SubmissionStatus[]> {
  const members = await getTeamMembers(teamId);
  const submissions = await getSubmissions({ sprintId });

  const submissionMap = new Map(
    submissions.map(s => [s.profile_id, s.created_at])
  );

  return members.map(member => ({
    profile: member.profile!,
    hasSubmitted: submissionMap.has(member.profile_id),
    submittedAt: submissionMap.get(member.profile_id) || null,
  }));
}

export async function getMissingSubmissions(teamId: string, sprintId: string): Promise<Profile[]> {
  const status = await getSubmissionStatus(teamId, sprintId);
  return status
    .filter(s => !s.hasSubmitted)
    .map(s => s.profile);
}

// ==========================================
// HIGH FIVES
// ==========================================

export async function getHighFives(filters?: {
  teamId?: string;
  toProfileId?: string;
  fromProfileId?: string;
  sprintId?: string;
  limit?: number;
}): Promise<HighFive[]> {
  const supabase = await createClient();
  let query = supabase
    .from('high_fives')
    .select(`
      *,
      from_profile:profiles!high_fives_from_profile_id_fkey(*),
      to_profile:profiles!high_fives_to_profile_id_fkey(*)
    `)
    .order('created_at', { ascending: false });

  if (filters?.teamId) {
    query = query.eq('team_id', filters.teamId);
  }
  if (filters?.toProfileId) {
    query = query.eq('to_profile_id', filters.toProfileId);
  }
  if (filters?.fromProfileId) {
    query = query.eq('from_profile_id', filters.fromProfileId);
  }
  if (filters?.sprintId) {
    query = query.eq('sprint_id', filters.sprintId);
  }
  if (filters?.limit) {
    query = query.limit(filters.limit);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function createHighFive(data: {
  teamId: string;
  fromProfileId: string;
  toProfileId: string;
  message: string;
  category?: HighFiveCategory;
  sprintId?: string;
}): Promise<HighFive> {
  const supabase = await createClient();
  const { data: highFive, error } = await supabase
    .from('high_fives')
    .insert({
      team_id: data.teamId,
      from_profile_id: data.fromProfileId,
      to_profile_id: data.toProfileId,
      message: data.message,
      category: data.category || null,
      sprint_id: data.sprintId || null,
    })
    .select()
    .single();

  if (error) throw error;
  return highFive;
}

export async function getHighFiveCount(profileId: string): Promise<number> {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from('high_fives')
    .select('*', { count: 'exact', head: true })
    .eq('to_profile_id', profileId);

  if (error) throw error;
  return count || 0;
}

// ==========================================
// ONE-ON-ONE NOTES
// ==========================================

export async function getOneOnOneNotes(filters?: {
  teamId?: string;
  profileId?: string;
  sprintId?: string;
}): Promise<OneOnOneNote[]> {
  const supabase = await createClient();
  let query = supabase
    .from('one_on_one_notes')
    .select(`
      *,
      profile:profiles(*),
      sprint:sprints(*)
    `)
    .order('created_at', { ascending: false });

  if (filters?.teamId) {
    query = query.eq('team_id', filters.teamId);
  }
  if (filters?.profileId) {
    query = query.eq('profile_id', filters.profileId);
  }
  if (filters?.sprintId) {
    query = query.eq('sprint_id', filters.sprintId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function getOneOnOneNoteById(id: string): Promise<OneOnOneNote | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('one_on_one_notes')
    .select(`
      *,
      profile:profiles(*),
      sprint:sprints(*)
    `)
    .eq('id', id)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function getOrCreateOneOnOneNote(
  teamId: string,
  profileId: string,
  sprintId: string
): Promise<OneOnOneNote> {
  const supabase = await createClient();

  // Check if exists
  const { data: existing } = await supabase
    .from('one_on_one_notes')
    .select('*')
    .eq('team_id', teamId)
    .eq('profile_id', profileId)
    .eq('sprint_id', sprintId)
    .single();

  if (existing) return existing;

  // Create new
  const { data: note, error } = await supabase
    .from('one_on_one_notes')
    .insert({
      team_id: teamId,
      profile_id: profileId,
      sprint_id: sprintId,
      wins: '',
      challenges: '',
      discussion_topics: '',
      is_private: false,
    })
    .select()
    .single();

  if (error) throw error;
  return note;
}

export async function updateOneOnOneNote(
  id: string,
  data: Partial<Pick<OneOnOneNote, 'wins' | 'challenges' | 'discussion_topics' | 'action_items' | 'manager_notes' | 'is_private'>>
): Promise<OneOnOneNote> {
  const supabase = await createClient();
  const { data: note, error } = await supabase
    .from('one_on_one_notes')
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return note;
}

// ==========================================
// KANBAN COLUMNS
// ==========================================

export async function getKanbanColumns(teamId: string): Promise<KanbanColumn[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('kanban_columns')
    .select('*')
    .eq('team_id', teamId)
    .order('position');

  if (error) throw error;
  return data || [];
}

export async function createKanbanColumn(data: {
  teamId: string;
  name: string;
  color?: string;
}): Promise<KanbanColumn> {
  const supabase = await createClient();

  // Get max position
  const { data: columns } = await supabase
    .from('kanban_columns')
    .select('position')
    .eq('team_id', data.teamId)
    .order('position', { ascending: false })
    .limit(1);

  const maxPosition = columns?.[0]?.position || 0;

  const { data: column, error } = await supabase
    .from('kanban_columns')
    .insert({
      team_id: data.teamId,
      name: data.name,
      color: data.color || null,
      position: maxPosition + 1,
    })
    .select()
    .single();

  if (error) throw error;
  return column;
}

export async function updateKanbanColumn(
  id: string,
  data: Partial<Pick<KanbanColumn, 'name' | 'color' | 'position'>>
): Promise<KanbanColumn> {
  const supabase = await createClient();
  const { data: column, error } = await supabase
    .from('kanban_columns')
    .update(data)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return column;
}

export async function deleteKanbanColumn(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('kanban_columns')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// ==========================================
// KANBAN TASKS
// ==========================================

export async function getKanbanTasks(filters?: {
  teamId?: string;
  columnId?: string;
  assigneeId?: string;
}): Promise<KanbanTask[]> {
  const supabase = await createClient();
  let query = supabase
    .from('kanban_tasks')
    .select(`
      *,
      assignee:profiles(*),
      column:kanban_columns(*)
    `)
    .order('position');

  if (filters?.teamId) {
    query = query.eq('team_id', filters.teamId);
  }
  if (filters?.columnId) {
    query = query.eq('column_id', filters.columnId);
  }
  if (filters?.assigneeId) {
    query = query.eq('assignee_id', filters.assigneeId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function getKanbanTaskById(id: string): Promise<KanbanTask | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('kanban_tasks')
    .select(`
      *,
      assignee:profiles(*),
      column:kanban_columns(*)
    `)
    .eq('id', id)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function createKanbanTask(data: {
  teamId: string;
  columnId: string;
  title: string;
  description?: string;
  assigneeId?: string;
  dueDate?: string;
  priority?: TaskPriority;
  labels?: string[];
}): Promise<KanbanTask> {
  const supabase = await createClient();

  // Get max position in column
  const { data: tasks } = await supabase
    .from('kanban_tasks')
    .select('position')
    .eq('column_id', data.columnId)
    .order('position', { ascending: false })
    .limit(1);

  const maxPosition = tasks?.[0]?.position || 0;

  const { data: task, error } = await supabase
    .from('kanban_tasks')
    .insert({
      team_id: data.teamId,
      column_id: data.columnId,
      title: data.title,
      description: data.description || null,
      assignee_id: data.assigneeId || null,
      due_date: data.dueDate || null,
      priority: data.priority || 'medium',
      labels: data.labels || [],
      position: maxPosition + 1,
    })
    .select()
    .single();

  if (error) throw error;
  return task;
}

export async function updateKanbanTask(
  id: string,
  data: Partial<Pick<KanbanTask, 'title' | 'description' | 'column_id' | 'assignee_id' | 'due_date' | 'priority' | 'labels' | 'position'>>
): Promise<KanbanTask> {
  const supabase = await createClient();
  const { data: task, error } = await supabase
    .from('kanban_tasks')
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return task;
}

export async function moveKanbanTask(
  id: string,
  columnId: string,
  position: number
): Promise<KanbanTask> {
  const supabase = await createClient();
  const { data: task, error } = await supabase
    .from('kanban_tasks')
    .update({
      column_id: columnId,
      position: position,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return task;
}

export async function deleteKanbanTask(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('kanban_tasks')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// ==========================================
// COFFEE CHATS
// ==========================================

export async function getCoffeeChats(filters?: {
  teamId?: string;
  profileId?: string;
}): Promise<CoffeeChat[]> {
  const supabase = await createClient();
  let query = supabase
    .from('coffee_chats')
    .select(`
      *,
      profile1:profiles!coffee_chats_profile1_id_fkey(*),
      profile2:profiles!coffee_chats_profile2_id_fkey(*)
    `)
    .order('created_at', { ascending: false });

  if (filters?.teamId) {
    query = query.eq('team_id', filters.teamId);
  }
  if (filters?.profileId) {
    query = query.or(`profile1_id.eq.${filters.profileId},profile2_id.eq.${filters.profileId}`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function createCoffeeChat(data: {
  teamId: string;
  profile1Id: string;
  profile2Id: string;
}): Promise<CoffeeChat> {
  const supabase = await createClient();
  const { data: chat, error } = await supabase
    .from('coffee_chats')
    .insert({
      team_id: data.teamId,
      profile1_id: data.profile1Id,
      profile2_id: data.profile2Id,
      status: 'pending',
    })
    .select()
    .single();

  if (error) throw error;
  return chat;
}

export async function updateCoffeeChatStatus(
  id: string,
  status: CoffeeChatStatus,
  notes?: string
): Promise<CoffeeChat> {
  const supabase = await createClient();
  const { data: chat, error } = await supabase
    .from('coffee_chats')
    .update({
      status,
      notes: notes || null,
      completed_at: status === 'completed' ? new Date().toISOString() : null,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return chat;
}

export async function generateCoffeeChatPairings(teamId: string): Promise<CoffeeChat[]> {
  const members = await getTeamMembers(teamId);

  // Get recent pairings to avoid repeats
  const recentChats = await getCoffeeChats({ teamId });
  const recentPairs = new Set(
    recentChats.slice(0, members.length * 2).map(c =>
      `${[c.profile1_id, c.profile2_id].sort().join('-')}`
    )
  );

  // Shuffle members
  const shuffled = [...members].sort(() => Math.random() - 0.5);
  const pairs: { profile1_id: string; profile2_id: string }[] = [];

  // Create pairs avoiding recent matches when possible
  for (let i = 0; i < shuffled.length - 1; i += 2) {
    const id1 = shuffled[i].profile_id;
    const id2 = shuffled[i + 1].profile_id;
    pairs.push({ profile1_id: id1, profile2_id: id2 });
  }

  // Handle odd number - add last person to first pair
  if (shuffled.length % 2 !== 0 && pairs.length > 0) {
    const lastPerson = shuffled[shuffled.length - 1];
    pairs.push({ profile1_id: lastPerson.profile_id, profile2_id: pairs[0].profile1_id });
  }

  // Create coffee chats
  const results: CoffeeChat[] = [];
  for (const pair of pairs) {
    const chat = await createCoffeeChat({
      teamId,
      profile1Id: pair.profile1_id,
      profile2Id: pair.profile2_id,
    });
    results.push(chat);
  }

  return results;
}

// ==========================================
// DASHBOARD STATS
// ==========================================

export async function getDashboardStats(teamId: string, sprintId?: string): Promise<DashboardStats> {
  const supabase = await createClient();

  // Get team member count
  const { count: totalMembers } = await supabase
    .from('team_members')
    .select('*', { count: 'exact', head: true })
    .eq('team_id', teamId);

  let submittedThisSprint = 0;
  let totalSubmissions = 0;

  if (sprintId) {
    // Get submissions for this sprint
    const { count: sprintSubmissions } = await supabase
      .from('submissions')
      .select('*', { count: 'exact', head: true })
      .eq('sprint_id', sprintId);

    submittedThisSprint = sprintSubmissions || 0;
    totalSubmissions = sprintSubmissions || 0;
  } else {
    // Get all submissions count for team (through sprints)
    const { data: sprints } = await supabase
      .from('sprints')
      .select('id')
      .eq('team_id', teamId);

    if (sprints && sprints.length > 0) {
      const sprintIds = sprints.map(s => s.id);
      const { count } = await supabase
        .from('submissions')
        .select('*', { count: 'exact', head: true })
        .in('sprint_id', sprintIds);

      totalSubmissions = count || 0;
    }
  }

  // High fives count for team
  const { count: highFivesGiven } = await supabase
    .from('high_fives')
    .select('*', { count: 'exact', head: true })
    .eq('team_id', teamId);

  // Tasks completed (done column)
  const { data: doneColumns } = await supabase
    .from('kanban_columns')
    .select('id')
    .eq('team_id', teamId)
    .ilike('name', '%done%');

  let tasksCompleted = 0;
  if (doneColumns && doneColumns.length > 0) {
    const doneColumnIds = doneColumns.map(c => c.id);
    const { count } = await supabase
      .from('kanban_tasks')
      .select('*', { count: 'exact', head: true })
      .in('column_id', doneColumnIds);

    tasksCompleted = count || 0;
  }

  // Average mood (convert text to numeric)
  const moodMap: Record<string, number> = {
    'great': 5,
    'good': 4,
    'okay': 3,
    'struggling': 2,
  };

  let averageMood: number | null = null;
  if (sprintId) {
    const { data: submissions } = await supabase
      .from('submissions')
      .select('mood')
      .eq('sprint_id', sprintId)
      .not('mood', 'is', null);

    if (submissions && submissions.length > 0) {
      const moodValues = submissions
        .map(s => moodMap[s.mood as string])
        .filter(v => v !== undefined);

      if (moodValues.length > 0) {
        averageMood = moodValues.reduce((a, b) => a + b, 0) / moodValues.length;
      }
    }
  }

  return {
    totalMembers: totalMembers || 0,
    submittedThisSprint,
    missingSubmissions: (totalMembers || 0) - submittedThisSprint,
    totalSubmissions,
    highFivesGiven: highFivesGiven || 0,
    tasksCompleted,
    averageMood,
  };
}

// ==========================================
// MEMBER PROGRESS
// ==========================================

export async function getMemberProgress(
  teamId: string,
  profileId: string
): Promise<MemberProgress | null> {
  const profile = await getProfileById(profileId);
  if (!profile) return null;

  const supabase = await createClient();

  // Get total submissions
  const { count: totalSubmissions } = await supabase
    .from('submissions')
    .select('*', { count: 'exact', head: true })
    .eq('profile_id', profileId);

  // Get high fives received
  const { count: highFivesReceived } = await supabase
    .from('high_fives')
    .select('*', { count: 'exact', head: true })
    .eq('to_profile_id', profileId);

  // Get tasks completed
  const { data: doneColumns } = await supabase
    .from('kanban_columns')
    .select('id')
    .eq('team_id', teamId)
    .ilike('name', '%done%');

  let tasksCompleted = 0;
  if (doneColumns && doneColumns.length > 0) {
    const doneColumnIds = doneColumns.map(c => c.id);
    const { count } = await supabase
      .from('kanban_tasks')
      .select('*', { count: 'exact', head: true })
      .eq('assignee_id', profileId)
      .in('column_id', doneColumnIds);

    tasksCompleted = count || 0;
  }

  // Get submission history
  const sprints = await getSprints(teamId);
  const submissions = await getSubmissions({ profileId });
  const submissionMap = new Map(
    submissions.map(s => [s.sprint_id, s.created_at])
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

  // Calculate average mood
  const moodMap: Record<string, number> = {
    'great': 5,
    'good': 4,
    'okay': 3,
    'struggling': 2,
  };

  const moodValues = submissions
    .map(s => s.mood ? moodMap[s.mood] : undefined)
    .filter((v): v is number => v !== undefined);

  const averageMood = moodValues.length > 0
    ? moodValues.reduce((a, b) => a + b, 0) / moodValues.length
    : null;

  // Get recent high fives
  const recentHighFives = await getHighFives({ toProfileId: profileId, limit: 5 });

  return {
    profile,
    totalSubmissions: totalSubmissions || 0,
    currentStreak,
    highFivesReceived: highFivesReceived || 0,
    averageMood,
    tasksCompleted,
    submissionHistory,
    recentHighFives,
  };
}

// ==========================================
// CURRENT USER HELPERS
// ==========================================

export async function getCurrentUser(): Promise<Profile | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  return getProfileById(user.id);
}

export async function getCurrentUserTeams(): Promise<Team[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  const { data: memberships } = await supabase
    .from('team_members')
    .select('team_id')
    .eq('profile_id', user.id);

  if (!memberships || memberships.length === 0) return [];

  const teamIds = memberships.map(m => m.team_id);
  const { data: teams } = await supabase
    .from('teams')
    .select('*')
    .in('id', teamIds)
    .order('name');

  return teams || [];
}
