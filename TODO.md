# TODO — Personal Electronics Lab

Status: **revisi arah ke satu workbench kompak dan fokus objek per halaman**. Pemilik merasa empat meja terlalu berulang. Implementasi empat sudut masih tersimpan sebagai baseline yang harus dikonsolidasikan; jangan menganggapnya komposisi final yang diterima.

## Koreksi komposisi — satu workbench, fokus objek — 24 Oktober 2026

- Pemilik menolak pengulangan banyak meja. Arah berikutnya: satu workbench/ruang kompak, setiap halaman fokus satu objek/kelompok benda dengan POV khusus; overview penuh untuk Home/Hide Text seperlunya. Referensi Hamza dipakai untuk komposisi ruang/fokus kamera; Clarissa tetap suasana hangat/editorial. Runtime empat meja yang ada belum direfaktor pada checkpoint ini; jangan menambah meja/sudut lengkap baru.
- [x] Situs publik https://www.raomuhammadhamza.tech/ ditinjau langsung lewat browser: room overview, Projects/monitor, Experience/kartu pegboard, About/layar robot, serta About portrait. Screenshot lokal di `.taste-skill/lab-views/hamza-*`; tidak mengambil model, tekstur, bundle/source atau menjalankan ulang REA.
- [x] Prinsip yang diambil: satu ruang koheren, satu objek hero per section, benda pendamping sebagai konteks, close/medium framing dan perpindahan kamera antarobjek. Kepadatan props tidak diselesaikan dengan membuat banyak meja lengkap.
- [ ] Konsolidasikan meja yang berulang; gunakan kembali robot/notebook/lampu/pegboard yang sudah dibuat. Kurangi furniture/dekorasi duplikat dan panel baca generik yang menutupi konteks objek.
- [ ] Rancang POV per route secara khusus (arah, jarak/lensa, target, ruang konten) dan portrait tersendiri. Siluet objek utama terbaca, bukan seluruh meja/kaki/dinding mendominasi setiap halaman. HTML/aksesibilitas, navigasi, pause/reduced motion/fallback tetap berlaku.
- [ ] Buktikan ulang Home + Projects desktop/mobile sebagai contoh arah kompak sebelum memperluas komposisi ke About/Experience/Writing/Cabinet. Pemetaan kandidat: About notebook/benda personal; Projects robot+monitor; Experience pegboard; Writing area baca; Cabinet laci.
- Runtime belum diubah pada checkpoint arah ini. Hasil build/QA empat sudut di bawah tetap historis dan tidak membuktikan redesign kompak. Perangkat fisik masih belum diuji.
- Validasi perubahan arah: dokumen/konteks desain disinkronkan, JSON/whitespace diperiksa. Tidak perlu build baru karena hanya dokumen yang berubah. Server dev tetap milik tugas sebelumnya; browser referensi sudah ditutup. Perintah tetap `npm run dev`, `npm run prototype`, `npm run check`, hentikan dev sebelum `npm run build` lalu `npm start`.

## Riwayat About / Experience empat sudut — 24 Oktober 2026

Komposisi beberapa meja pada tahap ini dikoreksi pemilik; kode/QA dipertahankan sebagai baseline, bukan hasil visual final.

