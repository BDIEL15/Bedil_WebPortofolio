# TODO — Digital Observatory

Status: **implementasi dijeda atas permintaan pemilik untuk brainstorming ulang konsep di chat baru**. Kandidat Robotics study dan motion tetap disimpan dan dapat dijalankan; build serta QA browser produksi terakhir lulus, belum ada persetujuan visual akhir atau konsep pengganti. Hasil terakhir: [QA Robotics study](docs/QA-WORKSHOP.md) dan [manifest aset](docs/ASSETS.md). Checkbox berarti hasil nyata, bukan persetujuan desain atau seluruh PRD sudah selesai.

## Checkpoint jeda dan handoff — 23 Oktober 2026

### Keputusan terbaru pemilik

- Hentikan implementasi sementara. Pemilik kemungkinan akan mengubah beberapa konsep dan ingin brainstorming di chat baru agar portofolio lebih menyatu dengan kepribadiannya.
- Digital Observatory, latar robotics, objek, tipografi, warna, narasi dan referensi yang dipakai adalah baseline diskusi sebelumnya. Belum ada pengganti yang ditetapkan; jangan menafsirkan jeda sebagai penolakan semua preferensi lama atau persetujuan kandidat saat ini.
- Simpan aplikasi, prototype, analysis, model/lisensi dan dokumentasi. Jangan mengulang fondasi, menjalankan REA lagi, menambah polish/fitur, deploy, atau mengganti konsep berdasarkan asumsi. Perubahan Git masih lokal dan belum di-commit; jangan reset/clean/stash tanpa instruksi.
- Fakta pemilik tetap: Abdiel Deandra EL Dzaky, mahasiswa Teknik Komputer UI; asisten lab Digital Laboratory; staff software EXERCISE FTUI 2026; Badan Pengurus Kominfo IME FTUI 2026. Detail kontribusi/periode/kontak/karya yang belum diberikan tetap belum diketahui.

### Sudah tersedia dan verifikasi terakhir

- Next.js App Router/React/TypeScript/CSS di root `src/`, empat halaman dan JSON/Markdown/MDX lokal; About nyata serta empty state Projects/Writing/Cabinet. Prototype lama tetap terpisah.
- Kandidat Robotics study, model GLB berlisensi, poster responsif, reveal/transisi, pause/reduced motion, keyboard/orbit/reset, ASCII lokal dan fallback. Ini implementasi tersimpan, bukan bukti robot/karya milik pemilik.
- Build terakhir, TypeScript, lima tes, syntax prototype, smoke browser produksi/lifecycle/motion lulus; tidak ada page error. Inspector desain generik masih **2 FAIL/3 WARN**. Probe singkat emulasi Chromium **27,5 fps**, bukan hasil mobile fisik atau bukti memenuhi target ≥30 FPS.
- Belum selesai: konsep personal final; materi project/tulisan/cabinet dan kontribusinya; kontak/CV; metadata/sitemap; QA mobile fisik, lintas browser, screen reader/zoom, CLS/loading/bundle serta GPU/memory jangka panjang.
- Kendala terdahulu: Windows Turbopack junction membuat dev/build memakai Webpack. Pada QA sebelumnya CLI 21st meminta login dan external review ditolak auto-review karena potensi pengiriman source; review lokal digunakan. Itu bukan pengujian koneksi MCP/akun pada chat berikutnya; verifikasi kemampuan yang tersedia bila nanti diperlukan dan jangan otomatis mengirim source.
- Pembaruan checkpoint ini hanya menyentuh dokumentasi/konteks desain. Build/browser tidak dijalankan ulang karena tidak ada perubahan runtime; hasil di atas adalah hasil pemeriksaan implementasi sebelumnya.

### Berikutnya setelah brainstorming

