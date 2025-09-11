'use client'
export const dynamic = 'force-dynamic' // prevent static prerender

import { useMemo } from 'react'
import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

export default function LoginPage() {
  const supabase = useMemo(() => getSupabase(), [])
  if (!supabase) return null // or fallback UI

  // use supabase here
  return <div>Login</div>
}
