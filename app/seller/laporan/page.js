'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SellerLaporanPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [orders, setOrders] = useState([])
  const [produk, setProduk] = useState([])
  const [period, setPeriod] = useState('all') // all | week | month

  useEffect(() => {
    const u = localStorage.getItem('myTaniku_user')
    if (!u || JSON.parse(u).role !== 'petani') { router.push('/login'); return }
    const parsed = JSON.parse(u)
    setUser(parsed)

    fetch(`/api/orders?role=seller&nama=${encodeURIComponent(parsed.nama)}`)
      .then(r => r.json()).then(setOrders)
    fetch('/api/produk/seller')
      .then(r => r.json())
      .then(data => setProduk(data.filter(p => p.penjual === parsed.nama)))
  }, [router])

  if (!user) return null

  // Filter berdasarkan periode
  const now = new Date()
  const filteredOrders = orders.filter(o => {
    if (period === 'all') return true
    const d = new Date(o.tanggal)
    const diffDays = (now - d) / (1000 * 60 * 60 * 24)
    if (period === 'week') return diffDays <= 7
    if (period === 'month') return diffDays <= 30
    return true
  })

  // Statistik
  const deliveredOrders = filteredOrders.filter(o => o.status === 'delivered')
  const shippedOrders = filteredOrders.filter(o => o.status === 'shipped')
  const pendingOrders = filteredOrders.filter(o => o.status === 'pending')

  const totalRevenue = deliveredOrders.reduce((sum, o) => {
    const sellerItems = o.items.filter(i => i.penjual === user.nama)
    return sum + sellerItems.reduce((s, i) => s + i.harga * (i.qty || 1), 0)
  }, 0)

  const totalOrders = filteredOrders.length
  const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0

  // Revenue per product
  const revenuePerProduct = {}
  deliveredOrders.forEach(o => {
    o.items.filter(i => i.penjual === user.nama).forEach(i => {
      const key = i.nama || `Produk #${i.id}`
      revenuePerProduct[key] = (revenuePerProduct[key] || 0) + i.harga * (i.qty || 1)
    })
  })
  const productRevenues = Object.entries(revenuePerProduct).sort((a, b) => b[1] - a[1])
  const maxRevenue = productRevenues.length > 0 ? Math.max(...productRevenues.map(r => r[1])) : 1

  // Revenue per day (chart data)
  const revenueByDate = {}
  deliveredOrders.forEach(o => {
    const date = new Date(o.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })
    const sellerItems = o.items.filter(i => i.penjual === user.nama)
    const amount = sellerItems.reduce((s, i) => s + i.harga * (i.qty || 1), 0)
    revenueByDate[date] = (revenueByDate[date] || 0) + amount
  })
  const chartData = Object.entries(revenueByDate).slice(-14)
  const maxChart = chartData.length > 0 ? Math.max(...chartData.map(d => d[1])) : 1

  const periodLabel = { all: 'Semua Waktu', week: '7 Hari Terakhir', month: '30 Hari Terakhir' }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold" style={{color: 'rgba(0,0,0,0.95)'}}>Laporan Penjualan</h1>
          <p className="text-sm text-notion-gray">Ringkasan penjualan produkmu</p>
        </div>
        <div className="flex gap-2">
          {['all', 'week', 'month'].map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 text-sm rounded-lg border transition ${
                period === p ? 'bg-notion-blue text-white border-notion-blue' : 'border-[rgba(0,0,0,0.1)] hover:border-notion-blue text-notion-gray'
              }`}>
              {periodLabel[p]}
            </button>
          ))}
          <Link href="/seller" className="border border-[rgba(0,0,0,0.1)] text-notion-gray hover:border-notion-blue px-3 py-1.5 rounded-lg text-sm">
            &larr; Dashboard
          </Link>
        </div>
      </div>

      {/* Kartu Statistik */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-lg p-5">
          <p className="text-xs text-notion-gray mb-1">Total Pendapatan</p>
          <p className="text-2xl font-bold text-green-600">Rp {totalRevenue.toLocaleString('id-ID')}</p>
        </div>
        <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-lg p-5">
          <p className="text-xs text-notion-gray mb-1">Total Pesanan</p>
          <p className="text-2xl font-bold">{totalOrders}</p>
          <p className="text-xs text-notion-gray mt-1">{deliveredOrders.length} selesai</p>
        </div>
        <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-lg p-5">
          <p className="text-xs text-notion-gray mb-1">Rata-rata Pesanan</p>
          <p className="text-2xl font-bold">Rp {avgOrderValue.toLocaleString('id-ID')}</p>
        </div>
        <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-lg p-5">
          <p className="text-xs text-notion-gray mb-1">Produk Terjual</p>
          <p className="text-2xl font-bold">{produk.filter(p => p.stok).length} produk</p>
          <p className="text-xs text-notion-gray mt-1">{produk.length} total</p>
        </div>
      </div>

      {/* Chart Revenue */}
      <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-lg p-6 mb-8">
        <h2 className="font-semibold mb-4" style={{color: 'rgba(0,0,0,0.95)'}}>Pendapatan Harian</h2>
        {chartData.length === 0 ? (
          <div className="text-center py-10 text-notion-gray text-sm">
            <i className="fas fa-chart-line text-3xl mb-2 opacity-30"></i>
            <p>Belum ada data penjualan</p>
          </div>
        ) : (
          <div className="flex items-end gap-2 h-40">
            {chartData.map(([date, amount]) => (
              <div key={date} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] text-notion-gray font-medium">
                  Rp {(amount / 1000).toFixed(0)}rb
                </span>
                <div
                  className="w-full bg-notion-blue/80 hover:bg-notion-blue rounded-t transition cursor-pointer"
                  style={{ height: `${Math.max(4, (amount / maxChart) * 120)}px` }}
                  title={`Rp ${amount.toLocaleString('id-ID')}`}
                />
                <span className="text-[10px] text-notion-gray">{date}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Produk Terlaris */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-lg p-6">
          <h2 className="font-semibold mb-4" style={{color: 'rgba(0,0,0,0.95)'}}>Produk Terlaris</h2>
          {productRevenues.length === 0 ? (
            <p className="text-sm text-notion-gray text-center py-6">Belum ada produk terjual</p>
          ) : (
            <div className="space-y-3">
              {productRevenues.slice(0, 5).map(([nama, rev], idx) => (
                <div key={nama}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="truncate flex-1">
                      <span className="text-notion-gray mr-1">{idx + 1}.</span>
                      {nama}
                    </span>
                    <span className="font-semibold ml-2">Rp {rev.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-notion-blue rounded-full h-2" style={{ width: `${(rev / maxRevenue) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Status Pesanan */}
        <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-lg p-6">
          <h2 className="font-semibold mb-4" style={{color: 'rgba(0,0,0,0.95)'}}>Status Pesanan</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <span className="text-sm">Menunggu Dikirim</span>
              </div>
              <span className="font-bold">{pendingOrders.length}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2.5">
              <div className="bg-amber-500 rounded-full h-2.5" style={{ width: `${totalOrders > 0 ? (pendingOrders.length / totalOrders) * 100 : 0}%` }} />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-sm">Dalam Pengiriman</span>
              </div>
              <span className="font-bold">{shippedOrders.length}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2.5">
              <div className="bg-blue-500 rounded-full h-2.5" style={{ width: `${totalOrders > 0 ? (shippedOrders.length / totalOrders) * 100 : 0}%` }} />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm">Selesai</span>
              </div>
              <span className="font-bold">{deliveredOrders.length}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2.5">
              <div className="bg-green-500 rounded-full h-2.5" style={{ width: `${totalOrders > 0 ? (deliveredOrders.length / totalOrders) * 100 : 0}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Tabel Pesanan Terbaru */}
      <div className="mt-8">
        <h2 className="font-semibold mb-4" style={{color: 'rgba(0,0,0,0.95)'}}>Pesanan Terbaru</h2>
        <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-lg overflow-hidden">
          {filteredOrders.length === 0 ? (
            <div className="p-8 text-center text-notion-gray text-sm">
              <p>Belum ada pesanan</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[#f6f5f4] text-left">
                  <tr>
                    <th className="px-4 py-2.5 font-medium text-notion-gray">Order ID</th>
                    <th className="px-4 py-2.5 font-medium text-notion-gray">Pembeli</th>
                    <th className="px-4 py-2.5 font-medium text-notion-gray">Total</th>
                    <th className="px-4 py-2.5 font-medium text-notion-gray">Status</th>
                    <th className="px-4 py-2.5 font-medium text-notion-gray">Tanggal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(0,0,0,0.05)]">
                  {filteredOrders.slice(0, 10).map(o => {
                    const sellerTotal = o.items.filter(i => i.penjual === user.nama)
                      .reduce((s, i) => s + i.harga * (i.qty || 1), 0)
                    return (
                      <tr key={o.id} className="hover:bg-[#f6f5f4]/50">
                        <td className="px-4 py-3 font-mono text-xs">#{o.id}</td>
                        <td className="px-4 py-3">{o.buyerNama}</td>
                        <td className="px-4 py-3 font-medium">Rp {sellerTotal.toLocaleString('id-ID')}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-medium ${
                            o.status === 'delivered' ? 'text-green-600' :
                            o.status === 'shipped' ? 'text-blue-600' : 'text-amber-600'
                          }`}>{o.status === 'delivered' ? 'Selesai' : o.status === 'shipped' ? 'Dikirim' : 'Pending'}</span>
                        </td>
                        <td className="px-4 py-3 text-notion-gray text-xs">
                          {new Date(o.tanggal).toLocaleDateString('id-ID', { day:'2-digit', month:'short' })}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
