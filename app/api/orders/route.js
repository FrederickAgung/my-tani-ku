export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { addNotification, readCollection, writeCollection } from '@/lib/supabaseData'

export async function POST(req) {
  const body = await req.json()
  const orders = await readCollection('orders')
  const order = {
    id: Date.now(),
    buyerId: body.buyerId,
    buyerNama: body.buyerNama,
    buyerEmail: body.buyerEmail || '',
    items: body.items,
    total: body.total,
    metode: body.metode,
    alamat: body.alamat || '',
    status: 'pending',
    courier: '',
    tracking: '',
    tanggal: new Date().toISOString(),
    paymentStatus: body.metode === 'midtrans' ? 'pending' : 'paid'
  }
  orders.unshift(order)
  await writeCollection('orders', orders)

  const uniqueSellers = [...new Set(body.items.map(i => i.penjual))]
  for (const penjual of uniqueSellers) {
    await addNotification({
      targetRole: 'seller',
      targetName: penjual,
      type: 'order',
      title: 'Pesanan Masuk',
      message: `${body.buyerNama} memesan ${body.items.filter(i => i.penjual === penjual).length} item darimu`,
      link: '/pesanan'
    })
  }

  await addNotification({
    userId: body.buyerId,
    type: 'order',
    title: 'Pesanan Dibuat',
    message: `Pesanan #${order.id} berhasil dibuat — Rp ${body.total.toLocaleString('id-ID')}`,
    link: '/pesanan'
  })

  return Response.json({ order })
}

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const role = searchParams.get('role')
  const userId = Number(searchParams.get('userId'))
  const nama = searchParams.get('nama')
  const orders = await readCollection('orders')

  let filtered = orders
  if (role === 'buyer') filtered = orders.filter(o => o.buyerId === userId)
  if (role === 'seller') filtered = orders.filter(o => o.items.some(i => i.penjual === nama))

  return Response.json(filtered)
}

export async function PATCH(req) {
  const { id, action, courier, tracking } = await req.json()
  const orders = await readCollection('orders')
  const order = orders.find(o => o.id === id)
  if (!order) return Response.json({ error: 'Order not found' }, { status: 404 })

  if (action === 'ship') {
    order.status = 'shipped'
    order.courier = courier
    order.tracking = tracking

    await addNotification({
      userId: order.buyerId,
      type: 'shipping',
      title: 'Pesanan Dikirim',
      message: `Pesanan #${order.id} dikirim via ${courier} — No. Resi: ${tracking}`,
      link: '/pesanan'
    })
  }

  if (action === 'deliver') {
    order.status = 'delivered'

    const penjualItems = order.items.filter(i => i.penjual)
    const penjualSet = [...new Set(penjualItems.map(i => i.penjual))]
    for (const p of penjualSet) {
      await addNotification({
        targetRole: 'seller',
        targetName: p,
        type: 'shipping',
        title: 'Pesanan Diterima',
        message: `${order.buyerNama} telah menerima pesanan #${order.id}`,
        link: '/pesanan'
      })
    }

    await addNotification({
      userId: order.buyerId,
      type: 'shipping',
      title: 'Pesanan Selesai',
      message: `Pesanan #${order.id} selesai. Beri ulasan yuk!`,
      link: `/katalog/${order.items[0]?.id || ''}`
    })
  }

  await writeCollection('orders', orders)
  return Response.json({ order })
}
