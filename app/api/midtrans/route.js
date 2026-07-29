export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { readCollection, writeCollection } from '@/lib/supabaseData'

export async function POST(req) {
  const { orderId, total, buyerNama, buyerEmail } = await req.json()

  const snapToken = 'snap_' + Math.random().toString(36).slice(2, 10)

  const transactions = await readCollection('midtrans_transactions')
  transactions.push({
    orderId,
    snapToken,
    grossAmount: total,
    status: 'pending',
    buyerNama,
    buyerEmail,
    transactionTime: new Date().toISOString(),
    paymentType: null,
    settlementTime: null
  })
  await writeCollection('midtrans_transactions', transactions)

  return Response.json({ snapToken, redirectUrl: `/payment/${snapToken}` })
}

export async function PATCH(req) {
  const { snapToken, orderId } = await req.json()
  const transactions = await readCollection('midtrans_transactions')
  const tx = transactions.find(t => t.snapToken === snapToken || t.orderId === Number(orderId))
  if (!tx) return Response.json({ error: 'Transaction not found' }, { status: 404 })

  tx.status = 'settlement'
  tx.paymentType = tx.paymentType || 'bank_transfer'
  tx.settlementTime = new Date().toISOString()
  await writeCollection('midtrans_transactions', transactions)

  const orders = await readCollection('orders')
  const order = orders.find(o => o.id === Number(tx.orderId))
  if (order) {
    order.status = 'pending'
    order.paymentStatus = 'paid'
    order.metode = `Midtrans - ${tx.paymentType}`
    await writeCollection('orders', orders)
  }

  return Response.json({ status: 'settlement', transaction: tx })
}

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const orderId = searchParams.get('orderId')
  const transactions = await readCollection('midtrans_transactions')
  if (orderId) return Response.json(transactions.find(t => t.orderId === Number(orderId)) || null)
  return Response.json(transactions)
}
