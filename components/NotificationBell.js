'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

export default function NotificationBell({ user }) {
  const [notifs, setNotifs] = useState([])
  const [open, setOpen] = useState(false)
  const ref = useRef()

  // Auto-fetch notif tiap 10 detik
  useEffect(() => {
    if (!user) return
    const fetchNotifs = () => {
      const role = user.role === 'petani' ? 'seller' : user.role
      fetch(`/api/notifications?userId=${user.id}&role=${role}&nama=${encodeURIComponent(user.nama)}`)
        .then(r => r.json())
        .then(data => setNotifs(data.slice(0, 50))) // ambil 50 notif terbaru
        .catch(() => {})
    }
    fetchNotifs()
    const interval = setInterval(fetchNotifs, 10000)
    return () => clearInterval(interval)
  }, [user])

  // Tutup dropdown saat klik di luar
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const unread = notifs.filter(n => !n.read).length

  const markAllRead = async () => {
    // Tandai semua notif yg belum dibaca
    const unreadIds = notifs.filter(n => !n.read).map(n => n.id)
    if (unreadIds.length === 0) return

    await fetch('/api/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: unreadIds })
    })
    setNotifs(notifs.map(n => ({ ...n, read: true })))
  }

  const markRead = async (id) => {
    await fetch('/api/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })
    setNotifs(notifs.map(n => n.id === id ? { ...n, read: true } : n))
  }

  // Mark all as read saat buka dropdown (supaya badge hilang)
  const toggleOpen = () => {
    if (!open) {
      if (unread > 0) markAllRead()
    }
    setOpen(!open)
  }

  const iconByType = {
    order: 'fa-shopping-bag',
    payment: 'fa-credit-card',
    shipping: 'fa-truck',
    review: 'fa-star',
    chat: 'fa-comment',
    info: 'fa-bell'
  }

  if (!user) return null

  return (
    <div className="relative" ref={ref}>
      <button onClick={toggleOpen} className="relative text-white/80 hover:text-white transition p-1">
        <i className="fas fa-bell text-lg"></i>
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="fixed md:absolute right-2 md:right-0 top-12 md:top-full mt-0 md:mt-2 w-80 md:w-80 bg-white shadow-xl border border-[rgba(0,0,0,0.1)] z-50 rounded-xl"
          style={{ maxHeight: 'min(80vh, 500px)', overflowY: 'auto' }}
        >
          {/* Dalam mobile (fixed) positioning diatur via CSS di atas */}
          <div className="sticky top-0 bg-white border-b border-[rgba(0,0,0,0.1)] px-4 py-3 flex items-center justify-between z-10">
            <p className="font-semibold text-sm" style={{color: 'rgba(0,0,0,0.95)'}}>Notifikasi</p>
            <div className="flex items-center gap-2">
              {unread > 0 && (
                <button onClick={markAllRead}
                  className="text-xs text-notion-blue hover:text-notion-blue-hover font-medium">
                  Tandai dibaca
                </button>
              )}
              <span className="text-xs text-notion-gray">{notifs.length} notif</span>
            </div>
          </div>

          {notifs.length === 0 ? (
            <div className="p-8 text-center text-notion-gray text-sm">
              <i className="fas fa-bell-slash text-2xl mb-2 opacity-40"></i>
              <p>Tidak ada notifikasi</p>
            </div>
          ) : (
            <div className="divide-y divide-[rgba(0,0,0,0.05)]">
              {notifs.map(n => (
                <Link key={n.id} href={n.link} onClick={() => { markRead(n.id); setOpen(false) }}
                  className={`flex items-start gap-3 px-4 py-3 hover:bg-[#f6f5f4] transition ${!n.read ? 'bg-[#f2f9ff]' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    n.type === 'payment' ? 'bg-green-100 text-green-600' :
                    n.type === 'order' ? 'bg-blue-100 text-blue-600' :
                    n.type === 'shipping' ? 'bg-amber-100 text-amber-600' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    <i className={`fas ${iconByType[n.type] || 'fa-bell'} text-sm`}></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${!n.read ? 'font-semibold' : ''}`} style={{color: 'rgba(0,0,0,0.95)'}}>{n.title}</p>
                    <p className="text-xs text-notion-gray truncate">{n.message}</p>
                    <p className="text-[10px] text-notion-gray/60 mt-0.5">
                      {new Date(n.createdAt).toLocaleDateString('id-ID', { day:'numeric', month:'short', hour:'2-digit', minute:'2-digit' })}
                    </p>
                  </div>
                  {!n.read && <div className="w-2 h-2 bg-notion-blue rounded-full flex-shrink-0 mt-2"></div>}
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
