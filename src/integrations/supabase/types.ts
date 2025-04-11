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
      clubs: {
        Row: {
          country: string
          created_at: string
          id: string
          name: string
        }
        Insert: {
          country: string
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          country?: string
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          club_id: string | null
          country: string | null
          created_at: string
          first_name: string | null
          gender: string | null
          id: string
          last_name: string | null
          user_type: Database["public"]["Enums"]["user_type"]
          username: string | null
          year_of_birth: number | null
        }
        Insert: {
          avatar_url?: string | null
          club_id?: string | null
          country?: string | null
          created_at?: string
          first_name?: string | null
          gender?: string | null
          id: string
          last_name?: string | null
          user_type?: Database["public"]["Enums"]["user_type"]
          username?: string | null
          year_of_birth?: number | null
        }
        Update: {
          avatar_url?: string | null
          club_id?: string | null
          country?: string | null
          created_at?: string
          first_name?: string | null
          gender?: string | null
          id?: string
          last_name?: string | null
          user_type?: Database["public"]["Enums"]["user_type"]
          username?: string | null
          year_of_birth?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
        ]
      }
      swim_sessions: {
        Row: {
          centiseconds: number
          chrono_type: string
          created_at: string
          date: string
          description: string | null
          distance: number
          id: string
          location: string
          minutes: number
          pool_length: string
          seconds: number
          session_type: string
          style: string
          user_id: string
        }
        Insert: {
          centiseconds: number
          chrono_type?: string
          created_at?: string
          date?: string
          description?: string | null
          distance: number
          id?: string
          location: string
          minutes: number
          pool_length: string
          seconds: number
          session_type?: string
          style: string
          user_id: string
        }
        Update: {
          centiseconds?: number
          chrono_type?: string
          created_at?: string
          date?: string
          description?: string | null
          distance?: number
          id?: string
          location?: string
          minutes?: number
          pool_length?: string
          seconds?: number
          session_type?: string
          style?: string
          user_id?: string
        }
        Relationships: []
      }
      training_sessions: {
        Row: {
          created_at: string
          date: string
          description: string | null
          distance: number
          id: string
          intensity: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date?: string
          description?: string | null
          distance: number
          id?: string
          intensity: string
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          description?: string | null
          distance?: number
          id?: string
          intensity?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_swim_sessions: {
        Args: { p_user_id: string }
        Returns: {
          centiseconds: number
          chrono_type: string
          created_at: string
          date: string
          description: string | null
          distance: number
          id: string
          location: string
          minutes: number
          pool_length: string
          seconds: number
          session_type: string
          style: string
          user_id: string
        }[]
      }
      is_coach: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      swimmer_in_my_club: {
        Args: { swimmer_id: string }
        Returns: boolean
      }
    }
    Enums: {
      user_type: "basic" | "coach"
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
      user_type: ["basic", "coach"],
    },
  },
} as const