1. Gali kepribadian, cerita, minat yang ingin ditonjolkan, suasana yang diinginkan dan hal yang terasa kurang personal. Tentukan preferensi lama yang dipertahankan/diubah; belum perlu memilih library atau efek.
2. Rumuskan konsep personal dan hierarki konten yang disepakati, lalu cocokkan dengan kode/aset yang bisa dipakai kembali. Update PRD/AGENTS/konteks desain agar arah lama tidak dianggap keputusan final.
3. Setelah pemilik meminta eksekusi kembali, verifikasi Git/checkpoint aktual lalu kerjakan satu bukti visual desktop/mobile sesuai konsep baru. Lanjutkan QA yang relevan; jangan mengulang pekerjaan yang sudah selesai.

### Prompt untuk chat baru

> Saya ingin brainstorming ulang konsep portofolio agar lebih mencerminkan kepribadian saya. Repository: `C:\Users\abdie\OneDrive\Documents\ChatGPT\Website Portofolio`. Baca AGENTS.md, checkpoint teratas TODO.md, README.md dan PRD §2.4. Implementasi dijeda; Digital Observatory/Robotics study hanyalah baseline tersimpan dan belum final. Bantu menggali cerita, karakter, minat dan suasana yang saya inginkan sebelum menentukan konsep baru. Jangan mulai coding, mengganti aset, atau mengulang REA sampai saya meminta eksekusi. Fakta profil dan batas verifikasi sudah tercatat; jangan mengarang karya atau kontribusi.

Perintah kembali: `npm ci` bila dependency perlu dipasang; `npm run dev` untuk Next.js (3000), `npm run prototype` untuk prototype (4173), `npm run check` untuk pemeriksaan. Hentikan dev sebelum `npm run build`; lalu `npm start` untuk memeriksa build produksi. Detail ada di README.

## Checkpoint implementasi — Robotics study, 23 Oktober 2026

- Layout dua kolom/bola diganti scene satu viewport di belakang konten editorial. Navigasi dekat headline; About diringkas memakai fakta pemilik, font Libertinus Serif/Sans lokal dan daftar pengalaman yang sudah diketahui. Tiga koleksi tetap empty state jujur.
- Model robot ROS-Industrial ABB IRB 52 dikurasi dan dikonversi dari tujuh mesh STL/offset URDF menjadi GLB 1.550.104 byte, 26.060 triangle, tanpa tekstur. Lisensi Apache-2.0, notice sumber, font OFL dan script reproduksi disimpan; lihat manifest. Meja, kamera pengamatan, gripper ilustratif, kabel dan blok kalibrasi dibuat dalam kode.
- Pose/komposisi diam ditinjau pada desktop, tablet dan mobile sebelum melanjutkan motion. Framing tablet yang memotong robot dan kontrol mobile yang menimpa pengalaman sudah diperbaiki. Ini kandidat untuk tinjauan pemilik, belum persetujuan visual akhir.
- Engine aktif `create-workshop-scene.ts`: satu renderer/kamera antarroute, model di-load dinamis dengan pembatalan/race guard, lighting/bayangan, gerak sendi kecil, ASCII lokal eksplisit, keyboard/orbit/reset, pause/reduced motion, static mode persisten dan manual retry.
- Poster desktop/tablet/mobile berasal dari render scene yang sama tanpa UI/scrim. Caption/tools mengikuti alur dokumen mobile; pause/hide text tetap mudah dicapai. Tanpa JS/WebGL atau model gagal, konten dan poster tetap tersedia; kontrol yang tidak didukung disabled.
- SplitText registry awal disederhanakan menjadi reveal kata singkat memakai GSAP yang sudah ada, CSS biasa, SSR terlihat dan nama aksesibel utuh. Pause/reduced motion menyelesaikan reveal ke teks terbaca. Route entrance/fade scene/respons kontrol memakai CSS; tidak memasang engine/komponen baru dari 21st.
- Build final lulus: TypeScript, lima tes dan syntax prototype, kompilasi/prerender. Browser produksi lulus: empat route/reflow 320–1440, keyboard/focus, pause/typing, reduced motion dinamis, tanpa JS/WebGL, piksel pause/play/reset, 20 pergantian route, context loss/retry, GLB gagal dan static saat model masih loading. Tidak ada page error; detail di laporan QA.
- Probe produksi Chromium lokal 390×844: **27,5 fps** pada sampel 2 detik; **0 render tambahan** saat paused/simulated hidden. Belum mewakili ponsel fisik. Draft marker tidak ditemukan pada HTML/RSC/static JS hasil build.
- Source lint: 0 FAIL/0 WARN, dengan pengecualian eksplisit tiga scrim netral di atas scene. Inspector generik: **2 FAIL, 3 WARN** (palet aksen/foto; tanpa video, judul ringkas, jumlah motion). Tidak mengklaim audit desain sepenuhnya lulus; keputusan warna/komposisi pemilik diprioritaskan dan tidak menambahkan foto/karya palsu untuk memenuhi meter.
- 21st CLI search masih meminta login. Review eksternal 21st ditolak auto-review karena potensi pengiriman source ke pihak ketiga; diganti review lokal, tanpa mengirim source. Tidak deploy, commit, integrasi CMS/admin/ManimGX, atau dependency runtime baru pada iterasi ini.
- Preview dev dipulihkan di http://127.0.0.1:3000/projects setelah QA; server produksi sementara dan browser QA ditutup. Jalankan ulang dengan `npm run dev` jika proses preview berhenti.

