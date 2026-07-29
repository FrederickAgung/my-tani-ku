# Deploy MyTani Ku ke Vercel + Supabase

## 1. Buat database Supabase

1. Buka https://supabase.com lalu buat project baru.
2. Buka SQL Editor.
3. Jalankan isi file `supabase/schema.sql`.
4. Buka Project Settings > API, salin:
   - Project URL
   - service_role key

## 2. Isi Environment Variables di Vercel

Di Vercel Project Settings > Environment Variables tambahkan:

```env
SUPABASE_URL=https://PROJECT_ID.supabase.co
SUPABASE_SERVICE_ROLE_KEY=SERVICE_ROLE_KEY_KAMU
```

Penting: `SUPABASE_SERVICE_ROLE_KEY` jangan ditaruh di frontend / browser / GitHub public.

## 3. Push project ke GitHub

```bash
git init
git add .
git commit -m "prepare mytani for vercel supabase deploy"
git branch -M main
git remote add origin https://github.com/USERNAME/my-tani-ku.git
git push -u origin main
```

## 4. Deploy di Vercel

1. Buka https://vercel.com/new
2. Import repository GitHub `my-tani-ku`
3. Framework Preset: Next.js
4. Build Command: `npm run build`
5. Install Command: `npm install`
6. Deploy

## 5. Seed data awal

Saat environment Supabase sudah benar, API akan membuat row `app_data` otomatis bila belum ada. Data awal juga bisa diisi manual lewat table editor pada kolom `value`.

Untuk membawa data lokal sekarang ke Supabase, cara cepat:
1. Jalankan aplikasi lokal dengan `.env.local` yang berisi `SUPABASE_URL` dan `SUPABASE_SERVICE_ROLE_KEY`.
2. Buka endpoint ini sekali:
   - `/api/produk`
   - `/api/admin/users`
   - `/api/notifications`
   - `/api/orders`
   - `/api/chat`
   - `/api/reviews`
   - `/api/midtrans`

Helper app akan seed koleksi dari file JSON lokal kalau row belum ada.

## Catatan keamanan

Versi ini masih memakai password plain text sesuai kode lama. Untuk production publik, migrasikan auth ke Supabase Auth atau hash password dengan bcrypt.
