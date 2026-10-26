# QA — aktivitas workbench lintasroute

24 Oktober 2026. Pemilik meminta robot tetap bergerak termasuk Home, monitor menampilkan animasi dan notebook menulis pada About. Instruksi ini menggantikan syarat Home idle diam. Revisi tetap pada satu workbench, tanpa sudut Writing/Cabinet baru. Rencana Writing/pegboard di belakang robot dan Cabinet/rak disukai pemilik dan dicatat untuk tahap berikutnya.

## Implementasi

- Satu loop renderer maksimal sekitar 30Hz menggerakkan rig robot 16 detik dan monitor (trace 64 titik serta satelit orbit) di seluruh route, termasuk Home dan selama perpindahan kamera. Kamera GSAP tidak lagi menahan aktivitas; saat loop aktif, callback GSAP tidak membuat render kedua setiap update. Input/resize tetap dapat meminta render tambahan.
- About menampilkan pensil miring yang mengikuti ujung goresan ilustratif: 9 detik menulis, 1,5 detik jeda, 1,5 detik mengangkat/kembali sambil tinta memudar, siklus 12 detik. Goresan menyerupai latihan tulisan, bukan artikel atau karya yang dikarang. Waktu notebook hanya maju saat About; robot/monitor melanjutkan fase lintasroute.
- Pause/reduced motion, tab hidden, static/context loss/dispose menghentikan loop. Resume tidak mengejar waktu tersembunyi. Phase dan tinta/pensil beku saat Pause; reduced motion tidak bisa dilewati dengan Play untuk scene. Poster tetap statis tanpa JS/WebGL.
- Buffer trace diubah di tempat, notebook memakai drawRange/opacity; tidak ada CanvasTexture/geometry/material atau React state baru per frame. Rig bergerak ditambahkan setelah batch statis. Tracker cleanup kini mencakup THREE.Line maupun LineSegments, sehingga kedua buffer/material garis ikut dispose.
- Builder **198 mesh / 60.984 rendered triangle / 131 geometri / 8 tekstur**. Budget <350 mesh / <150.000 triangle tidak dilonggarkan. Lima pose unik × tiga ukuran = **15 poster / 479.634 byte**, diperbarui dari produksi dengan Pause aktif dan fase awal deterministik.

## Hasil pemeriksaan

- Build produksi, TypeScript, **10 tes** dan syntax prototype lulus. Tes baru memeriksa batas/progress siklus tinta, lift, fade dan reset; tes rig/framing129 pose tetap lulus. Resource garis ikut pemeriksaan finite/cleanup unit.
- Enam suite produksi lulus, page error kosong: smoke enam route/reflow320–1440/noJS/fokus/typing/pause/reduced; kamera; story routes; motion; lifecycle/context loss/retry; render probe. Log: .taste-skill/lab-views/activity-*.
- Motion membuktikan piksel monitor dan robot pada Home berubah di crop terpisah, serta piksel notebook About berubah dan membeku saat Pause. Rig Projects bergerak, resume berfungsi, cap diukur dari timestamp; 32 frame dalam interval sampel bukan klaim32FPS. Hidden/reduced/static menghentikan loop; Home/About/Experience kini terus merender sesuai brief. Portrait autoExplore dan native scroll pulih.
- Kamera merekam **38 view matrix berbeda** sepanjang transisi Home → Projects, satu renderer; immediate drag/reset/Escape/history/retarget/hidden/pause/reduced/fallback/scroll lulus. Jumlah matrix bukan penilaian frame pacing perangkat.
- Lifecycle: satu canvas, 20 route reuse, reset piksel keyboard identik; mouse mean0,000001029/255, fraction0,000003086. Context loss membuang canvas, poster/retry/static/re-enable bekerja.
- Probe render dengan Pause aktif: idleDelta0 dan interactionDelta2; resize masih merender. Syarat aktif idle0 diubah karena bertentangan dengan permintaan animasi terus berjalan.
- Probe dev reduced motion sempat gagal saat pekerjaan source/HMR masih berjalan; hasil produksi final lulus. Tes lifecycle awal masih mengharuskan Home diam; ekspektasi diganti menjadi piksel bergerak setelah resume dan identik setelah Pause, lalu lulus. Tidak melonggarkan batas cap, reset atau framing.
- Capture delapan state UI desktop/tablet/mobile dan 15 poster selesai. Dua belas screenshot inspector final Home/About (fold dan halaman desktop/tablet/mobile) dibuka. Keduanya 4 FAIL/3 WARN; palet hangat, jumlah raster, motion DOM dan layout/gap/judul/footage masih temuan generik. Audit tidak sepenuhnya lulus.

## Review visual dan batas

Pensil/ink dan waveform telah dilihat pada render aktual. Goresan masih stilisasi, bukan tulisan tangan final pemilik; tanpa tangan/karakter. Tidak menambah animasi dekoratif HTML atau foto untuk memenuhi meter generik. Palet hangat, satu canvas dan fokus objek mengikuti brief. Audit generik tetap menjadi temuan terpisah dari kelulusan fungsional.

ROUND 1
Seen in one second: workbench hangat yang hidup, dengan aktivitas menulis pada About.
Idea (one sentence): benda elektronik dan notebook menjadi penanda aktivitas belajar di meja personal.
Live thing: kamera/Explore, monitor dan robot lintasroute, pensil/ink About.
Layout words by section: Home=frontal intro / About=notebook hero dan HTML baca / portrait=scene di atas konten.
Scores: design6.5 · usability7.5 · creativity7 · content7 → overall6.0 setelah cap audit generik.
Caps applied: jumlah raster/DOM motion dan temuan audit; bukan nilai pemilik.
Top three considerations:
1. Goresan notebook berupa latihan kursif abstrak (About desktop/mobile); tulisan tangan personal dapat menggantikannya setelah materi tersedia.
2. Motion halus tidak dihitung meter DOM (Home/About); pembuktian memakai crop piksel dan frame timestamp.
3. Scene bergerak memerlukan GPU saat membaca; cap, Pause, reduced motion dan fallback tersedia, tetapi perangkat nyata masih perlu QA.

Belum diperiksa: ponsel fisik, Safari/Firefox, screen reader/zoom lengkap, cold-load/CLS dan GPU/memory/thermal/frame pacing jangka panjang. Tidak menyebut cap atau statistik geometri sebagai benchmark perangkat. Tidak ada dependency/aset eksternal, database/admin/ManimGX, stage/commit/push/deploy. Prototype/analysis/studi/model/lisensi dan perubahan lokal sebelumnya dipertahankan.

## Menjalankan kembali

Preview edit: npm run dev. Studi lama: npm run prototype. Pemeriksaan: npm run check. Hentikan dev sebelum npm run build, lalu npm start. Urutan browser/capture pada README; konversi poster: node scripts/prepare-lab-posters.mjs.

Akhir sesi: seluruh perubahan tersimpan lokal. Browser QA ditutup, produksi sementara dihentikan dan preview dev dipulihkan pada http://127.0.0.1:3000/. Tidak stage/commit/push/deploy.