### Pekerjaan berikutnya

Daftar ini adalah backlog sebelum jeda; kini didahului brainstorming konsep pada checkpoint teratas dan tidak dikerjakan otomatis.

1. Pemilik meninjau kandidat visual About/Projects desktop/mobile. Kurasi model/material/pose dan komposisi sesuai masukan konkret sebelum menambah scene lain.
2. Uji ponsel fisik, zoom manual/screen reader, browser lain, loading/performa/CLS dan profil GPU jangka panjang. Budget ≥30 FPS mobile belum dibuktikan; pertimbangkan quality tier setelah pengukuran perangkat nyata.
3. Kurasi frasa typing serta karya/tulisan/cabinet nyata dan kontribusinya; lengkapi schema case study/metadata saat materi tersedia. Empat scene kompleks, Supabase/admin/ManimGX dan deploy tetap ditunda.

## Tambahan pemilik — motion yang menyatu, 23 Oktober 2026

- Clarissa Builds tetap acuan utama komposisi, suasana dan tipografi. React Bits serta 21st.dev digunakan untuk mencari kandidat animasi/komponen yang mendukung arah tersebut, bukan mengganti desain dengan gaya default katalog.
- Pemilik menginginkan pengalaman seamless: transisi halaman, pergantian poster/scene, kemunculan konten dan respons navigasi memakai ritme/easing yang konsisten. Rencana motion dan batasnya dicatat di PRD §7.5.
- Dokumentasi resmi React Bits ditinjau: Split Text dan Fade Content menjadi kandidat awal. Katalog publik 21st.dev ditinjau; pencarian metadata via CLI gagal karena belum login (`Not signed in`). Belum memilih/memasang komponen 21st dan tidak menjalankan login otomatis.
- Pada saat pencatatan awal SplitText/GSAP belum terintegrasi; status tersebut sudah digantikan checkpoint implementasi di atas.
- [x] Buat satu contoh motion terintegrasi: pembukaan singkat, perpindahan route dan transisi poster/scene, dengan pause/reduced motion, konten tanpa JS dan navigasi cepat tetap benar.
- [x] Adaptasi SplitText untuk CSS biasa, teks SSR/nama aksesibel, resize, pause global dan perubahan reduced motion. Tes browser lulus; pembaca layar nyata masih perlu diuji.

## Rencana desain ulang — 22 Oktober 2026

