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
