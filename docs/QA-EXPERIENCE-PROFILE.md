# QA — Experience profil dan prioritas name tag

26 Oktober 2026. Pemilik meminta UI Experience lebih rapi seperti LinkedIn dan mengutamakan Lab Assistant pada name tag.

## Keputusan dan implementasi

Pemeriksaan render awal dan poster menunjukkan Lab sudah berada di kiri, tetapi tertutup area teks; IME di kanan dan paling dekat kamera. Setelah ditanya, pemilik menegaskan **Lab menggantikan posisi IME saat ini**. Karena itu daftar/JSON tetap Lab → EXERCISE → IME, sedangkan slot fisik kiri→kanan menjadi IME → EXERCISE → Lab. Tidak membalik sumber data global.

- UI menggunakan satu panel profil hangat dengan timeline, monogram generik, peran sebagai heading, organisasi dan tahun yang tersedia. Monogram bukan logo resmi. Role/organisasi/tahun dari JSON published; tidak menambah tanggal Lab, durasi, tipe pekerjaan, lokasi, kontribusi atau metrik rekaan.
- Slot `2-i` menempatkan prioritas pertama di kanan/dekat kamera; rotasi mengikuti slot. Atlas, warna dan foto tetap mengikuti peran/ID. Pemilihan server tetap tiga published pertama, daftar HTML tetap seluruh peran published.
- Semua 21 poster aktif diregenerasi dari tujuh pose × tiga ukuran: **790.772 byte**. Scene tetap satu workbench/renderer dan budget 249 mesh/90.444 triangle/184 geometri/12 tekstur; tidak menambah model/tekstur/dependency. Kamera/motion/lifecycle tidak diubah.
- Ketika capture scene-only, nav marker sebelumnya dapat tetap terlihat karena child menetapkan visibility visible di bawah parent hidden. Visibility marker diganti dengan opacity; kini ia mewarisi hidden dari UI saat capture. Tes hygiene memeriksanya; fallback tetap bebas elemen HTML.

## Verifikasi

Check awal **13 tes lulus**, termasuk slot descending dengan pemisahan, proyeksi screen-X di lima rasio, occlusion foto/identitas, budget dan photo-ID. Source lint Experience/CSS **0 FAIL/0 WARN**. Build dan suite produksi final dicatat pada TODO.

Tes baru `tests/experience-browser.js`: 1440/768/390/320 px; prioritas daftar, role/company/year, monogram sejajar, tidak ada periode Lab rekaan, overflow, noJS, noWebGL, static fallback serta marker tersembunyi ketika capture. Dev lulus/pageErrors kosong. Tes story lama tetap memeriksa tiga peran dan tahun nyata.

Final: **build/check 13 tes lulus**, lima suite **produksi** experience, story-corners, personal-lab-smoke, personal-lab-browser/lifecycle dan navigation lulus; pageErrors kosong. Semua 21 poster scene-only dikonversi dengan source yang baru; poster Experience desktop dibuka dan menunjukkan IME → EXERCISE → Lab tanpa marker UI. Tidak mengulang suite kamera/text-transition/render probe karena pose/flight/loop tidak berubah. Source lint 0/0, whitespace diff dan JSON konteks desain bersih. Browser QA ditutup, produksi sementara dihentikan dan dev dipulihkan untuk review pemilik.

Metadata-only 21st Experience Timeline 28334/28329 dan Experience Timeline Section 38037 memberi acuan hierarchy. Implementasi memakai komponen/CSS/platform proyek; tidak mengambil kode berbayar/generation, memasang dependency atau menyalin tampilan biru LinkedIn.

## Visual dan batas

Before `.taste-skill/experience-before` **5 FAIL/3 WARN**; after `.taste-skill/experience-after` **4 FAIL/3 WARN**. Desktop menunjukkan Lab di slot bekas IME dan panel profil; mobile menempatkan scene di atas konten scroll biasa. Render before desktop/scene dan after desktop/mobile diperiksa; audit generik tetap belum sepenuhnya lulus. Temuan tersisa: palet rust, sedikit raster/footage, komposisi kolom dengan scene, motion DOM serta headline mobile yang dinilai tanpa membaca layout scene. Tidak menambah foto/video/animasi rekaan untuk memenuhi meter.

Foto tetap null. HP fisik, Safari/Firefox, screen reader/zoom menyeluruh serta GPU/memory jangka panjang belum diuji. Tidak ada database/admin/deploy, stage/commit/push. Preview npm run dev → /experience?preview=1 atau /experience (keduanya memakai pengalaman nyata). npm run check; hentikan dev sebelum npm run build, lalu npm start. Prototype tetap npm run prototype.

Browser QA: setelah server siap, playwright-cli -s=experience open http://127.0.0.1:3000/experience lalu playwright-cli -s=experience run-code --filename=tests/experience-browser.js. Tutup dengan playwright-cli -s=experience close. Regresi: story-corners-browser, personal-lab-smoke, personal-lab-browser, navigation-browser dengan pola perintah sama. Log produksi experience-prod-*.txt di .taste-skill/.
