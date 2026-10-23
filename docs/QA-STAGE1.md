# QA fondasi portofolio — 22 Oktober 2026

Tahap pertama dapat dijalankan dan build produksi berhasil. Ini pemeriksaan fondasi, bukan persetujuan rilis seluruh PRD. Tidak ada deployment.

Laporan ini baseline fondasi/studi SVG. Engine 3D kemudian diimplementasikan; status dan bukti terbaru ada di [QA Signal study 3D](QA-SCENE3D.md).

## Pembaruan setelah iterasi Signal study

Laporan fondasi di bawah dipertahankan sebagai baseline. Kondisi terbaru:

- Ilustrasi orbit diganti kandidat medan sinyal: bola titik/gelombang dengan patch ASCII yang dibatasi clip SVG. Semua teks depan tetap bersih.
- Layout shared main kini memakai grid. Mobile menempatkan objek setelah intro sebelum pengalaman; footer berada setelah semua konten. Jarak antarbagian desktop dirapatkan.
- Hover hanya memberi preview sementara. Klik/Space/tap mengunci atau mematikan inspeksi; route berubah mereset state. Kedua kontrol disabled pada HTML tanpa JS. CSS menjalankan gerakan, React hanya mengelola event/state frekuensi rendah.
- Build produksi terbaru dan smoke browser yang diperluas **lulus**, tanpa page error. Tambahan pengujian: keyboard ASCII, visibilitas/clip patch, hover cleanup, tidak membatalkan pause, reset route, toggle touch dan urutan objek sebelum pengalaman di mobile.
- Empat route kembali diperiksa pada 320/390/768/1440 px tanpa overflow, reduced motion dan fallback tanpa JS/WebGL tetap lulus. Scan penanda draft contoh pada HTML/RSC/JS hasil build kembali tanpa temuan.
- Inspector: **3 FAIL, 1 WARN** (few-pictures, focal-point, still-page; warning no-footage). Empty-screens tidak lagi muncul. Source lint **0 FAIL, 0 WARN**. Audit desain keseluruhan belum lulus.
- Semua screenshot inspector terbaru dibuka dan ditinjau; ditambah mode inspeksi dan Projects mobile. Lokasi lokal: `.taste-skill/signal-study/`.
- Satu smoke run pada dev sempat terputus `ERR_ABORTED` saat refresh/kompilasi route. Verifikasi diulang pada build produksi dan lulus; bukan kegagalan yang disembunyikan.

```text
ROUND 2 — Signal study
Seen in one second: identitas Abdiel, latar Teknik Komputer, medan sinyal untuk diamati.
Idea (one sentence): pengamatan sistem digital diterjemahkan menjadi medan titik yang dapat dibaca sebagai ASCII.
Live thing: inspeksi patch ASCII dengan hover/keyboard/tap, terpisah dari pause gerak.
Layout words by section: intro=split / scene=specimen / experience=list / explore=links.
Scores: design 6.5 · usability 8 · creativity 7 · content 7 → overall 7.1, capped at 6.0.
Caps applied: inspector masih FAIL, belum ada foto/karya nyata; tidak mengarang aset untuk memenuhi meter.
Top three problems (most visible first), each with the screenshot it shows in and the fix:
1. mobile-page-01.jpg baseline: visual muncul setelah footer; kini dipindahkan sebelum pengalaman dan diuji urutannya.
2. desktop-page-01.jpg baseline: jarak antarseksi membuat layar terlalu kosong; jarak dikurangi dan empty-screens tidak muncul lagi.
3. tablet-fold.jpg terbaru: objek masih kecil dibanding kolom bacaan; evaluasi skala setelah arah objek ditinjau, jangan menaikkan gerak/foto hanya demi skor.
```

SignalField adalah ilustrasi kode orisinal. Tidak ada media pihak ketiga, klaim astronomi/riset, dependency baru, atau WebGL baru. Pilihan objek final, performa pada perangkat fisik serta engine 3D masih terbuka. Screenshot touch berasal dari emulasi Chromium, bukan uji ponsel fisik.

## Kondisi awal yang diverifikasi

Melanjutkan checkpoint pada commit `b24aab8` (`WebsitePortofolio - Base`); Git bersih sebelum pekerjaan dilanjutkan. Fondasi, data, empat halaman dan renderer Markdown/MDX sudah ada sehingga tidak dibuat ulang. Prototype dan bukti REA dipertahankan.

## Perubahan lanjutan

- Lebar SVG dibatasi di kolomnya; overflow tablet 6 px hilang.
- Pause membekukan karakter typing saat ini. Reduced motion yang sedang paused tetap menampilkan frasa lengkap.
- Explicit Play dapat mengaktifkan ilustrasi meski OS meminta reduced motion; perubahan OS berikutnya ke reduce kembali mem-pause. Default SSR/tanpa JavaScript tetap paused.
- Tombol gerak disabled sebelum hydration, sehingga mode tanpa JavaScript tidak menawarkan kontrol yang tidak dapat bekerja.
- Judul mobile sedikit diperbesar, CSS diformat, ikon observatorium lokal ditambahkan, dan marker smooth-scroll Next.js diterapkan.
- Browser smoke script disimpan di `tests/browser-smoke.js`; tes konten tidak lagi mensyaratkan koleksi selalu kosong ketika nanti ada konten published.

## Hasil aktual

