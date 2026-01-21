/**
 * Supabase Server Client
 * 
 * Use this in:
 * - Server Components (for fetching data)
 * - Server Actions (for mutations)
 * - Route Handlers (if needed, though we prefer Server Actions)
 * 
 * This client automatically handles auth cookies and can access server-only env vars.
 */

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database'

/**
 * Creates a Supabase client for Server Components and Server Actions
 * Automatically reads/writes auth cookies
 */
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing user sessions.
          }
        },
      },
    }
  )
}

/**
 * Creates a Supabase client with Service Role privileges
 * ⚠️ DANGEROUS: This bypasses Row Level Security
 * 
 * Only use for:
 * - Admin-only operations that need to bypass RLS
 * - Seeding data
 * - Background jobs
 * 
 * NEVER use this with user-provided data directly.
 */
export function createAdminClient() {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return []
        },
        setAll() {
          // No-op for admin client
        },
      },
    }
  )
}
