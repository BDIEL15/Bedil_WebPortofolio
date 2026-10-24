# Personal Electronics Lab — Abdiel Deandra EL Dzaky

**Koreksi visual terbaru:** pemilik meminta satu workbench kompak dengan fokus objek/POV per halaman seperti pendekatan Hamza. Empat meja yang ada di kode belum dikonsolidasikan; itu baseline teknis, bukan komposisi final. Ikuti checkpoint teratas TODO sebelum memperluas scene.

Portofolio personal dengan workbench elektronik 3D hangat dan konten editorial. **Home, About, Projects dan Experience menempati satu lab/renderer dengan transisi kamera dan overview saat Hide Text.** Ini belum desain final atau penyelesaian seluruh PRD; sudut lain dan materi karya mengikuti review/data pemilik.

**About & Experience, 24 Oktober:** dua route kini mempunyai sudut fisik sendiri di lab yang sama. About memakai meja baca dengan notebook terbuka/lampu/buku; Experience memakai board dokumentasi dengan tiga grafis kategori asli, sementara HTML memuat tiga peran nyata dari JSON. Semua sudut memiliki portrait framing, overview, keyboard/orbit dan fallback. Satu renderer dipertahankan; 24 poster lokal untuk delapan pose × tiga resolusi. Transisi biasa 1,25 detik, perjalanan jauh >14 unit 1,6 detik, overview 1,15 detik; pause/reduced motion langsung ke tujuan. Anchor lama `/#about`/`/#experience` tetap tersedia. Lihat [QA kedua sudut](docs/QA-STORY-CORNERS.md).

**Revisi 3D dan motion, 24 Oktober:** robot kini berhierarki sendi, housing tirus, bearing/collar, flange, gripper dan kabel per-link. Gerak observasi 16 detik menjaga tool tegak, dengan render dibatasi sekitar 30Hz. Pause/reduced motion membekukan pose; tab hidden, Home/route lain dan static menghentikan loop. Material kayu/logam, keyboard robotics dan laci diperbaiki. Home tetap tanpa render idle. Lihat [QA motion](docs/QA-ROBOT-MOTION.md).

**Pembaruan terbaru 24 Oktober:** Projects kini memiliki meja robotics terpisah dengan lengan/gripper, fixture dan monitor diagram asli, bukan hanya sudut instrumen Home. Home → Projects/restore berdurasi 1,25 detik; Hide Text ke overview workspace aktif 1,15 detik. Hide Text langsung mengaktifkan drag/arrow/reset tanpa klik Explore lagi; Show Text/Escape memulihkan sudut, fokus dan scroll baca. Explore tetap pilihan saat teks terlihat. Inspect ASCII dihapus dari aplikasi aktif; studi/prototype lama dipertahankan. Pause/reduced motion langsung ke tujuan. Empat sudut, delapan pose dan 24 poster memakai satu renderer; robot Projects kini bergerak sesuai revisi terbaru. Lihat [QA robotics](docs/QA-ROBOTICS-BAY.md).

**Revisi 24 Oktober:** Home memakai sudut pandang duduk menghadap pegboard. Intro berada pada bidang pegboard, keyboard/kabel di foreground; kaki meja dan alas panggung keluar dari framing utama. Desktop/portrait serta poster telah disesuaikan. Teks tetap HTML yang dapat dibaca/diseleksi, bukan mesh 3D; saat Explore, konten mempertahankan layout bacanya. Tidak ada model/dependency baru.

Item Home kemudian diperbaiki: keyboard ANSI 60% dengan legenda, spiral dan konektor kabel, panel/soket instrumen, dudukan monitor, notebook/alat/lampu, serta bevel dan rasio tekstur yang sesuai bentuk. Test geometri menjaga jarak keycap, posisi terhadap meja dan budget internal. Benda tetap ilustrasi generik, bukan klaim karya/peralatan milik pemilik.

## Dokumen inti

- [TODO](TODO.md): checkpoint terbaru dan pekerjaan berikutnya.
- [PRD](docs/PRD-PORTOFOLIO.md), terutama §2.5, §7.7 dan §16.5: keputusan produk/arsitektur.
- [Brief lab](docs/REDESIGN-LAB.md): referensi, milestone dan batas lingkup.
- [QA Home](docs/QA-HOME-LAB.md): hasil aktual serta batas pemeriksaan redesign.
- [QA About/Experience](docs/QA-STORY-CORNERS.md): route/sudut baru, grafis, fallback dan hasil pemeriksaan terbaru.
- [QA motion](docs/QA-ROBOT-MOTION.md): perbaikan model dan lifecycle animasi robot terbaru.
- [QA robotics](docs/QA-ROBOTICS-BAY.md): meja kedua, orbit otomatis, penghapusan ASCII dan pemeriksaan terbaru.
- [QA kamera](docs/QA-LAB-CAMERA.md): riwayat transisi Home/Projects/overview dan batas verifikasinya.
- [Manifest aset](docs/ASSETS.md) dan [AGENTS](AGENTS.md): asal aset dan panduan kerja.

## Status kode

Next.js App Router + React + TypeScript + CSS berada di root dengan `src/`. Home memakai intro `Hi, I'm Abdiel.`, typing dua kandidat frasa, dan informasi nyata pemilik. Navigasi About dan Experience menuju route/sudut tersendiri; ringkasan/anchor Home lama dipertahankan. Projects, Writing dan Cabinet tetap empty state yang jujur. JSON dan Markdown/MDX lokal memakai content layer yang sudah ada; tidak ada database/admin baru.