- Pemilik menilai desain/background masih jauh dari Clarissa Builds, terutama kualitas scene robotics pada Projects. Iterasi bola titik dan layout dua kolom dihentikan sebagai arah visual; implementasinya tetap merupakan studi teknis yang dapat dijalankan.
- Arah komposisi berikutnya: scene memenuhi viewport di belakang konten HTML, kolom editorial ringkas, navigasi dekat pembukaan, teks hangat dan ruang baca yang tenang. Kualitas komposisi diperiksa terhadap referensi, bukan hanya skor inspector atau tes fungsional.
- Tinjauan visual terbatas halaman Projects referensi mengonfirmasi lantai grid perspektif, robot beroda di kiri, lengan robot di meja di kanan, objek kecil di kejauhan, dan bayangan yang memberi kedalaman. Tidak dilakukan REA ulang atau pembacaan bundle besar. Screenshot tinjauan disimpan di `analysis/reference-projects-*.png`.
- **Usulan, belum diputuskan pemilik:** ruang uji robotics redup dengan satu lengan robot di meja kerja sebagai objek utama. Model/aset, posisi kamera dan pencahayaan perlu dibuktikan dahulu; tidak otomatis menyalin robot, Voyager atau aset referensi. Scene ilustratif tidak boleh dipresentasikan sebagai karya nyata pemilik.
- Pada langkah ini hanya dokumentasi dan tinjauan referensi; kode tampilan/scene belum diubah. Rencana terperinci dan kriteria penerimaan ada di PRD §7.4.

### Urutan berikutnya untuk visual

- [x] Pilih kandidat model berlisensi jelas; sumber/lisensi/atribusi/kualitas/ukuran dicatat di manifest aset.
- [x] Buat komposisi diam desktop dan mobile memakai kandidat aset nyata, lantai, meja, material, cahaya dan teks HTML. Projects menjadi tolok ukur background; About mengikuti arah editorial yang sama.
- [x] Tinjau screenshot diam sebelum animasi; perbaiki framing tablet dan posisi kontrol mobile. Tinjauan ini oleh agent, bukan persetujuan akhir pemilik.
- [x] Integrasikan satu kandidat scene dengan pause, reduced motion, static fallback, keyboard, cleanup dan scroll mobile untuk dapat diperiksa pemilik.
- [x] Tambahkan gerak halus/ASCII lokal dan jalankan build, browser serta probe render. Variasi scene empat halaman tetap ditunda.
- [ ] Dapatkan masukan visual pemilik terhadap kandidat hasil implementasi ini.

## Riwayat — Signal study 3D

### Persiapan komponen teks — 23 Oktober 2026

- React Bits `SplitText-TS-TW` ditambahkan ke `src/components/SplitText.tsx`, dengan dependency `gsap` dan `@gsap/react` serta konfigurasi registry `components.json`. Instalasi dependency dilakukan langsung dan source registry disimpan setelah subprocess `shadcn add` gagal di lingkungan npm/Windows ini.
- `npm run check` lulus: TypeScript, 4 tes konten/matematika scene dan syntax prototype. Komponen belum dipasang pada halaman; tidak ada perubahan visual atau pemeriksaan browser/build baru.
- Integrasi berikutnya harus menangani styling utility Tailwind (aplikasi masih CSS biasa), pause global, perubahan reduced motion dan teks yang tetap terlihat tanpa JavaScript. Source registry awal menyembunyikan teks sampai animasi siap; jangan pakai langsung untuk headline produksi sebelum fallback diperbaiki.

