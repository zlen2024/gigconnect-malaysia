export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
          university: string | null
          bio: string | null
          skills: string[] | null
          location: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          avatar_url?: string | null
          university?: string | null
          bio?: string | null
          skills?: string[] | null
          location?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          avatar_url?: string | null
          university?: string | null
          bio?: string | null
          skills?: string[] | null
          location?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_roles: {
        Row: {
          id: string
          user_id: string
          role: 'student' | 'client'
        }
        Insert: {
          id?: string
          user_id: string
          role: 'student' | 'client'
        }
        Update: {
          id?: string
          user_id?: string
          role?: 'student' | 'client'
        }
      }
      gigs: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string
          category: string
          price: number
          delivery_time: number
          location: string | null
          images: string[] | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description: string
          category: string
          price: number
          delivery_time: number
          location?: string | null
          images?: string[] | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string
          category?: string
          price?: number
          delivery_time?: number
          location?: string | null
          images?: string[] | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      jobs: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string
          budget: number
          location: string | null
          deadline: string | null
          category: string
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description: string
          budget: number
          location?: string | null
          deadline?: string | null
          category: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string
          budget?: number
          location?: string | null
          deadline?: string | null
          category?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          gig_id: string | null
          job_id: string | null
          client_id: string
          student_id: string
          title: string
          price: number
          status: 'pending' | 'agreed' | 'in_progress' | 'submitted' | 'completed' | 'cancelled'
          requirements: string | null
          deliverable_url: string | null
          progress: number
          receipt_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          gig_id?: string | null
          job_id?: string | null
          client_id: string
          student_id: string
          title: string
          price: number
          status?: 'pending' | 'agreed' | 'in_progress' | 'submitted' | 'completed' | 'cancelled'
          requirements?: string | null
          deliverable_url?: string | null
          progress?: number
          receipt_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          gig_id?: string | null
          job_id?: string | null
          client_id?: string
          student_id?: string
          title?: string
          price?: number
          status?: 'pending' | 'agreed' | 'in_progress' | 'submitted' | 'completed' | 'cancelled'
          requirements?: string | null
          deliverable_url?: string | null
          progress?: number
          receipt_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          order_id: string | null
          sender_id: string
          receiver_id: string
          content: string
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          order_id?: string | null
          sender_id: string
          receiver_id: string
          content: string
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string | null
          sender_id?: string
          receiver_id?: string
          content?: string
          is_read?: boolean
          created_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          order_id: string
          reviewer_id: string
          reviewee_id: string
          rating: number
          comment: string | null
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          reviewer_id: string
          reviewee_id: string
          rating: number
          comment?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          reviewer_id?: string
          reviewee_id?: string
          rating?: number
          comment?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: { _user_id: string; _role: 'student' | 'client' }
        Returns: boolean
      }
      get_user_role: {
        Args: { _user_id: string }
        Returns: 'student' | 'client'
      }
    }
    Enums: {
      app_role: 'student' | 'client'
      order_status: 'pending' | 'agreed' | 'in_progress' | 'submitted' | 'completed' | 'cancelled'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
