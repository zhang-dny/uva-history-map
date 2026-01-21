/**
 * Supabase Connection Test Utility
 * 
 * Run this to verify your Supabase setup is working correctly.
 * This checks:
 * - Environment variables are set
 * - Connection to Supabase is successful
 * - Database is accessible
 */

import { createClient } from './server'

export async function testSupabaseConnection() {
  const errors: string[] = []

  // Check environment variables
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    errors.push('NEXT_PUBLIC_SUPABASE_URL is not set')
  }
  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    errors.push('NEXT_PUBLIC_SUPABASE_ANON_KEY is not set')
  }
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    errors.push('SUPABASE_SERVICE_ROLE_KEY is not set')
  }

  if (errors.length > 0) {
    return {
      success: false,
      message: 'Environment variables missing',
      errors,
    }
  }

  try {
    const supabase = await createClient()

    // Try to query the database (this will fail gracefully if tables don't exist yet)
    const { data, error } = await supabase
      .from('buildings')
      .select('count')
      .limit(1)

    if (error) {
      // If error is "relation does not exist", that's expected before we create tables
      if (error.message.includes('does not exist')) {
        return {
          success: true,
          message: 'Connection successful! Ready to create tables.',
          warning: 'Tables not yet created',
        }
      }

      return {
        success: false,
        message: 'Database query failed',
        errors: [error.message],
      }
    }

    return {
      success: true,
      message: 'Connection successful! Database is ready.',
      data,
    }
  } catch (error) {
    return {
      success: false,
      message: 'Failed to connect to Supabase',
      errors: [error instanceof Error ? error.message : 'Unknown error'],
    }
  }
}
