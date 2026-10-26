# QA proof workbench kompak — Home dan Projects

24 Oktober 2026. Checkout awal bersih pada commit pemilik `fb27fc0` (Prototype 2), setelah pemilik menyatakan sudah push. Arahan terbaru: hilangkan meja yang berulang, satu workbench, satu objek hero per halaman, dan POV yang disengaja seperti pendekatan ruang Hamza; suasana hangat/editorial Clarissa dipertahankan. Tidak memakai aset/source referensi atau mengulang REA.

## Penyempurnaan Home dan isi meja — 24 Oktober 2026

Pemilik mulai menyukai versi kompak, lalu meminta lebih banyak benda dan Home lebih seimbang. Kamera Home kini tepat x=0, desktop sedikit dimundurkan; keyboard/mat berada di sumbu intro, keyboard lurus. Monitor/robot tetap menjadi bobot kiri/kanan, bukan geometri cermin. Mouse dengan pad/wheel, circuit study berpin/jumper, cup obeng, tray komponen bersekat serta dua case di rak ditambahkan memakai geometri/material asli. Semua tetap pada satu meja. Tidak menambah klaim karya, dependency, route atau animasi idle Home.

- Build produksi dan 9 tes lulus. Percobaan sandbox pertama gagal EPERM membuat folder output .next; pengulangan dengan izin runtime berhasil, tanpa menghapus repository/output secara rekursif.
- Builder sekarang **193 mesh / 60.780 rendered triangle / 124 geometri / 8 tekstur**. Budget <350 mesh/<150.000 triangle tetap. Unit tambahan memeriksa empat kelompok benda kecil tetap didukung dalam batas tabletop. Tes 129 pose robot dan framing tetap lulus.
- Empat suite produksi diulang: smoke (enam route/reflow320–1440/fokus/pause/reduced/no-JS), kamera (215 matrix/transisi/shared overview/orbit/reset/history/fallback/scroll), motion robot (piksel/pause/route/hidden/reduced/static/portrait), render probe (idleDelta 0, interactionDelta 2). Semua lulus, page error kosong. Lifecycle/context loss dan story-corners tidak diulang pada revisi props ini; hasil sebelumnya di bagian baseline.
- Delapan state UI × desktop/tablet/mobile direkam kembali; 15 poster aktif diperbarui, total **473.618 byte**. Home desktop/tablet/mobile, Projects desktop dan overview desktop dilihat, juga enam screenshot inspector Home final.
- Audit Home tetap **4 FAIL / 3 WARN**: palet hangat, satu gambar/scene, hitungan motion DOM, area dianggap kosong; tanpa footage, gap dan judul nama. Brief pemilik tetap lebih kuat daripada aturan generik foto/motion, tetapi audit tidak diklaim lulus. CLI 21st tidak ada di PATH; pencarian metadata via connector berhasil, hero blur/profile/letter-storm tidak sesuai scene yang dipilih. UI Navigation/SplitText/SceneHost tetap digunakan, tanpa retrieval/generation atau review source eksternal.
- Preview dev dipulihkan setelah QA. Log/capture revisi: .taste-skill/lab-views/detail-*. Tidak stage/commit/push/deploy.

### Kritik visual final (internal, bukan nilai pemilik)

ROUND 2
Seen in one second: meja elektronik hangat, intro terpusat dengan keyboard di bawahnya.
Idea (one sentence): workbench elektronik menjadi bingkai perjalanan mahasiswa Teknik Komputer.
Live thing: Explore/Hide Text dan perpindahan kamera; robot bergerak hanya pada Projects.
Layout words by section: hero=frontal scene dengan HTML terpusat / about=reading panel saat scroll.
Scores: design 6.5 · usability 7.5 · creativity 7 · content 7 → overall 6.0 setelah cap audit.
Caps applied: audit generik belum nol, sedikit gambar raster; nilai bukan penerimaan visual.
Top three problems and changes:
1. Pusat keyboard tidak segaris intro (capture sebelum revisi): keyboard/mat dipusatkan dan yaw diluruskan.
2. Home terasa bergeser (desktop sebelum revisi): kamera/target dipusatkan x=0, sedikit dimundurkan.
3. Rak dan tabletop kosong (desktop/overview sebelum revisi): kelompok alat/komponen/case ditambahkan di tepi; bidang intro tetap kosong secara sengaja.
Remaining: cup/tray hanya terlihat sebagian pada framing Home tertentu; seluruhnya ada di Explore. Portrait mengutamakan intro/keyboard, robot difokuskan di Projects. Kepadatan dan rasa keseimbangan perlu respons pemilik. Belum QA ponsel fisik/Safari/Firefox/GPU/memory/thermal; jumlah mesh bukan bukti performa perangkat.

