# Panduan kerja repository

## Konteks dan sumber acuan

**Koreksi arah paling baru — 24 Oktober:** Pemilik menolak pengulangan banyak meja. Arah berikutnya: satu workbench/ruang kompak, setiap halaman fokus satu objek/kelompok benda dengan POV khusus; overview penuh untuk Home/Hide Text seperlunya. Referensi Hamza dipakai untuk komposisi ruang/fokus kamera; Clarissa tetap suasana hangat/editorial. Runtime empat meja yang ada belum direfaktor pada checkpoint ini; jangan menambah meja/sudut lengkap baru. Bukti browser referensi: Projects fokus monitor, Experience fokus kartu di pegboard, About fokus layar robot; satu room overview. Berikutnya konsolidasi props yang sudah ada dan buktikan POV Home/Projects desktop/portrait terlebih dahulu, bukan memperluas variasi meja.

Portofolio personal **Abdiel Deandra EL Dzaky**, mahasiswa Teknik Komputer Universitas Indonesia. Arah konsep terbaru: **lab/workbench elektronik 3D personal**, bentuk sederhana seperti referensi Hamza, material/cahaya hangat dan komposisi editorial tenang seperti Clarissa Builds. Tujuan utama perekrutan dan reach-out; narasi menunjukkan perjalanan pemilik, bahasa utama Inggris.

**Scope terbaru — About/Experience, 24 Oktober:** pemilik mengizinkan kelanjutan kedua sudut setelah rekomendasi di chat. `/about` kini meja baca/notebook/lampu/buku; `/experience` board dokumentasi dengan ilustrasi kategori lab/software/community dan tiga peran nyata dari JSON. Keduanya route terpisah dan kamera/framing/overview tersendiri dalam satu ruang/renderer. Anchor Home lama tetap untuk bookmark. Writing/Cabinet belum mendapat sudut sendiri. Props statis baru dibatch per material; tidak ada dependency/aset eksternal baru. 24 poster melayani delapan pose × tiga resolusi. Acuan terbaru QA-STORY-CORNERS dan TODO; pernyataan About/Experience masih anchor pada riwayat di bawah digantikan.

**Revisi 3D/motion sebelumnya — 24 Oktober:** pemilik memberi respons positif pada arah keseluruhan dan meminta objek 3D diperbagus serta robot bergerak. Robot prosedural kini memakai hirarki turret/bahu/siku/pergelangan/tool, gerak observasi 16 detik dan gripper tetap tegak. Projects aktif merender maksimal sekitar 30 kali/detik selama motion diizinkan; pause/reduced motion membekukan pose, tab hidden/route lain/static menghentikan loop. Home tetap event-driven. Larangan idle animation Projects sebelumnya digantikan permintaan ini. Tidak memperluas sudut lain otomatis. Hasil terbaru: `docs/QA-ROBOT-MOTION.md`.

**Scope robotics sebelumnya — 24 Oktober:** Projects kini memiliki workspace robotics terpisah dalam lab yang sama, dengan lengan/gripper prosedural asli, fixture dan monitor. Pemilik meminta Inspect ASCII dihapus dari aplikasi aktif dan Hide Text langsung mengaktifkan orbit/reset/arrow termasuk touch. Show Text/Escape memulihkan sudut aktif, fokus dan posisi baca; saat teks terlihat Explore tetap eksplisit. Satu renderer, GSAP transisi terbatas dan diam saat idle; pause/reduced motion langsung ke tujuan. Empat pose/12 poster termasuk overview untuk setiap workspace. Acuan terbaru `docs/QA-ROBOTICS-BAY.md`; QA sebelumnya historis. Sudut lain tidak otomatis termasuk scope.

**Revisi terbaru — 24 Oktober 2026:** pemilik meminta pengalaman duduk menggunakan meja, tulisan pada bidang pegboard, bukan pandangan luar seluruh meja. Kamera depan/portrait, posisi intro dan poster diperbarui; keyboard/kabel menjadi foreground. HTML tetap dapat dibaca/diseleksi dan independen dari WebGL; teks tidak mengikuti orbit sebagai mesh. Review Home berikutnya tetap mendahului perluasan sudut/halaman.

