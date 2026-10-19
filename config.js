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
  API_URL: 'https://script.google.com/macros/s/AKfycbxlMWWZauAr7H48px0_VHZLJZcpApjdc8eho8oe4WConGjBv2DizpDToaTZd85Y7sk0/exec',

  // Timeout request (ms)
  REQUEST_TIMEOUT: 20000
};
