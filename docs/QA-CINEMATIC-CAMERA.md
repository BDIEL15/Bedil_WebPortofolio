# QA — kamera cinematic dan opening Home

25 Oktober 2026. Pemilik menyukai susunan satu rak dan meminta POV lebih baik/dekat, perpindahan cinematic yang seamless, serta gerak pembukaan menuju Home. Tidak menambah benda/model/ruangan atau mengganti identitas visual.

## Implementasi

- Home tetap frontal/duduk dengan framing desktop sedikit lebih dekat. About memakai close view notebook, portrait lebih lurus agar buku utuh. Projects lensa sedikit lebih rapat dan target lebih rendah agar base/129 pose robot tetap masuk. Experience mempertahankan tiga name tag, Writing lebih dekat pada paper/chalkboard, Cabinet mendekat pada hobi. Tablet punya lensa lebih rapat; FOV portrait berubah kontinu mengikuti aspect, bukan pergantian angka mendadak pada 0,6.
- Opening nominal 2,6 detik desktop / 2,1 detik portrait dari sudut lebih lebar/tinggi ke Home. SceneHost menandai entry telah ditangani; tidak memutar ulang pada route, Enable 3D atau retry. Direct route selain Home/404, pause tersimpan, reduced motion, hidden dan static melewati opening. HTML/nav/touch scroll tetap segera tersedia, tanpa loading gate atau scroll hijack.
- lab-camera-motion.ts mengukur lintasan quintic dengan perlambatan akhir, arc keluar maksimal 0,6 world unit/lift 0,18/lens breathing 1,8°. Kecepatan posisi/target/FOV masuk diteruskan saat retarget. Pengereman eksponensial yang kontinu pada posisi/kecepatan menjaga incoming momentum dari overview tetap di depan ruang benda; tidak memakai hard clamp posisi. Ini penjagaan bidang aman, bukan simulasi tabrakan mesh penuh.
- Satu renderer animation loop sekitar 30Hz menggerakkan kamera/robot/monitor/notebook. Ticker GSAP kamera dihapus; GSAP reveal teks yang sudah ada tetap. Nominal route 1,25–2 detik menurut jarak, overview 1,7, reset 1,15. Delta yang tertunda dibatasi agar tidak catch-up dengan loncatan; durasi wall clock bukan jaminan konstan pada perangkat lambat.
- Pause/reduced/hidden/resize menyelesaikan flight ke pose baca/overview; drag/arrow menginterupsi, reset/Show Text/Escape memulihkan pose/scroll/fokus. Resource/listener/observer cleanup tetap; tidak ada React state/geometry/texture baru per frame. Geometry/material/light/aset tetap **249 mesh / 90.444 rendered triangle / 184 geometry / 12 generated texture**. Tidak ada dependency baru.

## Verifikasi

- Build/check: TypeScript, 12 tes dan syntax prototype serta build/prerender Next.js lulus. Unit matematika memeriksa 280 lintasan awal dan 5.880 retarget pada lima rasio, endpoint dan velocity continuity, finite/batas FOV/focus distance, area depan meja dan 129 pose robot. Batas mesh/proyeksi/occlusion lama tidak dilonggarkan. About kini juga diuji sebagai hero utuh.
- Tujuh suite produksi final lulus: smoke, story, kamera, motion, lifecycle, render probe dan cinematic-camera. Home→Projects mencatat 49 view matrix berbeda; opening desktop/mobile dibuktikan dari actual matrix dolly/descent, HTML/nav/native scroll tetap tersedia, retarget cepat tanpa lompatan frame besar, pause/hidden/reduced/stored/direct Writing dan tidak replay pada route/static re-enable. History/drag/Escape/reset/scroll, context loss/retry/static/noGL/noJS tetap lulus. Suite yang merekam pageErrors semuanya kosong.
- Lifecycle reset keyboard mean/fraction 0; reset mouse mean sekitar 1,29e-6/fraction 3,86e-6, di bawah toleransi lama. Motion mencatat 29 frame pada interval sampel (bukan klaim FPS); render probe Pause idleDelta 0/interactionDelta 2. Geometri/budget dan toleransi pixel tetap.
- Capture 12 state UI × tiga ukuran selesai, 21 poster final total **790.038 byte**. Capture poster memakai Pause dan pose akhir, sehingga fallback tidak memakai frame opening. Mode statis Home/Experience sesudah konversi memuat poster baru, tanpa live canvas/page error. Log/artifak .taste-skill/lab-views/cinema-*.
- Source lint SceneHost/CSS: 0 FAIL / 0 WARN. 21st CLI belum tersedia; memakai engine/pola proyek tanpa katalog/generation/remote source review baru.

