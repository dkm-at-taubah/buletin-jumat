# BULETIN JUMAT DIGITAL — MASJID AT-TAUBAH BNN RI

Sistem full v1.0 untuk Buletin Jumat digital.

## Prinsip
- Satu repository untuk seluruh perjalanan Buletin Jumat.
- Setiap Jumat = satu folder edisi baru.
- Pembaca cukup menerima dan klik link WhatsApp.
- Web adalah versi utama.
- Setiap edisi memiliki PDF yang bisa diunduh langsung.
- Kirim Tulisan adalah pintu terpisah dari isi buletin.
- QRIS resmi DKM akan menjadi aset bersama setelah diberikan.
- Data penulis tidak ditampilkan di halaman publik.

## Struktur
```text
buletin-jumat/
├── index.html
├── edisi/
│   ├── 001/
│   │   ├── index.html
│   │   └── Buletin-Jumat-001.pdf
│   └── 002/
│       ├── index.html
│       └── Buletin-Jumat-002.pdf
├── kirim-tulisan/
│   └── index.html
├── assets/
│   ├── logo-dkm.jpg
│   └── qris-infaq-dkm.png      # tambahkan QRIS resmi DKM nanti
├── css/style.css
├── js/app.js
└── README.md
```

## Alur mingguan
1. Tentukan tema.
2. Siapkan ayat, hadis sahih, renungan, doa, dan refleksi.
3. Verifikasi sumber oleh redaksi.
4. Salin folder edisi terakhir menjadi nomor baru.
5. Ganti judul/tanggal/isi.
6. Buat PDF edisi.
7. Upload ke repository.
8. Bagikan link edisi ke WhatsApp.

## URL
Homepage:
`dkmattaubah.github.io/buletin-jumat/`

Edisi:
`dkmattaubah.github.io/buletin-jumat/edisi/001/`

Edisi berikutnya:
`.../edisi/002/`

## Submission
Form "Kirim Tulisan" sudah memiliki data penulis, naskah, upload file, persetujuan, validasi dasar, dan halaman hasil pengiriman.
Endpoint backend sengaja dibuat sebagai konfigurasi agar bisa disambungkan ke Google Apps Script/backend DKM tanpa mengubah tampilan.

## PDF
Setiap folder edisi menyimpan file PDF sendiri. Tombol "Download PDF" mengunduh file secara langsung, bukan membuka dialog cetak.

## Catatan produksi
- Ganti placeholder QRIS dengan QRIS resmi DKM.
- Hubungkan form ke backend sebelum publikasi.
- Verifikasi semua ayat, terjemahan, hadis, nomor hadis, dan atribusi oleh redaksi.
