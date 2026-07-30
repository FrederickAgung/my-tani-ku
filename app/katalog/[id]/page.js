'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

export default function DetailProdukPage() {
  const { id } = useParams()
  const router = useRouter()
  const [produk, setProduk] = useState(null)
  const [added, setAdded] = useState(false)
  const [user, setUser] = useState(null)
  const [reviews, setReviews] = useState([])
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewForm, setReviewForm] = useState({ rating: 5, komentar: '' })
  const [reviewSent, setReviewSent] = useState(false)
  const [reviewError, setReviewError] = useState('')

  useEffect(() => {
    try { setUser(JSON.parse(localStorage.getItem('myTaniku_user'))) } catch {}
    loadReviews()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const loadProduk = async () => {
    const res = await fetch('/api/produk/seller')
    const data = await res.json()
    const found = data.find(p => p.id === Number(id))
    setProduk(found)
  }

  const loadReviews = async () => {
    fetch(`/api/reviews?productId=${id}`).then(r => r.json()).then(setReviews)
  }

  const hasReviewed = reviews.some(r => r.userId === user?.id)

  const submitReview = async (e) => {
    e.preventDefault()
    setReviewError('')
    if (!user) { router.push('/login'); return }
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user.id,
        userNama: user.nama,
        productId: Number(id),
        rating: reviewForm.rating,
        komentar: reviewForm.komentar
      })
    })
    const data = await res.json()
    if (res.ok) {
      setReviewSent(true)
      loadReviews()
      loadProduk()
    } else {
      setReviewError(data.error || 'Gagal mengirim ulasan')
    }
  }

  useEffect(() => { loadProduk() }, [id])

  const cartKey = () => {
    const u = localStorage.getItem('myTaniku_user')
    if (!u) return null
    return `myTaniku_cart_${JSON.parse(u).id}`
  }

  const beli = () => {
    if (!produk) return
    const key = cartKey()
    if (!key) { router.push('/login'); return }
    const cart = JSON.parse(localStorage.getItem(key) || '[]')
    const existing = cart.find(i => i.id === produk.id)
    if (existing) {
      existing.qty = (existing.qty || 1) + 1
    } else {
      cart.push({ id: produk.id, nama: produk.nama, harga: produk.harga, gambar: produk.gambar, qty: 1, penjual: produk.penjual })
    }
    localStorage.setItem(key, JSON.stringify(cart))
    setAdded(true)
  }

  const startChat = async () => {
    if (!user) { router.push('/login'); return }
    if (!produk) return

    // Cari percakapan yang sudah ada
    const res = await fetch(`/api/chat?buyerId=${user.id}&seller=${encodeURIComponent(produk.penjual)}`)
    const existing = await res.json()

    if (existing && existing.id) {
      router.push(`/chat/${existing.id}`)
    } else {
      // Buat percakapan baru dengan pesan awal
      const newConv = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyerId: user.id,
          buyerName: user.nama,
          sellerName: produk.penjual,
          message: `Halo, saya tertarik dengan produk ${produk.nama}. Apakah masih tersedia?`
        })
      })
      const data = await newConv.json()
      router.push(`/chat/${data.conversation.id}`)
    }
  }

  const stars = (n) => '★'.repeat(Math.floor(n)) + (n % 1 >= 0.5 ? '½' : '')

  if (!produk) return (
    <div className="max-w-4xl mx-auto px-4 py-20 text-center text-gray-400">
      <p className="text-5xl mb-4">🔍</p>
      <p className="text-lg">Produk tidak ditemukan</p>
      <Link href="/katalog" className="text-green-700 hover:text-green-500 mt-2 inline-block">&larr; Kembali</Link>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link href="/katalog" className="text-green-700 hover:text-green-500 text-sm font-semibold">&larr; Kembali ke Katalog</Link>

      <div className="mt-4 grid md:grid-cols-2 gap-8">
        <div className="aspect-square bg-gray-50 rounded-xl flex items-center justify-center p-8 border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={produk.gambar} alt={produk.nama} className="w-full h-full object-contain" />
        </div>

        <div>
          <span className="text-xs bg-[#f2f9ff] text-[#097fe8] px-2 py-0.5 rounded-full capitalize">
            {produk.kategori === 'hasil-tani' ? 'Hasil Tani' : produk.kategori}
          </span>
          <h1 className="text-2xl font-bold mt-2">{produk.nama}</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[#dd5b00]">{stars(produk.rating)}</span>
            <span className="text-sm text-gray-400">{produk.rating} · {reviews.length} ulasan</span>
          </div>
          <p className="text-3xl font-bold text-notion-blue mt-4">Rp {produk.harga.toLocaleString('id-ID')}</p>
          <p className="text-sm text-gray-500 mt-1">Penjual: {produk.penjual}</p>

          <p className="mt-6 text-gray-600 leading-relaxed">{produk.deskripsi}</p>

          {!produk.stok && <p className="text-red-500 font-semibold mt-4">Stok habis</p>}

          {added ? (
            <div className="mt-6 flex gap-3">
              <span className="bg-[#f2f9ff] text-notion-blue px-4 py-2.5 rounded font-medium">Ditambahkan ke Keranjang</span>
              <Link href="/keranjang" className="bg-notion-blue hover:bg-notion-blue-hover text-white px-4 py-2.5 rounded font-medium">Lihat Keranjang</Link>
            </div>
          ) : (
            <>
              <button onClick={beli} disabled={!produk.stok}
                className="mt-6 w-full bg-notion-blue hover:bg-notion-blue-hover disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3 rounded transition text-lg">
                {produk.stok ? 'Beli' : 'Stok Habis'}
              </button>

              <button onClick={startChat}
                className="mt-2 w-full border border-notion-blue text-notion-blue hover:bg-[#f2f9ff] font-medium py-2.5 rounded transition text-sm flex items-center justify-center gap-2">
                <i className="fas fa-comment"></i>
                Chat dengan Penjual
              </button>
            </>
          )}
        </div>
      </div>

      {/* Ulasan */}
      <div className="mt-12 border-t border-[rgba(0,0,0,0.1)] pt-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Ulasan Pembeli ({reviews.length})</h2>
          {user && !hasReviewed && !reviewSent && (
            <button onClick={() => setShowReviewForm(!showReviewForm)}
              className="text-sm bg-notion-blue hover:bg-notion-blue-hover text-white px-4 py-1.5 rounded font-medium">
              <i className="fas fa-star mr-1"></i>Beri Ulasan
            </button>
          )}
        </div>

        {/* Form ulasan */}
        {showReviewForm && (
          <form onSubmit={submitReview} className="bg-white border border-[rgba(0,0,0,0.1)] rounded-lg p-5 mb-6">
            <h3 className="font-semibold mb-3">Tulis Ulasan</h3>

            {reviewError && <p className="bg-red-50 text-red-600 text-sm p-2.5 rounded mb-3">{reviewError}</p>}

            <div className="mb-3">
              <p className="text-sm text-notion-gray mb-2">Rating</p>
              <div className="flex gap-1">
                {[1,2,3,4,5].map(b => (
                  <button key={b} type="button" onClick={() => setReviewForm({...reviewForm, rating: b})}
                    className={`text-2xl transition ${reviewForm.rating >= b ? 'text-amber-400' : 'text-gray-200'}`}>
                    ★
                  </button>
                ))}
                <span className="ml-2 text-sm text-notion-gray self-center">{reviewForm.rating}/5</span>
              </div>
            </div>

            <div className="mb-3">
              <label className="block text-sm text-notion-gray mb-1">Komentar (opsional)</label>
              <textarea value={reviewForm.komentar} onChange={e => setReviewForm({...reviewForm, komentar: e.target.value})}
                rows={3} placeholder="Bagikan pengalamanmu dengan produk ini..."
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-notion-blue" />
            </div>

            <div className="flex gap-2">
              <button type="submit" className="bg-notion-blue hover:bg-notion-blue-hover text-white px-5 py-2 rounded text-sm font-medium">
                Kirim Ulasan
              </button>
              <button type="button" onClick={() => setShowReviewForm(false)}
                className="border border-[rgba(0,0,0,0.2)] text-notion-gray px-4 py-2 rounded text-sm">
                Batal
              </button>
            </div>
          </form>
        )}

        {reviewSent && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center gap-3">
            <i className="fas fa-check-circle text-green-600"></i>
            <p className="text-sm text-green-700">Ulasan berhasil dikirim! Terima kasih atas partisipasimu.</p>
          </div>
        )}

        {reviews.length === 0 ? (
          <div className="text-center py-10 text-notion-gray">
            <i className="fas fa-star text-3xl mb-2 opacity-30"></i>
            <p className="text-sm">Belum ada ulasan untuk produk ini</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map(r => (
              <div key={r.id} className="bg-white border border-[rgba(0,0,0,0.1)] rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold">
                      {r.userNama[0]?.toUpperCase()}
                    </div>
                    <span className="font-medium text-sm">{r.userNama}</span>
                    <span className="text-[#dd5b00] text-xs">{stars(r.rating)}</span>
                  </div>
                  <span className="text-[10px] text-notion-gray">
                    {new Date(r.createdAt).toLocaleDateString('id-ID', { day:'numeric', month:'short', year:'numeric' })}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{r.komentar}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
