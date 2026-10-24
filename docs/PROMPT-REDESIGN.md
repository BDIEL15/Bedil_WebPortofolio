# Prompt untuk chat implementasi

Salin isi blok berikut ke chat pengerjaan sebelumnya. Prompt menjadi permintaan eksekusi ketika dikirim oleh pemilik; keberadaan file ini tidak otomatis memulai implementasi.

```text
Lanjutkan redesign portofolio Abdiel Deandra EL Dzaky di repository:
C:\Users\abdie\OneDrive\Documents\ChatGPT\Website Portofolio

Brainstorming terbaru sudah menghasilkan konsep yang saya setujui. Saya sekarang meminta implementasi dilanjutkan. Keputusan di bawah menggantikan arahan visual lama yang bertentangan.

Baca terlebih dahulu:
- AGENTS.md
- Checkpoint TERATAS TODO.md
- docs/REDESIGN-LAB.md
- PRD §2.5, §7.7 dan §16.5
- README.md
- docs/ASSETS.md dan docs/QA-WORKSHOP.md sesuai kebutuhan

Jangan melanjutkan backlog lama tanpa mencocokkannya dengan keputusan terbaru.

KONSEP
Satu lab/workbench elektronik personal dengan bentuk 3D sederhana seperti https://www.raomuhammadhamza.tech/, material dan pencahayaan hangat, serta komposisi editorial tenang seperti https://www.clarissabuilds.com/.

Referensi foto tersimpan di analysis/workbench-references/:
- Komposisi foto 3.
- Kehangatan dan karakter personal foto 2 sebagai acuan utama.
- Aktivitas eksperimen foto 4.
- Kepadatan rak foto 1.

Foto hanya referensi desain, bukan aset produksi atau bukti ruangan milik saya. Jangan mengambil model, tekstur atau source dari website referensi.

TUJUAN DAN IDENTITAS
- Audiens utama perekrut; tindakan utama menghubungi saya.
- Cerita menunjukkan perjalanan saya.
- Bahasa publik Inggris.
- Saya mahasiswa Teknik Komputer Universitas Indonesia.
- Jangan mengarang karya, kontribusi, periode, prestasi, metrik, kontak atau tautan.

PENGALAMAN WEBSITE
- Home menampilkan workbench dengan intro di tengah dan baris typing.
- Kandidat intro: “Hi, I'm Abdiel.”
- Kandidat typing: “a computer engineering student” dan “robotics enthusiast”; frasa lain jangan dianggap final.
- About, Projects, Experience, Writing dan Cabinet memiliki sudut masing-masing dalam lab yang sama.
- Projects dapat memakai robot di meja sebagai elemen visual; jangan menyiratkan robot ilustratif sebagai karya saya.
- Kabel dan mechanical keyboard menjadi kandidat benda utama. Manga dan stiker meme masih tentatif.
- Interaksi scene berfokus pada observasi/inspeksi, bukan game atau simulasi alat.
- Menu dan konten HTML langsung tersedia. Pengunjung tidak perlu menemukan objek atau menunggu intro untuk mengakses informasi.
- Perpindahan kamera singkat, konsisten, dan mengikuti pause/reduced motion.

MOBILE
- Gunakan framing portrait khusus, bukan mengecilkan tampilan desktop.
- Default touch tetap scroll/tap.
- Orbit/drag hanya aktif setelah memilih Explore; sediakan cara keluar dan reset yang jelas.
- Konten panjang mengikuti alur scroll. Writing/detail mendapat area baca lega dan scene yang tenang.
- Navigasi, kontak dan CV tetap mudah ditemukan ketika datanya tersedia.
- Sediakan fallback statis dari render scene yang sama.

KONTEN
- Versi pertama memakai file-first: JSON untuk data terstruktur, Markdown/MDX tepercaya untuk tulisan/case study.
- Gunakan content layer yang sudah ada.
- Writing bebas topik, termasuk fisika; komponen interaktif ditambahkan hanya ketika artikel membutuhkannya.
- Tidak perlu memasang database, Supabase, dashboard admin, komentar atau login pengunjung.
- Karya dan detail pengalaman akan saya isi kemudian. Pertahankan empty state yang jujur dan jangan membocorkan draft ke output publik.

PENGGUNAAN MODEL DAN REASONING
Default kerja: GPT-6.1 Sol Medium, mengikuti model yang tersedia di aplikasi. Pembagian ini adalah panduan kerja, bukan jaminan kemampuan atau hasil model.

- Medium: memahami repository, perencanaan rutin, layout/CSS, integrasi konten, komposisi scene awal, serta menjalankan pemeriksaan.
- High: pertimbangkan saat menangani koordinasi kamera antarroute, lifecycle/resource WebGL, konflik input mobile, masalah performa, atau bug yang penyebabnya belum jelas setelah pemeriksaan awal.
- XHigh atau lebih tinggi: pertimbangkan hanya jika masalah tetap ambigu setelah percobaan terarah dan bukti menunjukkan perlunya analisis lebih mendalam. Jangan menjadikannya default.
- Astra: rekomendasikan hanya untuk masalah sulit yang belum terselesaikan atau keputusan arsitektur dengan tradeoff besar. Jelaskan bukti dan manfaat yang diharapkan.
- Luna: dapat dipertimbangkan untuk edit kecil yang jelas, seperti copy, dokumentasi atau perubahan data sederhana.

Sebelum menyarankan peningkatan, jelaskan singkat:
1. Masalah dan bukti yang ditemukan.
2. Model/effort yang disarankan, sesuai pilihan yang tersedia.
3. Manfaat yang diharapkan.

Jangan menyarankan upgrade hanya karena tugas memakai Three.js, shader atau desain 3D. Jangan mengklaim dapat mengganti model sendiri; saya mengubahnya melalui kontrol aplikasi. Tetap lanjutkan pekerjaan independen yang dapat diselesaikan tanpa menunggu pergantian model. Jangan mengulang rekomendasi upgrade tanpa bukti baru.

Kualitas dinilai dari render aktual, pemeriksaan browser, build, aksesibilitas dan performa—bukan nama model atau tingkat reasoning.

CARA MENGERJAKAN
1. Verifikasi Git, staging, proses berjalan, dan fondasi yang tersedia. Pertahankan perubahan lokal; jangan reset, clean atau stash.
2. Gunakan kembali Next.js, content layer, SceneHost, lifecycle, pause/reduced motion dan fallback yang relevan. Jangan mengulang fondasi atau REA tanpa kebutuhan.
3. Mulai dari satu bukti visual Home desktop dan mobile di aplikasi nyata. Prioritaskan bentuk, komposisi, material, cahaya, bayangan dan keterbacaan sebelum menambah motion/detail.
4. Periksa hasil di browser dan tampilkan screenshot aktual agar saya bisa memberi masukan sebelum memperluas sudut/halaman lainnya.
5. Gunakan solusi terkecil yang memenuhi kebutuhan. Tambahkan dependency hanya jika benar-benar diperlukan.
6. Ikuti skill yang relevan. Jika perlu layanan eksternal, periksa kemampuan dan batas pengiriman data terlebih dahulu.
7. Jalankan pemeriksaan yang sesuai tahap. Untuk perubahan runtime, jalankan check/build dan QA browser yang relevan; jangan build bersamaan dengan dev pada checkout yang sama.
8. Update TODO dan dokumen ketika status benar-benar berubah. Bedakan hasil implementasi, hasil pengujian, dan hal yang belum diverifikasi.
9. Jangan deploy atau melakukan commit tanpa permintaan saya.

Mulai kerjakan tahap verifikasi lalu bukti visual Home desktop/mobile. Jangan berhenti pada rencana atau mengulang pertanyaan brainstorming yang sudah terjawab. Materi karya, pengalaman dan kontak yang belum siap tidak perlu menghalangi studi visual Home.
```
