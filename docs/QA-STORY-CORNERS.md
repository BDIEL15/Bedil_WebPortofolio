# QA About dan Experience — sudut lab tersendiri

24 Oktober 2026. Pemilik mengizinkan pengembangan kedua sudut setelah rekomendasi di chat, dengan kualitas grafis yang menyatu dengan lab. Lingkup ini menggantikan status anchor-only sebelumnya untuk About/Experience. Writing/Cabinet belum mendapat sudut sendiri.

## Hasil implementasi

- `/about`: meja baca fisik dengan notebook dua halaman, lampu kerja, buku, notebook tertutup dan pensil berujung. Identitas/intro/bio HTML menggunakan profile JSON yang sudah ada.
- `/experience`: board dokumentasi fisik dengan tiga lembar berklip dan grafis chip, kode serta komunitas yang dibuat dalam CanvasTexture lokal. HTML mengambil tiga peran/organisasi/tahun dari published experiences JSON. Tidak menambahkan periode asisten lab, kontribusi, sertifikat, logo, foto atau project. Grafis scene tidak memuat data draft/identitas peran yang dibakar ke poster.
- Empat sudut dalam satu ruang dan renderer. About/Experience berada pada X=-7,4/-13,4, memiliki kamera normal/portrait/overview sendiri. Direct URL mulai di sudut tujuan; navigation, history dan aktif nav mengikuti route. Ringkasan/anchor lama Home tetap tersedia untuk bookmark.
- Kamera biasa/restore 1,25 detik, perjalanan >14 unit 1,6 detik, overview 1,15 detik, power3.inOut. Hide Text tetap otomatis Explore, termasuk touch; Show Text/Escape memulihkan sudut, fokus dan posisi baca. Pause/reduced motion langsung ke tujuan.
- Props statis baru dibatch menurut material, geometri sementara dibersihkan setelah merge. Spotlight statis baru di-cache. About/Experience diam saat idle; robot hanya bergerak di Projects. Tidak ada React state per frame/dependency/layanan eksternal baru.
- Dua puluh empat WebP dari delapan pose × tiga resolusi: 1440×1000, 768×1024, 390×844; total 717.670 byte. Detail sumber/ukuran/reproduksi di ASSETS. Hanya poster relevan dipilih, bukan seluruh varian dimuat saat awal.

## Pemeriksaan aktual

| Pemeriksaan | Hasil |
| --- | --- |
| `npm run build` | TypeScript, 9 tes, syntax prototype, kompilasi/prerender lulus; `/about` dan `/experience` terbangun statis |
| Kamera/route unit | Empat pose baca berbeda; overview fit empat sudut pada 5 rasio; routing/poster baru dan fallback Writing memakai Home |
| Geometri | 347 mesh, 122.418 rendered triangle termasuk instances, 173 geometri bersama, 14 tekstur. Budget lama <350 mesh/<150.000 triangle tetap; story props berada di area kiri Home dan di atas floor. Robot, keyboard dan sampling motion lama tetap diperiksa |
| `story-corners-browser.js`, produksi | Matriks kamera baru berbeda, renderer sama, idle berhenti; overview/orbit/reset/Escape setiap sudut; history/direct URL, published roles/tahun jujur, portrait/reduced motion/scroll, static/poster/re-enable dan WebGL blocked lulus; page error kosong |
| `personal-lab-smoke.js`, produksi | Enam route 200/heading/active nav, identitas dan tiga peran nyata, reflow 320–1440, draft/404, keyboard/fokus, pause/typing/reduced, touch dan tanpa JS lulus; page error kosong |
| `lab-camera-browser.js`, produksi | 189 view matrix perantara Home → Projects, renderer sama; overview/retarget/history/drag/Escape, hidden tab tersimulasi, pause/reduced, scroll restore dan static/retry/no-WebGL lulus |
| `robot-motion-browser.js`, produksi | Piksel robot bergerak dengan kamera tetap dan membeku identik saat Pause; loop berhenti di Home/About/Experience, hidden/reduced/static. Portrait/scroll tetap berfungsi; page error kosong |
| `personal-lab-browser.js`, produksi | Orbit/reset/Escape, 1 canvas/no ASCII, hidden/inert/fokus, 20 route reuse, context loss/retry/static, WebGL blocked dan touch/reduced lulus. Reset keyboard/mouse identik pada run ini; page error kosong |
| `personal-lab-rendering.js`, produksi | Home idle 0 render tambahan dalam 1 detik, interaksi 2 render, settle/resize lulus |
| Source lint lokal | About/Experience/Navigation/CSS: 0 FAIL / 0 WARN |
| Capture | Delapan pose pada desktop/tablet/mobile dan 24 poster scene-only direkam dari produksi; hasil akhir dibuka untuk review |

