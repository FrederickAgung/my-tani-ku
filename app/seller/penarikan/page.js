'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function PenarikanPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [saldo, setSaldo] = useState(0)
  const [form, setForm] = useState({ jumlah: '', bank: 'BCA', norek: '', pemilik: '' })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const hitungSaldo = async (u) => {
    // Hitung total dari order delivered
    const ordersRes = await fetch(`/api/orders?role=seller&nama=${encodeURIComponent(u.nama)}`)
    const orders = await ordersRes.json()
    const totalRevenue = orders
      .filter(o => o.status === 'delivered')
      .flatMap(o => o.items)
      .filter(i => i.penjual === u.nama)
      .reduce((s, i) => s + i.harga * (i.qty || 1), 0)

    // Hitung total penarikan
    const withdrawRes = await fetch(`/api/withdraw?penjual=${encodeURIComponent(u.nama)}`)
    const withdrawals = await withdrawRes.json()
    const totalWithdrawn = withdrawals.reduce((s, w) => s + w.jumlah, 0)

    setSaldo(totalRevenue - totalWithdrawn)
  }

  useEffect(() => {
    const u = localStorage.getItem('myTaniku_user')
    if (!u || JSON.parse(u).role !== 'petani') { router.push('/login'); return }
    const parsed = JSON.parse(u)
    setUser(parsed)
    hitungSaldo(parsed)
  }, [router])

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })
  const jumlah = parseInt(form.jumlah) || 0
  const bisaTarik = jumlah > 0 && jumlah <= saldo

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!bisaTarik || loading || !user) return
    setLoading(true)
    setError('')

    const res = await fetch('/api/withdraw', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        penjual: user.nama,
        jumlah,
        bank: form.bank,
        norek: form.norek,
        pemilik: form.pemilik,
      })
    })

    const data = await res.json()
    setLoading(false)

    if (res.ok) {
      setSent(true)
    } else {
      setError(data.error || 'Gagal mengajukan penarikan')
    }
  }

  if (sent) return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <i className="fas fa-check text-green-600 text-2xl"></i>
      </div>
      <h1 className="text-2xl font-bold mb-2" style={{color: 'rgba(0,0,0,0.95)'}}>Pengajuan Berhasil!</h1>
      <p className="text-notion-gray mb-1">Penarikan Rp {jumlah.toLocaleString('id-ID')}</p>
      <p className="text-notion-gray text-sm mb-2">Ke {form.bank} {form.norek} a/n {form.pemilik}</p>
      <p className="text-xs text-notion-gray mb-2">Sisa saldo: Rp {Math.max(0, saldo - jumlah).toLocaleString('id-ID')}</p>
      <p className="text-xs text-notion-gray mb-8">Dana akan diproses 1x24 jam kerja</p>
      <Link href="/seller" className="bg-notion-blue hover:bg-notion-blue-hover text-white px-6 py-2.5 rounded font-medium">Kembali</Link>
    </div>
  )

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <Link href="/seller" className="text-notion-blue hover:text-notion-blue-hover text-sm font-medium">&larr; Kembali</Link>
      <h1 className="text-2xl font-bold mt-4 mb-6" style={{color: 'rgba(0,0,0,0.95)'}}>Tarik Uang</h1>

      <div className="bg-gradient-to-r from-notion-blue to-notion-blue-hover text-white rounded-lg p-6 mb-6">
        <p className="text-sm text-white/70">Saldo Tersedia</p>
        <p className="text-3xl font-bold mt-1">Rp {saldo.toLocaleString('id-ID')}</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-[rgba(0,0,0,0.1)] rounded-lg p-6 space-y-4">
        {error && <p className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">{error}</p>}

        <div>
          <label className="block text-sm font-medium text-notion-gray mb-1">Jumlah Penarikan</label>
          <input type="number" name="jumlah" required min={1000} max={saldo} value={form.jumlah} onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-notion-blue" />
          {form.jumlah && jumlah > saldo && <p className="text-red-500 text-xs mt-1">Melebihi saldo tersedia</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-notion-gray mb-1">Bank</label>
          <select name="bank" value={form.bank} onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-notion-blue bg-white">
            <option>BCA</option><option>Mandiri</option><option>BNI</option><option>BRI</option><option>BSI</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-notion-gray mb-1">Nomor Rekening</label>
          <input type="text" name="norek" required value={form.norek} onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-notion-blue" />
        </div>

        <div>
          <label className="block text-sm font-medium text-notion-gray mb-1">Nama Pemilik Rekening</label>
          <input type="text" name="pemilik" required value={form.pemilik} onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-notion-blue" />
        </div>

        <button type="submit" disabled={!bisaTarik || loading}
          className="w-full bg-notion-blue hover:bg-notion-blue-hover disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded transition flex items-center justify-center gap-2">
          {loading ? (
            <><span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span> Memproses...</>
          ) : bisaTarik ? `Tarik Rp ${jumlah.toLocaleString('id-ID')}` : 'Masukkan jumlah yang valid'}
        </button>
      </form>
    </div>
  )
}
