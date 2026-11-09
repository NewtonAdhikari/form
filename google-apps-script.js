/*
  Google Apps Script (Code.gs)
  ----------------------------
  1) Create a Google Sheet with tab name: ContactSubmissions
  2) Open Extensions > Apps Script
  3) Paste this entire code
  4) Deploy as Web App:
      - Execute as: Me
      - Who has access: Anyone
  5) Copy Web App URL and paste into index.html CONFIG.GOOGLE_SCRIPT_URL
*/

const SHEET_NAME = "ContactSubmissions";

function doPost(e) {
  try {
    const lock = LockService.getScriptLock();
    lock.tryLock(5000);

    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse({ status: "error", message: "Missing request body." });
    }

    const payload = JSON.parse(e.postData.contents);
    const cleaned = sanitizePayload(payload);
    const validationError = validatePayload(cleaned);
    if (validationError) {
      return jsonResponse({ status: "error", message: validationError });
    }

    const sheet = getSheet();
    const duplicate = isDuplicate(sheet, cleaned.submissionHash, cleaned.email, cleaned.subject, cleaned.message);
    if (duplicate) {
      return jsonResponse({ status: "error", message: "Duplicate submission detected." });
    }

    const now = new Date();
    const timestamp = Utilities.formatDate(now, Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss");

    sheet.appendRow([
      timestamp,
      cleaned.fullName,
      cleaned.email,
      cleaned.phone,
      cleaned.subject,
      cleaned.message,
      cleaned.submissionHash,
      cleaned.source
    ]);

    return jsonResponse({ status: "success", message: "Submission saved successfully." });
  } catch (error) {
    return jsonResponse({ status: "error", message: error.message || "Unexpected error." });
  }
}

function sanitizePayload(payload) {
  function clean(text) {
    return String(text || "").replace(/\s+/g, " ").trim();
  }
  return {
    fullName: clean(payload.fullName),
    email: clean(payload.email),
    phone: clean(payload.phone),
    subject: clean(payload.subject),
    message: clean(payload.message),
    submissionHash: clean(payload.submissionHash),
    source: clean(payload.source)
  };
}

function validatePayload(data) {
  if (!data.fullName || data.fullName.length < 2) return "Invalid full name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email)) return "Invalid email.";
  if (!/^[+()\-\d\s]{7,20}$/.test(data.phone)) return "Invalid phone.";
  if (!data.subject || data.subject.length < 3) return "Invalid subject.";
  if (!data.message || data.message.length < 10) return "Invalid message.";
  if (!data.submissionHash || data.submissionHash.length < 20) return "Missing submission hash.";
  return "";
}

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }

  const headers = ["Timestamp", "Full Name", "Email Address", "Phone Number", "Subject", "Message", "Submission Hash", "Source URL"];
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");
  } else {
    const currentHeaders = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
    if (JSON.stringify(currentHeaders) !== JSON.stringify(headers)) {
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight("bold");
    }
  }
  return sheet;
}

function isDuplicate(sheet, submissionHash, email, subject, message) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return false;

  const checkRows = Math.min(200, lastRow - 1);
  const startRow = lastRow - checkRows + 1;
  const rows = sheet.getRange(startRow, 1, checkRows, 8).getValues();
  const now = new Date().getTime();

  for (let i = rows.length - 1; i >= 0; i--) {
    const row = rows[i];
    const timestamp = row[0];
    const rowEmail = String(row[2] || "").toLowerCase();
    const rowSubject = String(row[4] || "").toLowerCase();
    const rowMessage = String(row[5] || "").toLowerCase();
    const rowHash = String(row[6] || "");

    if (rowHash && rowHash === submissionHash) {
      return true;
    }

    // Secondary fallback: same email+subject+message in last 10 minutes.
    const rowTime = timestamp instanceof Date ? timestamp.getTime() : new Date(timestamp).getTime();
    const within10Minutes = !isNaN(rowTime) && now - rowTime < 10 * 60 * 1000;
    if (
      within10Minutes &&
      rowEmail === email.toLowerCase() &&
      rowSubject === subject.toLowerCase() &&
      rowMessage === message.toLowerCase()
    ) {
      return true;
    }
  }
  return false;
}


function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
