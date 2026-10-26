# Brief dan rencana eksekusi — Personal Electronics Lab

**Penyempurnaan transisi, 26 Oktober:** teks tidak lagi translate/reveal ganda; fade-through main/footer dengan posisi snapshot tetap, fallback opacity untuk history/API tidak tersedia maupun native capture yang gagal/dilewati. Capture route lambat dilepas setelah 350ms; input/pause/reduced/hidden tetap aman. Resize saat kamera bergerak menarget ulang, bukan melompat ke endpoint. Scrim Home memudar terpisah. Kamera cap 60Hz selama flight/30Hz menetap dengan arc lebih kecil dan tanpa lens breathing; pose/aset/konten tetap. [QA terbaru](QA-SOFT-TRANSITIONS.md).

**Kamera cinematic, 25 Oktober:** susunan satu rak diterima sebagai arah. Pemilik meminta POV lebih dekat/terarah, opening Home dan transisi seamless. Implementasi memakai establishing shot pendek ke Home duduk, lintasan melengkung ringan dengan velocity continuity saat retarget, lensa adaptif portrait dan satu loop render bersama aktivitas. Tidak menambah meja/benda/model/dependency, tidak mengunci konten/navigasi/scroll. Pause/reduced/hidden/static/direct non-Home melewati entry; perincian aktual dan batas: [QA kamera cinematic](QA-CINEMATIC-CAMERA.md).

**Koreksi kepadatan, 25 Oktober:** pemilik menginginkan meja lebih bersih, dengan isi rak utama padat dan penempatan jelas. Rak tingkat dua/alat/kabel terkait dihapus. Satu rak utama: alat di ujung, hobi di tengah, organizer di sela; pegboard tetap lanyard/foto dan paper/chalkboard. Home menghapus section/CTA About me, route `/about` tetap. Name tag Experience menampilkan tiga published teratas dari urutan JSON, dengan identitas/peran/tahun yang nyata dan foto opsional. Enam POV/overview bersama dan motion tetap. QA terbaru: [QA cleanup](QA-LAB-CLEANUP.md).

**Lab personal lebih padat — 24–25 Oktober:** pemilik meminta rak/instrumen/kabel seperti foto meja yang dilampirkan, Experience berupa lanyard dengan slot foto asli, paper gantung dan chalkboard fisika pada Writing. Cabinet kini sudut hobi yang dipilih pemilik: kamera, figure Power (Chainsaw Man) versi stilisasi asli, portable audio player dan kaset, bukan fokus kotak penyimpanan. Workbench tunggal diperlebar untuk rak tambahan; ruang intro tetap lega. Lima slot foto publik dikonfigurasi lewat src/data/scene-photo-slots.json (semuanya null sampai foto asli tersedia); panduan docs/SCENE-PHOTOS.md. Geometri statis dibatch, motion/pause/fallback tetap. Acuan QA terbaru: docs/QA-LAB-PERSONALITY.md. Pernyataan fokus Cabinet/Experience lama di bawah adalah riwayat.

**Writing/Cabinet — 24 Oktober:** pemilik mengizinkan implementasi dua POV yang disukai: Writing menghadap catatan ilustratif pada pegboard kanan di belakang robot; Cabinet mendekat ke kotak rak yang sama. Enam sudut baca berbagi satu meja/renderer/overview. Desktop dan portrait tersendiri, artikel lokal memakai sudut Writing dengan layout baca biasa. Konten HTML/file-first dan empty state tetap jujur; grafis NOTES/IDEAS bukan tulisan atau koleksi pemilik. Robot/monitor lintasroute dan notebook About dipertahankan. 21 poster aktif dari enam POV + overview bersama × tiga ukuran. QA terbaru: docs/QA-COLLECTION-VIEWS.md; riwayat sudut masih pending di bawah digantikan.

**Animasi lintasroute — 24 Oktober:** pemilik meminta robot tetap bergerak termasuk Home, monitor hidup dan notebook menulis pada About. Satu loop bersama maksimal sekitar 30Hz kini menggerakkan robot/monitor pada seluruh route serta selama perpindahan kamera; About menambah pensil dan goresan ilustratif 12 detik. Pause/reduced motion, tab hidden, static/context loss/dispose tetap menghentikan loop. Aturan Home idle diam pada riwayat sebelumnya digantikan. Writing diarahkan ke pegboard belakang robot dan Cabinet ke rak sebagai rencana yang disukai, belum dieksekusi pada revisi animasi ini. QA aktual: docs/QA-LAB-ACTIVITY.md.

