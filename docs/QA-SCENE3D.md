# Signal study 3D — implementasi dan QA

22 Oktober 2026. Melanjutkan studi SVG yang tercatat di [QA fondasi](QA-STAGE1.md). Tidak deploy dan tidak menerbitkan karya/kontak rekaan.

## Hasil implementasi

- Three.js 0.180.0 yang sudah ada dipakai langsung; tambahan dependency hanya deklarasi dev `@types/three` yang cocok versinya. Audit instalasi: 0 vulnerabilities.
- Satu renderer dipertahankan pada shell antarroute. Engine diimpor dinamis setelah hydration; HTML dan SVG poster sudah tersedia lebih dulu. Preference static dibaca sebelum mengimpor engine.
- Medan 2.400 titik pada bola, inti dengan pencahayaan lembut, gelombang dan marker orbit. Ini ilustrasi konseptual, bukan simulasi ilmiah.
- ASCII dibuat dari proyeksi titik 3D ke canvas 2D, hanya dalam patch lingkaran. Di fallback, versi SVG tetap bisa diinspeksi. Tidak ada efek pada teks utama.
- Explore mengaktifkan drag; tombol rotate, reset dan arrow keys memberi alternatif. Escape mengakhiri eksplorasi dan mengembalikan fokus. Scroll/pinch mobile tetap normal di luar mode Explore.
- Hide/show text memakai `hidden` dan `inert`, bukan sekadar opacity. Kontrol restore tetap fokus; Escape dari fokus scene memulihkan teks.
- Pause/reduced motion menghentikan loop. Render berjalan maksimum sekitar 30 fps dengan delta dibatasi; loop berhenti saat objek di luar viewport atau dokumen tersembunyi. Tidak ada React state update per frame.
- Context loss/error inisialisasi memberi SVG statis dan retry manual. Static view melepaskan renderer dan disimpan antar-reload. Tidak ada retry otomatis berulang.
- Cleanup mencakup loop, controls, observer, listener, geometry, material, texture, renderer, context dan canvas. Tidak ada shared resource yang di-dispose oleh beberapa owner.

Kode: `src/lib/scene/create-signal-scene.ts`, `signal-math.ts`, `src/components/scene/scene-host.tsx`. Pemisahan server/client mengikuti App Router; tidak memindahkan konten JSON/MDX ke browser.

## Pemeriksaan aktual

| Pemeriksaan | Hasil |
| --- | --- |
| Build produksi | Lulus Webpack, TypeScript, prerender dan syntax prototype |
| Tes unit/konten | 4 lulus; tes baru memeriksa sampel bola finite, deterministik dan radius unit |
| Browser smoke umum | Lulus: empat route/404, keyboard, pause/reduced motion, draft boundary, 320/390/768/1440 px, tanpa JS |
| Pixel WebGL saat pause/play | Frame paused identik setelah fade selesai; frame berubah saat Play |
| Orbit/reset | Keyboard dan mouse mengubah view; reset sesuai referensi dengan toleransi rasterisasi kecil |
| Fokus dan hide/show | Teks/nav tersembunyi tidak aksesibel/tabbable; restore dan Escape memulihkan fokus |
| Pergantian route | Renderer yang sama dipakai pada enam perpindahan cepat; tidak ada canvas WebGL ganda |
| Context loss | Canvas dilepas, SVG terlihat, konten tetap bisa dipakai; retry berhasil |
| Static preference | Reload tetap statis, canvas tidak dibuat, fallback tidak beranimasi; Enable 3D membuat satu renderer |
| WebGL diblokir | HTML/nav/SVG ASCII bekerja, Explore disabled |
| Touch emulation | Default scroll-first, Explore aktif secara eksplisit, reset/exit mengembalikan touch action |
| Output draft | Penanda draft contoh tidak ditemukan pada HTML/RSC/JS publik hasil build |
| Source design lint | 0 FAIL, 0 WARN |

Tes browser: `tests/browser-smoke.js`, `tests/scene-browser.js`, `tests/scene-rendering-probe.js`. Browser positif melaporkan `pageErrors: []`. Log context loss/permintaan 404 pada tes negatif diharapkan, bukan disembunyikan sebagai error aplikasi.

Pemeriksaan reset awal yang membandingkan byte PNG secara persis gagal pada satu run produksi. Perbandingan kemudian dilakukan pada piksel terdekode: sekitar 0,2% piksel berbeda, rerata selisih kanal 0,228 dari 255. Toleransi tes: rerata <0,3 dan piksel berbeda <2%; ini tidak membenarkan pergeseran kamera besar. Pause tetap memakai kesamaan frame persis.