- Pemilik mengizinkan kelanjutan rekomendasi dua sudut dengan grafis yang bagus. Gerbang tidak memperluas sudut otomatis di riwayat sebelumnya sudah digantikan izin ini khusus About/Experience.
- [x] Route `/about` dengan meja baca fisik, notebook terbuka, lampu/buku/pensil; identitas/intro/bio dari profile JSON. `/experience` dengan board dokumentasi dan tiga grafis kategori asli; daftar HTML dari published experiences JSON. Tidak mengarang kontribusi, periode, karya, sertifikat, kontak atau tautan.
- [x] Navigasi langsung, active nav dan Home About link menuju route baru; anchor Home lama dipertahankan untuk bookmark. Kamera baca/portrait/overview terpisah, direct URL/history, Hide Text auto-Explore/arrow/reset/Escape dan Show Text/fokus/scroll pulih.
- [x] Satu renderer/ruang untuk empat sudut. Transisi biasa/restore 1,25 detik, perjalanan >14 unit 1,6 detik, overview 1,15 detik; pause/reduced motion langsung ke tujuan. Story corners diam saat idle; robot berhenti di Home/About/Experience serta hidden/reduced/static.
- [x] Props statis dibatch per material, shared palette/tekstur asli dan spotlight statis cached. Builder 347 mesh / 122.418 rendered triangle / 173 geometri / 14 tekstur, tetap di bawah budget lama 350/150.000. Tidak menambah dependency/aset eksternal.
- [x] 24 poster dari delapan pose × desktop/tablet/mobile direkam ulang dari produksi, total 717.670 byte. Tanpa JS/WebGL/static/context loss mengikuti poster route/overview aktif. Grafis tidak memuat data draft/identitas peran ke aset publik.
- [x] Build/check **9 tes lulus**. Enam suite browser produksi lulus tanpa page error: story corners, smoke enam route/reflow320–1440/noJS, kamera/scroll/history, robot motion, lifecycle/context loss/retry dan probe rendering. About/Experience/Home idle berhenti; unit fit empat sudut pada lima rasio. Detail: [QA story](docs/QA-STORY-CORNERS.md).
- [x] Capture delapan pose desktop/tablet/mobile dibuka; source lint About/Experience/Nav/CSS 0 FAIL/0 WARN. Dua belas screenshot inspector final ditinjau. Audit generik About 4 FAIL/2 WARN dan Experience 4 FAIL/3 WARN; warna hangat, scene 3D tunggal, komposisi panel/hero dan idle diam dipertahankan sesuai produk. Detail di QA story; audit belum sepenuhnya lulus.
- [ ] Review pemilik atas framing notebook/lampu dan tiga lembar Experience, serta rasa perjalanan jauh antar-sudut. Render ini kandidat yang sudah bisa diperiksa, bukan penerimaan visual otomatis.
- [ ] QA mobile fisik, Safari/Firefox, screen reader/zoom lengkap, cold-load/CLS, frame pacing/GPU/memory/thermal jangka panjang. Statistik geometri dan cap render tidak menggantikannya.
- [ ] Materi kontribusi nyata, karya/tulisan/koleksi dan kontak/CV; sudut Writing/Cabinet masih lanjutan. Database/admin/ManimGX/deploy ditunda.
- Error fungsional/build yang belum lulus pada pemeriksaan yang dijalankan: tidak ada. Poster baru sempat 404 saat capture dev pertama sebelum dibuat; setelah konversi, seluruh uji produksi termasuk noJS/WebGL blocked lulus.
- Metadata 21st dicari (Impact Experience/editorial lists), lalu memakai Navigation/SplitText/pola HTML proyek. Tidak retrieval kode berbayar/generation/dependency atau review source eksternal. Riwayat pencarian gagal sebelumnya tidak menjadi hasil pencarian tahap ini.
- Menjalankan: `npm run dev` untuk edit; `npm run prototype` untuk studi lama. Hentikan dev sebelum `npm run build`, lalu `npm start` untuk produksi. README mencakup `tests/story-corners-browser.js`; capture `tests/capture-lab-views.js`, konversi `node scripts/prepare-lab-posters.mjs`.
- Akhir sesi: semua perubahan lokal tersimpan; prototype/analysis/studi/model/lisensi dipertahankan. Browser QA ditutup dan server produksi sementara dihentikan; preview dev aktif kembali di http://127.0.0.1:3000/ untuk review `/about` dan `/experience`. Tidak stage/commit/deploy. Jalankan `npm run dev` bila proses sudah berhenti, hentikan sebelum build.

## Riwayat revisi model 3D dan motion robot — 24 Oktober 2026

Pernyataan sudut About/Experience belum diperluas pada bagian ini digantikan checkpoint terbaru.

