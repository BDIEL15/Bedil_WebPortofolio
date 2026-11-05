# Hasil eksekusi komposisi portofolio — 4 November 2026

Rencana: `docs/superpowers/plans/2026-11-04-portfolio-composition.md`.

## Hasil

- Home tetap di tengah. About dan Experience kini kolom tengah dengan paragraf/timeline rata kiri. Projects tetap kiri dan robot kanan. Writing/index dan artikel memakai kolom tengah. Cabinet menjadi galeri tengah lebih lebar.
- Desktop 1440px: About/Writing/artikel 640px, Experience 672px, Cabinet 960px. Pusat blok berada tepat pada pusat viewport; Projects mempertahankan offset -288px. Mobile 390px: semua blok 350px dengan margin 20px.
- Scrim mengikuti komposisi baca; tanpa panel portrait. Kamera, geometri, navigasi, poster dan identitas visual tetap.
- Artikel kini memakai clipping ReadingFrame yang sudah ada, sehingga paragraf tidak menggambar di belakang header/footer. Tidak perlu menambah sistem pengukuran baru. Akhir konten tetap dapat dijangkau dengan scroll/fokus.
- Detail proyek menampilkan judul dan intro sebelum gambar. Galeri satu foto tanpa panah/counter yang tidak diperlukan; galeri jamak dan preview PDF/feed Writing mempertahankan kontrol keyboard.
- Accessible label static + Hide text tidak lagi menjanjikan drag/arrow yang tidak tersedia.
- Tiga texture foto badge berubah dari 1.769.632 menjadi **80.776 byte**, pengurangan **95%**. Original PNG tetap, derivative WebP maksimal 512×512 dan alpha dipertahankan. Ketiga derivative terbukti dimuat oleh scene produksi.
- Copy EXERCISE: “My work focuses on UI development for the Exertion 2026 website.” sesuai konfirmasi pemilik. GDGoC tetap Community Member dengan deskripsi komunitas singkat, tanpa klaim kontribusi. IME diringkas memakai kontribusi yang sudah ada; kalimat Lab diperbaiki tanpa mengubah tugas/role/tanggal.
- Judul “Tugas Bidang”, bahasa Inggris artikel, dan format daftar Writing tanpa ringkasan dipertahankan.

## Verifikasi

| Pemeriksaan | Hasil | Bukti |
|---|---|---|
| Regresi baru komposisi | 100 checks lulus; sebelumnya 16 gagal sebelum implementasi | `red.txt`, `green.txt` |
| Fixed collection headings | 4 route × 4 viewport lulus | `collection-heading-browser.txt` |
| ReadingFrame | 6 route × 4 ukuran, fokus/scroll/footer lulus | `reading-frame-browser.txt` |
| Navigasi | Rapid clicks, history, keyboard, marker, pause/reduced, resize lulus | `navigation-browser.txt` |
| Preview dan dialog | Desktop/tablet/mobile/small; modal fokus/scroll/Close/Escape, isolasi sample lulus | `ui-preview-browser.txt` |
| Kontrol scene | Home-only controls, Hide/Show, rotasi, Escape dan preferensi static lulus | `home-scene-controls-browser.txt` |
| Akhir bacaan | Final About link/artikel paragraph terlihat di atas footer pada 320×568, 390×844, 844×390 dan 1440×1000 | `portfolio-reading-browser.txt`, `end-*.png` |
| Shared gallery | Bank Vault next/left keyboard, Writing PDF page 2, reduced motion dan noJS lulus | `portfolio-reading-browser.txt` |
| Check | TypeScript, content validation/compilation, 17 tes, prototype syntax lulus | `check.txt`; diulang oleh build |
| Build produksi | Lulus, exit 0 | `build.txt` |
| Smoke produksi | 7 route × 2 ukuran HTTP 200, overflow 0, pageErrors [], dialog fokus kembali, 3 derivative dimuat, renderer tetap saat client navigation | `production-smoke.txt`, `final-*.png` |
| Review kode independen | Tidak ada actionable introduced defect; pemeriksaan runtime lanjutan selesai melalui suite tambahan | `progress.md` |
| Detector Impeccable | 0 temuan | `detector-final.json` |
| Taste inspector About | 1440/768/390 selesai; semua fold/page sheet dibuka | `taste-final.json`, `taste-final/` |

Taste inspector tetap memberi FAIL house-style untuk jumlah foto dan jumlah elemen bergerak; canvas 3D tidak masuk hitungan motion. WARN pill navigation, tidak ada footage, dan teks footer kecil berasal dari pilihan brief/implementasi yang dipertahankan. Lint source mendeteksi fade-mask bacaan yang sudah ada serta kata shadow di komentar; tidak diperlakukan sebagai alasan menghapus identitas. Tidak mengklaim gate taste mentah 0 FAIL.

Scrim dan keterbacaan ditinjau dari screenshot aktual, termasuk artikel awal/akhir dan Experience. Tidak ada sertifikasi WCAG, pengukuran kontras pixel menyeluruh, tes screen reader fisik, atau benchmark Core Web Vitals produksi. Viewport browser tidak menggantikan review HP fisik.

## Bukti visual untuk pemilik

- [About sebelum](before-about-1440.png) → [About akhir](final-about-1440.png)
- [Experience sebelum](before-experience-1440.png) → [Experience akhir](final-experience-1440.png)
- [Cabinet sebelum](before-cabinet-1440.png) → [Cabinet akhir](final-cabinet-1440.png)
- [Writing akhir](final-writing-1440.png)
- [Detail proyek mobile](final-project-detail-390.png)
- [Akhir artikel mobile](end-writing-dua-pilihan-satu-perjalanan-390.png)
- [Experience 3D desktop](final-experience-3d-1440.png), [mobile](final-experience-3d-390.png)

## Keputusan pelaksanaan

- Memakai checkout berjalan karena konten/aset pemilik belum committed. Baseline file yang disentuh disalin sebelum edit; perubahan lain tidak direvert atau di-stage. Rincian ada di `baseline/` dan `baseline-status.txt`.
- Memperbaiki pengecualian clip artikel pada lapisan CSS yang bertanggung jawab; `ReadingFrame` tidak perlu dimodifikasi. Risiko coupling baru dihindari; regresi akhir bacaan/fokus sudah dijalankan.
- Beberapa tes lama mengasumsikan konten kosong, bahasa Indonesia, document scroll koleksi, serta satu nav. Asumsi diselaraskan dengan keputusan pemilik yang sudah ada: 3 proyek published, artikel Inggris, native collection scroll, nav About tambahan, About/Cabinet selalu konten nyata. Source produk tidak diubah demi memenuhi asumsi lama.
- Tes menunggu pengukuran ReadingFrame selesai sebelum menilai posisi, dan menilai clip aktual ketika sticky heading lepas di akhir artikel. Tidak mengubah produk untuk menutupi timing tes atau perilaku sticky yang normal.
- Foto derivative cukup untuk badge kecil; crop UV, urutan dan poster tetap. Tidak menambah dependency runtime, model atau media stok.

Tidak ada commit, push atau deploy. Review pemilik dan perangkat fisik masih terbuka; semua pekerjaan implementasi yang disetujui telah ditangani.
