/**
 * BoutiqueNi Frontend Config
 * ==========================
 * Ganti API_URL dengan Web App URL dari Google Apps Script
 * setelah kamu deploy (Deploy → New deployment → Web app).
 *
 * Contoh: 'https://script.google.com/macros/s/AKfycbx.../exec'
 *
 * Password & credentials TIDAK disimpan di sini.
 * Semua secret hanya ada di Script Properties Apps Script.
 */
window.BOUTIQUENI_CONFIG = {
  // WAJIB diganti setelah deploy Apps Script
  API_URL: 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec',

  // Timeout request (ms)
  REQUEST_TIMEOUT: 20000
};