- Pemilik memberi respons positif pada keseluruhan, lalu meminta bentuk 3D diperbagus dan robot bergerak. Ini menggantikan larangan animasi idle Projects sebelumnya, tanpa memperluas semua sudut otomatis.
- [x] Rig bertingkat turret/bahu/siku/pergelangan/tool; housing tirus, bearing/collar/hub, flange, gripper/pad dan kabel per-link. Baut basis instanced; gripper tetap tegak. Material kayu/enamel/logam, keyboard robotics dan muka/handle laci diperbaiki.
- [x] Motion observasional 16 detik memakai easing halus dan bukaan gripper; bukan demo pick-and-place/fisika atau klaim project. Maksimum render sekitar 30Hz hanya di Projects terlihat dan motion aktif. Tidak rebuild geometry/texture atau React state per frame.
- [x] Pause/reduced motion membekukan pose; tab hidden/route lain/static menghentikan loop/waktu. Transisi kamera sementara menghentikan loop robot, lalu melanjutkan fase. Hanya shadow spotlight robotics diperbarui; shadow Home di-cache. Dispose/context loss membersihkan loop.
- [x] Home tetap idle 0 render tambahan. Inspect ASCII tetap tidak ada; Hide Text langsung orbit/reset/arrow/touch, Show Text/Escape memulihkan baca/fokus/scroll. Dua belas poster baru dari pose istirahat deterministik, total 380.460 byte.
- [x] Build/check produksi lulus **8 tes**; unit menjaga sudut/loop/kelancaran, tool tegak, travel nyata, clearance fixture dan geometri 129 pose. Builder 335 mesh / 107.980 rendered triangle / 161 geometri / 12 tekstur; budget lama tidak dilonggarkan.
- [x] Motion browser produksi membuktikan piksel bergerak dengan kamera tetap, Pause membekukan piksel identik, resume, hidden/Home/reduced/static dan portrait motion/scroll. Lifecycle/context loss/retry/20 route, render probe, kamera dan smoke produksi lulus tanpa page error. Kamera merekam 206 view matrix perantara. Source lint 0 FAIL/0 WARN. Detail: [QA motion](docs/QA-ROBOT-MOTION.md).
- [x] Capture produksi empat pose × desktop/tablet/mobile; model akhir dan poster dibuka. Enam screenshot inspector final diperiksa. Audit visual generik tetap 4 FAIL/4 WARN (palet hangat, jumlah gambar, komposisi panel/robot, hitungan motion DOM, footage/judul/subjudul/gap portrait); detail dan batas di QA motion. Audit belum sepenuhnya lulus.
- [ ] Review pemilik atas bentuk/material/kecepatan/jarak gerak robot. Model masih stilisasi prosedural; respons positif sebelumnya bukan penerimaan otomatis atas revisi ini.
- [ ] Uji perangkat ponsel fisik, Safari/Firefox, screen reader/zoom, cold-load/CLS, frame pacing dan GPU/memory/thermal jangka panjang. Render cap bukan jaminan performa semua perangkat.
- [ ] Berikutnya setelah review: QA perangkat nyata dan kurasi materi Projects/Experience/Writing/Cabinet/kontak/CV. Sudut lain belum diperluas, database/admin/ManimGX/deploy tetap ditunda.
- Error build/fungsional yang masih terbuka pada suite yang dijalankan: tidak ada. Uji batas awal menangkap roundoff grip negatif sangat kecil (easing di-clamp); tes piksel awal menangkap overlay tombol, helper scene-only diperbaiki tanpa melonggarkan assertion. Batas audit visual/perangkat fisik tetap terbuka.
- Perintah: `npm run dev` untuk edit/preview; `npm run prototype` untuk studi lama. Hentikan dev sebelum `npm run build`, lalu `npm start` untuk produksi. Urutan QA pada README sekarang mencakup `tests/robot-motion-browser.js`; capture lalu `node scripts/prepare-lab-posters.mjs`.
- Seluruh perubahan lokal disimpan, prototype/analysis/studi/aset/lisensi dipertahankan; tidak menambah dependency, stage/commit atau deploy.
- Akhir sesi motion: browser QA ditutup, server produksi sementara dihentikan dan preview **dev aktif kembali** pada http://127.0.0.1:3000/. Jalankan `npm run dev` bila proses sudah berhenti. Build/check 8 tes dan lima suite fungsional browser produksi lulus; audit visual/perangkat nyata tetap terbuka.

## Riwayat Projects robotics statis + Hide Text otomatis — 24 Oktober 2026

Aturan tanpa animasi/render idle untuk Projects pada checkpoint ini digantikan revisi motion terbaru; Home tetap event-driven.

