'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const statusLabel = { pending: 'Menunggu Dikirim', shipped: 'Dikirim', delivered: 'Selesai' }
const statusColor = { pending: 'text-amber-600', shipped: 'text-notion-blue', delivered: 'text-green-600' }

export default function PesananPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [orders, setOrders] = useState([])
  const [shipForm, setShipForm] = useState({}) // { [orderId]: { courier, tracking } }

  useEffect(() => {
    const u = localStorage.getItem('myTaniku_user')
    if (!u) { router.push('/login'); return }
    const parsed = JSON.parse(u)
    setUser(parsed)

    const role = parsed.role === 'petani' ? 'seller' : 'buyer'
    const params = role === 'seller' ? `role=seller&nama=${encodeURIComponent(parsed.nama)}` : `role=buyer&userId=${parsed.id}`
    fetch(`/api/orders?${params}`).then(r => r.json()).then(setOrders)
  }, [router])

  const ship = async (id) => {
    const { courier, tracking } = shipForm[id] || {}
    if (!courier || !tracking) return
    await fetch('/api/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action: 'ship', courier, tracking })
    })
    setOrders(orders.map(o => o.id === id ? { ...o, status: 'shipped', courier, tracking } : o))
  }

  const deliver = async (id) => {
    await fetch('/api/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action: 'deliver' })
    })
    setOrders(orders.map(o => o.id === id ? { ...o, status: 'delivered' } : o))
  }

  if (!user) return null

  const isSeller = user.role === 'petani'

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6" style={{color: 'rgba(0,0,0,0.95)'}}>
        {isSeller ? 'Pesanan Masuk' : 'Pesanan Saya'}
      </h1>

      {orders.length === 0 ? (
        <div className="text-center py-16 text-notion-gray">
          <i className="fas fa-box text-5xl mb-4 opacity-30"></i>
          <p className="text-lg">Belum ada pesanan</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(o => (
            <div key={o.id} className="bg-white border border-[rgba(0,0,0,0.1)] rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-notion-gray">{new Date(o.tanggal).toLocaleDateString('id-ID', { day:'numeric', month:'short', hour:'2-digit', minute:'2-digit' })}</span>
                <span className={`text-xs font-semibold ${statusColor[o.status]}`}>
                  <i className={`fas ${o.status === 'delivered' ? 'fa-check-circle' : o.status === 'shipped' ? 'fa-truck' : 'fa-clock'} mr-1`}></i>
                  {statusLabel[o.status]}
                </span>
              </div>

              {o.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 py-2 border-t border-[rgba(0,0,0,0.05)]">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.nama}</p>
                    <p className="text-xs text-notion-gray">{item.penjual} &middot; {item.qty}x</p>
                  </div>
                  <p className="text-sm font-bold text-notion-blue">Rp {(item.harga * item.qty).toLocaleString('id-ID')}</p>
                </div>
              ))}

              <div className="flex justify-between items-center mt-3 pt-3 border-t border-[rgba(0,0,0,0.1)]">
                <p className="text-xs text-notion-gray">{o.metode} &middot; {o.alamat || 'Alamat default'}</p>
                <p className="text-sm font-bold">Rp {o.total.toLocaleString('id-ID')}</p>
              </div>

              {/* Seller: ship form */}
              {isSeller && o.status === 'pending' && (
                <div className="mt-3 pt-3 border-t border-[rgba(0,0,0,0.1)] space-y-2">
                  <input placeholder="Nama Kurir (JNE, SiCepat, dll)" value={shipForm[o.id]?.courier || ''}
                    onChange={e => setShipForm({ ...shipForm, [o.id]: { ...shipForm[o.id], courier: e.target.value } })}
                    className="w-full border rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-notion-blue" />
                  <input placeholder="No. Resi" value={shipForm[o.id]?.tracking || ''}
                    onChange={e => setShipForm({ ...shipForm, [o.id]: { ...shipForm[o.id], tracking: e.target.value } })}
                    className="w-full border rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-notion-blue" />
                  <button onClick={() => ship(o.id)} disabled={!shipForm[o.id]?.courier || !shipForm[o.id]?.tracking}
                    className="bg-notion-blue hover:bg-notion-blue-hover disabled:bg-gray-300 text-white text-sm px-4 py-1.5 rounded font-medium">
                    Kirim
                  </button>
                </div>
              )}

              {/* Buyer: tracking */}
              {!isSeller && o.status === 'shipped' && (
                <div className="mt-3 pt-3 border-t border-[rgba(0,0,0,0.1)] bg-[#f2f9ff] rounded p-3">
                  <p className="text-xs font-medium text-notion-blue"><i className="fas fa-truck mr-1"></i>Dikirim via {o.courier}</p>
                  <p className="text-xs text-notion-gray mt-1">No. Resi: <span className="font-mono font-bold">{o.tracking}</span></p>
                  {/* ponytail: tracking link, beneran nanti pas deploy */}
                  <button onClick={() => deliver(o.id)}
                    className="mt-2 bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1.5 rounded font-medium">
                    <i className="fas fa-check mr-1"></i>Pesanan Diterima
                  </button>
                </div>
              )}

              {!isSeller && o.status === 'delivered' && (
                <div className="mt-3 pt-3 border-t border-[rgba(0,0,0,0.1)] text-green-600 text-xs flex items-center gap-1">
                  <i className="fas fa-check-circle"></i>Pesanan selesai
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
