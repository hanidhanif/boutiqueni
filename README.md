# BoutiqueNi — Website + Google Apps Script

## File penting
- `index.html`, `style.css`, `script.js` — website frontend.
- `config.js` — URL Web App Apps Script.
- `Code.gs` — backend Google Apps Script (salin ke project di script.google.com).
- `SETUP-APPS-SCRIPT.md` — panduan setup dan deploy backend.
- `assets/` — foto koleksi.

## Catatan
`Code.gs` yang disertakan menangani API produk dan fitur admin/kelola produk melalui Google Sheets. Ini bukan gateway pembayaran otomatis. Transfer, QRIS, e-wallet, dan COD tetap perlu dikonfigurasi sesuai proses toko; pembayaran otomatis memerlukan penyedia pembayaran yang mendukung integrasi.

Buka `SETUP-APPS-SCRIPT.md` sebelum menghubungkan backend. Jangan menaruh password atau kredensial rahasia di file frontend publik.
