'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SellerPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [produk, setProduk] = useState([])
  const [orders, setOrders] = useState([])

  useEffect(() => {
    const u = localStorage.getItem('myTaniku_user')
    if (!u) return router.push('/login')
    const parsed = JSON.parse(u)
    if (parsed.role !== 'petani') return router.push('/')
    setUser(parsed)

    fetch('/api/produk/seller')
      .then(r => r.json())
      .then(data => setProduk(data.filter(p => p.penjual === parsed.nama)))

    fetch(`/api/orders?role=seller&nama=${encodeURIComponent(parsed.nama)}`)
      .then(r => r.json()).then(setOrders)
  }, [router])

  if (!user) return null

  const deliveredOrders = orders.filter(o => o.status === 'delivered')
  const totalRevenue = deliveredOrders.reduce((sum, o) => {
    const sellerItems = o.items.filter(i => i.penjual === user.nama)
    return sum + sellerItems.reduce((s, i) => s + i.harga * (i.qty || 1), 0)
  }, 0)

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-2xl font-bold" style={{color: 'rgba(0,0,0,0.95)'}}>Dashboard Penjual</h1>
        <div className="flex gap-2 flex-wrap">
          <Link href="/seller/laporan" className="border border-notion-blue text-notion-blue hover:bg-[#f2f9ff] px-4 py-2 rounded text-sm font-medium">
            <i className="fas fa-chart-bar mr-1"></i>Laporan
          </Link>
          <Link href="/seller/penarikan" className="border border-notion-blue text-notion-blue hover:bg-[#f2f9ff] px-4 py-2 rounded text-sm font-medium">
            <i className="fas fa-arrow-up mr-1"></i>Tarik Uang
          </Link>
          <Link href="/seller/tambah" className="bg-notion-blue hover:bg-notion-blue-hover text-white px-4 py-2 rounded text-sm font-medium">
            + Tambah Produk
          </Link>
        </div>
      </div>

      {/* Ringkasan */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-lg p-4">
          <p className="text-xs text-notion-gray">Pendapatan</p>
          <p className="text-lg font-bold text-green-600">Rp {totalRevenue.toLocaleString('id-ID')}</p>
        </div>
        <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-lg p-4">
          <p className="text-xs text-notion-gray">Produk</p>
          <p className="text-lg font-bold">{produk.length}</p>
        </div>
        <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-lg p-4">
          <p className="text-xs text-notion-gray">Pesanan</p>
          <p className="text-lg font-bold">{orders.length}</p>
        </div>
        <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-lg p-4">
          <p className="text-xs text-notion-gray">Selesai</p>
          <p className="text-lg font-bold">{deliveredOrders.length}</p>
        </div>
      </div>

      {produk.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center text-gray-400">
          <p className="text-5xl mb-4">📦</p>
          <p className="text-lg font-medium">Belum ada produk</p>
          <p className="text-sm mt-1">Tambahkan produk pertamamu</p>
        </div>
      ) : (
        <div className="space-y-3">
          {produk.map(p => (
            <div key={p.id} className="bg-white rounded-xl shadow-sm border p-4 flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                {p.kategori === 'peralatan' ? '🔧' : p.kategori === 'hasil-tani' ? '🌾' : '🌱'}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{p.nama}</h3>
                <p className="text-notion-blue font-bold">Rp {p.harga.toLocaleString('id-ID')}</p>
                <span className="text-xs bg-[#f2f9ff] text-[#097fe8] px-2 py-0.5 rounded-full capitalize">
                  {p.kategori === 'hasil-tani' ? 'Hasil Tani' : p.kategori}
                </span>
              </div>
              <Link href={`/seller/edit/${p.id}`}
                className="text-notion-gray hover:text-notion-blue transition p-2 rounded-lg hover:bg-[#f2f9ff]"
                title="Edit produk">
                <i className="fas fa-pen"></i>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
