// Database Types for MLV Internal Platform
// Generated based on Supabase schema

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string
          name: string
          slug: string
          logo_url: string | null
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          logo_url?: string | null
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          logo_url?: string | null
          description?: string | null
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          timezone: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          timezone?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          timezone?: string
          updated_at?: string
        }
      }
      org_memberships: {
        Row: {
          id: string
          user_id: string
          org_id: string
          role: 'owner' | 'admin' | 'member'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          org_id: string
          role?: 'owner' | 'admin' | 'member'
          created_at?: string
        }
        Update: {
          role?: 'owner' | 'admin' | 'member'
        }
      }
      teams: {
        Row: {
          id: string
          org_id: string
          name: string
          slug: string
          description: string | null
          color: string
          icon: string
          is_archived: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          org_id: string
          name: string
          slug: string
          description?: string | null
          color?: string
          icon?: string
          is_archived?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          slug?: string
          description?: string | null
          color?: string
          icon?: string
          is_archived?: boolean
          updated_at?: string
        }
      }
      team_memberships: {
        Row: {
          id: string
          user_id: string
          team_id: string
          role: 'admin' | 'member'
          joined_at: string
        }
        Insert: {
          id?: string
          user_id: string
          team_id: string
          role?: 'admin' | 'member'
          joined_at?: string
        }
        Update: {
          role?: 'admin' | 'member'
        }
      }
      sprints: {
        Row: {
          id: string
          team_id: string
          name: string
          description: string | null
          start_date: string
          end_date: string
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          team_id: string
          name: string
          description?: string | null
          start_date: string
          end_date: string
          is_active?: boolean
          created_at?: string
        }
        Update: {
          name?: string
          description?: string | null
          start_date?: string
          end_date?: string
          is_active?: boolean
        }
      }
      submissions: {
        Row: {
          id: string
          user_id: string
          team_id: string
          sprint_id: string
          goals: string
          deliverables: string
          blockers: string | null
          reflection: string | null
          mood: number | null
          hours_worked: number | null
          submitted_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          team_id: string
          sprint_id: string
          goals: string
          deliverables: string
          blockers?: string | null
          reflection?: string | null
          mood?: number | null
          hours_worked?: number | null
          submitted_at?: string
          updated_at?: string
        }
        Update: {
          goals?: string
          deliverables?: string
          blockers?: string | null
          reflection?: string | null
          mood?: number | null
          hours_worked?: number | null
          updated_at?: string
        }
      }
      high_fives: {
        Row: {
          id: string
          from_user_id: string
          to_user_id: string
          team_id: string
          sprint_id: string | null
          message: string
          category: string | null
          created_at: string
        }
        Insert: {
          id?: string
          from_user_id: string
          to_user_id: string
          team_id: string
          sprint_id?: string | null
          message: string
          category?: string | null
          created_at?: string
        }
        Update: {
          message?: string
          category?: string | null
        }
      }
      tasks: {
        Row: {
          id: string
          team_id: string
          sprint_id: string | null
          title: string
          description: string | null
          status: 'todo' | 'in_progress' | 'review' | 'done'
          priority: 'low' | 'medium' | 'high' | 'urgent'
          assignee_id: string | null
          created_by_id: string | null
          due_date: string | null
          estimated_hours: number | null
          actual_hours: number | null
          position: number
          parent_task_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          team_id: string
          sprint_id?: string | null
          title: string
          description?: string | null
          status?: 'todo' | 'in_progress' | 'review' | 'done'
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          assignee_id?: string | null
          created_by_id?: string | null
          due_date?: string | null
          estimated_hours?: number | null
          actual_hours?: number | null
          position?: number
          parent_task_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          title?: string
          description?: string | null
          status?: 'todo' | 'in_progress' | 'review' | 'done'
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          assignee_id?: string | null
          due_date?: string | null
          estimated_hours?: number | null
          actual_hours?: number | null
          position?: number
          updated_at?: string
        }
      }
      task_comments: {
        Row: {
          id: string
          task_id: string
          user_id: string
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          task_id: string
          user_id: string
          content: string
          created_at?: string
        }
        Update: {
          content?: string
        }
      }
      coffee_chats: {
        Row: {
          id: string
          team_id: string
          sprint_id: string | null
          user_1_id: string
          user_2_id: string
          status: 'pending' | 'scheduled' | 'completed' | 'skipped'
          scheduled_at: string | null
          completed_at: string | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          team_id: string
          sprint_id?: string | null
          user_1_id: string
          user_2_id: string
          status?: 'pending' | 'scheduled' | 'completed' | 'skipped'
          scheduled_at?: string | null
          completed_at?: string | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          status?: 'pending' | 'scheduled' | 'completed' | 'skipped'
          scheduled_at?: string | null
          completed_at?: string | null
          notes?: string | null
        }
      }
      one_on_ones: {
        Row: {
          id: string
          user_id: string
          team_id: string
          sprint_id: string | null
          manager_id: string | null
          scheduled_at: string | null
          proud_of: string | null
          need_help: string | null
          questions: string | null
          prep_submitted_at: string | null
          manager_notes: string | null
          action_items: string | null
          meeting_completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          team_id: string
          sprint_id?: string | null
          manager_id?: string | null
          scheduled_at?: string | null
          proud_of?: string | null
          need_help?: string | null
          questions?: string | null
          prep_submitted_at?: string | null
          manager_notes?: string | null
          action_items?: string | null
          meeting_completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          scheduled_at?: string | null
          proud_of?: string | null
          need_help?: string | null
          questions?: string | null
          prep_submitted_at?: string | null
          manager_notes?: string | null
          action_items?: string | null
          meeting_completed_at?: string | null
          updated_at?: string
        }
      }
      invitations: {
        Row: {
          id: string
          email: string
          org_id: string
          team_id: string | null
          role: string
          invited_by: string
          token: string
          expires_at: string
          accepted_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          org_id: string
          team_id?: string | null
          role?: string
          invited_by: string
          token: string
          expires_at: string
          accepted_at?: string | null
          created_at?: string
        }
        Update: {
          accepted_at?: string | null
        }
      }
      activity_log: {
        Row: {
          id: string
          org_id: string
          team_id: string | null
          user_id: string | null
          action: string
          entity_type: string | null
          entity_id: string | null
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          org_id: string
          team_id?: string | null
          user_id?: string | null
          action: string
          entity_type?: string | null
          entity_id?: string | null
          metadata?: Json | null
          created_at?: string
        }
        Update: never
      }
    }
  }
}

