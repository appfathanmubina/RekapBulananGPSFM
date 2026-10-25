# Rekap Bulanan — GitHub Pages

Halaman publik untuk menampilkan sheet **Rekap Bulanan** dan mengunduh data sebagai Excel (.xlsx).

## Sumber data
- Spreadsheet ID: `1Z4d9NiKfyV4UV0U9uZdlZNIZcMxXmNvzK5zbgnPFBSw`
- Sheet GID: `1547468434`

## Aktifkan GitHub Pages
1. Buka repository Settings → Pages.
2. Pada Build and deployment, pilih **Deploy from a branch**.
3. Pilih branch **main** dan folder **/(root)**, lalu Save.
4. Tunggu deployment selesai. URL biasanya `https://appfathanmubina.github.io/RekapBulananGPSFM/`.

## Akses data
Agar data dapat dibaca oleh halaman, pastikan spreadsheet dapat diakses publik dan disarankan menerbitkan sheet Rekap Bulanan melalui Google Sheets: **File → Share → Publish to web**, lalu pilih sheet tersebut. Halaman tidak mengubah spreadsheet asli. Siapa pun yang dapat membuka halaman dapat melihat dan mengunduh seluruh data yang ditampilkan; jangan gunakan untuk data rahasia.

Halaman mengambil CSV dari endpoint Google Sheets dan membuat Excel di browser memakai pustaka SheetJS dari CDN. Jika pembacaan CSV gagal, periksa pengaturan publikasi sheet.