## Baseline konsolidasi sebelum penyempurnaan isi meja

## Implementasi aktual

- Satu mesh meja `main-workbench`, satu keyboard, satu monitor dan satu lampu. Robot/fixture berada di kanan, notebook di kiri, dokumen di pegboard yang sama. Meja, platform, dinding, shelf, instrumen, storage dan keyboard/lampu/monitor tambahan dihapus dari builder aktif. Ini perubahan geometri, bukan menyembunyikan empat meja lewat kamera.
- Home memakai POV duduk dengan intro/typing pada pegboard. Projects close/medium pada robot; monitor/keyboard menjadi konteks. Panel baca kotak desktop dilepas dan memakai scrim netral; portrait tetap alur baca/scroll biasa. Intro Home portrait digeser ke bawah shelf dan robot diberi ruang frame sendiri pada Projects.
- About/Experience tetap route nyata dengan data/HTML yang sama, diarahkan ke notebook/kartu bersama. Ini kompatibilitas setelah konsolidasi, bukan klaim seluruh POV story telah disetujui. Writing/Cabinet tetap kamera Home sementara. Konten draft, periode/kontribusi/kontak yang belum diberikan tidak ditambahkan.
- Semua route Hide Text menuju overview workbench yang sama, langsung orbit/arrow/reset. Show Text/Escape memulihkan sudut route/fokus/posisi baca. Direct URL/history tetap bekerja. Transisi route/restore 1,25 detik dan overview 1,15 detik; pause/reduced motion langsung ke tujuan.
- Robot tetap memakai siklus observasi 16 detik, render cap sekitar 30Hz pada Projects. Home/About/Experience, tab hidden, pause/reduced dan static menghentikan loop. Robot kini berada dalam key shadow meja; satu map itu diperbarui saat bergerak agar shadow pose lama tidak tertinggal. Fill robot tidak membuat shadow map kedua.
- Lima pose unik × tiga ukuran = 15 poster aktif, total 457.564 byte. Sembilan overview per-route lama yang tidak dipakai dihapus; versi historis ada di Git. Capture merekam delapan state UI untuk regresi tetapi converter hanya membuat lima pose unik. Poster tidak memuat HTML/scrim/controls, memakai robot rest pose deterministik.

## Hasil pemeriksaan

