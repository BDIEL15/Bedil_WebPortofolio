# QA — batas baca dan footer tetap

26 Oktober 2026. Pemilik melaporkan teks menumpuk dengan header saat scroll dan meminta nama/Personal lab tetap di tempat.

## Implementasi

- `ReadingFrame` mengukur main/header/footer pada mount, route, resize dan scroll. Clip main mengikuti batas bawah header +16 px dan atas footer −16 px. Tidak menutup scene dengan panel baru, mengganti native document scroll, menambah React state per frame atau dependency. Scroll handler passive dijadwalkan satu RAF; observer/listener dibersihkan.
- Root scroll-padding mengikuti batas; fokus keyboard di main dibawa ke area baca. Dialog native tetap pada top layer. Mekanisme batas dinamis memerlukan JavaScript; HTML/navigasi tetap tersedia tanpa JavaScript.
- Footer fixed kiri bawah, safe area, di atas kontrol pada mobile; Home footer tetap hidden. Footer tidak ikut snapshot/fade route lagi. Main tetap fade-through; scene/kamera/motion/poster tidak berubah. Hide Text tetap menyembunyikan seluruh konten baca.
- CSS/main native scroll dan komponen footer proyek dipakai kembali. Metadata 21st Footer with Navigation Grid 28291 dan Footer with Suite 29773 tidak sesuai footer identitas ringkas; tidak mengambil kode/generation/dependency. `21st` CLI tidak tersedia di PATH, sehingga `21st review` tidak dijalankan; source lint dan browser QA dipakai untuk verifikasi.

## Pemeriksaan

- `npm run build`: sukses, termasuk TypeScript, validasi konten, 13 tes dan syntax prototype. Percobaan check awal di sandbox berhenti pada `uv_os_get_passwd ENOMEM`; ulang di luar sandbox berhasil. Bukan error aplikasi yang tersisa.
- Source lint empat file: 0 FAIL/0 WARN. Diff whitespace bersih.
- Dev: enam route pada 1440/390/320 px, scroll, footer stasioner, clearance kontrol, overflow dan fokus keyboard lulus. Screenshot scroll About desktop/mobile dibuka.
- Produksi: reading-frame (1440/768/390/320), navigation dan UI preview lulus; semua pageErrors kosong. Tes UI preview kini menunggu cleanup scroll lock React setelah native dialog tertutup; percobaan awal terlalu dini memeriksa style body. Tidak mengubah runtime dialog.
- Transisi produksi lulus: seluruh 30 arah desktop dan mobile, heading/nav stasioner, rapid clicks, keyboard/history/pause/reduced, browser tanpa API, native capture skipped, slow 404 dan tab hidden. PageErrors kosong. Percobaan awal timeout pada waitForFunction; ulang penuh lulus, diagnostik progress/route/status ditambahkan ke error tes untuk kegagalan berikutnya. Tidak mengubah runtime transisi untuk mengakali tes.

## Review visual dan batas

Screenshot inspector desktop/tablet/mobile serta screenshot scroll dibuka. Header terpisah dari teks saat scroll, footer sejajar identitas kiri dan di atas kontrol mobile. Tidak menambah kotak pada daftar Experience.

Inspector generik About preview menghasilkan 6 FAIL/4 WARN; bukan klaim audit penuh lulus. Temuan: accent hangat, sedikit gambar raster, komposisi asimetris, hitungan motion/empty screen yang tidak mewakili canvas 3D, tautan preview yang dibaca sebagai eyebrow; pill nav, tanpa footage, jumlah ukuran font dan footer mobile 12 px. Warna/komposisi/pill/gerak mengikuti desain yang sudah dipilih pemilik; foto/video tidak direkayasa untuk memenuhi meter, tautan preview tetap fungsional. Footer 12 px adalah identitas sekunder, konten utama tetap ukuran semula. QA HP fisik, browser selain Chromium, zoom/screen reader menyeluruh tetap terbuka.

Log: `.taste-skill/reading-frame-build.txt`, `reading-prod-*.txt`, `reading-frame-inspect.txt`. Browser QA ditutup, server produksi sementara dihentikan dan dev dipulihkan untuk review. Perintah tetap: `npm run dev`, `npm run check`, `npm run prototype`; hentikan dev sebelum `npm run build`, lalu `npm start`. Tidak stage/commit/push/deploy.
