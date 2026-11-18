export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18";
  };
  public: {
    Tables: {
      albums: {
        Row: {
          album_type: Database["public"]["Enums"]["album_type"];
          cover_url: string | null;
          created_at: string;
          id: number;
          release_year: number;
          slug: string;
          spotify_uri: string | null;
          title: string;
        };
        Insert: {
          album_type?: Database["public"]["Enums"]["album_type"];
          cover_url?: string | null;
          created_at?: string;
          id?: never;
          release_year: number;
          slug: string;
          spotify_uri?: string | null;
          title: string;
        };
        Update: {
          album_type?: Database["public"]["Enums"]["album_type"];
          cover_url?: string | null;
          created_at?: string;
          id?: never;
          release_year?: number;
          slug?: string;
          spotify_uri?: string | null;
          title?: string;
        };
        Relationships: [];
      };
      follows: {
        Row: {
          created_at: string;
          follower_id: string;
          following_id: string;
        };
        Insert: {
          created_at?: string;
          follower_id: string;
          following_id: string;
        };
        Update: {
          created_at?: string;
          follower_id?: string;
          following_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "follows_follower_id_fkey";
            columns: ["follower_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "follows_following_id_fkey";
            columns: ["following_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      lastfm_connections: {
        Row: {
          created_at: string;
          last_synced_at: string | null;
          session_key: string;
          user_id: string;
          username: string;
        };
        Insert: {
          created_at?: string;
          last_synced_at?: string | null;
          session_key: string;
          user_id: string;
          username: string;
        };
        Update: {
          created_at?: string;
          last_synced_at?: string | null;
          session_key?: string;
          user_id?: string;
          username?: string;
        };
        Relationships: [
          {
            foreignKeyName: "lastfm_connections_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      listening_imports: {
        Row: {
          export_end_date: string;
          id: number;
          plays_imported: number;
          uploaded_at: string;
          user_id: string;
        };
        Insert: {
          export_end_date: string;
          id?: never;
          plays_imported?: number;
          uploaded_at?: string;
          user_id: string;
        };
        Update: {
          export_end_date?: string;
          id?: never;
          plays_imported?: number;
          uploaded_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "listening_imports_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      plays: {
        Row: {
          created_at: string;
          id: number;
          is_estimate: boolean;
          ms_played: number;
          played_at: string;
          skipped: boolean | null;
          song_id: number;
          source: Database["public"]["Enums"]["play_source"];
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: never;
          is_estimate?: boolean;
          ms_played: number;
          played_at: string;
          skipped?: boolean | null;
          song_id: number;
          source: Database["public"]["Enums"]["play_source"];
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: never;
          is_estimate?: boolean;
          ms_played?: number;
          played_at?: string;
          skipped?: boolean | null;
          song_id?: number;
          source?: Database["public"]["Enums"]["play_source"];
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "plays_song_id_fkey";
            columns: ["song_id"];
            isOneToOne: false;
            referencedRelation: "songs";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "plays_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          banner_url: string | null;
          bio: string | null;
          created_at: string;
          id: string;
          nickname: string | null;
          updated_at: string;
          username: string;
        };
        Insert: {
          avatar_url?: string | null;
          banner_url?: string | null;
          bio?: string | null;
          created_at?: string;
          id: string;
          nickname?: string | null;
          updated_at?: string;
          username: string;
        };
        Update: {
          avatar_url?: string | null;
          banner_url?: string | null;
          bio?: string | null;
          created_at?: string;
          id?: string;
          nickname?: string | null;
          updated_at?: string;
          username?: string;
        };
        Relationships: [];
      };
      quiz_attempts: {
        Row: {
          answered_at: string;
          correct: boolean;
          difficulty: Database["public"]["Enums"]["quiz_difficulty"];
          id: number;
          question_id: number | null;
          user_id: string;
        };
        Insert: {
          answered_at?: string;
          correct: boolean;
          difficulty: Database["public"]["Enums"]["quiz_difficulty"];
          id?: never;
          question_id?: number | null;
          user_id: string;
        };
        Update: {
          answered_at?: string;
          correct?: boolean;
          difficulty?: Database["public"]["Enums"]["quiz_difficulty"];
          id?: never;
          question_id?: number | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "quiz_attempts_question_id_fkey";
            columns: ["question_id"];
            isOneToOne: false;
            referencedRelation: "quiz_questions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "quiz_attempts_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      quiz_questions: {
        Row: {
          answers: string[];
          category: Database["public"]["Enums"]["quiz_category"];
          correct_answer: string;
          created_at: string;
          difficulty: Database["public"]["Enums"]["quiz_difficulty"];
          explanation: string | null;
          id: number;
          is_active: boolean;
          question: string;
          source: string | null;
        };
        Insert: {
          answers: string[];
          category: Database["public"]["Enums"]["quiz_category"];
          correct_answer: string;
          created_at?: string;
          difficulty: Database["public"]["Enums"]["quiz_difficulty"];
          explanation?: string | null;
          id?: never;
          is_active?: boolean;
          question: string;
          source?: string | null;
        };
        Update: {
          answers?: string[];
          category?: Database["public"]["Enums"]["quiz_category"];
          correct_answer?: string;
          created_at?: string;
          difficulty?: Database["public"]["Enums"]["quiz_difficulty"];
          explanation?: string | null;
          id?: never;
          is_active?: boolean;
          question?: string;
          source?: string | null;
        };
        Relationships: [];
      };
      songs: {
        Row: {
          album_id: number;
          created_at: string;
          disc_number: number;
          duration_ms: number;
          id: number;
          release_year: number;
          spotify_uri: string | null;
          title: string;
          track_number: number;
        };
        Insert: {
          album_id: number;
          created_at?: string;
          disc_number?: number;
          duration_ms: number;
          id?: never;
          release_year: number;
          spotify_uri?: string | null;
          title: string;
          track_number: number;
        };
        Update: {
          album_id?: number;
          created_at?: string;
          disc_number?: number;
          duration_ms?: number;
          id?: never;
          release_year?: number;
          spotify_uri?: string | null;
          title?: string;
          track_number?: number;
        };
        Relationships: [
          {
            foreignKeyName: "songs_album_id_fkey";
            columns: ["album_id"];
            isOneToOne: false;
            referencedRelation: "albums";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      album_type: "studio" | "live" | "ep" | "single" | "compilation";
      play_source: "spotify_file" | "lastfm";
      quiz_category: "songs" | "albums" | "members" | "history" | "fun_facts";
      quiz_difficulty: "easy" | "medium" | "hard";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema["CompositeTypes"] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      album_type: ["studio", "live", "ep", "single", "compilation"],
      play_source: ["spotify_file", "lastfm"],
      quiz_category: ["songs", "albums", "members", "history", "fun_facts"],
      quiz_difficulty: ["easy", "medium", "hard"],
    },
  },
} as const;