**Penyempurnaan Home — 24 Oktober:** pemilik mulai menyukai workbench kompak dan meminta meja lebih terisi serta Home lebih seimbang. Kamera Home kini berpusat di x=0 dan desktop sedikit dimundurkan; keyboard/mat lurus di sumbu intro. Tambahan asli: mouse/pad, circuit study, cup alat, tray komponen dan dua case rak, semuanya pada meja yang sama. Tidak menambah furniture/route atau klaim karya. Builder 193 mesh/60.780 rendered triangle/124 geometri/8 tekstur; lihat QA-COMPACT-WORKBENCH untuk hasil dan batas terbaru.

**Implementasi kompak aktif:** satu workbench dan satu overview lintasroute sudah diterapkan setelah pemilik melanjutkan dari push. Robot/notebook/kartu dipindah ke meja/pegboard utama; Home/Projects desktop/portrait menjadi proof yang sedang diperiksa. QA-COMPACT-WORKBENCH dan TODO adalah status aktual; pernyataan empat meja belum dikonsolidasikan di riwayat berikut sudah digantikan.

**Arah paling baru — satu workbench kompak:** Pemilik menolak pengulangan banyak meja. Arah berikutnya: satu workbench/ruang kompak, setiap halaman fokus satu objek/kelompok benda dengan POV khusus; overview penuh untuk Home/Hide Text seperlunya. Referensi Hamza dipakai untuk komposisi ruang/fokus kamera; Clarissa tetap suasana hangat/editorial. Runtime empat meja yang ada belum direfaktor pada checkpoint ini; jangan menambah meja/sudut lengkap baru. Verifikasi browser referensi Hamza pada 24 Oktober: satu room overview, section fokus objek. Berikutnya konsolidasi ruang dan proof POV Home/Projects desktop/portrait; penciptaan sudut/route lain mengikuti bukti itu.

**Scope About/Experience terbaru:** pemilik mengizinkan rekomendasi kedua sudut pada 24 Oktober. Keduanya kini route dan area fisik tersendiri dengan framing/overview/poster; storyboard sebelumnya berubah menjadi implementasi untuk keduanya. Writing/Cabinet tetap lanjutan. Lihat TODO dan QA-STORY-CORNERS; checkpoint Home-only/dua sudut di bawah historis.

**Motion terbaru, 24 Oktober:** setelah respons positif atas arah umum, pemilik meminta kualitas 3D diperbaiki dan robot bergerak. Gerak sendi observasional aktif hanya di Projects, mengikuti pause/reduced motion/visibility/static; Home tetap event-driven. Ini menggantikan batas scene diam Projects sebelumnya. Lihat QA-ROBOT-MOTION dan checkpoint TODO.

**Pembaruan 24 Oktober:** izin Home-only di rencana awal sudah diperluas pemilik ke satu workspace Projects. Kini ada meja robotics terpisah dalam lab yang sama; sudut lain tetap lanjutan. Inspect ASCII dihapus dari aplikasi aktif. Hide Text otomatis mengaktifkan orbit/reset/arrow/touch, dengan overview setiap workspace; Show Text/Escape memulihkan mode baca. Lihat checkpoint TODO dan [QA robotics](QA-ROBOTICS-BAY.md) untuk implementasi/pemeriksaan terbaru. Pernyataan Explore eksplisit tetap berlaku saat teks terlihat.

Tanggal: 23 Oktober 2026. Status: prompt eksekusi telah dikirim pemilik; bukti visual Home telah diimplementasikan. Review Home mendahului perluasan sudut/halaman. Hasil/batas QA di [QA-HOME-LAB](QA-HOME-LAB.md). Keputusan produk ada di PRD §2.5/§7.7/§16.5; checkpoint berjalan ada di TODO. Dokumen ini menjadi urutan eksekusi, bukan klaim hasil visual atau performa.

## 1. Arah yang disepakati

