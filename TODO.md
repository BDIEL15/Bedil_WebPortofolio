# TODO — Digital Observatory

Status: **checkpoint jeda, 22 Oktober 2026**. Fondasi produksi sudah dibuat dan build berhasil; pemeriksaan UI belum selesai. Checkbox tercentang berarti hasilnya sudah tersedia; fitur yang hanya dibahas tetap belum selesai. Acuan kebutuhan: [PRD](docs/PRD-PORTOFOLIO.md).

## Checkpoint sebelum laptop dimatikan

### Selesai dan tersimpan

- Next.js 16.4.2 App Router, React 19.3.1, TypeScript, CSS responsif di root dengan `src/`; `prototype/`, `analysis/`, dan dokumen dipertahankan.
- Shell About, Projects, Writing, Cabinet; About memakai nama, pendidikan, dan tiga pengalaman nyata. Halaman koleksi memakai empty state tanpa karya/kontak rekaan.
- Profil dan pengalaman JSON, draft contoh projects/cabinet/writing, schema Zod dan content access layer server. Selector memfilter draft sebelum digunakan UI dan daftar slug artikel.
- Renderer Markdown/MDX lokal dan route `/writing/[slug]`, metadata dasar dan 404. Belum ada artikel published; belum ada detail project/case study.
- Ilustrasi orbital SVG/CSS sementara, typing/deleting dengan deskripsi pembaca layar, kontrol pause bersama, preference pause dan reduced-motion dasar. Belum ada engine 3D.
- `npm run build` **lulus** memakai Webpack: TypeScript, 3 tes konten, syntax check prototype, kompilasi dan prerender Next.js.
- Tes meliputi filter draft/not-found selector, slug duplikat, tanggal invalid/future, serta render Markdown dan MDX. Audit saat instalasi terakhir: **0 vulnerabilities** setelah mengganti gray-matter dengan yaml.
- Source design lint: **0 FAIL, 0 WARN**. Inspector browser sudah menghasilkan screenshot desktop 1440, tablet 768 dan mobile 390 di `.taste-skill/inspect/` (lokal, diabaikan Git).

### Belum selesai / hasil yang belum lulus

- Inspector visual **belum lulus: 5 FAIL, 3 WARN**. Masalah konkret: SVG menyebabkan horizontal overflow sekitar **6 px pada lebar 768 px**. Temuan lain: komposisi dinilai terlalu kosong, focal point tablet lemah, foto tidak ada, gerak hanya satu elemen; warning video tidak ada, margin tablet berbeda dan judul mobile kecil. Syarat foto/video/gerak skill perlu ditimbang terhadap scope scene sederhana dan gaya tenang; jangan menambah aset/klaim palsu demi skor.
- Screenshot belum dibuka untuk review visual manual. Jangan menyatakan desktop/mobile sudah lolos.
- Navigasi klik/deep link HTTP, fokus keyboard, pause/resume, perubahan reduced-motion, zoom, JavaScript disabled dan fallback tanpa WebGL **belum diuji di browser**. Selector draft sudah dites, tetapi audit seluruh output HTML/RSC/aset untuk kebocoran draft belum dilakukan.
- Belum memverifikasi `npm run prototype` lewat browser sesudah perubahan script.
- Turbopack gagal membuat junction Windows (`Access is denied`); dev/build sekarang memakai `--webpack`. Build sandbox sebelumnya gagal; build Webpack dengan izin proses yang sesuai berhasil.
- HTTP probe/Chrome dalam sandbox diblokir izin socket/proses; inspector berhasil dijalankan dengan izin yang sesuai. Ini batas lingkungan, bukan bukti UI lolos.
- Kurasi akhir frasa typing/bahasa, validasi schema project lengkap, contoh artikel interaktif, case study, sitemap/canonical/OG, performance dan scene 3D/ASCII masih terbuka. Tidak deploy.

### Langkah berikutnya saat dilanjutkan

1. Baca checkpoint ini; jangan ulang REA atau migrasi fondasi.
2. Jalankan proyek, buka screenshot yang ada dan perbaiki overflow tablet serta komposisi desktop/mobile.
3. Periksa empat route dan 404, keyboard, pause, reduced motion, tanpa JS/WebGL; audit output publik terhadap draft dan ulang build setelah perubahan.
4. Finalisasi dokumentasi/status tahap pertama setelah pemeriksaan tersebut. Scene kompleks tetap tahap berikutnya.

