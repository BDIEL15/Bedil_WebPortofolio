# Variasi Komposisi dan Keterbacaan Portofolio — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox syntax for tracking. Disetujui dan dieksekusi 4 November 2026; hasil di `analysis/qa/portfolio-composition/RESULTS.md`.

**Goal:** Mengurangi dominasi konten di kiri, membuat tiap halaman mempunyai komposisi sesuai fungsinya, dan meningkatkan keterbacaan tanpa kehilangan identitas lab personal.

**Architecture:** Gunakan route dan komponen yang ada. Ubah penempatan blok konten melalui selector route pada CSS, pisahkan posisi blok dari perataan paragraf, lalu selaraskan scrim dan batas baca ReadingFrame. Pertahankan satu scene/renderer dan perilaku navigasi yang ada; pembaruan copy dan optimasi aset menjadi tahap terpisah.

**Tech Stack:** Next.js App Router, React, TypeScript, CSS biasa, Three.js, konten JSON/MDX lokal; tanpa dependency baru yang direncanakan.

**Spec:** Keputusan percakapan 4 November 2026 tentang variasi posisi per halaman; `analysis/qa/review-2026-11-04/REVIEW.md`; aturan produk dalam `AGENTS.md`. Kontrak desain di bawah merangkum keputusan tersebut; ukuran yang ditandai usulan belum merupakan hasil visual yang disetujui.

## 1. Kontrak desain

| Halaman | Komposisi sasaran desktop | Perataan dan perilaku |
|---|---|---|
| Home | Intro di tengah sebagai pembuka | Judul/intro singkat boleh rata tengah; pertahankan scene, ikon sosial dan opening |
| About | Blok foto + biodata terpusat | Header foto/judul seimbang; paragraf tetap rata kiri |
| Projects | Konten kiri, robot di kanan | Pertahankan komposisi ini; beri judul/peran/hasil hirarki lebih kuat dalam detail |
| Experience | Kolom timeline di tengah | Judul boleh rata tengah; peran, organisasi, tanggal dan isi rata kiri |
| Writing index | Kolom daftar di tengah | Judul dan tanggal tetap sederhana sesuai pilihan pemilik; item daftar rata kiri |
| Writing artikel | Kolom baca di tengah | Isi rata kiri, latar lebih tenang; judul sticky mengikuti perilaku sekarang |
| Cabinet | Galeri lebih lebar dan terpusat | Heading tengah, caption rata kiri; 3 kolom desktop dan 2 mobile sebagai titik awal |

**Posisi tengah berarti pusat blok bacaan, bukan membuat seluruh paragraf rata tengah.** Pada ponsel semua blok memakai margin luar seimbang; paragraf panjang tetap rata kiri. Tidak perlu memaksa pola teks kiri/objek kanan di layar sempit.

Dasar visual: pengembangan lab yang ada, bukan penerapan ulang seluruh blueprint Dark Room atau Split Stage. Dua arah tersebut tetap referensi review; perubahan kali ini berfokus pada komposisi per halaman yang dibahas setelahnya.

Ukuran awal untuk diuji: gutter desktop 32px minimum, mobile 20px (16px pada lebar 320px bila diperlukan); kolom prosa maksimum 40rem, timeline 42rem, galeri Cabinet 60rem. Nilai ini usulan implementasi, disesuaikan sekali berdasarkan render nyata dan panjang baris. Target paragraf desktop sekitar 45–75 karakter per baris; body mobile minimal 16px.

## 2. Global Constraints

- Pertahankan latar gelap, teks hangat, Libertinus Sans/Serif, satu workbench, satu renderer, dan HTML terpisah dari scene.
- Tanpa panel di belakang main pada portrait. Perbaikan keterbacaan memakai scrim netral; saat Hide text/Explore, scrim baca tetap hilang seperti perilaku sekarang.
- Heading Projects, Experience, Writing dan Cabinet tetap di luar `.collection-scroll`; isi tetap native scroll. Jangan memindahkan heading ke dalam area scroll.
- Footer tetap mengikuti kontrak fixed saat ini sebagai pendekatan pertama; perbaiki batas baca, jangan memindahkan footer atau menghapus kontrol sebagai jalan pintas.
- Pertahankan opening sekali per sesi, pause/reduced motion/hidden/static, fokus, scroll, dialog, Back/Forward, preview, serta tautan dan route yang ada.
- Home tidak mendapatkan panel experience, CTA tambahan atau footer yang sebelumnya diminta dihapus.
- Jangan mengganti judul “Tugas Bidang”, menambahkan ringkasan pada index Writing, mengubah fakta kontribusi, atau menambah klaim/metrik tanpa keputusan copy tersendiri dari pemilik.
- Jangan mengubah kamera, geometri, urutan badge, atau poster sebagai efek samping perpindahan HTML. Bila komposisi terpusat menutup objek penting, tunjukkan benturan dan usulkan perubahan kamera secara terpisah.
- Checkout berisi perubahan lokal pemilik. Inventarisasi sebelum eksekusi; jangan revert, stage, commit, push, atau deploy perubahan lain.

