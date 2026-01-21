/**
 * Database Schema Types
 * 
 * These types represent the Supabase PostgreSQL schema.
 * After creating tables, regenerate with: npx supabase gen types typescript --project-id YOUR_PROJECT_ID
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      buildings: {
        Row: {
          id: number
          title: string
          description: string | null
          location: unknown // PostGIS geography(POINT) - use [lng, lat] in GeoJSON format
          tags: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: never // Auto-increment
          title: string
          description?: string | null
          location: unknown // GeoJSON: { type: 'Point', coordinates: [lng, lat] }
          tags?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: never
          title?: string
          description?: string | null
          location?: unknown
          tags?: string[] | null
          updated_at?: string
        }
      }
      images: {
        Row: {
          id: number
          building_id: number
          url: string
          caption: string | null
          created_at: string
        }
        Insert: {
          id?: never
          building_id: number
          url: string
          caption?: string | null
          created_at?: string
        }
        Update: {
          id?: never
          building_id?: number
          url?: string
          caption?: string | null
        }
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
  }
}

// Helper types for easier usage
export type Building = Database['public']['Tables']['buildings']['Row']
export type BuildingInsert = Database['public']['Tables']['buildings']['Insert']
export type BuildingUpdate = Database['public']['Tables']['buildings']['Update']

export type Image = Database['public']['Tables']['images']['Row']
export type ImageInsert = Database['public']['Tables']['images']['Insert']
export type ImageUpdate = Database['public']['Tables']['images']['Update']
