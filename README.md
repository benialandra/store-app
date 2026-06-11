<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" />
  <img src="https://img.shields.io/badge/Tailwind-v4-38bdf8?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Supabase-Database-3ecf8e?style=for-the-badge&logo=supabase&logoColor=white" />
  <img src="https://img.shields.io/badge/Midtrans-Payment-003d7a?style=for-the-badge" />
  <img src="https://img.shields.io/badge/TypeScript-Strict-3178c6?style=for-the-badge&logo=typescript&logoColor=white" />
</p>

# 🛒 DevStore

> **Premium digital marketplace** untuk menjual source code, template, dan script. Dibangun dengan arsitektur modern, sistem pembayaran terintegrasi, dan keamanan berlapis.

---

## ✨ Fitur Utama

| Fitur | Deskripsi |
|-------|-----------|
| 🏪 **Marketplace** | Grid produk responsif dengan pagination, pencarian, dan filter kategori |
| 💳 **Pembayaran Otomatis** | Integrasi Midtrans Snap (QRIS, VA, GoPay, e-wallet) |
| 🔐 **Download 1x Pakai** | Token unik dengan masa berlaku 24 jam, sekali klik langsung hangus |
| 📧 **Email Transaksional** | Template HTML premium dikirim otomatis via Nodemailer setelah bayar |
| 📦 **Lacak Pesanan** | Sistem kode akses rahasia (`DS-XXXXXX`) untuk cek status & download |
| 🛠️ **Admin Panel** | Dashboard statistik + CRUD produk dengan validasi Zod |
| 🎨 **Dark/Light Mode** | Otomatis mengikuti preferensi sistem operasi |
| 🛡️ **Anti-Inspect** | Blokir klik kanan, DevTools shortcut, dan console log |
| 📄 **SEO Dinamis** | Open Graph, meta tags, dan metadata per halaman produk |
| ⚡ **Performa** | Turbopack dev server, Tailwind v4 engine, React 19 |

---

## 🏗️ Tech Stack

```
Frontend     → Next.js 16 (App Router) + React 19 + Tailwind CSS v4
Database     → Supabase (PostgreSQL + Row Level Security)
Payment      → Midtrans Snap API
Email        → Nodemailer + Gmail App Password
Validation   → Zod (server-side input sanitization)
Icons        → Lucide React
Language     → TypeScript (strict mode)
```

---

## 📁 Struktur Project

```
src/
├── app/
│   ├── page.tsx                    # Homepage + Product Grid
│   ├── layout.tsx                  # Root Layout + Midtrans Script
│   ├── loading.tsx                 # Global loading skeleton
│   ├── not-found.tsx               # Custom 404 page
│   ├── global-error.tsx            # Error boundary
│   ├── admin/page.tsx              # Admin Dashboard + CRUD
│   ├── track/page.tsx              # Lacak Pesanan (by Access Code)
│   ├── history/page.tsx            # My Library (Magic Link)
│   ├── product/[slug]/page.tsx     # Detail Produk (SSR + SEO)
│   └── api/
│       ├── products/route.ts       # GET  → Fetch produk publik
│       ├── checkout/route.ts       # POST → Create order + Midtrans token
│       ├── download/route.ts       # GET  → Validasi token → redirect GDrive
│       ├── track/route.ts          # POST → Lookup order by access code
│       ├── admin/products/route.ts # CRUD → Kelola produk (service role)
│       └── webhook/midtrans/route.ts # POST → Callback dari Midtrans
├── components/
│   ├── Navbar.tsx                  # Navigasi utama
│   ├── Footer.tsx                  # Footer
│   ├── CheckoutModal.tsx           # Multi-step checkout flow
│   ├── ProductDetailClient.tsx     # Client component detail produk
│   └── SecurityGuard.tsx           # Anti-inspect & console blocker
└── lib/
    ├── supabase.ts                 # Supabase client (anon + service role)
    ├── midtrans.ts                 # Midtrans Snap + Core API
    ├── mailer.ts                   # Nodemailer transporter
    ├── emailTemplate.ts            # HTML email template generator
    ├── products.ts                 # Data access layer + fallback
    ├── types.ts                    # TypeScript interfaces
    ├── validations.ts              # Zod schemas
    └── utils.ts                    # Order code generator
```

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/your-username/store-app.git
cd store-app
npm install
```

### 2. Setup Environment

```bash
cp .env.example .env
```

Isi file `.env` dengan kredensial Anda:

| Variable | Sumber |
|----------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | [Supabase Dashboard](https://supabase.com) → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API → anon public |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API → service_role (⚠️ rahasia!) |
| `NEXT_PUBLIC_MIDTRANS_CLIENT_KEY` | [Midtrans Dashboard](https://dashboard.midtrans.com) → Settings |
| `MIDTRANS_SERVER_KEY` | Midtrans → Settings → Server Key |
| `EMAIL_USER` | Alamat Gmail Anda |
| `EMAIL_PASS` | [Gmail App Password](https://myaccount.google.com/apppasswords) |

### 3. Setup Database

Buka **Supabase SQL Editor**, lalu jalankan SQL schema dari file dokumentasi project.

### 4. Run

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) 🎉

---

## 💰 Alur Pembayaran

```
Pembeli klik "Purchase"
    ↓
Isi email → Klik "Proceed to Payment"
    ↓
Server membuat order (status: pending) + request Midtrans Snap Token
    ↓
Pop-up Midtrans muncul → Pembeli bayar (QRIS / VA / e-wallet)
    ↓
Midtrans mengirim webhook ke /api/webhook/midtrans
    ↓
Server verifikasi signature SHA-512
    ↓
Update order → success │ Generate download token (24 jam, 1x pakai)
    ↓
Kirim email HTML berisi link download + kode akses
    ↓
Pembeli klik link → Server validasi token → Redirect ke Google Drive
    ↓
Token ditandai "is_used = true" (tidak bisa dipakai lagi)
```

---

## 🔒 Keamanan

| Layer | Proteksi |
|-------|----------|
| **API Input** | Semua input divalidasi dengan Zod sebelum diproses |
| **Webhook** | Signature verification SHA-512 dari Midtrans |
| **Database** | Row Level Security (RLS) aktif di semua tabel |
| **Download** | Token 1x pakai + kedaluwarsa 24 jam |
| **Harga** | Server memverifikasi harga dari database, bukan dari client |
| **Admin** | Service Role Key hanya digunakan di server-side |
| **Frontend** | Right-click, F12, Ctrl+Shift+I, View Source diblokir |

---

## 🛠️ Admin Panel

Akses di `/admin` dengan password yang dikonfigurasi di `.env`:

```
NEXT_PUBLIC_ADMIN_PASSWORD=your_secure_password
```

Fitur admin:
- 📊 Dashboard statistik (total produk, penjualan, views, revenue)
- ➕ Tambah produk baru dengan auto-generate slug
- ✏️ Edit produk yang sudah ada
- 🗑️ Hapus produk
- 👁️ Lihat semua produk (termasuk yang belum dipublikasi)

---

## 📜 License

MIT © DevStore

---

<p align="center">
  <sub>Built with ☕ and ambition.</sub>
</p>