## 3. Kebutuhan sebelum dan selama eksekusi

**Sudah tersedia:** foto potret, dokumentasi tiga proyek, logo/foto badge, artikel, sampul Cabinet, font, scene dan screenshot baseline. Tidak perlu foto stok atau model 3D baru untuk tahap komposisi.

**Diperlukan untuk mulai:** instruksi pemilik untuk mengeksekusi rencana ini; baseline dari checkout saat eksekusi; server lokal dan browser untuk review desktop/mobile. Tidak perlu menunggu tambahan materi untuk memperbaiki layout.

**Diperlukan hanya untuk tahap copy:** konfirmasi 2–3 kontribusi nyata yang layak ditonjolkan untuk role yang deskripsinya masih dominan menjelaskan organisasi; persetujuan wording pengganti. Jika belum tersedia, tahap layout/teknis tetap berjalan dan teks asli dipertahankan.

**Keputusan belum diambil:** apakah Writing index akan menampilkan ringkasan atau subjudul deskriptif; apakah ada ajakan kontak tambahan di akhir About/detail. Keduanya opsional dan bukan syarat layout selesai.

## 4. Review Focus

1. Viewport pendek/landscape: heading, isi dan kontrol tetap mempunyai ruang, tanpa teks terbaca di belakang footer.
2. Perpindahan route cepat, Back/Forward dan resize: blok terpusat dan batas baca dihitung ulang tanpa judul meloncat atau scroll lama tersisa.
3. Akhir konten dan fokus keyboard: paragraf/tautan terakhir dapat terlihat penuh di atas batas kontrol, bukan sekadar ada di DOM.
4. Static + Hide text, reduced motion dan noJS: petunjuk sesuai kemampuan, konten tetap terbaca, eksplorasi tetap dapat ditutup.
5. Konten pendek/panjang serta media tunggal/jamak: Writing sparse tetap proporsional, judul proyek tetap terlihat, galeri satu gambar tidak menawarkan panah mati.

## 5. Peta file dan tanggung jawab

| Area | File yang mungkin berubah saat eksekusi |
|---|---|
| Posisi route, lebar, scrim, token permukaan | `src/app/globals.css` |
| Batas baca terhadap header/footer/kontrol | `src/components/reading-frame.tsx` |
| Struktur About/Experience jika CSS saja tidak cukup | `src/app/about/page.tsx`, `src/app/experience/page.tsx` |
| Struktur daftar/galeri | `src/app/writing/page.tsx`, `src/app/cabinet/page.tsx` |
| Struktur artikel, hanya bila perlu | `src/app/writing/[slug]/page.tsx` |
| Hirarki detail dan galeri proyek | `src/components/sample-collection.tsx`, `src/components/project-gallery.tsx` |
| Instruksi mode statis | `src/components/scene/scene-host.tsx` |
| Derivative badge | `src/data/scene-photo-slots.json`, `public/photos/` |
| Copy setelah konfirmasi | `src/content/experiences.json`; konten Writing hanya bila disetujui |
| QA dan catatan keputusan | tes browser yang relevan, `docs/ASSETS.md`, `TODO.md`, `AGENTS.md` bila aturan terbaru perlu dicatat |

Jangan membangun sistem layout baru atau merombak struktur CSS seluruh proyek. Perbarui aturan route yang bertanggung jawab dan hilangkan hanya override yang menjadi konflik langsung.

## 6. Tahapan eksekusi

### Task 1 — Baseline dan bukti komposisi pertama

**Files:** baca selector route pada `globals.css`, `ReadingFrame`, konten published dan screenshot review. Perubahan pertama dibatasi pada CSS About, Experience dan Cabinet sebagai halaman representatif.

**Interfaces:** konsumsi `.observatory[data-page]`, `.story-page`, `.collection`, `.collection-heading`, `.collection-scroll` yang ada; tidak menambah public API.

