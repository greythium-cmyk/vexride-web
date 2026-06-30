/**
 * Supabase database types — mirrors supabase/schema.sql.
 * Regenerate with: npx supabase gen types typescript --project-id YOUR_ID
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type ProfileRow = {
  id: string;
  clerk_id: string;
  email: string;
  full_name: string;
  avatar_initials: string;
  plan: string;
  rating: number;
  created_at: string;
  updated_at: string;
};

type TripRow = {
  id: string;
  user_id: string;
  driver_name: string;
  driver_avatar: string;
  driver_rating: number;
  driver_premium: boolean;
  route_from: string;
  route_to: string;
  trip_date: string;
  trip_time: string;
  status: string;
  passengers: number;
  match_score: number;
  vehicle: string | null;
  created_at: string;
};

type MatchRow = {
  id: string;
  user_id: string;
  driver_name: string;
  driver_avatar: string;
  driver_rating: number;
  driver_premium: boolean;
  route_from: string;
  route_to: string;
  match_time: string;
  match_score: number;
  savings: string;
  co2_saved: string;
  joined: boolean;
  created_at: string;
};

type UserStatRow = {
  id: string;
  user_id: string;
  month: string;
  savings: number;
  trips: number;
  co2_saved: number;
};

type NotificationRow = {
  id: string;
  user_id: string;
  title: string;
  message: string;
  unread: boolean;
  created_at: string;
};

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: ProfileRow;
        Insert: Omit<ProfileRow, "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
        Relationships: [];
      };
      trips: {
        Row: TripRow;
        Insert: Omit<TripRow, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["trips"]["Insert"]>;
        Relationships: [];
      };
      matches: {
        Row: MatchRow;
        Insert: Omit<MatchRow, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["matches"]["Insert"]>;
        Relationships: [];
      };
      chat_messages: {
        Row: {
          id: string;
          user_id: string;
          role: string;
          content: string;
          channel: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          role: string;
          content: string;
          channel?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["chat_messages"]["Insert"]>;
        Relationships: [];
      };
      user_stats: {
        Row: UserStatRow;
        Insert: Omit<UserStatRow, "id"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["user_stats"]["Insert"]>;
        Relationships: [];
      };
      notifications: {
        Row: NotificationRow;
        Insert: Omit<NotificationRow, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["notifications"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

export type { ProfileRow, TripRow, MatchRow, UserStatRow, NotificationRow };
