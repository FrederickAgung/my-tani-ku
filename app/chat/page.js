'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function ChatListPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [conversations, setConversations] = useState([])
  const [showNew, setShowNew] = useState(false)
  const [users, setUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const u = localStorage.getItem('myTaniku_user')
    if (!u) { router.push('/login'); return }
    const parsed = JSON.parse(u)
    setUser(parsed)
    loadConversations(parsed)
  }, [router])

  const loadConversations = (u) => {
    fetch(`/api/chat?userId=${u.id}&userName=${encodeURIComponent(u.nama)}`)
      .then(r => r.json()).then(setConversations)
  }

  // Auto-refresh tiap 15 detik
  useEffect(() => {
    if (!user) return
    const interval = setInterval(() => loadConversations(user), 15000)
    return () => clearInterval(interval)
  }, [user])

  const startNewChat = async (otherUser) => {
    if (!user) return
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        senderId: user.id,
        senderName: user.nama,
        recipientId: otherUser.id,
        recipientName: otherUser.nama,
        message: 'Halo!'
      })
    })
    const data = await res.json()
    router.push(`/chat/${data.conversation.id}`)
  }

  const loadUsers = () => {
    fetch('/api/produk/seller')
      .then(r => r.json())
      .then(products => {
        // Dapatkan semua penjual dari produk
        const sellerNames = [...new Set(products.map(p => p.penjual))]
        setUsers(sellerNames.map((nama, i) => ({ id: i + 1000, nama })))
      })
    setShowNew(true)
  }

  if (!user) return null

  const getLastMessage = (conv) => {
    const msgs = conv.messages || []
    return msgs.length > 0 ? msgs[msgs.length - 1] : null
  }

  const otherParty = (conv) => {
    if (conv.participants) {
      const other = conv.participants.find(p => p.id !== user.id)
      if (other) return other.nama
    }
    if (user.role === 'petani') return conv.buyerName
    return conv.sellerName
  }

  const filteredUsers = users.filter(u =>
    u.nama !== user.nama &&
    u.nama.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !conversations.some(c => {
      if (c.participants) return c.participants.some(p => p.nama === u.nama)
      return c.sellerName === u.nama || c.buyerName === u.nama
    })
  )

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold" style={{color: 'rgba(0,0,0,0.95)'}}>
          <i className="fas fa-comments mr-2 text-notion-blue"></i>Pesan
        </h1>
        <button onClick={loadUsers}
          className="bg-notion-blue hover:bg-notion-blue-hover text-white text-sm px-4 py-2 rounded-lg font-medium">
          <i className="fas fa-plus mr-1"></i>Pesan Baru
        </button>
      </div>

      {/* New Chat Modal */}
      {showNew && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center pt-20 px-4"
          onClick={() => setShowNew(false)}>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6"
            onClick={e => e.stopPropagation()}>
            <h2 className="font-bold mb-3">Mulai Percakapan Baru</h2>
            <input type="text" placeholder="Cari pengguna..."
              value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-notion-blue" />
            <div className="max-h-60 overflow-y-auto space-y-1">
              {filteredUsers.length === 0 ? (
                <p className="text-sm text-notion-gray text-center py-4">Tidak ada pengguna lain</p>
              ) : filteredUsers.map(u => (
                <button key={u.id} onClick={() => startNewChat(u)}
                  className="w-full text-left p-3 rounded-lg hover:bg-[#f6f5f4] transition flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-notion-blue/10 text-notion-blue flex items-center justify-center text-xs font-bold">
                    {u.nama[0]?.toUpperCase()}
                  </div>
                  <span className="text-sm font-medium">{u.nama}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {conversations.length === 0 ? (
        <div className="text-center py-20 text-notion-gray">
          <i className="fas fa-comment-slash text-5xl mb-4 opacity-30"></i>
          <p className="text-lg font-medium">Belum ada percakapan</p>
          <p className="text-sm mt-1">Mulai chat dari halaman produk atau klik &quot;Pesan Baru&quot;</p>
        </div>
      ) : (
        <div className="space-y-2">
          {conversations.map(conv => {
            const last = getLastMessage(conv)
            const unread = (conv.messages || []).filter(m => m.senderId !== user.id && m.senderName !== user.nama).length
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
