# Panduan kerja repository

## Konteks dan sumber acuan

Portofolio personal **Abdiel Deandra EL Dzaky**, mahasiswa Teknik Komputer Universitas Indonesia. Arah visual: **Digital Observatory** dengan nuansa laboratorium digital, mempertahankan suasana tenang dan editorial Clarissa Builds.

**Status kerja terbaru — 23 Oktober 2026:** pemilik menghentikan sementara implementasi untuk brainstorming ulang di chat baru agar konsep lebih menyatu dengan kepribadiannya. Digital Observatory, Robotics study dan preferensi visual di bawah adalah baseline sebelumnya, bukan konsep final yang wajib dikembangkan. Belum ada konsep pengganti yang dipilih; jangan menganggap semua preferensi lama dibatalkan. Pertahankan kode/aset/dokumen, jangan mulai polish, scene atau fitur baru sampai pemilik meminta melanjutkan dengan keputusan brainstorming. Mulai chat lanjutan dari checkpoint teratas TODO; fakta identitas dan aturan kejujuran konten tetap berlaku.

- Kebutuhan produk, arsitektur target, dan UI/UX: [PRD](docs/PRD-PORTOFOLIO.md). Baca bagian yang terkait tugas, bukan seluruh dokumen pada setiap perubahan.
- Urutan pekerjaan dan status: [TODO.md](TODO.md).
- Cara menjalankan serta status kode saat ini: [README.md](README.md).
- Bukti website referensi: `analysis/`; gunakan ketika suatu keputusan membutuhkan hasil REA, bukan sebagai source aplikasi produksi.

Instruksi terbaru dari pemilik menjadi acuan saat keputusan produk berubah. Perbarui bagian dokumen yang terpengaruh agar keputusan tidak saling bertentangan.

## Status kode

`prototype/` tetap studi vanilla JavaScript + Three.js dengan hash navigation dan copy contoh. Aplikasi Next.js App Router + React + TypeScript + CSS berada di root dengan `src/`. Empat halaman dan content layer lokal tersedia. Kandidat desain ulang Robotics study mengganti bola Signal study: scene memenuhi viewport, model GLB lokal berlisensi, poster responsif dan konten editorial di depan. Engine aktif `src/lib/scene/create-workshop-scene.ts` diimpor dinamis; shell mempertahankan satu renderer/kamera antarroute. Build dan smoke produksi lulus termasuk lifecycle/fallback/motion; penerimaan visual pemilik dan QA perangkat/performa lengkap belum tuntas. Baca TODO, `docs/QA-WORKSHOP.md` dan `docs/ASSETS.md` sebelum melanjutkan. Signal study tersimpan sebagai riwayat, bukan scene aktif. Jangan melaporkan seluruh fitur PRD selesai hanya karena tercantum di dokumen.

Target produksi: Next.js + React + TypeScript, Tailwind/CSS, Three.js, serta konten JSON dan Markdown/MDX tepercaya. Supabase masih opsional; ManimGX bukan dependency inti. Terapkan perubahan sesuai tugas aktif; persiapan dokumentasi tidak memerlukan migrasi aplikasi.

## Aturan produk dan visual

- Pertahankan latar gelap, teks hangat yang terbaca, navigasi sederhana, dan konten HTML di depan scene.
- Clarissa Builds tetap acuan komposisi/suasana. React Bits dan 21st.dev menjadi sumber kandidat animasi/komponen pendukung; seleksi sesuai PRD §7.5. Transisi harus terasa menyatu, menjaga scroll/input alami, serta mengikuti pause/reduced motion. Jangan mengganti arah visual dengan gaya default katalog.
- Scene utama bergerak halus; efek ASCII/pixel terlokalisasi saat eksplorasi. Jangan mengubah seluruh antarmuka menjadi terminal atau membuat akses karya bergantung pada scene.
- Headline yang diminta: `hey, i'm Abdiel Deandra EL Dzaky`. Baris minat dapat berganti dengan typing/deleting; daftar frasa akhir masih dikurasi.
- Konten serta navigasi harus tetap berfungsi tanpa WebGL. Sediakan pause, reduced motion, input keyboard dan pengalaman mobile yang tidak mengganggu scroll.
- Jangan mengarang karya, periode jabatan, kontribusi, prestasi, metrik hasil, kontak, atau tautan. Materi belum siap tetap draft.

## Implementasi dan pemeriksaan

- Gunakan solusi paling kecil yang memenuhi tugas. Tambahkan dependency hanya bila kebutuhan yang nyata tidak tertangani kode/platform yang sudah tersedia.
- Pisahkan konten, UI dan engine scene. Hindari React state update per frame. Bersihkan RAF, listener, observer, geometry/material/texture sesuai ownership-nya.
- Konten draft tidak boleh ikut HTML, payload, sitemap, search index atau aset publik. MDX hanya dikompilasi dari sumber milik pemilik yang tepercaya.
- Jika Supabase ditambahkan, terapkan kebijakan akses dan simpan secret key di server. Jangan menganggap menyembunyikan tombol sebagai otorisasi.
- Ikuti pola repository. Jalankan pemeriksaan yang relevan; perubahan UI diperiksa di browser termasuk mobile, focus, pause dan fallback. Jangan mengklaim tes yang tidak dijalankan.
- Update TODO ketika status benar-benar berubah. Dalam laporan hasil, bedakan implementasi, verifikasi, dan hal yang masih terbuka.

## Pemilihan model dan kualitas

- Prioritaskan hasil yang terverifikasi sambil menjaga penggunaan limit. Saat memasuki milestone berat atau menemukan masalah yang benar-benar ambigu, nilai apakah reasoning/model lebih kuat kemungkinan memberi manfaat.
- Bila layak ditingkatkan, beri rekomendasi singkat di chat: masalah atau bukti yang mendasari, pilihan model/effort, dan manfaat yang diharapkan. Jangan menjanjikan model tertentu pasti berhasil atau otomatis menganggap semua pekerjaan shader memerlukan model termahal.
- Default kerja awal: GPT-6.1 Sol Medium; pertimbangkan Sol High untuk masalah kompleks dan Astra hanya bila beralasan. Untuk edit terarah yang sederhana, Luna dapat cukup. Pilihan mengikuti model yang tersedia bagi pemilik.
- Rekomendasi ini adalah pesan agent, bukan fitur notifikasi/switch otomatis. Pemilik mengubah model melalui kontrol aplikasi. Lanjutkan pekerjaan independen yang masih dapat diselesaikan; jangan menjadikan upgrade sebagai hambatan buatan.
- Kualitas akhir diperiksa melalui build, tes yang relevan, review visual/browser, aksesibilitas dan performa; nama model saja tidak menjadi bukti hasil maksimal.

## Perintah yang tersedia saat ini

```sh
npm install
npm run dev
npm run prototype
npm run build
npm start
npm run check
```

`npm run check` menjalankan TypeScript, tes konten/matematika scene dan syntax check prototype. `npm run build` menjalankan check lalu build Next.js. `npm start` menjalankan hasil build produksi; prototype memakai `npm run prototype`. Dev/build memakai Webpack karena izin junction Turbopack gagal di lingkungan Windows ini. Hentikan dev sebelum build pada checkout yang sama. Smoke umum, lifecycle dan probe rendering terpisah di `tests/` (cara menjalankan di laporan QA); pemeriksaan lanjutan mengikuti TODO.

## Alur kerja ringkas

Pahami tugas dan bagian PRD yang relevan → kerjakan lingkup tersebut → periksa hasil → perbarui TODO/dokumen bila keputusan atau status berubah → jelaskan hasil dan batas verifikasinya.