- Three.js yang sudah ada kini dirender secara client-only/dynamic import, dengan SVG statis lebih dulu. Bola 2.400 titik, lighting, gelombang dan marker orbit; ilustrasi konseptual, bukan simulasi ilmiah.
- Explore view mengaktifkan drag/arrow keys dan tombol rotate/reset. Mobile tetap scroll/pinch-first hingga Explore dipilih. Escape mengembalikan fokus ke kontrol.
- ASCII canvas hanya pada patch lokal dari proyeksi titik; SVG ASCII tetap tersedia tanpa WebGL. Pause menghentikan gerak, bukan inspeksi.
- Hide/show text memakai hidden/inert dan restore focus. Preference static bertahan antar-reload dan mencegah import engine saat dipilih.
- Satu renderer dipertahankan antarroute. Static view/context loss/unmount membersihkan resource, loop, listener, observer, control, canvas dan context; retry manual tersedia.
- Loop dibatasi sekitar 30 fps, berhenti saat paused/offscreen/document hidden. Probe produksi Chromium lokal 390×600: 28,1 fps pada sampel 1,2 detik; 0 draw tambahan dalam interval paused/offscreen/simulated hidden. Belum mewakili ponsel fisik.
- Build produksi terbaru lulus dengan TypeScript, 4 tes dan syntax prototype. Smoke umum dan tes WebGL aktual lulus (piksel pause/play, orbit/reset, focus, reuse renderer, context loss/retry, WebGL blocked, touch emulation); tidak ada page error.
- Render desktop diperbesar, lighting dan ukuran titik diperbaiki, skala tipografi desktop disederhanakan menjadi lima ukuran. Screenshot akhir dan mode inspeksi/fokus ada di `.taste-skill/scene3d-production/`.
- Audit desain produksi: **4 FAIL, 1 WARN** (foto, jumlah elemen bergerak, ruang kosong, focal point tablet; tanpa video). Focal point desktop dan warning jumlah font sudah beres. Jangan menyebut audit visual sepenuhnya lulus.
- Tidak ada dependency runtime baru; hanya `@types/three` dev yang cocok versi Three. Audit instalasi 0 vulnerabilities. Tidak deploy.

## Riwayat — studi SVG sebelum engine 3D

- Kandidat visual perdana: medan sinyal berbentuk bola titik, gelombang dan orbit pengamatan; ilustrasi konseptual, bukan simulasi ilmiah atau engine 3D final.
- Inspeksi ASCII berupa patch terbatas pada objek. Hover memberikan preview; tombol bekerja dengan klik, keyboard dan tap, termasuk saat motion paused. Teks utama tidak ikut berubah.
- Komposisi About lebih ringkas. Di mobile, objek kini berada setelah intro dan sebelum pengalaman; footer menutup seluruh konten.
- Tanpa JavaScript, SVG statis tetap ada dan kedua kontrol disabled. Mode inspeksi direset saat route berubah. Tidak ada dependency baru atau React state update per frame.
- Build produksi lulus: TypeScript, 3 tes konten, syntax prototype, kompilasi/prerender. Smoke produksi diperluas untuk hover, keyboard, touch emulation, clip ASCII, reset route dan urutan mobile; lulus tanpa page error.
- Tidak ada overflow pada 320/390/768/1440 px. Penanda draft contoh tetap tidak ditemukan pada HTML/RSC/JS hasil build.
- Screenshot desktop/tablet/mobile, mode ASCII dan Projects mobile ditinjau di `.taste-skill/signal-study/`. Inspector sekarang **3 FAIL, 1 WARN**, turun dari 4 FAIL; empty-screens tidak muncul lagi. Foto, focal point dan jumlah gerak tetap belum memenuhi meter skill.
- Objek ini kandidat implementasi untuk ditinjau, bukan keputusan final pemilik. WebGL/drag/reset/hide-text tetap tahap berikutnya.

## Checkpoint fondasi — sebelum iterasi Signal study