Perbaikan props Home berikutnya memakai geometri asli: keyboard 61 keycap, spiral/konektor, panel instrumen, monitor, notebook, alat dan lampu. Bevel/rasio tekstur diperbaiki; enam tes check termasuk keycap tidak bertumpuk dan benda tidak menembus meja. Kamera/intro tetap. Ukuran/budget dan batas QA terbaru ada di ASSETS/QA Home.

**Status kerja terbaru — 23 Oktober 2026:** pemilik mengirim prompt eksekusi dan meminta implementasi dilanjutkan. Mulai dari verifikasi checkout lalu satu bukti visual Home desktop/mobile sesuai REDESIGN-LAB; tampilkan render aktual untuk masukan sebelum memperluas sudut/halaman lain. Konsep lab/workbench personal disetujui (§2.5/§7.7), bukan hasil visual yang belum ditinjau. Home menampilkan meja dan intro/typing; sudut About/Projects/Experience/Writing/Cabinet berikutnya masih tahap lanjutan. Interaksi scene untuk observasi, tanpa game/simulasi wajib. Kandidat benda inti: kabel dan mechanical keyboard; manga/stiker meme tetap tentatif. Konten file-first JSON/Markdown/MDX; database/admin ditunda. Baseline Robotics study/aset/lisensi serta perubahan lokal dipertahankan. Ikuti checkpoint teratas TODO, bukan instruksi jeda historis.

- Kebutuhan produk, arsitektur target, dan UI/UX: [PRD](docs/PRD-PORTOFOLIO.md). Baca bagian yang terkait tugas, bukan seluruh dokumen pada setiap perubahan.
- Urutan pekerjaan dan status: [TODO.md](TODO.md).
- Cara menjalankan serta status kode saat ini: [README.md](README.md).
- Bukti website referensi: `analysis/`; gunakan ketika suatu keputusan membutuhkan hasil REA, bukan sebagai source aplikasi produksi.

Instruksi terbaru dari pemilik menjadi acuan saat keputusan produk berubah. Perbarui bagian dokumen yang terpengaruh agar keputusan tidak saling bertentangan.

## Status kode

`prototype/` tetap studi vanilla JavaScript + Three.js. Aplikasi root Next.js memakai Home duduk, workspace Projects dengan meja robotics sendiri dan overview saat Hide Text. Engine aktif `create-personal-lab-scene.ts`, pose/fit `lab-camera.ts`, geometri `personal-lab.ts` di `src/lib/scene/`; satu renderer dan 24 poster per pose/resolusi. Home merender saat transisi/input/resize; robot Projects bergerak saat terlihat dan motion aktif, berhenti pada pause/reduced motion/hidden/static/route lain. About/Experience memiliki route/sudut sendiri; Writing/Cabinet memakai sudut Home sementara. Materi koleksi kosong tetap jujur. Robotics/Signal study/lisensi disimpan, bukan scene aktif. Baca TODO, QA-ROBOTICS-BAY, QA-LAB-CAMERA, QA-HOME-LAB dan ASSETS; jangan memperluas sudut lain otomatis.

Target produksi: Next.js + React + TypeScript, Tailwind/CSS, Three.js, serta konten JSON dan Markdown/MDX tepercaya. Pemilik memilih file-first untuk versi awal; database/dashboard ditunda. Mobile memakai framing portrait tersendiri, scroll default saat membaca, Explore eksplisit atau otomatis lewat Hide Text. Brief, referensi lokal, tahapan, QA dan handoff: [REDESIGN-LAB](docs/REDESIGN-LAB.md). Eksekusi kini meliputi Home, Projects, About, Experience dan overview masing-masing; sudut lain tidak otomatis termasuk scope. Supabase masih opsional; ManimGX bukan dependency inti.

## Aturan produk dan visual

