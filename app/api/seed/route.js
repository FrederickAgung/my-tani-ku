export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { readCollection, writeCollection } from '@/lib/supabaseData'

export async function GET() {
  // Ambil data dari Supabase (via service role key)
  const sellerProducts = await readCollection('seller_products')
  const produkList = await readCollection('produk')
  const users = await readCollection('users')
  const orders = await readCollection('orders')

  return Response.json({
    sellerProducts: { count: sellerProducts.length, names: sellerProducts.map(p => p.nama) },
    produk: { count: produkList.length },
    users: { count: users.length },
    orders: { count: orders.length },
  })
}

// POST untuk seed data dari request body
export async function POST(req) {
  const { collection, data } = await req.json()
  await writeCollection(collection, data)
  return Response.json({ ok: true, collection, count: data.length })
}
