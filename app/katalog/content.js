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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Katalog Produk</h1>
          <p className="text-text-muted text-sm mt-1">{filtered.length} produk ditemukan</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-sm"></i>
          <input type="text" placeholder="Cari produk..." value={search} onChange={e => setSearch(e.target.value)}
            className="input-field pl-9" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {kategoriList.map(k => (
            <button key={k.value} onClick={() => setKategoriFilter(k.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                kategoriFilter === k.value
                  ? 'bg-accent-green text-white'
                  : 'bg-white border border-border-medium text-text-secondary hover:text-text-primary hover:border-accent-green'
              }`}>
              {k.label}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-accent-green-light rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-search text-accent-green text-xl"></i>
          </div>
          <p className="text-lg font-medium text-text-primary">Produk tidak ditemukan</p>
          <p className="text-sm text-text-muted mt-1">Coba kata kunci atau filter lain</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map(p => (
            <Link key={p.id} href={`/katalog/${p.id}`}
              className="card-hover group">
              <div className="aspect-square bg-surface-warm flex items-center justify-center p-3">
                <img src={p.gambar} alt={p.nama} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="p-4">
                <span className="badge-green text-[10px] mb-2 inline-block">
                  {p.kategori === 'hasil-tani' ? 'Hasil Tani' : p.kategori}
                </span>
                <h3 className="font-semibold text-sm group-hover:text-accent-green transition truncate">{p.nama}</h3>
                <p className="text-accent-green font-bold mt-1">Rp {p.harga.toLocaleString('id-ID')}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-amber-600 text-xs">{stars(p.rating)}</span>
                  <span className="text-xs text-text-muted">{p.rating}</span>
                </div>
                <p className="text-xs text-text-muted mt-1">{p.penjual}</p>
                {!p.stok && <span className="text-xs text-accent-red font-semibold">Stok Habis</span>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
