# Deploy ke GitHub Pages

1. Buat satu repository bernama `buletin-jumat` pada akun GitHub DKM.
2. Upload seluruh isi folder project ini ke root repository.
3. GitHub → Settings → Pages.
4. Source: Deploy from a branch.
5. Branch: `main`, folder `/ (root)`.
6. Tunggu build selesai.
7. URL menjadi:
   `https://dkmattaubah.github.io/buletin-jumat/`
8. Setiap Jumat TIDAK membuat repository baru.
9. Untuk edisi baru, buat folder:
   `edisi/003/`
   `edisi/004/`
   dst.
10. Update homepage agar "Edisi Terbaru" menunjuk ke edisi terbaru. Homepage tidak menampilkan arsip.

## Catatan
Nama akun `dkmattaubah` adalah contoh sesuai rencana. Jika akun GitHub berbeda, URL akan mengikuti nama akun sebenarnya.

Pengiriman tulisan dilakukan langsung melalui WhatsApp, jadi tidak diperlukan halaman/form khusus.

## Admin
Panel admin berada di `/admin/`. Backend menggunakan Google Apps Script + Google Spreadsheet. Token GitHub, bila digunakan untuk publish otomatis, disimpan di Script Properties dan tidak pernah dikirim ke browser.
