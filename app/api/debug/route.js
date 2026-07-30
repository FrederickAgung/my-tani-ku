export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { readCollection, isSupabaseConfigured } from '@/lib/supabaseData'

export async function GET() {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  const env = {
    SUPABASE_URL_set: !!process.env.SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_URL_set: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY_set: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    SUPABASE_ANON_KEY_set: !!process.env.SUPABASE_ANON_KEY,
    NEXT_PUBLIC_SUPABASE_ANON_KEY_set: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    resolvedUrl: supabaseUrl ? supabaseUrl.substring(0, 20) + '...' : 'null',
    resolvedKeyLength: supabaseKey ? supabaseKey.length : 0,
    resolvedKeyPrefix: supabaseKey ? supabaseKey.substring(0, 8) + '...' + supabaseKey.substring(supabaseKey.length - 4) : 'null',
    isConfigured: isSupabaseConfigured(),
    cwd: process.cwd(),
  }

  let sellerProducts = []
  let sellerError = null
  try {
    sellerProducts = await readCollection('seller_products')
  } catch (e) {
    sellerError = e.message
  }

  let produk = []
  let produkError = null
  try {
    produk = await readCollection('produk')
  } catch (e) {
    produkError = e.message
  }

  const result = {
    env,
    sellerProducts: {
      count: sellerProducts.length,
      names: sellerProducts.map(p => p.nama),
      error: sellerError,
    },
    produk: {
      count: produk.length,
      error: produkError,
    },
    combined: [...produk, ...sellerProducts].length,
  }

  return Response.json(result)
}
