# Digital Observatory — Abdiel Deandra EL Dzaky

Fondasi portofolio personal dengan suasana Clarissa Builds dan nuansa laboratorium digital. Implementasi tahap pertama sedang dijeda; hasil dan pekerjaan lanjutan tercatat di [TODO.md](TODO.md).

## Dokumen inti

| File | Fungsinya |
| --- | --- |
| [PRD](docs/PRD-PORTOFOLIO.md) | Apa yang dibangun, fitur, UI/UX, arsitektur target, data dan kriteria penerimaan |
| [AGENTS.md](AGENTS.md) | Panduan kerja untuk coding agent di repository ini |
| [TODO.md](TODO.md) | Urutan pekerjaan, status nyata dan keputusan yang masih terbuka |
| README ini | Cara menjalankan serta penjelasan struktur kode saat ini |

Detail arsitektur, UI/UX dan workflow sementara tetap berada dalam PRD/AGENTS; tidak perlu membuat dokumen terpisah yang menduplikasi isinya. Skill khusus proyek belum diperlukan.

## Status kode saat ini

Aplikasi produksi Next.js App Router + React + TypeScript + CSS berada di root dengan struktur `src/`. About memuat identitas/pengalaman pemilik; Projects, Writing dan Cabinet memakai empty state hingga materi siap. Ilustrasi SVG/CSS masih merupakan fallback visual sementara, bukan scene 3D final. Build sudah berhasil, tetapi review UI dan pengujian interaksi belum selesai; lihat checkpoint TODO.

`prototype/` tetap studi vanilla JavaScript + Three.js untuk lensing, dengan copy contoh dan hash navigation; terpisah dari aplikasi produksi.

## Menjalankan aplikasi produksi

Gunakan Node.js 22+ dan npm. Dependency terkunci di `package-lock.json`.

```powershell
npm ci
npm run dev
```

Buka http://127.0.0.1:3000. `npm run check` menjalankan TypeScript, tes konten dan pemeriksaan sintaks prototype. `npm run build` menjalankan check lalu build produksi; `npm start` menjalankan hasil build. Dev/build memakai Webpack karena Turbopack mengalami kegagalan izin junction pada lingkungan Windows ini.

Struktur: `src/app/` untuk route, `src/components/` untuk UI/kontrol/scene fallback, `src/lib/content/` untuk pembacaan dan validasi server, `src/content/` untuk JSON dan Markdown/MDX, serta `tests/content.test.ts` untuk pemeriksaan konten. Styling menggunakan CSS biasa tanpa Tailwind.

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