### Menjalankan kembali

```powershell
cd 'C:\Users\abdie\OneDrive\Documents\ChatGPT\Website Portofolio'
npm ci
npm run dev
```

`npm ci` hanya diperlukan jika dependency belum tersedia/berubah. Buka http://127.0.0.1:3000. Pemeriksaan: `npm run check`; build: `npm run build`; menjalankan hasil build: `npm start`; prototype lama: `npm run prototype` di http://127.0.0.1:4173. `npm start` sekarang berarti aplikasi Next.js, bukan prototype. Proses milik tugas dihentikan saat checkpoint; jalankan kembali setelah menyalakan laptop.

## Sudah tersedia

- [x] Analisis REA dan dokumentasi website referensi di `analysis/`.
- [x] Prototype lokal lensing; ini studi visual, bukan portofolio produksi.
- [x] PRD lengkap dan arah Digital Observatory dengan nuansa laboratorium digital.
- [x] Panduan kerja agent, roadmap ringkas dan petunjuk menjalankan prototype.

## Berikutnya — fondasi dan arah visual

- [x] Buat fondasi Next.js + React + TypeScript dan styling, dengan prototype/evidence tetap dapat dirujuk.
- [ ] Buat shell empat halaman: About, Projects, Writing, Cabinet; URL detail untuk karya/tulisan.
- [ ] Siapkan satu mockup About desktop/mobile: nama lengkap, intro stabil dan baris typing yang tidak menggeser layout.
- [ ] Kurasi frasa typing; gunakan `a/an` yang benar dan jangan mengklaim role yang belum disetujui.
- [ ] Tentukan scene perdana dan satu interaksi ASCII/pixel yang mewakili Digital Observatory; jangan membuat empat scene kompleks sekaligus.

## Konten dan fitur inti

- [x] Buat schema dasar, file contoh draft dan content access layer untuk profil, pengalaman, projects, writing dan cabinet. Schema case study/project lengkap masih berikutnya.
- [ ] Siapkan Markdown/MDX lokal; artikel biasa tetap ringan dan komponen interaktif dimuat hanya ketika diperlukan.
- [ ] Buat tampilan project dan case study teknis/kreatif dengan kontribusi individual yang jelas.
- [ ] Buat daftar/detail writing serta cabinet, termasuk empty state yang jujur.
- [ ] Tambahkan data nyata pemilik: uraian pengalaman, karya, media, kontak dan CV ketika tersedia.
- [ ] Pastikan draft tidak ikut route, payload atau output publik.

## Scene dan interaksi

- [ ] Integrasikan scene client-side setelah konten siap, dengan poster/static fallback.
- [ ] Tambahkan pause/play, reduced motion, reset view dan hide/show text dengan focus yang benar.
- [ ] Tambahkan typing/deleting dengan teks aksesibel yang stabil dan pause global.
- [ ] Uji efek ASCII/pixel terlokalisasi; pertahankan teks utama bersih.
- [ ] Uji gesture mobile, resize, context loss, route change cepat dan cleanup resource.

## Kualitas dan rilis

- [ ] Periksa navigasi/deep links, keyboard, mobile, zoom, reduced motion dan mode tanpa WebGL.
- [ ] Ukur bundle, loading, layout shift dan FPS pada perangkat uji; catat kondisi serta hasil nyata.
- [ ] Siapkan metadata, sitemap, 404, tautan kontak/CV dan aset yang boleh dipublikasikan.
- [ ] Siapkan preview, deployment, domain dan rollback; jalankan smoke test.
- [ ] Perbarui README dan checklist berdasarkan aplikasi produksi yang benar-benar dibuat.

## Opsional setelah fondasi

- Supabase untuk metadata/media/admin jika workflow membutuhkannya; tidak wajib untuk writing MDX.
- Variasi scene tambahan per halaman, artikel interaktif lanjutan, RSS dan analytics minimal.
- ManimGX untuk video penjelasan tertentu jika relevan; tidak diperlukan oleh latar interaktif.

Keputusan yang masih terbuka: objek scene pertama, frasa typing akhir, bahasa konten, kurasi karya/cabinet, kontak/CV, domain, serta apakah perlu dashboard. Detailnya ada di PRD §27. Keputusan tersebut dapat dikerjakan sambil menyiapkan fondasi yang tidak bergantung padanya.