## Review visual

Inspector Home dan Writing masing-masing **4 FAIL / 4 WARN**; audit belum sepenuhnya lulus. Dua belas screenshot inspector final dibuka (fold dan halaman desktop/tablet/mobile), ditambah render akhir About/Projects/Experience/Cabinet dan sequence opening/rekaman. Frame pertama inspector Home dapat berada di tengah opening; komposisi akhir diperiksa dari capture paused dan end frame tes, bukan diperkirakan dari frame bergerak tersebut.

Temuan generik mencakup rust accent, jumlah gambar/video, gerak DOM, margin/blank gap dan judul singkat; scene WebGL/aktivitas kamera tidak dihitung sebagai foto/animasi DOM. Palet dan satu scene dengan konten editorial/scroll portrait dipertahankan sesuai arah pemilik. Tidak menambah dekorasi, foto/footage rekaan atau animasi DOM demi meter. Ukuran judul/hierarki HTML bukan scope revisi kamera ini.

ROUND 2
Seen in one second: establishing view Home turun ke workbench, lalu tiap halaman mendekat ke objeknya.
Idea: satu ruang dibaca lewat kamera yang tenang, dengan objek sebagai penanda halaman.
Live thing: opening, arc perjalanan/retarget, Explore dan aktivitas meja yang sudah ada.
Layout: Home frontal intro; desktop close view di kanan teks; portrait objek dahulu lalu scroll teks biasa.
Scores: design 6.5 · usability 7.5 · creativity 7.5 · content 5 → overall 6.0 setelah cap audit/konten/foto belum tersedia, bukan nilai pemilik.
Top fixes: framing notebook/board/robot dikalibrasi supaya objek tidak terpotong; retarget meneruskan kecepatan dan mengerem sebelum ruang benda; opening hanya sekali serta tetap memberi akses langsung ke nav/HTML/scroll.
Remaining: masukan pemilik terhadap tempo/POV, foto/cerita nyata dan pengukuran perangkat fisik.

Rekaman scene asli tersedia pada .taste-skill/lab-views/cinema-camera.webm (sekitar 7,1 MB); hanya canvas 3D, overlay HTML tidak direkam. Rekam full-page Playwright sempat gagal karena encoder ffmpeg tidak terpasang; fallback memakai captureStream/MediaRecorder bawaan browser, tanpa instalasi. Rekaman WebM berhasil didekode 1440×900 tanpa video error dan frame dapat diseek untuk inspeksi; metadata durasi native bersifat streaming (Infinity). Ini bukti visual lokal, bukan benchmark FPS atau aset produksi.

## Temuan dan batas

Framing yang hanya menambah zoom memotong notebook/board/robot; pose/target/lensa dikalibrasi dengan batas aktual, bukan menaikkan toleransi proyeksi. Uji retarget dari overview menemukan overshoot incoming velocity; pengereman halus ditambahkan dan seluruh kombinasi diperiksa ulang. Awal assertion Y2,5 terlalu ketat pada kamera yang jauh di depan; pemeriksaan aktual memakai ruang aman di atas meja Y>1,8 dan depan Z>0,8, kemudian source mengerem sebelum Y1,9/Z0,85. Tidak mengklaim full collision detection.

Belum diuji: perangkat fisik, Safari/Firefox, screen reader/zoom lengkap, CLS/cold-load dan GPU/memory/thermal jangka panjang. Foto asli masih null. Framing/tempo baru menunggu masukan pemilik; tidak menyatakan seluruh PRD selesai atau kualitas otomatis lulus karena nama model. Perubahan lokal sebelumnya/prototype/analysis/studi/lisensi dipertahankan; tidak stage/commit/push/deploy.

## Menjalankan

npm run dev, studi lama npm run prototype. npm run check; hentikan dev sebelum npm run build, lalu npm start. Tujuh suite browser/capture di README; poster lewat node scripts/prepare-lab-posters.mjs. Untuk melihat entry, pastikan motion aktif lalu refresh Home; perpindahan biasa ke Home tidak memutarnya lagi.

Penutupan: browser QA cinema beserta context rekaman ditutup; server produksi sementara dihentikan setelah command line repository diverifikasi. Preview dev dipulihkan di http://127.0.0.1:3000/ dan melaporkan Ready. Perubahan tersimpan di file, tanpa stage/commit/push/deploy.
