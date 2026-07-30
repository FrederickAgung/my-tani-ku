'use client'
import { useState, useEffect } from 'react'
import './globals.css'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import NotificationBell from '../components/NotificationBell'

export default function RootLayout({ children }) {
  const [user, setUser] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    try {
      const u = localStorage.getItem('myTaniku_user')
      setUser(u ? JSON.parse(u) : null)
    } catch {}
  }, [pathname])

  const logout = () => {
    localStorage.removeItem('myTaniku_user')
    localStorage.removeItem('myTaniku_token')
    setUser(null)
    router.push('/')
  }

  const navLink = (href, label, active = false) => {
    const isActive = active || pathname === href || (href !== '/' && pathname.startsWith(href))
    return (
      <Link href={href}
        className={`text-sm font-medium transition px-3 py-1.5 rounded-lg ${
          isActive
            ? 'bg-accent-green-light text-accent-green'
            : 'text-text-secondary hover:text-text-primary hover:bg-surface-warm'
        }`}>
        {label}
      </Link>
    )
  }

  return (
    <html lang="id">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-surface-warm text-text-primary min-h-screen flex flex-col">
        {/* Navbar */}
        <nav className="bg-white border-b border-border-light shadow-nav sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg text-accent-green hover:text-accent-green-hover transition">
              <span className="w-7 h-7 bg-accent-green rounded-lg flex items-center justify-center text-white text-xs">
                <i className="fas fa-leaf"></i>
              </span>
              MyTani Ku
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {navLink('/', 'Beranda', pathname === '/')}
              {navLink('/katalog', 'Katalog')}
              {navLink('/keranjang', 'Keranjang')}
              {navLink('/pesanan', 'Pesanan')}
              {user ? (
                <>
                  {navLink('/chat', 'Chat')}
                  {user.role === 'petani' && (
                    <>
                      {navLink('/seller', 'Jual')}
                      {navLink('/seller/laporan', 'Laporan')}
                      {navLink('/seller/penarikan', 'Tarik')}
                    </>
                  )}
                  {user.role === 'admin' && navLink('/admin', 'Admin')}
                  <NotificationBell user={user} />
                  <div className="flex items-center gap-2 ml-2 pl-3 border-l border-border-light">
                    <span className="text-xs text-text-muted hidden lg:block">{user.nama}</span>
                    <button onClick={logout}
                      className="bg-accent-green hover:bg-accent-green-hover text-white text-xs px-3 py-1.5 rounded-lg font-medium transition">
                      Keluar
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2 ml-2 pl-3 border-l border-border-light">
                  <Link href="/login" className="text-sm text-text-secondary hover:text-text-primary px-3 py-1.5 transition">
                    Masuk
                  </Link>
                  <Link href="/register"
                    className="bg-accent-green hover:bg-accent-green-hover text-white text-sm px-4 py-1.5 rounded-lg font-medium transition">
                    Daftar
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button className="md:hidden text-text-primary p-2 rounded-lg hover:bg-surface-warm"
              onClick={() => setMenuOpen(!menuOpen)}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>

          {/* Mobile menu */}
          {menuOpen && (
            <div className="md:hidden bg-white border-t border-border-light px-4 py-3 flex flex-col gap-1 text-sm">
              <Link href="/" onClick={() => setMenuOpen(false)} className="p-2 rounded-lg hover:bg-surface-warm">Beranda</Link>
              <Link href="/katalog" onClick={() => setMenuOpen(false)} className="p-2 rounded-lg hover:bg-surface-warm">Katalog</Link>
              <Link href="/keranjang" onClick={() => setMenuOpen(false)} className="p-2 rounded-lg hover:bg-surface-warm">Keranjang</Link>
              <Link href="/pesanan" onClick={() => setMenuOpen(false)} className="p-2 rounded-lg hover:bg-surface-warm">Pesanan</Link>
              {user && (
                <>
                  <Link href="/chat" onClick={() => setMenuOpen(false)} className="p-2 rounded-lg hover:bg-surface-warm">Chat</Link>
                  {user.role === 'petani' && (
                    <>
                      <Link href="/seller" onClick={() => setMenuOpen(false)} className="p-2 rounded-lg hover:bg-surface-warm">Jual</Link>
                      <Link href="/seller/laporan" onClick={() => setMenuOpen(false)} className="p-2 rounded-lg hover:bg-surface-warm">Laporan</Link>
                      <Link href="/seller/penarikan" onClick={() => setMenuOpen(false)} className="p-2 rounded-lg hover:bg-surface-warm">Tarik</Link>
                    </>
                  )}
                  {user.role === 'admin' && (
                    <Link href="/admin" onClick={() => setMenuOpen(false)} className="p-2 rounded-lg hover:bg-surface-warm">Admin</Link>
                  )}
                  <div className="border-t border-border-light pt-2 mt-2 flex items-center gap-2">
                    <NotificationBell user={user} />
                    <span className="text-xs text-text-muted">{user.nama}</span>
                    <button onClick={() => { logout(); setMenuOpen(false) }}
                      className="bg-accent-green hover:bg-accent-green-hover text-white text-xs px-3 py-1.5 rounded-lg font-medium ml-auto">
                      Keluar
                    </button>
                  </div>
                </>
              )}
              {!user && (
                <div className="flex gap-2 pt-2">
                  <Link href="/login" onClick={() => setMenuOpen(false)}
                    className="flex-1 text-center border border-border-medium rounded-lg p-2 text-text-secondary hover:text-text-primary">
                    Masuk
                  </Link>
                  <Link href="/register" onClick={() => setMenuOpen(false)}
                    className="flex-1 text-center bg-accent-green text-white rounded-lg p-2 font-medium">
                    Daftar
                  </Link>
                </div>
              )}
            </div>
          )}
        </nav>

        <main className="flex-1">{children}</main>

        <footer className="bg-surface-dark text-text-ondark/60 text-center text-sm py-8 mt-12" style={{backgroundColor: '#0f1a0f'}}>
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="w-6 h-6 bg-accent-green rounded flex items-center justify-center text-white text-xs">
                <i className="fas fa-leaf"></i>
              </span>
              <span className="font-semibold text-text-ondark">MyTani Ku</span>
            </div>
            <p className="text-text-ondark/50">Marketplace Pertanian Indonesia</p>
            <p className="mt-1 text-xs text-text-ondark/40">2026 — Tim MPPL IF-6 UNIKOM</p>
          </div>
        </footer>
      </body>
    </html>
  )
}
