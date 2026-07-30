export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { readCollection, uploadPublicFile, writeCollection } from '@/lib/supabaseData'

export async function POST(req) {
  const formData = await req.formData()

  const nama = formData.get('nama')
  const kategori = formData.get('kategori')
  const harga = parseInt(formData.get('harga'))
  const deskripsi = formData.get('deskripsi') || ''
  const penjual = formData.get('penjual')
  const gambarFile = formData.get('gambar')

  let gambar = `https://placehold.co/300x300/e8f5e9/2e7d32?text=${encodeURIComponent((nama || '').slice(0, 12))}`

  if (gambarFile && gambarFile.size > 0) {
    try {
      gambar = await uploadPublicFile(gambarFile, 'uploads')
    } catch (err) {
      console.error('Upload error:', err)
    }
  }

  const products = await readCollection('seller_products')
  const newProduct = {
    id: Date.now(),
    nama,
    kategori,
    harga,
    deskripsi,
    rating: 0,
    stok: true,
    penjual,
    gambar
  }
  products.push(newProduct)
  await writeCollection('seller_products', products)
  return Response.json({ produk: newProduct })
}

export async function GET() {
  const products = await readCollection('seller_products')
  return Response.json(products)
}

export async function PATCH(req) {
  const { id, nama, kategori, harga, deskripsi } = await req.json()

  const products = await readCollection('seller_products')
  const index = products.findIndex(p => p.id === id)
  if (index === -1) return Response.json({ error: 'Produk tidak ditemukan' }, { status: 404 })

  if (nama) products[index].nama = nama
  if (kategori) products[index].kategori = kategori
  if (harga) products[index].harga = parseInt(harga)
  if (deskripsi !== undefined) products[index].deskripsi = deskripsi

  await writeCollection('seller_products', products)
  return Response.json({ produk: products[index] })
}
