# Buletin Jumat At-Taubah — Full v2.0

Struktur final:
- Homepage: halaman pembuka + "Mari Menambah Ilmu".
- Setiap edisi: **1 halaman scroll penuh** di `/edisi/001/`, `/edisi/002/`, dst.
- Form publik: `/kirim-tulisan/` menerima naskah Word `.doc/.docx` maksimal 5 MB.
- Backend: Google Apps Script + Google Spreadsheet + Google Drive.
- Workflow redaksi: **DRAFT → REVIEW PENGURUS → PERLU REVISI / DISETUJUI → TERBIT**.
- Review Pengurus menggunakan link bertoken dengan watermark **DRAFT — REVIEW PENGURUS**.
- Edisi publik hanya dapat diterbitkan setelah status **approved**.
- Renungan Utama mendukung sisipan ayat/hadis menggunakan blok `[AYAT]...[/AYAT]` dan `[HADIS]...[/HADIS]`.

## Script Properties GAS
Wajib:
- `ADMIN_USER`
- `ADMIN_PASSWORD`

Opsional publish GitHub:
- `GITHUB_TOKEN`
- `GITHUB_OWNER`
- `GITHUB_REPO`
- `GITHUB_BRANCH` (default `main`)

Untuk file kiriman:
- `SUBMISSION_FOLDER_ID` dapat dibuat otomatis setelah otorisasi Drive.

URL publik default:
`https://dkm-at-taubah.github.io/buletin-jumat/`

URL backend default sudah tertanam di Admin dan halaman Review.


### Tambahan v2.1
- Form kirim tulisan menambahkan kategori **P4GN** dan penegasan bahwa Redaksi mengharapkan tulisan terkait P4GN (Pencegahan dan Pemberantasan Penyalahgunaan dan Peredaran Gelap Narkotika).
- Area infaq menyediakan tombol **Unduh QRIS**. Untuk mengaktifkannya dengan QRIS resmi, letakkan file QRIS resmi DKM dengan nama `assets/qris-dkm.jpg`.
