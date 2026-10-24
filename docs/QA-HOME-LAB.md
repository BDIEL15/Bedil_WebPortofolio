# QA bukti visual Home — Personal Electronics Lab

## Perbaikan bentuk props — 24 Oktober 2026

Permintaan pemilik: beberapa item masih tidak sesuai bentuknya. Kamera duduk dan posisi intro terbaru dipertahankan; perubahan berada pada geometri/material/tekstur prosedural dan proyeksi ASCII keyboard. Tidak memperluas sudut/route, mengambil aset eksternal atau menambah dependency.

- Keyboard ANSI 60% lima baris/61 keycap instanced, modifier/spacebar dengan lebar sesuai layout dan legenda CanvasTexture. Esc tidak menumpuk dua mesh; baris bawah terpisah.
- Tube spiral tersampling 320 segmen, diarahkan agar lilitan terbaca; konektor dan jalur ke keyboard/monitor menyambung. Kabel probe berawal dari koordinat soket instrumen yang sudah ditransformasi.
- Casing/front panel/bezel, knob berpenunjuk, soket, ventilasi/kaki instrumen; dudukan monitor di atas meja; cover/halaman/spine/elastic notebook; obeng pegboard; kepala lampu dan diffuser di dalam kanal rak.
- RoundedBoxGeometry dibuat menurut dimensi dan di-cache agar radius tidak terdistorsi oleh nonuniform scale. Rasio tekstur pegboard/mat mengikuti permukaan. Objek tetap ilustrasi generik, bukan model CAD presisi atau perangkat/karya milik pemilik.

| Pemeriksaan props | Hasil |
| --- | --- |
| `npm run build` | Lulus TypeScript, enam tes, syntax prototype, kompilasi/prerender |
| Tes geometri baru di `tests/scene.test.ts` | Posisi vertex finite, budget internal, keycap tidak beririsan/keluar case, spacebar lebar, monitor/case/coil di atas permukaan, sampling spiral lulus. Canvas2D di-stub untuk geometri; tampilan tekstur dinilai di browser |
| Ukuran builder | 254 mesh, 71.432 rendered triangle termasuk instance, 104 geometri bersama, 9 CanvasTexture. Batas internal tes 150.000 triangle/350 mesh; tidak termasuk biaya shadow/environment dan bukan bukti FPS perangkat nyata |
| `personal-lab-smoke.js`, produksi | Empat route/anchor/fakta, draft/unknown 404, keyboard/focus, pause/typing/reduced motion, reflow 320–1440, touch dan tanpa JS lulus; page error kosong |
| `personal-lab-browser.js`, produksi | Piksel diam, orbit/reset/Escape, ASCII dari instance aktual, hide/inert/focus, renderer lintas route, context loss/dispose/retry/static, WebGL blocked, touch/Explore 320/390 lulus; page error kosong |
| Reset frame | Keyboard identik; mouse mean 0,000001286/255, fraction 0,000003858. Toleransi tetap |
| Probe rendering produksi | 0 render tambahan saat idle/1 detik, 2 saat interaksi; settle dan resize lulus. Tidak mengklaim FPS animasi atau performa ponsel fisik |
| Capture/poster | Screenshot desktop/tablet/mobile produksi dan poster scene-only direkam. WebP 63.914 / 29.160 / 14.144 byte; skrip reproduksi tetap |
| Source lint/inspector | Source engine/geometri 0 FAIL/0 WARN. Inspector lokal props tetap 4 FAIL/3 WARN pada kategori palet/jumlah gambar/motion/isi DOM/gap/footage/subjudul seperti riwayat; enam screenshot final dibuka. Tidak mengklaim audit visual selesai |

Log `props-*-production.txt`, build/check `props-build.txt`/`props-check.txt`, screenshot review `props-home-{desktop,tablet,mobile}.png`, audit `.taste-skill/personal-lab/props-inspect/`. File capture umum juga kini berisi props terbaru. Studio/QA lama di bawah adalah riwayat; tidak menganggap hasil lama sebagai pengukuran props baru.

