export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { readCollection, writeCollection } from '@/lib/supabaseData'

export async function POST(req) {
  const { penjual, jumlah, bank, norek, pemilik } = await req.json()

  // Hitung total penjualan dari order delivered
  const orders = await readCollection('orders')
  const totalRevenue = orders
    .filter(o => o.status === 'delivered')
    .flatMap(o => o.items)
    .filter(i => i.penjual === penjual)
    .reduce((s, i) => s + i.harga * (i.qty || 1), 0)

  // Hitung total penarikan sebelumnya
  const withdrawals = await readCollection('withdrawals')
  const totalWithdrawn = withdrawals
    .filter(w => w.penjual === penjual)
    .reduce((s, w) => s + w.jumlah, 0)

  const saldo = totalRevenue - totalWithdrawn

  if (jumlah > saldo) {
    return Response.json({ error: 'Saldo tidak cukup' }, { status: 400 })
  }

  const withdraw = {
    id: Date.now(),
    penjual,
    jumlah,
    bank,
    norek,
    pemilik,
    status: 'pending',
    createdAt: new Date().toISOString()
  }

  withdrawals.push(withdraw)
  await writeCollection('withdrawals', withdrawals)

  return Response.json({ withdraw, sisaSaldo: saldo - jumlah })
}

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const penjual = searchParams.get('penjual')

  const withdrawals = await readCollection('withdrawals')
  const filtered = penjual ? withdrawals.filter(w => w.penjual === penjual) : withdrawals

  return Response.json(filtered)
}
