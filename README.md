# Digital Observatory — Abdiel Deandra EL Dzaky

Fondasi portofolio personal dengan suasana Clarissa Builds dan nuansa laboratorium digital. Tahap pertama dapat dijalankan; hasil dan pekerjaan lanjutan tercatat di [TODO.md](TODO.md).

**Dijeda atas permintaan pemilik, 23 Oktober 2026.** Pemilik akan brainstorming ulang konsep di chat baru agar lebih mencerminkan kepribadiannya. Digital Observatory/Robotics study adalah baseline implementasi yang disimpan, bukan arah final yang sudah disetujui. Tidak ada konsep pengganti yang dipilih. Baca checkpoint dan prompt handoff di awal [TODO](TODO.md) sebelum melanjutkan; implementasi berikutnya menunggu arahan pemilik.

## Dokumen inti

| File | Fungsinya |
| --- | --- |
| [PRD](docs/PRD-PORTOFOLIO.md) | Apa yang dibangun, fitur, UI/UX, arsitektur target, data dan kriteria penerimaan |
| [AGENTS.md](AGENTS.md) | Panduan kerja untuk coding agent di repository ini |
| [TODO.md](TODO.md) | Urutan pekerjaan, status nyata dan keputusan yang masih terbuka |
| README ini | Cara menjalankan serta penjelasan struktur kode saat ini |

Detail arsitektur, UI/UX dan workflow sementara tetap berada dalam PRD/AGENTS; tidak perlu membuat dokumen terpisah yang menduplikasi isinya. Skill khusus proyek belum diperlukan.

## Status kode saat ini

Aplikasi Next.js App Router + React + TypeScript + CSS berada di root dengan struktur `src/`. About memuat identitas/pengalaman pemilik; Projects, Writing dan Cabinet memakai empty state hingga materi siap. Kandidat desain ulang **Robotics study** menggunakan scene satu viewport di belakang konten editorial. Build dan pemeriksaan browser produksi lulus; penerimaan visual akhir oleh pemilik serta QA perangkat nyata tetap terbuka. Lihat [QA Robotics study](docs/QA-WORKSHOP.md).

`prototype/` tetap studi vanilla JavaScript + Three.js untuk lensing, dengan copy contoh dan hash navigation; terpisah dari aplikasi produksi.

Visual bola Signal study dan layout dua kolom sudah diganti. Scene baru memuat model robot ABB IRB 52 dari ROS-Industrial di meja kerja, kamera pengamatan ilustratif, lantai perspektif dan bayangan. Model, notice Apache-2.0, font Libertinus berlisensi OFL dan tiga poster hasil render disajikan lokal. Sumber/ukuran/reproduksi tercatat di [manifest aset](docs/ASSETS.md). Robot dan props bukan klaim karya atau kepemilikan pemilik.

**Explore view** mengaktifkan drag/arrow keys dan reset. **Hide text** membuka pandangan tanpa konten, **Show text** atau Escape memulihkannya. Gerak robot dan typing mengikuti pause/reduced motion. ASCII terlokalisasi di objek dan dipilih eksplisit; pada poster statis kontrol ini disabled. Tanpa JS/WebGL, saat model gagal/context loss, atau melalui **Use static view**, poster scene tetap terlihat. Mode statis bertahan antar-reload. Satu renderer/kamera dipertahankan antarroute; transisi halaman, reveal judul singkat berbasis GSAP dan fade poster ke scene tidak menahan navigasi. SplitText telah diadaptasi ke CSS biasa dan teks SSR tetap terbaca.

React Bits menjadi sumber konsep reveal; pencarian katalog 21st melalui CLI memerlukan login, sehingga tidak ada komponen 21st yang dipasang. Review eksternal 21st tidak dijalankan karena pemeriksaan izin menolak potensi pengiriman source; review lokal digunakan. Konteks desain lokal ada di `.21st/`. Tidak ada dependency runtime tambahan pada iterasi Robotics study; GSAP/Three sudah tersedia.

## Menjalankan aplikasi produksi

Gunakan Node.js 22+ dan npm. Dependency terkunci di `package-lock.json`.

```powershell
npm ci
npm run dev
```

Buka http://127.0.0.1:3000. `npm run check` menjalankan TypeScript, tes konten dan pemeriksaan sintaks prototype. `npm run build` menjalankan check lalu build produksi; `npm start` menjalankan hasil build. Dev/build memakai Webpack karena Turbopack mengalami kegagalan izin junction pada lingkungan Windows ini.

Hentikan dev server sebelum build di checkout yang sama. Browser smoke tersimpan di `tests/browser-smoke.js`; dengan `playwright-cli` tersedia, jalankan `playwright-cli open http://127.0.0.1:3000` lalu `playwright-cli run-code --filename=tests/browser-smoke.js`. Ini pemeriksaan terpisah dari `npm run check`.

Tes scene/lifecycle: `playwright-cli run-code --filename=tests/scene-browser.js`. Motion/loading race: `playwright-cli run-code --filename=tests/workshop-motion.js`. Probe render lokal: `playwright-cli run-code --filename=tests/scene-rendering-probe.js`. Screenshot/poster: `playwright-cli run-code --filename=tests/capture-workshop.js`. Jalankan terhadap hasil produksi untuk menghindari refresh kompilasi dev saat pengujian.

Struktur: `src/app/` untuk route, `src/components/` untuk UI/kontrol/scene host, `src/lib/scene/create-workshop-scene.ts` untuk engine aktif, `src/lib/content/` untuk pembacaan dan validasi server, `src/content/` untuk JSON/Markdown/MDX, `public/` untuk aset produksi beserta lisensi, serta `tests/` untuk pemeriksaan. Engine/komponen Signal study lama tersimpan sebagai riwayat studi dan tidak dipasang pada halaman. Styling menggunakan CSS biasa tanpa Tailwind. `node scripts/prepare-robot.mjs` membangun ulang GLB dari sumber yang dipatok; akses jaringan diperlukan bila cache kosong.

Konten writing memakai YAML frontmatter dan body `.md`/`.mdx`. Draft contoh berada di `src/content/`, bukan `public/`. Status `published` memerlukan tanggal `publishedAt` yang valid dan tidak di masa depan. MDX hanya untuk sumber lokal tepercaya milik pemilik; jangan menerima kode MDX dari input publik. Komponen interaktif dapat didaftarkan melalui prop `components` pada renderer artikel ketika benar-benar dibutuhkan. Aset draft jangan diletakkan di `public/`.

Hasil penelitian website reference tersedia di [report REA](analysis/REPORT.md). Simpan hasil penelitian sebagai bukti; aplikasi produksi tidak memuat bundle asli dari `analysis/`.

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
