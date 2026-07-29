-- MyTani Ku Supabase setup
-- Jalankan file ini di Supabase Dashboard > SQL Editor > New query.

create table if not exists public.app_data (
  key text primary key,
  value jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.app_data enable row level security;

-- App Next.js menggunakan SUPABASE_SERVICE_ROLE_KEY di server, jadi tidak butuh policy public
-- untuk app_data. Jangan expose service role key ke browser.

-- Jangan insert row kosong ke app_data di sini.
-- Aplikasi akan otomatis seed data dari file JSON lokal saat endpoint pertama kali dibuka.

insert into storage.buckets (id, name, public)
values ('uploads', 'uploads', true)
on conflict (id) do update set public = true;

drop policy if exists "Public read uploads" on storage.objects;
create policy "Public read uploads"
on storage.objects for select
using (bucket_id = 'uploads');
