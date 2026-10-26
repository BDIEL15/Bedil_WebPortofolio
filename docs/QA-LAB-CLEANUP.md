# QA — satu rak utama dan name tag Experience

25 Oktober 2026. Pemilik menilai dua rak terlalu ramai dan meminta meja bersih dengan isi rak utama padat/tertata, menghapus About me di Home dan memperbaiki name tag untuk tiga pengalaman utama.

## Implementasi

- Rak tingkat dua, empat instrumen atas dan kabel terkait dihapus. Satu rak utama mempertahankan supply/instrumen di ujung, buku dan kamera/Power/audio/kaset di tengah, serta organizer enam drawer di sela scope. Test leads diperkecil dan berkait di sisi kanan; kabel supply kiri dirutekan ke socket dan belakang drawer. Satu meja/renderer/overview tetap; dinding dan overview lebih pendek, POV Home tetap.
- Section About me dan CTA About me di Home dihapus. Intro, typing, Projects dan ringkasan Experience tetap. About masih route/nav tersendiri. Anchor Home yang masih ada: /#experience; tes restore scroll diperbarui memakai anchor tersebut.
- Name tag memakai holder berbingkai, punched slot, clip/ring dan loop tali tiga warna. Organisasi, nama lengkap, peran serta tahun yang tersedia berada pada atlas lokal asli, tanpa ID/credential/tanggal baru. Ukuran tag diperkecil dan dinaikkan; POV Experience desktop/portrait melewati monitor sehingga foto/identitas terbaca. Konten HTML tetap sumber aksesibel.
- getFeaturedExperiences memilih tiga published pertama sesuai urutan file src/content/experiences.json, lalu hanya ID/organisasi/peran/tahun dikirim dari RootLayout ke SceneHost/engine. Tidak mengimpor JSON konten ke bundle client, tidak mengirim draft. Daftar HTML Experience tetap seluruh peran published. Foto dicocokkan dengan ID, bukan urutan; lima slot tetap null. Panduan: [SCENE-PHOTOS](SCENE-PHOTOS.md).
- Geometri statis dibatch per badge; robot, monitor dan notebook tetap memakai loop/lifecycle sebelumnya. **249 mesh / 90.444 rendered triangle / 184 geometri / 12 generated texture**, budget lama 350/150.000 tetap. Tidak ada dependency/aset pihak ketiga baru.

## Verifikasi

- npm run build lulus: TypeScript, 11 tes konten/scene/asset/loader, syntax prototype dan build/prerender Next.js.
- Unit memeriksa satu meja/rak, alat tersangga pada rak utama, badge sesuai urutan public server, pemisahan antarbadge, fit hero pada lima rasio 320px–ultrawide dan 129 pose robot. Raycast hanya pada mesh occluder memeriksa tiga sampel foto/identitas per badge terhadap monitor/rak; THREE.Line tidak dipakai sebagai permukaan occluder karena threshold picking berbeda dari lebar garis render.
- Enam suite produksi final lulus: smoke, story, kamera, motion, lifecycle dan render probe. Home tanpa About me, 404/draft, nav/fokus, pause/reduced motion, noJS/noGL/static, shared renderer dan peran nyata diperiksa. Kamera merekam 38 matrix berbeda; motion mendapat 32 frame pada interval sampel (bukan klaim FPS). Reset keyboard sama persis; reset mouse mean pixel error sekitar 7,72e-7/fraction 2,31e-6, di bawah toleransi lama. Render probe Pause idleDelta 0/interactionDelta 2. Semua suite yang merekam pageErrors melaporkan array kosong.
- Capture 12 state UI × desktop/tablet/mobile selesai; 21 poster baru total **823.632 byte**. Pemeriksaan tambahan setelah konversi membuktikan Home/Experience memakai poster baru di mode statis, tanpa live canvas dan tanpa page error. Log/artifak: .taste-skill/lab-views/clean-*. Dua belas screenshot inspector final Home/Experience (fold dan halaman di tiga ukuran), preview Cabinet dan poster statis Home/Experience sudah dibuka.
- Source lint empat file UI: 0 FAIL / 0 WARN. CLI 21st tidak tersedia di PATH; tidak memasang dependency untuk review atau mengirim source ke layanan eksternal. Metadata search minimal lanyard: ID Card Lanyard 27450, Lanyard Badge 31036, Interfaces Badge 11844. Physics drag/flip tidak diperlukan; reuse geometry/material/batching proyek, bukan mengambil kode katalog atau generation berbayar.

