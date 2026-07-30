export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { readCollection } from '@/lib/supabaseData'

export async function GET() {
  const sellerProduk = await readCollection('seller_products')

  return Response.json(sellerProduk)
}