Log/artifak lokal memakai prefix `story-` di `.taste-skill/lab-views/`. Matriks diukur dari uniform upload main framebuffer; frame count dari clear WebGL, bukan hanya status DOM. Statistik geometri dan render idle bukan bukti FPS/frame pacing atau perangkat fisik. Enam suite browser fungsional terpisah dari capture/inspector.

## Review visual

Notebook/lampu/buku memberi About bentuk yang berbeda dari elektronik Home; board berklip memberi Experience konteks yang sesuai daftar peran. Desktop mengisi kanan panel baca; portrait memakai hero scene lebih dahulu dan konten mengikuti document flow. Grafis paper diubah menjadi tekstur cetak tanpa tone mapping untuk menjaga keterbacaan; komposisi Experience disesuaikan agar tiga lembar terlihat pada portrait. Pencarian metadata 21st memberi kandidat Impact Experience dan editorial lists; tidak diperlukan hover-image/accordion atau kode komponen berbayar. Navigation, SplitText, token dan pola HTML proyek dipakai ulang.

Audit generik final: **About 4 FAIL / 2 WARN**, **Experience 4 FAIL / 3 WARN**. FAIL pada keduanya: aksen terracotta, satu scene/poster alih-alih banyak foto, panel kiri dianggap off-centre, dan hitungan motion DOM rendah. WARN tanpa footage serta gap portrait; Experience juga name-only-title. Warna hangat sesuai arahan pemilik; scene 3D mengisi sisi kanan panel desktop dan hero portrait; sudut baca sengaja diam saat idle. Tidak menambahkan karya/foto/efek yang tidak diperlukan untuk memenuhi meter. Audit belum sepenuhnya lulus, dipisahkan dari tes fungsional. Dua belas screenshot fold/full-page inspector final dibuka, ditambah render normal/overview desktop/mobile.

Critique internal: design 6,5 / usability 7,5 / creativity 7 / content 7; overall dibatasi 6 oleh temuan audit. Rubric ini bukan nilai atau penerimaan pemilik. Komposisi kedua sudut sudah dapat dibedakan, tetapi personalisasi benda, kelengkapan kontribusi dan kualitas model/material masih dapat dikurasi. Persetujuan konsep/arah sebelumnya bukan penerimaan otomatis atas render baru ini. Konten kontribusi rinci, kontak/CV dan karya masih menunggu materi pemilik.

Belum diverifikasi: perangkat mobile fisik, Safari/Firefox, screen reader/zoom lengkap, cold-load/CLS, frame pacing dan GPU/memory/thermal jangka panjang. Tidak ada database/admin/ManimGX, staging/commit atau deploy. Prototype/analysis/studi/model/lisensi lama dipertahankan.

## Menjalankan kembali

`npm run dev` untuk edit dan preview port 3000; `npm run prototype` untuk studi lama. Hentikan dev sebelum `npm run build`, lalu `npm start` untuk produksi. Urutan suite di README kini mencakup `tests/story-corners-browser.js`. Capture: `tests/capture-lab-views.js`, konversi `node scripts/prepare-lab-posters.mjs`. QA sebelumnya merupakan riwayat untuk jumlah sudut/poster lama.
