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
      agents: {
        Row: {
          agent_type: string
          company: string | null
          conversations: number
          created_at: string | null
          description: string | null
          first_message: string | null
          id: string
          knowledge_base_id: string | null
          last_active: string | null
          name: string
          script_id: string | null
          status: string
          system_prompt: string | null
          updated_at: string | null
          user_id: string
          voice: string
        }
        Insert: {
          agent_type?: string
          company?: string | null
          conversations?: number
          created_at?: string | null
          description?: string | null
          first_message?: string | null
          id?: string
          knowledge_base_id?: string | null
          last_active?: string | null
          name: string
          script_id?: string | null
          status?: string
          system_prompt?: string | null
          updated_at?: string | null
          user_id: string
          voice: string
        }
        Update: {
          agent_type?: string
          company?: string | null
          conversations?: number
          created_at?: string | null
          description?: string | null
          first_message?: string | null
          id?: string
          knowledge_base_id?: string | null
          last_active?: string | null
          name?: string
          script_id?: string | null
          status?: string
          system_prompt?: string | null
          updated_at?: string | null
          user_id?: string
          voice?: string
        }
        Relationships: [
          {
            foreignKeyName: "agents_script_id_fkey"
            columns: ["script_id"]
            isOneToOne: false
            referencedRelation: "scripts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_agents_knowledge_base"
            columns: ["knowledge_base_id"]
            isOneToOne: false
            referencedRelation: "knowledge_base"
            referencedColumns: ["id"]
          },
        ]
      }
      calls: {
        Row: {
          campaign_id: string | null
          contact_id: string
          created_at: string
          direction: string
          duration: number | null
          ended_at: string | null
          external_call_id: string | null
          id: string
          notes: string | null
          outcome: string | null
          phone: string
          recording_url: string | null
          sentiment: number | null
          started_at: string
          status: string
          transcript: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          campaign_id?: string | null
          contact_id: string
          created_at?: string
          direction?: string
          duration?: number | null
          ended_at?: string | null
          external_call_id?: string | null
          id?: string
          notes?: string | null
          outcome?: string | null
          phone: string
          recording_url?: string | null
          sentiment?: number | null
          started_at?: string
          status?: string
          transcript?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          campaign_id?: string | null
          contact_id?: string
          created_at?: string
          direction?: string
          duration?: number | null
          ended_at?: string | null
          external_call_id?: string | null
          id?: string
          notes?: string | null
          outcome?: string | null
          phone?: string
          recording_url?: string | null
          sentiment?: number | null
          started_at?: string
          status?: string
          transcript?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "calls_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calls_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_contacts: {
        Row: {
          campaign_id: string
          contact_id: string
          created_at: string
          id: string
        }
        Insert: {
          campaign_id: string
          contact_id: string
          created_at?: string
          id?: string
        }
        Update: {
          campaign_id?: string
          contact_id?: string
          created_at?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_campaign_contacts_campaign"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_campaign_contacts_contact"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          agent_id: string | null
          created_at: string
          description: string | null
          id: string
          knowledge_base_id: string | null
          name: string
          script_id: string | null
          settings: Json | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          agent_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          knowledge_base_id?: string | null
          name: string
          script_id?: string | null
          settings?: Json | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          agent_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          knowledge_base_id?: string | null
          name?: string
          script_id?: string | null
          settings?: Json | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_knowledge_base_id_fkey"
            columns: ["knowledge_base_id"]
            isOneToOne: false
            referencedRelation: "knowledge_base"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaigns_script_id_fkey"
            columns: ["script_id"]
            isOneToOne: false
            referencedRelation: "scripts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_campaigns_agent"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      contacts: {
        Row: {
          address: string | null
          city: string | null
          created_at: string | null
          email: string | null
          id: string
          last_called: string | null
          name: string
          phone: string | null
          state: string | null
          status: string
          updated_at: string | null
          user_id: string
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          last_called?: string | null
          name: string
          phone?: string | null
          state?: string | null
          status?: string
          updated_at?: string | null
          user_id: string
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          last_called?: string | null
          name?: string
          phone?: string | null
          state?: string | null
          status?: string
          updated_at?: string | null
          user_id?: string
          zip_code?: string | null
        }
        Relationships: []
      }
      knowledge_base: {
        Row: {
          content: string | null
          created_at: string | null
          date_added: string | null
          description: string | null
          id: string
          last_modified: string | null
          status: string
          tags: string[] | null
          title: string
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          date_added?: string | null
          description?: string | null
          id?: string
          last_modified?: string | null
          status?: string
          tags?: string[] | null
          title: string
          type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string | null
          date_added?: string | null
          description?: string | null
          id?: string
          last_modified?: string | null
          status?: string
          tags?: string[] | null
          title?: string
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      scripts: {
        Row: {
          agent_type: string
          company: string | null
          created_at: string
          description: string | null
          first_message: string | null
          id: string
          name: string
          sections: Json | null
          updated_at: string
          user_id: string
          voice: string
        }
        Insert: {
          agent_type?: string
          company?: string | null
          created_at?: string
          description?: string | null
          first_message?: string | null
          id?: string
          name: string
          sections?: Json | null
          updated_at?: string
          user_id: string
          voice?: string
        }
        Update: {
          agent_type?: string
          company?: string | null
          created_at?: string
          description?: string | null
          first_message?: string | null
          id?: string
          name?: string
          sections?: Json | null
          updated_at?: string
          user_id?: string
          voice?: string
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
    Enums: {},
  },
} as const
