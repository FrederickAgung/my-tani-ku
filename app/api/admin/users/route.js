export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { readCollection } from '@/lib/supabaseData'

export async function GET() {
  await new Promise(r => setTimeout(r, 200))
  const users = await readCollection('users')
  const safe = users.map(u => ({ id: u.id, nama: u.nama, email: u.email, telepon: u.telepon, role: u.role }))
  return Response.json(safe)
}
