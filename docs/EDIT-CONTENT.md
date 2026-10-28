# Mengedit konten portofolio

Keputusan pemilik, 26 Oktober 2026: konten memakai file lokal JSON dan Markdown/MDX. Supabase/database dan admin ditunda. Alur harian: **buat draft → isi → periksa → tinjau lokal → build → deploy**. Mengganti konten tidak perlu mengedit engine 3D.

## Mulai dari file yang tepat

| Yang ingin diubah | Lokasi | Tampil di |
| --- | --- | --- |
| Nama, intro, bio, typing, pendidikan, fokus | `src/content/profile.json` | Home/About; field dipakai sesuai halaman |
| Teks dan foto About final | `src/content/about.json` | About; heading, paragraphs, portrait. Menggantikan bio profil dan placeholder About |
| Akun sosial dan email (`socialLinks`) | `src/content/profile.json` | Ikon di intro Home; label, icon, href HTTPS atau mailto |
| Pengalaman dan urutannya | `src/content/experiences.json` | Experience + tiga name tag 3D pertama |
| Proyek | `src/content/projects/<slug>.json` | Projects + dialog ringkasan |
| Tulisan | `src/content/writing/<slug>.md` | Writing + `/writing/<slug>` |
| Benda/koleksi dan cerita | `src/content/cabinet/<slug>.json` | Daftar Cabinet |
| Foto scene dan lanyard | `src/data/scene-photo-slots.json` | Bidang foto pada scene 3D |
| Berkas foto siap publik | `public/photos/` | URL `/photos/nama-file.webp` |

`src/data/ui-preview.json` adalah contoh layout, bukan konten milikmu. Jangan mengisi karya asli di sana. `templates/content/` berisi template pembuat draft dan tidak dibaca sebagai koleksi website.

## 1. Edit profil dan pengalaman

Buka `src/content/profile.json` di editor. Pertahankan nama field; ubah nilai di sebelah kanannya. `headline` untuk sapaan Home, `interests` untuk frasa typing, `intro`/`bio` untuk copy profil. `education` dan `focusAreas` dipakai di About. Gunakan `\n` jika memang memerlukan newline dalam string JSON; JSON tidak menerima komentar atau koma terakhir.

Pengalaman berada dalam satu array di `experiences.json`. Untuk menambah, salin satu objek di dalam array, pisahkan dengan koma, dan gunakan ID baru:

```json
{
  "id": "ganti-id-pengalaman",
  "organization": "GANTI nama organisasi",
  "role": "GANTI peran nyata",
  "status": "draft"
}
```

Tambahkan `"year": "2026"` atau periode yang benar jika sudah diketahui; jangan mengarang tanggal. Urutan array adalah prioritas tampilan. Semua entri published tampil di HTML; hanya tiga published pertama masuk name tag 3D. Foto dicocokkan berdasarkan ID, bukan posisi array. Pertahankan ID saat hanya mengubah copy.

## 2. Buat konten baru

Experience juga mendukung `organizationName` (nama panjang pada HTML; `organization` tetap nama ringkas pada badge 3D), `period`, `employmentType`, `location`, `logo` (URL `/logos/...` lokal), `description`, `skills` dan `achievements` (array teks). `period` menggantikan tampilan `year` pada daftar HTML; `year` tetap dipakai pada badge bila tersedia. Pakai periode bulan/tahun tanpa menghitung durasi secara manual. Logo organisasi disimpan di `public/logos/`; foto lanyard tetap terpisah di `scene-photo-slots.json`.

Dari terminal di folder proyek, gunakan salah satu perintah:

```powershell
npm run content:new -- project nama-proyek
npm run content:new -- writing catatan-pertama
npm run content:new -- cabinet kamera-saya
```

Nama tersebut hanya contoh penamaan, bukan klaim karya. Perintah menghasilkan satu file berstatus `draft` pada folder yang benar. File yang sudah ada tidak ditimpa. Slug memakai huruf kecil, angka dan tanda hubung; tanpa spasi atau garis miring.

Buka file yang dihasilkan dan ganti seluruh teks `GANTI`/panduan. ID adalah identitas stabil; slug untuk identitas URL, terutama Writing. Hindari mengubah slug artikel setelah dipublikasikan karena tautan lama akan putus. Project/Cabinet saat ini belum mempunyai halaman detail berdasarkan slug.

Field yang didukung saat ini:

| Jenis | Field yang diedit |
| --- | --- |
| Project | `id`, `slug`, `title`, `summary`, `status` |
| Cabinet | `id`, `slug`, `title`, `note`, `kind`, `status` |
| Writing | frontmatter `id`, `slug`, `title`, `description`, `status`, `lang`, `topics`, `publishedAt`, `updatedAt`; naskah setelah frontmatter |

Project saat ini memakai ringkasan yang sama di kartu dan pembuka dialog; belum ada editor field galeri/case study rinci. Cabinet asli menampilkan judul dan catatan, bukan semua detail contoh layout. Menambahkan field yang belum didukung tidak otomatis membuatnya muncul. Gunakan schema yang tersedia sampai kebutuhan detail disepakati.

Projects/Cabinet mengikuti urutan alfabet nama file. Untuk mengatur prioritas, boleh ubah nama file menjadi `01-nama.json`, `02-nama.json`; nilai ID/slug di dalamnya tetap. Writing otomatis diurutkan dari tanggal publikasi terbaru.

