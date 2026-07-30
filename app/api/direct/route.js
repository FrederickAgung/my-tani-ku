export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { createClient } from '@supabase/supabase-js'

export async function GET() {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Use fresh client, NOT the singleton from supabaseData
  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  })

  // Use fresh client with a UNIQUE query to bust any cache
  // Fresh client with .select() only - simplest possible query
  const { data, error } = await supabase
    .from('app_data')
    .select('value')
    .eq('key', 'seller_products')
    .single()

  if (error) return Response.json({ error: error.message, count: 'error' })
  
  // data is now a single row object, not an array
  const count = data ? (Array.isArray(data.value) ? data.value.length : typeof data.value) : 'null'
  const names = data && Array.isArray(data.value) ? data.value.map(p => p.nama) : []

  return Response.json({
    count,
    names,
    totalQueryResults: data ? 'row found' : 'no row',
  })
}
