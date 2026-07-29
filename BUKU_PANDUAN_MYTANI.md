# 📘 BUKU PANDUAN APLIKASI MyTani Ku

**Marketplace Pertanian Digital Indonesia**  
*Versi 1.0 — 2026*

---

## 📋 Daftar Isi

1. [Pendahuluan](#1-pendahuluan)
2. [Cara Menjalankan Aplikasi](#2-cara-menjalankan-aplikasi)
3. [Registrasi & Login](#3-registrasi--login)
4. [Peran (Role) Pengguna](#4-peran-role-pengguna)
5. [Fitur untuk Semua Pengguna](#5-fitur-untuk-semua-pengguna)
6. [Fitur Pembeli](#6-fitur-pembeli)
7. [Fitur Petani (Penjual)](#7-fitur-petani-penjual)
8. [Fitur Admin](#8-fitur-admin)
9. [Sistem Notifikasi](#9-sistem-notifikasi)
10. [Data & API](#10-data--api)
11. [FAQ & Troubleshooting](#11-faq--troubleshooting)

---

## 1. Pendahuluan

**MyTani Ku** adalah marketplace digital yang menghubungkan petani Indonesia dengan pembeli secara langsung tanpa perantara (tengkulak). Aplikasi ini dibangun menggunakan **Next.js 14** dengan konsep desain ala Notion.

### Tujuan Aplikasi
- Memudahkan petani menjual hasil panen, peralatan, dan benih secara online
- Memberikan akses bagi pembeli untuk mendapatkan produk pertanian berkualitas
- Menyediakan sistem manajemen toko yang sederhana bagi petani
- Mewujudkan ekosistem pertanian digital yang transparan dan adil

### Teknologi
- **Frontend & Backend:** Next.js 14 (App Router)
- **CSS Framework:** Tailwind CSS
- **Database:** File-based JSON (development)
- **Font Awesome:** Ikon
- **Payment Gateway:** Midtrans (simulasi)

---

## 2. Cara Menjalankan Aplikasi

### Prasyarat
- Node.js versi 18+ 
- NPM atau Yarn

### Langkah-langkah

```bash
# 1. Install dependencies
npm install

# 2. Jalankan development server
npm run dev

# 3. Buka di browser
# http://localhost:3000
```

### Perintah Lain
```bash
npm run build    # Build untuk production
npm run start    # Jalankan production server
```

### Akun Demo

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@myTaniku.com | admin123 |
| **Pembeli** | agungbakakak@gmail.com | 12345678 |
| **Petani** | petani@gmail.com | 123456 |
| **Petani** | bakakakagung@gmail.com | 12345678 |

---

## 3. Registrasi & Login

### 3.1 Registrasi (Daftar Akun Baru)

**Akses:** Klik tombol **"Daftar"** di pojok kanan atas navigasi.

**Form Registrasi:**
1. **Nama Lengkap** — Nama yang akan ditampilkan
2. **Email** — Gunakan email aktif (validasi unik)
3. **Nomor Telepon** — Nomor WhatsApp/HP
4. **Kata Sandi** — Minimal 6 karakter
5. **Daftar sebagai** — Pilih **Pembeli** atau **Petani (Penjual)**

Setelah berhasil, Anda langsung login dan diarahkan ke halaman utama.

### 3.2 Login (Masuk)

**Akses:** Klik tombol **"Masuk"** di pojok kanan atas navigasi.

**Form Login:**
1. **Email** — Email yang terdaftar
2. **Kata Sandi** — Password akun

**Pesan Error:**
- `"Email atau kata sandi salah"` — jika kredensial tidak cocok

### 3.3 Logout (Keluar)

Klik tombol **"Keluar"** di navigasi (hanya muncul saat sudah login).

---

## 4. Peran (Role) Pengguna

Aplikasi MyTani Ku memiliki **3 role pengguna**:

### 👤 Pembeli
- Melihat katalog produk
- Membeli produk
- Chat dengan penjual
- Memberi ulasan & rating
- Melacak pesanan

### 🌾 Petani (Penjual)
- Semua fitur Pembeli
- Dashboard penjual
- Menambah & mengelola produk
- Melihat pesanan masuk
- Mengirim pesanan (input kurir & resi)
- Laporan penjualan
- Tarik uang (withdrawal)

### ⚙️ Admin
- Melihat semua pengguna
- Melihat semua produk
- Melihat semua pesanan
- Manajemen sistem

Navigasi akan menyesuaikan secara otomatis berdasarkan role pengguna yang login.

---

## 5. Fitur untuk Semua Pengguna

### 5.1 Halaman Utama (Beranda)

**URL:** `/`

**Komponen:**
- **Hero Section** — Banner utama dengan tagline
- **Kategori Produk** — 3 kategori: Peralatan Tani, Hasil Tani, Benih
- **Produk Unggulan** — Menampilkan 4 produk teratas
- **CTA Section** — Call-to-action sesuai role

### 5.2 Katalog Produk

**URL:** `/katalog`

**Fitur:**
- ✅ **Lihat semua produk** — Gabungan dari produk admin dan produk petani
- ✅ **Cari produk** — Filter berdasarkan nama produk (search bar)
- ✅ **Filter kategori** — Dropdown: Semua, Peralatan Tani, Hasil Tani, Benih
- ✅ **Filter URL** — Dapat diakses via URL parameter `?kategori=hasil-tani`

**Informasi yang ditampilkan per produk:**
- Gambar produk
- Nama produk
- Kategori
- Harga (Rp)
- Rating (bintang)
- Nama penjual
- Status stok (Tersedia / Habis)

### 5.3 Detail Produk

**URL:** `/katalog/[id]`

**Fitur:**
- ✅ Gambar produk (ukuran besar)
- ✅ Informasi lengkap: kategori, nama, rating, harga, penjual, deskripsi
- ✅ Tombol **"Beli"** — Menambahkan ke keranjang
- ✅ Tombol **"Chat dengan Penjual"** — Membuka chat (jika sudah login)
- ✅ **Ulasan Pembeli** — Melihat rating & komentar dari pembeli lain

### 5.4 Chat

**URL Daftar Chat:** `/chat`  
**URL Detail Chat:** `/chat/[id]`

**Fitur:**
- ✅ Daftar percakapan — Menampilkan semua chat user
- ✅ **Auto-refresh** — Chat ter-update setiap 5 detik
- ✅ Notifikasi pesan baru (badge merah)
- ✅ Waktu pesan
- ✅ Chat bubble — Biru (pesan kita), Abu-abu (pesan lawan)
- ✅ Scroll otomatis ke pesan terbaru

**Cara memulai chat:**
1. Buka halaman detail produk
2. Klik tombol **"Chat dengan Penjual"**
3. Percakapan baru otomatis dibuat dengan pesan salam

### 5.5 Sistem Navigasi

**Navigasi Atas (Sticky):**
- Logo "MyTani Ku" (link ke beranda)
- Beranda
- Katalog
- Keranjang
- Pesanan
- Chat (jika login)
- Jual / Laporan / Tarik (khusus Petani)
- Admin (khusus Admin)
- 🔔 Notifikasi Bell
- Nama pengguna
- Tombol Masuk/Daftar (jika belum login)
- Tombol Keluar (jika sudah login)

**Menu Mobile (Hamburger):**
Navigasi yang sama dalam bentuk dropdown vertikal.

Terdapat **footer** dengan informasi tim pengembang.

---

## 6. Fitur Pembeli

### 6.1 Keranjang Belanja

**URL:** `/keranjang`

**Fitur:**
- ✅ **Lihat item** — Semua produk yang ditambahkan ke keranjang
- ✅ **Atur kuantitas** — Tombol `+` dan `-` untuk menambah/mengurangi jumlah
- ✅ **Hapus item** — Jika kuantitas 0, item otomatis terhapus
- ✅ **Subtotal** — Total harga barang
- ✅ **Biaya layanan** — Rp 5.000 (flat)
- ✅ **Grand total** — Subtotal + biaya layanan
- ✅ **Penyimpanan lokal** — Data keranjang disimpan di `localStorage` per user

> **Catatan:** Keranjang bersifat lokal (per perangkat), tidak sync antar perangkat.

### 6.2 Checkout & Pembayaran

**Alur pembayaran:**
1. Di halaman keranjang, klik **"Lanjut ke Pembayaran"**
2. Pilih metode pembayaran:

| Metode | Keterangan |
|--------|-----------|
| **Transfer Bank** | BCA, Mandiri, BNI, BRI |
| **Dompet Digital** | GoPay, OVO, DANA, LinkAja |
| **QRIS** | Scan QR via e-Wallet atau M-Banking |
| **Midtrans** ✅ | Kartu Kredit, Virtual Account, dll (direkomendasikan) |

3. Klik **"Bayar"** sesuai metode yang dipilih

**Jika pilih Midtrans:**
- Diarahkan ke halaman pembayaran Midtrans (`/payment/[snapToken]`)
- Pilih metode pembayaran di halaman Midtrans:
  - Transfer Bank (Virtual Account)
  - GoPay
  - QRIS
  - ShopeePay
  - Akulaku (Cicilan 0% / Paylater)
- Klik **"Bayar"** untuk memproses

**Setelah pembayaran:**
- Tampilan sukses dengan informasi transaksi
- Notifikasi dikirim ke penjual
- Pesanan muncul di halaman pesanan

### 6.3 Pesanan Saya

**URL:** `/pesanan`

**Fitur:**
- ✅ **Daftar pesanan** — Semua pesanan yang pernah dibuat
- ✅ **Status pesanan:** 

| Status | Icon | Keterangan |
|--------|------|-----------|
| ⏳ **Menunggu Dikirim** | 🕐 | Pembayaran berhasil, menunggu penjual kirim |
| 🚚 **Dikirim** | 🚚 | Penjual sudah input kurir & no resi |
| ✅ **Selesai** | ✅ | Pembeli sudah konfirmasi diterima |

- ✅ **Informasi:** Tanggal, item (nama, penjual, qty, harga), metode pembayaran, total
- ✅ **Tracking pengiriman:** Nama kurir & No. Resi (jika status "Dikirim")
- ✅ **Tombol "Pesanan Diterima"** — Konfirmasi barang sudah sampai
- ✅ Status berubah menjadi "Selesai" setelah dikonfirmasi

### 6.4 Ulasan & Rating

**Akses:** Halaman detail produk `/katalog/[id]`

**Fitur:**
- ✅ **Lihat semua ulasan** — Rating bintang + komentar + nama pengulas + tanggal
- ✅ **Beri ulasan** — Klik tombol **"Beri Ulasan"**
- ✅ **Rating:** 1–5 bintang (pilih dengan klik)
- ✅ **Komentar:** Opsional, textarea bebas
- ✅ **Validasi:** 1 user hanya bisa 1 ulasan per produk
- ✅ **Rating rata-rata otomatis terupdate** setelah ulasan baru

**Form ulasan muncul jika:**
- User sudah login
- User belum pernah memberi ulasan untuk produk ini

---

## 7. Fitur Petani (Penjual)

### 7.1 Dashboard Penjual

**URL:** `/seller`

**Ringkasan (4 Kartu Statistik):**
| Kartu | Informasi |
|-------|-----------|
| 💰 **Pendapatan** | Total dari pesanan yang sudah selesai (delivered) |
| 📦 **Produk** | Jumlah produk yang dimiliki |
| 📋 **Pesanan** | Total semua pesanan |
| ✅ **Selesai** | Jumlah pesanan yang sudah selesai |

**Tombol Aksi:**
- 📊 **Laporan** — Buka halaman laporan penjualan
- 💸 **Tarik Uang** — Buka halaman penarikan saldo
- ➕ **Tambah Produk** — Tambah produk baru

**Daftar Produk Saya:**
- Menampilkan semua produk milik petani
- Informasi: Nama, harga, kategori
- Jika belum ada produk: tampilan kosong dengan ajakan "Tambahkan produk pertamamu"

### 7.2 Tambah Produk

**URL:** `/seller/tambah`

**Form:**
1. **Gambar Produk** — Upload file gambar (PNG, JPG, WEBP) dengan preview
   - Klik area upload untuk memilih file
   - Preview muncul setelah memilih file
   - Default: placeholder jika tidak upload
2. **Nama Produk** — Nama produk (wajib)
3. **Kategori** — Dropdown: Peralatan Tani, Hasil Tani, Benih
4. **Harga (Rp)** — Angka minimal Rp 100
5. **Deskripsi** — Textarea, opsional

**Proses:**
- Data dikirim via **FormData** (multipart)
- Gambar disimpan di `public/uploads/`
- Produk disimpan di `data/seller_products.json`
- Setelah berhasil, redirect ke `/seller`

### 7.3 Pesanan Masuk

**URL:** `/pesanan`

**Fitur untuk Petani:**
- ✅ Melihat daftar pesanan yang berisi produk miliknya
- ✅ **Form Kirim Pesanan** (untuk status "pending"):
  - Input **Nama Kurir** (JNE, SiCepat, J&T, dll)
  - Input **No. Resi** (nomor tracking)
  - Klik **"Kirim"** — Status berubah jadi "Dikirim"
- ✅ Notifikasi ke pembeli saat pesanan dikirim

### 7.4 Laporan Penjualan

**URL:** `/seller/laporan`

**Filter Periode:**
| Tombol | Rentang |
|--------|---------|
| 📅 **Semua Waktu** | Semua data |
| 📅 **7 Hari Terakhir** | 1 minggu ke belakang |
| 📅 **30 Hari Terakhir** | 1 bulan ke belakang |

**4 Kartu Statistik:**
| Kartu | Detail |
|-------|--------|
| Total Pendapatan | Rupiah dari pesanan selesai |
| Total Pesanan | Jumlah + berapa yang selesai |
| Rata-rata Pesanan | Rata-rata nilai per pesanan |
| Produk Terjual | Produk dengan stok aktif |

**Grafik Pendapatan Harian:**
- Bar chart vertikal
- Sumbu X: tanggal (format "dd Mon")
- Sumbu Y: nominal dalam ribuan (Rp Xrb)
- Hover: tooltip dengan nominal lengkap
- Responsif & interaktif

**Produk Terlaris (Top 5):**
- Ranking produk berdasarkan pendapatan
- Progress bar persentase
- Nominal pendapatan per produk

**Status Pesanan:**
- Visual progress bar untuk setiap status:
  - 🟠 Menunggu Dikirim (pending)
  - 🔵 Dalam Pengiriman (shipped)
  - 🟢 Selesai (delivered)
- Jumlah & persentase per status

**Tabel Pesanan Terbaru (10 terakhir):**
- Order ID, Pembeli, Total, Status, Tanggal

### 7.5 Tarik Uang (Withdrawal)

**URL:** `/seller/penarikan`

**Saldo Tersedia:**
- Ditampilkan dalam kartu gradasi biru
- Dihitung dari total pesanan "delivered" milik petani

**Form Penarikan:**
1. **Jumlah Penarikan** — Nominal (min Rp 1.000, maks = saldo)
2. **Bank** — Pilih: BCA, Mandiri, BNI, BRI, BSI
3. **Nomor Rekening** — No. rekening tujuan
4. **Nama Pemilik Rekening** — Sesuai KTP

**Validasi:**
- Jumlah tidak boleh melebihi saldo
- Jumlah minimal Rp 1.000
- Tombol disable jika nominal tidak valid

**Setelah Kirim:**
- Tampilan sukses dengan ringkasan
- Informasi: "Dana akan diproses 1x24 jam kerja"

> **Catatan:** Fitur ini masih simulasi, tidak ada transfer sungguhan.

---

## 8. Fitur Admin

### 8.1 Dashboard Admin

**URL:** `/admin`

**Tab Navigation:**
| Tab | Icon | Fungsi |
|-----|------|--------|
| 👥 **Pengguna** | fa-users | Manajemen user |
| 📦 **Produk** | fa-box | Manajemen produk |
| 📋 **Pesanan** | fa-clipboard-list | Manajemen pesanan |

### 8.2 Tab Pengguna

**Tabel Pengguna:**
| Kolom | Keterangan |
|-------|-----------|
| Nama | Nama lengkap user |
| Email | Alamat email |
| Telepon | Nomor HP |
| Role | Label dengan warna: 🟢 Petani, 🔵 Pembeli, 🔴 Admin |

**Fitur:**
- ✅ Melihat semua pengguna terdaftar
- ✅ Total jumlah pengguna
- ✅ Filter visual berdasarkan warna role

### 8.3 Tab Produk

**Tabel Produk:**
| Kolom | Keterangan |
|-------|-----------|
| Nama | Nama produk |
| Kategori | Label biru (Peralatan Tani / Hasil Tani / Benih) |
| Harga | Rupiah (biru) |
| Penjual | Nama penjual |
| Rating | Skor rating |
| Stok | 🟢 Tersedia / 🔴 Habis |

**Fitur:**
- ✅ Melihat semua produk (dari admin + seller)
- ✅ Total jumlah produk

### 8.4 Tab Pesanan

**Fitur:**
- ✅ Melihat semua pesanan dari seluruh pengguna
- ✅ Status: 🟠 Pending / 🔵 Dikirim / 🟢 Selesai
- ✅ Detail: Tanggal, pembeli, item, metode bayar, total
- ✅ Informasi kurir & tracking jika sudah dikirim

---

## 9. Sistem Notifikasi

### 9.1 Fitur Notifikasi

- **🔔 Bell Icon** di navigasi (hanya jika login)
- **Badge merah** — Jumlah notifikasi belum dibaca (max 9+)
- **Dropdown** — Klik bell untuk melihat daftar notifikasi
- **Auto-fetch** — Notifikasi di-refresh setiap 10 detik
- **Tandai terbaca** — Otomatis saat diklik
- **Link** — Setiap notifikasi bisa diklik menuju halaman terkait

### 9.2 Jenis Notifikasi

| Type | Icon | Warna | Contoh |
|------|------|-------|--------|
| **order** | 🛍️ | Biru | "Pesanan Masuk" |
| **payment** | 💳 | Hijau | "Pembayaran Berhasil" |
| **shipping** | 🚚 | Amber | "Pesanan Dikirim" |
| **review** | ⭐ | Abu | "Ulasan Baru" |
| **chat** | 💬 | Abu | "Pesan Baru" |
| **info** | 🔔 | Abu | Notifikasi umum |

### 9.3 Trigger Notifikasi

| Aksi | Penerima | Type |
|------|----------|------|
| Pembeli membuat pesanan | Petani (penjual) | order |
| Pembeli membuat pesanan | Pembeli (diri sendiri) | order |
| Petani mengirim pesanan | Pembeli | shipping |
| Pembeli konfirmasi diterima | Petani | shipping |
| Pembeli konfirmasi diterima | Pembeli | shipping |
| Pembeli memberi ulasan | Petani | review |
| Chat baru | Petani | chat |

---

## 10. Data & API

### 10.1 Struktur Database (JSON)

```
data/
├── users.json           # Data pengguna
├── produk.json          # Produk (dari sisi admin)
├── seller_products.json # Produk (dari petani)
├── orders.json          # Pesanan
├── chats.json           # Percakapan chat
├── notifications.json   # Notifikasi
├── reviews.json         # Ulasan produk
└── midtrans_transactions.json  # Transaksi Midtrans
```

### 10.2 API Endpoints

#### Auth
| Method | Endpoint | Fungsi |
|--------|----------|--------|
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/register` | Register user baru |

#### Produk
| Method | Endpoint | Fungsi |
|--------|----------|--------|
| GET | `/api/produk` | Get semua produk |
| GET | `/api/produk/seller` | Get produk seller |
| POST | `/api/produk/seller` | Tambah produk (FormData) |

#### Orders
| Method | Endpoint | Fungsi |
|--------|----------|--------|
| GET | `/api/orders?role=&userId=&nama=` | Get orders by filter |
| POST | `/api/orders` | Buat order baru |
| PATCH | `/api/orders` | Update status (ship/deliver) |

#### Chat
| Method | Endpoint | Fungsi |
|--------|----------|--------|
| GET | `/api/chat?userId=&conversationId=` | Get chat/conversations |
| POST | `/api/chat` | Kirim pesan/buat percakapan |

#### Notifications
| Method | Endpoint | Fungsi |
|--------|----------|--------|
| GET | `/api/notifications?userId=&role=&nama=` | Get notifikasi |
| POST | `/api/notifications` | Buat notifikasi baru |
| PATCH | `/api/notifications` | Tandai sudah dibaca |

#### Reviews
| Method | Endpoint | Fungsi |
|--------|----------|--------|
| GET | `/api/reviews?productId=` | Get ulasan produk |
| POST | `/api/reviews` | Kirim ulasan baru |

#### Midtrans (Simulasi)
| Method | Endpoint | Fungsi |
|--------|----------|--------|
| GET | `/api/midtrans?orderId=` | Get transaksi |
| POST | `/api/midtrans` | Generate Snap Token |
| PATCH | `/api/midtrans` | Update status pembayaran |

#### Admin
| Method | Endpoint | Fungsi |
|--------|----------|--------|
| GET | `/api/admin/users` | Get semua users (tanpa password) |

### 10.3 Status Code
- `200` — Berhasil
- `400` — Bad request (validasi error)
- `401` — Unauthorized (login gagal)
- `404` — Data tidak ditemukan

---

## 11. FAQ & Troubleshooting

### Q: Aplikasi tidak bisa dijalankan?
**A:** Pastikan Node.js versi 18+ terinstall. Jalankan `npm install` dulu sebelum `npm run dev`.

### Q: Data yang saya input hilang setelah server restart?
**A:** Ya, karena menggunakan file JSON sebagai database. Data akan persist di folder `data/` selama filenya ada. Ini adalah mode development.

### Q: Kenapa halaman tidak merefresh setelah aksi?
**A:** Beberapa halaman menggunakan polling atau reload manual. Coba refresh browser (F5) jika data tidak muncul.

### Q: Bagaimana cara upload gambar produk?
**A:** Di halaman Tambah Produk, klik area upload bergaris putus-putus. Pilih file gambar dari komputer (PNG, JPG, atau WEBP). Gambar akan otomatis terupload.

### Q: Fitur pembayaran Midtrans apakah real?
**A:** Saat ini masih simulasi. Tidak ada transaksi sungguhan. Untuk production, perlu integrasi dengan akun Midtrans asli.

### Q: Fitur Tarik Uang apakah real?
**A:** Masih simulasi. Tidak ada transfer sungguhan. Hanya mencatat pengajuan penarikan.

### Q: Keranjang belanja saya hilang?
**A:** Keranjang disimpan di localStorage browser. Jika clear cache atau ganti browser, keranjang akan kosong.

### Q: Chat tidak real-time?
**A:** Chat menggunakan polling setiap 5 detik. Bisa dianggap near real-time.

### Q: Bisa register sebagai apa saja?
**A:** Dua pilihan: **Pembeli** (belanja) atau **Petani** (jual produk).

### Q: Lupa password?
**A:** Saat ini belum ada fitur reset password. Hubungi admin untuk reset manual di database.

---

## 📞 Kontak & Dukungan

**MyTani Ku**  
Marketplace Pertanian Indonesia  
Tim MPPL IF-6 UNIKOM — 2026

---

*"Marketplace digital untuk petani Indonesia. Beli peralatan, hasil tani, dan benih langsung dari petani tanpa tengkulak."*

