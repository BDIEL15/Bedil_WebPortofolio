# Review portofolio Abdiel — 4 November 2026

Evaluasi sebelum perubahan kode. Impeccable critique dan audit dijalankan dengan dua assessment independen; design-taste-frontend dipakai untuk dua usulan arah. Target arsip: `src/app/page.tsx`, cakupan review seluruh portofolio. Mode: Experience, dengan kebutuhan membaca pada About/Experience/artikel.

## Kesimpulan

Identitas lab personal kuat dan koheren. Kesenjangan terbesar adalah antara kualitas dunia 3D dan kemudahan menemukan bukti kompetensi. Pertahankan karakter lab, lalu perbaiki keterbacaan mobile dan hirarki kontribusi sebelum menambah efek.

Penilaian desain Nielsen: **19/28 (68%, acceptable)**. Audit teknis: **16/20 (good)**. Skor adalah penilaian heuristik, bukan sertifikasi WCAG atau hasil pengujian pengguna.

## Kekuatan

- Satu meja lab dan sudut khusus per route menyatukan software, elektronika, robotika, serta minat pribadi. Benda memberi alasan pada komposisi, bukan dekorasi generik.
- ArduiMania, Bank Vault Passcode, dan Cash Register mempunyai dokumentasi nyata: kontribusi pribadi, cara kerja, tantangan, hasil, foto/skematik. Ini aset terkuat untuk penilaian teknik.
- Potret, lanyard, tulisan personal dan Cabinet membuat profil manusiawi. HTML terpisah dari WebGL; pause, static view dan dialog native memberi kendali.

## Prioritas gabungan

**P1 — Ketenangan area baca mobile.** `a/experience-mobile.png` dan `a/article-mobile.png` menunjukkan paragraf melewati badge, instrumen, robot, dan meja. Pause menghentikan gerak tetapi tidak mengurangi tekstur. Perkuat scrim netral pada seluruh area baca termasuk sepanjang scroll; redupkan scene lebih banyak pada artikel daripada Home. Pertahankan keputusan pemilik tanpa panel portrait baru. Ini temuan visual, bukan klaim pelanggaran rasio kontras yang sudah diukur. Perintah: `$impeccable adapt`, `$impeccable quieter`.

**P2 — Konflik footer/kontrol dengan bacaan.** `a/about-mobile.png` dan `a/article-mobile.png` memperlihatkan elemen fixed di depan paragraf bawah. Audit keyboard menemukan tautan akhir About tetap dapat dijangkau; jangan menyebut konten hilang atau scroll terjebak. Buat batas baca bawah yang benar-benar memisahkan isi dari footer/kontrol; periksa paragraf terakhir, fokus keyboard, viewport pendek, dan toolbar browser. Perintah: `$impeccable adapt`, `$impeccable layout`.

**P2 — Kontribusi belum menjadi informasi pertama.** Experience menghabiskan ruang pada deskripsi organisasi, terutama EXERCISE/GDGoC. Ringkas konteks menjadi satu kalimat, lalu tampilkan kontribusi nyata dan hasil yang dikonfirmasi pemilik. Kalimat tugas Lab juga mengulang Computer Engineering Students. Dalam dialog proyek, judul/peran/hasil sebaiknya mendahului galeri; caption panjang dan kategori berulang membuat judul turun jauh di mobile. Sembunyikan navigasi galeri saat hanya satu foto. Writing perlu ringkasan yang sudah ada pada metadata dan subjudul yang menjelaskan “Tugas Bidang” kepada orang di luar UI. Jangan mengarang metrik atau menambahkan kembali panel/CTA Home yang sebelumnya diminta dihapus. Perintah: `$impeccable clarify`, `$impeccable distill`.

**P2 — Instruksi static view keliru.** `src/components/scene/scene-host.tsx:142` memilih label instruksi drag/arrow berdasarkan `exploration`, tanpa mengecek `interactive`. Saat static + Hide text, instruksi rotasi masih diumumkan walaupun canvas interaktif tidak tersedia. Sesuaikan label dengan kemampuan mode. Perintah: `$impeccable harden`.

**P2 — Foto badge terlalu besar untuk perannya.** Tiga PNG pada `src/data/scene-photo-slots.json:2` berjumlah 1.769.632 byte. `src/lib/scene/scene-photos.ts:13` memuat gambar asli menjadi tekstur tanpa resize. Sediakan derivative dengan ukuran sesuai kebutuhan badge dan pertahankan original sebagai sumber. Ini bukti beban aset, bukan bukti nilai Core Web Vitals produksi buruk. Perintah: `$impeccable optimize`.

**P3 — Token permukaan berulang.** Latar dialog `#1c1a16` berulang pada `src/app/globals.css:390` dan `:393`; gunakan token permukaan semantik ketika area ini berikutnya diedit. Bukan prioritas sebelum keterbacaan.