- Portofolio Abdiel Deandra EL Dzaky, mahasiswa Teknik Komputer UI; audiens utama perekrut, tindakan utama menghubungi pemilik.
- Cerita mengikuti perjalanan pemilik. Bahasa publik Inggris. Tidak membuat slogan sifat/keahlian, karya atau kontribusi yang belum diberikan.
- Satu lab elektronik personal, bentuk 3D sederhana seperti Hamza, cahaya/material hangat dan ketenangan editorial Clarissa. Komposisi foto 3, kehangatan foto 2, aktivitas foto 4, rak padat foto 1.
- Home menampilkan workbench dan intro tengah/typing. Copy kandidat `Hi, I'm Abdiel.` serta `a computer engineering student`; daftar frasa final masih perlu dikurasi.
- Home, About, Projects, Experience, Writing dan Cabinet adalah area dalam satu lab; pemetaan sudut rinci tetap usulan desain.
- Scene untuk observasi. Jangan menambahkan game, simulasi instrumen, suara otomatis atau intro wajib yang menunda akses.
- Authoring versi awal: JSON untuk data terstruktur dan Markdown/MDX tepercaya untuk tulisan/case study, diedit di editor, preview lalu deploy. Database/dashboard ditunda; rencana migrasi tetap PRD §16.5.

## 2. Referensi yang dapat dibaca ulang

Salinan foto dari lampiran pemilik berada di `analysis/workbench-references/`, di luar aset publik. Hanya referensi desain; hak distribusi/lisensi belum diketahui. Jangan memakainya sebagai tekstur, poster produksi atau mengakuinya sebagai ruangan pemilik. Buat geometri sendiri atau gunakan aset dengan lisensi yang dicatat.

| Berkas | Peran |
| --- | --- |
| `01-electronics-lab.jpg` | Kedalaman dan kepadatan rak |
| `02-warm-personal-lab.jpg` | Acuan utama rasa hangat dan ruang yang dihuni |
| `03-workshop-composition.jpg` | Susunan meja, lampu, pegboard dan ruang kerja yang tenang |
| `04-active-workbench.jpg` | Kabel, catatan dan kesan pekerjaan sedang berlangsung |

Referensi web: https://www.raomuhammadhamza.tech/ untuk bahasa bentuk/ruang dan https://www.clarissabuilds.com/ untuk komposisi/editorial. Observasi sebelumnya bukan lisensi mengambil model, tekstur atau source mereka. Bukti REA lama tetap di `analysis/`; tidak perlu mengulang REA.

## 3. Komposisi dan daftar aset awal

Mulai dari satu workbench, bukan seluruh gedung. Background gelap dengan lampu kerja hangat, kayu, polimer/logam sederhana dan layar instrumen redup. Nilai warna dan detail dibuktikan melalui render, bukan ditetapkan sebagai token final sekarang.

| Elemen | Prioritas | Rencana |
| --- | --- | --- |
| Meja, rak, pegboard dan lampu | Inti | Geometri sederhana; bentuk/siluet dan kontak bayangan didahulukan |
| Monitor dan instrumen elektronik | Inti | Layar dekoratif berlabel jelas; tidak mengklaim telemetri nyata |
| Mechanical keyboard dan kabel | Inti, pilihan pemilik | Detail secukupnya agar terbaca di mobile; batasi geometri repetitif |
| Cutting mat, catatan, komponen | Pendukung | Mengarahkan fokus tanpa menutupi intro |
| Manga dan stiker meme | Tentatif | Isi/penempatan dikurasi kemudian; placeholder internal tidak dipublikasikan |
| Robot Projects | Kandidat reuse | GLB/lisensi tersedia; evaluasi kecocokan gaya dan biaya render, bukan kewajiban mempertahankan tampilan lama |
| Poster desktop/portrait | Wajib saat implementasi | Render dari komposisi baru yang sama; jangan memakai foto lampiran |

Instrumen dan benda dekoratif tidak semuanya menjadi menu. Navigasi HTML tetap jalur utama; penanda objek harus dapat dikenali dan punya padanan keyboard bila interaktif.

## 4. Layout desktop dan mobile

