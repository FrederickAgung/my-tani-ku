'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

const metodeBayar = [
  { id: 'bank_transfer', nama: 'Transfer Bank', icon: 'fa-building-columns', desc: 'BCA, Mandiri, BNI, BRI — Virtual Account' },
  { id: 'gopay', nama: 'GoPay', icon: 'fa-mobile-screen', desc: 'Bayar pakai GoPay' },
  { id: 'qris', nama: 'QRIS', icon: 'fa-qrcode', desc: 'Scan QR via e-Wallet atau M-Banking' },
  { id: 'shopeepay', nama: 'ShopeePay', icon: 'fa-bag-shopping', desc: 'Bayar pakai ShopeePay' },
  { id: 'akulaku', nama: 'Akulaku', icon: 'fa-store', desc: 'Cicilan 0% / Paylater' },
]

export default function PaymentPage() {
  const { snapToken } = useParams()
  const router = useRouter()
  const [tx, setTx] = useState(null)
  const [selected, setSelected] = useState('bank_transfer')
  const [step, setStep] = useState('choose') // choose | pending | success
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch(`/api/midtrans?orderId=${snapToken.replace('snap_', '')}`)
      .then(r => r.json())
      .then(data => {
        if (data) setTx(data)
        else { /* fallback: cari dari orderId lokal */ }
      })
  }, [snapToken])

  const bayar = async () => {
    setLoading(true)
    // Simulasi proses pembayaran
    await new Promise(r => setTimeout(r, 1500))
    // Update status transaksi
    await fetch('/api/midtrans', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ snapToken, paymentType: selected })
    })
    setStep('success')
    setLoading(false)
  }

  if (!tx) return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <div className="animate-spin w-8 h-8 border-2 border-notion-blue border-t-transparent rounded-full mx-auto mb-4" />
      <p className="text-notion-gray">Memuat pembayaran...</p>
    </div>
  )

  if (step === 'success') return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <i className="fas fa-check-circle text-green-600 text-4xl"></i>
      </div>
      <h1 className="text-2xl font-bold mb-2" style={{color: 'rgba(0,0,0,0.95)'}}>Pembayaran Berhasil!</h1>
      <p className="text-notion-gray mb-1">Transaksi #{tx.orderId}</p>
      <p className="text-lg font-bold text-notion-blue mb-6">Rp {tx.grossAmount.toLocaleString('id-ID')}</p>
      <div className="bg-[#f2f9ff] rounded-lg p-4 text-left text-sm mb-8">
        <p className="text-notion-gray">Status: <span className="text-green-600 font-semibold">Lunas</span></p>
        <p className="text-notion-gray mt-1">Metode: <span className="font-medium">{metodeBayar.find(m => m.id === selected)?.nama || selected}</span></p>
        <p className="text-notion-gray mt-1">Waktu: {new Date().toLocaleString('id-ID')}</p>
      </div>
      <Link href="/" className="bg-notion-blue hover:bg-notion-blue-hover text-white px-6 py-2.5 rounded font-medium inline-block">
        Kembali ke Beranda
      </Link>
    </div>
  )

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-notion-blue rounded-full flex items-center justify-center">
            <i className="fas fa-credit-card text-white"></i>
          </div>
          <div>
            <h1 className="text-xl font-bold" style={{color: 'rgba(0,0,0,0.95)'}}>Midtrans Payment</h1>
            <p className="text-xs text-notion-gray">Payment Gateway Terintegrasi</p>
          </div>
          <div className="ml-auto bg-[#f2f9ff] text-notion-blue text-xs px-2 py-1 rounded font-medium">SNAP</div>
        </div>

        {/* Order Summary */}
        <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-lg p-5 mb-6">
          <p className="text-sm text-notion-gray mb-1">Total Pembayaran</p>
          <p className="text-2xl font-bold">Rp {tx.grossAmount.toLocaleString('id-ID')}</p>
          <p className="text-xs text-notion-gray mt-1">Order #{tx.orderId}</p>
        </div>

        {step === 'choose' && (
          <>
            <p className="text-sm font-semibold mb-3" style={{color: 'rgba(0,0,0,0.95)'}}>Pilih Metode Pembayaran</p>
            <div className="space-y-2 mb-6">
              {metodeBayar.map(m => (
                <button key={m.id} onClick={() => setSelected(m.id)}
                  className={`w-full text-left p-4 rounded-lg border flex items-center gap-4 transition ${
                    selected === m.id ? 'border-notion-blue bg-[#f2f9ff]' : 'border-[rgba(0,0,0,0.1)] hover:border-notion-blue'
                  }`}>
                  <i className={`fas ${m.icon} text-xl ${selected === m.id ? 'text-notion-blue' : 'text-notion-gray'}`}></i>
                  <div className="flex-1">
                    <p className="font-medium">{m.nama}</p>
                    <p className="text-xs text-notion-gray">{m.desc}</p>
                  </div>
                  {selected === m.id && <i className="fas fa-check-circle text-notion-blue"></i>}
                </button>
              ))}
            </div>

            <button onClick={bayar} disabled={loading}
              className="w-full bg-notion-blue hover:bg-notion-blue-hover disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg transition text-lg">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                  Memproses...
                </span>
              ) : `Bayar Rp ${tx.grossAmount.toLocaleString('id-ID')}`}
            </button>

            <div className="flex items-center gap-2 mt-4 text-xs text-notion-gray justify-center">
              <i className="fas fa-lock"></i>
              <span>Pembayaran aman via Midtrans</span>
              <img src="https://midtrans.com/images/logo-midtrans.svg" alt="Midtrans" className="h-4 opacity-60" />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
