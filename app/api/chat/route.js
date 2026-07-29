export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { addNotification, readCollection, writeCollection } from '@/lib/supabaseData'

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const userId = Number(searchParams.get('userId'))
  const conversationId = Number(searchParams.get('conversationId'))
  const sellerName = searchParams.get('seller')
  const buyerId = Number(searchParams.get('buyerId'))

  const conversations = await readCollection('chats')

  if (conversationId) {
    const conv = conversations.find(c => c.id === conversationId)
    return Response.json(conv || null)
  }

  if (sellerName && buyerId) {
    const conv = conversations.find(c => c.buyerId === buyerId && c.sellerName === sellerName)
    return Response.json(conv || null)
  }

  const userConvs = conversations.filter(c => c.buyerId === userId || c.sellerName === sellerName || c.messages.some(m => m.senderId === userId))
  return Response.json(userConvs)
}

export async function POST(req) {
  const { buyerId, buyerName, sellerName, message, conversationId } = await req.json()
  const conversations = await readCollection('chats')
  let conv

  if (conversationId) {
    conv = conversations.find(c => c.id === conversationId)
  } else {
    conv = conversations.find(c => c.buyerId === buyerId && c.sellerName === sellerName)
  }

  if (!conv) {
    conv = {
      id: Date.now(),
      buyerId,
      buyerName,
      sellerName,
      messages: [],
      createdAt: new Date().toISOString()
    }
    conversations.unshift(conv)
  }

  const msg = {
    id: conv.messages.length + 1,
    senderId: buyerId,
    senderName: buyerName,
    text: message,
    createdAt: new Date().toISOString()
  }
  conv.messages.push(msg)
  conv.updatedAt = new Date().toISOString()
  await writeCollection('chats', conversations)

  await addNotification({
    targetRole: 'seller',
    targetName: sellerName,
    type: 'chat',
    title: 'Pesan Baru',
    message: `${buyerName}: ${message.slice(0, 80)}${message.length > 80 ? '...' : ''}`,
    link: `/chat/${conv.id}`
  })

  return Response.json({ message: msg, conversation: conv })
}
