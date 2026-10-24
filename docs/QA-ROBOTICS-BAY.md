# QA Projects robotics dan Hide Text otomatis

> Riwayat sebelum revisi bentuk/motion robot. Pernyataan robot diam/tanpa animasi Projects pada laporan ini digantikan [QA motion](QA-ROBOT-MOTION.md). Penghapusan ASCII dan Hide Text otomatis tetap berlaku.

24 Oktober 2026. Perubahan ini menindaklanjuti koreksi pemilik: Projects harus terasa sebagai area lain, Inspect ASCII dihapus, dan Hide Text langsung dapat dieksplorasi. Ini bukan penyelesaian seluruh sudut lab atau persetujuan visual final.

## Implementasi

- Projects memiliki meja robotics terpisah pada X=8,5 dalam scene yang sama: arm/gripper prosedural asli, fixture/sample cube, monitor diagram, storage dan notebook. Tidak memakai model GLB historis, mengunduh aset atau menambah dependency. Semua ilustratif; tidak ditambahkan sebagai project milik pemilik.
- Home dan Projects dibangun sekali dan berbagi renderer. Kamera/target/FOV/fog bergerak 1,25 detik untuk route/restore dan 1,15 detik untuk overview, power3.inOut. Masing-masing workspace memiliki bounds/overview sendiri, termasuk portrait. Direct URL mulai pada tujuan.
- Inspect ASCII, state/API dan canvas overlay dihapus dari engine/UI aktif. Satu canvas WebGL tersisa. Prototype, engine studi lama dan lisensinya tetap disimpan. String tombol tidak ditemukan dalam `.next/static` build terakhir.
- Hide Text otomatis mengaktifkan drag/arrow/reset termasuk touch, tanpa klik Explore kedua. Drag saat kamera masih bergerak menghentikan tween pada pose saat itu. Show Text/Escape memulihkan pose route, HTML, fokus dan scroll; Escape juga bekerja saat fokus di luar canvas. Saat membaca, touch memakai native pan-y/pinch-zoom dan Explore tetap pilihan eksplisit.
- Pause/reduced motion langsung menyelesaikan kamera ke tujuan. Tidak ada animasi idle. Lifecycle membersihkan tween, observer, listener, controls, geometry/material/texture, shadow light dan renderer. Static/context loss/no-WebGL memakai poster workspace/overview aktif.
- Dua belas WebP berasal dari empat pose × tiga resolusi. Projects mobile dan tablet portrait menempatkan panel baca sesudah area robot, agar bentuknya terlihat. Kontrol tablet mengikuti alur halaman saat membaca. Koreksi tablet mengikuti review screenshot yang sebelumnya menutupi robot dan menumpuk kontrol/teks; smoke menambahkan assertion bahwa panel dan kontrol tidak beririsan.

## Pemeriksaan aktual

| Pemeriksaan | Hasil |
| --- | --- |
| `npm run build` | TypeScript, 7 tes, syntax prototype, kompilasi dan prerender lulus setelah koreksi tablet |
| Geometri/kamera | 310 mesh, 84.438 triangle termasuk instances, 147 geometri bersama, 12 tekstur. Budget 350/150.000 tidak dilonggarkan. Arm berada pada bay terpisah dan di atas mounting surface. Overview fit kedua workspace diuji pada 5 rasio |
| `personal-lab-smoke.js`, produksi | Empat route, empty state/draft/404, reflow 320–1440, keyboard/fokus, pause/typing/reduced motion, anchor identitas nyata, touch dan tanpa JS lulus; page error kosong |
| `personal-lab-browser.js`, produksi | Orbit/reset/Escape, 1 canvas, tombol ASCII tidak ada, hidden/inert/fokus, 20 route dengan renderer sama, context loss/retry/static, WebGL blocked dan touch lulus; page error kosong |
| Reset piksel | Keyboard identik; mouse mean 0,000003086/255 dan fraction 0,000009259 pada Home, toleransi sebelumnya dipertahankan |
| `personal-lab-rendering.js`, produksi | Idle 0 render tambahan dalam 1 detik; interaksi 2 render; settle/resize lulus. Ini bukan FPS animasi atau perangkat fisik |
| `lab-camera-browser.js`, produksi final | 218 matriks view main-framebuffer berbeda saat Home → Projects, renderer sama. Direct Projects, Hide/Show/scroll, immediate drag saat tween, Reset overview, Escape dari luar canvas, retarget/history, simulated hidden tab, pause/reduced motion, static/re-enable, touch dan no-WebGL lulus; page error kosong |
| Source lint lokal | CSS/SceneHost/MotionProvider/EmptyState: 0 FAIL / 0 WARN |
| Capture | Home/Projects dan overview keduanya pada 1440×1000, 768×1024 dan 390×844; poster scene-only dan screenshot HTML produksi |