- [x] Projects sekarang menuju meja robotics terpisah dalam lab yang sama, dengan arm/gripper, fixture/sample cube, monitor diagram, storage dan notebook asli. Bukan hanya pemindahan sudut kamera ke instrumen Home, dan bukan project milik pemilik.
- [x] Inspect ASCII dihapus dari UI/engine aktif dan overlay canvas. Prototype, studi/model/lisensi lama serta perubahan lokal dipertahankan. Satu canvas/renderer aktif; string tombol tidak ada pada bundle produksi.
- [x] Hide Text langsung mengaktifkan drag/arrow/reset termasuk touch; input saat tween dapat langsung mengambil alih. Show Text/Escape dari dalam/luar canvas mengembalikan pose, HTML/fokus dan posisi baca. Saat teks terlihat, native scroll dan Explore eksplisit tetap tersedia.
- [x] Overview mengikuti bounds workspace aktif, dengan framing portrait sendiri. Route/restore 1,25 detik dan overview 1,15 detik; pause/reduced motion langsung ke tujuan. Tanpa animasi/render idle. Empat pose/12 WebP lokal untuk SSR/static/context loss/no-WebGL.
- [x] Panel Projects mobile/tablet portrait dipindah ke bawah hero robot; kontrol scene tablet mengikuti alur halaman agar tidak menumpuk teks. Empty state tetap jujur. Tidak menambah dependency atau mengunduh model.
- [x] Build produksi/check lulus 7 tes. Smoke/lifecycle/render probe/kamera produksi lulus tanpa page error; kamera final mengamati 218 view matrix perantara, direct Projects, immediate drag, Escape global, reset, retarget/history, scroll, pause/reduced motion dan fallback. Idle 0 render tambahan; budget geometri tidak dilonggarkan. Detail/reproduksi: [QA robotics](docs/QA-ROBOTICS-BAY.md) dan [ASSETS](docs/ASSETS.md).
- [x] Capture produksi empat pose × desktop/tablet/mobile dan poster scene-only direkam; hasil akhir dibuka. Source lint 0 FAIL/0 WARN. Audit visual generik masih 4 FAIL/4 WARN; palet hangat, scene WebGL tunggal, komposisi panel/robot dan idle diam dipertahankan sesuai produk. Batas audit dicatat, bukan dianggap lulus.
- [ ] Review pemilik atas meja robotics, framing/proporsi robot dan rasa transisi. Material/model prosedural masih dapat diperbaiki berdasarkan masukan; bukan klaim setara referensi.
- [ ] QA mobile fisik, Safari/Firefox, screen reader/zoom, cold-load/CLS, frame pacing dan GPU/memory jangka panjang. Pengujian Chromium/emulasi belum menjawabnya.
- [ ] Sudut tersendiri About/Experience/Writing/Cabinet, materi karya/tulisan/koleksi nyata dan kontak/CV tetap berikutnya. Tidak memperluas semua sudut otomatis; Supabase/admin/ManimGX dan deployment ditunda.
- Error fungsional/build yang belum lulus: tidak ada pada suite yang dijalankan. Audit desain di atas dan QA perangkat nyata tetap terbuka. Poster overview Projects yang belum tersedia saat uji dev awal sudah dibuat dan lulus suite produksi; tidak ada assertion dilonggarkan.
- Berikutnya: review visual Home → Projects dan Hide Text pada preview; koreksi berdasarkan masukan, lalu QA perangkat nyata/konten sebelum sudut lain.
- Menjalankan kembali: `npm ci` bila dependency belum tersedia; `npm run dev` di port 3000, `npm run prototype` untuk studi lama. Hentikan dev sebelum `npm run build`, lalu `npm start` untuk hasil produksi. Browser QA/capture: urutan di README, lalu `node scripts/prepare-lab-posters.mjs`.
- Akhir sesi: seluruh perubahan tersimpan lokal; tidak stage/commit/deploy. Browser QA ditutup, server produksi sementara dihentikan dan preview dev kembali aktif di http://127.0.0.1:3000/. Jalankan `npm run dev` bila proses sudah berhenti; hentikan sebelum build.

## Riwayat Home → Projects pada instrumen / overview awal — 24 Oktober 2026

Perilaku Explore eksplisit pada overview dan sembilan poster pada bagian ini digantikan checkpoint terbaru.

