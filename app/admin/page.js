'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const tabs = [
  { id: 'users', label: 'Pengguna', icon: 'fa-users' },
  { id: 'produk', label: 'Produk', icon: 'fa-box' },
  { id: 'orders', label: 'Pesanan', icon: 'fa-clipboard-list' },
]

const statusLabel = { pending: 'Pending', shipped: 'Dikirim', delivered: 'Selesai' }
const statusColor = { pending: 'text-amber-600', shipped: 'text-blue-600', delivered: 'text-green-600' }

export default function AdminPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [tab, setTab] = useState('users')
  const [users, setUsers] = useState([])
  const [produk, setProduk] = useState([])
  const [orders, setOrders] = useState([])

  useEffect(() => {
    const u = localStorage.getItem('myTaniku_user')
    if (!u) { router.push('/login'); return }
    const parsed = JSON.parse(u)
    if (parsed.role !== 'admin') { router.push('/'); return }
    setUser(parsed)
  }, [router])

  useEffect(() => {
    if (!user) return
    fetch('/api/admin/users').then(r => r.json()).then(setUsers)
    fetch('/api/produk/seller').then(r => r.json()).then(setProduk)
    fetch('/api/orders').then(r => r.json()).then(setOrders)
  }, [user])

  if (!user) return null

  const roleLabel = { admin: 'Admin', petani: 'Petani', pembeli: 'Pembeli' }
  const roleColor = { admin: 'bg-red-100 text-red-700', petani: 'bg-green-100 text-green-700', pembeli: 'bg-blue-100 text-blue-700' }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2" style={{color: 'rgba(0,0,0,0.95)'}}>Dashboard Admin</h1>
      <p className="text-sm text-notion-gray mb-6">Manajemen pengguna, produk, dan pesanan MyTani Ku</p>

      <div className="flex gap-1 border-b border-[rgba(0,0,0,0.1)] mb-6">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition ${
              tab === t.id ? 'border-notion-blue text-notion-blue' : 'border-transparent text-notion-gray hover:text-notion-black'
            }`}>
            <i className={`fas ${t.icon} mr-1.5`}></i>{t.label}
          </button>
        ))}
      </div>

      {tab === 'users' && (
        <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-lg overflow-hidden">
          <div className="p-4 border-b border-[rgba(0,0,0,0.05)] flex items-center justify-between">
            <p className="text-sm font-medium">Total: {users.length} pengguna</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#f6f5f4] text-left">
                <tr>
                  <th className="px-4 py-2.5 font-medium text-notion-gray">Nama</th>
                  <th className="px-4 py-2.5 font-medium text-notion-gray">Email</th>
                  <th className="px-4 py-2.5 font-medium text-notion-gray">Telepon</th>
                  <th className="px-4 py-2.5 font-medium text-notion-gray">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(0,0,0,0.05)]">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-[#f6f5f4]/50">
                    <td className="px-4 py-3 font-medium">{u.nama}</td>
                    <td className="px-4 py-3 text-notion-gray">{u.email}</td>
                    <td className="px-4 py-3 text-notion-gray">{u.telepon}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${roleColor[u.role]}`}>
                        {roleLabel[u.role]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'produk' && (
        <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-lg overflow-hidden">
          <div className="p-4 border-b border-[rgba(0,0,0,0.05)]">
            <p className="text-sm font-medium">Total: {produk.length} produk</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#f6f5f4] text-left">
                <tr>
                  <th className="px-4 py-2.5 font-medium text-notion-gray">Nama</th>
                  <th className="px-4 py-2.5 font-medium text-notion-gray">Kategori</th>
                  <th className="px-4 py-2.5 font-medium text-notion-gray">Harga</th>
                  <th className="px-4 py-2.5 font-medium text-notion-gray">Penjual</th>
                  <th className="px-4 py-2.5 font-medium text-notion-gray">Rating</th>
                  <th className="px-4 py-2.5 font-medium text-notion-gray">Stok</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(0,0,0,0.05)]">
                {produk.map(p => (
                  <tr key={p.id} className="hover:bg-[#f6f5f4]/50">
                    <td className="px-4 py-3 font-medium">{p.nama}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs bg-[#f2f9ff] text-[#097fe8] px-2 py-0.5 rounded-full capitalize">
                        {p.kategori === 'hasil-tani' ? 'Hasil Tani' : p.kategori}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-notion-blue font-medium">Rp {p.harga.toLocaleString('id-ID')}</td>
                    <td className="px-4 py-3 text-notion-gray">{p.penjual}</td>
                    <td className="px-4 py-3">{p.rating || '-'}</td>
                    <td className="px-4 py-3">
                      {p.stok
                        ? <span className="text-green-600 text-xs font-medium">Tersedia</span>
                        : <span className="text-red-500 text-xs font-medium">Habis</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'orders' && (
        <div className="space-y-4">
          <p className="text-sm font-medium text-notion-gray">Total: {orders.length} pesanan</p>
          {orders.length === 0 ? (
            <div className="text-center py-16 text-notion-gray">
              <p className="text-lg">Belum ada pesanan</p>
            </div>
          ) : (
            orders.map(o => (
              <div key={o.id} className="bg-white border border-[rgba(0,0,0,0.1)] rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-notion-gray">{new Date(o.tanggal).toLocaleDateString('id-ID', { day:'numeric', month:'short', year:'numeric' })}</span>
                    <span className={`text-xs font-semibold ${statusColor[o.status]}`}>
                      <i className={`fas ${
                        o.status === 'delivered' ? 'fa-check-circle' : o.status === 'shipped' ? 'fa-truck' : 'fa-clock'
                      } mr-1`}></i>
                      {statusLabel[o.status]}
                    </span>
                  </div>
                  <span className="text-sm font-bold">Rp {o.total.toLocaleString('id-ID')}</span>
                </div>
                <p className="text-xs text-notion-gray mb-2">Pembeli: {o.buyerNama} &middot; {o.metode}</p>
                {o.items.map((item, idx) => (
                  <div key={idx} className="text-xs text-notion-gray ml-2">
                    &bull; {item.nama} x{item.qty || 1} &mdash; Rp {(item.harga * (item.qty || 1)).toLocaleString('id-ID')}
                  </div>
                ))}
                {o.courier && <p className="text-xs text-notion-gray mt-2">Kurir: {o.courier} ({o.tracking})</p>}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
