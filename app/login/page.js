'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const res = await fetch('/api/auth/login', {
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
          <h1 className="text-2xl font-bold text-text-primary">Masuk ke MyTani Ku</h1>
          <p className="text-text-muted text-sm mt-1">Masuk untuk mulai berbelanja</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-elevated border border-border-light p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-lg flex items-center gap-2">
              <i className="fas fa-exclamation-circle"></i>
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">Email</label>
            <input type="email" name="email" required value={form.email} onChange={handleChange}
              className="input-field" placeholder="contoh@email.com" />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">Kata Sandi</label>
            <input type="password" name="password" required value={form.password} onChange={handleChange}
              className="input-field" placeholder="Masukkan kata sandi" />
          </div>

          <button type="submit" disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2">
            {loading ? (
              <><span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span> Memproses...</>
            ) : 'Masuk'}
          </button>

          <p className="text-center text-sm text-text-muted">
            Belum punya akun?{' '}
            <Link href="/register" className="text-accent-green hover:text-accent-green-hover font-medium">Daftar</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
