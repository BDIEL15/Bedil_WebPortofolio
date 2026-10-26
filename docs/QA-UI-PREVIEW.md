# QA — UI lembut dan layout dummy

26 Oktober 2026. Pemilik meminta tombol yang tidak kotak, UI lebih ramah, serta contoh About/Projects/Writing/Cabinet untuk membayangkan konten terisi sebelum database.

## Implementasi

- Kontrol dan navigasi membulat, active/hover/focus lebih jelas. Palet hangat, font, scene/POV/transisi kamera yang sudah ada dipertahankan. Kontrol Explore dipindah ke alur dokumen pada halaman baca agar tidak menutupi koleksi panjang; saat Hide Text tetap overlay untuk eksplorasi.
- Projects: satu kartu utama dan dua kartu pendamping, ilustrasi SVG asli, kategori/ringkasan/topik dan dialog konteks/proses/kontribusi/refleksi. Writing: tiga contoh daftar catatan yang membuka bacaan. Cabinet: kamera/audio/Power/kaset, sesuai minat yang dipilih, tanpa mengklaim model/album/barang tertentu dimiliki. About: identitas/data nyata, education/focusAreas dari JSON, slot foto dan copy contoh hanya saat preview.
- Mode eksplisit `?preview=1`, diteruskan di navigasi, ditandai Layout preview/Sample dan noindex/nofollow. `?preview=0` atau URL biasa memakai published/empty state asli. Data contoh `src/data/ui-preview.json` diimpor server, bukan disisipkan sebagai konten published; MD/MDX asli tetap melalui loader lama. Tidak membuat kontak/tautan repo/tanggal/metrik/prestasi contoh.
- About/Projects/Writing/Cabinet membaca searchParams di server untuk memilih preview dan metadata, sehingga empat route itu kini SSR on demand; Home/Experience dan pipeline artikel tetap seperti sebelumnya. Preview adalah contoh publik berlabel, bukan mekanisme otorisasi draft. Tidak mencampur contoh dengan API konten published.
- `SampleCollection` mengelola dialog native, fokus/keyboard/Escape, backdrop/Close, sticky toolbar dan scroll lock yang dibersihkan ketika ditutup/unmount. Detail membutuhkan JavaScript; noJS diberi penjelasan, konten asli dan navigasi tetap HTML. Pause/reduced motion mematikan gerak UI tambahan.
- Ini fondasi bentuk tampilan/data. Belum menghubungkan database, upload, dashboard admin, atau detail route permanen untuk setiap karya. Tidak menambah dependency/model/media eksternal/deploy.

## Pemeriksaan

Hasil build dan browser produksi final dicatat di checkpoint TODO. Tes baru `tests/ui-preview-browser.js` memeriksa empat layout pada 1440/768/390/320 px, sample isolation/noindex, navigasi preview, keyboard/Close/Escape/backdrop, toolbar saat scroll, pemulihan fokus/scroll, overflow dan reduced motion. Tes dev awal lulus; ekspektasi fokus disesuaikan agar menerima fokus browser chrome/body pada siklus Tab native, sambil memastikan konten aplikasi di belakang modal tidak dapat menerima fokus.

Final: **build/check 12 tes lulus**, empat suite produksi **ui-preview, personal-lab-smoke, text-transition, lab-camera lulus**, pageErrors kosong. Semua 30 arah navigasi desktop/mobile tetap beranimasi. Hasil tersimpan di `.taste-skill/ui-build.txt`, `ui-prod-*.txt`; whitespace diff dan JSON konteks desain bersih. Tidak mengulang suite geometri/rendering lain karena scene/pose/aset tidak berubah. Browser QA ditutup, produksi sementara dihentikan dan dev dipulihkan untuk review pemilik.

Source lint sembilan file UI: **0 FAIL/0 WARN** sesudah label kecil diperbesar dan nomor dekoratif dihapus. Metadata-only 21st: Portfolio Showcase Grid 29523, rounded Button 135, Editorial service list 37530. Implementasi memakai komponen/platform yang sudah ada, tanpa mengambil kode berbayar/generation; CLI 21st belum tersedia.

## Review visual dan batas

Before Projects tersimpan di `.taste-skill/ui-before`, after di `.taste-skill/ui-after`, screenshot interaksi `ui-<route>-<size>-*.png`. Pemeriksaan generik before 4 FAIL/4 WARN; after pertama 5 FAIL/5 WARN. Label kecil kemudian diperbesar dan kontras About diperkuat; hasil final inspector dicatat pada penutupan. Kartu/pill mengikuti permintaan eksplisit pemilik; palet dan area kosong untuk scene bukan alasan menambah foto/video atau animasi rekaan. SVG/renderer WebGL tidak dipahami sebagai media/motion oleh seluruh aturan inspector. Audit generik tidak dianggap sepenuhnya lulus.

Inspector final produksi: Projects **4 FAIL/4 WARN**, About **6 FAIL/3 WARN**. Tidak lagi ada small-text FAIL pada Projects. Temuan tersisa: palet warm/rust, sedikit raster/footage, kolom teks asimetris terhadap scene, motion DOM sedikit, ruang portrait untuk scene; About menambah empty-screens dan dugaan eyebrow dari tautan View real content. Scene WebGL tetap mengisi layar; tautan mode bukan judul dekoratif. Pemeriksaan sebelum/sesudah dibuka pada tiga ukuran, serta contoh desktop About/Cabinet dan detail Writing mobile. Perangkat fisik/audit generik menyeluruh tetap terbuka; tidak mengklaim skor ini lulus.

Belum diuji pada HP fisik, Safari/Firefox, screen reader lengkap atau performa GPU/memory jangka panjang. Dummy bukan materi siap publikasi dan bukan bukti integrasi database. Preview lokal: `npm run dev`, buka `/projects?preview=1`; mode asli `/projects?preview=0`. Pemeriksaan `npm run check`; hentikan dev sebelum `npm run build`, lalu `npm start`. Prototype tetap `npm run prototype`. Tidak stage/commit/push/deploy.
