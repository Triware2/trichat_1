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
      analytics_events: {
        Row: {
          id: string
          event_type: string
          data: Json | null
          timestamp: string | null
          created_by: string | null
          metadata: Json | null
        }
        Insert: {
          id?: string
          event_type: string
          data?: Json | null
          timestamp?: string | null
          created_by?: string | null
          metadata?: Json | null
        }
        Update: {
          id?: string
          event_type?: string
          data?: Json | null
          timestamp?: string | null
          created_by?: string | null
          metadata?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_events_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "auth.users"
            referencedColumns: ["id"]
          },
        ]
      }
      custom_analytics: {
        Row: {
          id: string
          name: string
          description: string | null
          metrics: Json
          filters: Json | null
          time_range: string | null
          chart_type: string | null
          data_source: string | null
          query: string | null
          status: string | null
          created_by: string | null
          created_at: string | null
          updated_at: string | null
          last_run: string | null
          results: Json | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          metrics: Json
          filters?: Json | null
          time_range?: string | null
          chart_type?: string | null
          data_source?: string | null
          query?: string | null
          status?: string | null
          created_by?: string | null
          created_at?: string | null
          updated_at?: string | null
          last_run?: string | null
          results?: Json | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          metrics?: Json
          filters?: Json | null
          time_range?: string | null
          chart_type?: string | null
          data_source?: string | null
          query?: string | null
          status?: string | null
          created_by?: string | null
          created_at?: string | null
          updated_at?: string | null
          last_run?: string | null
          results?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "custom_analytics_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "auth.users"
            referencedColumns: ["id"]
          },
        ]
      }
      attachments: {
        Row: {
          created_at: string | null
          file_name: string
          file_size: number
          file_type: string
          id: string
          message_id: string | null
          storage_path: string
          uploaded_by: string | null
          url: string | null
        }
        Insert: {
          created_at?: string | null
          file_name: string
          file_size: number
          file_type: string
          id?: string
          message_id?: string | null
          storage_path: string
          uploaded_by?: string | null
          url?: string | null
        }
        Update: {
          created_at?: string | null
          file_name?: string
          file_size?: number
          file_type?: string
          id?: string
          message_id?: string | null
          storage_path?: string
          uploaded_by?: string | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "attachments_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attachments_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      canned_responses: {
        Row: {
          category: string
          content: string
          created_at: string | null
          created_by: string | null
          id: string
          is_active: boolean | null
          tags: string[] | null
          title: string
          updated_at: string | null
          usage_count: number | null
        }
        Insert: {
          category: string
          content: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          usage_count?: number | null
        }
        Update: {
          category?: string
          content?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          usage_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "canned_responses_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_assignments: {
        Row: {
          agent_id: string
          assigned_at: string | null
          assigned_by: string | null
          chat_id: string
          id: string
          is_active: boolean | null
          unassigned_at: string | null
        }
        Insert: {
          agent_id: string
          assigned_at?: string | null
          assigned_by?: string | null
          chat_id: string
          id?: string
          is_active?: boolean | null
          unassigned_at?: string | null
        }
        Update: {
          agent_id?: string
          assigned_at?: string | null
          assigned_by?: string | null
          chat_id?: string
          id?: string
          is_active?: boolean | null
          unassigned_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_assignments_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_assignments_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_assignments_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "chats"
            referencedColumns: ["id"]
          },
        ]
      }
      chats: {
        Row: {
          assigned_agent_id: string | null
          channel: string
          closed_at: string | null
          created_at: string | null
          customer_id: string | null
          escalated_at: string | null
          id: string
          metadata: Json | null
          priority: Database["public"]["Enums"]["chat_priority"]
          queue_position: number | null
          resolution_time: number | null
          response_time: number | null
          satisfaction_feedback: string | null
          satisfaction_rating: number | null
          status: Database["public"]["Enums"]["chat_status"]
          subject: string | null
          tags: string[] | null
          updated_at: string | null
          wait_time: number | null
        }
        Insert: {
          assigned_agent_id?: string | null
          channel?: string
          closed_at?: string | null
          created_at?: string | null
          customer_id?: string | null
          escalated_at?: string | null
          id?: string
          metadata?: Json | null
          priority?: Database["public"]["Enums"]["chat_priority"]
          queue_position?: number | null
          resolution_time?: number | null
          response_time?: number | null
          satisfaction_feedback?: string | null
          satisfaction_rating?: number | null
          status?: Database["public"]["Enums"]["chat_status"]
          subject?: string | null
          tags?: string[] | null
          updated_at?: string | null
          wait_time?: number | null
        }
        Update: {
          assigned_agent_id?: string | null
          channel?: string
          closed_at?: string | null
          created_at?: string | null
          customer_id?: string | null
          escalated_at?: string | null
          id?: string
          metadata?: Json | null
          priority?: Database["public"]["Enums"]["chat_priority"]
          queue_position?: number | null
          resolution_time?: number | null
          response_time?: number | null
          satisfaction_feedback?: string | null
          satisfaction_rating?: number | null
          status?: Database["public"]["Enums"]["chat_status"]
          subject?: string | null
          tags?: string[] | null
          updated_at?: string | null
          wait_time?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "chats_assigned_agent_id_fkey"
            columns: ["assigned_agent_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chats_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          ip_address: unknown | null
          location: Json | null
          metadata: Json | null
          name: string | null
          phone: string | null
          updated_at: string | null
          user_agent: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          ip_address?: unknown | null
          location?: Json | null
          metadata?: Json | null
          name?: string | null
          phone?: string | null
          updated_at?: string | null
          user_agent?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          ip_address?: unknown | null
          location?: Json | null
          metadata?: Json | null
          name?: string | null
          phone?: string | null
          updated_at?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          chat_id: string
          content: string
          created_at: string | null
          deleted_at: string | null
          edited_at: string | null
          id: string
          is_private: boolean | null
          message_type: Database["public"]["Enums"]["message_type"]
          metadata: Json | null
          read_by: string[] | null
          sender_id: string | null
          sender_type: string
        }
        Insert: {
          chat_id: string
          content: string
          created_at?: string | null
          deleted_at?: string | null
          edited_at?: string | null
          id?: string
          is_private?: boolean | null
          message_type?: Database["public"]["Enums"]["message_type"]
          metadata?: Json | null
          read_by?: string[] | null
          sender_id?: string | null
          sender_type: string
        }
        Update: {
          chat_id?: string
          content?: string
          created_at?: string | null
          deleted_at?: string | null
          edited_at?: string | null
          id?: string
          is_private?: boolean | null
          message_type?: Database["public"]["Enums"]["message_type"]
          metadata?: Json | null
          read_by?: string[] | null
          sender_id?: string | null
          sender_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "chats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          data: Json | null
          id: string
          is_read: boolean | null
          message: string
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          data?: Json | null
          id?: string
          is_read?: boolean | null
          message: string
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          data?: Json | null
          id?: string
          is_read?: boolean | null
          message?: string
          title?: string
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      plan_features: {
        Row: {
          created_at: string
          feature_key: string
          feature_limit: number | null
          id: string
          is_enabled: boolean
          plan_type: string
        }
        Insert: {
          created_at?: string
          feature_key: string
          feature_limit?: number | null
          id?: string
          is_enabled?: boolean
          plan_type: string
        }
        Update: {
          created_at?: string
          feature_key?: string
          feature_limit?: number | null
          id?: string
          is_enabled?: boolean
          plan_type?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          department: string | null
          email: string
          full_name: string
          id: string
          is_active: boolean | null
          last_seen: string | null
          max_concurrent_chats: number | null
          role: Database["public"]["Enums"]["user_role"]
          skills: string[] | null
          status: Database["public"]["Enums"]["agent_status"]
          timezone: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          department?: string | null
          email: string
          full_name: string
          id: string
          is_active?: boolean | null
          last_seen?: string | null
          max_concurrent_chats?: number | null
          role?: Database["public"]["Enums"]["user_role"]
          skills?: string[] | null
          status?: Database["public"]["Enums"]["agent_status"]
          timezone?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          department?: string | null
          email?: string
          full_name?: string
          id?: string
          is_active?: boolean | null
          last_seen?: string | null
          max_concurrent_chats?: number | null
          role?: Database["public"]["Enums"]["user_role"]
          skills?: string[] | null
          status?: Database["public"]["Enums"]["agent_status"]
          timezone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      queue_settings: {
        Row: {
          auto_assignment: boolean | null
          business_hours: Json | null
          created_at: string | null
          department: string | null
          id: string
          is_active: boolean | null
          max_wait_time: number | null
          name: string
          priority_multiplier: number | null
        }
        Insert: {
          auto_assignment?: boolean | null
          business_hours?: Json | null
          created_at?: string | null
          department?: string | null
          id?: string
          is_active?: boolean | null
          max_wait_time?: number | null
          name: string
          priority_multiplier?: number | null
        }
        Update: {
          auto_assignment?: boolean | null
          business_hours?: Json | null
          created_at?: string | null
          department?: string | null
          id?: string
          is_active?: boolean | null
          max_wait_time?: number | null
          name?: string
          priority_multiplier?: number | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          agent_limit: number | null
          created_at: string
          current_agent_count: number | null
          id: string
          plan_type: string | null
          status: Database["public"]["Enums"]["subscription_status"]
          subscription_end_date: string | null
          subscription_start_date: string | null
          trial_end_date: string
          trial_start_date: string
          updated_at: string
          user_id: string
        }
        Insert: {
          agent_limit?: number | null
          created_at?: string
          current_agent_count?: number | null
          id?: string
          plan_type?: string | null
          status?: Database["public"]["Enums"]["subscription_status"]
          subscription_end_date?: string | null
          subscription_start_date?: string | null
          trial_end_date?: string
          trial_start_date?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          agent_limit?: number | null
          created_at?: string
          current_agent_count?: number | null
          id?: string
          plan_type?: string | null
          status?: Database["public"]["Enums"]["subscription_status"]
          subscription_end_date?: string | null
          subscription_start_date?: string | null
          trial_end_date?: string
          trial_start_date?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      system_settings: {
        Row: {
          description: string | null
          id: string
          key: string
          updated_at: string | null
          updated_by: string | null
          value: Json
        }
        Insert: {
          description?: string | null
          id?: string
          key: string
          updated_at?: string | null
          updated_by?: string | null
          value: Json
        }
        Update: {
          description?: string | null
          id?: string
          key?: string
          updated_at?: string | null
          updated_by?: string | null
          value?: Json
        }
        Relationships: [
          {
            foreignKeyName: "system_settings_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      email_queue: {
        Row: {
          id: string
          to_email: string
          subject: string
          body: string
          html_body: string | null
          status: string
          type: string
          error_message: string | null
          sent_at: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          to_email: string
          subject: string
          body: string
          html_body?: string | null
          status?: string
          type?: string
          error_message?: string | null
          sent_at?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          to_email?: string
          subject?: string
          body?: string
          html_body?: string | null
          status?: string
          type?: string
          error_message?: string | null
          sent_at?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      billing_events: {
        Row: {
          id: string
          user_id: string
          event_type: string
          event_data: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          event_type: string
          event_data?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          event_type?: string
          event_data?: Json | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "billing_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      checkout_sessions: {
        Row: {
          id: string
          user_id: string
          plan_id: string
          status: Database["public"]["Enums"]["checkout_session_status"]
          stripe_session_id: string | null
          success_url: string
          cancel_url: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          plan_id: string
          status?: Database["public"]["Enums"]["checkout_session_status"]
          stripe_session_id?: string | null
          success_url: string
          cancel_url: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          plan_id?: string
          status?: Database["public"]["Enums"]["checkout_session_status"]
          stripe_session_id?: string | null
          success_url?: string
          cancel_url?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "checkout_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      invoices: {
        Row: {
          id: string
          user_id: string
          stripe_invoice_id: string | null
          number: string
          amount: number
          currency: string
          status: Database["public"]["Enums"]["invoice_status"]
          due_date: string | null
          paid_at: string | null
          pdf_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          stripe_invoice_id?: string | null
          number: string
          amount: number
          currency?: string
          status?: Database["public"]["Enums"]["invoice_status"]
          due_date?: string | null
          paid_at?: string | null
          pdf_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          stripe_invoice_id?: string | null
          number?: string
          amount?: number
          currency?: string
          status?: Database["public"]["Enums"]["invoice_status"]
          due_date?: string | null
          paid_at?: string | null
          pdf_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      payment_methods: {
        Row: {
          id: string
          user_id: string
          type: Database["public"]["Enums"]["payment_method_type"]
          last4: string
          brand: string | null
          exp_month: number | null
          exp_year: number | null
          is_default: boolean
          stripe_payment_method_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: Database["public"]["Enums"]["payment_method_type"]
          last4: string
          brand?: string | null
          exp_month?: number | null
          exp_year?: number | null
          is_default?: boolean
          stripe_payment_method_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: Database["public"]["Enums"]["payment_method_type"]
          last4?: string
          brand?: string | null
          exp_month?: number | null
          exp_year?: number | null
          is_default?: boolean
          stripe_payment_method_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_methods_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_trial_days_remaining: {
        Args: { user_id: string }
        Returns: number
      }
      get_user_plan_details: {
        Args: { user_id: string }
        Returns: {
          plan_type: string
          status: Database["public"]["Enums"]["subscription_status"]
          agent_limit: number
          current_agent_count: number
          trial_days_remaining: number
        }[]
      }
      get_user_role: {
        Args: { user_id: string }
        Returns: Database["public"]["Enums"]["user_role"]
      }
      is_trial_active: {
        Args: { user_id: string }
        Returns: boolean
      }
      user_has_feature_access: {
        Args: { user_id: string; feature_key: string }
        Returns: boolean
      }
    }
    Enums: {
      agent_status: "online" | "busy" | "away" | "offline"
      chat_priority: "low" | "medium" | "high" | "urgent"
      chat_status: "queued" | "active" | "resolved" | "closed" | "escalated"
      message_type: "text" | "image" | "file" | "system" | "private_note"
      notification_type:
        | "chat_assigned"
        | "message_received"
        | "escalation"
        | "system_alert"
      subscription_status: "trial" | "active" | "expired" | "cancelled" | "free"
      user_role: "admin" | "supervisor" | "agent"
      checkout_session_status: "open" | "completed" | "expired" | "canceled"
      invoice_status: "open" | "paid" | "unpaid" | "void" | "draft"
      payment_method_type: "card" | "bank_account" | "sepa_debit" | "ideal" | "p24" | "sofort" | "bancontact" | "alipay" | "wechat_pay"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      agent_status: ["online", "busy", "away", "offline"],
      chat_priority: ["low", "medium", "high", "urgent"],
      chat_status: ["queued", "active", "resolved", "closed", "escalated"],
      message_type: ["text", "image", "file", "system", "private_note"],
      notification_type: [
        "chat_assigned",
        "message_received",
        "escalation",
        "system_alert",
      ],
      subscription_status: ["trial", "active", "expired", "cancelled", "free"],
      user_role: ["admin", "supervisor", "agent"],
      checkout_session_status: ["open", "completed", "expired", "canceled"],
      invoice_status: ["open", "paid", "unpaid", "void", "draft"],
      payment_method_type: ["card", "bank_account", "sepa_debit", "ideal", "p24", "sofort", "bancontact", "alipay", "wechat_pay"],
    },
  },
} as const