Urutan kerja yang disarankan: adapt/quieter → clarify/distill → harden/optimize → audit ulang → `$impeccable polish`. Hitungan: P0=0, P1=1 visual, P2=4 kelompok gabungan, P3=1. Audit teknis sendiri tidak menetapkan P0/P1.

## Penilaian Impeccable

| Nielsen (0–4) | Skor |
|---|---:|
| Status sistem | 3 |
| Kesesuaian dengan dunia nyata | 3 |
| Kendali dan kebebasan | 3 |
| Konsistensi | 3 |
| Pencegahan kesalahan | 3 |
| Recognition rather than recall | 2 |
| Fleksibilitas/efisiensi | n/a — bukan alat operasi berulang |
| Estetika/minimalisme | 2 |
| Pemulihan error | n/a — alur kegagalan tidak cukup diuji |
| Bantuan/dokumentasi | n/a — portofolio tidak membutuhkannya |
| **Total** | **19/28** |

Beban kognitif moderat: fokus tunggal, chunking, dan pilihan setara perlu perbaikan (3 dari 8 checklist). Enam tautan navigasi tidak otomatis perlu diganti hamburger. Perjalanan emosional dimulai hangat dan menarik, terkonfirmasi oleh karya nyata, lalu melemah ketika pengunjung membaca teks panjang di atas scene yang ramai.

Persona paling terdampak: perekrut dengan 60–90 detik (kontribusi terlambat ditemukan); pengunjung di luar UI (judul/akronim kurang konteks); pembaca low vision atau mudah terdistraksi (tekstur dan elemen fixed bersaing dengan bacaan).

| Audit (0–4) | Skor | Dasar |
|---|---:|---|
| Aksesibilitas | 3 | Semantik/fokus/dialog baik; label static keliru; screen reader belum diuji |
| Performa | 3 | Scene dinamis dan lifecycle diperhatikan; PNG badge bisa diperkecil |
| Theming | 3 | Token inti tersedia, beberapa warna permukaan berulang |
| Responsif | 3 | Tiga lebar diperiksa; batas baca mobile perlu dirapikan; touch fisik belum diuji |
| Integritas implementasi | 4 | Sistem spesifik produk, bukan template generik; detector kosong |
| **Total** | **16/20** | **Good, provisional** |

## Dua arah visual dari design-taste-frontend

Inventaris yang mendasari konsep: Abdiel; Computer Engineering UI; DigiLab; ArduiMania/Wokwi; Bank Vault discrete logic; Cash Register greedy hardware; lanyard organisasi; notebook; robot; potret asli; minat film dan musik. Pilihan script: quiet-instrument, split-stage, dark-room. Quiet instrument tidak dipilih karena kolom yang terlalu kecil berisiko mengulang lemahnya dominasi bukti karya saat ini.

### A. Dark Room — Galeri Lab (rekomendasi)

**Konsep:** karya rangkaian dan perangkat Abdiel menjadi benda utama dalam pameran lab personal. Dasar `dark-room`, seed **110401**, palette/type dipertahankan, tanpa redraw.

