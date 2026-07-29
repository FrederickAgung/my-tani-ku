export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { readCollection } from '@/lib/supabaseData'

export async function GET() {
  await new Promise(r => setTimeout(r, 200))

  const produk = await readCollection('produk')
  const sellerProduk = await readCollection('seller_products')

  return Response.json([...produk, ...sellerProduk])
}