## 3. Menulis dengan Markdown

Template Writing dibuat sebagai `.md`. Pertahankan blok metadata di antara dua baris `---` paling atas. Contoh sintaks naskah:

```markdown
## Apa yang saya pelajari

Paragraf dengan **penekanan** dan [tautan](https://example.com).

- Poin pertama
- Poin kedua

![Deskripsi gambar](/photos/nama-gambar.webp)
```

Tanggal memakai `YYYY-MM-DD`, tidak di masa depan. `publishedAt` wajib saat status published; `updatedAt` opsional. `lang` saat ini hanya `en`; `topics` berbentuk array, misalnya `[robotics, learning]`. Judul/deskripsi yang mengandung tanda titik dua sebaiknya dibungkus tanda kutip.

Gunakan `.mdx` hanya jika membutuhkan komponen React yang sudah didaftarkan di renderer artikel. Jangan menyalin kode MDX tidak tepercaya. Jangan membuat dua file `.md`/`.mdx` dengan ID atau slug yang sama.

## 4. Foto dan berkas

Simpan hanya foto yang siap dibagikan ke `public/photos/`. Gunakan nama deskriptif huruf kecil, misalnya `nama-proyek-board.webp`, dan kompres foto sebelum disimpan. URL pada naskah diawali `/photos/`, bukan `/public/photos/`.

**Semua berkas dalam `public/` bisa dibuka langsung**, meskipun tulisan yang merujuknya masih draft. Simpan foto privat di luar `public/` sampai siap diterbitkan. Mengubah tulisan menjadi draft tidak mencabut foto yang masih ada di folder publik.

Untuk foto lanyard/bingkai, ikuti [SCENE-PHOTOS](SCENE-PHOTOS.md). Perubahan foto scene juga membutuhkan pembaruan poster fallback melalui prosedur dokumen tersebut. Foto About diatur melalui `src/content/about.json` (portrait). Cover kartu, kontak dan CV belum memiliki field/rendering lengkap; jangan menganggap menaruh file saja akan memasangnya pada UI.

## 5. Periksa dan lihat hasil

```powershell
npm run content:check
npm run dev
```

Pemeriksaan membaca file asli, memvalidasi metadata termasuk draft, menolak ID/slug ganda pada Projects/Cabinet/Writing, memeriksa tanggal tulisan dan mengompilasi body tulisan published. Ia tidak memeriksa kebenaran klaim, keberadaan setiap gambar/tautan atau layout browser. Metadata draft yang rusak juga harus diperbaiki agar build tidak gagal.

Buka `http://127.0.0.1:3000/`. Halaman asli memakai URL biasa atau `?preview=0`. `?preview=1` **hanya contoh layout**, bukan preview draft, dan tidak menampilkan isian draftmu.

Untuk meninjau konten baru, ubah `status` menjadi `published` **hanya pada salinan lokal**, tambahkan `publishedAt` untuk Writing, lalu jalankan pemeriksaan lagi. Buka Projects/Writing/Cabinet sesuai isian; artikel ada di `/writing/<slug>`. Periksa teks panjang, link, gambar, mobile dan keyboard. Kembalikan status ke draft sebelum commit/deploy jika belum siap publik. Jangan push perubahan published sementara ke branch yang terhubung auto-deploy.

Profil langsung tampil dan tidak memiliki status draft. Simpan salinan/Git diff sebelum mencoba copy profil. Jangan gunakan `src/data/ui-preview.json` untuk menyiasati preview draft.

## 6. Terbitkan atau tarik konten

1. Isi final sudah benar dan semua teks panduan dihapus.
2. Atur status published; isi tanggal valid untuk Writing. Draft lain tetap draft.
3. Jalankan `npm run content:check`.
4. Hentikan server dev dengan Ctrl+C di terminalnya sebelum build pada checkout yang sama.
5. Jalankan `npm run build`, lalu `npm start` untuk meninjau hasil produksi lokal.
6. Periksa halaman desktop/mobile dan pastikan draft tidak terlihat.
7. Commit/push lalu deploy melalui hosting yang kamu pilih. Mekanisme auto-deploy belum dikonfigurasi oleh alur ini.

Untuk menarik konten, ubah status kembali menjadi draft dan build/deploy ulang. Artikel Writing yang ditarik tidak lagi masuk parameter route published pada build baru. Tinjau juga berkas publik yang perlu ditarik dan cache hosting. Jangan mengandalkan status draft untuk menyembunyikan data yang sudah pernah terbit, tersimpan di Git publik, atau disalin pihak lain.

## Batas static pada implementasi sekarang

Konten sudah file-first tanpa database. Aplikasi tetap Next.js dengan server: beberapa halaman membaca query `preview` di server. **Ini belum ekspor HTML murni (`output: 'export'`)** dan tidak cukup mengunggah folder `public/` saja. Deployment saat ini memerlukan hosting yang mendukung Next.js, atau tahap konversi static export tersendiri. Tidak ada perubahan hosting/deploy otomatis dalam pekerjaan ini.

Saat konten berubah, terbitkan build baru. File lokal adalah satu sumber utama; tidak ada sinkronisasi database, admin web, atau kebutuhan membuka engine 3D untuk mengedit teks.
