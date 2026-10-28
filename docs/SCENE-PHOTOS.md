# Mengisi foto pada scene

**27 Oktober:** tiga foto ID card dari pemilik sudah aktif: `digilab-id.png` → `digital-laboratory`, `exercise-id.png` → `exercise-2026`, `kominfo-ime-id.png` → `ime-2026`. PNG asli disalin tanpa perubahan; alpha diteruskan pada material foto agar warna kartu terlihat di belakang cutout. Slot memory tetap kosong. Semua 21 poster diperbarui dari scene paused pada desktop/tablet/mobile; capture scene-only sementara dilepas sesudahnya.

Lima slot tersedia: foto untuk tiga lanyard Experience dan dua bingkai kenangan di sisi kiri. Saat kosong, scene menampilkan mount netral bertuliskan PHOTO, tanpa wajah atau dokumentasi rekaan.

**26 Oktober:** prioritas pertama kini berada di slot kanan/dekat kamera (bekas IME), sesuai klarifikasi pemilik. Dengan urutan JSON saat ini, posisi fisik kiri→kanan adalah IME → EXERCISE → Lab. ID foto tetap mengikuti peran yang sama; tidak perlu menukar file foto/key ketika slot berpindah.

Name tag menampilkan **tiga entri published pertama** dari `src/content/experiences.json`. Susun file tersebut menurut prioritas yang ingin ditonjolkan; draft dilewati sebelum memilih tiga. Daftar HTML Experience tetap menampilkan seluruh peran published. Badge memakai ID peran untuk mencocokkan foto, sehingga mengubah urutan tidak menukar foto antarorganisasi. Untuk ID baru, tambahkan key yang sama ke konfigurasi foto; biarkan `null` sampai foto siap publik. Nama lengkap/peran/organisasi pada kartu bukan credential atau sertifikat.

1. Simpan foto yang siap tampil publik ke `public/photos/`, misalnya `digital-lab.webp`. JPG, JPEG, PNG dan WebP didukung; gunakan nama file huruf kecil tanpa spasi. Sekitar 1200 px pada sisi panjang sudah memadai untuk slot ini.
2. Edit `src/data/scene-photo-slots.json`. Ganti `null` pada slot yang sesuai dengan URL lokal, misalnya `"/photos/digital-lab.webp"`.
3. Jalankan `npm run dev` dan tinjau Experience/Home/Explore. Foto dipotong dari tengah agar memenuhi bidang. Pilih crop sumber yang menempatkan subjek di tengah.

| ID slot | Lokasi |
| --- | --- |
| `digital-laboratory` | Lanyard Digital Laboratory |
| `exercise-2026` | Lanyard EXERCISE FTUI |
| `ime-2026` | Lanyard IME FTUI |
| `memory-01` | Bingkai kiri bawah |
| `memory-02` | Bingkai kiri atas |

Biarkan `null` jika belum ada foto yang sesuai. File yang gagal dimuat tetap memakai mount netral. Loader hanya menerima URL `/photos/...` lokal; handler dibersihkan saat scene ditutup dan texture ikut ownership/dispose renderer. Foto baru tetap menggambar saat Pause aktif setelah selesai dimuat.

Konfigurasi ini khusus aset scene publik, bukan tempat menyimpan draft atau foto privat. Memasukkan foto ke scene tidak otomatis membuat entri koleksi Cabinet atau klaim kontribusi pada Experience. Isi konten HTML tetap melalui content layer yang ada.

Setelah mengganti foto, perbarui poster agar fallback tanpa WebGL/JavaScript ikut berubah: hentikan dev, jalankan `npm run build`, lalu `npm start`. Dengan `playwright-cli` tersedia, jalankan capture sesuai README (`tests/capture-lab-views.js`), lalu `node scripts/prepare-lab-posters.mjs`. Capture menunggu network idle agar penggantian foto telah selesai dimuat sebelum screenshot. Tinjau hasil desktop/tablet/mobile, lalu hentikan produksi sementara dan jalankan dev kembali bila ingin mengedit.
