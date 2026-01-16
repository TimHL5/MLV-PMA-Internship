// ==========================================
// MLV Intern Portal - Type Definitions
// ==========================================

// Core Tables
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

export interface Sprint {
  id: number;
  name: string;
  description: string | null;
  start_date: Date | null;
  end_date: Date | null;
  is_active: boolean;
  created_at: Date;
}

export interface Submission {
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
  // Joined fields
  intern_name?: string;
  sprint_name?: string;
}

// Feature 1: Peer Recognition
export type HighFiveCategory = 'teamwork' | 'creativity' | 'hustle' | 'problem-solving' | 'communication';

export interface HighFive {
  id: number;
  from_intern_id: number;
  to_intern_id: number;
  message: string;
  category: HighFiveCategory | null;
  sprint_id: number | null;
  created_at: Date;
  // Joined fields
  from_intern_name?: string;
  from_intern_avatar?: string | null;
  to_intern_name?: string;
  to_intern_avatar?: string | null;
}

// Feature 3: 1:1 Prep & Notes
export interface OneOnOne {
  id: number;
  intern_id: number;
  sprint_id: number | null;
  scheduled_at: Date | null;
  // Intern prep
  proud_of: string | null;
  need_help: string | null;
  questions: string | null;
  prep_submitted_at: Date | null;
  // Admin notes (private)
  admin_notes: string | null;
  action_items: string | null;
  meeting_completed_at: Date | null;
  created_at: Date;
  updated_at: Date;
  // Joined fields
  intern_name?: string;
  intern_avatar?: string | null;
  sprint_name?: string;
}

// Feature 5: Coffee Chat Matching
export type CoffeeChatStatus = 'pending' | 'completed' | 'skipped';

export interface CoffeeChat {
  id: number;
  intern_1_id: number;
  intern_2_id: number;
  sprint_id: number | null;
  status: CoffeeChatStatus;
  completed_at: Date | null;
  notes: string | null;
  created_at: Date;
  // Joined fields
  intern_1_name?: string;
  intern_1_avatar?: string | null;
  intern_1_location?: string | null;
  intern_1_timezone?: string | null;
  intern_2_name?: string;
  intern_2_avatar?: string | null;
  intern_2_location?: string | null;
  intern_2_timezone?: string | null;
  sprint_name?: string;
}

// Feature 6: Sprint Project Board
export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

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
  // Joined fields
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
  // Joined fields
  intern_name?: string;
  intern_avatar?: string | null;
}

// Dashboard & Stats
export interface DashboardStats {
  totalInterns: number;
  submittedThisSprint: number;
  missingSubmissions: number;
  totalSubmissions: number;
  highFivesGiven: number;
  tasksCompleted: number;
  averageMood: number | null;
}

export interface SubmissionStatus {
  intern: Intern;
  hasSubmitted: boolean;
  submittedAt: Date | null;
}

export interface InternProgress {
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

// API Request/Response types
export interface CreateHighFiveRequest {
  toInternId: number;
  message: string;
  category?: HighFiveCategory;
  sprintId?: number;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assigneeId?: number | null;
  dueDate?: string | null;
  estimatedHours?: number | null;
  actualHours?: number | null;
  position?: number;
}

export interface CreateTaskRequest {
  sprintId: number;
  title: string;
  description?: string;
  priority?: TaskPriority;
  assigneeId?: number;
  dueDate?: string;
  estimatedHours?: number;
  parentTaskId?: number;
}

export interface SubmitOneOnOnePrepRequest {
  proudOf?: string;
  needHelp?: string;
  questions?: string;
}

export interface AddAdminNotesRequest {
  adminNotes?: string;
  actionItems?: string;
  completed?: boolean;
}
