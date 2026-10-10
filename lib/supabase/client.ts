import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  console.log("🔍 Testing Supabase URL:", url) // Check browser console for this!

  if (!url || !key) {
    throw new Error("Supabase URL or Anon Key is missing!")
  }

  return createBrowserClient(url, key)
}