'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function TambahProdukPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [form, setForm] = useState({ nama: '', kategori: 'hasil-tani', harga: '', deskripsi: '' })
  const [gambar, setGambar] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const u = localStorage.getItem('myTaniku_user')
    if (!u || JSON.parse(u).role !== 'petani') router.push('/login')
    else setUser(JSON.parse(u))
  }, [router])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleFile = (e) => {
    const file = e.target.files[0]
    if (file) {
      setGambar(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) return
    setLoading(true)

    const fd = new FormData()
    fd.append('nama', form.nama)
    fd.append('kategori', form.kategori)
    fd.append('harga', form.harga)
    fd.append('deskripsi', form.deskripsi)
    fd.append('penjual', user.nama)
    if (gambar) fd.append('gambar', gambar)

    const res = await fetch('/api/produk/seller', {
      method: 'POST',
      body: fd,
    })

    setLoading(false)
    if (res.ok) router.push('/seller')
  }

  if (!user) return null

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <Link href="/seller" className="text-notion-blue hover:text-notion-blue-hover text-sm font-medium">&larr; Kembali</Link>
      <h1 className="text-2xl font-bold mt-4 mb-6" style={{color: 'rgba(0,0,0,0.95)'}}>Tambah Produk</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 space-y-4">
        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Gambar Produk</label>
          <div
            onClick={() => document.getElementById('gambarInput').click()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-notion-blue transition text-center"
          >
            {preview ? (
              <div className="relative inline-block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={preview} alt="Preview" className="w-40 h-40 object-cover rounded-lg mx-auto" />
                <p className="text-xs text-notion-gray mt-2">Klik untuk ganti gambar</p>
              </div>
            ) : (
              <div className="py-6">
                <i className="fas fa-cloud-upload-alt text-3xl text-gray-300 mb-2"></i>
                <p className="text-sm text-gray-500">Klik untuk upload gambar</p>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG, atau WEBP</p>
              </div>
            )}
          </div>
          <input
            id="gambarInput"
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="hidden"
          />
        </div>

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
              <i className="fas fa-spinner fa-spin"></i>
              Menyimpan...
            </>
          ) : (
            'Simpan Produk'
          )}
        </button>
      </form>
    </div>
  )
}

