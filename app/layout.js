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

  return (
    <html lang="id">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
      </head>
      <body className="bg-white text-notion-black min-h-screen flex flex-col">
        <nav className="bg-notion-dark text-white sticky top-0 z-50 border-b border-white/10">
          <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
            <Link href="/" className="text-lg font-bold tracking-tight">MyTani Ku</Link>

            <div className="hidden md:flex items-center gap-6 text-sm">
              <Link href="/" className={`hover:text-notion-light ${pathname === '/' ? 'text-notion-light' : 'text-white/80'}`}>Beranda</Link>
              <Link href="/katalog" className={`hover:text-notion-light ${pathname.startsWith('/katalog') ? 'text-notion-light' : 'text-white/80'}`}>Katalog</Link>
              <Link href="/keranjang" className={`hover:text-notion-light ${pathname === '/keranjang' ? 'text-notion-light' : 'text-white/80'}`}>Keranjang</Link>
              <Link href="/pesanan" className={`hover:text-notion-light ${pathname === '/pesanan' ? 'text-notion-light' : 'text-white/80'}`}>Pesanan</Link>
              {user ? (
                <>
                  <Link href="/chat" className={`hover:text-notion-light ${pathname.startsWith('/chat') ? 'text-notion-light' : 'text-white/80'}`}><i className="fas fa-comment mr-1"></i>Chat</Link>
                  {user.role === 'petani' && (
                    <>
                      <Link href="/seller" className={`hover:text-notion-light ${pathname.startsWith('/seller') ? 'text-notion-light' : 'text-white/80'}`}>Jual</Link>
                      <Link href="/seller/laporan" className={`hover:text-notion-light hidden lg:inline ${pathname.startsWith('/seller/laporan') ? 'text-notion-light' : 'text-white/80'}`}>Laporan</Link>
                      <Link href="/seller/penarikan" className={`hover:text-notion-light ${pathname.startsWith('/seller/penarikan') ? 'text-notion-light' : 'text-white/80'}`}>Tarik</Link>
                    </>
                  )}
                  {user.role === 'admin' && (
                    <Link href="/admin" className={`hover:text-notion-light ${pathname.startsWith('/admin') ? 'text-notion-light' : 'text-white/80'}`}>Admin</Link>
                  )}
                  <NotificationBell user={user} />
                  <span className="text-white/60 hidden lg:inline text-xs">Halo, {user.nama}</span>
                  <button onClick={logout} className="bg-notion-blue hover:bg-notion-blue-hover text-white px-3 py-1.5 rounded text-sm font-medium">Keluar</button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-white/80 hover:text-white">Masuk</Link>
                  <Link href="/register" className="bg-notion-blue hover:bg-notion-blue-hover text-white px-3 py-1.5 rounded text-sm font-medium">Daftar</Link>
                </>
              )}
            </div>

            <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>

          {menuOpen && (
            <div className="md:hidden bg-notion-dark border-t border-white/10 px-4 py-3 flex flex-col gap-3 text-sm">
              <Link href="/" onClick={() => setMenuOpen(false)} className="text-white/80">Beranda</Link>
              <Link href="/katalog" onClick={() => setMenuOpen(false)} className="text-white/80">Katalog</Link>
              <Link href="/keranjang" onClick={() => setMenuOpen(false)} className="text-white/80">Keranjang</Link>
              <Link href="/pesanan" onClick={() => setMenuOpen(false)} className="text-white/80">Pesanan</Link>
              {user && user.role === 'petani' && (
                <Link href="/seller" onClick={() => setMenuOpen(false)} className="text-white/80">Jual</Link>
              )}
              {user && (
                <Link href="/chat" onClick={() => setMenuOpen(false)} className="text-white/80">Chat</Link>
              )}
              {user && user.role === 'petani' && (
                <Link href="/seller/laporan" onClick={() => setMenuOpen(false)} className="text-white/80">Laporan</Link>
              )}
              {user && user.role === 'petani' && (
                <Link href="/seller/penarikan" onClick={() => setMenuOpen(false)} className="text-white/80">Tarik</Link>
              )}
              {user && user.role === 'admin' && (
                <Link href="/admin" onClick={() => setMenuOpen(false)} className="text-white/80">Admin</Link>
              )}
              {user ? (
                <>
                  <div className="flex items-center gap-2 border-t border-white/10 pt-2 mt-2">
                    <NotificationBell user={user} />
                    <span className="text-white/60 text-xs">Halo, {user.nama}</span>
                  </div>
                  <button onClick={() => { logout(); setMenuOpen(false) }} className="text-left text-white/80">Keluar</button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMenuOpen(false)} className="text-white/80">Masuk</Link>
                  <Link href="/register" onClick={() => setMenuOpen(false)} className="text-white/80">Daftar</Link>
                </>
              )}
            </div>
          )}
        </nav>

        <main className="flex-1">{children}</main>

        <footer className="bg-notion-dark border-t border-white/10 text-white/50 text-center text-sm py-8">
          <p className="font-semibold text-white/80 mb-1">MyTani Ku</p>
          <p>Marketplace Pertanian Indonesia</p>
          <p className="mt-2 text-xs">2026 &mdash; Tim MPPL IF-6 UNIKOM</p>
        </footer>
      </body>
    </html>
  )
}