Log/artefak lokal ada di `.taste-skill/lab-views/` dengan prefix `robotics-`. `viewMatrix` direkam pada upload uniform WebGL ke main framebuffer, bukan hanya atribut DOM atau render React. Jumlah matriks tidak menyatakan FPS atau frame pacing. Lifecycle/probe dijalankan sebelum koreksi CSS tablet; kamera diulang setelah pemindahan panel tablet; build/smoke/capture/inspector diperiksa ulang setelah koreksi kontrol tablet terakhir. Poster dikonversi dengan script ASSETS, tanpa manipulasi visual.

## Review visual dan batas

Scene Projects sekarang dikenali sebagai meja kedua: siluet arm/gripper di kanan, panel baca di kiri desktop; portrait memberi ruang robot sebelum panel baca. Overview menunjukkan kedalaman dua meja; orbit terbatas tetap untuk observasi. Robot belum dianimasikan sendiri. Bentuk sederhana masih kandidat visual dan bukan CAD/simulasi akurat.

Inspector generik final mencatat **4 FAIL / 4 WARN**: palet terracotta, hanya satu scene/poster alih-alih empat foto, panel kiri dianggap off-centre, serta hitungan elemen DOM bergerak rendah; WARN tanpa footage, judul 30px, ambang subjudul/name-only-title dan gap portrait 768/390. Enam screenshot fold/full-page inspector akhir dibuka, selain capture empat pose. Palet hangat mengikuti arahan pemilik; kanan panel desktop diisi robot, gap portrait diisi hero WebGL. Scene diam saat idle memang batas produk. Tidak menambahkan foto/karya/efek fiktif untuk memenuhi meter. Audit belum sepenuhnya lulus; source lint dan pemeriksaan fungsional dipisahkan dari temuan ini.

Critique internal: design 6,5 / usability 7,5 / creativity 7 / content 7; overall dibatasi 6 karena audit belum lulus. Bukan penilaian pemilik atau klaim setara referensi. Masalah yang masih terbuka: rasa material/model prosedural, komposisi pada rasio lain, karya nyata/kontak/CV serta penerimaan transisi. Konten yang belum diberikan tetap tidak dikarang.

Belum diuji: perangkat mobile fisik, Safari/Firefox, screen reader/zoom lengkap, cold-load/bundle/CLS terukur, frame pacing dan GPU/memory jangka panjang. Pengujian Chromium lokal tidak membuktikan semua perangkat terasa sama. Sudut About/Experience/Writing/Cabinet tersendiri masih lanjutan; Supabase/admin/ManimGX/deploy tidak dikerjakan.

## Menjalankan kembali

`npm run dev` untuk mengedit; `npm run prototype` untuk studi lama. Hentikan dev sebelum `npm run build`, lalu `npm start` untuk QA produksi. Dengan server port 3000, jalankan urutan suite pada README, lalu `tests/capture-lab-views.js` dan `node scripts/prepare-lab-posters.mjs`. Jangan memakai QA studi lama sebagai bukti runtime ini.