- Home mempertahankan establishing shot lab. Projects memperbesar karya/foto/skematik nyata; robot dan properti menjadi konteks pinggir.
- Setiap proyek mempunyai satu gambar dominan, judul, kontribusi singkat, dan hasil sebelum detail. Hindari memaksakan empat sampai delapan proyek atau foto stok; sekarang tersedia tiga proyek nyata.
- Pertahankan ground `#0c0b0a`, ink `#e9e2d3`, accent `#d6a47a`, serta Libertinus Sans/Serif. Aksen cukup untuk aksi penting; teks bacaan tidak diredupkan demi suasana.
- Mobile memakai satu artefak jelas dengan area baca yang tenang, bukan semua detail meja di belakang paragraf. Kamera bergerak pada transisi, tetap mengikuti pause/reduced/static.
- Referensi: [Kereliott](https://kereliott.com/) untuk benda/foto yang hidup di bidang gelap dan disiplin skala; [Clarissa Builds](https://www.clarissabuilds.com/) sebagai acuan personalitas yang sudah dipilih pemilik. Ambil prinsip, bukan susunan, copy, atau aset khas.
- Cocok bila tujuan utama adalah diingat sebagai pembuat yang punya karakter. Risiko: karya kembali kalah oleh suasana; ukur keberhasilan dari kemampuan menyebut satu proyek dan kontribusi setelah pemindaian singkat.

### B. Split Stage — Catatan Engineer

**Konsep:** satu sisi menjadi meja demonstrasi karya Abdiel, sisi lain menjadi catatan kontribusi yang dapat dipindai. Dasar `split-stage`, seed **110402**, palette/type dipertahankan, tanpa redraw.

- Desktop membagi viewport sekitar 45/55: sisi visual sticky untuk karya aktif, sisi baca untuk masalah → kontribusi → keputusan teknik → hasil.
- Gunakan foto hardware, screenshot Wokwi, dan skematik asli; scene tetap muncul pada panggung visual, tidak di belakang paragraf. Ini usulan perubahan komposisi lebih besar, belum keputusan implementasi.
- Gunakan warna dan font yang ada, body sekitar 17–19px dengan measure 45–65 karakter. Hierarki melalui ukuran dan posisi, bukan tambahan badge.
- Di ponsel kedua sisi menumpuk: judul/ringkasan → media → detail, native scroll tanpa panggung sticky yang memakan ruang baca. Satu bagian boleh lebar penuh agar split tidak monoton.
- Referensi: [Le Petit Bleu — catatan komposisi One Page Love](https://onepagelove.com/le-petit-bleu) untuk panel foto kanan tetap dan bacaan di kiri; [Bartosz Ciechanowski](https://ciechanow.ski/) untuk hubungan penjelasan teknik dengan demonstrasi yang relevan. Ambil pembagian ruang dan cara membuktikan, bukan dekorasi kafe atau menambahkan simulasi baru.
- Cocok bila prioritas adalah perekrut/pembaca teknik yang ingin cepat memahami karya. Risiko: lebih formal dan restrukturisasinya lebih besar; jaga potret, Cabinet, dan bahasa personal agar karakter tidak hilang.

Sheet otomatis adalah bahan usulan, bukan spec siap bangun: blueprint kontak berisi alamat/jam buka dan blueprint work mengasumsikan jumlah proyek yang tidak cocok. Saat implementasi dipilih, ganti slot yang asumsi kontennya salah melalui alternatif script; jangan mengisi fakta palsu. Foto stok yang dibagikan script tidak dipakai. Tidak ada aset gambar baru yang dihasilkan atau diunduh.

## ROUND 1 — rubric taste

Seen in one second: meja lab dengan robot dan perangkat elektronik.
Idea: meja belajar teknik Abdiel menjadi dunia navigasi portofolio.
Live thing: eksplorasi kamera/robot dan dialog proyek.
Layout words by section: Home=scene+intro / About=portrait+prose / Projects=featured+cards / Experience=timeline / Writing=list / Cabinet=masonry.
Scores: design 6.5 · usability 6 · creativity 8 · content 7 → weighted 6.7, capped **6.0** oleh FAIL inspector mentah.
Caps applied: FAIL alat taste, aturan jumlah foto, dan ornament. Cap ini berasal dari house style taste yang tidak selaras dengan brief 3D; bukan nilai kualitas teknis produk atau alasan menghapus pilihan pemilik. Canvas motion tidak dihitung alat. Gunakan prioritas berbasis bukti visual di atas untuk keputusan.
Top three problems: area baca ramai (`a/article-mobile.png`); elemen fixed bersaing (`a/about-mobile.png`); bukti proyek belum dominan (`a/projects-desktop.png`).

## Bukti dan batas pemeriksaan

- A: enam route pada 1440×1000 dan 390×844; dialog ArduiMania dan artikel aktual. Parent melihat screenshot route serta detail. Capture Home mobile pertama terlalu dini; `a/home-mobile-settled.png` menunjukkan tampilan normal, sehingga tidak dihitung sebagai bug.
- B: tab browser tersendiri, Enter/Escape dan fokus kembali dialog desktop/mobile; keyboard mencapai tautan akhir About. Inspector pada 1440×900, 768×1024, 390×844; initial/cold dan settled pass. Tidak terdeteksi overflow horizontal pada Home dalam pengukuran tersebut.
- Impeccable `detect --json src`: **[] / 0 temuan**. Tidak berarti lulus seluruh aksesibilitas atau UX. Overlay tidak diinjeksikan karena API browser evaluate read-only; tidak ada overlay pengguna yang diklaim.
- Taste lint: 3 FAIL dan 1 WARN; fade mask baca, kata shadow dalam komentar, dan aturan em dash bersifat kontekstual. Inspector cold menangkap opening yang disetujui; settled memperlihatkan h1. Flag pill/warm accent/few pictures/still-page/name-only-title tidak otomatis berlaku sebagai bug: canvas tidak dihitung dan deskripsi Home menyatakan pendidikan/minat.
- Tidak mengukur Core Web Vitals produksi atau perangkat lambat; server development bukan benchmark produksi. Tidak menguji screen reader nyata, gesture perangkat fisik, dan emulasi reduced motion runtime; guard reduced-motion diperiksa dari source. Tidak ada klaim WCAG AA menyeluruh.
- Tidak mengubah source, dependency, aset produksi, atau perubahan lokal pemilik. File yang dibuat hanya laporan, screenshot, hasil pemeriksaan, direction sheets dan arsip critique.

Pertanyaan keputusan: pilih Galeri Lab atau Catatan Engineer; prioritaskan pemindaian rekrutmen atau eksplorasi personal; mulai dari tiga perbaikan utama atau seluruh temuan.
