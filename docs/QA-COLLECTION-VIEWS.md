# QA — Writing dan Cabinet dalam satu workbench

24 Oktober 2026. Pemilik mengizinkan kelanjutan POV Writing pada pegboard kanan di belakang robot dan Cabinet pada rak. Ini melanjutkan workbench kompak dan motion lintasroute, bukan menambah meja/ruang baru. Seluruh perubahan lokal dari milestone sebelumnya dipertahankan.

## Implementasi

- Writing: dua lembar sketsa asli NOTES/IDEAS dengan penjepit dan satu slip pada pegboard kanan; robot tetap menjadi foreground bergerak. Komposisi desktop miring ringan, portrait lebih lurus. Kertas diposisikan di luar ruang tengah intro Home. Grafis generik tidak mengambil judul/konten draft dan bukan artikel pemilik.
- Cabinet: close/medium pada dua case rak yang sudah ada, ditambah handle/slot/rivet sederhana. Notebook/About, dokumentasi/Experience dan robot/Projects tetap pada workbench yang sama. Tidak mengarang isi koleksi, kontak, kontribusi atau karya.
- Enam view baca berbeda; satu overview identik lintasroute saat Hide Text. Robot/monitor tetap berlanjut selama nav/Explore, notebook hanya menulis pada About. Pause/reduced motion/hidden/static/dispose tetap mengendalikan satu loop.
- Writing/Cabinet memakai pola HTML/editorial/scrim yang sudah ada, dengan scene di atas konten dan native scroll di portrait. JSON/published Markdown/MDX serta empty state tidak diubah. Nested writing memakai sudut Writing dengan layout artikel biasa; belum ada artikel published untuk uji browser detail artikel. Mapping diuji unit, kompilasi trusted MDX tetap dalam check konten.
- SceneHost memetakan label/deskripsi aksesibel enam view; routing dan data-page membedakan koleksi dari artikel. Bake statis kini mengubah world transform ke koordinat lokal root sebelum penggabungan, sehingga pegboard tidak terkena offset dua kali. Tidak ada dependency atau aset eksternal baru.
- **212 mesh / 63.400 rendered triangle termasuk instances / 138 geometri / 9 tekstur.** Budget lama <350 mesh/<150.000 triangle tidak dilonggarkan. Enam POV + overview × tiga ukuran = **21 poster aktif / 687.460 byte**, seluruhnya diperbarui dari build final dengan Pause/fase awal deterministik. 12 state UI × tiga ukuran direkam untuk regresi.

## Verifikasi aktual

| Pemeriksaan | Hasil |
| --- | --- |
| Build/check | TypeScript, 10 tes konten/kamera/geometri/motion/aset lama, syntax prototype, kompilasi/prerender Next lulus |
| Unit POV | Enam view berbeda, shared overview fit pada lima rasio. Seluruh geometri tetap satu bounds dan satu meja/keyboard. Bounds kertas dan case diproyeksikan ke frame 320×844,390×844,768×1024,1440×1000,2560×1080 |
| Story/collection browser | About/Experience/Writing/Cabinet berbeda, renderer sama, aktivitas berlanjut, Hide Text/orbit/reset/Escape/fokus, Writing↔Cabinet history/direct URL, native scroll/reduced/static/no-WebGL/re-enable lulus; koleksi kosong tetap jujur, tiga peran nyata tetap benar |
| Smoke | Enam route/heading/active nav/reflow320–1440, draft/404, pause/typing/keyboard/reduced, touch/noJS lulus |
| Kamera | 38 view matrix perantara Home→Projects; retarget/history/immediate drag/hidden/pause/reduced, overview/fallback/scroll lulus |
| Motion | Crop piksel monitor dan robot Home, notebook About, Pause/freeze/resume/cap, hidden/reduced/static dan portrait lulus. 32 frame dalam interval sampel bukan klaim 32 FPS |
| Lifecycle | Satu canvas, 20 route reuse, orbit/reset/fokus, context loss/poster/retry/static/re-enable dan WebGL blocked lulus. Reset keyboard identik, mouse mean 0,000000772/255 dan fraction 0,000002315, toleransi lama tetap |
| Render probe | Dengan Pause aktif: idleDelta 0, interactionDelta 2 dan resize lulus |
| Source lint | CSS, SceneHost dan MotionProvider: 0 FAIL/0 WARN |
| Capture | Desktop/tablet/mobile Writing/Cabinet, dampak Home dan poster final dilihat. Review inspector dicatat di bawah |