- Pemilik mengizinkan satu perpindahan lengkap Home → Projects dan Hide Text dengan POV lebih tinggi untuk melihat meja 3D. Scope ini menggantikan gerbang Home-only; sudut lain belum otomatis dikerjakan.
- [x] Satu renderer/ruang untuk pose Home, Projects dan overview. Projects menyorot instrumen/area eksperimen, dengan HTML/empty state nyata. About/Experience tetap anchor; Writing/Cabinet belum mendapat sudut sendiri.
- [x] GSAP menggerakkan kamera/target/FOV/fog bersama dan dapat retarget dari pose saat ini. Direct load langsung pada tujuan. Resize, pause/reduced motion dan tab hidden menyelesaikan transisi lalu diam. Tidak ada idle animation.
- [x] Hide Text membuka overview desktop/portrait; Show Text/Escape memulihkan sudut aktif, HTML/fokus dan posisi baca. Drag tetap melalui Explore eksplisit, termasuk pada overview.
- [x] Sembilan poster Home/Projects/overview untuk SSR/tanpa WebGL/static/context loss. Capture `tests/capture-lab-views.js`, konversi `node scripts/prepare-lab-posters.mjs`.
- Unit check kini tujuh tes, termasuk pose/fit kamera. QA matriks/transisi/history/scroll dan batasnya di [QA kamera](docs/QA-LAB-CAMERA.md). QA props lama bukan bukti gerak kamera baru.
- [x] Build, tujuh tes dan smoke/lifecycle/probe/kamera produksi lulus; page error kosong. Uji final merekam 142 view matrix perantara, direct Projects tanpa pose Home, retarget, hidden tab, pause/reduced motion, scroll restore, static/retry dan touch/no-WebGL. Idle tetap 0 render tambahan. Inspector Projects masih 4 FAIL/3 WARN; perangkat nyata belum diuji.
- Berikutnya: review perpindahan Home → Projects/overview, QA perangkat nyata dan materi karya. Tidak menambah dependency/database/admin, mengubah staging, commit atau deploy.
- Akhir pengerjaan: browser QA ditutup, server produksi sementara dihentikan, preview dev dipulihkan pada http://127.0.0.1:3000/. Seluruh perubahan tersimpan lokal; `npm run dev` untuk kembali mengedit, hentikan sebelum `npm run build`/`npm start`. Tujuh tes dan seluruh suite fungsional produksi lulus; audit visual/perangkat nyata tetap terbuka.

## Riwayat perbaikan bentuk item Home — 24 Oktober 2026

- [x] Keyboard diganti layout ANSI 60% lima baris/61 keycap instanced, modifier/spacebar berukuran benar dan legenda lokal. Tombol Esc tidak lagi menumpuk dua mesh; baris bawah tidak saling bertabrakan.
- [x] Spiral kabel mendapat sampling yang memadai, arah lilitan yang terbaca, konektor dan ujung yang terhubung. Kabel probe mengikuti soket instrumen; ASCII memakai posisi instance keycap aktual.
- [x] Instrumen mempunyai casing/panel/bezel, knob berpenunjuk, soket, ventilasi dan kaki. Dudukan monitor diletakkan di atas meja. Notebook memiliki cover/halaman/spine/elastic; alat pegboard berbentuk obeng, bukan balok; kepala lampu dan kanal lampu rak diperbaiki.
- [x] Bevel kotak dibuat sesuai dimensi asli dan di-cache, sehingga tidak terdistorsi dari skala unit cube. Rasio tekstur pegboard/mat diperbaiki agar lubang/grid tidak melebar.
- [x] Check/build lulus enam tes, termasuk finite geometry, keycap tidak beririsan, benda tidak menembus meja/mat dan sampling spiral. Builder berisi 254 mesh, 71.432 triangle yang dirender dan 9 tekstur prosedural. Batas tes bukan bukti performa ponsel fisik.
- [x] Smoke/lifecycle/probe browser produksi lulus tanpa page error: reflow 320–1440, keyboard/touch, ASCII, context loss/static/retry dan tanpa JS/WebGL. Idle 0 render tambahan. Screenshot props dan poster responsif direkam ulang.
- Source lint lulus; inspector props masih 4 FAIL/3 WARN pada kategori audit generik yang dijelaskan di QA Home. Framing/material belum diterima final oleh pemilik; QA perangkat nyata tetap terbuka.
- Kamera duduk dan posisi intro yang sudah diturunkan dipertahankan. Tidak menambah dependency, mengunduh model/tekstur, memperluas sudut lain, commit atau deploy. Aset/prototype/analysis/lisensi tersimpan.
- Berikutnya: review bentuk/material Home dari render terbaru dan lanjutkan QA perangkat nyata; sudut/route lain tetap mengikuti review. Perintah tidak berubah; hasil detail di QA Home dan ASSETS.
- Akhir pengerjaan props: browser QA ditutup, server produksi sementara dihentikan, preview dev dipulihkan pada http://127.0.0.1:3000/. Perubahan tersimpan lokal; staging tidak diubah.

