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


## Thumbnail saat link dibagikan (Open Graph)

`index.html` sudah memuat metadata Open Graph dan Twitter Card. Gambar khusus preview berada di
`assets/og-boutiqueni.jpg` dengan ukuran 1200 × 630 piksel.

### Cara menerapkan
1. Ekstrak ZIP ini.
2. Unggah seluruh isi folder ke repository `hanidhanif/boutiqueni` pada branch yang dipakai GitHub Pages (biasanya `main`), dengan mempertahankan struktur folder `assets/`.
3. Pastikan file dapat dibuka di alamat:
   `https://hanidhanif.github.io/boutiqueni/assets/og-boutiqueni.jpg`
4. Tunggu GitHub Pages selesai menerbitkan perubahan, lalu bagikan:
   `https://hanidhanif.github.io/boutiqueni/`

Catatan: WhatsApp dan platform sosial lain meng-cache preview. Metadata yang benar tidak menjamin thumbnail langsung berubah; tunggu cache diperbarui atau gunakan debugger/share inspector platform terkait bila tersedia. Jangan hanya mengunggah gambar—`index.html` dan folder `assets/` juga harus ikut diperbarui.
