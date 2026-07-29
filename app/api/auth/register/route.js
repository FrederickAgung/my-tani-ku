export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { readCollection, writeCollection } from '@/lib/supabaseData'

export async function POST(req) {
  const { nama, email, telepon, password, role } = await req.json()
  await new Promise(r => setTimeout(r, 300))

  const users = await readCollection('users')

  if (users.find(u => u.email === email)) {
    return Response.json({ error: 'Email sudah terdaftar' }, { status: 400 })
  }

  const nextId = users.reduce((max, user) => Math.max(max, Number(user.id) || 0), 0) + 1
  const newUser = {
    id: nextId,
    nama,
    email,
    telepon,
    password, // TODO: gunakan bcrypt sebelum production publik
    role: role || 'pembeli'
  }
  users.push(newUser)
  await writeCollection('users', users)

  const token = 'tok_' + Math.random().toString(36).slice(2)
  return Response.json({
    user: { id: newUser.id, nama: newUser.nama, email: newUser.email, telepon: newUser.telepon, role: newUser.role },
    token
  })
}
