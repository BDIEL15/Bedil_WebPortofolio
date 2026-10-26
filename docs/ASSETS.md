# Aset visual — Personal Electronics Lab dan studi tersimpan

**Terminal/coding, 26 Oktober:** monitor trace/orbit diganti satu CanvasTexture editor 1536×864 yang berbagi painter dengan terminal HTML. Keycap tetap 61 instance pada keyboard yang sama. Budget terbaru 248 mesh/90.432 triangle/182 geometri/12 tekstur. Semua 21 poster diperbarui (794.568 byte). Tidak menambah model/dependency/aset eksternal; karakter kode dan amplop tetap ilustrasi asli proyek. QA-TERMINAL-OPENING.md.

**Urutan badge, 26 Oktober:** Lab dipindah ke slot terdekat kamera bekas IME, sesuai klarifikasi pemilik. Fisik kiri→kanan IME → EXERCISE → Lab; pilihan server/urutan prioritas JSON tetap Lab → EXERCISE → IME, foto keyed ID. Semua 21 poster diperbarui: **790.772 byte**. Tidak ada geometri/model/tekstur baru; budget 249 mesh/90.444 triangle/184 geometri/12 tekstur tetap. Nav marker opacity mewarisi visibility saat UI disembunyikan, sehingga tidak bocor ke poster scene-only. QA terbaru: QA-EXPERIENCE-PROFILE.md.

**Kamera cinematic, 25 Oktober:** tidak ada geometry/material/model baru. Enam pose baca/lensa diperbarui dan poster diregenerasi; overview fisik tetap satu. Opening tidak memakai video/tekstur eksternal: kamera bergerak langsung di engine. Rekaman QA canvas lokal bukan aset produksi. Hasil terbaru: [QA kamera cinematic](QA-CINEMATIC-CAMERA.md).

## Koreksi satu rak — 25 Oktober 2026

Rak tingkat dua beserta empat instrumen dan kabel terkait dihapus sesuai review pemilik. Satu `main-shelf` menahan alat di ujung, hobi di tengah dan organizer enam drawer di sela. Kabel alat yang dipertahankan berakhir pada socket; test leads tetap berkait. Tidak menambah meja/aset eksternal/dependency. Name tag memakai atlas asli untuk organisasi/nama/peran/tahun dari tiga pengalaman published teratas yang dipilih server, bukan credential rekaan. Holder/clip/ring dan tali tiga warna dibatch per badge, dengan lima mount foto netral tetap null. QA aktif: [QA cleanup](QA-LAB-CLEANUP.md). Revisi dua tingkat berikut historis.

## Lab padat dan sudut hobi — 24–25 Oktober 2026

Foto meja dari pemilik dipakai sebagai referensi kepadatan rak/instrumen/kabel, bukan tekstur produksi. Geometri tambahan berada di lab-details.ts dan dibatch per material oleh bake-static.ts; source geometry statis dibuang sesudah penggabungan. Workbench tetap satu, diperlebar untuk rak/parts drawers tambahan, tanpa menaikkan budget 350 mesh/150.000 triangle. Satu key shadow map mencakup ruang lebih tinggi/lebar.

