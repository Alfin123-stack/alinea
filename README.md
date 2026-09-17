<div align="center">

# 📖 Alinea

**Nemu rekomendasi buku di TikTok atau Instagram? Cek dulu sinopsis, genre, dan ratingnya di Alinea — sebelum memutuskan untuk membacanya.**

Dibangun dengan **Next.js 16 (App Router)**, design system **Cosmos** (linen canvas, serif, monokrom), sumber data **Google Books** dengan fallback **Open Library**, dan autentikasi asli di **MongoDB**.

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-native_driver-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

</div>

---

## Daftar Isi

- [Tentang](#-tentang)
- [Fitur](#-fitur)
- [Tumpukan Teknologi](#-tumpukan-teknologi)
- [Memulai](#-memulai)
- [Environment Variables](#-environment-variables)
- [Struktur Proyek](#-struktur-proyek)
- [Sumber Data Buku](#-sumber-data-buku-google-books--open-library--hardcover)
- [Autentikasi](#-autentikasi)
- [Design System](#-design-system)
- [Skrip NPM](#-skrip-npm)

---

## 📖 Tentang

Alinea **bukan toko buku**. Ide dasarnya: orang sering menemukan rekomendasi buku dari TikTok/Instagram, tapi tidak ada tempat cepat untuk mengecek "buku ini beneran cocok buat aku nggak?" sebelum beli atau pinjam. Alinea mengisi celah itu — cari judul, langsung lihat sinopsis, genre, mood tag, estimasi waktu baca, dan rating dari pembaca lain.

Desain mengadaptasi arah visual **Cosmos**: linen canvas, tipografi serif (**Newsreader**), radius 16px konsisten, tanpa shadow, dan UI yang sengaja dibuat monokrom — supaya cover buku jadi satu-satunya elemen berwarna di layar.

## ✨ Fitur

- 🔍 **Pencarian & jelajah buku** — tab genre, koleksi kurasi (mis. "Lagi Ramai", "Fiksi Ringan Akhir Pekan"), dan pencarian bebas lewat `?q=`
- 📚 **Detail buku lengkap** — sinopsis, penulis, penerbit, jumlah halaman, rating, dan daftar buku terkait
- 🏷️ **Mood tag ala StoryGraph** — tag nuansa (reflektif, menegangkan, ringan, dst) diturunkan otomatis dari kategori buku
- ⏱️ **Estimasi waktu baca** — dihitung dari jumlah halaman (~270 kata/halaman, 250 kata/menit)
- ⭐ **Rating pembaca asli** — lewat Hardcover API (opsional); tanpa itu, jatuh ke rating Google Books
- 🔄 **Fallback sumber data otomatis** — beralih ke Open Library saat Google Books gagal (kuota habis, 429/403, error jaringan) — bukan saat sekadar "tidak ketemu"
- ⌘ **Command palette** (Ctrl/⌘ + K) — pencarian cepat dari halaman mana pun, dengan debounce & navigasi keyboard
- 🌗 **Tema terang/gelap/ikuti sistem** — satu toggle, membalik polaritas token warna tanpa menambah warna baru
- 🌐 **Dua bahasa (ID/EN)** — toggle di navbar; data buku tetap dalam bahasa aslinya dari sumber
- 🔐 **Autentikasi asli** — registrasi & login dengan password ter-hash (bcrypt) dan sesi JWT di cookie httpOnly
- 📱 **Responsif** — dioptimalkan dari mobile sampai desktop

## 🛠 Tumpukan Teknologi

| Kategori | Teknologi |
|---|---|
| Framework | [Next.js 16](https://nextjs.org/) (App Router, TypeScript) |
| UI | [React 19](https://react.dev/), [Tailwind CSS v4](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/), [lucide-react](https://lucide.dev/) |
| Tipografi | [Newsreader](https://fonts.google.com/specimen/Newsreader) — self-hosted via `@fontsource-variable/newsreader` |
| Tema | [next-themes](https://github.com/pacocoursey/next-themes) (light/dark/system) |
| Sumber data buku | [Google Books API](https://developers.google.com/books) (utama), [Open Library API](https://openlibrary.org/developers/api) (fallback), [Hardcover API](https://hardcover.app/account/api) (rating, opsional) |
| Database | [MongoDB](https://www.mongodb.com/) via driver native (`mongodb`, bukan ORM) |
| Autentikasi | [bcryptjs](https://www.npmjs.com/package/bcryptjs), [jose](https://github.com/panva/jose) (JWT), cookie sesi httpOnly, validasi [zod](https://zod.dev/) |
| Lainnya | `clsx` + `tailwind-merge`, React 19 `useActionState` + Server Actions untuk form auth |

## 🚀 Memulai

### Prasyarat

- Node.js 18+
- Instance MongoDB (lokal atau [Atlas](https://www.mongodb.com/atlas)) — hanya dibutuhkan untuk login/register

### Instalasi

```bash
# 1. Clone repository
git clone <repo-url>
cd alinea-project

# 2. Install dependencies
npm install

# 3. Siapkan environment variables (opsional, kecuali untuk auth)
cp .env.example .env.local
# isi DB_URL & SESSION_SECRET kalau ingin login/register jalan — lihat tabel di bawah

# 4. Jalankan mode pengembangan
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000). Pencarian & jelajah buku langsung jalan tanpa konfigurasi apa pun — hanya `/login` dan `/register` yang butuh MongoDB.

### Build produksi

```bash
npm run build && npm start
```

## 🔑 Environment Variables

Semua variabel **opsional** kecuali dua yang ditandai wajib untuk auth. Buat `.env.local` dari `.env.example`:

| Variabel | Wajib? | Deskripsi |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Tidak | URL produksi, dipakai untuk `metadataBase`, canonical tag, sitemap, robots.txt & JSON-LD. Tanpa ini fallback ke `http://localhost:3000` |
| `GOOGLE_BOOKS_API_KEY` | Tidak | Menaikkan kuota Google Books dari ~1.000 request/hari. Ambil di [Google Cloud Console](https://console.cloud.google.com) → enable Books API |
| `HARDCOVER_API_TOKEN` | Tidak | Mengaktifkan rating pembaca asli dari [Hardcover](https://hardcover.app/account/api). Tanpa ini, rating tetap tampil dari Google Books |
| `DB_URL` | **Ya**, untuk auth | Connection string MongoDB (Atlas atau self-hosted) |
| `SESSION_SECRET` | **Ya**, untuk auth | Secret penanda tangan session cookie. Generate: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |

## 📁 Struktur Proyek

```
app/
  page.tsx                    → landing page (hero, spotlight, trending, FAQ, dst)
  explore/                    → jelajah buku + tab genre + koleksi kurasi + pencarian
  book/[id]/                  → detail buku + loading skeleton
  login/, register/, account/ → autentikasi & halaman akun
  api/
    search/route.ts             → endpoint internal untuk command palette
    session/route.ts            → baca sesi login aktif
  manifest.ts, robots.ts,
  sitemap.ts, opengraph-image.tsx → SEO & metadata

components/
  ui/       → Button, StarRating, Chip, SearchInput, LogoMark, ThemeToggle,
              LanguageToggle, CommandPalette, Reveal, Magnetic, BookSkeleton, dll
  landing/  → Hero, Spotlight, TrendingStrip, FeatureGrid, TrustRow,
              StatsBar, SqueezeCollections, Faq, CtaSection
  explore/  → BookCard, CollectionCard, CollectionCarousel, GenreTabs,
              MasonryGrid, EmptyState
  book/     → BookHeader, Synopsis, RelatedBooks
  auth/     → LoginForm, RegisterForm, AuthSplitShell, PasswordInput,
              GateBar, GateOverlay, LockedTeaser
  layout/   → NavPill, NavDropdown, MobileNav, UserMenu, Footer
  i18n/     → <T> — komponen teks terjemahan untuk server component

lib/
  google-books.ts   → sumber data utama + orkestrasi fallback ke Open Library
  open-library.ts   → adapter fallback (tanpa API key, tanpa kuota)
  hardcover.ts      → adapter rating pembaca asli (opsional)
  mood-tags.ts       → mood tag & estimasi waktu baca
  collections.ts    → daftar koleksi kurasi
  mongodb.ts        → koneksi MongoDB (native driver, dbName dipaksa "alinea")
  session.ts        → sign/verify session JWT — edge-safe, dipakai middleware.ts
  auth/session-store.ts → baca/tulis cookie sesi (Node-only)
  actions/auth.ts   → Server Actions untuk login/register
  validation/auth.ts → schema zod untuk form auth
  models/user.ts    → query user di MongoDB
  i18n/             → dictionaries.ts (ID/EN) + context.tsx (hook useT)
  site.ts           → satu sumber kebenaran untuk metadata SEO situs
  types.ts, utils.ts → tipe data Book/Collection & helper (cn, stripHtml, dst)

middleware.ts → proteksi /account, redirect /login ↔ /account sesuai status sesi
```

## 📚 Sumber Data Buku: Google Books → Open Library → Hardcover

`searchBooksWithCount()` di `lib/google-books.ts` membedakan dua kondisi:

- **Google Books gagal** (kuota habis, 429/403, error jaringan) → otomatis jatuh ke **Open Library**. ID Open Library diberi prefix `ol:` supaya tidak bentrok dengan ID Google.
- **Google Books berhasil tapi hasilnya kosong** → tetap dianggap hasil valid, tidak dialihkan ke Open Library.

Cover selalu diminta dengan parameter `zoom=3` (bukan `zoom=1` bawaan Google), supaya gambar tidak pecah di grid, hero, maupun spotlight.

Rating pembaca (`lib/hardcover.ts`) bersifat *progressive enhancement*: kalau `HARDCOVER_API_TOKEN` di-set, rating asli dari Hardcover dipakai dan diprioritaskan; kalau tidak, seluruh fitur rating tetap jalan seperti biasa memakai `averageRating` dari Google Books.

## 🔐 Autentikasi

Dibangun sendiri di atas MongoDB — **tanpa** library auth pihak ketiga (NextAuth, Clerk, dsb).

- **Password** di-hash dengan `bcryptjs` (10 salt rounds), tidak pernah disimpan plaintext. Validasi (panjang, wajib huruf & angka, format email) lewat `zod`, dijalankan di server sebagai source of truth.
- **Session** disimpan di cookie httpOnly + secure (production) + `SameSite=Lax`, isi `{ userId, name, email }`, ditandatangani `SESSION_SECRET` (JWT via `jose`). Centang "tetap masuk" memperpanjang masa berlaku dari 7 ke 30 hari.
- **Login gagal** selalu menampilkan pesan generik ("Email atau password salah") — sengaja tidak membedakan email tidak terdaftar vs password salah, untuk mencegah user enumeration.
- `middleware.ts` melindungi `/account` (redirect ke `/login` kalau belum masuk) dan mengalihkan `/login`/`/register` ke `/account` kalau sudah masuk. Hanya mengimpor `lib/session.ts` (edge-safe) — tidak pernah menyentuh `lib/mongodb.ts` atau `lib/auth/session-store.ts` yang Node-only.
- Form pakai React 19 `useActionState` + Server Actions (`lib/actions/auth.ts`), bukan client-side fetch, jadi validasi & pesan error per-field tetap konsisten di server.

> Halaman auth saat ini berbahasa Indonesia saja dan belum ikut toggle ID/EN situs (teksnya belum masuk `lib/i18n/dictionaries.ts`).

## 🎨 Design System

Arah desainnya mengadaptasi referensi **Cosmos**:

- **Warna**: monokrom murni — `ink` (teks/aksen) dan `paper`/`linen` (permukaan), dengan `stone`/`pebble` untuk teks sekunder. Cover buku sengaja dibiarkan jadi satu-satunya elemen berwarna di seluruh UI.
- **Dark mode** membalik polaritas token yang sama (`ink` jadi terang, `linen`/`paper` jadi gelap) lewat `next-themes` — tidak menambah palet warna baru, jadi prinsip di atas tetap terjaga di kedua tema.
- **Tipografi**: [Newsreader](https://fonts.google.com/specimen/Newsreader), serif yang didesain untuk kenyamanan baca di layar — dimuat lokal lewat `@fontsource-variable/newsreader`, bukan Google Fonts CDN.
- **Radius & spacing**: 16px konsisten di hampir seluruh komponen, tanpa shadow.
- **Token desain**: didefinisikan di `app/globals.css` sebagai CSS variable, dipetakan ke Tailwind v4 lewat `@theme`.

## 📜 Skrip NPM

| Perintah | Fungsi |
|---|---|
| `npm run dev` | Menjalankan mode pengembangan |
| `npm run build` | Build untuk produksi |
| `npm start` | Menjalankan hasil build produksi |
| `npm run lint` | Menjalankan ESLint |

---

<div align="center">

Dibuat dengan 🤍 memakai Next.js, MongoDB, dan Google Books API

</div>