- Kondisi awal Git bersih pada commit b24aab8 (WebsitePortofolio - Base); perubahan lanjutan belum di-commit oleh agent.
- Fondasi Next.js/React/TypeScript/CSS, empat halaman, JSON dan Markdown/MDX, empty state, SVG fallback dan prototype lama dipertahankan.
- Perbaikan: overflow SVG tablet 6 px, freeze typing ketika pause, explicit Play saat reduced motion aktif, tombol disabled sebelum hydration/tanpa JS, judul mobile, ikon lokal dan marker smooth-scroll Next.js.
- Build produksi terbaru lulus beserta TypeScript, 3 tes konten dan syntax check prototype. Browser smoke produksi lulus tanpa page error.
- Empat halaman terverifikasi HTTP 200, 404 benar, navigasi klik/keyboard, skip-link/focus, pause persisten, perubahan reduced motion, layout typing stabil, tanpa JS/WebGL dan tanpa overflow pada 320/390/768/1440 px.
- Penanda draft contoh tidak ditemukan pada output HTML/RSC/aset browser; route draft dan akses raw content/analysis memberi 404 di aplikasi Next.js.
- Screenshot About desktop/tablet/mobile serta tiga empty state desktop/mobile sudah dibuka dan ditinjau. Artefak lokal: .taste-skill/resume/ dan .taste-skill/collections/.
- Prototype lama terbuka lewat npm run prototype, UI dan canvas terpasang. Favicon prototype 404; seluruh kontrol fisika belum diuji ulang.

## Belum selesai dan batas verifikasi

- Inspector desain terbaru **2 FAIL, 3 WARN**; penerimaan visual pemilik masih terbuka. Angka **4 FAIL, 1 WARN** di riwayat Signal study bukan status scene aktif. Pengukuran gambar/gerak skill tidak menggantikan pemeriksaan canvas dan kebutuhan editorial pemilik.
- Zoom manual, screen reader nyata, mobile fisik, lintas browser, Lighthouse/CLS dan profil memori GPU berkepanjangan belum diuji. FPS lokal singkat sudah diukur; bukan bukti performa perangkat nyata.
- Belum ada project/artikel/cabinet published nyata. Schema project lengkap, case study, artikel interaktif, sitemap/canonical/OG, kontak/CV tetap terbuka. Error shader ditangani tetapi belum diinjeksi khusus saat QA.
- Turbopack sebelumnya gagal membuat junction Windows; dev/build memakai Webpack yang berhasil. Browser/build memerlukan izin proses sesuai lingkungan sandbox Windows. Tidak deploy; Supabase/admin/ManimGX tetap di luar scope.

## Berikutnya

Ikuti checkpoint jeda di awal dokumen: brainstorming personal → keputusan konsep → permintaan eksekusi kembali. Backlog visual/QA/konten di bawahnya dipertahankan sebagai bahan, bukan instruksi memulai implementasi saat dijeda. Jangan mengulang fondasi atau menjalankan REA ulang tanpa pertanyaan khusus.

## Menjalankan kembali

~~~powershell
cd 'C:\Users\abdie\OneDrive\Documents\ChatGPT\Website Portofolio'
npm run dev
~~~

Buka http://127.0.0.1:3000. Bila dependency belum ada/berubah, jalankan npm ci terlebih dahulu. Pemeriksaan: npm run check. Build: npm run build, lalu npm start untuk hasil produksi. Prototype lama: npm run prototype di http://127.0.0.1:4173. Hentikan dev sebelum build pada checkout yang sama. Smoke browser tersimpan di tests/browser-smoke.js; cara menjalankan ada di laporan QA.

Pada akhir checkpoint fondasi sebelumnya server dihentikan. Sesudah iterasi Signal study, preview dev di http://127.0.0.1:3000 dipulihkan karena sudah aktif saat pekerjaan dimulai. Server produksi sementara dan browser smoke ditutup setelah QA.

## Sudah tersedia

- [x] Analisis REA dan dokumentasi website referensi di `analysis/`.
- [x] Prototype lokal lensing; ini studi visual, bukan portofolio produksi.
- [x] PRD lengkap dan arah Digital Observatory dengan nuansa laboratorium digital.
- [x] Panduan kerja agent, roadmap ringkas dan petunjuk menjalankan prototype.

## Berikutnya — fondasi dan arah visual

