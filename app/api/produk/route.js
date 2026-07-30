export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { readCollection } from '@/lib/supabaseData'

export async function GET() {
  const [produk, sellerProduk] = await Promise.all([
    readCollection('produk'),
    readCollection('seller_products'),
  ])

  return Response.json([...produk, ...sellerProduk])
}
