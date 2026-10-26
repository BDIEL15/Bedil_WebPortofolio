# Personal Electronics Lab — Abdiel Deandra EL Dzaky

**Terminal opening:** kunjungan pertama ke Home dalam sesi menyiapkan scene melalui terminal, kemudian kamera mundur dari monitor ke Home. Skip intro/Escape tersedia. Saved pause/static, reduced motion dan direct route melewati opening; gagal/timeout 3D tetap membuka konten. Monitor menampilkan editor ilustratif dan keyboard mengetik sinkron lintasroute. Untuk melihat ulang opening gunakan sesi/jendela privat baru. [QA opening](docs/QA-TERMINAL-OPENING.md).

Terminal awal kini mengetik per karakter: perintah dahulu, lalu persiapan 3D, hasil bertahap dan baris akhir sebelum kamera bergerak. Pengetikan adalah presentasi; status tetap mengikuti readiness nyata, bukan persen unduhan rekaan.

Saat siap, outline dan vignette hijau mencerahkan layar secara singkat, bezel monitor sedikit menyala, lalu efek memudar ketika kamera menjauh. Efek mengikuti pengaturan gerak dan tidak menambah durasi opening.

Judul, minat, deskripsi dan ikon Home masuk melalui fade bertahap yang tetap berjalan hingga selesai. Refresh Home untuk melihat ulang reveal teks; sesi privat diperlukan hanya untuk mengulang opening 3D penuh. Pause/reduced motion menampilkan konten langsung.

**Sosial Home:** intro menampilkan ikon GitHub, LinkedIn, Instagram dan email yang diberikan pemilik, menggantikan CTA Projects. Edit `socialLinks` di `src/content/profile.json`; Projects tetap tersedia di header. SVG lokal tanpa dependency tambahan; sumber/lisensi di [ASSETS](docs/ASSETS.md).

**Kontrol scene:** Explore view dan Use static view tersedia hanya di Home. Hide Text tetap memungkinkan eksplorasi pada halaman lain. Pilihan static dari Home berlaku lintasroute; untuk mengaktifkan 3D kembali gunakan Enable 3D di Home.

**Area baca, 26 Oktober:** konten tidak lagi melintas di belakang header/footer tetap. Footer identitas diam di kiri bawah, dengan posisi di atas kontrol scene pada mobile; Home tetap tanpa footer. Scroll dokumen, fokus keyboard dan transisi konten dipertahankan. [QA area baca](docs/QA-READING-FRAME.md).

**Experience, 26 Oktober:** daftar peran kini memakai hierarchy profil seperti LinkedIn dalam tema hangat: peran, organisasi, tahun yang tersedia dan monogram. Sesuai klarifikasi pemilik, name tag Lab menggantikan slot IME yang dekat kamera; urutan fisik IME → EXERCISE → Lab, sedangkan daftar prioritas tetap Lab → EXERCISE → IME. Semua 21 fallback diselaraskan. [QA Experience](docs/QA-EXPERIENCE-PROFILE.md).

**Mengedit konten:** mulai dari [panduan edit konten](docs/EDIT-CONTENT.md). Buat draft dengan `npm run content:new -- project nama-proyek` (juga `writing`/`cabinet`), isi file, lalu `npm run content:check`. Konten asli di `src/content/`; `?preview=1` hanya contoh layout. Keputusan terbaru: file-first tanpa database; Supabase ditunda. Ini belum static export HTML murni—deployment masih membutuhkan dukungan Next.js.

**Home/header, 26 Oktober:** Home kini intro + scene tanpa ringkasan Experience atau strip footer. Header tetap di atas viewport pada semua route (disembunyikan saat Hide Text), dengan satu penanda aktif yang bergeser pada klik dan Back/Forward. Pause/reduced/hidden menghentikan gerak penanda, resize/font menyesuaikan posisinya. CTA Home mempertahankan mode preview. [QA navigasi](docs/QA-HOME-NAVIGATION.md).

