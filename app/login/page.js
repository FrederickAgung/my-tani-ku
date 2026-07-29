'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
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
        <h1 className="text-2xl font-bold text-center mb-8" style={{color: 'rgba(0,0,0,0.95)'}}>Masuk ke MyTani Ku</h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 space-y-4">
          {error && <p className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">{error}</p>}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kata Sandi</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>

          <button type="submit" className="w-full bg-notion-blue hover:bg-notion-blue-hover text-white font-medium py-2.5 rounded transition">
            Masuk
          </button>

          <p className="text-center text-sm text-gray-500">
            Belum punya akun?{' '}
            <Link href="/register" className="text-notion-blue hover:text-notion-blue-hover font-medium">Daftar</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
