'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function ChatListPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [conversations, setConversations] = useState([])

  useEffect(() => {
    const u = localStorage.getItem('myTaniku_user')
    if (!u) { router.push('/login'); return }
    const parsed = JSON.parse(u)
    setUser(parsed)
    loadConversations(parsed)
  }, [router])

  const loadConversations = (u) => {
    fetch(`/api/chat?userId=${u.id}&sellerName=${encodeURIComponent(u.nama)}`)
      .then(r => r.json()).then(setConversations)
  }

  // Auto-refresh tiap 15 detik
  useEffect(() => {
    if (!user) return
    const interval = setInterval(() => loadConversations(user), 15000)
    return () => clearInterval(interval)
  }, [user])

  if (!user) return null

  const getLastMessage = (conv) => {
    const msgs = conv.messages || []
    return msgs.length > 0 ? msgs[msgs.length - 1] : null
  }

  const otherParty = (conv) => {
    if (user.role === 'petani') return conv.buyerName
    return conv.sellerName
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6" style={{color: 'rgba(0,0,0,0.95)'}}>
        <i className="fas fa-comments mr-2 text-notion-blue"></i>Pesan
      </h1>

      {conversations.length === 0 ? (
        <div className="text-center py-20 text-notion-gray">
          <i className="fas fa-comment-slash text-5xl mb-4 opacity-30"></i>
          <p className="text-lg font-medium">Belum ada percakapan</p>
          <p className="text-sm mt-1">Mulai chat dari halaman produk</p>
        </div>
      ) : (
        <div className="space-y-2">
          {conversations.map(conv => {
            const last = getLastMessage(conv)
            const unread = (conv.messages || []).filter(m => m.senderId !== user.id).length
            return (
              <Link key={conv.id} href={`/chat/${conv.id}`}
                className="flex items-center gap-4 p-4 rounded-lg border border-[rgba(0,0,0,0.1)] hover:bg-[#f6f5f4] transition group">
                <div className="w-10 h-10 rounded-full bg-notion-blue/10 text-notion-blue flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-user"></i>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-sm">{otherParty(conv)}</p>
                    {last && (
                      <span className="text-[10px] text-notion-gray">
                        {new Date(last.createdAt).toLocaleDateString('id-ID', { day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit' })}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-notion-gray truncate mt-0.5">
                    {last ? last.text : 'Belum ada pesan'}
                  </p>
                </div>
                {unread > 0 && (
                  <div className="w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center flex-shrink-0">
                    {unread}
                  </div>
                )}
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
