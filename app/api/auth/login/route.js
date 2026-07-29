export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { readCollection } from '@/lib/supabaseData'

export async function POST(req) {
  const { email, password } = await req.json()
  await new Promise(r => setTimeout(r, 300))

  const users = await readCollection('users')
  const user = users.find(u => u.email === email && u.password === password)
  if (!user) {
    return Response.json({ error: 'Email atau kata sandi salah' }, { status: 401 })
  }

  const token = 'tok_' + Math.random().toString(36).slice(2)
  return Response.json({
    user: { id: user.id, nama: user.nama, email: user.email, telepon: user.telepon, role: user.role },
    token
  })
}