## Revisi Home — sudut pandang duduk, 24 Oktober 2026

- Penyesuaian lanjutan sesuai review: seluruh blok intro diturunkan 5svh pada desktop/tablet dan 6svh pada mobile; scrim baca ikut bergeser. Kamera/geometri/poster tetap sama. Pekerjaan berikut yang diusulkan: pematangan Home, lalu satu sudut Projects beserta transisi singkat setelah framing diterima; belum memulai perluasan tersebut.
- Verifikasi penyesuaian posisi: build/check dan smoke produksi lulus, tanpa overflow 320–1440 atau page error. Screenshot desktop/mobile dibuka; preview dev dipulihkan. Log `intro-lower-*`; tidak mengulang audit generik atau lifecycle engine karena engine tidak berubah.

- Pemilik menilai fondasi visual sudah cocok, lalu meminta tulisan berada pada pegboard dan pengalaman seperti duduk menggunakan meja. Permintaan melanjutkan diterima; review ini bukan izin memperluas sudut/halaman lain.
- [x] Kamera depan setinggi mata; pegboard menjadi bidang intro, keyboard/kabel/cutting mat di foreground. Kaki meja dan alas panggung tidak masuk framing utama. Kamera portrait disesuaikan tanpa mengubah geometri/aset atau menambah dependency.
- [x] Intro mobile dipindah ke bidang pegboard. Navigasi mendapat latar untuk kontras; kontrol scene Home dipadatkan, panel Explore membungkus pada layar sempit. HTML, pause/reduced motion, static/retry dan native scroll tetap dipertahankan.
- [x] Poster baru dari scene yang sama menggantikan fallback sebelumnya; kode/model studi lama dipertahankan. Screenshot dan log revisi memakai prefix `seated-` di `.taste-skill/personal-lab/`.
- [x] Build/check, smoke dan lifecycle produksi lulus tanpa page error; reflow 320–1440 termasuk panel Explore pada 320/390; probe idle mencatat 0 render tambahan. Source lint lulus. Inspector generik tetap 4 FAIL/3 WARN; QA perangkat nyata dan penerimaan framing belum selesai.
- [ ] Review pemilik terhadap framing duduk desktop/mobile. Konten panjang tetap mengikuti document flow; teks utama masih HTML di depan scene, bukan huruf mesh 3D yang mengikuti orbit.
- Berikutnya setelah review: koreksi Home bila diperlukan sebelum sudut/route dan transisi kamera lanjutan. Belum ada database/admin, karya/kontak/CV baru, commit atau deploy.
- Perintah tetap: `npm run dev`, `npm run prototype`, `npm run check`; hentikan server sebelum `npm run build`, lalu `npm start`. Hasil QA revisi di [QA Home](docs/QA-HOME-LAB.md).
- Akhir revisi: sesi browser QA ditutup, server produksi sementara dihentikan dan preview dev kembali aktif di http://127.0.0.1:3000/. Tidak mengubah staging; seluruh perubahan tetap lokal.

## Riwayat bukti visual Home awal — 23 Oktober 2026

