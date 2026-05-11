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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      commandes: {
        Row: {
          adresse_livraison: string | null
          created_at: string
          date_limite: string
          eleve_id: string
          fichier_livrable_url: string | null
          fichier_reference_url: string | null
          format_images: boolean
          format_physique: string
          id: string
          matiere: string
          message_retour: string | null
          niveau: string
          pages: string
          plan: string | null
          prix_total: number
          redacteur_id: string | null
          statut: Database["public"]["Enums"]["commande_statut"]
          sujet: string
          updated_at: string
        }
        Insert: {
          adresse_livraison?: string | null
          created_at?: string
          date_limite: string
          eleve_id: string
          fichier_livrable_url?: string | null
          fichier_reference_url?: string | null
          format_images?: boolean
          format_physique?: string
          id?: string
          matiere: string
          message_retour?: string | null
          niveau: string
          pages: string
          plan?: string | null
          prix_total: number
          redacteur_id?: string | null
          statut?: Database["public"]["Enums"]["commande_statut"]
          sujet: string
          updated_at?: string
        }
        Update: {
          adresse_livraison?: string | null
          created_at?: string
          date_limite?: string
          eleve_id?: string
          fichier_livrable_url?: string | null
          fichier_reference_url?: string | null
          format_images?: boolean
          format_physique?: string
          id?: string
          matiere?: string
          message_retour?: string | null
          niveau?: string
          pages?: string
          plan?: string | null
          prix_total?: number
          redacteur_id?: string | null
          statut?: Database["public"]["Enums"]["commande_statut"]
          sujet?: string
          updated_at?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          auteur_id: string
          commande_id: string
          contenu: string
          created_at: string
          id: string
        }
        Insert: {
          auteur_id: string
          commande_id: string
          contenu: string
          created_at?: string
          id?: string
        }
        Update: {
          auteur_id?: string
          commande_id?: string
          contenu?: string
          created_at?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_commande_id_fkey"
            columns: ["commande_id"]
            isOneToOne: false
            referencedRelation: "commandes"
            referencedColumns: ["id"]
          },
        ]
      }
      notations: {
        Row: {
          commande_id: string
          commentaire: string | null
          created_at: string
          eleve_id: string
          id: string
          note_contenu: number | null
          note_delai: number | null
          note_globale: number
          note_images: number | null
          note_structure: number | null
          redacteur_id: string
        }
        Insert: {
          commande_id: string
          commentaire?: string | null
          created_at?: string
          eleve_id: string
          id?: string
          note_contenu?: number | null
          note_delai?: number | null
          note_globale: number
          note_images?: number | null
          note_structure?: number | null
          redacteur_id: string
        }
        Update: {
          commande_id?: string
          commentaire?: string | null
          created_at?: string
          eleve_id?: string
          id?: string
          note_contenu?: number | null
          note_delai?: number | null
          note_globale?: number
          note_images?: number | null
          note_structure?: number | null
          redacteur_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notations_commande_id_fkey"
            columns: ["commande_id"]
            isOneToOne: true
            referencedRelation: "commandes"
            referencedColumns: ["id"]
          },
        ]
      }
      paiements_redacteurs: {
        Row: {
          commande_id: string
          created_at: string
          date_paiement: string | null
          id: string
          montant: number
          redacteur_id: string
          statut: Database["public"]["Enums"]["paiement_statut"]
        }
        Insert: {
          commande_id: string
          created_at?: string
          date_paiement?: string | null
          id?: string
          montant: number
          redacteur_id: string
          statut?: Database["public"]["Enums"]["paiement_statut"]
        }
        Update: {
          commande_id?: string
          created_at?: string
          date_paiement?: string | null
          id?: string
          montant?: number
          redacteur_id?: string
          statut?: Database["public"]["Enums"]["paiement_statut"]
        }
        Relationships: [
          {
            foreignKeyName: "paiements_redacteurs_commande_id_fkey"
            columns: ["commande_id"]
            isOneToOne: true
            referencedRelation: "commandes"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          classe: string | null
          created_at: string
          cv_url: string | null
          ecole: string | null
          email: string
          id: string
          matieres: string[] | null
          niveau_etudes: string | null
          nom: string
          prenom: string
          statut: Database["public"]["Enums"]["redacteur_statut"]
          telephone: string | null
          updated_at: string
        }
        Insert: {
          classe?: string | null
          created_at?: string
          cv_url?: string | null
          ecole?: string | null
          email?: string
          id: string
          matieres?: string[] | null
          niveau_etudes?: string | null
          nom?: string
          prenom?: string
          statut?: Database["public"]["Enums"]["redacteur_statut"]
          telephone?: string | null
          updated_at?: string
        }
        Update: {
          classe?: string | null
          created_at?: string
          cv_url?: string | null
          ecole?: string | null
          email?: string
          id?: string
          matieres?: string[] | null
          niveau_etudes?: string | null
          nom?: string
          prenom?: string
          statut?: Database["public"]["Enums"]["redacteur_statut"]
          telephone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "eleve" | "redacteur" | "admin"
      commande_statut:
        | "en_attente"
        | "en_cours"
        | "en_validation"
        | "livre"
        | "annule"
        | "refuse"
      paiement_statut: "en_attente" | "paye"
      redacteur_statut: "pending" | "actif" | "suspendu"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["eleve", "redacteur", "admin"],
      commande_statut: [
        "en_attente",
        "en_cours",
        "en_validation",
        "livre",
        "annule",
        "refuse",
      ],
      paiement_statut: ["en_attente", "paye"],
      redacteur_statut: ["pending", "actif", "suspendu"],
    },
  },
} as const
