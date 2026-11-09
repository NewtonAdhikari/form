# Premium Contact Form Setup Guide

## 1) Files Included

- `index.html` - Complete frontend (HTML + CSS + JS in one file)
- `google-apps-script.js` - Apps Script backend logic (paste into Apps Script project)

## 2) Exact Google Sheet Column Names

Create/confirm this header row exactly:

1. `Timestamp`
2. `Full Name`
3. `Email Address`
4. `Phone Number`
5. `Subject`
6. `Message`
7. `Submission Hash`
8. `Source URL`

The script auto-creates/fixes headers if needed.

## 3) Google Sheets + Apps Script Setup

1. Create a new Google Sheet.
2. Rename sheet tab to: `ContactSubmissions`
3. Open **Extensions -> Apps Script**.
4. Delete default code and paste all code from `google-apps-script.js`.
5. Click **Deploy -> New deployment**:
   - Type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
6. Authorize permissions when prompted.
7. Copy the generated Web App URL.
8. Open `index.html` and set:
   - `CONFIG.GOOGLE_SCRIPT_URL = "YOUR_WEB_APP_URL"`

## 4) Web3Forms Email Setup (Required)

1. Create an account at [Web3Forms](https://web3forms.com/).
2. Create a form endpoint and copy your **Access Key**.
3. In `index.html`, set:
   - `CONFIG.WEB3FORMS_ACCESS_KEY = "YOUR_ACCESS_KEY"`
4. In Web3Forms dashboard:
   - Set your admin email as receiver.
   - Enable **Auto Responder** so users get confirmation email.
   - Customize admin and user email templates as needed.
5. The frontend sends these fields to Web3Forms:
   - `name`, `email`, `phone`, `subject`, `message`, `timestamp`, `source_url`

## 5) Spam & Duplicate Protection Included

- Client-side math CAPTCHA
- Strict field validation
- Duplicate hash check in frontend
- Duplicate detection in Apps Script:
  - exact submission hash match
  - same email + subject + message in 10 minutes

## 6) Deployment Steps

### Option A: Local quick test
1. Open `index.html` in browser.
2. Fill form and submit.
3. Verify Google Sheet row appears.
4. Check admin and user inboxes.

### Option B: Host online
Use Netlify, Vercel, GitHub Pages, or Firebase Hosting:
1. Upload `index.html`.
2. Keep Apps Script URL in config.
3. Retest from hosted URL.

## 7) Troubleshooting

- **Error: Configuration Needed**
  - Set valid `CONFIG.GOOGLE_SCRIPT_URL` and `CONFIG.WEB3FORMS_ACCESS_KEY` in `index.html`.
- **No sheet rows added**
  - Redeploy Apps Script Web App and ensure access is `Anyone`.
- **No emails received**
  - Verify Web3Forms receiver email and auto-responder configuration.
- **CORS or response errors**
  - Ensure request body is JSON and deployment is latest version.

## 8) Production Notes

- For stronger bot protection, replace math CAPTCHA with Cloudflare Turnstile or reCAPTCHA.
- Consider using a custom domain and HTTPS hosting.
- Keep your Web3Forms access key and Apps Script deployment under your account control.
