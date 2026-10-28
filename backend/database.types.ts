export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      bank_account: {
        Row: {
          balance: number
          card_linked: string | null
          created_at: string
          id: string
          name: string
          user_id: string
        }
        Insert: {
          balance: number
          card_linked?: string | null
          created_at?: string
          id?: string
          name: string
          user_id: string
        }
        Update: {
          balance?: number
          card_linked?: string | null
          created_at?: string
          id?: string
          name?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bank_account_card_linked_fkey"
            columns: ["card_linked"]
            isOneToOne: false
            referencedRelation: "Cards"
            referencedColumns: ["id"]
          },
        ]
      }
      Budgets: {
        Row: {
          alert_threshold: number | null
          category_id: string
          created_at: string
          id: string
          income_amount: number | null
          limit_amount: number
          month: number
          rollover_amount: number | null
          rollover_enabled: boolean
          spent_amount: number
          user_id: string
          year: number
        }
        Insert: {
          alert_threshold?: number | null
          category_id: string
          created_at?: string
          id?: string
          income_amount?: number | null
          limit_amount: number
          month: number
          rollover_amount?: number | null
          rollover_enabled?: boolean
          spent_amount?: number
          user_id: string
          year: number
        }
        Update: {
          alert_threshold?: number | null
          category_id?: string
          created_at?: string
          id?: string
          income_amount?: number | null
          limit_amount?: number
          month?: number
          rollover_amount?: number | null
          rollover_enabled?: boolean
          spent_amount?: number
          user_id?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "Budgets_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "Categories"
            referencedColumns: ["id"]
          },
        ]
      }
      Cards: {
        Row: {
          balance: number
          card_holder: string
          card_kind: string
          card_type: string
          color_theme: string
          created_at: string
          credit_limit: number
          expiry_month: number
          expiry_year: number
          id: string
          is_default: boolean
          last_four: number
          savings_pot_id: string | null
          user_id: string
        }
        Insert: {
          balance?: number
          card_holder: string
          card_kind: string
          card_type: string
          color_theme: string
          created_at?: string
          credit_limit?: number
          expiry_month: number
          expiry_year: number
          id?: string
          is_default?: boolean
          last_four: number
          savings_pot_id?: string | null
          user_id: string
        }
        Update: {
          balance?: number
          card_holder?: string
          card_kind?: string
          card_type?: string
          color_theme?: string
          created_at?: string
          credit_limit?: number
          expiry_month?: number
          expiry_year?: number
          id?: string
          is_default?: boolean
          last_four?: number
          savings_pot_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "Cards_savings_pot_id_fkey"
            columns: ["savings_pot_id"]
            isOneToOne: false
            referencedRelation: "savings_pots"
            referencedColumns: ["id"]
          },
        ]
      }
      Categories: {
        Row: {
          color: string
          created_at: string
          icon: string
          id: string
          is_default: boolean
          name: string
          user_id: string
        }
        Insert: {
          color: string
          created_at?: string
          icon: string
          id?: string
          is_default?: boolean
          name: string
          user_id: string
        }
        Update: {
          color?: string
          created_at?: string
          icon?: string
          id?: string
          is_default?: boolean
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      liabilities: {
        Row: {
          balance: number
          budget_category: string | null
          created_at: string
          down_payment: number | null
          id: string
          interest_rate: number
          minimum_payment: number
          name: string
          original_amount: number | null
          recurring_transaction_id: string | null
          start_date: string | null
          term_years: number | null
          type: string
          user_id: string
        }
        Insert: {
          balance: number
          budget_category?: string | null
          created_at?: string
          down_payment?: number | null
          id?: string
          interest_rate: number
          minimum_payment: number
          name: string
          original_amount?: number | null
          recurring_transaction_id?: string | null
          start_date?: string | null
          term_years?: number | null
          type: string
          user_id: string
        }
        Update: {
          balance?: number
          budget_category?: string | null
          created_at?: string
          down_payment?: number | null
          id?: string
          interest_rate?: number
          minimum_payment?: number
          name?: string
          original_amount?: number | null
          recurring_transaction_id?: string | null
          start_date?: string | null
          term_years?: number | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "liabilities_recurring_transaction_id_fkey"
            columns: ["recurring_transaction_id"]
            isOneToOne: false
            referencedRelation: "recurring_transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      Merchant_Rules: {
        Row: {
          category_slug: string
          created_at: string
          id: string
          merchant: string
          user_id: string
        }
        Insert: {
          category_slug: string
          created_at?: string
          id?: string
          merchant: string
          user_id: string
        }
        Update: {
          category_slug?: string
          created_at?: string
          id?: string
          merchant?: string
          user_id?: string
        }
        Relationships: []
      }
      recurring_transactions: {
        Row: {
          amount: number
          card_id: string | null
          category_id: string
          created_at: string
          day_of_month: number | null
          day_of_week: number | null
          description: string | null
          end_date: string | null
          frequency: string
          id: string
          is_active: boolean
          last_processed_date: string | null
          linked_budget_impact: string | null
          linked_category: string | null
          linked_type: string | null
          merchant: string | null
          name: string
          next_due_date: string
          start_date: string
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          card_id?: string | null
          category_id: string
          created_at?: string
          day_of_month?: number | null
          day_of_week?: number | null
          description?: string | null
          end_date?: string | null
          frequency: string
          id?: string
          is_active?: boolean
          last_processed_date?: string | null
          linked_budget_impact?: string | null
          linked_category?: string | null
          linked_type?: string | null
          merchant?: string | null
          name: string
          next_due_date: string
          start_date: string
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          card_id?: string | null
          category_id?: string
          created_at?: string
          day_of_month?: number | null
          day_of_week?: number | null
          description?: string | null
          end_date?: string | null
          frequency?: string
          id?: string
          is_active?: boolean
          last_processed_date?: string | null
          linked_budget_impact?: string | null
          linked_category?: string | null
          linked_type?: string | null
          merchant?: string | null
          name?: string
          next_due_date?: string
          start_date?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "recurring_transactions_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "Cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recurring_transactions_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "Categories"
            referencedColumns: ["id"]
          },
        ]
      }
      Savings: {
        Row: {
          color: string | null
          created_at: string
          current_amount: number
          deadline: string | null
          icon: string | null
          id: string
          name: string
          status: string
          target_amount: number
          user_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          current_amount?: number
          deadline?: string | null
          icon?: string | null
          id?: string
          name: string
          status?: string
          target_amount: number
          user_id: string
        }
        Update: {
          color?: string | null
          created_at?: string
          current_amount?: number
          deadline?: string | null
          icon?: string | null
          id?: string
          name?: string
          status?: string
          target_amount?: number
          user_id?: string
        }
        Relationships: []
      }
      savings_pots: {
        Row: {
          amount: number
          created_at: string
          emoji: string
          id: string
          name: string
          notes: string | null
          user_id: string
        }
        Insert: {
          amount?: number
          created_at?: string
          emoji: string
          id?: string
          name: string
          notes?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          emoji?: string
          id?: string
          name?: string
          notes?: string | null
          user_id?: string
        }
        Relationships: []
      }
      savings_rules: {
        Row: {
          amount: number | null
          created_at: string
          day_of_month: number | null
          id: string
          is_active: boolean
          last_run_date: string | null
          name: string
          percentage: number | null
          pot_id: string
          trigger_type: string
          user_id: string
        }
        Insert: {
          amount?: number | null
          created_at?: string
          day_of_month?: number | null
          id?: string
          is_active?: boolean
          last_run_date?: string | null
          name: string
          percentage?: number | null
          pot_id: string
          trigger_type: string
          user_id: string
        }
        Update: {
          amount?: number | null
          created_at?: string
          day_of_month?: number | null
          id?: string
          is_active?: boolean
          last_run_date?: string | null
          name?: string
          percentage?: number | null
          pot_id?: string
          trigger_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "savings_rules_pot_id_fkey"
            columns: ["pot_id"]
            isOneToOne: false
            referencedRelation: "savings_pots"
            referencedColumns: ["id"]
          },
        ]
      }
      Subscriptions: {
        Row: {
          amount: number
          billing_day: number
          billing_month: number | null
          card_id: string | null
          color: string | null
          company: string
          created_at: string
          icon: string | null
          id: string
          is_active: boolean
          last_processed_date: string | null
          next_due_date: string
          period: string
          user_id: string
        }
        Insert: {
          amount: number
          billing_day: number
          billing_month?: number | null
          card_id?: string | null
          color?: string | null
          company: string
          created_at?: string
          icon?: string | null
          id?: string
          is_active?: boolean
          last_processed_date?: string | null
          next_due_date: string
          period: string
          user_id: string
        }
        Update: {
          amount?: number
          billing_day?: number
          billing_month?: number | null
          card_id?: string | null
          color?: string | null
          company?: string
          created_at?: string
          icon?: string | null
          id?: string
          is_active?: boolean
          last_processed_date?: string | null
          next_due_date?: string
          period?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "Subscriptions_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "Cards"
            referencedColumns: ["id"]
          },
        ]
      }
      transaction_splits: {
        Row: {
          amount: number
          category_id: string
          created_at: string
          id: string
          note: string | null
          transaction_id: string
        }
        Insert: {
          amount: number
          category_id: string
          created_at?: string
          id?: string
          note?: string | null
          transaction_id: string
        }
        Update: {
          amount?: number
          category_id?: string
          created_at?: string
          id?: string
          note?: string | null
          transaction_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transaction_splits_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "Categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transaction_splits_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "Transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      Transactions: {
        Row: {
          amount: number
          bank_account_id: string | null
          budget_impact: string | null
          card_id: string | null
          category_id: string
          created_at: string
          date: string
          description: string
          id: string
          is_split: boolean
          merchant: string | null
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          bank_account_id?: string | null
          budget_impact?: string | null
          card_id?: string | null
          category_id: string
          created_at?: string
          date: string
          description: string
          id?: string
          is_split?: boolean
          merchant?: string | null
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          bank_account_id?: string | null
          budget_impact?: string | null
          card_id?: string | null
          category_id?: string
          created_at?: string
          date?: string
          description?: string
          id?: string
          is_split?: boolean
          merchant?: string | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "Transactions_bank_account_id_fkey"
            columns: ["bank_account_id"]
            isOneToOne: false
            referencedRelation: "bank_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Transactions_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "Cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Transactions_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "Categories"
            referencedColumns: ["id"]
          },
        ]
      }
      User_settings: {
        Row: {
          budget_alerts: boolean
          created_at: string
          currency: string
          goal_reminders: boolean
          id: string
          language: string
          notifications_enabled: boolean
          theme: string
          user_id: string
          weekly_summary: boolean
        }
        Insert: {
          budget_alerts?: boolean
          created_at?: string
          currency?: string
          goal_reminders?: boolean
          id?: string
          language?: string
          notifications_enabled?: boolean
          theme?: string
          user_id: string
          weekly_summary?: boolean
        }
        Update: {
          budget_alerts?: boolean
          created_at?: string
          currency?: string
          goal_reminders?: boolean
          id?: string
          language?: string
          notifications_enabled?: boolean
          theme?: string
          user_id?: string
          weekly_summary?: boolean
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
