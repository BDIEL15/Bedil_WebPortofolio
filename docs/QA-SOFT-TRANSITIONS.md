# QA — teks menetap dan kamera lebih halus

26 Oktober 2026. Pemilik melaporkan teks meloncat/kaku saat berganti halaman dan meminta perjalanan kamera lebih halus. Pose/aset/konten tetap, tanpa dependency baru.

## Addendum: animasi terpotong pada beberapa arah

Pemilik melaporkan About→Projects→Writing→Cabinet beranimasi, tetapi arah lain, terutama kembali ke Home, terasa terpotong. Urutan normal pada browser QA 1280×720 tidak menunjukkan kegagalan; dua jalur kegagalan kemudian direproduksi secara terkontrol pada kode sebelum koreksi:

- Melewati native capture setelah route commit menghasilkan halaman baru tanpa fade. Tes menunggu incoming fade selama 15 detik lalu gagal. Sebelumnya `ready` rejection diabaikan, sementara route commit telah ditandai ditangani native. Kini kegagalan capture menunggu update callback, lalu menjalankan fade cadangan hanya untuk request terbaru dan motion yang diizinkan. Route lambat, navigasi usang, pause/reduced/hidden tetap ditangani terpisah.
- Mengubah lebar viewport 1440→1423 di tengah flight membuat `data-camera-motion` langsung idle. Resize memanggil `moveToView(false)`, sehingga melompat ke pose akhir. Kini resize saat bergerak menarget ulang dari pose/kecepatan saat ini; saat idle tetap langsung menyesuaikan framing. Pause/hidden tetap menyelesaikan flight dengan sengaja. Perubahan scrollbar adalah kemungkinan pemicu resize, belum bukti pemicu di browser pemilik.

Tes navigasi diperluas menjadi semua 30 arah antar-enam halaman pada desktop dan mobile, termasuk setiap jalan kembali ke Home. Pemeriksaan kini menuntut animasi teks dan kamera pada setiap pasangan, bukan hanya jumlah frame selama klik cepat. Kode/perilaku fallback memakai komponen dan API yang sudah ada; tidak menambah dependency atau mengubah pose/aset/konten. Hasil final koreksi dicatat pada checkpoint TODO.

Hasil final koreksi: build/check **12 tes lulus**, empat suite **produksi** (text-transition, cinematic-camera, lab-camera, personal-lab-smoke) lulus, pageErrors kosong. Seluruh 30 arah desktop/mobile beranimasi; kembali ke Home merekam >12 matrix kamera berbeda pada kedua ukuran. Native skip mendapat incoming fade; resize tetap moving sampai tujuan; pause/reduced/hidden tetap menghentikan motion. Source lint dua file produksi berubah **0 FAIL/0 WARN**; diff whitespace bersih. Log `cut-*.txt` dan frame `cut-native-fallback.png` berada di `.taste-skill/lab-views/`; frame fallback telah ditinjau. Tidak mengulang empat suite lain dari milestone sebelumnya karena pose/geometri/aset tidak berubah.

Ekspektasi tes tambahan bahwa fixture 404 wajib mempunyai fade ditemukan keliru: probe menunjukkan Next mengganti dokumen pada URL tersebut (sentinel/probe di window hilang), sehingga bukan transisi route dalam dokumen yang sama. Assertion tambahan itu dihapus, pemeriksaan guard/404 tetap, lalu keempat suite diulang dan lulus. Tidak mengubah aplikasi untuk memaksa animasi initial load/404. Pemindaian lint menyeluruh yang tidak sengaja dijalankan dengan argumen `--help` menemukan dua aturan desain pada prototype lama (gradient/shadow); prototype dipertahankan sesuai scope, hasil lint file produksi berubah dipisahkan. Batas audit generik/QA fisik di bawah tetap terbuka.

## Perubahan

- Dua gerak bertumpuk dihapus: translateY konten 240ms dan reveal judul 6px per kata. SplitText kini menghasilkan heading HTML biasa; satu pemilik transisi mengatur fade keseluruhan teks dan footer. SSR/noJS tetap terbaca dan typing Home tetap stabil.
- Pada browser dengan View Transitions, main/footer lama dan baru memakai nama snapshot berbeda. Kelompok tidak menganimasikan posisi/ukuran: lama fade keluar 160ms, baru fade masuk 520ms setelah 160ms. Main menyertakan background baca mobile. Root/canvas tidak masuk snapshot; pseudo-element tidak menangkap pointer, sehingga navigasi cepat tetap dapat digunakan. Tidak membuat salinan DOM/fokus/ID duplikat.
- Capture menunggu commit route; guard 350ms melepas snapshot jika route lambat. Token request menolak callback usang, pause/reduced/hidden/history/unmount membatalkan capture/animasi. Modifier click/download/tautan eksternal/hash/query pada path sama memakai perilaku normal. Browser tanpa API dan Back/Forward memakai incoming fade tanpa translasi; initial load tetap langsung terbaca. View Transition tetap mempunyai jeda capture singkat, bukan jaminan tanpa jeda pada setiap perangkat.
- Reading scrim Home mempunyai lapisan opacity sendiri, agar pergantian radial Home ke scrim route lain memudar. Hide Text/pause/reduced tetap dihormati. Helper screenshot scene-only diperbarui untuk menyembunyikan lapisan tersebut, tanpa mengganti poster/aset.
- Satu loop renderer kini cap 60Hz selama flight, kembali 30Hz saat kamera menetap; pause/hidden/static/dispose tetap menghentikan loop. Durasi nominal route 1,5–2,35 detik, overview 1,95/reset 1,25; entry tetap 2,6/2,1. Arc diperkecil menjadi pullback maks 0,25/lift 0,08, lens breathing dihapus. Kontinuitas kecepatan dan pengereman aman sebelumnya tetap. Ini cap render, bukan klaim FPS perangkat fisik.

