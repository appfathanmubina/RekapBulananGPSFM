/**
 * Backend aman Rekap Bulanan GPS FM.
 *
 * Deploy sebagai Web App dan sajikan UI melalui HtmlService agar
 * permintaan data menggunakan google.script.run (bukan endpoint CSV publik).
 * Set Script Properties:
 *   SPREADSHEET_ID = 1Z4d9NiKfyV4UV0U9uZdlZNIZcMxXmNvzK5zbgnPFBSw
 *   GOOGLE_CLIENT_ID = <OAuth 2.0 Web client ID dari Google Cloud>
 */
const ALLOWED_EMAILS_ = Object.freeze([
  'appfathanmubina@gmail.com',
  'sulalahsiti238@gmail.com'
]);
const DEFAULT_SPREADSHEET_ID_ = '1Z4d9NiKfyV4UV0U9uZdlZNIZcMxXmNvzK5zbgnPFBSw';

function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Rekap Bulanan GPS FM')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/**
 * Verifikasi Google ID token di server, lalu cek allowlist.
 * Seluruh fungsi yang membaca data harus memanggil helper ini.
 */
function authorizeRequest(idToken) {
  if (!idToken || typeof idToken !== 'string' || idToken.length > 10000) {
    throw new Error('Silakan masuk menggunakan akun Google yang diizinkan.');
  }

  const props = PropertiesService.getScriptProperties();
  const clientId = props.getProperty('GOOGLE_CLIENT_ID');
  if (!clientId) throw new Error('Konfigurasi server belum lengkap: GOOGLE_CLIENT_ID belum diatur.');

  const response = UrlFetchApp.fetch(
    'https://oauth2.googleapis.com/tokeninfo?id_token=' + encodeURIComponent(idToken),
    { muteHttpExceptions: true, followRedirects: true }
  );
  if (response.getResponseCode() !== 200) {
    throw new Error('Sesi Google tidak valid atau kedaluwarsa. Silakan masuk kembali.');
  }

  const claims = JSON.parse(response.getContentText());
  if (claims.aud !== clientId || claims.email_verified !== 'true') {
    throw new Error('Identitas Google tidak dapat diverifikasi.');
  }
  const email = String(claims.email || '').trim().toLowerCase();
  if (!ALLOWED_EMAILS_.includes(email)) {
    throw new Error('Akses ditolak. Email ini tidak terdaftar untuk Rekap Bulanan GPS FM.');
  }
  const exp = Number(claims.exp || 0);
  if (!exp || exp * 1000 <= Date.now()) {
    throw new Error('Sesi Google sudah kedaluwarsa. Silakan masuk kembali.');
  }
  return email;
}

/**
 * Mengembalikan hanya data yang diperlukan UI, setelah otorisasi server.
 * Tidak menggunakan endpoint CSV publik.
 */
function getRecapData(idToken) {
  const email = authorizeRequest(idToken);
  const props = PropertiesService.getScriptProperties();
  const spreadsheetId = props.getProperty('SPREADSHEET_ID') || DEFAULT_SPREADSHEET_ID_;
  const ss = SpreadsheetApp.openById(spreadsheetId);
  const dataSheet = ss.getSheetByName('Data Rekapan');
  const recapSheet = ss.getSheetByName('Rekap Bulanan');
  if (!dataSheet) throw new Error('Sheet "Data Rekapan" tidak ditemukan.');
  if (!recapSheet) throw new Error('Sheet "Rekap Bulanan" tidak ditemukan.');

  const lastRow = dataSheet.getLastRow();
  const rows = lastRow >= 2
    ? dataSheet.getRange(1, 1, lastRow, Math.min(4, dataSheet.getLastColumn())).getDisplayValues()
    : [];
  const teacherNames = recapSheet.getRange('C9:C100').getDisplayValues()
    .flat().map(v => String(v || '').trim()).filter(Boolean);
  const monthLabel = recapSheet.getRange('D6').getDisplayValue();

  return {
    authorized: true,
    email: email,
    headers: rows.length ? rows[0] : [],
    rows: rows.length > 1 ? rows.slice(1).filter(r => r.some(v => String(v || '').trim())) : [],
    teacherNames: [...new Set(teacherNames)],
    monthLabel: monthLabel,
    generatedAt: new Date().toISOString()
  };
}

/** Pemeriksaan ringan yang juga memvalidasi token dan allowlist. */
function checkAccess(idToken) {
  const email = authorizeRequest(idToken);
  return { authorized: true, email: email };
}
