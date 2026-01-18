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