// Helper types
export type Organization = Database['public']['Tables']['organizations']['Row']
export type Profile = Database['public']['Tables']['profiles']['Row']
export type OrgMembership = Database['public']['Tables']['org_memberships']['Row']
export type Team = Database['public']['Tables']['teams']['Row']
export type TeamMembership = Database['public']['Tables']['team_memberships']['Row']
export type Sprint = Database['public']['Tables']['sprints']['Row']
export type Submission = Database['public']['Tables']['submissions']['Row']
export type HighFive = Database['public']['Tables']['high_fives']['Row']
export type Task = Database['public']['Tables']['tasks']['Row']
export type TaskComment = Database['public']['Tables']['task_comments']['Row']
export type CoffeeChat = Database['public']['Tables']['coffee_chats']['Row']
export type OneOnOne = Database['public']['Tables']['one_on_ones']['Row']
export type Invitation = Database['public']['Tables']['invitations']['Row']
export type ActivityLog = Database['public']['Tables']['activity_log']['Row']

// Extended types with relations
export type ProfileWithMemberships = Profile & {
  org_memberships: (OrgMembership & { organizations: Organization })[]
  team_memberships: (TeamMembership & { teams: Team })[]
}

export type TeamWithMembers = Team & {
  team_memberships: (TeamMembership & { profiles: Profile })[]
}

export type SubmissionWithUser = Submission & {
  profiles: Profile
}

export type HighFiveWithUsers = HighFive & {
  from_user: Profile
  to_user: Profile
}

export type TaskWithAssignee = Task & {
  assignee: Profile | null
  created_by: Profile | null
}

// Enum types
export type OrgRole = 'owner' | 'admin' | 'member'
export type TeamRole = 'admin' | 'member'
export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done'
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'
export type CoffeeChatStatus = 'pending' | 'scheduled' | 'completed' | 'skipped'
