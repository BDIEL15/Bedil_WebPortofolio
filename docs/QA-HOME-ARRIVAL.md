# QA — fade masuk teks Home

Pemilik melaporkan headline/interest/deskripsi/ikon muncul tiba-tiba setelah opening.

## Perubahan

Penyebab: opacity dipasang pada ReadingContent yang memakai display:contents sehingga tidak memiliki box untuk difade. CSS reveal juga bergantung pada atribut boot yang dihapus setelah kamera selesai. HomeArrival sekarang menggerakkan opacity elemen aktual melalui WAAPI, dengan lifetime tersendiri: header/judul pada 0ms, interest 100ms, deskripsi 220ms dan ikon 360/405/450/495ms. Durasi 650–900ms; tidak ada translate, resize, word splitting atau blur.

Bootstrap menandai cold entry Home sebelum first paint. Pending disembunyikan dengan visibility, tetap mempertahankan layout; timeout 15s membuka fallback bila hidrasi gagal. Home yang dilewati animasi 3D karena sesi sudah dilihat tetap mendapat reveal teks pada dokumen baru. Navigasi kembali Home memakai transisi route biasa dan tidak memutar reveal awal lagi. NoJS/pause/reduced tetap langsung terbaca; fokus/hidden/Skip menyelesaikan animasi. Observer/listener/animation dibersihkan; Strict Mode dapat memulai ulang setup yang dibatalkan sebelum paint.

InterestLine berhenti selama boot; ketika mulai fade, frasa pertama masih lengkap dan baru kemudian melanjutkan ketik/hapus. Kamera, terminal, vignette, data profil, aset dan dependency tidak berubah. Motion controls/caption tetap memiliki fade aktual, wrapper reading-content tidak lagi diberi animasi yang tidak bekerja.

## Pemeriksaan

- Check TypeScript/konten/15 tes lulus; source lint tiga file 0/0.
- Suite arrival dev desktop/mobile lulus: nilai opacity judul mendahului ikon, posisi heading stabil, keyframe hanya opacity, urutan delay tepat dan penghapusan atribut boot tidak memotong animasi.
- Cached-session reload tetap fade; route return tidak menambah animasi. Reduced, saved pause, noJS dan Pause saat reveal tetap terbaca; pageErrors kosong.
- Build/check 15 tes dan suite produksi arrival/boot/navigation lulus; pageErrors kosong. Snapshot tengah fade dan hasil akhir desktop/mobile dibuka: headline terlihat lebih dahulu, deskripsi/ikon menyusul tanpa pergeseran teks. Boot suite juga memeriksa Skip, reduced/paused/static/noJS, deadline/retry dan first-paint fallback; navigasi desktop/tablet/mobile/small lulus.

Pemeriksaan HP fisik, Safari/Firefox dan screen reader menyeluruh belum dilakukan. Tidak menambah dependency/model/poster, tidak stage/commit/push/deploy. Perintah tetap npm run dev/check/prototype; hentikan dev sebelum build/start.

Log `.taste-skill/home-arrival-build.txt`, `home-arrival-lint.txt`, `arrival-prod-*.txt`. Browser QA ditutup, produksi sementara dihentikan dan dev dipulihkan. Animasi dapat dicoba dengan refresh Home tanpa harus mengulang sesi 3D; Pause/reduced memang melewatinya.