- [x] Home nyata di aplikasi: meja/rak/pegboard, instrumen generik, lampu, mechanical keyboard, kabel, cutting mat dan catatan. Geometri/tekstur dibuat dalam kode; foto referensi tidak menjadi aset produksi. Tidak menambah dependency.
- [x] Intro Inggris dan dua kandidat typing dari brief; nama lengkap serta tiga pengalaman nyata tetap tersedia. Navigasi langsung enam label; About/Experience sementara anchor Home, bukan route/sudut baru. Koleksi kosong tetap jujur; kontak/CV tidak dikarang.
- [x] Kamera portrait khusus dan poster desktop/tablet/mobile dari render yang sama; static/retry, Explore/drag/arrow/reset/Escape, Hide/Show text, pause/reduced motion dipertahankan. Scene 3D diam saat idle; motion detail belum ditambahkan.
- [x] Check/build produksi, smoke empat route/reflow 320–1440, lifecycle/fallback/context loss dan probe render dijalankan. Detail hasil serta audit visual yang belum lulus ada di [QA Home](docs/QA-HOME-LAB.md). QA studi lama tidak dipakai sebagai bukti redesign.
- [x] Screenshot aktual Home desktop/tablet/mobile direkam di `.taste-skill/personal-lab/`. Koreksi QA: grid nav mobile, intro tablet dijauhkan dari rak, judul/reveal tetap terbaca tanpa fade awal.
- [ ] Review pemilik atas komposisi, material, kehangatan cahaya dan framing Home. Ini gerbang berikutnya sebelum memperluas sudut/halaman; konsep yang disetujui belum berarti render disetujui.
- [ ] Setelah review: revisi Home sesuai masukan, kemudian rancang sudut dan koordinasi kamera antarroute. About/Experience terpisah, konten karya/tulisan/cabinet, kontak/CV, motion lanjutan dan QA perangkat nyata belum selesai.
- Catatan QA: satu timeout saat Enable 3D pada rangkaian produksi yang bersamaan dengan inspector; uji lifecycle ulang di sesi bersih lulus tanpa melonggarkan assertion. Penyebab timeout belum dipastikan, bukan bukti memory/GPU jangka panjang aman.
- Audit visual generik final masih **4 FAIL/3 WARN** (palet hangat, jumlah foto, motion, perhitungan isi DOM/gap, footage dan ambang subjudul); detail/penjelasan di QA Home. Late-title sudah diperbaiki dan tidak muncul lagi. Penerimaan pemilik dan QA perangkat nyata tetap terbuka.
- Perintah kembali: `npm ci` bila perlu, `npm run dev`; prototype `npm run prototype`. Hentikan server sebelum `npm run build`, lalu `npm start`. Panduan QA/capture terbaru ada di README dan QA Home. Tidak commit/deploy atau mengubah staging.
- Akhir sesi: browser QA/referensi ditutup, server produksi sementara dihentikan, preview **dev dipulihkan pada http://127.0.0.1:3000/** untuk review Home. Screenshot yang disimpan berasal dari produksi, bukan overlay dev.

- Pemilik mengirim prompt lengkap yang mengaktifkan kembali implementasi dan menggantikan arahan visual lama yang bertentangan. Tidak lagi menunggu izin melanjutkan atau mengulang brainstorming.
- Git diverifikasi pada HEAD `3e9f8c3` (Prototype pertama); perubahan dokumen/konteks desain lokal dan referensi foto dipertahankan. Tidak reset/clean/stash/stage/commit. Preview port 3000 sudah berjalan dari repository yang sama.
- Baca REDESIGN-LAB, PRD §2.5/§7.7/§16.5 dan empat foto lokal. Foto hanya referensi, tidak masuk aset produksi. Target tahap ini adalah komposisi diam Home desktop/mobile di aplikasi nyata, dengan konten/navigasi langsung, Explore, pause/reduced motion dan poster scene baru.
- Kamera antar-sudut/scene per route, Experience terpisah, konten karya, database/admin dan efek lanjutan belum dikerjakan pada tahap bukti visual ini. Kontak/CV yang belum tersedia tidak dikarang.

## Riwayat checkpoint brainstorming — lab personal, 23 Oktober 2026

Bagian berikut adalah riwayat sebelum prompt eksekusi dikirim. Pernyataan menunggu implementasi/jeda di bawah tidak menggantikan status Home di atas.

### Persiapan redesign terbaru

- Prompt lengkap untuk chat pengerjaan sebelumnya siap di [PROMPT-REDESIGN](docs/PROMPT-REDESIGN.md), termasuk panduan kapan mempertimbangkan Medium/High/XHigh/Astra/Luna. Pergantian melalui kontrol pemilik; rekomendasi berdasarkan bukti, bukan kewajiban upgrade. File prompt tidak otomatis memulai implementasi.

