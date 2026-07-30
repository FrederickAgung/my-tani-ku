'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'

export default function EditProdukPage() {
  const router = useRouter()
  const { id } = useParams()
  const [user, setUser] = useState(null)
  const [form, setForm] = useState({ nama: '', kategori: 'hasil-tani', harga: '', deskripsi: '' })
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const u = localStorage.getItem('myTaniku_user')
    if (!u || JSON.parse(u).role !== 'petani') {
      router.push('/login')
      return
    }
    const parsed = JSON.parse(u)
    setUser(parsed)

    // Fetch existing product
    fetch('/api/produk/seller')
      .then(r => r.json())
      .then(data => {
        const produk = data.find(p => p.id === Number(id))
        if (!produk || produk.penjual !== parsed.nama) {
          setNotFound(true)
        } else {
          setForm({
            nama: produk.nama || '',
            kategori: produk.kategori || 'hasil-tani',
            harga: produk.harga?.toString() || '',
            deskripsi: produk.deskripsi || '',
          })
        }
      })
      .finally(() => setFetching(false))
  }, [router, id])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user || loading) return
    setLoading(true)

    const res = await fetch('/api/produk/seller', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: Number(id),
        nama: form.nama,
        kategori: form.kategori,
        harga: form.harga,
        deskripsi: form.deskripsi,
      }),
    })

    setLoading(false)
    if (res.ok) router.push('/seller')
  }

  if (fetching) return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center text-gray-400">
      <span className="animate-spin w-6 h-6 border-2 border-gray-300 border-t-notion-blue rounded-full inline-block"></span>
      <p className="mt-3">Memuat produk...</p>
    </div>
  )

  if (notFound) return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center text-gray-400">
      <p className="text-5xl mb-4">🔍</p>
      <p className="text-lg">Produk tidak ditemukan</p>
      <Link href="/seller" className="text-notion-blue hover:text-notion-blue-hover mt-2 inline-block font-medium">&larr; Kembali</Link>
    </div>
  )

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <Link href="/seller" className="text-notion-blue hover:text-notion-blue-hover text-sm font-medium">&larr; Kembali</Link>
      <h1 className="text-2xl font-bold mt-4 mb-6" style={{color: 'rgba(0,0,0,0.95)'}}>Edit Produk</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nama Produk</label>
          <input type="text" name="nama" required value={form.nama} onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
          <select name="kategori" value={form.kategori} onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white">
            <option value="peralatan">Peralatan Tani</option>
            <option value="hasil-tani">Hasil Tani</option>
            <option value="benih">Benih</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Harga (Rp)</label>
          <input type="number" name="harga" required min={100} value={form.harga} onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
          <textarea name="deskripsi" rows={3} value={form.deskripsi} onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" />
        </div>

        <button type="submit" disabled={loading}
          className="w-full bg-notion-blue hover:bg-notion-blue-hover disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded transition flex items-center justify-center gap-2">
          {loading ? (
            <>
              <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>
              Menyimpan...
            </>
          ) : (
            'Simpan Perubahan'
          )}
        </button>
      </form>
    </div>
  )
}
