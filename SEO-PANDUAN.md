# 🚀 Panduan SEO Lengkap — BoutiqueNi

Website: https://hanidhanif.github.io/boutiqueni/

File SEO yang sudah ditambahkan di ZIP ini:
- `robots.txt` — mengizinkan crawler + menunjuk ke sitemap
- `sitemap.xml` — daftar halaman utama
- `favicon.ico`, `favicon.svg`, `favicon-16x16.png`, `favicon-32x32.png`
- `apple-touch-icon.png` (180×180)
- `android-chrome-192x192.png` & `android-chrome-512x512.png`
- `site.webmanifest` — untuk PWA / home screen
- `index.html` sudah dilengkapi:
  - Meta robots, keywords, author, theme-color
  - Favicon links lengkap
  - Open Graph + Twitter Card (sudah ada sebelumnya, tetap dipertahankan)
  - Canonical URL
  - JSON-LD Structured Data (ClothingStore + WebSite)

OG Image yang digunakan: `og-share.jpg` (1200×630) — sudah bagus.

---

## LANGKAH 1: Deploy ulang ke GitHub Pages

1. Download ZIP ini dan ekstrak.
2. Ganti semua file di repo GitHub kamu (`hanidhanif/boutiqueni`) dengan file dari ZIP ini (atau copy file-file baru + index.html yang sudah di-update).
3. Commit & push ke branch `main` (atau branch yang dipakai untuk GitHub Pages).
4. Tunggu 1–5 menit, lalu cek:
   - https://hanidhanif.github.io/boutiqueni/
   - https://hanidhanif.github.io/boutiqueni/robots.txt
   - https://hanidhanif.github.io/boutiqueni/sitemap.xml
   - Favicon muncul di tab browser.

---

## LANGKAH 2: Google Search Console (PALING PENTING)

1. Buka: https://search.google.com/search-console
2. Klik **Add property** → pilih **URL prefix** → masukkan:
   ```
   https://hanidhanif.github.io/boutiqueni/
   ```
3. Verifikasi kepemilikan:
   - Cara termudah: **HTML tag** (meta tag). Google akan kasih meta tag, copy dan tempel di `<head>` index.html (sudah ada tempat yang cocok), push lagi, lalu verifikasi.
   - Atau pakai **Google Analytics** / **DNS** jika punya domain custom.
4. Setelah verified:
   - Masuk ke **Sitemaps** → submit:
     ```
     https://hanidhanif.github.io/boutiqueni/sitemap.xml
     ```
   - Gunakan **URL Inspection** → masukkan homepage → **Request Indexing**.

---

## LANGKAH 3: Bing Webmaster Tools (opsional tapi bagus)

1. https://www.bing.com/webmasters
2. Add site → `https://hanidhanif.github.io/boutiqueni/`
3. Verifikasi (bisa import dari Google Search Console).
4. Submit sitemap yang sama.

---

## LANGKAH 4: Cek Open Graph & Share Preview

Setelah deploy:

- Facebook / WhatsApp / Instagram:
  https://developers.facebook.com/tools/debug/
  → masukkan URL website → **Scrape Again** (penting agar cache update)

- Twitter / X:
  https://cards-dev.twitter.com/validator
  (atau cukup share di X, preview akan muncul)

- LinkedIn:
  https://www.linkedin.com/post-inspector/

---

## LANGKAH 5: Google Business Profile / Local SEO (jika punya toko fisik / COD area tertentu)

- https://business.google.com/
- Buat profil bisnis (bisa tanpa alamat fisik penuh jika online-only).

---

## LANGKAH 6: Analytics (sangat direkomendasikan)

1. Buat property di Google Analytics 4: https://analytics.google.com/
2. Dapatkan Measurement ID (G-XXXXXXXX)
3. Tambahkan di `index.html` sebelum `</head>`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXX');
</script>
```

---

## LANGKAH 7: Perbaikan lanjutan (opsional tapi powerful)

1. **PageSpeed Insights**: https://pagespeed.web.dev/
   - Masukkan URL website
   - Perbaiki gambar (sudah cukup kecil, tapi bisa convert ke WebP nanti)

2. **Rich Results Test**: https://search.google.com/test/rich-results
   - Cek JSON-LD ClothingStore

3. **Mobile-Friendly Test**: https://search.google.com/test/mobile-friendly

4. Jika nanti punya domain custom (contoh boutiqueni.com):
   - Update semua URL di index.html, sitemap.xml, robots.txt, JSON-LD
   - Set custom domain di GitHub Pages settings
   - Update Search Console property baru

---

## Checklist cepat setelah deploy

- [ ] robots.txt bisa diakses
- [ ] sitemap.xml bisa diakses
- [ ] Favicon muncul di tab
- [ ] Share ke WhatsApp → gambar OG muncul bagus
- [ ] Google Search Console → property verified + sitemap submitted + Request Indexing
- [ ] (Opsional) Google Analytics terpasang

---

Semoga website BoutiqueNi segera naik di pencarian Google!  
Kalau butuh bantuan lebih lanjut (custom domain, blog, product schema per item, dsb) tinggal tanya.