## Review visual

Inspector Home: **4 FAIL / 4 WARN**; Experience: **5 FAIL / 3 WARN**. Audit belum sepenuhnya lulus. Temuan mencakup warm rust accent, jumlah foto/footage, gerak DOM, empty-screen/blank-gap dan komposisi asimetris; canvas 3D/aktivitas robot tidak dihitung sebagai isi/gerak DOM. Nama/judul singkat serta satu scene dengan konten editorial dan scroll portrait dipertahankan sesuai arah pemilik. Tidak menambah foto/video rekaan, dekorasi atau animasi DOM demi meter. Foto asli belum tersedia; teks pengalaman tetap dapat diakses sebagai HTML. Selisih margin Home yang dicatat meter 28px; wrapper intro tetap terpusat.

ROUND 2
Seen in one second: satu rak terisi di atas workbench, intro bersih dan tiga badge di pegboard.
Idea: setiap kelompok punya tempat, satu rak menampung alat dan minat tanpa menumpuk tingkat kedua.
Live thing: transisi/Explore, robot/monitor lintasroute dan notebook About yang sudah ada.
Layout: Home frontal intro; Experience tiga badge di kanan teks; portrait scene dahulu lalu teks dengan scroll biasa.
Scores: design 6.5 · usability 7.5 · creativity 7 · content 5 → overall 6.0 setelah cap audit/foto belum diisi, bukan nilai atau persetujuan pemilik.
Top fixes: hapus tingkat rak kedua; proporsionalkan/angkat badge dan atur POV melewati monitor; hapus ringkasan About yang berulang di Home.
Remaining: review kerapian/POV pemilik, foto/cerita nyata dan QA perangkat fisik. Tidak menyatakan seluruh milestone/PRD selesai.

## Koreksi selama pengerjaan

Badge awal yang diperbesar membuat bagian bawah tertutup monitor. Kamera yang terlalu tinggi justru memotong loop di balik shelf. Tag kemudian diproporsionalkan/dinaikkan dan POV dikalibrasi; tes proyeksi dan raycast ditambahkan. Kegagalan awal fit 320px teratasi tanpa melonggarkan batas proyeksi atau budget. Preview awal bukan bukti final; foto asli belum disediakan.

## Batas dan menjalankan kembali

Belum diuji: ponsel fisik, Safari/Firefox, screen reader/zoom lengkap, CLS/cold load serta GPU/memory/thermal jangka panjang. Foto nyata belum diuji di browser; loader crop/error/cleanup tetap diuji unit. Penerimaan visual satu rak/name tag dari pemilik masih terbuka. Prototype/analysis/studi/lisensi dan perubahan lokal sebelumnya dipertahankan; tidak stage/commit/push/deploy.

Preview: npm run dev. Studi lama: npm run prototype. Check: npm run check. Hentikan dev sebelum npm run build, lalu npm start. Capture: tests/capture-lab-views.js lewat playwright-cli sesuai README, kemudian node scripts/prepare-lab-posters.mjs.

Status penutupan: browser QA clean ditutup, server produksi sementara dihentikan setelah verifikasi command line repository. Preview dev aktif kembali di http://127.0.0.1:3000/ dan melaporkan Ready. Semua perubahan tersimpan di file; tidak ada stage/commit/push/deploy.