**Eksekusi lanjutan 24 Oktober:** pemilik mengizinkan Home → Projects dan overview Hide Text. Projects memakai area instrumen dengan panel HTML dalam document flow. Hide Text naik/menjauh; Show Text kembali ke sudut aktif/posisi baca. Pose/fit portrait dan poster terpisah tersedia. Retarget/pause/reduced motion/direct URL tidak boleh menahan akses konten. Sudut lain tetap menunggu pengembangan berikutnya; lihat QA-LAB-CAMERA.

**Koreksi pemilik 24 Oktober:** gunakan sudut pandang duduk menghadap pegboard sebagai bidang intro; meja/keyboard/kabel di foreground. Framing luar keseluruhan meja pada proof pertama diganti. Kamera depan/portrait dan poster sudah disesuaikan; tata letak sudut lain tetap target setelah review Home. Paragraf berikut merekam prinsip layout umum.

Desktop: intro berada di ruang visual tenang di tengah, rak/alat membingkai tulisan. Navigasi langsung tersedia dekat intro atau shell yang jelas. Posisi final dipilih berdasarkan keterbacaan render aktual, termasuk panjang nama dan typing. Konteks lab boleh memenuhi viewport; konten panjang tetap mengikuti document flow.

Mobile: kamera portrait lebih dekat ke meja, rak di atas, keyboard/catatan di bawah, area tengah untuk intro. Jangan mengecilkan seluruh desktop. Default touch adalah scroll; orbit/drag baru aktif setelah Explore dipilih. Sediakan Done/Escape/reset, fokus kembali dan tanpa perangkap scroll. Menu ringkas harus bisa dioperasikan keyboard/touch; kontak dan CV hanya ditampilkan saat datanya siap.

Projects memakai pembuka scene lalu daftar karya dalam alur scroll. About/Experience menampilkan cerita yang terbaca; Writing/detail mendapat area baca lega dan scene diam/tereduksi. Cabinet berupa koleksi tap-friendly. Direct URL, refresh dan back/forward bekerja tanpa memulai perjalanan kamera dari Home. Reduced motion langsung ke framing tujuan; tanpa JS/WebGL isi tetap tersedia.

## 5. Data dan authoring

Pertahankan `src/lib/content/` sebagai titik baca konten. Profil, pengalaman, project dan cabinet tetap data terstruktur; naskah Writing/case study Markdown/MDX tepercaya. Metadata tulisan berasal dari frontmatter; jangan membuat salinan aktif yang harus diedit di database juga.

Status draft/published, ID/slug stabil, alt/caption/credit dan relasi karya-pengalaman mengikuti PRD. Pengalaman/karya belum siap boleh tetap kosong. MDX menyisipkan komponen, tidak otomatis membuat simulasi atau rumus; tambah dukungan sesuai artikel pertama yang nyata. Buat panduan authoring ringkas dan contoh draft privat saat mengerjakan milestone konten. Draft/aset privat tidak ikut build publik.

## 6. Urutan eksekusi setelah diminta

| Tahap | Hasil yang harus dapat diperiksa | Batas selesai |
| --- | --- | --- |
| 0. Verifikasi checkout | Git/staging, proses yang berjalan, source dan dependency terpasang | Tidak menghapus perubahan pemilik, tidak build bersamaan dengan dev pada checkout sama |
| 1. Bukti visual Home | Komposisi diam desktop dan mobile dengan intro, nav, lampu serta objek inti | Referensi terasa menyatu; tulisan terbaca dan objek punya kedalaman; tampilkan hasil untuk masukan |
| 2. Shell dan observasi | Home responsif, menu, Explore, pause, reduced motion, fallback | Touch scroll alami, fokus/keyboard jelas, poster baru konsisten dengan scene |
| 3. Sudut dan route | About/Projects/Experience/Writing/Cabinet beserta detail | Satu lab konsisten; direct URL/back berfungsi; pertahankan konten/URL lama bila relevan |
| 4. Konten dan authoring | Schema/file contoh privat, panduan pengisian, konten nyata yang tersedia | Draft tersaring; materi belum ada tidak dibuat-buat; kontak/CV menunggu data |
| 5. QA produksi | Build, screenshot, aksesibilitas, fallback, lifecycle dan pengukuran | Laporan membedakan lulus/gagal/belum diuji; tidak deploy otomatis |

