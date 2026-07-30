export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { addNotification, readCollection, writeCollection } from '@/lib/supabaseData'

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const userId = Number(searchParams.get('userId'))
  const userName = searchParams.get('userName')
  const conversationId = Number(searchParams.get('conversationId'))

  const conversations = await readCollection('chats')

  // Cari percakapan spesifik berdasarkan ID
  if (conversationId) {
    const conv = conversations.find(c => c.id === conversationId)
    return Response.json(conv || null)
  }

  // Cari semua percakapan yang melibatkan user ini
  const userConvs = conversations.filter(c => {
    // Cek di participants (format baru)
    if (c.participants && c.participants.some(p => p.id === userId)) return true
    // Cek di field lama (backward compat)
    if (c.buyerId === userId) return true
    if (userName && (c.sellerName === userName || c.buyerName === userName)) return true
    // Cek di messages
    if (c.messages && c.messages.some(m => m.senderId === userId)) return true
    return false
  })

  return Response.json(userConvs)
}

export async function POST(req) {
  const { senderId, senderName, recipientId, recipientName, message } = await req.json()
  const conversations = await readCollection('chats')

  // Cari percakapan yang sudah ada antara kedua user ini
  let conv = conversations.find(c => {
    // Format baru: participants
    if (c.participants) {
      const ids = c.participants.map(p => p.id)
      return ids.includes(senderId) && ids.includes(recipientId)
    }
    // Format lama: buyerId/sellerName
    return (c.buyerId === senderId && c.sellerName === recipientName) ||
           (c.buyerId === recipientId && c.sellerName === senderName) ||
           (c.buyerName === senderName && c.sellerName === recipientName) ||
           (c.buyerName === recipientName && c.sellerName === senderName)
  })

  // Konversi format lama ke baru jika perlu
  if (conv && !conv.participants) {
    conv.participants = [
      { id: conv.buyerId, nama: conv.buyerName },
      { id: null, nama: conv.sellerName }
    ]
    // Cari id seller dari messages
    for (const msg of (conv.messages || [])) {
      if (msg.senderId !== conv.buyerId && !conv.participants.some(p => p.nama === msg.senderName)) {
        conv.participants.push({ id: msg.senderId, nama: msg.senderName })
      }
    }
  }

  // Buat percakapan baru jika belum ada
  if (!conv) {
    conv = {
      id: Date.now(),
      participants: [
        { id: senderId, nama: senderName },
        { id: recipientId, nama: recipientName }
      ],
      messages: [],
      createdAt: new Date().toISOString(),
      // Simpan field lama untuk backward compat
      buyerId: senderId,
      buyerName: senderName,
      sellerName: recipientName,
    }
    conversations.unshift(conv)
  }

  const msg = {
    id: (conv.messages.length || 0) + 1,
    senderId,
    senderName,
    text: message,
    createdAt: new Date().toISOString()
  }
  conv.messages.push(msg)
  conv.updatedAt = new Date().toISOString()
  await writeCollection('chats', conversations)

  // Kirim notifikasi ke penerima
  const recipient = conv.participants?.find(p => p.id !== senderId)
  const recipientNameFinal = recipient?.nama || recipientName

  await addNotification({
    targetName: recipientNameFinal,
    type: 'chat',
    title: 'Pesan Baru',
    message: `${senderName}: ${message.slice(0, 80)}${message.length > 80 ? '...' : ''}`,
    link: `/chat/${conv.id}`
  })

  return Response.json({ message: msg, conversation: conv })
}
