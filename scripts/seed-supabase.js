const fs = require('fs')
const path = require('path')
const { createClient } = require('@supabase/supabase-js')

// Baca environment variables
const envPath = path.join(__dirname, '..', '.env.local')
const envContent = fs.readFileSync(envPath, 'utf-8')
const vars = {}
envContent.split('\n').forEach(line => {
  const idx = line.indexOf('=')
  if (idx > 0) vars[line.slice(0, idx).trim()] = line.slice(idx + 1).trim()
})

const supabaseUrl = vars.SUPABASE_URL || vars.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = vars.SUPABASE_SERVICE_ROLE_KEY || vars.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false, autoRefreshToken: false }
})

async function main() {
  // Baca semua data dari file JSON lokal
  const dataDir = path.join(__dirname, '..', 'data')
  const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'))
  
  for (const file of files) {
    const name = file.replace('.json', '')
    const filePath = path.join(dataDir, file)
    const content = fs.readFileSync(filePath, 'utf-8')
    const value = JSON.parse(content)
    
    // Tulis ke Supabase via upsert
    const { error } = await supabase
      .from('app_data')
      .upsert({ 
        key: name, 
        value, 
        updated_at: new Date().toISOString() 
      }, { 
        onConflict: 'key' 
      })
    
    if (error) {
      console.log(`❌ ${name}: ${error.message}`)
    } else {
      console.log(`✅ ${name}: ${Array.isArray(value) ? value.length + ' items' : 'ok'}`)
    }
  }
  
  // Verifikasi
  console.log('\n--- Verifikasi ---')
  const { data, error } = await supabase.from('app_data').select('key, value')
  if (error) {
    console.log('Verifikasi error:', error.message)
    return
  }
  for (const row of data) {
    const val = row.value
    const count = Array.isArray(val) ? val.length : 'N/A'
    console.log(`  ${row.key}: ${count}`)
  }
}

main().catch(console.error)