Review lokal: siluet/key spacing, lilitan kabel, soket dan tumpuan monitor lebih jelas dari proof sebelumnya. Material tetap sederhana; beberapa benda tepi sengaja terpotong framing duduk. Persetujuan visual pemilik, perangkat fisik/lintas browser, screen reader/zoom lengkap, cold-load/bundle serta GPU/memory jangka panjang belum selesai. Perlu mengukur lagi sebelum menambah idle animation/motion detail.

Catatan critique internal: gagasan tetap ruang kerja elektronik hangat dengan HTML tenang; live thing adalah Explore/ASCII lokal dengan keyboard/fallback. Layout: intro pada pegboard, objek di sisi/foreground, informasi nyata di panel scroll. Design 7, usability 7, creativity 6,5, content 7; overall 6 karena batas audit generik. Masalah tersisa: crop props di viewport sempit (`props-home-mobile.png`), bayangan/material masih bergaya sederhana (`props-home-desktop.png`), informasi panjang belum memiliki sudut sendiri (`props-inspect/desktop-page-01.jpg`). Skor ini catatan rubric, bukan persetujuan pemilik.

## Riwayat revisi sebelumnya

## Revisi sudut pandang duduk — 24 Oktober 2026

**Penyesuaian posisi sesudah review:** blok intro diturunkan 5svh desktop/tablet dan 6svh mobile; scrim mengikuti. Kamera/geometri/poster tetap sama. Build/check dan smoke produksi diulang, lulus termasuk reflow 320–1440 dan page error kosong. Capture terbaru desktop/mobile dibuka; preview dev dipulihkan. Log `intro-lower-build/smoke/capture.txt`. Audit generik/lifecycle/probe di bawah berasal dari revisi kamera sebelum penyesuaian CSS ini, tidak dijalankan ulang untuk perubahan posisi saja.

Permintaan pemilik: tulisan berada pada pegboard, seperti duduk menggunakan meja. Kamera depan lebih dekat, portrait tersendiri, keyboard/kabel di foreground; bentuk/material tetap digunakan. Intro mobile diturunkan ke bidang pegboard. Navigasi dan tools Home mendapat latar kontras; panel Explore membungkus agar tidak keluar layar. Teks tetap HTML yang tidak ikut orbit sebagai mesh, konten panjang tetap scroll. Tidak memperluas sudut/route atau menambah dependency.

| Pemeriksaan revisi | Hasil aktual |
| --- | --- |
| `npm run build` | Lulus check/5 tes/syntax prototype, TypeScript, kompilasi dan prerender |
| `personal-lab-smoke.js`, produksi | Empat route, anchor/fakta, draft/unknown 404, keyboard/focus, pause/typing/reduced motion, touch dan tanpa JS lulus. Reflow 320/390/768/1440; page error kosong |
| `personal-lab-browser.js`, produksi | Orbit mouse/keyboard/reset/Escape, ASCII, hide/inert/focus, renderer lintas route, context loss/retry/static, tanpa WebGL dan scroll-first touch lulus. Ditambah assertion panel Explore tidak overflow pada 390 dan 320px. Page error kosong |
| Reset piksel | Keyboard identik; mouse mean 0,000001286/255, fraction 0,000003858; toleransi sebelumnya dipertahankan |
| `personal-lab-rendering.js`, produksi | Idle 0 render tambahan/1 detik; interaksi 2 render; settle/resize lulus. Bukan pengukuran ponsel fisik atau FPS animasi |
| Capture/poster | Home desktop/tablet/mobile produksi dibuka; poster scene-only dari kamera duduk menggantikan poster lama. WebP 57.968 / 26.892 / 13.390 byte |
| Source lint dan inspector lokal | CSS 0 FAIL/0 WARN; inspector tetap 4 FAIL/3 WARN dengan kategori sama seperti riwayat di bawah. Enam screenshot final dibuka; tidak diklaim seluruh audit/penerimaan visual selesai |