## Pemeriksaan

- TypeScript, 12 tes konten/geometri/lintasan/lifecycle loader serta syntax prototype lulus; 280 lintasan awal/5.880 retarget, batas lama dan pose robot tetap diperiksa. Source lint empat file UI 0 FAIL/0 WARN.
- Build final/prerender dan delapan suite produksi lulus: text-transition, smoke, story, kamera, motion, lifecycle, render probe dan cinematic entry. Semua suite yang merekam pageErrors kosong. Tes baru memeriksa heading/nav stabil pada desktop/mobile, native opacity-only, klik cepat, Enter/history, pause/reduced, feature-disable fallback, route tertunda dan hidden sebelum callback. Klik yang segera diikuti hidden sempat membatalkan request usang; pemisahan skip animasi dari pembatalan navigasi diperbaiki, lalu build dan seluruh delapan suite diulang.
- Tes native merekam 70 frame desktop / 69 mobile pada urutan klik cepat, bukan klaim FPS. Kamera umum mendapat 61 matrix Home→Projects; reset keyboard/mouse mean/fraction sama dengan 0. Render probe Pause idleDelta 0 / interactionDelta 2. Pose/geometri/21 poster tetap dan tidak diregenerasi; helper screenshot sudah meniadakan kedua scrim untuk scene-only.
- Pengujian dev sempat terganggu Fast Refresh setelah perubahan batas server/client; produksi menjadi bukti akhir. Assertion awal tes 404 memakai heading default, dikoreksi menjadi heading nyata `Out of view.`; error tersebut bukan perilaku aplikasi.
- Metadata 21st: Page Transition 29262 / Blur Fade 1079. Memakai platform browser dan komponen proyek; tidak mengambil kode berbayar/generation/remote source review. Acuan API: [MDN View Transitions](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API/Using), [Next useRouter](https://nextjs.org/docs/app/api-reference/functions/use-router). CLI 21st belum tersedia; source lint lokal dipakai.

## Review visual

Home inspector **4 FAIL/4 WARN**, About **4 FAIL/3 WARN**; audit generik belum sepenuhnya lulus. Dua belas screenshot fold/halaman desktop/tablet/mobile dibuka, serta empat frame fade native desktop/mobile. Heading/teks baru menetap pada posisinya dan fade keluar/masuk tidak menumpuk kata. Gambar awal Home inspector dapat berada pada opening; ini bukan frame untuk menilai pose akhir.

Temuan mencakup rust accent, jumlah gambar/footage, gerak DOM, margin/blank gap dan judul pendek. Palet/satu scene/konten editorial mengikuti arah pemilik; canvas/motion tidak dihitung sebagai foto/animasi DOM. Tidak menambahkan foto/video rekaan, blur atau animasi dekoratif untuk memenuhi meter. Konten dan foto asli tetap belum lengkap.

ROUND 2
Seen in one second: teks baru muncul lewat fade di depan perjalanan kamera yang tetap berjalan.
Idea: satu alur opacity mengatur konten, judul menetap dan kamera menjaga gerak ruang.
Live thing: fade-through, tempo kamera/adaptive render serta aktivitas workbench yang sudah ada.
Layout: Home intro tengah; route lain teks editorial/objek; portrait scroll biasa.
Scores: design 6.5 · usability 7.5 · creativity 7.5 · content 5 → overall 6.0 setelah cap audit/konten belum lengkap, bukan nilai pemilik.
Top fixes: hilangkan translasi ganda; fade-through tanpa dua teks bertumpuk; haluskan scrim serta cap/arc/tempo kamera.
Remaining: masukan pemilik dan pengukuran perangkat fisik, bukan penambahan komponen katalog.

## Batas dan menjalankan

Belum diuji pada HP fisik, Safari/Firefox, screen reader/zoom lengkap, CLS/GPU/memory/thermal jangka panjang. Mode tanpa View Transitions diuji melalui feature disable di Chromium, bukan klaim browser lain. Frame rate lebih tinggi selama flight dapat menambah beban GPU sementara; budget geometry/material/DPR tidak dinaikkan. Foto/konten asli masih belum lengkap. Preview `npm run dev`, check `npm run check`, studi `npm run prototype`; hentikan dev sebelum `npm run build`, kemudian `npm start`. Tidak stage/commit/push/deploy.

Penutupan: browser QA soft ditutup, server produksi sementara dihentikan setelah verifikasi command line repository. Preview dev dipulihkan di http://127.0.0.1:3000/ dan melaporkan Ready. Perubahan tersimpan di file; coba refresh lalu Home→About→Writing saat motion aktif untuk meninjau fade baru.
