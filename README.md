# BULETIN JUMAT DIGITAL — MASJID AT-TAUBAH BNN RI

Sistem full v1.0 untuk Buletin Jumat digital.

## Prinsip
- Satu repository untuk seluruh perjalanan Buletin Jumat.
- Setiap Jumat = satu folder edisi baru.
- Pembaca cukup menerima dan klik link WhatsApp.
- Web adalah versi utama.
- Web/link edisi adalah media utama; PDF tidak menjadi bagian dari alur publik.
- Bagian “Mari Menambah Ilmu” hanya berada di halaman pembuka, bukan di halaman setiap edisi.
- Pengiriman tulisan dilakukan langsung melalui WhatsApp.
- Tombol WhatsApp memakai link langsung dan dapat diarahkan ke nomor Redaksi setelah nomor resmi dimasukkan ke konfigurasi.
- QRIS resmi DKM akan menjadi aset bersama setelah diberikan.
- Data penulis tidak ditampilkan di halaman publik.

## Struktur
```text
buletin-jumat/
├── index.html
├── edisi/
│   ├── 001/
│   │   └── index.html
│   └── 002/
│       └── (disiapkan saat Jumat berikutnya)
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

## Kirim tulisan
Pengunjung cukup menekan tombol "Punya Tulisan untuk Dibagi?". WhatsApp terbuka dengan pesan awal untuk dikirim ke kontak Redaksi DKM. Naskah/file kemudian dapat dikirim langsung melalui WhatsApp. Nomor Redaksi diatur pada `js/app.js` atau nantinya dipusatkan lewat backend.

## Media utama
Buletin dibaca langsung melalui link edisi. Jamaah tidak perlu mengunduh aplikasi dan tidak perlu mencari arsip; link edisi dibagikan setiap Jumat melalui WhatsApp.

## Catatan produksi
- Ganti placeholder QRIS dengan QRIS resmi DKM.
- Hubungkan form ke backend sebelum publikasi.
- Verifikasi semua ayat, terjemahan, hadis, nomor hadis, dan atribusi oleh redaksi.

## Admin
Panel admin berada di `/admin/`. Backend menggunakan Google Apps Script + Google Spreadsheet. Token GitHub, bila digunakan untuk publish otomatis, disimpan di Script Properties dan tidak pernah dikirim ke browser.
