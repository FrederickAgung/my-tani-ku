'use client'
import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

export default function ChatDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [conversation, setConversation] = useState(null)
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    const u = localStorage.getItem('myTaniku_user')
    if (!u) { router.push('/login'); return }
    setUser(JSON.parse(u))
  }, [router])

  useEffect(() => {
    if (!user || !id) return
    const load = () => {
      fetch(`/api/chat?conversationId=${id}`)
        .then(r => r.json()).then(data => {
          if (data) setConversation(data)
        })
    }
    load()
    const interval = setInterval(load, 5000)
    return () => clearInterval(interval)
  }, [user, id])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conversation?.messages?.length])

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!message.trim() || !user || sending) return
    setSending(true)
    try {
      // Tentukan penerima
      const otherParticipant = conversation.participants?.find(p => p.id !== user.id)
      const recipientName = otherParticipant?.nama || (
        user.role === 'petani' ? conversation.buyerName : conversation.sellerName
      )

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: user.id,
          senderName: user.nama,
          recipientName,
          message: message.trim()
        })
      })
      const data = await res.json()
      setConversation(data.conversation)
      setMessage('')
    } catch {}
    setSending(false)
  }

  if (!user || !conversation) return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      <div className="animate-spin w-8 h-8 border-2 border-notion-blue border-t-transparent rounded-full mx-auto" />
    </div>
  )

  const otherParticipant = conversation.participants?.find(p => p.id !== user.id)
  const otherName = otherParticipant?.nama || (
    user.role === 'petani' ? conversation.buyerName : conversation.sellerName
  )
  const messages = conversation.messages || []

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Link href="/chat" className="text-notion-blue hover:text-notion-blue-hover">
          <i className="fas fa-arrow-left"></i>
        </Link>
        <div className="w-9 h-9 rounded-full bg-notion-blue/10 text-notion-blue flex items-center justify-center">
          <i className="fas fa-user text-sm"></i>
        </div>
        <div>
          <p className="font-semibold text-sm">{otherName}</p>
          <p className="text-[10px] text-notion-gray">Online</p>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-lg p-4 h-[400px] overflow-y-auto mb-4">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-notion-gray text-sm">
            <p>Belum ada pesan. Kirim pesan untuk memulai percakapan!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map(msg => {
              const isMe = msg.senderId === user.id || msg.senderName === user.nama
              return (
                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] rounded-lg px-4 py-2 ${
                    isMe ? 'bg-notion-blue text-white rounded-br-sm' : 'bg-[#f6f5f4] text-notion-black rounded-bl-sm'
                  }`}>
                    <p className="text-sm">{msg.text}</p>
                    <p className={`text-[10px] mt-1 ${isMe ? 'text-white/60' : 'text-notion-gray'}`}>
                      {new Date(msg.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              )
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className="flex gap-2">
        <input type="text" value={message} onChange={e => setMessage(e.target.value)}
          placeholder="Ketik pesan..."
          className="flex-1 border border-[rgba(0,0,0,0.2)] rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-notion-blue text-sm" />
        <button type="submit" disabled={!message.trim() || sending}
          className="bg-notion-blue hover:bg-notion-blue-hover disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-lg transition">
          <i className={`fas ${sending ? 'fa-spinner fa-spin' : 'fa-paper-plane'}`}></i>
        </button>
      </form>
    </div>
  )
}
