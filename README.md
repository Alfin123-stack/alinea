# Alinea

Alinea adalah platform discovery buku — bukan toko buku. Tujuannya
membantu orang yang menemukan rekomendasi buku di media sosial (TikTok,
Instagram, dll) untuk mengenal lebih jauh buku tersebut: sinopsis, genre,
dan rating dari pembaca lain — sebelum memutuskan untuk membacanya.

Desain mengadaptasi style reference **Cosmos** (linen canvas, tipografi
serif (Newsreader), radius 16px konsisten, tanpa shadow, UI monokrom yang
membiarkan cover buku jadi satu-satunya warna).

## Tech stack

- **Next.js 16** (App Router, TypeScript)
- **Tailwind CSS v4**
- **Newsreader** (self-hosted via `@fontsource-variable/newsreader`)
- **Google Books API** — sumber data utama
- **Open Library API** — fallback otomatis saat Google Books gagal/kena kuota
- **Hardcover API** — opsional, untuk rating pembaca asli
- **next-themes**, **Framer Motion**, **lucide-react**

## Menjalankan secara lokal

```bash
npm install
npm run dev
```

Buka http://localhost:3000

### Environment variables

Fitur pencarian buku berjalan tanpa konfigurasi apa pun. Login/register
**butuh** dua variabel di bawah. Buat `.env.local`:

```
# Kuota Google Books lebih besar (default ~1.000 request/hari tanpa key)
GOOGLE_BOOKS_API_KEY=your_key_here

# Rating pembaca asli dari Hardcover — https://hardcover.app/account/api
# Tanpa ini, rating diambil dari Google Books seperti biasa.
HARDCOVER_API_TOKEN=your_token_here

# --- Wajib untuk login & register ---
# Connection string MongoDB (Atlas atau self-hosted)
DB_URL=mongodb+srv://...

# Secret untuk menandatangani session cookie. Generate dengan:
# node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
SESSION_SECRET=
```

## Fitur

### Tema terang & gelap
Toggle di navbar. Dark mode membalik polaritas token warna (`ink` jadi
terang, `paper`/`linen` jadi gelap) tanpa menambah warna baru, jadi
prinsip "cover buku = satu-satunya warna" tetap terjaga. Preferensi
disimpan, mengikuti setting OS secara default.

### Dua bahasa (ID / EN)
Toggle di navbar. Seluruh teks antarmuka diterjemahkan lewat
`lib/i18n/dictionaries.ts`; data buku (judul, sinopsis) tetap dalam
bahasa aslinya dari sumber data.

### Fallback sumber data
`searchBooksWithCount()` membedakan "Google Books gagal" (kuota habis,
429/403, network error) dari "Google Books tidak menemukan apa pun", dan
hanya jatuh ke Open Library pada kasus pertama. ID Open Library diberi
prefix `ol:` supaya tidak bentrok dengan ID Google.

### Command palette (⌘K / Ctrl+K)
Pencarian cepat dari halaman mana pun, dengan debounce dan navigasi
keyboard (panah atas/bawah, Enter). Didukung route `/api/search`.

### Mood tag & estimasi waktu baca
Tag nuansa ala StoryGraph (reflektif, menegangkan, ringan, dst)
diturunkan dari kategori buku, plus estimasi lama baca dari jumlah
halaman (~270 kata/halaman, 250 kata/menit).

### Login & register
Auth berbasis MongoDB, dengan session cookie yang ditandatangani sendiri
(JWT via `jose`) — bukan library auth pihak ketiga.

- **Password** di-hash dengan bcrypt (`bcryptjs`, 10 salt rounds), tidak
  pernah disimpan plaintext. Validasi (panjang, harus ada huruf & angka,
  format email) lewat `zod`, jalan di server sebagai source of truth.
- **Session** disimpan di cookie httpOnly + secure (production) + SameSite
  Lax, isi `{ userId, name, email }` bertanda tangan `SESSION_SECRET`.
  Centang "tetap masuk" memperpanjang masa berlaku dari 7 ke 30 hari.