Keenam suite browser produksi lulus dengan page error kosong. Log/artifak: .taste-skill/lab-views/collections-*. Unit pertama menangkap ekspektasi lama 4 view (kini 6) dan clipping hero pada ponsel 320px; kamera diperbaiki, bukan toleransi dilonggarkan. Sesudah review visual, target Cabinet portrait diturunkan agar rak tampil lebih tinggi; build/check/capture dan seluruh suite diulang pada versi final. Poster baru sempat404 pada dev sebelum capture/converter; produksi final memakai 21 file yang tersedia. Assertion static awal menilai img segera setelah route/overview berubah; helper kini menunggu img route yang diharapkan selesai dimuat, lalu tetap memeriksa naturalWidth/prefix. Final static/noGL/noJS lulus.

## Review dan batas

Pencarian metadata 21st editorial notes/archive mengembalikan Editorial service list 37530 dan Editorial Hero 19075. Pola accordion/numbering/hero foto tidak sesuai brief; tetap memakai Navigation/SplitText/SceneHost/EmptyState dan layout lokal. Tidak mengambil source komponen berbayar, memakai generation atau mengirim source ke review eksternal. CLI 21st tidak tersedia pada lingkungan ini; source lint lokal dan browser dilakukan.

Dua belas screenshot inspector Writing/Cabinet final telah dibuka (fold dan halaman, desktop/tablet/mobile). Masing-masing **4 FAIL / 4 WARN**. Temuan generik mencakup palet terracotta hangat, sedikit gambar raster, hitungan motion DOM dan komposisi panel; tanpa footage, ukuran judul/subjudul dan gap portrait. Brief satu scene 3D, palet hangat dan konten jujur dipertahankan; audit tidak diklaim sepenuhnya lulus.

ROUND 2
Seen in one second: Writing adalah catatan pada pegboard, Cabinet adalah case pada rak di workbench yang sama.
Idea (one sentence): bidang catatan dan penyimpanan menjadi penanda dua koleksi personal tanpa memecah meja menjadi ruang baru.
Live thing: navigasi kamera, Hide Text/Explore dan aktivitas robot/monitor yang berlanjut.
Layout words by section: desktop=HTML kiri dengan objek di kanan / portrait=scene di atas alur baca.
Scores: design 6.5 · usability 7.5 · creativity 7 · content 6.5 → overall 6.0 dengan cap audit generik.
Caps applied: gambar raster/aturan DOM dan audit belum nol; bukan nilai pemilik.
Top three problems and fixes:
1. Kertas/kotak terpotong di 320px (unit/capture awal): lensa portrait diperlebar, bounds hero final utuh tanpa mengubah assertion.
2. Case desktop terlalu dekat tepi kanan (Cabinet desktop awal): target horizontal digeser sehingga dua case tampil utuh.
3. Rak portrait terlalu rendah dan catatan hampir menyentuh intro Home (capture awal): target portrait Cabinet dikoreksi; kertas diperkecil/digeser ke kanan.
Remaining: case dan sketsa masih ilustrasi generik; materi koleksi/tulisan nyata diperlukan. Penerimaan visual pemilik terhadap kedua POV masih terbuka. Tidak menambah gambar/footage atau animasi HTML demi meter generik.

Belum diuji: HP fisik/Safari/Firefox, screen reader/zoom lengkap, cold-load/CLS dan frame pacing/GPU/memory/thermal jangka panjang. Statistik geometri dan cap bukan benchmark perangkat. Tidak stage/commit/push/deploy. Prototype/analysis/studi/model/lisensi dipertahankan.

## Menjalankan kembali

Edit/preview: npm run dev. Studi lama: npm run prototype. Check: npm run check. Hentikan dev sebelum npm run build, lalu npm start. README memuat urutan enam suite browser; tests/story-corners-browser.js sekarang meliputi empat view. Capture: tests/capture-lab-views.js, lalu node scripts/prepare-lab-posters.mjs.

Akhir sesi: file tersimpan lokal; browser QA ditutup, produksi sementara dihentikan dan preview dev aktif kembali di http://127.0.0.1:3000/. Tidak stage/commit/push/deploy.