| Pemeriksaan | Hasil |
| --- | --- |
| `npm run build` | Lulus: TypeScript, 3 tes konten, syntax check prototype, Webpack, prerender |
| Empat route utama pada production server | HTTP 200, H1 dan satu navigasi aktif sesuai route |
| Draft writing, slug tidak ada, route tidak ada, raw source/content/analysis | HTTP 404 |
| Lebar 1440, 768, 390, 320 px | Empat halaman tanpa horizontal overflow |
| Navigasi klik, skip link dan focus ring | Lulus pada browser Chromium lokal |
| Pause dengan keyboard | Teks dan orbit berhenti; preference bertahan lintas route/reload |
| Typing | Posisi paragraf berikutnya stabil pada pemeriksaan dokumen sebelum/sesudah animasi |
| Reduced motion | Perubahan preference langsung mem-pause, frasa statis lengkap, explicit Play bekerja |
| JavaScript disabled, viewport mobile | Empat halaman dapat dibaca dan link berfungsi; fallback SVG tidak membutuhkan WebGL/canvas |
| Browser smoke produksi | Lulus, `pageErrors: []`; request 404 dari skenario negatif memang diharapkan |
| Output publik | Penanda unik tiga draft contoh tidak ditemukan di HTML/RSC/TXT/JS/JSON pada `.next/server/app` dan `.next/static` |
| Prototype lama | HTTP terbuka, judul dan UI muncul, canvas utama 1440 × 900 terpasang; favicon lama 404, tanpa pengujian ulang seluruh simulasi |
| Design source lint | 0 FAIL, 0 WARN |

Audit output di atas hanya membuktikan draft contoh yang ada saat pengujian; bukan jaminan untuk aset draft baru yang ditempatkan di folder publik. Audit dependency 0 vulnerabilities berasal dari instalasi checkpoint sebelumnya, tidak dijalankan ulang pada kelanjutan ini.

## Review visual

Screenshot About desktop/tablet/mobile dan halaman penuh sudah dibuka dan ditinjau. Screenshot Projects, Writing, Cabinet pada 1440 dan 390 px juga ditinjau. Konten tetap terbaca, judul/navigasi tidak bertumpuk, dan empty state menyatakan kondisi sebenarnya.

Artefak lokal (diabaikan Git): `.taste-skill/resume/` dan `.taste-skill/collections/`. Inspector sesudah perbaikan: **4 FAIL, 1 WARN**, sehingga audit desain **belum lulus**. Overflow, perbedaan margin tablet dan warning judul kecil sudah tidak muncul. Temuan tersisa: few-pictures, focal-point, still-page, empty-screens; warning no-footage.

Scope pemilik mengutamakan fondasi, scene/fallback sederhana dan suasana editorial yang tenang. Karena belum ada materi foto/video milik pemilik, tidak ditambahkan foto generik atau banyak animasi hanya untuk memenuhi meter skill. Ilustrasi orbital SVG dan ikon merupakan gambar kode orisinal sementara, bukan foto atau klaim minat astronomi. Tidak ada media pihak ketiga atau kredit aset yang diperlukan. Ruang dan kekuatan komposisi tetap dapat diperbaiki bersama scene berikutnya.

```text
ROUND 1 (lanjutan checkpoint)
Seen in one second: nama, mahasiswa Teknik Komputer UI, navigasi empat halaman.
Idea (one sentence): Digital Observatory menjadi ruang tenang untuk membaca profil dan mengamati karya.
Live thing: typing dan orbit yang dapat di-pause bersama.
Layout words by section: hero=split / experience=list / explore=links / collections=honest empty state.
Scores: design 6 · usability 8 · creativity 6 · content 7 → overall 6.7, capped at 6.0.
Caps applied: inspector masih FAIL; belum ada foto dan konten karya nyata.
Top three problems (most visible first), each with the screenshot it shows in and the fix:
1. Tablet: SVG overflow pada screenshot lama; diperbaiki lewat ukuran 100% kolom, terverifikasi tidak overflow.
2. desktop-page-01.jpg: sisi visual kurang kuat setelah scroll; eksplorasi scene berikutnya perlu membawa komposisi lebih jauh tanpa menambah konten palsu.
3. mobile-page-01.jpg dan collection screenshots: ilustrasi baru muncul setelah konten/footer; evaluasi penempatan fallback saat iterasi scene, jaga scroll dan pembacaan.
```

## Cara mengulang pemeriksaan

Jangan menjalankan build bersamaan dengan dev server pada checkout yang sama. Hentikan dev, lalu:

```powershell
npm run build
npm start
```

Dengan `playwright-cli` sudah tersedia pada mesin penguji:

```powershell
playwright-cli open http://127.0.0.1:3000
playwright-cli run-code --filename=tests/browser-smoke.js
playwright-cli close
```

Smoke script bukan dependency aplikasi dan tidak dipanggil oleh `npm run check`. Script menggunakan konten/route fondasi saat ini; perbarui asersi bila kebijakan draft atau navigasi berubah. Browser berjalan dengan izin proses yang sesuai pada lingkungan Windows ini.

Belum diuji: zoom browser manual, pembaca layar nyata, perangkat mobile fisik, Safari/Firefox, Lighthouse/performance/CLS/FPS, artikel published end-to-end dan komponen MDX interaktif. Reset/hide-text/gesture/context loss menunggu engine 3D; tidak diklaim tersedia pada fallback saat ini. Case study, sitemap/canonical/OG, CV dan kontak masih memerlukan pekerjaan/materi nyata.