## Probe render

Pada build produksi, Chromium lokal dengan emulasi 390 × 600 dan sampel terlihat 1,2 detik: **28,1 frame/detik** berdasarkan draw call titik. Draw tambahan selama interval pengamatan: **0 ketika offscreen, 0 ketika paused, 0 ketika dokumen disimulasikan tersembunyi**. Probe dev sebelumnya sekitar 27,3 fps.

Ini pengukuran lokal singkat dengan instrumentasi WebGL untuk QA, bukan benchmark ponsel fisik, Lighthouse, CLS atau profil memori menyeluruh. Batas DPR: 1,5 untuk stage kecil dan 2 untuk stage besar. Material memakai lighting tanpa shadow maps; tidak ada model/tekstur jaringan atau postprocessing berat.

## Review visual

Screenshot akhir produksi di `.taste-skill/scene3d-production/` ditinjau pada desktop/tablet/mobile. Stage desktop diperbesar hingga sekitar 34% viewport, sehingga focal-point desktop tidak lagi gagal. Tipografi desktop kini lima ukuran utama. Render dan fallback merupakan gambar kode orisinal; tidak ada foto/video pihak ketiga atau lisensi media baru.

Inspector tetap **4 FAIL, 1 WARN**: few-pictures, still-page, empty-screens, focal-point tablet; warning no-footage. Audit desain belum lulus. Meter jumlah elemen bergerak tidak mengukur seluruh perubahan piksel di dalam satu canvas; gerak aktual diuji terpisah dengan screenshot dan draw call. Kekosongan konten dan skala tablet masih layak ditinjau bersama materi nyata, tanpa menambah proyek/foto palsu atau banyak animasi demi skor.

```text
ROUND 3 — live Signal study
Seen in one second: nama Abdiel, konteks Teknik Komputer UI, objek sinyal dengan kedalaman nyata.
Idea (one sentence): medan sinyal dapat diamati sebagai objek 3D atau dibaca sebagai karakter ASCII.
Live thing: orbit, inspeksi ASCII, reset, pause dan mode melihat scene tanpa teks.
Layout words by section: hero=editorial split / scene=observed specimen / experience=list / explore=links.
Scores: design 7 · usability 8 · creativity 7 · content 7 → overall 7.3, capped at 6.0.
Caps applied: inspector belum lulus, tidak ada foto dan karya published nyata.
Top three problems, screenshot and fix:
1. desktop-fold.jpg awal: titik terlalu redup dan scene kurang dominan; ukuran titik/pencahayaan/stage diperbaiki, focal-point desktop lulus.
2. tablet-fold.jpg akhir: stage dan hierarki masih lebih lemah daripada desktop; tetap terbuka untuk iterasi komposisi.
3. desktop-page-01.jpg akhir: materi profil sedikit menyisakan ruang; isi karya nyata berikutnya lebih berguna daripada menambah dekorasi atau klaim.
```

## Mengulang QA

Hentikan dev sebelum build pada checkout yang sama:

```powershell
npm run build
npm start
playwright-cli open http://127.0.0.1:3000
playwright-cli run-code --filename=tests/scene-browser.js
playwright-cli run-code --filename=tests/browser-smoke.js
playwright-cli run-code --filename=tests/scene-rendering-probe.js
playwright-cli close
```

Playwright CLI adalah alat lokal penguji, bukan dependency/runtime website. Tes browser dijalankan terpisah dari `npm run check`. Tes lifecycle membutuhkan WebGL pada browser utama; skenario WebGL diblokir memakai konteks terpisah.

Belum diuji: ponsel fisik, Safari/Firefox, screen reader nyata, zoom manual 200%, audit memori GPU berkepanjangan, Lighthouse/CLS, dan error shader yang diinjeksi khusus. Engine menangani kegagalan shader, tetapi uji negatif aktual yang dilakukan adalah pembuatan konteks diblokir dan context loss. Artikel published/interaktif dan materi project tetap menunggu konten nyata. Tidak ada klaim seluruh PRD siap rilis.

Referensi API primer: [WebGLRenderer](https://threejs.org/docs/pages/WebGLRenderer), [OrbitControls](https://threejs.org/docs/pages/OrbitControls); implementasi mengikuti paket r180 yang terpasang, bukan menyalin API r186 dari contoh skill.