- Pemilik menerima rekomendasi file-first: JSON untuk data terstruktur, Markdown/MDX tepercaya untuk naskah; editor lokal → preview → deploy. Database/dashboard bukan kebutuhan versi pertama.
- Mobile disepakati sebagai lab dengan framing portrait khusus, bukan desktop yang dikecilkan: default scroll/tap, Explore eksplisit untuk orbit, daftar konten mengikuti document flow dan Writing berfokus pada membaca. Tetap perlu dibuktikan lewat render/QA.
- Permintaan aktif terbaru adalah **menyiapkan kebutuhan redesign**, belum mulai implementasi. Brief, daftar aset, urutan milestone, QA dan prompt lanjut ada di [REDESIGN-LAB](docs/REDESIGN-LAB.md). Foto lampiran disalin tanpa modifikasi ke `analysis/workbench-references/`, diverifikasi SHA-256 terhadap sumber; bukan aset publik dan hak distribusinya belum diketahui.
- Keperluan perencanaan siap; model/komposisi baru, copy final, data kontak/CV dan materi karya belum semuanya tersedia. Saat diminta melanjutkan: verifikasi checkout lalu bukti visual Home desktop/mobile. Jangan mengulang brainstorming atau memasang database secara otomatis.
- Validasi persiapan: whitespace diff, parse JSON konteks desain dan link/path dokumen lokal diperiksa. Tidak menjalankan build/browser aplikasi baru karena runtime tidak berubah. Hasil QA lama tetap historis.

- **Disepakati pemilik:** lab/workbench elektronik 3D, bentuk sederhana seperti Hamza, cahaya/material hangat, ketenangan editorial Clarissa. Referensi foto: komposisi foto 3, kehangatan foto 2, aktivitas foto 4, kepadatan rak foto 1.
- Home menampilkan workbench dengan intro di tengah dan baris typing. About, Projects, Experience, Writing dan Cabinet memiliki tempat/sudut sendiri dalam lab yang sama; susunan persis dan copy belum final. Navigasi langsung, konten HTML, fallback dan scroll mobile tetap menjadi batas desain.
- Tujuan utama perekrutan dan dihubungi; narasi yang diinginkan menunjukkan perjalanan pemilik. Bahasa publik Inggris. Tidak menambahkan klaim sifat/keahlian hanya dari usulan agent.
- Scene untuk observasi/inspeksi; demo knob, game atau simulasi robot tidak diwajibkan. Interaksi artikel Writing dapat lebih mendalam jika membantu penjelasan.
- Kandidat benda dari pemilik: kabel dan mechanical keyboard; manga serta stiker meme tentatif, dipilih kemudian. Foto referensi bukan bukti workspace/aset milik pemilik.
- Karya dan detail pengalaman akan dimasukkan belakangan. Writing bebas topik, termasuk pelajaran fisika; Markdown/MDX dipilih untuk naskah/komponen artikel. Rencana data/database ada di PRD §16.5; database/admin ditunda dengan workflow file-first.
- **Berikutnya:** setelah pemilik meminta eksekusi, ikuti REDESIGN-LAB: verifikasi kondisi Git dan buat satu bukti visual Home desktop/mobile memakai fondasi yang relevan. Persetujuan konsep belum merupakan persetujuan hasil visual atau izin melanjutkan implementasi.
- Pembaruan ini hanya dokumen dan konteks desain. Tidak menjalankan aplikasi/build/tes browser baru, menambah dependency, membuat database, mengubah staging, commit atau deploy.

Catatan jeda dan backlog di bawah adalah riwayat. Pernyataan lama bahwa belum ada konsep pengganti digantikan checkpoint ini; batas QA kode lama tetap berlaku.

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
- Preview dev milik repository dihentikan untuk jeda; port 3000 diperiksa dan tidak memiliki listener setelah penghentian. Tidak memulai proses/background baru. Perubahan tersimpan lokal; Git memuat staged dan unstaged changes. Tidak mengubah staging atau melakukan commit/reset/stash.
- HEAD saat checkpoint diverifikasi: `3e9f8c3` (`Prototype pertama`). Hash pada riwayat checkpoint lama bukan acuan HEAD sekarang; verifikasi lagi saat melanjutkan. Pemeriksaan whitespace staged/unstaged dan validasi JSON konteks desain lulus.

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
