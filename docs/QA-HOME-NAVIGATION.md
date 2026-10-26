# QA — Home ringkas dan navigasi tetap

26 Oktober 2026. Pemilik meminta panel pengalaman pada screenshot Home dihapus, header tetap ketika scroll dan lingkaran/penanda aktif bergerak ke menu yang diklik.

## Perubahan

- Home hanya intro, typing, CTA dan scene. Panel Experience dihapus dari markup/fetch Home; footer Home disembunyikan. Identitas/pengalaman asli tetap di halaman yang sesuai. Tinggi/padding Home disesuaikan agar tidak menghasilkan halaman bawah kosong pada viewport desktop normal.
- Header fixed di tengah atas (safe-area pada mobile), tetap ringkas satu baris desktop atau dua baris mobile. Ruang konten dan scroll-margin disesuaikan; Hide Text tetap menyembunyikan header dan konten baca untuk eksplorasi. Dialog native tetap berada di atas header.
- Satu span penanda diukur terhadap link. Web Animations API menggerakkan transform selama 460ms dengan ease-out; width/height ditetapkan sekali per tujuan, bukan dianimasikan per frame. Penanda dan aria-current mengikuti route yang committed, sehingga tidak melaju selama capture native menunggu respons atau ke navigasi yang dibatalkan. Retarget membaca posisi visual saat ini. Back/Forward dan Enter mengikuti route; modifier click tidak memindahkan indikator.
- Observer nav/link serta font-ready menangani reflow dan grid dua baris. Tidak ada RAF/state React per frame. Pause/reduced/hidden membatalkan animasi ke tujuan; unmount membersihkan observer/listener/animation. CSS active-link tetap tersedia sebelum hidrasi/tanpa JS.
- Review screenshot menemukan snapshot native main dapat menutupi header ketika scroll dilakukan selama fade, walau z-index header sudah benar pada DOM biasa. Area pseudo view-transition kini di-clip mulai di bawah header, memakai clearance dari ukuran aktual header +12px. Header/marker tetap live, tidak ikut snapshot statis. Tes clearance dan screenshot scroll/transisi ditambahkan; build dan QA diulang sesudah koreksi.
- Home CTA Projects mempertahankan preview. Bookmark lama `/#experience` (atau varian preview) diarahkan ke Experience saat JS aktif; tanpa JS, navigasi Experience masih tersedia. Tes scroll restore kamera dipindahkan ke About preview yang memang panjang, bukan memaksakan scroll di Home yang sudah ringkas.

## Pemeriksaan

Tes baru `tests/navigation-browser.js` mencakup 1440×900, 768×1000, 390×844 dan 320×700: Home bersih, posisi header saat scroll, marker transform-only, alignment, klik cepat, Back/Forward, keyboard, preview, pause/reduced, resize, legacy bookmark dan noJS. Dev lulus dengan pageErrors kosong. Tes awal sempat mengasumsikan setiap klik cepat masuk history; route yang dibatalkan tidak wajib menjadi entri history. Fixture dipisah antara klik cepat dan dua route yang sudah committed, kemudian lulus.

TypeScript/check final 13 tes dan source lint empat file 0 FAIL/0 WARN lulus. Jumlah final mencakup content-workflow yang kini ikut script check repository; pemeriksaan dev awal berisi 12. Build/tes produksi final dicatat pada checkpoint TODO. Metadata-only 21st: Floating Pill Pagination 27566 / Pill Morph Tabs 7878; hanya pola perpindahan penanda yang relevan. Memakai komponen/platform proyek, tanpa mengambil kode berbayar/generation/dependency atau ticker baru. Scene/POV/poster/kamera tidak diubah.

Final setelah koreksi clipping: **build/check 13 tes lulus**, lima suite **produksi** navigation, lab-camera, personal-lab-smoke, ui-preview dan text-transition lulus. PageErrors kosong; semua 30 arah desktop/mobile tetap beranimasi. Scroll restore pada About dan bookmark legacy lulus. Log header-build.txt, header-lint.txt, header-prod-*.txt di .taste-skill/. Diff whitespace dan JSON konteks desain valid. Browser QA ditutup, server produksi sementara dihentikan dan preview dev dipulihkan.

## Visual dan batas

Before Home: `.taste-skill/header-before` (4 FAIL/5 WARN); after serta screenshot Home/scrolled tiap ukuran berada di `.taste-skill/header-*`. Home desktop 1440×900 aktual menunjukkan intro/scene dan header di y=24, tinggi dokumen 900; tidak ada experience/footer ekstra. Pemeriksaan visual final/audit generik dicatat saat penutupan. Warna hangat, ruang scene dan tombol pill mengikuti keputusan pemilik; tidak menambah motion/media palsu untuk lolos meter.

Inspector final Home **3 FAIL/3 WARN**, belum sepenuhnya lulus. Temuan tersisa: palet rust, jumlah gambar/footage, hitungan motion DOM yang tidak membaca renderer, pill nav sesuai permintaan dan headline nama (intro status mahasiswa sebenarnya tersedia). Tidak lagi ada extra section/bottom gap Home. Review mencakup render Home desktop/tablet/mobile dan header scrolled desktop/mobile; snapshot yang menutupi header ditemukan dan dikoreksi sebelum penutupan. Gambar inspector dapat menangkap opening Home, bukan jaminan pose akhir; screenshot header-first.png diambil setelah kamera idle.

HP fisik, Safari/Firefox, screen reader/zoom menyeluruh dan performa GPU jangka panjang belum diverifikasi. NoJS mempertahankan navigasi/active link, tetapi tidak menjalankan marker bergerak atau redirect hash. Preview: npm run dev → /?preview=1. Check: npm run check. Hentikan dev sebelum npm run build; npm start untuk build produksi. Prototype: npm run prototype. Tidak stage/commit/push/deploy.

Browser QA setelah server produksi siap: `playwright-cli -s=nav open http://127.0.0.1:3000/`, lalu `playwright-cli -s=nav run-code --filename=tests/navigation-browser.js`, dan `playwright-cli -s=nav close`. Suite regresi memakai pola yang sama untuk `lab-camera-browser.js`, `personal-lab-smoke.js`, `ui-preview-browser.js`, `text-transition-browser.js`. File hasil header-prod-*.txt berada di .taste-skill/.
