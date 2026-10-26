# Backend aman — Rekap Bulanan GPS FM

Backend Google Apps Script untuk membatasi data hanya kepada:
- appfathanmubina@gmail.com
- sulalahsiti238@gmail.com

## Arsitektur keamanan
- Google Identity Services menghasilkan Google ID token di browser.
- Server memvalidasi token ke endpoint resmi Google `tokeninfo`, memeriksa audience OAuth Client ID, email terverifikasi, dan masa berlaku token.
- Allowlist diperiksa di server pada setiap panggilan data.
- Spreadsheet dibaca melalui `SpreadsheetApp.openById`; jangan lagi mengambil data lewat URL CSV publik.
- Jangan menaruh OAuth client secret, token, atau kredensial server di repository.

## Persiapan Google Apps Script
1. Buat project di https://script.google.com/ .
2. Tambahkan file `Code.gs` dari repository ini.
3. Tambahkan file HTML bernama **Index**. UI untuk deployment Apps Script harus memakai `google.script.run` untuk memanggil `getRecapData(idToken)`; jangan gunakan URL CSV publik.
4. Di Google Cloud Console, buat OAuth Client ID bertipe **Web application** untuk Google Identity Services. Catat Client ID (bukan Client Secret).
5. Di Apps Script → Project Settings → Script Properties, tambahkan:
   - `GOOGLE_CLIENT_ID` = Client ID OAuth Web
   - `SPREADSHEET_ID` = `1Z4d9NiKfyV4UV0U9uZdlZNIZcMxXmNvzK5zbgnPFBSw`
6. Pastikan spreadsheet **tidak dibagikan secara publik**. Berikan akses editor/reader kepada akun pemilik yang menjalankan Apps Script; jangan mengandalkan URL CSV.
7. Deploy → New deployment → Web app. Pilih **Execute as: Me**. Set akses deployment sesuai opsi akun Google yang tersedia, lalu uji dengan dua akun yang diizinkan dan satu akun yang tidak diizinkan.
8. Setelah UI Apps Script aktif dan sudah diuji, ubah GitHub Pages menjadi halaman pengarah ke URL Web App atau nonaktifkan publikasi data lama.

## Kontrak fungsi
- `checkAccess(idToken)` → validasi identitas dan allowlist.
- `getRecapData(idToken)` → data rekap dan roster setelah validasi server.

## Catatan penting
File ini menyiapkan backend, tetapi backend belum aktif sampai disalin ke Apps Script, Client ID disetel, UI HTML dipasang, dan deployment diuji. Jangan menganggap akses sudah terkunci hanya karena file berada di GitHub. Jangan menghapus endpoint CSV atau mengubah UI produksi sebelum versi Apps Script diuji end-to-end.
