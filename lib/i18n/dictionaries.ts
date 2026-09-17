/**
 * UI string dictionary. Only interface chrome is translated here — book data
 * (titles, synopses) always stays in whatever language Google Books returns it.
 */

export const locales = ["id", "en"] as const;
export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
  id: "Indonesia",
  en: "English",
};

export const dictionaries = {
  id: {
    // Nav
    "nav.explore": "Jelajah",
    "nav.collections": "Koleksi",
    "nav.how": "Cara kerja",
    "nav.signin": "Masuk",
    "nav.cta": "Mulai jelajah",
    "nav.theme": "Ganti tema",
    "nav.themeLight": "Terang",
    "nav.themeDark": "Gelap",
    "nav.themeSystem": "Ikuti sistem",
    "nav.language": "Ganti bahasa",
    "nav.exploreByGenre": "Jelajah per genre",
    "nav.curatedForYou": "Koleksi kurasi",
    "nav.menu": "Buka menu",
    "nav.closeMenu": "Tutup menu",

    // Search
    "search.label": "Cari judul, penulis, atau genre buku",
    "search.p1": "Coba 'Atomic Habits'",
    "search.p2": "Coba 'novel fantasi remaja'",
    "search.p3": "Coba 'buku self-improvement'",
    "search.p4": "Coba 'Laut Bercerita'",
    "search.p5": "Coba 'komik detektif'",

    // Command palette
    "cmd.open": "Cari cepat",
    "cmd.placeholder": "Cari buku, penulis, atau genre…",
    "cmd.hint": "untuk buka",
    "cmd.empty": "Ketik untuk mulai mencari",
    "cmd.noresults": "Tidak ada hasil",
    "cmd.searching": "Mencari…",
    "cmd.seeAll": "Lihat semua hasil untuk",
    "cmd.close": "Tutup",

    // Hero
    "hero.eyebrow": "Alinea",
    "hero.title1": "Kenali ceritanya,",
    "hero.title2": "sebelum kamu membacanya.",
    "hero.sub":
      "Lihat rekomendasi buku di media sosial? Cari sinopsis, genre, dan rating dari pembaca lain di sini dulu.",
    "hero.cta1": "Mulai jelajah",
    "hero.cta2": "Lihat koleksi",
    "hero.spotlightLink": "Lihat sorotan minggu ini",

    // Spotlight
    "spotlight.title": "Sorotan",
    "spotlight.subtitle": "minggu ini",
    "spotlight.featuring": "menampilkan",
    "spotlight.author": "penulis",
    "spotlight.headline": "Ribuan judul menanti, satu tempat buat mutusin baca yang mana.",

    // Trending strip
    "trending.title": "Lagi ramai dibahas",
    "trending.sub": "Buku dengan rating terbanyak dari pembaca minggu ini.",

    // Feature grid
    "feature.title": "Tiga cara cari buku — genre, mood, atau rating.",
    "feature.sub": "Pilih yang paling cocok sama yang kamu cari.",
    "feature.byGenre": "Berdasarkan genre",
    "feature.byMood": "Berdasarkan mood baca",
    "feature.byRating": "Rating tertinggi pembaca",

    // Stats bar
    "stats.books": "buku diindeks",
    "stats.sources": "sumber data",
    "stats.genres": "genre",
    "stats.languages": "bahasa antarmuka",

    // Bento feature grid
    "bento.title": "Koleksi yang kami kurasi, bukan algoritma.",
    "bento.sub": "Beberapa kumpulan buku yang kami susun manual, buat kamu yang nggak tahu mau mulai dari mana.",
    "bento.action": "Lihat koleksi",
    "bento.cmd.title": "Command palette",
    "bento.cmd.desc": "Tekan Ctrl K dari halaman mana pun untuk mencari cepat, lengkap dengan navigasi keyboard.",
    "bento.mood.title": "Mood tag",
    "bento.mood.desc": "Nuansa baca ala StoryGraph — diturunkan otomatis dari kategori buku.",
    "bento.lang.title": "Dua bahasa",
    "bento.lang.desc": "Seluruh antarmuka bisa dibaca dalam Indonesia atau Inggris, kapan saja.",
    "bento.fallback.title": "Sumber data ganda",
    "bento.fallback.desc": "Google Books utama, Open Library otomatis jadi cadangan saat kuota habis.",

    // Trust row
    "trust.title": "Cocok buat kamu yang lihat rekomendasi buku dari",

    // FAQ
    "faq.title": "Pertanyaan yang sering ditanyakan",
    "faq.q1": "Apakah Alinea toko buku?",
    "faq.a1":
      "Bukan. Alinea murni platform discovery — tempat mengenal sinopsis, genre, dan rating sebelum kamu memutuskan membaca atau membelinya di tempat lain.",
    "faq.q2": "Dari mana data buku dan ratingnya berasal?",
    "faq.a2":
      "Data utama dari Google Books API, dengan Open Library sebagai cadangan otomatis. Rating pembaca asli bisa memakai Hardcover jika API key-nya diaktifkan.",
    "faq.q3": "Apakah saya perlu akun untuk menjelajah?",
    "faq.a3":
      "Sebagian. Pencarian, jelajah genre, dan koleksi kurasi bisa dilihat tanpa akun — tapi daftar buku lengkap dan sinopsis penuh baru terbuka setelah masuk.",
    "faq.q4": "Apakah Alinea gratis?",
    "faq.a4": "Ya, sepenuhnya gratis untuk digunakan siapa saja.",

    // CTA
    "cta.eyebrow": "Mulai dari yang kamu penasaran",
    "cta.title": "Cari tahu bukunya, baru putuskan bacanya.",
    "cta.button": "Jelajahi sekarang",

    // Footer
    "footer.explore": "Jelajahi",
    "footer.allBooks": "Semua buku",
    "footer.collections": "Koleksi kurasi",
    "footer.about": "Tentang",
    "footer.how": "Cara kerja",
    "footer.sources": "Sumber data",
    "footer.data": "Data",
    "footer.follow": "Ikuti",
    "footer.disclaimer":
      "Alinea adalah proyek independen dan tidak berafiliasi dengan penerbit atau toko buku mana pun. Data judul, sinopsis, dan rating disediakan oleh Google Books.",

    // Explore
    "explore.title": "Jelajahi buku",
    "explore.sub": "Cari judul yang lagi dibicarakan, atau telusuri lewat genre.",
    "explore.all": "Semua",
    "explore.collections": "Koleksi kurasi",
    "explore.everything": "Jelajahi semua",
    "explore.resultsFor": "Hasil pencarian",
    "explore.found": "buku ditemukan",
    "explore.prev": "Koleksi sebelumnya",
    "explore.next": "Koleksi berikutnya",
    "explore.books": "buku",

    // Empty state
    "empty.withQuery": "Tidak ada buku untuk",
    "empty.noQuery": "Belum ada hasil",
    "empty.hint":
      "Coba kata kunci lain — judul, nama penulis, atau genre seperti “fantasy” atau “self-help”.",

    // Book detail
    "book.by": "oleh",
    "book.pages": "halaman",
    "book.preview": "Lihat pratinjau",
    "book.synopsis": "Sinopsis",
    "book.noSynopsis": "Sinopsis untuk buku ini belum tersedia dari sumber data.",
    "book.relatedIn": "Buku {category} lainnya",
    "book.relatedGeneric": "Mungkin kamu suka",
    "book.readingTime": "baca",
    "book.hours": "jam",
    "book.minutes": "menit",

    // Ratings
    "rating.none": "Belum ada rating",
    "rating.count": "rating",
    "rating.source.hardcover": "dari pembaca Hardcover",

    // Moods
    "mood.reflective": "reflektif",
    "mood.light": "ringan",
    "mood.dark": "gelap",
    "mood.tense": "menegangkan",
    "mood.informative": "informatif",
    "mood.emotional": "emosional",
    "mood.adventurous": "penuh petualangan",
    "mood.inspiring": "menyemangati",
    "mood.fastPaced": "cepat dibaca",
    "mood.slowPaced": "perlu waktu",

    // Collections
    "col.trending": "Lagi rame di media sosial",
    "col.trendingSub": "Cek yang baru kami tambahkan",
    "col.weekend": "Fiksi ringan akhir pekan",
    "col.healing": "Buat yang lagi healing",
    "col.classic": "Klasik yang wajib dicoba",
    "col.curator": "Kurasi @alinea",

    // 404
    "404.eyebrow": "404",
    "404.title": "Halaman ini belum ditulis.",
    "404.sub":
      "Buku atau halaman yang kamu cari tidak ada, atau linknya sudah berubah.",
    "404.cta": "Kembali menjelajah",
    "404.bookTitle": "Buku tidak ditemukan — Alinea",

    // Loading
    "loading.books": "Memuat buku…",
  },

  en: {
    "nav.explore": "Explore",
    "nav.collections": "Collections",
    "nav.how": "How it works",
    "nav.signin": "Sign in",
    "nav.cta": "Start exploring",
    "nav.theme": "Toggle theme",
    "nav.themeLight": "Light",
    "nav.themeDark": "Dark",
    "nav.themeSystem": "Match system",
    "nav.language": "Change language",
    "nav.exploreByGenre": "Explore by genre",
    "nav.curatedForYou": "Curated collections",
    "nav.menu": "Open menu",
    "nav.closeMenu": "Close menu",

    "search.label": "Search by title, author, or genre",
    "search.p1": "Try 'Atomic Habits'",
    "search.p2": "Try 'young adult fantasy'",
    "search.p3": "Try 'self-improvement books'",
    "search.p4": "Try 'Laut Bercerita'",
    "search.p5": "Try 'detective comics'",

    "cmd.open": "Quick search",
    "cmd.placeholder": "Search books, authors, or genres…",
    "cmd.hint": "to open",
    "cmd.empty": "Start typing to search",
    "cmd.noresults": "No results",
    "cmd.searching": "Searching…",
    "cmd.seeAll": "See all results for",
    "cmd.close": "Close",

    "hero.eyebrow": "Alinea",
    "hero.title1": "Know the story,",
    "hero.title2": "before you read it.",
    "hero.sub":
      "Saw a book recommendation on social media? Look up its synopsis, genre, and reader ratings here first.",
    "hero.cta1": "Start exploring",
    "hero.cta2": "Browse collections",
    "hero.spotlightLink": "See this week's spotlight",

    "spotlight.title": "Spotlight",
    "spotlight.subtitle": "this week",
    "spotlight.featuring": "featuring",
    "spotlight.author": "author",
    "spotlight.headline": "Thousands of titles waiting — one place to decide what to read next.",

    "trending.title": "Trending now",
    "trending.sub": "The books getting the most reader ratings this week.",

    "feature.title": "Three ways to find a book — genre, mood, or rating.",
    "feature.sub": "Pick whichever fits what you're after.",
    "feature.byGenre": "By genre",
    "feature.byMood": "By reading mood",
    "feature.byRating": "Highest reader ratings",

    "stats.books": "books indexed",
    "stats.sources": "data sources",
    "stats.genres": "genres",
    "stats.languages": "interface languages",

    "bento.title": "Collections we curate, not an algorithm.",
    "bento.sub": "A few book sets we put together by hand, for whenever you don't know where to start.",
    "bento.action": "See collection",
    "bento.cmd.title": "Command palette",
    "bento.cmd.desc": "Press Ctrl K from any page for instant search, with full keyboard navigation.",
    "bento.mood.title": "Mood tags",
    "bento.mood.desc": "StoryGraph-style reading vibes, derived automatically from a book's categories.",
    "bento.lang.title": "Two languages",
    "bento.lang.desc": "The whole interface reads in Indonesian or English, switch anytime.",
    "bento.fallback.title": "Dual data source",
    "bento.fallback.desc": "Google Books first, with Open Library stepping in automatically when quota runs out.",

    "trust.title": "For anyone who finds book recommendations on",

    "faq.title": "Frequently asked questions",
    "faq.q1": "Is Alinea a bookstore?",
    "faq.a1":
      "No. Alinea is purely a discovery platform — a place to check synopsis, genre, and ratings before you decide to read or buy a book elsewhere.",
    "faq.q2": "Where does the book and rating data come from?",
    "faq.a2":
      "Primarily the Google Books API, with Open Library as an automatic fallback. Real reader ratings can use Hardcover if that API key is enabled.",
    "faq.q3": "Do I need an account to browse?",
    "faq.a3": "Partly. Search, genre browsing, and curated collections are visible without an account — but the full book list and full synopses unlock once you sign in.",
    "faq.q4": "Is Alinea free?",
    "faq.a4": "Yes, completely free for anyone to use.",

    "cta.eyebrow": "Start with whatever caught your eye",
    "cta.title": "Look the book up, then decide to read it.",
    "cta.button": "Explore now",

    "footer.explore": "Explore",
    "footer.allBooks": "All books",
    "footer.collections": "Curated collections",
    "footer.about": "About",
    "footer.how": "How it works",
    "footer.sources": "Data sources",
    "footer.data": "Data",
    "footer.follow": "Follow",
    "footer.disclaimer":
      "Alinea is an independent project and is not affiliated with any publisher or bookstore. Title, synopsis, and rating data is provided by Google Books.",

    "explore.title": "Explore books",
    "explore.sub": "Look up a title people are talking about, or browse by genre.",
    "explore.all": "All",
    "explore.collections": "Curated collections",
    "explore.everything": "Explore everything",
    "explore.resultsFor": "Search results",
    "explore.found": "books found",
    "explore.prev": "Previous collections",
    "explore.next": "Next collections",
    "explore.books": "books",

    "empty.withQuery": "No books found for",
    "empty.noQuery": "Nothing here yet",
    "empty.hint":
      "Try another keyword — a title, an author name, or a genre like “fantasy” or “self-help”.",

    "book.by": "by",
    "book.pages": "pages",
    "book.preview": "See preview",
    "book.synopsis": "Synopsis",
    "book.noSynopsis": "No synopsis is available for this book from the data source.",
    "book.relatedIn": "More {category} books",
    "book.relatedGeneric": "You might also like",
    "book.readingTime": "read",
    "book.hours": "h",
    "book.minutes": "min",

    "rating.none": "No rating yet",
    "rating.count": "ratings",
    "rating.source.hardcover": "from Hardcover readers",

    "mood.reflective": "reflective",
    "mood.light": "light",
    "mood.dark": "dark",
    "mood.tense": "tense",
    "mood.informative": "informative",
    "mood.emotional": "emotional",
    "mood.adventurous": "adventurous",
    "mood.inspiring": "inspiring",
    "mood.fastPaced": "fast-paced",
    "mood.slowPaced": "slow-paced",

    "col.trending": "Trending on social media",
    "col.trendingSub": "See what we just added",
    "col.weekend": "Light fiction for the weekend",
    "col.healing": "For when you need a reset",
    "col.classic": "Classics worth trying",
    "col.curator": "Curated by @alinea",

    "404.eyebrow": "404",
    "404.title": "This page hasn't been written.",
    "404.sub":
      "The book or page you're looking for doesn't exist, or its link has changed.",
    "404.cta": "Back to exploring",
    "404.bookTitle": "Book not found — Alinea",

    "loading.books": "Loading books…",
  },
} as const;

export type TranslationKey = keyof (typeof dictionaries)["id"];
