# QA Home → Projects dan overview Hide Text

> Riwayat sebelum meja robotics terpisah, penghapusan Inspect ASCII dan orbit otomatis Hide Text. Perilaku/hasil terbaru ada di [QA robotics](QA-ROBOTICS-BAY.md); aturan Explore eksplisit saat overview serta sembilan poster di laporan ini sudah digantikan.

24 Oktober 2026. Lingkup yang diizinkan pemilik: satu perpindahan lengkap Home → Projects dalam lab yang sama, ditambah Hide Text yang naik/menjauh agar meja 3D terlihat. Sudut lain belum dikerjakan. Tidak menambah dependency, mengunduh model, mengubah staging, commit atau deploy.

## Perilaku yang diimplementasikan

- Satu renderer dan geometri props yang sama. `lab-camera.ts` mendefinisikan pose Home, Projects dan overview. Fit overview memakai delapan sudut bounds meja/wall; lantai di sekitarnya dapat terpotong. Portrait memiliki arah/framing sendiri.
- GSAP yang sudah ada menginterpolasi posisi, target, FOV dan fog bersama: 0,85 detik route/restore, 1,15 detik masuk overview, power3.inOut. Retarget berawal dari pose saat ini. Konten HTML tersedia langsung; navigasi tidak menunggu animasi.
- Pose awal route dimasukkan sebelum render pertama. Direct load/refresh Projects tidak terbang dari Home. Back/forward dan route cepat memakai tujuan terkini. Writing/Cabinet sementara memakai pose Home, About/Experience tetap anchor.
- Hide Text menghilangkan HTML dari akses/fokus dengan hidden/inert dan bergerak ke overview. Show Text/Escape mengembalikan sudut aktif, fokus dan posisi baca. Drag/pinch-orbit tetap Explore eksplisit; menyembunyikan teks tidak mengambil native touch scroll.
- Pause atau reduced motion menyelesaikan kamera ke tujuan, bukan membekukan konten di tengah perjalanan. Reduced motion tetap menghindari transisi kamera walau pengguna mengaktifkan Play untuk typing. Tab hidden menyelesaikan transisi sekali lalu berhenti merender. Resize nyata menyesuaikan pose langsung; notifikasi ukuran identik tidak memotong transisi.
- Tidak ada idle animation. Tween, listener visibility/context, observer, controls, geometry/material/texture dan renderer dibersihkan sesuai ownership. Static/retry dan context loss memakai poster pose aktif. Sembilan poster lokal tersedia; detail ukuran/reproduksi di ASSETS.
- Projects memiliki panel baca HTML di sisi kiri desktop dan document flow pada mobile; instrumen/eksperimen tetap ilustrasi. Empty state asli dan filter draft dipertahankan. Tautan kembali kini bernama Back to Home, sesuai route sebenarnya.

## Pemeriksaan aktual

| Pemeriksaan | Hasil |
| --- | --- |
| `npm run build` | TypeScript, tujuh tes, syntax prototype, kompilasi dan prerender lulus |
| Unit kamera baru | Home/Projects berbeda; pose finite; delapan sudut bounds meja/wall terproyeksi di dalam frame overview pada 320/844, 390/844, 768/1024, 1440/900 dan 2560/1080; overview sama lintas route |
| `personal-lab-smoke.js`, produksi | Empat route/anchor/active nav, draft/unknown 404, pause/typing/reduced motion, keyboard/fokus, reflow 320–1440, touch dan tanpa JS lulus; page error kosong |
| `personal-lab-browser.js`, produksi | Orbit/reset/Escape, ASCII, hidden/inert/fokus, 20 pergantian route dengan renderer sama, context loss/retry/static, WebGL blocked dan Explore touch 320/390 lulus; page error kosong |
| Reset piksel | Keyboard identik; mouse mean 0,000003086/255, fraction 0,000009259; toleransi sebelumnya dipertahankan |
| `personal-lab-rendering.js`, produksi | 0 render tambahan saat idle/1 detik, 2 saat interaksi; settle/resize lulus. Bukan FPS animasi atau perangkat fisik |
| `lab-camera-browser.js`, produksi | Uji final merekam 142 matriks view berbeda yang benar-benar diunggah ke WebGL saat Home → Projects. Renderer sama. Hide/Show, retarget route/fokus di tengah transisi, back/forward, tab hidden tersimulasi, pause, reduced motion dinamis, scroll restore, static/poster/re-enable dan direct Projects lulus; page error kosong |
| Fallback/touch kamera | Overview pada touch mempertahankan pan-y/pinch-zoom hingga Explore; Show Text mengembalikannya. Projects tanpa WebGL memakai poster overview lalu mengembalikan konten. Direct Projects dimulai pada matriks Projects, tanpa pose Home |
| Capture produksi | Home/Projects/overview pada desktop/tablet/mobile dan sembilan poster scene-only direkam. Hasil akhir dibuka untuk review |
| Source lint lokal | CSS/SceneHost/MotionProvider/EmptyState: 0 FAIL/0 WARN |

