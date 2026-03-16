import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    console.warn('[Supabase] Missing environment variables. Please configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY')
    // Return a dummy client to prevent crashes during development
    return createBrowserClient(
      url || 'https://placeholder.supabase.co',
      key || 'placeholder-key',
    )
  }

  return createBrowserClient(url, key)
}
