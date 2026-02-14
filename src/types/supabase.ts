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
          role: 'student' | 'client' | 'admin'
          full_name: string | null
          avatar_url: string | null
          university: string | null
          bio: string | null
          skills: string[] | null
          total_done_projects: number
          total_earnings: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          role?: 'student' | 'client' | 'admin'
          full_name?: string | null
          avatar_url?: string | null
          university?: string | null
          bio?: string | null
          skills?: string[] | null
          total_done_projects?: number
          total_earnings?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          role?: 'student' | 'client' | 'admin'
          full_name?: string | null
          avatar_url?: string | null
          university?: string | null
          bio?: string | null
          skills?: string[] | null
          total_done_projects?: number
          total_earnings?: number
          created_at?: string
          updated_at?: string
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
          images: string[] | null
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
          images?: string[] | null
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
          images?: string[] | null
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
          status: string | null
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
          status?: string | null
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
          status?: string | null
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
          price: number
          status: 'pending' | 'paid' | 'in_progress' | 'submitted' | 'completed' | 'cancelled'
          receipt_url: string | null
          submission_url: string | null
          requirements: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          gig_id?: string | null
          job_id?: string | null
          client_id: string
          student_id: string
          price: number
          status?: 'pending' | 'paid' | 'in_progress' | 'submitted' | 'completed' | 'cancelled'
          receipt_url?: string | null
          submission_url?: string | null
          requirements?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          gig_id?: string | null
          job_id?: string | null
          client_id?: string
          student_id?: string
          price?: number
          status?: 'pending' | 'paid' | 'in_progress' | 'submitted' | 'completed' | 'cancelled'
          receipt_url?: string | null
          submission_url?: string | null
          requirements?: string | null
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
          is_read: boolean | null
          created_at: string
        }
        Insert: {
          id?: string
          order_id?: string | null
          sender_id: string
          receiver_id: string
          content: string
          is_read?: boolean | null
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string | null
          sender_id?: string
          receiver_id?: string
          content?: string
          is_read?: boolean | null
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
      complete_order: {
        Args: {
          order_id: string
        }
        Returns: void
      }
    }
    Enums: {
      user_role: 'student' | 'client' | 'admin'
      order_status: 'pending' | 'paid' | 'in_progress' | 'submitted' | 'completed' | 'cancelled'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