Log QA di `.taste-skill/lab-views/`: build, smoke-production, lifecycle-production, rendering-production, camera-production dan capture-production. Uji kamera mengamati uniform `viewMatrix` dan main-framebuffer clear; tidak memakai jumlah frame React atau atribut status saja sebagai bukti gerak. Jumlah matriks bukan klaim FPS/frame pacing. Artefak QA diabaikan Git; poster produksi berada di public/scene.

## Koreksi dan batas

- Fog overview mobile awal terlalu gelap ketika kamera menjauh; density kini diinterpolasi sesuai pose. Fit kamera tidak mengecilkan meja hanya untuk menampung seluruh floor slab.
- ResizeObserver awal bisa mengirim notifikasi identik setelah kamera mulai bergerak; guard ukuran/DPR mencegahnya menyelesaikan transisi tanpa alasan.
- Uji scroll awal mengukur sebelum hash-scroll selesai; helper menunggu scroll settle sebelum memeriksa pemulihan. Implementasi mengingat posisi saat Hide Text dan memulihkannya setelah konten kembali.
- Satu rangkaian dev mengalami timeout saat Enable 3D. Uji produksi pada browser bersih kemudian lulus, termasuk retry. Penyebab timeout dev belum dipastikan; tidak dianggap bukti memori/GPU jangka panjang aman. Assertion fungsional tidak dilonggarkan.
- Inspector generik Projects: **4 FAIL/3 WARN**. FAIL: aksen terracotta, satu scene/poster alih-alih empat gambar, panel kiri dianggap off-centre, dan hitungan elemen DOM bergerak rendah. WARN: tanpa footage, judul 30px, serta ambang subjudul/name-only-title. Panel kiri menyeimbangkan instrumen kanan; judul/empty state ringkas serta warna hangat dipertahankan sesuai produk. Tidak menambahkan karya/foto/efek fiktif untuk memenuhi meter. Hasil di `inspect-projects/`; audit belum sepenuhnya lulus.

Review lokal: panel baca kiri dan instrumen kanan membentuk sudut Projects; overview memperlihatkan kedalaman meja tanpa HTML. Sembilan screenshot viewport dan enam screenshot inspector dibuka. Critique internal: design 7 / usability 7,5 / creativity 7 / content 7, overall 6 karena audit terbuka. Fokus berikutnya adalah review pemilik atas timing/komposisi, konteks karya nyata, dan uji frame pacing/perangkat fisik. Ini rubric internal, bukan penilaian pemilik.

Belum diverifikasi: mobile fisik, Safari/Firefox, screen reader/zoom lengkap, cold-load/bundle/CLS terukur, frame pacing animasi serta GPU/memory jangka panjang. Transisi diuji pada Chromium lokal, bukan jaminan seluruh perangkat terasa sama. Penerimaan visual/gerak pemilik masih terbuka. Kontak/CV dan materi karya belum diberikan, sehingga tidak ditambahkan.

## Menjalankan kembali

Hentikan dev sebelum `npm run build`, lalu `npm start`. Jalankan suite browser pada README, terutama `tests/lab-camera-browser.js`. Capture: `tests/capture-lab-views.js`, lalu `node scripts/prepare-lab-posters.mjs` untuk semua sembilan WebP. `npm run dev` untuk mengedit, `npm run prototype` tetap studi lama. QA Home/props lama dipertahankan sebagai riwayat, bukan bukti transisi terbaru.
