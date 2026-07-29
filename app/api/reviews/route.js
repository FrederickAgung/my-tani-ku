export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { addNotification, readCollection, writeCollection } from '@/lib/supabaseData'

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const productId = searchParams.get('productId')
  const userId = Number(searchParams.get('userId'))

  let reviews = await readCollection('reviews')
  if (productId) reviews = reviews.filter(r => r.productId === Number(productId))
  if (userId) reviews = reviews.filter(r => r.userId === userId)

  return Response.json(reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
}

export async function POST(req) {
  const { userId, userNama, productId, rating, komentar } = await req.json()

  if (!rating || rating < 1 || rating > 5) {
    return Response.json({ error: 'Rating harus 1-5' }, { status: 400 })
  }

  const reviews = await readCollection('reviews')

  const existing = reviews.find(r => r.userId === userId && r.productId === Number(productId))
  if (existing) {
    return Response.json({ error: 'Kamu sudah memberi ulasan untuk produk ini' }, { status: 400 })
  }

  const review = {
    id: Date.now(),
    userId,
    userNama,
    productId: Number(productId),
    rating: Number(rating),
    komentar: komentar || '',
    createdAt: new Date().toISOString()
  }
  reviews.unshift(review)
  await writeCollection('reviews', reviews)

  const produkList = await readCollection('produk')
  const sellerList = await readCollection('seller_products')
  const productReviews = reviews.filter(r => r.productId === Number(productId))
  const avgRating = productReviews.reduce((s, r) => s + r.rating, 0) / productReviews.length

  const updateRating = (list) => {
    const idx = list.findIndex(p => p.id === Number(productId))
    if (idx >= 0) {
      list[idx].rating = Math.round(avgRating * 10) / 10
      return true
    }
    return false
  }

  if (!updateRating(produkList)) updateRating(sellerList)
  await writeCollection('produk', produkList)
  await writeCollection('seller_products', sellerList)

  const semuaProduk = [...produkList, ...sellerList]
  const prod = semuaProduk.find(p => p.id === Number(productId))
  const sellerPenjual = prod?.penjual || ''

  await addNotification({
    targetRole: 'seller',
    targetName: sellerPenjual,
    type: 'review',
    title: 'Ulasan Baru',
    message: `${userNama} memberi rating ${rating}/5 untuk produkmu`,
    link: `/katalog/${productId}`
  })

  return Response.json({ review })
}
