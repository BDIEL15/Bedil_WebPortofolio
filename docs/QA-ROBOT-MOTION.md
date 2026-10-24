# QA revisi 3D dan motion robot

24 Oktober 2026. Pemilik memberi respons positif pada arah keseluruhan lalu meminta objek 3D diperbagus dan robot bergerak. Revisi ini berfokus pada lab yang sudah ada; tidak menambah sudut/halaman lain, dependency, aset eksternal, konten karya atau deployment.

## Implementasi

- Robot prosedural memiliki turret, shoulder, elbow, wrist dan tool sebagai hirarki pivot. Link memakai housing tirus dengan collar; bearing depan/belakang, hub, flange, gripper/pad dan baut basis instanced menggantikan sambungan bentuk statis. Kabel per-link ikut transform joint. Gripper tetap tegak melalui kompensasi sudut pergelangan.
- Siklus observasi 16 detik dengan interpolasi quintic menggerakkan basis, lengan dan bukaan gripper. Bukan simulasi fisika/kinematika terkalibrasi atau demo pick-and-place; sample tidak diklaim diangkat. Tidak membuat geometry/texture atau React state per frame.
- Rendering robot dibatasi sekitar maksimum 30Hz hanya pada Projects terlihat dan motion aktif. Transisi kamera sementara menghentikan loop robot; setelah selesai/input mengambil alih, motion diteruskan. Pause/reduced motion membekukan pose; tab hidden/route lain/static menghentikan loop. Waktu fase disimpan dan delta awal resume nol, sehingga tidak mengejar waktu selama berhenti.
- Shadow Home di-cache; hanya spotlight robotics diperbarui saat rig bergerak. Loop dibersihkan pada dispose/context loss. Home tetap event-driven, tanpa render idle.
- Kayu lebih netral dan roughness disesuaikan; enamel/logam dibedakan. Keyboard robotics menggunakan geometri/tekstur Home yang dibagi, bukan slab kosong. Storage mendapat muka/handle. Dua belas poster dari pose istirahat awal deterministik direkam ulang. ASCII tetap dihapus, Hide Text tetap otomatis Explore dan fallback tetap tersedia.

## Verifikasi aktual

| Pemeriksaan | Hasil |
| --- | --- |
| `npm run build` | TypeScript, 8 tes, syntax prototype, kompilasi/prerender lulus |
| Motion unit | Sampel finite, sudut/bukaan terbatas, fase loop kontinu dan seam halus. Gripper tegak, travel tool >0,15 unit; 129 pose geometri berada dalam workspace, di atas fixture, keyboard tidak menembus tabletop |
| Geometri | 335 mesh, 107.980 rendered triangle termasuk instances, 161 geometri bersama, 12 tekstur. Budget lama 350 mesh/150.000 triangle dipertahankan. Tidak termasuk biaya shadow/environment |
| `robot-motion-browser.js`, produksi | Piksel robot berubah dengan kamera tetap. Pause membekukan piksel secara identik dan menghentikan render; resume kembali bergerak. Simulated hidden tab, Home, reduced motion dinamis dan static menghentikan loop. Explicit Play tidak melewati reduced-motion robot fallback. Portrait 390×844 bergerak, overview Explore aktif, Show Text memulihkan native scroll; page error kosong |
| Render cap | Sampel produksi akhir mencatat 30 frame selama interval capture terukur; assertion memeriksa batas sekitar 30Hz berdasarkan timestamp aktual. Bukan benchmark FPS, frame pacing atau perangkat fisik |
| `personal-lab-browser.js`, produksi | Orbit/reset/Escape, 1 canvas/no ASCII, hidden/inert/fokus, 20 route dengan renderer sama, context loss/retry/static, WebGL blocked dan touch/reduced-motion lulus; page error kosong |
| Reset piksel Home | Keyboard identik; mouse mean 0,000002315/255, fraction 0,000006944; toleransi lama tidak dilonggarkan |
| `personal-lab-rendering.js`, produksi | Home idle 0 render tambahan selama 1 detik, interaksi 2 render; settle/resize lulus |
| `lab-camera-browser.js`, produksi | 206 view matrix perantara pada Home → Projects; renderer sama. Robot bergerak pada overview, direct Projects, retarget/history, immediate drag, Escape global, pause/reduced/hidden, scroll restore, static/re-enable dan no-WebGL lulus; page error kosong |
| `personal-lab-smoke.js`, produksi | Empat route/anchor/active nav, draft/404, reflow 320–1440 tanpa panel/kontrol bertumpuk, pause/typing/reduced, keyboard/fokus, touch dan tanpa JS lulus; page error kosong |
| Source lint lokal | CSS/SceneHost/MotionProvider/EmptyState: 0 FAIL / 0 WARN |
| Capture | Home/Projects/overview masing-masing pada 1440×1000, 768×1024 dan 390×844; poster scene-only serta screenshot HTML produksi. Semua WebP berjumlah 380.460 byte |

