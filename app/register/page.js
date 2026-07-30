'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const [form, setForm] = useState({ nama: '', email: '', telepon: '', password: '', role: 'pembeli' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    setLoading(false)
    if (res.ok) {
      localStorage.setItem('myTaniku_user', JSON.stringify(data.user))
      localStorage.setItem('myTaniku_token', data.token)
      router.push('/')
    } else {
      setError(data.error)
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-accent-green rounded-xl flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-leaf text-white text-lg"></i>
          </div>
          <h1 className="text-2xl font-bold text-text-primary">Daftar MyTani Ku</h1>
          <p className="text-text-muted text-sm mt-1">Mulai jual atau beli hasil pertanian</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-elevated border border-border-light p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-lg flex items-center gap-2">
              <i className="fas fa-exclamation-circle"></i>
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">Nama Lengkap</label>
            <input type="text" name="nama" required value={form.nama} onChange={handleChange}
              className="input-field" placeholder="Nama lengkap" />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">Email</label>
            <input type="email" name="email" required value={form.email} onChange={handleChange}
              className="input-field" placeholder="contoh@email.com" />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">Nomor Telepon</label>
            <input type="tel" name="telepon" required value={form.telepon} onChange={handleChange}
              className="input-field" placeholder="08123456789" />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">Kata Sandi</label>
            <input type="password" name="password" required minLength={6} value={form.password} onChange={handleChange}
              className="input-field" placeholder="Minimal 6 karakter" />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">Daftar sebagai</label>
            <select name="role" value={form.role} onChange={handleChange}
              className="input-field">
              <option value="pembeli">Pembeli</option>
              <option value="petani">Petani (Penjual)</option>
            </select>
          </div>

          <button type="submit" disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2">
            {loading ? (
              <><span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span> Mendaftar...</>
            ) : 'Daftar'}
          </button>

          <p className="text-center text-sm text-text-muted">
            Sudah punya akun?{' '}
            <Link href="/login" className="text-accent-green hover:text-accent-green-hover font-medium">Masuk</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
