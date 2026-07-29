export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { addNotification, readCollection, writeCollection } from '@/lib/supabaseData'

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const userId = Number(searchParams.get('userId'))
  const role = searchParams.get('role')
  const nama = searchParams.get('nama')
  let notifications = await readCollection('notifications')
  if (userId) {
    notifications = notifications.filter(n => {
      if (n.userId === userId) return true
      if (n.targetRole === role && n.targetName === nama) return true
      return false
    })
  }
  return Response.json(notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
}

export async function POST(req) {
  const notif = await addNotification(await req.json())
  return Response.json({ notif })
}

export async function PATCH(req) {
  const { id } = await req.json()
  const notifications = await readCollection('notifications')
  const notif = notifications.find(n => n.id === id)
  if (notif) {
    notif.read = true
    await writeCollection('notifications', notifications)
  }
  return Response.json({ ok: true })
}