- [x] Catat status checkout dan jalankan situs aktual tanpa `?preview=1`; capture keenam route dan satu artikel pada 1440×1000 dan 390×844.
- [x] Catat pusat geometris blok About/Experience/Cabinet, lebar baca, dan posisi objek utama sebelum perubahan.
- [x] Pusatkan About dan Experience, lebarkan/pusatkan Cabinet; paragraf/caption tetap rata kiri. Home dan Projects menjadi kontrol pembanding.
- [x] Tampilkan perbandingan sebelum/sesudah tiga halaman pada desktop/mobile. Nilai apakah konten menjadi fokus dan objek utama masih bermakna.
- [x] Selesaikan review visual representatif sebelum menyebarkan pola ke Writing dan artikel. Jika diperlukan perubahan kamera besar, ajukan sebagai keputusan terpisah.

**Done:** variasi antarhalaman nyata terlihat; pusat blok yang dimaksud berjarak maksimum 4px dari pusat viewport, margin simetris; Projects tetap berkomposisi kiri/kanan. Tidak ada perubahan fakta konten.

### Task 2 — Keterbacaan, Writing dan batas bawah

**Files:** `globals.css`, `reading-frame.tsx`; struktur artikel hanya bila perlu. **Tests:** perluas `tests/reading-frame-browser.js` dan `tests/collection-heading-browser.js` untuk konten published, bukan hanya preview.

**Interfaces:** pertahankan CSS properties `--reading-top`, `--reading-bottom`, `--reading-clip-top`, `--reading-clip-bottom`, `--collection-height`, serta perilaku `ReadingFrame(): ReactNode`. Tambahkan pengukuran kontrol hanya jika bounds membuktikan area footer belum mencukupi.

- [x] Rekam reproduksi visual tabrakan paragraf/footer dan tekstur scene pada About, Experience serta artikel; bedakan dari konten yang tidak dapat dijangkau.
- [x] Terapkan blok Writing/index dan artikel terpusat. Perkuat scrim baca secara spesifik route dan full reading region; bandingkan gerak aktif, pause, dan static.
- [x] Perbaiki batas bawah berdasarkan elemen fixed yang terlihat dan safe-area aktual; pertahankan heading statis dan native scroll koleksi.
- [x] Tambahkan assertion bahwa heading berada di bawah header, isi koleksi berakhir sebelum footer, fokus terakhir dapat digulir hingga terlihat utuh, dan tidak ada overflow horizontal.
- [x] Uji 320×568, 390×844, 768×1024, 1440×1000, dan 844×390; resize saat scroll dan buka/tutup dialog. Verifikasi akhir artikel/About secara visual, bukan hanya bounding box wrapper.

**Done:** tidak ada teks terbaca di belakang footer/kontrol; semua konten dapat dijangkau; pusat dan panjang baris nyaman. Teks normal ditargetkan kontras 4,5:1 pada hasil compositing latar baca; verifikasi titik terang scene dan dokumentasikan jika alat tidak dapat mengukurnya dengan andal. Jangan mengklaim WCAG menyeluruh.

### Task 3 — Hirarki detail proyek

**Files:** `sample-collection.tsx`, `project-gallery.tsx`, CSS terkait. **Tests:** perluas suite browser koleksi yang sudah ada untuk proyek published.

**Interfaces:** pertahankan `CollectionItem` dan `ProjectGallery` props; gallery tetap melayani Writing dan proyek, tanpa menambah field konten wajib.

- [x] Capture detail ArduiMania satu gambar dan Bank Vault dua gambar pada mobile.
- [x] Tempatkan judul dan intro yang sudah tersedia sebelum media, kurangi kategori berulang, pertahankan toolbar Close sticky.
- [x] Untuk satu gambar, hilangkan kontrol Previous/Next yang tidak berguna; caption dan tautan full-size tetap tersedia. Untuk beberapa gambar, counter/panah/keyboard tetap berfungsi.
- [x] Uji Enter → dialog → Escape → fokus kembali ke kartu; next/previous dan zoom/full-size; preview PDF/feed Writing yang memakai gallery bersama.

**Done:** nama proyek dan konteks pribadi dapat ditemukan sebelum galeri panjang; tidak ada regresi Writing atau dialog.

### Task 4 — Kejelasan copy, setelah materi disetujui

**Files:** `src/content/experiences.json`, presentasi Experience jika diperlukan. Perubahan Writing hanya dari keputusan eksplisit tersendiri.

- [x] Susun kandidat ringkasan organisasi dan kontribusi berdasarkan fakta yang ada; tandai bagian yang membutuhkan konfirmasi, tanpa membuat tugas/metrik baru.
- [x] Tampilkan copy usulan kepada pemilik, lalu terapkan hanya wording yang disetujui. Bila belum ada konfirmasi, tandai tahap ini menunggu konten tanpa menahan penyelesaian layout.
- [x] Periksa urutan role, tanggal, logo, employment type, dan badge agar tidak ikut berubah.
- [x] Jalankan `npm run content:check` dan tinjau Experience desktop/mobile dengan panjang teks sebenarnya.