**UI preview, 26 Oktober:** navigasi/kontrol kini membulat dan lebih lembut. Buka [Projects dummy](http://127.0.0.1:3000/projects?preview=1), lalu gunakan navigasi untuk About/Writing/Cabinet. Kartu Projects membuka detail case study; Writing membuka contoh bacaan, Cabinet membuka cerita display hobi. Label `Layout preview`/`Sample` selalu membedakan contoh dari karya asli. `View real content` mengembalikan konten published/empty state; parameter preview diteruskan oleh navigasi. Mode preview diberi noindex dan tidak membaca draft. Data contoh terpisah di `src/data/ui-preview.json`; belum terhubung database. Lihat [QA UI](docs/QA-UI-PREVIEW.md).

**Status terbaru:** teks antarhalaman memakai fade-through tanpa geser posisi/reveal kata ganda. Kamera lebih tenang, arc diperkecil dan cap render 60Hz selama flight/30Hz saat menetap dalam satu loop. Enam pose, satu rak/meja/renderer/overview, 21 poster dan konten tetap; foto masih null. Lihat [QA transisi halus](docs/QA-SOFT-TRANSITIONS.md), [QA kamera cinematic](docs/QA-CINEMATIC-CAMERA.md) dan [panduan foto](docs/SCENE-PHOTOS.md).

Portofolio personal dengan workbench elektronik 3D hangat dan konten editorial. **Home, About, Projects, Experience, Writing dan Cabinet memakai satu workbench/renderer dengan POV objek dan overview bersama saat Hide Text.** Ini belum desain final atau penyelesaian seluruh PRD; materi karya dan penyempurnaan berikutnya mengikuti review/data pemilik.

Robot mempertahankan gerak sendi pelan 16 detik; loop bersama monitor (cap 60Hz saat flight, 30Hz saat menetap) berlanjut lintasroute, termasuk transisi. Pause/reduced motion membekukan pose; hidden/static/dispose menghentikan loop. Konten HTML, navigasi, fallback, keyboard dan native mobile scroll tetap berfungsi. Bookmark lama `/#experience` diarahkan ke `/experience` saat JavaScript aktif; navigasi Experience tetap tersedia tanpa JavaScript. About hanya di `/about`. Tidak ada database/admin atau dependency baru.

Riwayat empat meja, tahap props dan motion sebelum konsolidasi tersedia dalam laporan QA terdahulu; status aktif selalu mengikuti TODO dan QA kompak.

## Dokumen inti

- [QA transisi halus](docs/QA-SOFT-TRANSITIONS.md): fade-through teks, fallback/history dan render kamera adaptif.

- [QA kamera cinematic](docs/QA-CINEMATIC-CAMERA.md): framing, opening, lintasan halus dan pemeriksaan kontinuitas/lifecycle.

- [QA cleanup](docs/QA-LAB-CLEANUP.md): satu rak utama, Home ringkas dan name tag tiga pengalaman prioritas.

- [QA lab personal](docs/QA-LAB-PERSONALITY.md): rak/instrumen/kabel, lanyard/foto, paper/chalkboard dan display hobi.
- [Panduan foto](docs/SCENE-PHOTOS.md): isi slot lanyard dan bingkai lewat aset lokal publik.
- [QA Writing/Cabinet](docs/QA-COLLECTION-VIEWS.md): dua POV koleksi, enam halaman dalam satu ruang, fallback dan batas QA.
- [QA kompak](docs/QA-COMPACT-WORKBENCH.md): satu meja, proof Home/Projects, fallback dan hasil pemeriksaan terbaru.

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

Implementasi aktif adalah satu meja dan satu rak utama. Satu overview lintasroute, 21 WebP aktif, geometri penuh 249 mesh / 90.444 rendered triangle / 184 geometri / 12 tekstur. Writing fokus paper gantung/chalkboard kanan, Cabinet display hobi; About mempertahankan notebook dan Experience kini name tag/slot foto. Badge statis dibatch per kartu agar bounds dan pemisahannya dapat diuji. Pose/lensa desktop/portrait dikalibrasi per objek. Durasi nominal route/restore 1,5–2,35 detik mengikuti jarak, overview 1,95 detik, reset 1,25 detik. Lintasan quintic dengan arc kecil tanpa lens breathing, velocity continuity saat retarget dan pengereman di depan benda. Satu shadow map key workbench diperbarui bersama robot.

Opening Home bergerak dari sudut sedikit lebih lebar/tinggi ke POV duduk, nominal 2,6 detik desktop atau 2,1 detik portrait. Hanya entry dokumen Home yang pertama dan motion aktif yang menjalankannya. Direct route lain, pause tersimpan/reduced/hidden dan static/retry tidak memutar opening. HTML/nav/scroll langsung tersedia; pause/hidden menyelesaikan flight, drag/arrow menginterupsi. Resize saat bergerak menarget ulang dari pose/kecepatan sekarang; resize saat idle langsung menyesuaikan framing. Satu loop cap 60Hz selama kamera bergerak lalu 30Hz saat menetap; bukan jaminan FPS perangkat. Durasi route kini 1,5–2,35 detik, overview 1,95/reset 1,25, tanpa lens breathing. Durasi bisa memanjang bila frame tertunda agar tidak mengejar waktu dengan loncatan.

Heading tetap stasioner dan SSR; transisi main/footer menggunakan snapshot native bila didukung: keluar 160ms, masuk 520ms sesudahnya. Pose/ukuran snapshot tidak bergerak dan renderer tidak menjadi snapshot root. Route lambat melewati animasi capture setelah guard 350ms; history/browser tanpa API serta native capture yang gagal/dilewati memakai incoming opacity fade. Pause/reduced/hidden melewati animasi. Tidak ada dependency baru.

Next.js App Router + React + TypeScript + CSS berada di root dengan `src/`. Home memakai intro `Hi, I'm Abdiel.`, typing dua kandidat frasa, informasi nyata pemilik dan ringkasan Experience; section/CTA About me di Home dihapus. Navigasi About dan Experience menuju route/sudut tersendiri. Projects, Writing dan Cabinet tetap empty state yang jujur. JSON dan Markdown/MDX lokal memakai content layer yang sudah ada; tidak ada database/admin baru.

Engine aktif `src/lib/scene/create-personal-lab-scene.ts` diimpor dinamis oleh SceneHost. Geometri/tekstur prosedural asli berada di `personal-lab.ts`, `lab-details.ts` dan `story-corners.ts`: meja kayu, pegboard, rak, instrumen ilustratif, lampu, mechanical keyboard, kabel, cutting mat dan catatan. Foto referensi tidak dikirim ke produksi. Robot dan monitor kini bergerak lintasroute, termasuk Home, dengan loop yang sama dengan cap adaptif 60Hz flight/30Hz menetap. Monitor memakai trace/satelit ringan; About menambahkan pensil dan goresan ilustratif yang berulang. Transisi kamera tidak membekukan aktivitas. Pause/reduced motion, tab hidden, static/context loss/dispose menghentikan loop; tidak mengejar waktu yang terlewat. Lihat [QA aktivitas](docs/QA-LAB-ACTIVITY.md).

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

Check mencakup TypeScript, dua belas tes konten/geometri/motion/studi terdahulu dan syntax prototype; build menjalankan check lalu Next.js. QA browser terpisah, dengan server pada port 3000 dan `playwright-cli` tersedia:

```powershell
playwright-cli open http://127.0.0.1:3000/
playwright-cli run-code --filename=tests/personal-lab-smoke.js
playwright-cli run-code --filename=tests/personal-lab-browser.js
playwright-cli run-code --filename=tests/personal-lab-rendering.js
playwright-cli run-code --filename=tests/lab-camera-browser.js
playwright-cli run-code --filename=tests/cinematic-camera-browser.js
playwright-cli run-code --filename=tests/text-transition-browser.js
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
