import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
}

if (!supabaseAnonKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable')
}

/**
 * Supabase client for server-side admin operations (with service role key)
 * Use this for admin-only operations that require elevated privileges
 */
export async function createServerClient() {
  const key = supabaseServiceRoleKey || supabaseAnonKey
  
  return createClient(supabaseUrl, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: {
      headers: {
        'x-client-info': 'labelpro-server',
      },
    },
  })
}

/**
 * Supabase client for server-side user operations (with user session)
 * Use this when you need to access user-specific data
 * Note: Using createClient directly for Next.js 15 compatibility
 * Session is obtained via getSession() call
 */
export async function createUserClient() {
  const cookieStore = await cookies()
  
  // Create client with anon key (RLS will handle permissions)
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: {
      headers: {
        'x-client-info': 'labelpro-server-user',
        // Forward cookies for session management
        Cookie: cookieStore.getAll().map(c => `${c.name}=${c.value}`).join('; '),
      },
    },
  })
  
  // Get session from cookies manually
  // Extract session from cookies if available
  const authCookie = cookieStore.get('sb-access-token')
  const refreshCookie = cookieStore.get('sb-refresh-token')
  
  let session = null
  if (authCookie?.value) {
    try {
      const { data } = await supabase.auth.getSession()
      session = data.session
    } catch (error) {
      // Session invalid or expired
      console.warn('Failed to get session:', error)
    }
  }
  
  return { supabase, session }
}