**Done:** kontribusi dapat dipindai lebih cepat dan semua klaim tetap dapat dipertanggungjawabkan; atau tahap dicatat terbuka karena menunggu fakta.

### Task 5 — Perbaikan teknis kecil dan aset

**Files:** `scene-host.tsx`, `scene-photo-slots.json`, derivative baru di `public/photos/`, `docs/ASSETS.md`; token dialog pada CSS jika area terkait diedit.

- [x] Reproduksi static + Hide text: petunjuk drag/arrow tidak boleh muncul ketika `interactive` false. Sesuaikan accessible label menurut kemampuan nyata; verifikasi Show text/Escape dan Explore 3D tidak berubah.
- [x] Buat derivative tiga foto badge dari original memakai tooling gambar lokal yang tersedia. Titik awal maksimum sisi panjang 512px; target total ≤350 KB, dengan crop/kualitas wajah dicek dari POV Experience dan Explore.
- [x] Jika target ukuran gagal tanpa kerusakan visual, laporkan ukuran dan usulkan kompromi; jangan mengklaim target tercapai. Jangan mengubah foto asli atau ID slot.
- [x] Arahkan config ke derivative, dokumentasikan sumber/ukuran, lalu periksa loading, fallback dan badge pada static/3D. Render poster baru hanya bila hasil visual berubah nyata dan memang diperlukan.
- [x] Gunakan satu token permukaan dialog bila menyentuh warna berulang tersebut; tidak perlu audit semua warna scene.

**Done:** petunjuk static akurat, unduhan badge turun dengan bukti ukuran, dan identitas foto/urutan tetap benar.

### Task 6 — Verifikasi akhir dan handoff

- [x] Jalankan `npm run check`. Jika ada kegagalan lingkungan seperti `os.userInfo ENOMEM` yang pernah tercatat, laporkan sebab serta pemeriksaan pengganti; jangan menyatakan suite penuh lulus.
- [x] Dengan server lokal, jalankan suite `collection-heading-browser.js`, `reading-frame-browser.js`, `navigation-browser.js`, `ui-preview-browser.js` dan `home-scene-controls-browser.js` yang relevan melalui `playwright-cli run-code --filename=tests/<nama-file>`. Tambahkan `home-arrival-browser.js` bila CSS Home ikut berubah.
- [x] Verifikasi pause, reduced motion, static, Hide/Show, keyboard, Back/Forward dan resize. Periksa runtime reduced motion dengan browser yang mendukung emulasi; source review saja bukan bukti runtime. Dengan JavaScript dinonaktifkan, pastikan identitas, navigasi, ringkasan published dan poster tetap terbaca; detail dialog boleh mempertahankan keterbatasan noJS yang dijelaskan saat ini.
- [x] Stop dev sebelum `npm run build` pada checkout ini; verifikasi build, lalu smoke route utama pada server produksi lokal. Tidak ada deploy otomatis.
- [x] Capture dan buka screenshot akhir di semua ukuran penting; jalankan Impeccable audit dan taste inspection. Kelompokkan temuan alat yang benar-benar masalah dengan pengecualian brief (pill, warm palette, canvas motion), tanpa mengejar skor melalui penghapusan identitas.
- [x] Simpan hasil sebelum/sesudah, tes, keterbatasan dan sisa kebutuhan konten di `analysis/qa/portfolio-composition/`; perbarui TODO/ASSETS/aturan desain hanya sesuai hasil yang benar-benar tercapai.

**Stop condition:** komposisi per halaman sesuai kontrak, area baca dan kontrol tidak bertabrakan, perilaku lama tetap bekerja, hasil verifikasi terdokumentasi, dan bagian yang menunggu copy dinyatakan jelas. Penambahan efek, scene baru, CMS, migrasi framework, commit/push/deploy tidak menjadi syarat selesai.

## 7. Urutan keputusan untuk pemilik

1. Review rencana ini, khususnya komposisi halaman dan batas perubahan copy.
2. Saat siap, instruksikan mulai eksekusi Task 1–3 dan 5–6; Task 4 mengikuti konfirmasi materi.
3. Pada bukti visual pertama, nilai About/Experience/Cabinet berdampingan dengan Projects sebelum pola diperluas.

Rekomendasi pengerjaan: langsung pada sesi eksekusi dengan perubahan per tahap; tugas saling terkait lewat CSS dan ReadingFrame sehingga pemecahan implementasi paralel tidak diperlukan. Eksekusi selesai 4 November 2026; bukti dan keputusan pelaksanaan: `analysis/qa/portfolio-composition/RESULTS.md`.
