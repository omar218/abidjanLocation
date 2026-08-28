export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRole = 'proprietaire' | 'locataire' | 'agence' | 'admin';
export type PropertyType = '2p' | '3p' | '4p' | 'villa' | 'bureau' | 'autre';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          phone: string | null;
          role: UserRole;
          is_subscribed: boolean;
          subscription_expires_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          phone?: string | null;
          role?: UserRole;
          is_subscribed?: boolean;
          subscription_expires_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          phone?: string | null;
          role?: UserRole;
          is_subscribed?: boolean;
          subscription_expires_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      properties: {
        Row: {
          id: string;
          title: string;
          price_xof: number;
          commune: string;
          quartier: string;
          rooms: number;
          type: PropertyType | string;
          furnished: boolean;
          surface_m2: number | null;
          images: string[];
          owner_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          price_xof: number;
          commune: string;
          quartier: string;
          rooms: number;
          type: PropertyType | string;
          furnished?: boolean;
          surface_m2?: number | null;
          images?: string[];
          owner_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          price_xof?: number;
          commune?: string;
          quartier?: string;
          rooms?: number;
          type?: PropertyType | string;
          furnished?: boolean;
          surface_m2?: number | null;
          images?: string[];
          owner_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          transaction_id: string;
          amount_xof: number;
          operator: string;
          phone: string;
          status: string;
          started_at: string;
          expires_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          transaction_id: string;
          amount_xof: number;
          operator: string;
          phone: string;
          status: string;
          started_at?: string;
          expires_at: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          transaction_id?: string;
          amount_xof?: number;
          operator?: string;
          phone?: string;
          status?: string;
          started_at?: string;
          expires_at?: string;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      user_role: UserRole;
      property_type: PropertyType;
    };
  };
}