| Pemeriksaan | Hasil |
| --- | --- |
| `npm run build` | TypeScript, 9 tes, syntax prototype, kompilasi dan prerender lulus |
| Geometri | 141 mesh, 53.288 rendered triangle termasuk instances, 101 geometri bersama, 8 tekstur. Baseline empat meja 347 mesh / 122.418 triangle. Budget lama <350 / <150.000 tidak dilonggarkan |
| Kontrak compact unit | Tepat satu meja dan satu keyboard; semua geometri berada di bounds workbench. Notebook/dokumen ada di sisi kiri meja/pegboard, robot didukung pada sisi kanan. Empat POV baca berbeda dan satu overview sama di 5 rasio |
| Framing motion unit | 129 pose robot diperiksa dengan batas proyeksi konservatif bounding box di 320×844, 390×844, 768×1024 dan 1440×1000; robot tidak keluar frame. FOV portrait diperlebar khusus aspek sempit setelah tes menangkap clipping. Tool tetap tegak dan clear dari fixture |
| `personal-lab-smoke.js`, produksi | Enam route/heading/active nav, identitas/3 peran nyata, draft/404, reflow 320–1440, pause/typing/reduced, keyboard/fokus, touch dan tanpa JS lulus; page error kosong |
| `lab-camera-browser.js`, produksi | 219 view matrix perantara Home → Projects, renderer sama. Shared overview, immediate drag, reset, Escape global, retarget/history, hidden tab tersimulasi, pause/reduced, scroll restore dan fallback/re-enable lulus |
| `story-corners-browser.js`, produksi | About/Experience berbeda dari Home, satu renderer; idle berhenti, shared overview/orbit/reset/Escape, history/direct, data peran/tahun, portrait/scroll, static/no-WebGL/re-enable lulus; page error kosong |
| `robot-motion-browser.js`, produksi | Piksel robot bergerak dengan kamera tetap, Pause membekukan piksel identik, resume dan render cap. Home/About/Experience/hidden/reduced/static menghentikan loop; portrait/scroll pulih; page error kosong |
| `personal-lab-browser.js`, produksi | Orbit/reset/Escape, 1 canvas/no ASCII, hidden/inert/fokus, 20 route reuse, context loss/retry/static, WebGL blocked dan touch lulus; page error kosong |
| Reset piksel | Keyboard identik; mouse mean 0,000001286/255, fraction 0,000003858; toleransi lama tetap |
| `personal-lab-rendering.js`, produksi | Home idle 0 render tambahan/1 detik; interaksi 2 render; settle/resize lulus |
| Source lint lokal | CSS/SceneHost: 0 FAIL / 0 WARN |
| Capture | Delapan state UI pada desktop/tablet/mobile; 15 WebP aktif diperbarui dari produksi. Screenshot HTML menunggu scrim settled setelah scene-only capture |

Log/artifak ada di `.taste-skill/lab-views/compact-*`. Satu meja/keyboard dan batas ruang diperiksa lewat geometri world aktual. Kamera diukur lewat upload uniform viewMatrix pada main framebuffer, render count dari clear WebGL. Jumlah triangle/matriks bukan benchmark FPS atau jaminan performa ponsel. Enam suite fungsional terpisah dari capture/inspector. Setelah koreksi terakhir lensa/posisi intro Home tablet, build (9 tes), smoke, kamera, capture/poster dan source lint diulang dan lulus. Empat suite lainnya lulus sebelum koreksi tablet tersebut; tidak diklaim diulang sesudahnya.

## Review dan batas

Proof utama adalah Home/Projects desktop dan portrait: satu workbench, hero robot pada Projects, overview tanpa meja samping. About/Experience baru diarahkan ulang agar route tetap berfungsi; komposisi baca keduanya dapat disempurnakan setelah proof utama ditinjau. Tidak menambah sudut/furniture Writing/Cabinet secara otomatis.

Dua belas screenshot inspector final (fold dan halaman desktop/tablet/mobile Home serta Projects) telah dibuka. Audit generik Home: 4 FAIL / 3 WARN; Projects: 4 FAIL / 4 WARN. Temuan mencakup palet hangat, sedikit gambar raster, hitungan motion DOM, ruang yang dianggap kosong, panel tidak simetris, ukuran judul, judul berbasis nama dan tanpa footage. Palet hangat, satu scene WebGL, fokus robot di kanan dan idle diam mengikuti arahan produk; penambahan foto/footage atau gerak dekoratif tidak dilakukan hanya untuk memenuhi meter. Audit tetap belum sepenuhnya lulus. Secara visual, satu meja dan fokus robot lebih jelas; ruang atas pada portrait dan keterbacaan teks di depan scene tetap perlu dinilai pemilik.

Belum diuji: ponsel fisik, Safari/Firefox, screen reader/zoom lengkap, cold-load/CLS, frame pacing dan GPU/memory/thermal jangka panjang. Penerimaan visual pemilik atas proof ini masih terbuka. Tidak ada dependency baru, stage/commit/push atau deploy; prototype/analysis/studi/model/lisensi dipertahankan. Perubahan lokal berikutnya berada di atas backup commit pemilik.

## Menjalankan kembali

`npm run dev` untuk edit/preview port 3000; `npm run prototype` untuk studi lama. Hentikan dev sebelum `npm run build`, lalu `npm start`. Urutan enam suite pada README, capture `tests/capture-lab-views.js`, konversi `node scripts/prepare-lab-posters.mjs`. Jangan memakai hasil QA empat meja untuk menyatakan proof kompak diterima.
