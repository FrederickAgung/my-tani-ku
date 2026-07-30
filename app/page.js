'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function HomePage() {
  const [produk, setProduk] = useState([])
  const [user, setUser] = useState(null)

  useEffect(() => {
    fetch('/api/produk/seller').then(r => r.json()).then(setProduk)
    try { setUser(JSON.parse(localStorage.getItem('myTaniku_user'))) } catch {}
  }, [])

  const kategori = [
    { nama: 'Peralatan Tani', icon: 'fa-tools', slug: 'peralatan', desc: 'Traktor, pompa, cangkul, dan alat pertanian lainnya', color: 'from-notion-dark to-black' },
    { nama: 'Hasil Tani', icon: 'fa-leaf', slug: 'hasil-tani', desc: 'Sayuran, buah, rempah dan hasil panen segar', color: 'from-[#dd5b00] to-[#a03f00]' },
    { nama: 'Benih', icon: 'fa-seedling', slug: 'benih', desc: 'Benih padi, jagung, cabe dan tanaman unggul', color: 'from-[#1aae39] to-[#0d7a22]' },
  ]

  const stars = (n) => '★'.repeat(Math.floor(n)) + (n % 1 >= 0.5 ? '½' : '')

  return (
    <div>
      {/* Hero */}
      <section className="bg-notion-dark text-white">
        <div className="max-w-6xl mx-auto px-4 py-20 md:py-28 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">MyTani Ku</h1>
          <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-8">
            Marketplace digital untuk petani Indonesia. Beli peralatan, hasil tani, dan benih langsung dari petani tanpa tengkulak.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/katalog" className="bg-notion-blue hover:bg-notion-blue-hover text-white font-medium px-8 py-3 rounded text-lg transition">
              Jelajahi Produk
            </Link>
            {!user ? (
              <Link href="/register" className="border border-white/30 hover:border-white text-white/80 hover:text-white px-8 py-3 rounded text-lg transition">
                Daftar Jadi Petani
              </Link>
            ) : user.role === 'petani' ? (
              <Link href="/seller/tambah" className="border border-white/30 hover:border-white text-white/80 hover:text-white px-8 py-3 rounded text-lg transition">
                + Tambah Produk
              </Link>
            ) : (
              <Link href="/katalog" className="border border-white/30 hover:border-white text-white/80 hover:text-white px-8 py-3 rounded text-lg transition">
                Belanja Sekarang
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Kategori */}
      <section className="bg-warm max-w-full mx-auto px-4 py-16" style={{backgroundColor: '#f6f5f4'}}>
        <h2 className="text-2xl font-bold text-center mb-10" style={{color: 'rgba(0,0,0,0.95)'}}>Kategori Produk</h2>
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
          {kategori.map((k) => (
            <Link key={k.slug} href={`/katalog?kategori=${k.slug}`}
              className="bg-white border border-[rgba(0,0,0,0.1)] rounded-lg hover:shadow-notion overflow-hidden transition group">
              <div className={`bg-gradient-to-r ${k.color} p-6 text-center`}>
                <i className={`fas ${k.icon} text-5xl text-white/80`}></i>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-lg mb-1 transition" style={{color: 'rgba(0,0,0,0.95)'}}>{k.nama}</h3>
                <p className="text-notion-gray text-sm">{k.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Produk Unggulan */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-10" style={{color: 'rgba(0,0,0,0.95)'}}>Produk Unggulan</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {produk.filter(p => p.stok).slice(0, 4).map((p) => (
              <Link key={p.id} href={`/katalog/${p.id}`} className="border border-[rgba(0,0,0,0.1)] rounded-lg overflow-hidden hover:shadow-notion transition">
                <div className="aspect-square bg-warm flex items-center justify-center p-2" style={{backgroundColor: '#f6f5f4'}}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.gambar} alt={p.nama} className="w-full h-full object-contain" />
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-sm truncate">{p.nama}</h3>
                  <p className="text-notion-blue font-bold mt-1">Rp {p.harga.toLocaleString('id-ID')}</p>
                  <p className="text-[#dd5b00] text-xs mt-0.5">{stars(p.rating)}</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/katalog" className="text-notion-blue hover:text-notion-blue-hover font-medium">
              Lihat Semua Produk &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-notion-dark text-white py-16 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            {user ? 'Jelajahi Produk MyTani Ku' : 'Gabung Jadi Petani MyTani Ku'}
          </h2>
          <p className="text-white/60 mb-8">
            {user ? 'Temukan peralatan, hasil tani, dan benih berkualitas.' : 'Jual hasil panenmu langsung ke konsumen. Harga lebih adil, tanpa potongan tengkulak.'}
          </p>
          {!user ? (
            <Link href="/register" className="bg-notion-blue hover:bg-notion-blue-hover text-white font-medium px-8 py-3 rounded transition inline-block">
              Daftar Sekarang
            </Link>
          ) : (
            <Link href="/katalog" className="bg-notion-blue hover:bg-notion-blue-hover text-white font-medium px-8 py-3 rounded transition inline-block">
              Jelajahi Katalog
            </Link>
          )}
        </div>
      </section>
    </div>
  )
}