Cabinet memakai kamera generik, portable cassette player/headphones, dua kaset dan figure Power stilisasi asli yang dipilih pemilik. Acuan karakter: [situs resmi Chainsaw Man](https://chainsawman.dog/tvseries/character/). Tidak mengunduh atau membundel model/gambar karakter resmi; mesh adalah interpretasi fan art sederhana. Bukan foto/model dari koleksi fisik pemilik.

Experience memakai tiga lanyard dengan organisasi nyata tanpa nomor/credential/periode rekaan. Lima mount foto netral (tiga badge, dua bingkai) dapat diganti dengan foto publik siap tampil lewat src/data/scene-photo-slots.json; semua path saat ini null. Panduan: [SCENE-PHOTOS](SCENE-PHOTOS.md). Writing memakai tiga paper pada cord dan chalkboard F=ma, E=½mv², V=IR, ω=2πf, ∇·E=ρ/ε₀, ∇·B=0; sketsa bukan tulisan published. Seluruh atlas/label/mount asli dibuat lokal, tidak memuat draft pemilik.

## Satu workbench kompak — produksi terbaru

Empat meja dikonsolidasikan menjadi satu mesh `main-workbench`. Satu keyboard/monitor/lampu dipakai bersama; robot dan fixture berada di kanan, notebook di kiri, lanyard/foto serta paper/chalkboard pada pegboard yang sama. Meja/laci/keyboard/lampu/shelf/instrumen duplikat dihapus dari builder aktif, bukan disembunyikan lewat kamera. Prototype, analysis, model/lisensi dan commit baseline pemilik `fb27fc0` tetap dipertahankan.

Grafis NOTES/IDEAS pada pegboard kanan adalah sketsa ilustratif asli, bukan judul artikel/draft pemilik. Cabinet memakai display hobi pilihan pemilik; tidak mengarang catatan koleksi terpublikasi. Batch statis kini mengonversi world transform ke koordinat lokal root agar posisi pegboard tidak diterapkan dua kali.

Geometri/CanvasTexture masih asli repository. Builder penuh **249 mesh / 90.444 rendered triangle termasuk instances / 184 geometri / 12 tekstur**. Budget lama 350 mesh/150.000 triangle tetap; batching per badge mempertahankan bounds/pemisahan yang bisa diuji. Ini bukan benchmark FPS atau GPU perangkat fisik. Robot/monitor bergerak lintasroute; About menambah penulisan. Dua buffer garis digunakan ulang (trace 64 titik dan goresan notebook); tidak membuat texture/canvas/geometry per frame. Satu key shadow map workbench diperbarui; fill robot tidak membuat shadow map kedua. Geometri bergerak dikecualikan dari batch statis; tracker/dispose juga mencakup THREE.Line.

## Poster aktif: enam POV objek + satu overview bersama

Home/Projects/About/Experience/Writing/Cabinet memiliki poster baca masing-masing. Semua route Hide Text memakai `lab-overview-`, sehingga ada **21 WebP aktif, total 790.038 byte**. Sembilan poster overview per-route lama yang tidak dipakai dihapus; versi historis tetap tersedia melalui Git. Capture merekam 12 state UI untuk regresi, converter hanya menghasilkan tujuh pose unik. Hasil scene-only tanpa HTML/scrim/tools; robot di pose istirahat deterministik. Poster memakai pose akhir diam, bukan frame opening sementara.

| Prefix `public/scene/` | Desktop 1440×1000 | Tablet 768×1024 | Mobile 390×844 |
| --- | ---: | ---: | ---: |
| `personal-lab-` | 71.536 byte | 31.116 byte | 14.772 byte |
| `lab-projects-` | 95.144 byte | 44.396 byte | 23.200 byte |
| `lab-about-` | 50.038 byte | 23.418 byte | 13.750 byte |
| `lab-experience-` | 58.452 byte | 29.456 byte | 15.524 byte |
| `lab-writing-` | 81.406 byte | 37.510 byte | 18.018 byte |
| `lab-cabinet-` | 48.780 byte | 24.724 byte | 16.536 byte |
| `lab-overview-` | 51.432 byte | 29.072 byte | 11.758 byte |

Reproduksi: server port 3000 → `tests/capture-lab-views.js` → `node scripts/prepare-lab-posters.mjs`. Screenshot HTML menunggu scrim kembali settled setelah scene-only capture; tidak memakai frame fade sementara sebagai bukti kontras.

## Riwayat empat meja / poster per-route

Bagian berikut historis dan tidak menggantikan manifest aktif di atas.

## About / Experience — 24 Oktober 2026

Geometri dan grafis asli di `src/lib/scene/story-corners.ts`: meja baca/lampu/notebook dua halaman/buku/pensil untuk About; board dokumentasi/lembar berklip/stack notebook/pencil cup untuk Experience. Atlas kertas berisi ilustrasi chip, kode dan komunitas, bukan sertifikat atau dokumen karya pemilik. Nama/peran/tahun nyata tetap HTML dari JSON published; tidak dibakar ke poster atau bundle scene. Tidak ada foto/logo/aset eksternal baru.

Kedua area fisik berada di kiri Home (X=-7,4 dan -13,4). Geometri statis dibatch bersama menurut material dengan utilitas Three.js yang sudah terpasang; sumber geometri sementara dibersihkan setelah merge. Material kayu/metal/paper memakai palette yang sama, grafis cetak memakai CanvasTexture lokal. Satu spotlight statis tambahan melayani keduanya dan di-cache; tidak ada render idle baru.

Builder penuh: **347 mesh / 122.418 rendered triangle termasuk instances / 173 geometri bersama / 14 tekstur**. Budget lama <350 mesh/<150.000 triangle tidak dilonggarkan. Ini bukan pengukuran FPS/GPU/perangkat fisik; shadow/environment menambah biaya di luar jumlah tersebut.

## Poster delapan pose — produksi terbaru

Empat sudut masing-masing memiliki mode baca dan overview; tiga resolusi 1440×1000 / 768×1024 / 390×844 menghasilkan **24 WebP, total 717.670 byte**. Browser memilih pose/resolusi relevan. Semua capture scene-only tanpa HTML/scrim/controls, pose robot istirahat deterministik. Reproduksi: `tests/capture-lab-views.js`, lalu `node scripts/prepare-lab-posters.mjs`.

| Prefix `public/scene/` | Desktop | Tablet | Mobile |
| --- | ---: | ---: | ---: |
| `personal-lab-` | 63.478 byte | 28.924 byte | 14.004 byte |
| `lab-projects-` | 49.056 byte | 21.450 byte | 11.762 byte |
| `lab-overview-` | 63.484 byte | 40.528 byte | 16.446 byte |
| `lab-projects-overview-` | 49.628 byte | 33.940 byte | 14.430 byte |
| `lab-about-` | 52.958 byte | 22.962 byte | 11.952 byte |
| `lab-experience-` | 29.226 byte | 16.122 byte | 9.318 byte |
| `lab-about-overview-` | 52.214 byte | 32.750 byte | 15.146 byte |
| `lab-experience-overview-` | 32.648 byte | 24.146 byte | 11.098 byte |

## Riwayat model/motion dua workspace

Data ukuran di bagian historis berikut tidak menggantikan manifest terbaru di atas.

## Model dan motion terbaru — 24 Oktober 2026

Robot prosedural kini memakai pivot turret/bahu/siku/pergelangan/tool, housing tirus, bearing/collar, flange, gripper/pad dan kabel per-link. Baut basis instanced; keyboard robotics mengklon geometri/tekstur keyboard Home yang sama, dan storage memiliki muka/handle. Kayu lebih netral dengan roughness 0,65; enamel/logam memakai material PBR yang dibedakan. Tidak ada aset, model atau dependency eksternal baru.

Motion observasional 16 detik mengubah joint transform tanpa rebuild geometry/texture, menjaga gripper tegak; bukan simulasi/pick-and-place. Shadow Home di-cache; hanya spotlight robotics diperbarui saat robot bergerak. Render sekitar maksimum 30Hz selama Projects terlihat dan motion aktif; pause/reduced/hidden/route lain/static menghentikan loop. Poster dari pose istirahat awal deterministik. Hasil: QA-ROBOT-MOTION.

## Dua workspace / empat pose — 24 Oktober 2026

Home dan Projects berada dalam satu scene/renderer. Projects kini meja kedua di X=8,5 dengan arm/gripper, fixture, sample cube, monitor diagram, keyboard kecil dan storage. Geometri, CanvasTexture dan label asli repository; tidak menggunakan GLB historis atau aset referensi. Seluruhnya ilustrasi konseptual, bukan dokumentasi karya/peralatan pemilik. Tidak ada dependency/aset pihak ketiga baru.

Builder revisi motion terukur **335 mesh, 107.980 triangle yang dirender (termasuk instances), 161 geometri bersama dan 12 tekstur**. Shadow/environment menambah biaya renderer di luar hitungan itu; bukan bukti performa ponsel fisik. Batas tes 350 mesh/150.000 triangle dipertahankan. Lampu/shadow workspace ditangani lifecycle engine.

Empat pose: Home, Projects, overview Home dan overview Projects; masing-masing portrait/tablet/desktop. Semua poster dari render aktual tanpa HTML/scrim/kontrol. Detail byte berikut berasal dari capture produksi final, total 380.460 byte.

| Prefix `public/scene/` | Desktop 1440×1000 | Tablet 768×1024 | Mobile 390×844 |
| --- | ---: | ---: | ---: |
| `personal-lab-` | 63.436 byte | 28.924 byte | 14.004 byte |
| `lab-projects-` | 49.056 byte | 21.450 byte | 11.762 byte |
| `lab-overview-` | 51.394 byte | 30.512 byte | 12.472 byte |
| `lab-projects-overview-` | 49.628 byte | 33.378 byte | 14.444 byte |

Browser memilih poster pose/resolusi yang relevan dari 12 WebP; bukan semua dimuat saat awal. Tanpa JS dimulai pada poster route; Hide Text pada static/no-WebGL memakai overview workspace aktif. Inspect ASCII dihapus dari engine/UI aktif; semua kode/studi/lisensi historis tetap disimpan.

## Home Personal Electronics Lab — 23 Oktober 2026

**Perbaikan props 24 Oktober:** keyboard ANSI 60% lima baris, 61 keycap instanced dengan warna/legenda CanvasTexture; spiral kabel tersampling 320 segmen, konektor serta probe terhubung ke soket. Casing/bezel/knob/ventilasi/kaki instrumen, stand monitor, cover/halaman notebook, obeng dan kepala lampu dibentuk ulang. RoundedBoxGeometry di-cache menurut dimensi, bukan diskalakan dari satu rounded cube. Tekstur pegboard 1536×512 dan mat 1024×512 mengikuti rasio permukaan. Semua tetap geometri/tekstur asli tanpa merek/aset eksternal baru. Builder terukur 254 mesh, 71.432 triangle yang dirender, 104 geometri bersama dan 9 tekstur; tidak termasuk biaya tambahan shadow/environment renderer.

Poster riwayat hasil render props sebelum revisi material/motion: **63.914 / 29.160 / 14.144 byte**, dimensi dan konversi quality 84 tetap. Tidak ada HTML/scrim/kontrol di dalam poster.

**Riwayat revisi kamera 24 Oktober:** poster dari pandangan duduk menghadap pegboard, dengan keyboard/kabel di foreground. Dimensi/skrip reproduksi tetap; ukuran WebP saat revisi kamera sebelum perbaikan props: 57.968 / 26.892 / 13.390 byte. Geometri, tekstur prosedural, sumber dan lisensi belum berubah pada revisi kamera tersebut.

Scene aktif menggunakan geometri dan tekstur prosedural asli repository, bukan model/foto yang disalin dari referensi. `src/lib/scene/personal-lab.ts` membentuk meja/rak kayu, pegboard, lampu, instrumen generik, monitor, keyboard instanced, kabel, cutting mat dan catatan. CanvasTexture menggambar serat kayu, lubang pegboard, grid mat, layar ilustratif dan label. Tidak ada merek, data telemetri nyata, manga atau stiker yang belum dipilih. Lampu/material/tekstur adalah ilustrasi, bukan dokumentasi ruang/karya pemilik.

`public/scene/personal-lab-{desktop,tablet,mobile}.webp` adalah render dari scene yang sama tanpa HTML/scrim/kontrol, pada 1440×1000, 768×1024 dan 390×844. Poster dipakai sebelum scene siap dan saat fallback/statik. Rasio viewport lain memakai crop; tidak dijanjikan identik per piksel pada setiap perangkat.

Reproduksi dengan server port 3000 dan `playwright-cli` tersedia:

```powershell
playwright-cli open http://127.0.0.1:3000/
playwright-cli run-code --filename=tests/capture-lab-views.js
node scripts/prepare-lab-posters.mjs
playwright-cli close
```

Capture empat pose menyimpan PNG lokal di `.taste-skill/lab-views/`; konversi memakai sharp yang sudah disertakan dependency Next.js. Foto pemilik dalam `analysis/workbench-references/` hanya referensi desain, tidak diimpor/disalin ke public. Tidak mengunduh model, tekstur atau source dari Hamza/Clarissa. Tidak ada dependency/aset pihak ketiga baru pada Home; font lokal berikut tetap dipakai sesuai lisensinya.

## Riwayat Robotics study

Semua aset produksi disajikan lokal. Objek pada scene adalah ilustrasi konseptual, bukan bukti project atau kepemilikan robot oleh Abdiel.

Implementasi dijeda untuk brainstorming ulang konsep personal pada 23 Oktober 2026. Aset berikut dipertahankan beserta lisensi/sumbernya; belum ada keputusan bahwa robot atau tema ini wajib dipakai pada konsep berikutnya. Tidak ada aset yang diganti/dihapus pada checkpoint jeda.

## Robot

- Model: ABB IRB 52 7/1.2, tujuh visual mesh dari [ROS-Industrial abb_irb52_support](https://github.com/ros-industrial/abb/tree/45f4769d826cf3ac62a65495f2db67b78b0c81df/abb_irb52_support).
- Revision sumber: `45f4769d826cf3ac62a65495f2db67b78b0c81df`. Author menurut package: Michael Ripperger, Levi Armstrong (SwRI); pemelihara ROS-Industrial community.
- Lisensi paket: Apache-2.0. Teks lengkap dan notice tetap ada di `public/models/LICENSE-IRB52.txt` dan `NOTICE-IRB52.txt`. Model ini tidak dimuat oleh engine Home baru; caption/credits lama tersimpan dalam kode studi sebelumnya.
- Produksi: `public/models/irb52.glb`, 1.550.104 byte, 26.060 triangle, tujuh mesh, dua material, tanpa tekstur/decoder/dependency eksternal. Ukuran transfer aktual bergantung kompresi server; angka ini ukuran file.
- Transformasi: STL diindeks, dirangkai memakai offset URDF (termasuk offset visual link_4), diubah dari Z-up ke Y-up, diberi pose dan material presentasi. Tidak memakai kontrol atau perhitungan kinematika untuk klaim simulasi akurat.
- Reproduksi: `node scripts/prepare-robot.mjs`. Memakai cache `.taste-skill/robot-source/` jika tersedia, atau mengunduh mesh/lisensi dari revision yang dipatok. Script menyertakan assert struktur, dimensi dan budget; memerlukan akses jaringan bila cache kosong. Tidak dijalankan dalam build aplikasi.
- Kamera pengamatan, gripper ilustratif, meja, baut, kabel dan blok kalibrasi dibuat dengan geometry dalam kode proyek. Bukan bagian dari model robot asli atau klaim konfigurasi perangkat nyata.

Kandidat lain yang ditinjau: aset robot low-poly CC0 (detail kurang sesuai tujuan visual), NASA Robonaut 2 (bentuk humanoid kurang sesuai usulan lengan di meja). Tidak diunduh/dipakai dalam produksi. Aset Clarissa Builds tidak diambil untuk produksi.

## Font

- Libertinus Serif regular Latin: [Google Fonts](https://fonts.google.com/specimen/Libertinus+Serif), `public/fonts/libertinus-serif.woff2`, 23.400 byte.
- Libertinus Sans regular Latin: [Google Fonts](https://fonts.google.com/specimen/Libertinus+Sans), `public/fonts/libertinus-sans.woff2`, 21.868 byte.
- Lisensi SIL Open Font License 1.1 dari repository resmi Google Fonts: `public/fonts/OFL-Libertinus-Serif.txt` dan `OFL-Libertinus-Sans.txt`.
- File Latin resmi fonts.gstatic.com diunduh langsung; tidak memakai salinan font dari bundle referensi. Font lain/bold/italic tidak ditambahkan pada tahap ini.

## Poster fallback

`public/scene/workshop-{desktop,tablet,mobile}.webp` berasal dari render scene produksi ini, tanpa konten HTML, scrim, kontrol, atau UI pengembangan. Pose paused deterministik; tiga framing sesuai ukuran pengambilan 1440×1000, 768×1024 dan 390×844. Poster selalu terlihat lebih dulu; canvas melakukan fade di atasnya ketika model siap. Rasio viewport lain memakai crop, sehingga kecocokan piksel di setiap rasio tidak dijanjikan.

Rekam ulang: jalankan aplikasi pada port 3000, lalu `playwright-cli run-code --filename=tests/capture-workshop.js`. Hasil PNG scene ada di `.taste-skill/workshop/poster-*.png`; konversi ke WebP dengan `sharp` yang tersedia pada dependency Next.js. Jangan mengubah poster dengan menambahkan nama project atau konten halaman.

## Motion/UI

SplitText proyek merupakan adaptasi ringkas konsep [React Bits Split Text](https://reactbits.dev/text-animations/split-text): reveal kata dengan GSAP yang sudah terpasang, SSR terlihat, mengikuti pause dan reduced motion. Versi registry awal yang belum terintegrasi diganti; tidak memuat ScrollTrigger, plugin SplitText, hover spring atau utility Tailwind yang tidak tersedia. Transisi route/kontrol memakai CSS.

Pencarian 21st melalui CLI memerlukan login dan belum tersedia di lingkungan ini. Tidak ada komponen atau kode 21st yang diklaim sudah dipasang; tidak memakai hosted generation/credit. Konteks desain lokal di `.21st/` mencatat keputusan pemilik dan keterbatasan ini.

## Home social SVG — 26 Oktober 2026

`public/icons/github.svg`, `linkedin.svg`, `instagram.svg`: SVG Simple Icons v11.15.0, disalin dari [repository sumber](https://github.com/simple-icons/simple-icons/tree/11.15.0/icons). [Lisensi CC0](https://github.com/simple-icons/simple-icons/blob/11.15.0/LICENSE.md) disimpan pada `public/icons/SIMPLE-ICONS-LICENSE.md`. `email.svg` adalah geometri amplop sederhana asli proyek. SVG dipakai sebagai CSS mask berwarna currentColor, lokal tanpa CDN/dependency runtime. Tautan akun/email berasal langsung dari pemilik, disimpan pada `src/content/profile.json`.
