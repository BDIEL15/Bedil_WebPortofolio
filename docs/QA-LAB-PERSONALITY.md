# QA — Lab personal, lanyard/foto dan display hobi

25 Oktober 2026 (pengerjaan dimulai 24 Oktober). Pemilik meminta kepadatan seperti foto meja yang dilampirkan: rak/instrumen/kabel, Experience berupa lanyard dan foto yang bisa diganti, Writing berupa paper gantung dan chalkboard rumus fisika. Pemilik memilih kamera, figure Power, audio player dan kaset untuk Cabinet. Arah ini menggantikan Cabinet kotak penyimpanan dan Experience lembar dokumentasi.

## Implementasi aktual

- Satu workbench diperlebar, dengan satu rak atas tambahan, lima instrumen asli tambahan, parts drawers, test leads/gulungan dan kabel yang berakhir pada socket. Gulungan memiliki kait dan kabel kiri dirutekan di belakang drawers; tetap satu meja/renderer/overview. Intro Home tetap di tengah dan tidak diberi lapisan terminal/ASCII.
- Cabinet menjadi sudut hobi: kamera dengan lens ring/aperture/grip, figure Power versi fan-art stilisasi asli, portable cassette player/headphones dan dua kaset. Ini display pilihan minat, bukan foto/replika koleksi fisik pemilik. Tidak mengarang cerita di JSON koleksi. Acuan karakter resmi di ASSETS; tidak mengambil gambar/model resmi sebagai aset produksi.
- Experience memakai tiga pita lanyard berbentuk ribbon mesh, clip/ring dan badge organisasi nyata; tidak ada credential/nomor/periode baru. Foto netral pada tiga badge dan dua bingkai dapat diganti lewat src/data/scene-photo-slots.json. Kelima path masih null. Lampu digeser ke tepi kiri agar tiga foto badge terlihat pada portrait.
- Writing memakai tiga paper pada cord/clip dan chalkboard F=ma, E=½mv², V=IR, ω=2πf, ∇·E=ρ/ε₀, ∇·B=0. Grafis adalah ilustrasi studi, bukan artikel atau data draft.
- Material/geometry statis digabung melalui bake-static.ts; source geometry milik grup dibuang sesudah merge, transform dikembalikan ke ruang lokal root. Robot, monitor dan pensil tetap di luar batch bergerak. Tidak membuat geometry/texture/state React baru per frame.
- Foto menerima URL lokal /photos/... JPG/PNG/WebP; crop cover dipusatkan, gagal load mempertahankan mount. Texture baru didaftarkan ke ownership renderer; handler dibersihkan dan late load diabaikan saat dispose. Redraw satu kali setelah foto tiba bekerja saat Pause. [Panduan foto](SCENE-PHOTOS.md). Tidak ada foto rekaan atau foto pemilik yang otomatis dipublikasikan.
- **236 mesh / 96.510 rendered triangle termasuk instances / 171 geometri / 12 generated texture**. Budget lama <350 mesh/<150.000 triangle tetap. Satu key shadow map diperluas ke volume lab; tidak menambah shadow light. **21 poster aktif total 897.964 byte**, enam POV baca + overview × tiga ukuran.

## Verifikasi

| Pemeriksaan | Hasil aktual |
| --- | --- |
| Build/check | TypeScript, 11 tes konten/scene/asset/loader serta syntax prototype dan build/prerender Next lulus |
| Unit geometri | Satu meja/keyboard, seluruh model dalam bounds lab yang lebih lebar/tinggi, support hobby/props, tiga hero Writing/Cabinet/Experience fit di lima rasio 320px–ultrawide, 129 pose robot/tool tegak/fixture clear |
| Unit foto | Path publik lokal, crop landscape dan portrait, gagal load mempertahankan mount, late callback setelah cleanup tidak membuat texture/redraw. Lima slot unik dan CanvasTexture netral |
| Smoke produksi | Enam route/heading/active nav/reflow320–1440, draft/unknown/raw content 404, noJS, fokus/keyboard/typing/pause/reduced/touch lulus, page error kosong |
| Story produksi | Empat sudut About/Experience/Writing/Cabinet berbeda, satu renderer, motion berlanjut, direct/history, overview/orbit/reset/Escape/fokus/scroll, static/noGL/re-enable dan peran nyata lulus |
| Kamera produksi | 37 view matrix Home→Projects, retarget/immediate drag/history, hidden/pause/reduced, fallback dan scroll lulus |
| Motion produksi | Piksel monitor/robot Home dan notebook About berubah; Pause identik, resume, hidden/reduced/static dan portrait lulus. 31 frame dalam interval sampel, bukan klaimFPS |
| Lifecycle produksi | Satu canvas dan 20 route reuse, orbit/reset/fokus/context loss/poster/retry/static/re-enable/touch lulus. Reset keyboard dan mouse sama persis pada run final; toleransi lama tetap |
| Render probe | Dengan Pause: idleDelta 0, interactionDelta 2; resize tetap render |
| Source lint | Layout, Navigation, SceneHost, Cabinet dan CSS: 0 FAIL/0 WARN |
| Capture | 12 state UI × desktop/tablet/mobile, 21 poster diperbarui setelah posisi lampu final. Build hydration berikutnya tidak mengubah geometry/camera poses/poster |

