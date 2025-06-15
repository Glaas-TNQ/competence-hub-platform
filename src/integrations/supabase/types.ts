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
      alimenti: {
        Row: {
          categoria: string | null
          created_at: string
          data_scadenza: string | null
          id: string
          nome: string
          quantita: number
          unita_di_misura: string
        }
        Insert: {
          categoria?: string | null
          created_at?: string
          data_scadenza?: string | null
          id?: string
          nome: string
          quantita: number
          unita_di_misura: string
        }
        Update: {
          categoria?: string | null
          created_at?: string
          data_scadenza?: string | null
          id?: string
          nome?: string
          quantita?: number
          unita_di_misura?: string
        }
        Relationships: []
      }
      badges: {
        Row: {
          category: string
          created_at: string
          criteria: Json
          description: string
          icon: string
          id: string
          is_active: boolean
          name: string
          points_reward: number
          rarity: string
        }
        Insert: {
          category: string
          created_at?: string
          criteria: Json
          description: string
          icon: string
          id?: string
          is_active?: boolean
          name: string
          points_reward?: number
          rarity?: string
        }
        Update: {
          category?: string
          created_at?: string
          criteria?: Json
          description?: string
          icon?: string
          id?: string
          is_active?: boolean
          name?: string
          points_reward?: number
          rarity?: string
        }
        Relationships: []
      }
      categorie: {
        Row: {
          colore: string | null
          created_at: string
          descrizione: string | null
          id: string
          nome: string
          updated_at: string
        }
        Insert: {
          colore?: string | null
          created_at?: string
          descrizione?: string | null
          id?: string
          nome: string
          updated_at?: string
        }
        Update: {
          colore?: string | null
          created_at?: string
          descrizione?: string | null
          id?: string
          nome?: string
          updated_at?: string
        }
        Relationships: []
      }
      chapter_progress: {
        Row: {
          chapter_index: number
          completed_at: string
          course_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          chapter_index: number
          completed_at?: string
          course_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          chapter_index?: number
          completed_at?: string
          course_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chapter_progress_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      competence_areas: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          icon: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      courses: {
        Row: {
          competence_area_id: string | null
          content: Json | null
          course_type: string
          created_at: string
          description: string
          duration: string
          id: string
          image_url: string | null
          is_published: boolean | null
          level: string
          price: number | null
          requires_payment: boolean | null
          title: string
          updated_at: string
        }
        Insert: {
          competence_area_id?: string | null
          content?: Json | null
          course_type: string
          created_at?: string
          description: string
          duration: string
          id?: string
          image_url?: string | null
          is_published?: boolean | null
          level: string
          price?: number | null
          requires_payment?: boolean | null
          title: string
          updated_at?: string
        }
        Update: {
          competence_area_id?: string | null
          content?: Json | null
          course_type?: string
          created_at?: string
          description?: string
          duration?: string
          id?: string
          image_url?: string | null
          is_published?: boolean | null
          level?: string
          price?: number | null
          requires_payment?: boolean | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "courses_competence_area_id_fkey"
            columns: ["competence_area_id"]
            isOneToOne: false
            referencedRelation: "competence_areas"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_streaks: {
        Row: {
          activity_type: string
          created_at: string
          id: string
          streak_date: string
          user_id: string
        }
        Insert: {
          activity_type?: string
          created_at?: string
          id?: string
          streak_date: string
          user_id: string
        }
        Update: {
          activity_type?: string
          created_at?: string
          id?: string
          streak_date?: string
          user_id?: string
        }
        Relationships: []
      }
      html_content: {
        Row: {
          created_at: string
          description: string | null
          html_content: string
          id: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          html_content: string
          id?: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          html_content?: string
          id?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      pasti_consumati: {
        Row: {
          created_at: string
          id: string
          ingredienti_consumati: Json | null
          nome_ricetta_consumata: string
          numero_porzioni: number
          ricetta_salvata_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          ingredienti_consumati?: Json | null
          nome_ricetta_consumata: string
          numero_porzioni?: number
          ricetta_salvata_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          ingredienti_consumati?: Json | null
          nome_ricetta_consumata?: string
          numero_porzioni?: number
          ricetta_salvata_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_ricetta_salvata"
            columns: ["ricetta_salvata_id"]
            isOneToOne: false
            referencedRelation: "ricette_salvate"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          accessible_courses: string[] | null
          company: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          purchased_courses: string[] | null
          role: string | null
          updated_at: string
        }
        Insert: {
          accessible_courses?: string[] | null
          company?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          purchased_courses?: string[] | null
          role?: string | null
          updated_at?: string
        }
        Update: {
          accessible_courses?: string[] | null
          company?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          purchased_courses?: string[] | null
          role?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      ricette_salvate: {
        Row: {
          analisi_nutrizionale: Json | null
          created_at: string
          descrizione_breve: string | null
          id: string
          ingredienti: Json | null
          istruzioni: string | null
          nome_ricetta: string
          note_aggiuntive: string | null
          numero_persone: number | null
          preferenze_utente: string | null
          prompt_openai_usato: string | null
          risposta_openai_grezza: string | null
          tempo_cottura_min: number | null
          tempo_preparazione_min: number | null
          tempo_totale_min: number | null
          user_id: string | null
        }
        Insert: {
          analisi_nutrizionale?: Json | null
          created_at?: string
          descrizione_breve?: string | null
          id?: string
          ingredienti?: Json | null
          istruzioni?: string | null
          nome_ricetta: string
          note_aggiuntive?: string | null
          numero_persone?: number | null
          preferenze_utente?: string | null
          prompt_openai_usato?: string | null
          risposta_openai_grezza?: string | null
          tempo_cottura_min?: number | null
          tempo_preparazione_min?: number | null
          tempo_totale_min?: number | null
          user_id?: string | null
        }
        Update: {
          analisi_nutrizionale?: Json | null
          created_at?: string
          descrizione_breve?: string | null
          id?: string
          ingredienti?: Json | null
          istruzioni?: string | null
          nome_ricetta?: string
          note_aggiuntive?: string | null
          numero_persone?: number | null
          preferenze_utente?: string | null
          prompt_openai_usato?: string | null
          risposta_openai_grezza?: string | null
          tempo_cottura_min?: number | null
          tempo_preparazione_min?: number | null
          tempo_totale_min?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_activities: {
        Row: {
          activity_data: Json | null
          activity_type: string
          chapter_index: number | null
          competence_area_id: string | null
          course_id: string | null
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          activity_data?: Json | null
          activity_type: string
          chapter_index?: number | null
          competence_area_id?: string | null
          course_id?: string | null
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          activity_data?: Json | null
          activity_type?: string
          chapter_index?: number | null
          competence_area_id?: string | null
          course_id?: string | null
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_activities_competence_area_id_fkey"
            columns: ["competence_area_id"]
            isOneToOne: false
            referencedRelation: "competence_areas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_activities_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      user_badges: {
        Row: {
          badge_id: string
          created_at: string
          earned_at: string
          id: string
          user_id: string
        }
        Insert: {
          badge_id: string
          created_at?: string
          earned_at?: string
          id?: string
          user_id: string
        }
        Update: {
          badge_id?: string
          created_at?: string
          earned_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
        ]
      }
      user_points: {
        Row: {
          activity_id: string | null
          activity_type: string
          created_at: string
          earned_at: string
          id: string
          points: number
          user_id: string
        }
        Insert: {
          activity_id?: string | null
          activity_type: string
          created_at?: string
          earned_at?: string
          id?: string
          points?: number
          user_id: string
        }
        Update: {
          activity_id?: string | null
          activity_type?: string
          created_at?: string
          earned_at?: string
          id?: string
          points?: number
          user_id?: string
        }
        Relationships: []
      }
      user_progress: {
        Row: {
          completed_at: string | null
          course_id: string
          created_at: string
          id: string
          progress_percentage: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          course_id: string
          created_at?: string
          id?: string
          progress_percentage?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          course_id?: string
          created_at?: string
          id?: string
          progress_percentage?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_settings: {
        Row: {
          created_at: string
          id: string
          nutrition_api_key: string | null
          openai_api_key: string | null
          openai_model: string | null
          openai_system_prompt: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          nutrition_api_key?: string | null
          openai_api_key?: string | null
          openai_model?: string | null
          openai_system_prompt?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          nutrition_api_key?: string | null
          openai_api_key?: string | null
          openai_model?: string | null
          openai_system_prompt?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_total_points: {
        Row: {
          created_at: string
          id: string
          level: number
          points_to_next_level: number
          total_points: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          level?: number
          points_to_next_level?: number
          total_points?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          level?: number
          points_to_next_level?: number
          total_points?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_level_from_points: {
        Args: { points: number }
        Returns: number
      }
      get_user_current_streak: {
        Args: { p_user_id: string; p_activity_type?: string }
        Returns: number
      }
      points_to_next_level: {
        Args: { current_points: number }
        Returns: number
      }
      record_daily_activity: {
        Args: { p_user_id: string; p_activity_type?: string }
        Returns: undefined
      }
      update_user_total_points: {
        Args: { p_user_id: string; p_points: number }
        Returns: undefined
      }
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