Engine aktif `src/lib/scene/create-personal-lab-scene.ts` diimpor dinamis oleh SceneHost. Geometri/tekstur prosedural asli berada di `personal-lab.ts`: meja kayu, pegboard, rak, instrumen ilustratif, lampu, mechanical keyboard, kabel, cutting mat dan catatan. Foto referensi tidak dikirim ke produksi. Home **diam saat idle**; render berlangsung selama transisi kamera, resize/Explore. Robot Projects memiliki loop terbatas ketika terlihat dan motion aktif; waktu animasi tidak berjalan saat pause/hidden/route lain.

Explore mengaktifkan drag/arrow keys, reset dan Escape saat teks terlihat; default touch menjaga scroll/zoom. Hide Text otomatis membuka orbit, termasuk touch; Show Text/Escape mengembalikan native scroll dan posisi baca. Pause/reduced motion mengendalikan typing/reveal. Poster baru dari render yang sama tersedia tanpa JS/WebGL, saat context loss atau melalui Use static view; preferensi statis bertahan antar-reload. Satu renderer dipakai antarroute. Kontak/CV yang belum diberikan tidak ditampilkan.

Robotics/Signal study, GLB/lisensinya, `prototype/` dan `analysis/` dipertahankan. Engine lama tidak aktif; [QA Robotics](docs/QA-WORKSHOP.md) merupakan riwayat, bukan hasil QA Home baru. Tidak ada dependency baru, commit atau deploy. Pencarian metadata 21st pada tahap About/Experience berhasil (Impact Experience/editorial lists), tetapi gaya hover-imagery/accordion tidak diperlukan. Navigation, SplitText dan pola editorial proyek dipakai kembali; tidak mengambil kode komponen berbayar, menambah dependency, menggunakan generation, atau mengirim source ke review eksternal.

## Menjalankan aplikasi

Node.js 22+ dan npm; dependency dikunci di `package-lock.json`.

```powershell
npm ci
npm run dev
```

Buka http://127.0.0.1:3000/. `npm run prototype` menjalankan studi lama pada port 4173. Dev/build memakai Webpack karena masalah izin junction Turbopack pada Windows ini. **Hentikan dev sebelum build pada checkout yang sama.**

```powershell
npm run check
npm run build
npm start
```

Check mencakup TypeScript, sembilan tes konten/geometri/motion/studi terdahulu dan syntax prototype; build menjalankan check lalu Next.js. QA browser Home baru terpisah, dengan server pada port 3000 dan `playwright-cli` tersedia:

```powershell
playwright-cli open http://127.0.0.1:3000/
playwright-cli run-code --filename=tests/personal-lab-smoke.js
playwright-cli run-code --filename=tests/personal-lab-browser.js
playwright-cli run-code --filename=tests/personal-lab-rendering.js
playwright-cli run-code --filename=tests/lab-camera-browser.js
playwright-cli run-code --filename=tests/robot-motion-browser.js
playwright-cli run-code --filename=tests/story-corners-browser.js
playwright-cli run-code --filename=tests/capture-lab-views.js
playwright-cli close
```

Tes `browser-smoke.js`, `scene-browser.js`, `workshop-motion.js` dan probe lama menyimpan asumsi Robotics study; jangan menganggapnya tes Home yang masih sesuai. Skrip capture menghasilkan PNG lokal di `.taste-skill/lab-views/`; reproduksi poster ada di manifest aset.

Struktur: `src/app/` route; `src/components/` UI/SceneHost; `src/lib/scene/` engine/geometri; `src/lib/content/` pembacaan/validasi server; `src/content/` JSON/Markdown/MDX; `public/` aset/lisensi; `tests/` pemeriksaan. CSS biasa, tanpa migrasi framework styling.

Writing memakai YAML frontmatter dan body `.md`/`.mdx` lokal tepercaya. Status published memerlukan tanggal valid yang tidak di masa depan. Draft tidak ditempatkan di public; komponen interaktif didaftarkan saat artikel benar-benar membutuhkannya. Tidak menerima kode MDX dari input publik. Materi karya, kontak/CV dan kontribusi rinci masih menunggu pemilik.

## Menjalankan prototype

Requires Node.js 22+ and a browser supporting WebGL2.

```powershell
npm install
npm run prototype
```

Open http://127.0.0.1:4173/. Dependencies are pinned in `package-lock.json`; after installation the app makes no external requests.

Drag the background to orbit. Double-click the background to reset the view. Use the eye button to hide text. Open **simulation controls** to toggle objects, change brightness, scrub normalized time, and pause/play/reset. Scrubbing pauses the clock. Reduced-motion users start paused.

## Code

- `prototype/lensing.js`: Three scene, custom orbit, animation loop, lens images, graph and cleanup.
- `prototype/shaders.js`: independently written point-lens image and grid shaders.
- `prototype/main.js`: shared state, controls and sample hash-section navigation.
- `prototype/index.html` and `styles.css`: accessible overlay and reference-style layout.
- `analysis/shaders/02-vertexShader.glsl` and `03-fragmentShader.glsl`: exact recovered reference panel shaders, retained separately for analysis.

The MVP keeps one background between sections, uses a simple Earth sphere, and simplifies secondary rays, stars and source texture. It is an educational thin-lens simulation, not a pixel-identical reproduction of all four reference routes. No original biography or project media appears in the prototype.

Font subsets were fetched from the reference's public font URLs (documented in the report). The static evidence snapshot, REA records and recovered shaders are retained under `analysis/`; only `prototype/`, local Three modules and styles are used by the application.
