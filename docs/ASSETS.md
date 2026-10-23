# Aset visual — Robotics study

Semua aset produksi disajikan lokal. Objek pada scene adalah ilustrasi konseptual, bukan bukti project atau kepemilikan robot oleh Abdiel.

Implementasi dijeda untuk brainstorming ulang konsep personal pada 23 Oktober 2026. Aset berikut dipertahankan beserta lisensi/sumbernya; belum ada keputusan bahwa robot atau tema ini wajib dipakai pada konsep berikutnya. Tidak ada aset yang diganti/dihapus pada checkpoint jeda.

## Robot

- Model: ABB IRB 52 7/1.2, tujuh visual mesh dari [ROS-Industrial abb_irb52_support](https://github.com/ros-industrial/abb/tree/45f4769d826cf3ac62a65495f2db67b78b0c81df/abb_irb52_support).
- Revision sumber: `45f4769d826cf3ac62a65495f2db67b78b0c81df`. Author menurut package: Michael Ripperger, Levi Armstrong (SwRI); pemelihara ROS-Industrial community.
- Lisensi paket: Apache-2.0. Teks lengkap dan notice ada di `public/models/LICENSE-IRB52.txt` dan `NOTICE-IRB52.txt`; tautan credits tersedia pada caption scene.
- Produksi: `public/models/irb52.glb`, 1.550.104 byte, 26.060 triangle, tujuh mesh, dua material, tanpa tekstur/decoder/dependency eksternal. Ukuran transfer aktual bergantung kompresi server; angka ini ukuran file.
- Transformasi: STL diindeks, dirangkai memakai offset URDF (termasuk offset visual link_4), diubah dari Z-up ke Y-up, diberi pose dan material presentasi. Tidak memakai kontrol atau perhitungan kinematika untuk klaim simulasi akurat.
- Reproduksi: `node scripts/prepare-robot.mjs`. Memakai cache `.taste-skill/robot-source/` jika tersedia, atau mengunduh mesh/lisensi dari revision yang dipatok. Script menyertakan assert struktur, dimensi dan budget; memerlukan akses jaringan bila cache kosong. Tidak dijalankan dalam build aplikasi.
- Kamera pengamatan, gripper ilustratif, meja, baut, kabel dan blok kalibrasi dibuat dengan geometry dalam kode proyek. Bukan bagian dari model robot asli atau klaim konfigurasi perangkat nyata.

Kandidat lain yang ditinjau: aset robot low-poly CC0 (detail kurang sesuai tujuan visual), NASA Robonaut 2 (bentuk humanoid kurang sesuai usulan lengan di meja). Tidak diunduh/dipakai dalam produksi. Aset Clarissa Builds tidak diambil untuk produksi.

## Font

- Libertinus Serif regular Latin: [Google Fonts](https://fonts.google.com/specimen/Libertinus+Serif), `public/fonts/libertinus-serif.woff2`, 23.400 byte.
- Libertinus Sans regular Latin: [Google Fonts](https://fonts.google.com/specimen/Libertinus+Sans), `public/fonts/libertinus-sans.woff2`, 21.868 byte.
- Lisensi SIL Open Font License 1.1 dari repository resmi Google Fonts: `public/fonts/OFL-Libertinus-Serif.txt` dan `OFL-Libertinus-Sans.txt`.
- File Latin resmi fonts.gstatic.com diunduh langsung; tidak memakai salinan font dari bundle referensi. Font lain/bold/italic tidak ditambahkan pada tahap ini.

## Poster fallback

`public/scene/workshop-{desktop,tablet,mobile}.webp` berasal dari render scene produksi ini, tanpa konten HTML, scrim, kontrol, atau UI pengembangan. Pose paused deterministik; tiga framing sesuai ukuran pengambilan 1440×1000, 768×1024 dan 390×844. Poster selalu terlihat lebih dulu; canvas melakukan fade di atasnya ketika model siap. Rasio viewport lain memakai crop, sehingga kecocokan piksel di setiap rasio tidak dijanjikan.

Rekam ulang: jalankan aplikasi pada port 3000, lalu `playwright-cli run-code --filename=tests/capture-workshop.js`. Hasil PNG scene ada di `.taste-skill/workshop/poster-*.png`; konversi ke WebP dengan `sharp` yang tersedia pada dependency Next.js. Jangan mengubah poster dengan menambahkan nama project atau konten halaman.

## Motion/UI

SplitText proyek merupakan adaptasi ringkas konsep [React Bits Split Text](https://reactbits.dev/text-animations/split-text): reveal kata dengan GSAP yang sudah terpasang, SSR terlihat, mengikuti pause dan reduced motion. Versi registry awal yang belum terintegrasi diganti; tidak memuat ScrollTrigger, plugin SplitText, hover spring atau utility Tailwind yang tidak tersedia. Transisi route/kontrol memakai CSS.

Pencarian 21st melalui CLI memerlukan login dan belum tersedia di lingkungan ini. Tidak ada komponen atau kode 21st yang diklaim sudah dipasang; tidak memakai hosted generation/credit. Konteks desain lokal di `.21st/` mencatat keputusan pemilik dan keterbatasan ini.
