/**
 * Supabase Browser Client
 * 
 * Use this in:
 * - Client Components (marked with 'use client')
 * - React hooks
 * - Event handlers
 * 
 * This client uses browser localStorage for auth state.
 */

import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database'

/**
 * Creates a Supabase client for Client Components
 * Singleton pattern - reuses the same client instance
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
