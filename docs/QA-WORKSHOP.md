# QA kandidat Robotics study — 23 Oktober 2026

Status: implementasi dan pemeriksaan fungsional produksi lulus di Chromium lokal. Penerimaan visual pemilik dan QA perangkat nyata belum selesai. Tidak deploy/commit. Model dan poster adalah ilustrasi, bukan project nyata pemilik.

**Pembaruan status:** pemilik kemudian menjeda implementasi untuk brainstorming ulang konsep personal. Laporan ini tetap menjadi bukti QA kandidat tersimpan, bukan persetujuan konsep final atau hasil tes baru selama jeda. Acuan terbaru: PRD §2.4 dan checkpoint teratas TODO.

## Implementasi

- Layout satu kolom editorial, navigasi dekat headline, serif/sans Libertinus lokal, About ringkas dengan fakta pemilik. Scene memenuhi viewport di belakang HTML; koleksi kosong tetap jujur.
- Model ROS-Industrial ABB IRB 52 Apache-2.0, GLB lokal 1.550.104 byte/26.060 triangle/tujuh mesh/tanpa tekstur. Meja/kamera/gripper/props ilustratif dibuat dalam kode. Sumber, perubahan dan lisensi di [manifest](ASSETS.md).
- Lighting, bayangan, grid perspektif, framing portrait, gerak sendi lambat. ASCII dipilih eksplisit dan terbatas pada proyeksi objek. Tidak ada hover otomatis seluruh background.
- Satu renderer/kamera lintas route. Fetch model memakai abort signal; resource yang selesai parse setelah dispose juga dilepas. Dispose meliputi loop, observer, listener, controls, geometry/material/texture, environment, shadow target, renderer/context dan canvas.
- Tiga poster hasil render tanpa overlay HTML/scrim/controls; fade saat canvas siap. Kegagalan WebGL/model/context loss menampilkan poster dan mempertahankan konten. Retry manual/static preference tersedia. ASCII/orbit disabled pada poster.
- SplitText disederhanakan: word reveal GSAP singkat, CSS biasa, nama aksesibel utuh dan SSR terlihat. Pause/reduced motion segera mengembalikan teks ke keadaan terbaca. Entrance route/feedback kontrol memakai CSS; navigasi tidak menunggu animasi. Tools scene mobile mengikuti alur dokumen.

## Pemeriksaan yang dijalankan

| Pemeriksaan | Hasil |
| --- | --- |
| `npm run build` final | Lulus check, kompilasi dan prerender |
| `npm run check` (bagian build) | TypeScript, lima tes dan syntax prototype lulus |
| `tests/browser-smoke.js`, produksi | Empat route 200; draft/unknown/raw source 404; active nav, keyboard/skip/focus, pause persisten, typing stabil, reduced motion dinamis, tanpa JS, poster lokal dan input touch lulus; tidak ada overflow 320/390/768/1440px atau page error |
| `tests/scene-browser.js`, produksi | Piksel pause/play; keyboard/mouse orbit, reset/Escape; ASCII lokal; hidden/inert/focus; 20 pergantian route dengan renderer sama; context loss/retry/static; WebGL blocked dan touch/scroll lulus; page error kosong |
| `tests/workshop-motion.js`, produksi | Headline aksesibel; pause/reduced motion tidak menyembunyikan kata; scene paused tidak berubah saat navigasi; back navigation; GLB gagal; pembatalan ke static saat model masih loading lulus; page error kosong |
| `tests/scene-rendering-probe.js`, produksi | Chromium lokal 390×844, sample 2 detik: **27,5 fps**; 0 render tambahan saat pause dan simulated hidden. Menghitung clear pada main framebuffer. Bukan hasil ponsel fisik atau pemenuhan target ≥30 FPS mobile |
| `tests/capture-workshop.js`, produksi | Screenshot About/Projects desktop/mobile, Projects tablet dan tiga scene-only poster direkam dan dibuka |
| Source lint taste skill | 0 FAIL/0 WARN setelah native underline; tiga pengecualian eksplisit scrim netral di atas scene untuk keterbacaan sesuai PRD |
| Inspector visual produksi | **2 FAIL, 3 WARN**, dirinci di bawah; semua enam screenshot inspector dibuka |
| Build draft scan | `Unpublished`, `writing-draft`, `Project draft`, `Draft project` tidak ditemukan di HTML/RSC/text/static JS; belum membuktikan semua marker/aset draft masa depan |
| `git diff --check` | Lulus; Git mencatat normalisasi CRLF Windows, bukan error whitespace |

Smoke/lifecycle/motion dijalankan pada build produksi; setelah perbaikan terakhir yang hanya membesarkan caption/footer ke minimal 13px, build, smoke reflow, capture dan inspector dijalankan kembali. Engine/motion tidak berubah dari rangkaian lifecycle/probe yang lulus sebelumnya.