- Pertahankan latar gelap, teks hangat yang terbaca, navigasi sederhana, dan konten HTML di depan scene.
- Clarissa Builds tetap acuan komposisi/suasana. React Bits dan 21st.dev menjadi sumber kandidat animasi/komponen pendukung; seleksi sesuai PRD §7.5. Transisi harus terasa menyatu, menjaga scroll/input alami, serta mengikuti pause/reduced motion. Jangan mengganti arah visual dengan gaya default katalog.
- Home diam saat idle. Robot Projects boleh bergerak pelan sesuai permintaan pemilik; hentikan loop pada pause/reduced motion, tab hidden, static atau route lain. Transisi kamera mengikuti pause/reduced motion. Inspect ASCII dihapus sesuai permintaan pemilik; jangan memasangnya kembali dari backlog historis. Prototype/studi lama tetap disimpan. Akses karya tidak bergantung pada scene.
- Intro terbaru mengarah ke `Hi, I'm Abdiel.` dengan typing di bawahnya; copy final masih dikurasi. Nama lengkap tetap untuk identitas profil. Gunakan status mahasiswa secara jujur, misalnya `a computer engineering student`, bukan otomatis menyatakan profesi engineer.
- Konten serta navigasi harus tetap berfungsi tanpa WebGL. Sediakan pause, reduced motion, input keyboard dan pengalaman mobile yang tidak mengganggu scroll.
- Jangan mengarang karya, periode jabatan, kontribusi, prestasi, metrik hasil, kontak, atau tautan. Materi belum siap tetap draft.

## Implementasi dan pemeriksaan

- Gunakan solusi paling kecil yang memenuhi tugas. Tambahkan dependency hanya bila kebutuhan yang nyata tidak tertangani kode/platform yang sudah tersedia.
- Pisahkan konten, UI dan engine scene. Hindari React state update per frame. Bersihkan RAF, listener, observer, geometry/material/texture sesuai ownership-nya.
- Konten draft tidak boleh ikut HTML, payload, sitemap, search index atau aset publik. MDX hanya dikompilasi dari sumber milik pemilik yang tepercaya.
- Jika Supabase ditambahkan, terapkan kebijakan akses dan simpan secret key di server. Jangan menganggap menyembunyikan tombol sebagai otorisasi.
- Ikuti pola repository. Jalankan pemeriksaan yang relevan; perubahan UI diperiksa di browser termasuk mobile, focus, pause dan fallback. Jangan mengklaim tes yang tidak dijalankan.
- Update TODO ketika status benar-benar berubah. Dalam laporan hasil, bedakan implementasi, verifikasi, dan hal yang masih terbuka.

## Pemilihan model dan kualitas

- Prioritaskan hasil yang terverifikasi sambil menjaga penggunaan limit. Saat memasuki milestone berat atau menemukan masalah yang benar-benar ambigu, nilai apakah reasoning/model lebih kuat kemungkinan memberi manfaat.
- Bila layak ditingkatkan, beri rekomendasi singkat di chat: masalah atau bukti yang mendasari, pilihan model/effort, dan manfaat yang diharapkan. Jangan menjanjikan model tertentu pasti berhasil atau otomatis menganggap semua pekerjaan shader memerlukan model termahal.
- Default kerja awal: GPT-6.1 Sol Medium; pertimbangkan Sol High untuk masalah kompleks dan Astra hanya bila beralasan. Untuk edit terarah yang sederhana, Luna dapat cukup. Pilihan mengikuti model yang tersedia bagi pemilik.
- Rekomendasi ini adalah pesan agent, bukan fitur notifikasi/switch otomatis. Pemilik mengubah model melalui kontrol aplikasi. Lanjutkan pekerjaan independen yang masih dapat diselesaikan; jangan menjadikan upgrade sebagai hambatan buatan.
- Kualitas akhir diperiksa melalui build, tes yang relevan, review visual/browser, aksesibilitas dan performa; nama model saja tidak menjadi bukti hasil maksimal.

## Perintah yang tersedia saat ini

```sh
npm install
npm run dev
npm run prototype
npm run build
npm start
npm run check
```

`npm run check` menjalankan TypeScript, tes konten/matematika scene dan syntax check prototype. `npm run build` menjalankan check lalu build Next.js. `npm start` menjalankan hasil build produksi; prototype memakai `npm run prototype`. Dev/build memakai Webpack karena izin junction Turbopack gagal di lingkungan Windows ini. Hentikan dev sebelum build pada checkout yang sama. Smoke umum, lifecycle dan probe rendering terpisah di `tests/` (cara menjalankan di laporan QA); pemeriksaan lanjutan mengikuti TODO.

## Alur kerja ringkas

Pahami tugas dan bagian PRD yang relevan → kerjakan lingkup tersebut → periksa hasil → perbarui TODO/dokumen bila keputusan atau status berubah → jelaskan hasil dan batas verifikasinya.
