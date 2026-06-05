// apply-schema.mjs — run with: npm run db:setup
// Requires DATABASE_URL in .env.local
// Get it from: Supabase Dashboard → Settings → Database → Connection string → URI

import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

function loadEnv() {
  try {
    const content = readFileSync(resolve(__dirname, '../.env.local'), 'utf-8')
    content.split('\n').forEach(line => {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) return
      const idx = trimmed.indexOf('=')
      if (idx === -1) return
      const key = trimmed.slice(0, idx).trim()
      const val = trimmed.slice(idx + 1).trim()
      if (key) process.env[key] = val
    })
  } catch { console.warn('⚠️  Could not read .env.local') }
}

loadEnv()

const DATABASE_URL = process.env.DATABASE_URL

if (!DATABASE_URL || DATABASE_URL.includes('[YOUR-PASSWORD]')) {
  console.error(`
❌  DATABASE_URL is not configured in .env.local

Steps to fix:
  1. Open: https://supabase.com/dashboard/project/lngkmhxpwccfjeiwbfxe/settings/database
  2. Scroll to "Connection string" → select "URI"
  3. Copy it (it looks like: postgresql://postgres:[PASSWORD]@db.lngkmhxpwccfjeiwbfxe.supabase.co:5432/postgres)
  4. Paste into .env.local:
       DATABASE_URL=postgresql://postgres:YOUR_ACTUAL_PASSWORD@db.lngkmhxpwccfjeiwbfxe.supabase.co:5432/postgres
  5. Re-run: npm run db:setup
`)
  process.exit(1)
}

const { default: pg } = await import('pg')
const { Pool } = pg
const pool = new Pool({ connectionString: DATABASE_URL, ssl: { rejectUnauthorized: false } })

const SCHEMA = readFileSync(resolve(__dirname, '../supabase/schema.sql'), 'utf-8')

async function run() {
  const client = await pool.connect()
  try {
    console.log('🔄  Connecting to Supabase...')
    await client.query('SELECT 1')
    console.log('✅  Connected!\n')

    console.log('🔄  Applying schema...')
    await client.query(SCHEMA)
    console.log('✅  Schema applied!\n')

    // Verify
    const { rows } = await client.query(`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_name IN ('profiles','survey_responses')
      ORDER BY table_name;
    `)
    console.log('📋  Tables verified:')
    rows.forEach(r => console.log(`   ✓ public.${r.table_name}`))

    // Verify function
    const { rows: fns } = await client.query(`
      SELECT routine_name FROM information_schema.routines
      WHERE routine_schema = 'public' AND routine_name = 'get_public_stats';
    `)
    if (fns.length) console.log('   ✓ public.get_public_stats()')

    console.log(`
🎉  Database is ready!

Login flow:
  • Any email/password  → /survey/welcome (normal user)
  • bloodyshaad@gmail.com  → /admin (admin dashboard)

Run the app: npm run dev
`)
  } catch (err) {
    console.error('\n❌  Error:', err.message)
    if (err.message.includes('password authentication')) {
      console.error('   → Wrong database password. Check DATABASE_URL in .env.local')
    }
    process.exit(1)
  } finally {
    client.release()
    await pool.end()
  }
}

run()