## Koreksi selama QA

- Framing desktop semula memotong robot pada tablet; kini portrait memakai posisi kamera/target/bench tersendiri. Kontrol mobile semula menimpa pengalaman; kini mengikuti alur dokumen.
- Capture elemen canvas penuh viewport semula ikut memotret HTML/controls/scrim. Ini menyebabkan false positive reset/navigation dan poster memuat UI. Helper capture kini menyembunyikan overlay secara instan hanya selama perekaman scene. Poster bersih direkam ulang dan dibuka langsung; screenshot halaman tetap merekam UI lengkap.
- Sesudah koreksi capture, produksi reset berbeda rata-rata sekitar **0,000000257/255**, fraksi piksel berubah sekitar **0,000000772** (satu piksel di 1440×900). Toleransi awal dipertahankan mean <0,3 dan fraction <0,02; tidak melonggarkan toleransi untuk meluluskan scene.
- Drag QA dipindahkan ke area scene yang tidak ditutupi HTML karena teks memang harus melindungi input membaca. Navigasi QA kini menunggu route/content selesai sebelum menguji fallback/back. Pixel pause dan navigasi shared scene tetap diperiksa ketat.

## Review visual dan batas meter

Screenshot produksi ada di `.taste-skill/workshop/`; hasil inspector di `.taste-skill/inspect/`, log QA di `.taste-skill/workshop/*-production.txt`. Semua file tersebut artefak lokal ignored; poster produksi di `public/scene/`. Tidak menambahkan foto, video atau project palsu untuk memenuhi meter.

- FAIL `palette-terracotta`: aksen hangat #d6a47a mengikuti arah pemilik/referensi, sehingga tidak diganti mengikuti palet acak skill.
- FAIL `few-pictures`: satu scene 3D dan poster, bukan galeri empat foto. Materi karya nyata belum tersedia.
- WARN `no-footage`: tidak ada footage milik pemilik yang siap; scene 3D menjadi visual bergerak.
- WARN `small-title`: judul 30px desktop/28px mobile mengikuti arah editorial ringkas dan nama lengkap; satu baris desktop/tablet dan dua baris 390px.
- WARN `still-page`: inspector menghitung sembilan elemen bergerak, belum menjadi ukuran kualitas gerak canvas. Tidak memperbanyak efek untuk mengejar hitungan tersebut.

```text
ROUND 3
Seen in one second: profil Teknik Komputer dengan ruang robotics redup di belakang teks hangat.
Idea (one sentence): minat robotics dan konteks laboratorium menjadi lingkungan pengamatan bagi konten personal.
Live thing: eksplorasi kamera/ASCII lokal dengan alternatif keyboard, pause dan poster.
Layout words by section: intro=kolom editorial ringkas / experience=daftar fakta / projects=empty state dalam ruang yang sama.
Scores: design 6.5 · usability 7 · creativity 7 · content 7 → overall 6.0 setelah cap meter.
Caps applied: inspector masih FAIL; kurang empat foto membatasi design; pendekatan familiar membatasi creativity. Ini skor internal rubric, bukan penilaian/persetujuan pemilik.
Top three problems (most visible first), each with the screenshot it shows in and the fix:
1. projects-desktop.png: permukaan CAD robot masih tampak sederhana; kurasi material/model/pose berikutnya mengikuti masukan pemilik dan budget aset.
2. projects-tablet.png/about-mobile.png: scene berada di belakang bagian pengalaman; teks terbaca dengan scrim, tetapi keseimbangan keterlihatan objek/teks perlu dinilai pemilik pada perangkat nyata.
3. projects-mobile.png: belum ada karya untuk mengisi koleksi; pertahankan empty state sampai materi dan kontribusi nyata siap.
```

Review CLI 21st tidak dijalankan: auto-review menolak kemungkinan pengiriman source repository ke layanan pihak ketiga. Tidak dibypass; review lokal digunakan. Search CLI sebelumnya meminta login; tidak memasang komponen 21st atau menjalankan hosted generation.

Belum diuji: mobile fisik, Safari/Firefox, pembaca layar nyata, zoom manual 200%, Lighthouse/CLS/bundle gzip menyeluruh, GPU/memory jangka panjang, shader error injection khusus dan network tier perangkat nyata. Belum mengklaim visual final diterima, performa semua perangkat lulus, atau seluruh PRD selesai.

## Menjalankan kembali

```powershell
cd 'C:\Users\abdie\OneDrive\Documents\ChatGPT\Website Portofolio'
npm run dev
```

Buka http://127.0.0.1:3000/projects atau `/`. Dependency bila perlu: `npm ci`. Pemeriksaan: `npm run check`. Produksi: hentikan dev → `npm run build` → `npm start`. Prototype tetap `npm run prototype` (4173). Tidak perlu login 21st untuk menjalankan aplikasi.