Log dan artefak lokal: `.taste-skill/lab-views/robot-motion-*`. Pose unit dibaca dari geometri world aktual, bukan hanya nilai state. Uji motion memakai screenshot canvas scene-only dan hitungan clear main framebuffer. Mask HTML/controls saat tes piksel mengikuti helper QA sebelumnya agar transisi warna tombol tidak dianggap perubahan robot; assertion piksel tidak dilonggarkan. Unit boundary juga menangkap roundoff interpolasi bukaan negatif sangat kecil, diperbaiki dengan clamp easing.

## Review dan batas

Review lokal: siluet robot tetap terbaca pada desktop dan portrait; joint, collar, gripper serta mounting lebih jelas. Render awal menemukan panel persegi beririsan dengan housing bulat, kemudian diganti collar melingkar sebelum build/capture final. Keyboard/laci kini mempunyai bentuk yang dapat dikenali. Model tetap stilisasi prosedural; bukan CAD atau klaim alat milik pemilik.

Arah komposisi, warna hangat, panel HTML dan navigasi dipertahankan. Enam screenshot fold/full-page inspector final pada 1440/768/390 dibuka, selain capture pose desktop/portrait. Audit generik tetap **4 FAIL / 4 WARN**: terracotta, jumlah gambar, panel kiri dianggap off-centre, hitungan elemen DOM bergerak rendah; WARN tanpa footage, judul 30px, ambang subjudul dan gap portrait. Robot WebGL bergerak tetapi tidak masuk hitungan motion DOM inspector; hero WebGL mengisi gap portrait. Warna hangat/komposisi sesuai arahan pemilik dipertahankan. Tidak menambah karya, foto atau efek yang tidak dibutuhkan untuk memenuhi meter. Audit belum sepenuhnya lulus; build/tes fungsional dipisahkan dari audit ini.

Critique internal: design 6,5 / usability 7,5 / creativity 7 / content 7; overall dibatasi 6 oleh audit yang masih terbuka. Ini rubric internal, bukan nilai/penerimaan pemilik. Kekuatan revisi ada pada koneksi joint dan lifecycle gerak; kualitas model prosedural/material dan rasa gerak masih terbuka untuk masukan. QA lama robot diam pada QA-ROBOTICS-BAY merupakan riwayat, bukan bukti animasi baru.

Belum diuji: perangkat ponsel fisik, Safari/Firefox, screen reader/zoom lengkap, cold-load/CLS, frame pacing serta GPU/memory/thermal jangka panjang. Render cap mengurangi frekuensi render, bukan jaminan performa seluruh perangkat. Penerimaan pemilik atas model/gerak revisi ini tetap terbuka; konten karya/kontak/CV dan sudut lain belum dikerjakan.

## Reproduksi

Hentikan dev sebelum `npm run build`, lalu `npm start`. Dengan port 3000 aktif, jalankan `playwright-cli open http://127.0.0.1:3000/projects`, urutan suite di README termasuk `tests/robot-motion-browser.js`, lalu capture dan `node scripts/prepare-lab-posters.mjs`. `npm run dev` untuk mengedit; `npm run prototype` tetap studi lama. Jika preferensi tersimpan menampilkan Motion paused, tekan tombol itu untuk Play; OS reduced motion tetap membekukan robot.
