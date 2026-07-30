'use client'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function KatalogContent() {
  const [produk, setProduk] = useState([])
  const [search, setSearch] = useState('')
  const [kategoriFilter, setKategoriFilter] = useState('semua')
  const searchParams = useSearchParams()

  useEffect(() => {
    fetch('/api/produk/seller').then(r => r.json()).then(setProduk)
    const k = searchParams.get('kategori')
    if (k) setKategoriFilter(k)
  }, [searchParams])

  const filtered = produk.filter(p => {
    const matchSearch = p.nama.toLowerCase().includes(search.toLowerCase())
    const matchKategori = kategoriFilter === 'semua' || p.kategori === kategoriFilter
    return matchSearch && matchKategori
  })

  const stars = (n) => '★'.repeat(Math.floor(n)) + (n % 1 >= 0.5 ? '½' : '')

  const kategoriList = [
    { label: 'Semua', value: 'semua' },
    { label: 'Peralatan Tani', value: 'peralatan' },
    { label: 'Hasil Tani', value: 'hasil-tani' },
    { label: 'Benih', value: 'benih' },
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6" style={{color: 'rgba(0,0,0,0.95)'}}>Katalog Produk</h1>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input type="text" placeholder="Cari produk..." value={search} onChange={e => setSearch(e.target.value)}
          className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" />
        <select value={kategoriFilter} onChange={e => setKategoriFilter(e.target.value)}
          className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white">
          {kategoriList.map(k => <option key={k.value} value={k.value}>{k.label}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-lg">Produk tidak ditemukan</p>
          <p className="text-sm mt-1">Coba kata kunci atau filter lain</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map(p => (
            <Link key={p.id} href={`/katalog/${p.id}`} className="bg-white border rounded-xl overflow-hidden hover:shadow-lg transition group">
              <div className="aspect-square bg-gray-50 flex items-center justify-center p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.gambar} alt={p.nama} className="w-full h-full object-contain" />
              </div>
              <div className="p-4">
                <span className="text-xs bg-[#f2f9ff] text-[#097fe8] px-2 py-0.5 rounded-full capitalize">
                  {p.kategori === 'hasil-tani' ? 'Hasil Tani' : p.kategori}
                </span>
                <h3 className="font-semibold mt-2 group-hover:text-green-700 transition truncate">{p.nama}</h3>
                <p className="text-notion-blue font-bold mt-1">Rp {p.harga.toLocaleString('id-ID')}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-amber-500 text-xs">{stars(p.rating)}</span>
                  <span className="text-xs text-gray-400">{p.rating}</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">{p.penjual}</p>
                {!p.stok && <span className="text-xs text-red-500 font-semibold">Stok Habis</span>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
