export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { createClient } from '@supabase/supabase-js'

export async function GET() {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  })

  // Baca seller_products langsung dari Supabase (tanpa readCollection)
  const { data, error } = await supabase
    .from('app_data')
    .select('value')
    .eq('key', 'seller_products')

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  const products = data && data.length > 0 && Array.isArray(data[0].value)
    ? data[0].value
    : []

  return Response.json(products)
}
