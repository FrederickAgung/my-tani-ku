import { createClient } from '@supabase/supabase-js'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import { writeFile } from 'fs/promises'
import path from 'path'

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export function isSupabaseConfigured() {
  return Boolean(supabaseUrl && supabaseKey)
}

export function getSupabaseServerClient() {
  if (!isSupabaseConfigured()) return null
  // Always create a fresh client to avoid stale connection issues on Vercel
  return createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  })
}

const dataFile = (name) => path.join(process.cwd(), 'data', `${name}.json`)

function readLocalCollection(name) {
  try {
    return JSON.parse(readFileSync(dataFile(name), 'utf-8'))
  } catch {
    return []
  }
}

function writeLocalCollection(name, value) {
  const dir = path.join(process.cwd(), 'data')
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
  writeFileSync(dataFile(name), JSON.stringify(value, null, 2))
}

export async function readCollection(name) {
  const supabase = getSupabaseServerClient()
  if (!supabase) return readLocalCollection(name)

  // Use .select() without maybeSingle() to avoid edge-case issues on Vercel
  const { data, error } = await supabase
    .from('app_data')
    .select('value')
    .eq('key', name)

  if (error) throw new Error(`Supabase read ${name} failed: ${error.message}`)

  // data is an array of rows; take the first one
  const row = data && data.length > 0 ? data[0] : null
  if (row && Array.isArray(row.value)) return row.value
  if (row) return row.value

  return readLocalCollection(name)
}

export async function writeCollection(name, value) {
  const supabase = getSupabaseServerClient()
  if (!supabase) {
    writeLocalCollection(name, value)
    return value
  }

  const { error } = await supabase
    .from('app_data')
    .upsert({ key: name, value, updated_at: new Date().toISOString() }, { onConflict: 'key' })

  if (error) throw new Error(`Supabase write ${name} failed: ${error.message}`)
  return value
}

export async function addNotification({ userId, targetRole, targetName, type, title, message, link }) {
  const notifications = await readCollection('notifications')
  const notif = {
    id: Date.now(),
    userId: userId || null,
    targetRole: targetRole || null,
    targetName: targetName || null,
    type: type || 'info',
    title,
    message,
    link: link || '/',
    read: false,
    createdAt: new Date().toISOString()
  }
  notifications.unshift(notif)
  await writeCollection('notifications', notifications)
  return notif
}

export async function uploadPublicFile(file, folder = 'uploads') {
  const fallback = `https://placehold.co/300x300/e8f5e9/2e7d32?text=Produk`
  if (!file || !file.size) return fallback

  const ext = (file.name || 'upload.jpg').split('.').pop() || 'jpg'
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
  const buffer = Buffer.from(await file.arrayBuffer())

  const supabase = getSupabaseServerClient()
  if (supabase) {
    const objectPath = `${folder}/${filename}`
    const { error } = await supabase.storage
      .from('uploads')
      .upload(objectPath, buffer, { contentType: file.type || 'application/octet-stream', upsert: false })

    if (error) throw new Error(`Supabase upload failed: ${error.message}`)
    const { data } = supabase.storage.from('uploads').getPublicUrl(objectPath)
    return data.publicUrl
  }

  const uploadDir = path.join(process.cwd(), 'public', folder)
  mkdirSync(uploadDir, { recursive: true })
  await writeFile(path.join(uploadDir, filename), buffer)
  return `/${folder}/${filename}`
}
