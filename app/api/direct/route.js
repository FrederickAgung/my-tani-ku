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
  // Check for ALL rows matching the key (not just one)
  const { data, error } = await supabase
    .from('app_data')
    .select('value, updated_at')
    .eq('key', 'seller_products')

  if (error) return Response.json({ error: error.message })
  
  if (!data || data.length === 0) return Response.json({ count: 'no rows' })
  
  const rows = data.map((r, i) => ({
    index: i,
    count: Array.isArray(r.value) ? r.value.length : typeof r.value,
    names: Array.isArray(r.value) ? r.value.map(p => p.nama) : [],
    updated_at: r.updated_at,
  }))

  return Response.json({
    totalRows: data.length,
    rows,
  })
}