Fondasi reuse: Next.js/React/TypeScript, content layer, SceneHost, dynamic loading, pause/reduced motion, cleanup, static/retry dan tes yang relevan. Engine/material/kamera dievaluasi; jangan menulis ulang seluruh aplikasi atau menambah dependency tanpa kebutuhan. Periksa skill UI/Three.js yang relevan ketika mulai implementasi; fase persiapan tidak menjalankan generation atau mengirim source; fase Home menggunakan geometri/tekstur asli tanpa dependency tambahan.

## 7. Pemeriksaan yang menentukan kualitas

- Visual: screenshot 1440 desktop, 768 tablet, 390 portrait dan reflow 320; siluet, bayangan, kontras, framing serta area baca. Sesuaikan viewport bila bukti menunjukkan masalah lain.
- Interaksi: menu/tautan langsung, keyboard/focus, Explore masuk/keluar/reset, scroll mobile, route cepat, direct URL, back/forward, pause dan reduced motion.
- Ketahanan: tanpa JS/WebGL, model gagal, loading lambat, context loss/retry, tab hidden, static saat model loading; resource/listener/RAF dibersihkan sesuai ownership.
- Konten: schema, slug, link internal, not-found untuk draft, tidak ada draft pada HTML/RSC/JS/sitemap atau media publik; jangan menerbitkan contoh sebagai karya.
- Produksi: `npm run build` sudah mencakup check; jalankan smoke/lifecycle/probe yang disesuaikan dengan UI baru. Jangan mengeklaim tes lama sebagai tes redesign.
- Performa: ukur ukuran transfer/bundle, loading, frame time dan memory setelah route berulang. Sasaran PRD >=30 fps mobile harus dibuktikan di perangkat nyata; probe lama 27,5 fps bukan hasil redesign. Batasi detail, bayangan dan resolusi sebelum menambah efek; poster statis tetap dapat dipilih.
- Aksesibilitas: kontras, zoom/reflow, target sentuh, screen reader dan fokus nyata. Label visual/typing mempunyai teks aksesibel stabil; tidak mengumumkan setiap karakter.

Pemeriksaan yang belum tersedia perangkatnya ditandai terbuka. Kualitas visual akhir memerlukan masukan pemilik atas render nyata; dokumen dan nama model bukan bukti hasil maksimal.

## 8. Materi yang bisa menyusul

Email/tautan reach-out, CV, copy intro/frasa typing final, detail kontribusi/periode, materi karya, artikel pertama dan pilihan dekorasi. Ini tidak menghalangi studi Home, tetapi dibutuhkan sebelum bagian terkait diterbitkan. Jangan meminta pemilik mengisi semuanya sebelum mulai komposisi.

## 9. Handoff bila pindah chat

Prompt lengkap siap salin, termasuk panduan Medium/High/XHigh/Astra/Luna: [PROMPT-REDESIGN](PROMPT-REDESIGN.md). Gunakan prompt lengkap tersebut untuk memulai di chat pengerjaan sebelumnya. Versi ringkas di bawah hanya alternatif handoff.

Lanjut di chat yang sama merupakan rekomendasi alur kerja. Jika memakai chat baru, pilih folder repository yang sama lalu kirim:

> Lanjutkan redesign portofolio Abdiel pada repository ini. Baca AGENTS.md, checkpoint teratas TODO.md, docs/REDESIGN-LAB.md, PRD §2.5/§7.7/§16.5 serta ASSETS/QA-WORKSHOP yang relevan. Konsep dipilih: lab elektronik 3D sederhana seperti Hamza, hangat seperti foto 2 dan editorial tenang seperti Clarissa. Bahasa Inggris, perekrutan/reach-out, cerita perjalanan; scene untuk observasi. Konten file-first JSON/Markdown/MDX, tanpa database/admin awal. Referensi lokal di analysis/workbench-references/. Mulai tahap 0 lalu bukti visual Home desktop/mobile, tampilkan hasil untuk masukan sebelum memperluas detail scene. Gunakan fondasi yang ada; jangan mengarang karya, menghapus perubahan lokal atau deploy. Ini permintaan untuk melanjutkan implementasi.

Prompt di atas adalah bahan untuk dikirim pemilik ketika siap, bukan instruksi aktif atau otorisasi implementasi dari dokumen ini.
