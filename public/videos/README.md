# Video sorotan (Spotlight)

`components/landing/spotlight.tsx` memakai `public/videos/book-reveal.mp4`
sebagai video ambient di section "Sorotan" pada landing page. File ini
loop-nya cuma ~4 detik — masih dalam batas wajar untuk ambient loop, tapi
kalau nanti terasa "muter cepat" di ukuran penuh, gampang diganti kapan saja
(tinggal timpa file ini, nama & path-nya tidak perlu diubah).

Kalau file tidak ada / gagal dimuat, komponen otomatis fallback ke cover
buku (tajam, tanpa blur) — jadi build tetap aman tanpa video ini.

## Efek scroll

Section ini sekarang punya efek "scroll-scale reveal": frame section mulai
kecil, blur, dan agak transparan, lalu membesar ke ukuran penuh & jadi
tajam seiring discroll — bukan animasi sekali jalan. Efek ini otomatis
dilewati (frame langsung tampil ukuran penuh) kalau perangkat pengguna
mengaktifkan `prefers-reduced-motion`.

## Mengganti video

1. Siapkan video royalty-free (gratis, tanpa atribusi wajib) bertema
   membaca/membalik halaman buku, resolusi HD (1280x720) atau SD saja —
   section ini sudah diberi `grayscale` + overlay gelap lewat CSS, jadi
   resolusi 4K hanya memperbesar ukuran file tanpa menambah kualitas visual
   yang terlihat.
2. Timpa `book-reveal.mp4` di folder ini dengan file barunya (nama file
   tetap sama supaya tidak perlu ubah kode).
3. Jalankan ulang `npm run dev`.

## Alternatif

Kalau tidak mau pakai video, cukup hapus file ini: fallback gambar cover
tajam di `spotlight.tsx` sudah didesain untuk jadi pengganti yang layak
tanpa video sama sekali.
