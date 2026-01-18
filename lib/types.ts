// ==========================================
// MLV Intern Portal - Type Definitions (Supabase)
// ==========================================

// Database types for Supabase tables

export interface Organization {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
  created_at: string;
}

export interface Team {
  id: string;
  organization_id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  role: 'intern' | 'manager' | 'admin';
  timezone?: string;
  location?: string;
  linkedin_url?: string;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  team_id: string;
  profile_id: string;
  role: 'member' | 'lead' | 'admin';
  joined_at: string;
  profile?: Profile;
}

export interface Sprint {
  id: string;
  team_id: string;
  name: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_at: string;
}

export interface Submission {
  id: string;
  sprint_id: string;
  profile_id: string;
  goals: string;
  deliverables: string;
  blockers?: string;
  reflection?: string;
  mood?: 'great' | 'good' | 'okay' | 'struggling';
  hours_worked?: number;
  created_at: string;
  updated_at: string;
  profile?: Profile;
  sprint?: Sprint;
}

export type HighFiveCategory = 'teamwork' | 'creativity' | 'hustle' | 'problem-solving' | 'communication';

export interface HighFive {
  id: string;
  team_id: string;
  from_profile_id: string;
  to_profile_id: string;
  message: string;
  category?: HighFiveCategory;
  sprint_id?: string;
  created_at: string;
  from_profile?: Profile;
  to_profile?: Profile;
}

export interface OneOnOneNote {
  id: string;
  team_id: string;
  profile_id: string;
  sprint_id?: string;
  wins: string;
  challenges: string;
  discussion_topics: string;
  action_items?: string;
  manager_notes?: string;
  is_private: boolean;
  created_at: string;
  updated_at: string;
  profile?: Profile;
  sprint?: Sprint;
}

export interface KanbanColumn {
  id: string;
  team_id: string;
  name: string;
  position: number;
  color?: string;
  created_at: string;
}

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface KanbanTask {
  id: string;
  column_id: string;
  team_id: string;
  title: string;
  description?: string;
  assignee_id?: string;
  due_date?: string;
  priority?: TaskPriority;
  labels?: string[];
  position: number;
  created_at: string;
  updated_at: string;
  assignee?: Profile;
  column?: KanbanColumn;
}

export type CoffeeChatStatus = 'pending' | 'scheduled' | 'completed' | 'skipped';

export interface CoffeeChat {
  id: string;
  team_id: string;
  profile1_id: string;
  profile2_id: string;
  status: CoffeeChatStatus;
  scheduled_for?: string;
  completed_at?: string;
  notes?: string;
  created_at: string;
  profile1?: Profile;
  profile2?: Profile;
}

// Context types
export interface AuthContextType {
  user: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

export interface TeamContextType {
  organization: Organization | null;
  team: Team | null;
  members: TeamMember[];
  currentSprint: Sprint | null;
  sprints: Sprint[];
  loading: boolean;
  refetch: () => Promise<void>;
}

// Dashboard & Stats
export interface DashboardStats {
  totalMembers: number;
  submittedThisSprint: number;
  missingSubmissions: number;
  totalSubmissions: number;
  highFivesGiven: number;
  tasksCompleted: number;
  averageMood: number | null;
}

export interface SubmissionStatus {
  profile: Profile;
  hasSubmitted: boolean;
  submittedAt: string | null;
}

export interface MemberProgress {
  profile: Profile;
  totalSubmissions: number;
  currentStreak: number;
  highFivesReceived: number;
  averageMood: number | null;
  tasksCompleted: number;
  submissionHistory: {
    sprint: Sprint;
    submitted: boolean;
    submittedAt: string | null;
  }[];
  recentHighFives: HighFive[];
}

// API Request/Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export interface CreateHighFiveRequest {
  toProfileId: string;
  message: string;
  category?: HighFiveCategory;
  sprintId?: string;
}

export interface CreateSubmissionRequest {
  sprintId: string;
  goals: string;
  deliverables: string;
  blockers?: string;
  reflection?: string;
  mood?: string;
  hoursWorked?: number;
}

export interface CreateTaskRequest {
  columnId: string;
  title: string;
  description?: string;
  priority?: TaskPriority;
  assigneeId?: string;
  dueDate?: string;
  labels?: string[];
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  columnId?: string;
  priority?: TaskPriority;
  assigneeId?: string | null;
  dueDate?: string | null;
  labels?: string[];
  position?: number;
}

export interface CreateOneOnOneRequest {
  sprintId?: string;
  wins: string;
  challenges: string;
  discussionTopics: string;
  actionItems?: string;
}

export interface UpdateOneOnOneRequest {
  wins?: string;
  challenges?: string;
  discussionTopics?: string;
  actionItems?: string;
  managerNotes?: string;
}

// ==========================================
// Legacy Types (for /internal routes with Neon)
// ==========================================

export interface Intern {
  id: number;
  name: string;
  email: string | null;
  avatar_url: string | null;
  location: string | null;
  timezone: string | null;
  role: 'intern' | 'admin';
  created_at: Date;
  updated_at: Date;
}

export interface LegacySprint {
  id: number;
  name: string;
  description: string | null;
  start_date: Date | null;
  end_date: Date | null;
  is_active: boolean;
  created_at: Date;
}

export interface LegacySubmission {
  id: number;
  intern_id: number;
  sprint_id: number;
  goals: string;
  deliverables: string;
  blockers: string | null;
  reflection: string | null;
  mood: number | null;
  hours_worked: number | null;
  submitted_at: Date;
  updated_at: Date;
  intern_name?: string;
  sprint_name?: string;
}

export interface LegacyHighFive {
  id: number;
  from_intern_id: number;
  to_intern_id: number;
  message: string;
  category: HighFiveCategory | null;
  sprint_id: number | null;
  created_at: Date;
  from_intern_name?: string;
  from_intern_avatar?: string | null;
  to_intern_name?: string;
  to_intern_avatar?: string | null;
}

export interface OneOnOne {
  id: number;
  intern_id: number;
  sprint_id: number | null;
  scheduled_at: Date | null;
  proud_of: string | null;
  need_help: string | null;
  questions: string | null;
  prep_submitted_at: Date | null;
  admin_notes: string | null;
  action_items: string | null;
  meeting_completed_at: Date | null;
  created_at: Date;
  updated_at: Date;
  intern_name?: string;
  intern_avatar?: string | null;
  sprint_name?: string;
}

export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';

export interface Task {
  id: number;
  sprint_id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  assignee_id: number | null;
  created_by_id: number | null;
  due_date: Date | null;
  estimated_hours: number | null;
  actual_hours: number | null;
  position: number;
  parent_task_id: number | null;
  created_at: Date;
  updated_at: Date;
  assignee_name?: string;
  assignee_avatar?: string | null;
  created_by_name?: string;
  sprint_name?: string;
  subtasks?: Task[];
  comments?: TaskComment[];
}

export interface TaskComment {
  id: number;
  task_id: number;
  intern_id: number;
  content: string;
  created_at: Date;
  intern_name?: string;
  intern_avatar?: string | null;
}
