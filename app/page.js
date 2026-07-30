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
    { nama: 'Peralatan Tani', icon: 'fa-tools', slug: 'peralatan', desc: 'Traktor, pompa, cangkul, dan alat pertanian lainnya', color: 'from-emerald-600 to-emerald-800' },
    { nama: 'Hasil Tani', icon: 'fa-leaf', slug: 'hasil-tani', desc: 'Sayuran, buah, rempah dan hasil panen segar', color: 'from-amber-600 to-orange-700' },
    { nama: 'Benih', icon: 'fa-seedling', slug: 'benih', desc: 'Benih padi, jagung, cabe dan tanaman unggul', color: 'from-lime-600 to-green-800' },
  ]

  const stars = (n) => '★'.repeat(Math.floor(n)) + (n % 1 >= 0.5 ? '½' : '')

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-bumi-900 via-bumi-800 to-bumi-950"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-accent-green rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-500 rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-6xl mx-auto px-4 py-20 md:py-28 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white/80 text-xs font-medium px-4 py-1.5 rounded-pill mb-6">
            <i className="fas fa-leaf text-accent-green"></i>
            Marketplace Pertanian Indonesia
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight leading-tight">
            Dari Petani,{' '}
            <span className="text-accent-green">Langsung</span>{' '}
            ke Kamu
          </h1>
          <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
            Beli peralatan, hasil tani, dan benih langsung dari petani Indonesia.
            Harga lebih adil, tanpa tengkulak.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/katalog"
              className="bg-accent-green hover:bg-accent-green-hover text-white font-medium px-8 py-3 rounded-lg text-lg transition shadow-lg shadow-accent-green/25">
              <i className="fas fa-store mr-2"></i>
              Jelajahi Produk
            </Link>
            {!user ? (
              <Link href="/register"
                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/20 px-8 py-3 rounded-lg text-lg transition">
                <i className="fas fa-user-plus mr-2"></i>
                Daftar Jadi Petani
              </Link>
            ) : user.role === 'petani' ? (
              <Link href="/seller/tambah"
                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/20 px-8 py-3 rounded-lg text-lg transition">
                <i className="fas fa-plus mr-2"></i>
                Tambah Produk
              </Link>
            ) : (
              <Link href="/katalog"
                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/20 px-8 py-3 rounded-lg text-lg transition">
                <i className="fas fa-shopping-bag mr-2"></i>
                Belanja Sekarang
              </Link>
            )}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-surface-warm to-transparent"></div>
      </section>

      {/* Kategori */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-text-primary">Kategori Produk</h2>
          <p className="text-text-muted mt-2">Temukan kebutuhan pertanianmu</p>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {kategori.map((k) => (
            <Link key={k.slug} href={`/katalog?kategori=${k.slug}`}
              className="group card-hover overflow-hidden">
              <div className={`bg-gradient-to-r ${k.color} p-6 text-center`}>
                <i className={`fas ${k.icon} text-4xl text-white/80`}></i>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-lg mb-1 group-hover:text-accent-green transition">{k.nama}</h3>
                <p className="text-text-muted text-sm">{k.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Produk Unggulan */}
      <section className="bg-white py-16 border-y border-border-light">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-text-primary">Produk Unggulan</h2>
            <p className="text-text-muted mt-2">Produk terbaik dari petani pilihan</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {produk.filter(p => p.stok !== false).slice(0, 4).map((p) => (
              <Link key={p.id} href={`/katalog/${p.id}`}
                className="card-hover group">
                <div className="aspect-square bg-surface-warm flex items-center justify-center p-3">
                  <img src={p.gambar} alt={p.nama} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-sm truncate group-hover:text-accent-green transition">{p.nama}</h3>
                  <p className="text-accent-green font-bold mt-1">Rp {p.harga.toLocaleString('id-ID')}</p>
                  <p className="text-amber-600 text-xs mt-0.5">{stars(p.rating)}</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/katalog"
              className="inline-flex items-center gap-2 text-accent-green hover:text-accent-green-hover font-medium transition">
              Lihat Semua Produk
              <i className="fas fa-arrow-right text-sm"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA — Stats */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="bg-gradient-to-br from-bumi-900 via-bumi-800 to-bumi-950 rounded-2xl p-10 md:p-14 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent-green/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl"></div>
          <div className="relative">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-accent-green">{produk.length}+</p>
                <p className="text-white/60 text-sm mt-1">Produk Tersedia</p>
              </div>
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-amber-400">{kategori.length}</p>
                <p className="text-white/60 text-sm mt-1">Kategori</p>
              </div>
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-white">Langsung</p>
                <p className="text-white/60 text-sm mt-1">Dari Petani</p>
              </div>
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-accent-green">Tanpa</p>
                <p className="text-white/60 text-sm mt-1">Tengkulak</p>
              </div>
            </div>
            {!user ? (
              <div className="text-center">
                <p className="text-white/80 mb-6 max-w-xl mx-auto">
                  Gabung jadi bagian dari ribuan petani & pembeli yang sudah bertransaksi langsung.
                </p>
                <Link href="/register"
                  className="inline-flex items-center gap-2 bg-accent-green hover:bg-accent-green-hover text-white font-medium px-8 py-3 rounded-lg transition shadow-lg shadow-accent-green/25">
                  <i className="fas fa-user-plus"></i>
                  Daftar Sekarang
                </Link>
              </div>
            ) : user.role === 'petani' ? (
              <div className="text-center">
                <p className="text-white/80 mb-6 max-w-xl mx-auto">
                  Pantau pesanan masuk dan kelola produkmu di dashboard penjual.
                </p>
                <Link href="/seller"
                  className="inline-flex items-center gap-2 bg-accent-green hover:bg-accent-green-hover text-white font-medium px-8 py-3 rounded-lg transition shadow-lg shadow-accent-green/25">
                  <i className="fas fa-tachometer-alt"></i>
                  Dashboard Penjual
                </Link>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-white/80 mb-6 max-w-xl mx-auto">
                  Cek status pesananmu atau lanjutkan belanja di katalog.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href="/pesanan"
                    className="inline-flex items-center gap-2 bg-accent-green hover:bg-accent-green-hover text-white font-medium px-8 py-3 rounded-lg transition shadow-lg shadow-accent-green/25">
                    <i className="fas fa-clipboard-list"></i>
                    Pesanan Saya
                  </Link>
                  <Link href="/katalog"
                    className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/20 px-8 py-3 rounded-lg transition">
                    <i className="fas fa-store"></i>
                    Lanjut Belanja
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