Log revisi `.taste-skill/personal-lab/seated-*.txt`; audit/screenshot penuh `.taste-skill/personal-lab/seated-inspect/`; screenshot Home/poster memakai lokasi capture biasa yang kini berisi framing duduk. Review lokal memakai komponen/engine yang ada; tidak mengirim source ke layanan eksternal. Riwayat source/QA sebelum revisi dipertahankan di bagian berikut.

Belum diverifikasi: perangkat fisik/lintas browser, screen reader/zoom lengkap, performa/GPU/memory jangka panjang. Intro di pegboard merupakan komposisi HTML default, bukan pemetaan teks perspektif ke mesh saat Explore. Tahap berikutnya tetap masukan pemilik atas Home sebelum sudut lain.

## Riwayat proof awal — 23 Oktober 2026

23 Oktober 2026. Lingkup: satu komposisi Home desktop/portrait di aplikasi nyata, sebelum memperluas sudut lab. Konsep dipilih pemilik; hasil render masih menunggu review. Tidak commit/deploy. Laporan Robotics sebelumnya adalah riwayat terpisah.

## Implementasi

- Engine dinamis `create-personal-lab-scene.ts`, geometri/tekstur asli `personal-lab.ts`. Material PBR hangat, kayu, pegboard, rak, instrumen ilustratif, lampu, keyboard instanced, kabel dan catatan. Tidak mengambil aset/source website referensi atau memakai foto lampiran sebagai tekstur.
- Intro `Hi, I'm Abdiel.`, typing mahasiswa/robotics, navigasi enam label. About/Experience sementara anchor konten nyata di Home. Projects/Writing/Cabinet mempertahankan koleksi kosong. Tidak mengarang kontak/CV, karya atau kontribusi.
- Satu renderer antarroute, render sesuai input/resize; **tanpa idle RAF/motion 3D** pada proof ini. Pause/reduced motion mengatur reveal/typing. Explore eksplisit, reset/Escape/fokus, static/retry dan poster lokal disediakan.
- Poster scene-only desktop 1440×1000, tablet 768×1024, mobile 390×844. Setelah konversi WebP quality 84: **40.988 / 29.954 / 13.208 byte**. CanvasTexture dibuat lokal saat inisialisasi. Model robot lama tidak dimuat engine baru; file/lisensinya tetap disimpan.

## Pemeriksaan aktual

| Pemeriksaan | Hasil |
| --- | --- |
| `npm run build` | Check, lima tes, syntax prototype, TypeScript, kompilasi/prerender Next.js lulus |
| `tests/personal-lab-smoke.js`, produksi | Empat route 200, active nav; draft/unknown/raw source 404; anchor identitas/tiga pengalaman; keyboard/skip/focus; pause persisten, typing stabil dan reduced motion dinamis; touch serta tanpa JS lulus. Tidak ada overflow horizontal 320/390/768/1440 atau page error |
| `tests/personal-lab-browser.js`, produksi | Piksel scene diam; orbit keyboard/mouse/reset/Escape; ASCII hanya patch lokal; hidden/inert/fokus; 20 pergantian route satu renderer; context loss/dispose/retry; static persisten; WebGL blocked dan Explore touch/scroll lulus. Page error kosong |
| Pixel reset | Keyboard identik; mouse mean selisih **0,00000103/255**, fraksi berubah **0,00000309**. Toleransi tetap mean <0,3/fraction <0,02 |
| `tests/personal-lab-rendering.js`, produksi | 0 render tambahan saat idle selama 1 detik, 2 saat interaksi; settle kembali dan resize merender framing baru. Probe main-framebuffer clear, Chromium emulasi 390×844; bukan angka FPS animasi/perangkat fisik |
| `tests/capture-personal-lab.js` | Screenshot Home tiga ukuran dan poster tanpa HTML/scrim/kontrol direkam; hasil dibuka untuk review |
| Draft build scan | Marker `Unpublished`, `writing-draft`, `Project draft`, `Draft project` tidak ditemukan pada HTML/RSC/text/static JS build; bukan bukti seluruh konten/aset draft masa depan |
| Source lint taste | 0 FAIL/0 WARN pada CSS/Home/nav; pengecualian scrim netral dicatat untuk keterbacaan scene |
| Git/JSON | Whitespace staged/unstaged dan parse JSON profil/konteks desain lulus; staging tidak diubah |

