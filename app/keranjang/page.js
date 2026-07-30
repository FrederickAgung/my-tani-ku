'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const metode = [
  { id: 'transfer', nama: 'Transfer Bank', icon: 'fa-building-columns', desc: 'BCA, Mandiri, BNI, BRI' },
  { id: 'ewallet', nama: 'Dompet Digital', icon: 'fa-wallet', desc: 'GoPay, OVO, DANA, LinkAja' },
  { id: 'qris', nama: 'QRIS', icon: 'fa-qrcode', desc: 'Scan QR via e-Wallet atau M-Banking' },
  { id: 'midtrans', nama: 'Midtrans', icon: 'fa-credit-card', desc: 'Kartu Kredit, Virtual Account, dll (recommended)' },
]

export default function KeranjangPage() {
  const router = useRouter()
  const [items, setItems] = useState([])
  const [user, setUser] = useState(null)
  const [step, setStep] = useState('cart') // cart | payment | success
  const [selected, setSelected] = useState(null)
  const [lastTotal, setLastTotal] = useState(0)
  const [lastMetode, setLastMetode] = useState('')
  const [midtransLoading, setMidtransLoading] = useState(false)
  const [payLoading, setPayLoading] = useState(false)

  useEffect(() => {
    const u = localStorage.getItem('myTaniku_user')
    if (!u) { router.push('/login'); return }
    const parsed = JSON.parse(u)
    setUser(parsed)
    const cart = JSON.parse(localStorage.getItem(`myTaniku_cart_${parsed.id}`) || '[]')
    setItems(cart)
  }, [router])

  const updateQty = (id, delta) => {
    if (!user) return
    const updated = items.map(i => {
      if (i.id === id) { const n = (i.qty || 1) + delta; return n > 0 ? { ...i, qty: n } : null }
      return i
    }).filter(Boolean)
    setItems(updated)
    localStorage.setItem(`myTaniku_cart_${user.id}`, JSON.stringify(updated))
  }

  const total = items.reduce((s, i) => s + i.harga * (i.qty || 1), 0)
  const biaya = 5000
  const grandTotal = total + (total > 0 ? biaya : 0)

  const placeOrder = async (metodeId) => {
    const namaMetode = metode.find(m => m.id === metodeId)?.nama || metodeId
    setLastTotal(grandTotal)
    setLastMetode(namaMetode)

    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        buyerId: user.id,
        buyerNama: user.nama,
        buyerEmail: user.email || `${user.nama}@email.com`,
        items: items.map(i => ({ id: i.id, nama: i.nama, harga: i.harga, qty: i.qty || 1, penjual: i.penjual })),
        total: grandTotal,
        metode: namaMetode,
      })
    })
    const data = await res.json()
    localStorage.removeItem(`myTaniku_cart_${user.id}`)
    setItems([])
    return data
  }

  const bayarStandard = async () => {
    if (payLoading) return
    setPayLoading(true)
    try {
      await placeOrder(selected)
      setStep('success')
    } finally {
      setPayLoading(false)
    }
  }

  const bayarMidtrans = async () => {
    setMidtransLoading(true)
    const data = await placeOrder('midtrans')
    // Generate Midtrans Snap token
    const midRes = await fetch('/api/midtrans', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId: data.order.id,
        total: grandTotal,
        buyerNama: user.nama,
        buyerEmail: user.email || `${user.nama}@email.com`,
      })
    })
    const midData = await midRes.json()
    // Redirect ke halaman pembayaran Midtrans
    router.push(`/payment/${midData.snapToken}`)
  }

  // --- Payment Step ---
  if (step === 'payment') return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <button onClick={() => setStep('cart')} className="text-notion-blue hover:text-notion-blue-hover text-sm font-medium">&larr; Kembali</button>
      <h1 className="text-2xl font-bold mt-4 mb-6" style={{color: 'rgba(0,0,0,0.95)'}}>Pilih Pembayaran</h1>

      <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-lg p-4 mb-4">
        <p className="text-sm text-notion-gray">Total Pesanan</p>
        <p className="text-lg font-bold">Rp {total.toLocaleString('id-ID')}</p>
        <p className="text-xs text-notion-gray mt-1">+ Biaya layanan Rp {biaya.toLocaleString('id-ID')}</p>
      </div>

      <div className="space-y-2 mb-6">
        {metode.map(m => (
          <button key={m.id} onClick={() => setSelected(m.id)}
            className={`w-full text-left p-4 rounded-lg border flex items-center gap-4 transition ${
              selected === m.id ? 'border-notion-blue bg-[#f2f9ff]' : 'border-[rgba(0,0,0,0.1)] hover:border-notion-blue'
            }`}>
            <i className={`fas ${m.icon} text-xl ${selected === m.id ? 'text-notion-blue' : 'text-notion-gray'}`}></i>
            <div>
              <p className="font-medium">{m.nama}</p>
              <p className="text-xs text-notion-gray">{m.desc}</p>
            </div>
            {selected === m.id && <i className="fas fa-check-circle text-notion-blue ml-auto"></i>}
          </button>
        ))}
      </div>

      {selected === 'midtrans' ? (
        <button onClick={bayarMidtrans} disabled={midtransLoading}
          className="w-full bg-notion-blue hover:bg-notion-blue-hover disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 rounded transition text-lg flex items-center justify-center gap-2">
          {midtransLoading ? (
            <><span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span> Memproses...</>
          ) : `Bayar Rp ${grandTotal.toLocaleString('id-ID')} via Midtrans`}
        </button>
      ) : (
        <button onClick={bayarStandard} disabled={!selected || payLoading}
          className="w-full bg-notion-blue hover:bg-notion-blue-hover disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 rounded transition text-lg flex items-center justify-center gap-2">
          {payLoading ? (
            <><span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span> Memproses...</>
          ) : `Bayar Rp ${grandTotal.toLocaleString('id-ID')}`}
        </button>
      )}
    </div>
  )

  // --- Success Step ---
  if (step === 'success') return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <i className="fas fa-check text-green-600 text-2xl"></i>
      </div>
      <h1 className="text-2xl font-bold mb-2" style={{color: 'rgba(0,0,0,0.95)'}}>Pembayaran Berhasil!</h1>
      <p className="text-notion-gray mb-2">Pesananmu sedang diproses</p>
      <p className="text-sm font-bold mb-8">Rp {lastTotal.toLocaleString('id-ID')} — {lastMetode}</p>
      <Link href="/" className="bg-notion-blue hover:bg-notion-blue-hover text-white px-6 py-2.5 rounded font-medium">Kembali ke Beranda</Link>
    </div>
  )

  // --- Cart Step ---
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6" style={{color: 'rgba(0,0,0,0.95)'}}>Keranjang Belanja</h1>

      {items.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center text-gray-400">
          <p className="text-5xl mb-4">🛒</p>
          <p className="text-lg font-medium">Keranjang kosong</p>
          <Link href="/katalog" className="text-notion-blue hover:text-notion-blue-hover mt-2 inline-block font-medium">Jelajahi Produk</Link>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {items.map(i => (
              <div key={i.id} className="bg-white rounded-xl shadow-sm border p-4 flex items-center gap-4">
                <img src={i.gambar} alt={i.nama} className="w-16 h-16 object-contain rounded-lg bg-gray-50" />
                <div className="flex-1 min-w-0">
                  <Link href={`/katalog/${i.id}`} className="font-semibold hover:text-notion-blue truncate block">{i.nama}</Link>
                  <p className="text-notion-blue font-bold">Rp {i.harga.toLocaleString('id-ID')}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQty(i.id, -1)} className="w-8 h-8 rounded-full border hover:bg-gray-100 text-lg font-bold">−</button>
                  <span className="w-8 text-center font-semibold">{i.qty || 1}</span>
                  <button onClick={() => updateQty(i.id, 1)} className="w-8 h-8 rounded-full border hover:bg-gray-100 text-lg font-bold">+</button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-lg p-6 mt-6">
            <div className="flex justify-between text-sm text-notion-gray mb-2">
              <span>Subtotal</span><span>Rp {total.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between text-sm text-notion-gray mb-3">
              <span>Biaya layanan</span><span>Rp {biaya.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t pt-3" style={{borderColor: 'rgba(0,0,0,0.1)'}}>
              <span>Total</span>
              <span className="text-notion-blue">Rp {grandTotal.toLocaleString('id-ID')}</span>
            </div>
            <button onClick={() => { if (!user) router.push('/login'); else setStep('payment') }}
              className="mt-4 w-full bg-notion-blue hover:bg-notion-blue-hover text-white font-medium py-3 rounded transition text-lg">
              Lanjut ke Pembayaran
            </button>
          </div>
        </>
      )}
    </div>
  )
}