- **Login gagal** selalu menampilkan pesan generik ("Email atau password
  salah") — sengaja tidak membedakan email tidak terdaftar vs password
  salah, supaya tidak bisa dipakai menebak akun mana yang terdaftar.
- `middleware.ts` melindungi `/account` (redirect ke `/login` kalau belum
  masuk) dan mengalihkan `/login`/`/register` ke `/account` kalau sudah
  masuk.
- Form pakai React 19 `useActionState` + Server Actions
  (`lib/actions/auth.ts`), bukan client-side fetch — validasi & error
  per-field tetap jalan tanpa JS di client kalau perlu.

Struktur: `lib/mongodb.ts` (koneksi singleton), `lib/models/user.ts`
(query user), `lib/session.ts` (sign/verify token, edge-safe — dipakai
`middleware.ts`), `lib/auth/session-store.ts` (baca/tulis cookie, Node-only),
`lib/validation/auth.ts` (schema zod), `lib/actions/auth.ts` (server
actions), `components/auth/` (form & layout `/login`, `/register`).

> Halaman auth saat ini berbahasa Indonesia saja dan belum ikut toggle
> ID/EN situs (teksnya belum masuk `lib/i18n/dictionaries.ts`).

## Struktur halaman

- `/` — Landing page (hero, sorotan, cara menjelajah, CTA)
- `/explore` — Jelajah buku + tab genre + koleksi kurasi + pencarian (`?q=`)
- `/book/[id]` — Detail buku (sinopsis, mood, rating, buku terkait)
- `/api/search` — endpoint internal untuk command palette

## Struktur folder

```
app/
  api/search/     -> endpoint pencarian untuk command palette
  explore/        -> halaman jelajah + loading skeleton
  book/[id]/      -> detail buku + loading skeleton
components/
  ui/             -> Button, StarRating, Chip, SearchInput, LogoMark,
                     ThemeToggle, LanguageToggle, CommandPalette,
                     Reveal (scroll animation), BookSkeleton
  i18n/           -> <T> (teks terjemahan untuk server component)
  layout/         -> NavPill, Footer
  landing/        -> Hero, Spotlight, TrendingStrip, FeatureGrid, TrustRow, CtaSection
  explore/        -> BookCard, CollectionCard, CollectionCarousel,
                     GenreTabs, MasonryGrid, EmptyState
  book/           -> BookHeader, Synopsis, RelatedBooks
lib/
  google-books.ts -> sumber utama + orkestrasi fallback
  open-library.ts -> adapter fallback (tanpa key, tanpa kuota)
  hardcover.ts    -> adapter rating pembaca (opsional)
  mood-tags.ts    -> mood tag & estimasi waktu baca
  collections.ts  -> daftar koleksi kurasi
  i18n/           -> dictionaries.ts (ID/EN) + context.tsx (useT)
  types.ts        -> tipe data Book & Collection
  utils.ts        -> helper (cn, stripHtml, formatYear)
```

## Catatan

Bagian "sumber rekomendasi" di landing page memakai wordmark teks, bukan
logo asli, untuk menghindari isu hak cipta.

## Pembaruan terbaru

- **Spotlight scroll-scale** — frame section "Sorotan" sekarang mulai kecil, blur, dan agak transparan, lalu membesar & jadi tajam seiring discroll (bukan animasi sekali jalan). Video ambient (`public/videos/book-reveal.mp4`) menggantikan fallback cover statis. Menghormati `prefers-reduced-motion`.
- **Section "Lagi ramai dibahas"** (`components/landing/trending-strip.tsx`) — strip buku dengan rating pembaca terbanyak (rating asli dari Hardcover kalau `HARDCOVER_API_TOKEN` di-set, fallback ke Google Books), bergeser horizontal mengikuti posisi scroll (bukan marquee otomatis seperti TrustRow, dan bukan draggable seperti CollectionCarousel).
- **Font berganti dari Fraunces ke Newsreader** — serif yang didesain untuk kenyamanan baca di layar, dipilih supaya tampilan Alinea tidak terasa seperti "template AI generik" (Fraunces & Instrument Serif jadi default umum di banyak alat AI-generated design).
- **Copy landing page diaudit** — beberapa kalimat yang sebelumnya memakai pola "bukan sekadar X — ini Y" atau terlalu abstrak/generic (`bento.sub`, `feature.title`) ditulis ulang jadi lebih spesifik ke fitur Alinea sendiri.

## Pembaruan desain (redesign premium)

- **Cover lebih tajam** — Google Books sekarang diminta zoom=3 (bukan zoom=1 bawaan), jadi cover tidak pecah lagi di grid/hero/spotlight.
- **Book card interaktif** — tilt 3D mengikuti kursor, efek kilau (shine sweep), shadow bertingkat saat hover.
- **Navbar** — badge `Ctrl K` di search box (klik untuk buka command palette), dropdown mega-menu untuk "Jelajah" & "Koleksi".
- **Tema 3-arah** — Terang / Gelap / Ikuti sistem, lewat dropdown kecil di navbar (`next-themes` `system` theme).
- **Trust row** — marquee dua baris berlawanan arah, pause on hover, tiap nama sumber highlight saat di-hover.
- **Spotlight** — video ambient looping (grayscale) menggantikan efek blur lama; fallback otomatis ke cover tajam kalau file video belum ditambahkan. Lihat `public/videos/README.md` untuk cara menambahkan videonya.
- **Hero** — cover melayang dengan parallax mengikuti kursor, cursor-glow halus, tombol CTA "magnetic".
- **Section baru**: stats bar (count-up), bento feature grid, FAQ accordion.
# alinea
