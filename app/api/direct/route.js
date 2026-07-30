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

  const { data, error } = await supabase
    .from('app_data')
    .select('value')
    .eq('key', 'seller_products')
    .maybeSingle()

  if (error) return Response.json({ error: error.message })
  
  const count = data ? (Array.isArray(data.value) ? data.value.length : typeof data.value) : 'null'
  const names = data && Array.isArray(data.value) ? data.value.map(p => p.nama) : []

  return Response.json({
    count,
    names,
    dataType: data ? typeof data.value : 'null',
    isArray: data ? Array.isArray(data.value) : false,
  })
}