- [x] Buat fondasi Next.js + React + TypeScript dan styling, dengan prototype/evidence tetap dapat dirujuk.
- [x] Buat shell empat halaman: About, Projects, Writing, Cabinet. Route detail writing tersedia; detail project menunggu materi nyata.
- [x] Implementasi About responsif dengan nama lengkap, intro stabil dan typing; desktop/tablet/mobile ditinjau.
- [ ] Kurasi frasa typing; gunakan `a/an` yang benar dan jangan mengklaim role yang belum disetujui.
- [x] Implementasikan scene perdana Signal study dan satu interaksi ASCII/pixel lokal; hanya satu engine visual.

## Konten dan fitur inti

- [x] Buat schema dasar, file contoh draft dan content access layer untuk profil, pengalaman, projects, writing dan cabinet. Schema case study/project lengkap masih berikutnya.
- [x] Siapkan renderer Markdown/MDX lokal tepercaya dan route writing; komponen interaktif nyata belum dibutuhkan/diuji end-to-end.
- [ ] Buat tampilan project dan case study teknis/kreatif dengan kontribusi individual yang jelas.
- [x] Buat daftar/detail writing serta daftar cabinet, termasuk empty state yang jujur.
- [ ] Tambahkan data nyata pemilik: uraian pengalaman, karya, media, kontak dan CV ketika tersedia.
- [x] Draft contoh tidak ikut route, HTML/RSC atau bundle publik; terverifikasi selector, HTTP 404 dan scan build. Aset draft baru tetap harus di luar public/.

## Scene dan interaksi

- [x] Buat studi visual client-side ringan dengan SVG statis dan inspeksi ASCII lokal.
- [x] Integrasikan satu engine WebGL/3D Signal study dengan poster/static fallback, dynamic import dan cleanup.
- [x] Tambahkan pause/play, reduced motion, reset view dan hide/show text dengan focus yang benar; diverifikasi di Chromium lokal.
- [x] Tambahkan typing/deleting dengan deskripsi aksesibel stabil, pause global dan reduced-motion fallback; browser smoke lulus.
- [x] Uji efek ASCII/pixel terlokalisasi pada studi SVG: hover, keyboard, touch emulation, pause dan reset route; teks utama tetap bersih.
- [x] Uji emulasi input mobile, resize, context loss/retry, route cepat, pelepasan canvas dan pengendalian render loop.
- [ ] Uji ponsel fisik dan profil memori GPU jangka panjang; belum diklaim lolos dari emulasi.

## Kualitas dan rilis

- [x] Periksa navigasi/deep links, keyboard, reflow 320–1440 px, reduced motion dan fallback tanpa JS/WebGL di Chromium.
- [ ] Uji zoom browser manual, pembaca layar nyata, browser lain dan perangkat mobile fisik.
- [ ] Ukur bundle, loading, layout shift dan FPS pada perangkat uji; catat kondisi serta hasil nyata.
- [ ] Siapkan metadata, sitemap, 404, tautan kontak/CV dan aset yang boleh dipublikasikan.
- [ ] Siapkan preview, deployment, domain dan rollback; jalankan smoke test.
- [x] Perbarui README, checklist dan laporan QA sesuai implementasi aktual.

## Opsional setelah fondasi

- Supabase untuk metadata/media/admin jika workflow membutuhkannya; tidak wajib untuk writing MDX.
- Variasi scene tambahan per halaman, artikel interaktif lanjutan, RSS dan analytics minimal.
- ManimGX untuk video penjelasan tertentu jika relevan; tidak diperlukan oleh latar interaktif.

Keputusan yang masih terbuka: penerimaan/kurasi kandidat Robotics study dan komposisi visual, frasa typing akhir, bahasa konten, karya/cabinet, kontak/CV, domain, serta apakah perlu dashboard. Signal study tetap riwayat; Robotics study kini scene aktif. Detail kebutuhan materi ada di PRD §27.