Enam suite browser produksi final lulus dengan page error kosong; log/artifak .taste-skill/lab-views/dense-*. Geometri dan timestamp render bukan benchmark GPU/ponsel fisik. Foto asli belum tersedia; branch loader/crop/cleanup diverifikasi unit, bukan klaim sudah meninjau foto nyata di browser.

## Error yang ditemukan dan diperbaiki

- Batch lokal menghasilkan roundoff batas notebook sebesar sekitar 5,5e-10 world unit; assertion floor memakai epsilon 1e-7. Batas triangle/mesh, pixel reset, proyeksi hero dan robot tidak dilonggarkan.
- Strap/cassette/camera support dan clipping portrait hobby diperiksa dari bounds aktual; kabel/mount kamera dikoreksi dan kamera portrait dimundurkan agar seluruh hero fit. Lampu awal menutup foto badge pertama di ponsel, kemudian dipindahkan ke tepi kiri; capture/build/suite diulang.
- Smoke menangkap React 418 pada /writing/writing-draft dan /writing/does-not-exist. HTML 404 memakai Home sedangkan client memilih Writing dari prefix URL. RootLayout kini memberi daftar path artikel published dari server ke SceneHost dan Navigation. Hanya path approved yang memilih scene artikel; nav memakai route exact/published, tidak prefix arbitrer. Draft tidak dikirim ke props. Unit mencakup published vs draft/unknown; final smoke bersih. Tidak menutup error dengan suppressHydrationWarning atau mengecualikannya dari tes.

## Review visual

Foto referensi pemilik dipakai sebagai acuan density/material, tidak dibundel. Metadata21st Hanging Polaroid 36189 dan ID Card Lanyard 27450 ditinjau; tetap memakai scene native/project primitives, tanpa retrieval berbayar, generation, physics dependency atau review source eksternal.

Inspector Home dan Cabinet masing-masing mencatat **4 FAIL / 3 WARN**. Dua belas screenshot final desktop/tablet/mobile (fold dan halaman) sudah dibuka. Audit belum sepenuhnya lulus: warm rust accent, jumlah gambar/video, gerak DOM dan komposisi editorial/asymmetric dinilai oleh aturan generik; canvas 3D tidak dihitung sebagai foto atau animasi DOM. Home memakai nama sebagai judul, Cabinet judul 30px; ruang portrait menyisakan area untuk melihat scene sebelum konten. Palet hangat, satu scene, hierarki teks dan portrait scroll dipertahankan sesuai arah pemilik. Tidak menambahkan foto/footage rekaan untuk memenuhi meter. Figure masih toy sederhana; hasil visual dan kepadatan tetap perlu masukan pemilik.

ROUND 2
Seen in one second: workbench elektronik lebih padat dengan display kamera/figure/audio dan paper/rumus.
Idea (one sentence): alat lab, identitas pengalaman dan benda hobi mengisi satu meja personal, sementara intro tetap lega.
Live thing: transisi/Explore serta robot/monitor lintasroute dan pensil About.
Layout words by section: Home=frontal intro / Experience=lanyard / Writing=paper dan chalkboard / Cabinet=hobi / portrait=scene di atas konten.
Scores: design 6.5 · usability 7.5 · creativity 7 · content 5 → overall 6.0 setelah cap audit/slot foto belum diisi, bukan nilai pemilik.
Top three problems and fixes:
1. Slot foto tertutup foreground (Experience mobile awal): lanyard dinaikkan/dikomposisikan ulang dan lampu digeser ke kiri.
2. Kabel/gulungan tampak tidak tersambung (Home/Writing awal): endpoint diarahkan ke socket, hook ditambahkan, route di belakang drawer.
3. Hobby terpotong/props support kurang tepat (unit/capture awal): lensa/camera portrait dan posisi dasar camera/cassette dikoreksi.
Remaining: figure masih interpretasi toy sederhana dan foto aktual belum diisi; kepadatan dan POV menunggu review pemilik. Tidak menambahkan foto/footage rekaan atau animasi DOM untuk menutup temuan meter generik.

Belum diuji: HP fisik, Safari/Firefox, screen reader/zoom lengkap, cold-load/CLS serta GPU/memory/thermal/frame pacing jangka panjang. Draft collections tetap tidak dipublikasikan. Tidak menambah dependency, database/admin/ManimGX, stage/commit/push/deploy. Prototype/analysis/studi/model/lisensi dan perubahan lokal sebelumnya dipertahankan.

## Menjalankan kembali

Preview edit: npm run dev; studi lama: npm run prototype; check: npm run check. Hentikan dev sebelum npm run build, lalu npm start. Enam suite/capture pada README, konversi poster node scripts/prepare-lab-posters.mjs. Panduan mengganti foto: SCENE-PHOTOS.md.

Status penutupan: browser QA ditutup dan server produksi sementara dihentikan setelah identitas proses repository diverifikasi. Preview dev dipulihkan di http://127.0.0.1:3000/ dan melaporkan Ready. Semua perubahan tersimpan di file; tidak ada stage/commit/push/deploy.