Tes check tetap meliputi studi GLB/matematika lama; bukti scene baru berasal dari browser/piksel/probe di atas. Tidak menambah tes yang sekadar mencocokkan markup implementasi.

Koreksi selama review: navigasi mobile kini grid dua baris; intro tablet dipindah ke area gelap di atas rak; tombol scene Home minimal 44px; fade awal halaman/judul dihapus agar teks tetap terbaca saat inisialisasi WebGL berat. Reveal posisi singkat tetap tersedia dengan pause/reduced motion. Capture menyembunyikan overlay hanya saat mengambil poster, bukan pada screenshot halaman.

Satu rangkaian produksi mengalami timeout saat klik Enable 3D setelah context loss/static, sementara inspector lain berjalan. Runner/sesi milik QA ditutup, lifecycle diulang sendiri dalam browser bersih dan seluruh assertion lulus. Timeout belum terbukti disebabkan aplikasi atau kontensi browser; tidak dianggap bukti tidak ada kebocoran GPU/memory. Tidak melonggarkan assertion untuk lulus.

## Audit visual dan batas

Source lint serta tes fungsional tidak sama dengan persetujuan visual. Inspector generik menilai foto/motion/layout DOM; hasil dan screenshot lengkap ada di `.taste-skill/personal-lab/inspect/`, log `.taste-skill/personal-lab/inspect.txt`. Hasil final **4 FAIL/3 WARN**, jadi meter belum lulus keseluruhan. Temuan late-title pada iterasi sebelumnya diselesaikan dengan menghapus fade awal; inspeksi final tidak lagi melaporkannya. Enam screenshot inspector final dibuka, termasuk seluruh halaman pada tiga ukuran.

- Aksen hangat terracotta dipertahankan mengikuti brief pemilik.
- Satu scene/poster, belum empat foto atau footage. Tidak menambahkan galeri/karya fiktif untuk memenuhi meter.
- Proof sengaja diam; jumlah elemen bergerak rendah.
- Meter empty-screens/blank-gap tidak menghitung isi canvas sebagai konten DOM; ruang di bawah intro memperlihatkan workbench, bukan section kosong pada render aktual. Panel informasi di bawah fold masih solusi sementara sebelum sudut masing-masing.
- Name-only-title: headline kandidat dari pemilik dipertahankan; intro nyata status mahasiswa/UI ada di bawah pada 16–17px, di bawah ambang 18px meter. Tipografi/keterbacaan tetap perlu masukan pemilik/perangkat nyata.

Critique lokal: ide satu ruang kerja elektronik hangat di belakang identitas HTML; interaksi utama Explore dengan alternatif keyboard/poster. Desktop memperlihatkan seluruh bench, portrait menonjolkan keyboard/kabel. Material dan props masih sederhana; pencahayaan lampu serta detail personal belum final. Nilai internal sementara design 6,5 / usability 7 / creativity 6,5 / content 7; overall 6 karena audit terbuka. Ini rubric internal, bukan penilaian pemilik atau klaim setara referensi.

Belum diverifikasi: perangkat fisik, Safari/Firefox, screen reader, zoom lengkap, CLS/loading/bundle terukur, GPU/memory jangka panjang serta performa gerak kamera lanjutan. Tidak menyatakan target ≥30 FPS terpenuhi untuk scene animasi yang belum dibuat.

## Menjalankan kembali

Hentikan server sebelum `npm run build`; `npm start` untuk produksi port 3000 atau `npm run dev` untuk mengedit. Gunakan perintah QA/capture dalam README; reproduksi poster di ASSETS. Skrip smoke/lifecycle/probe Robotics lama memiliki asumsi yang sudah berbeda dan bukan suite Home ini.

Berikutnya: review screenshot Home oleh pemilik, koreksi komposisi sesuai masukan, baru melanjutkan sudut/route lain. Materi kontak/CV, kontribusi rinci dan karya menyusul; database/admin tetap ditunda.
