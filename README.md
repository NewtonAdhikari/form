# Google Sheets Contact Form

A lightweight and responsive contact form built using **HTML, CSS, and JavaScript**, integrated with **Google Sheets** to automatically store submitted form data.

This project provides a simple way to collect user information through a website and save submissions directly into a Google Spreadsheet without requiring a traditional database or backend server.

## Features

- Clean and responsive contact form.
- Built using HTML, CSS, and vanilla JavaScript.
- Google Sheets integration.
- Automatic form submission and data storage.
- Google Apps Script as the backend.
- Input validation.
- User-friendly submission feedback.
- No traditional database required.
- No Google API keys or service account credentials exposed in frontend code.

## Technology Stack

| Technology | Purpose |
|---|---|
| HTML5 | Form structure |
| CSS3 | Styling and responsive design |
| JavaScript | Form validation and submission |
| Google Apps Script | Backend integration |
| Google Sheets | Store submitted form data |

## How It Works

```text
User
  |
  v
HTML Contact Form
  |
  v
JavaScript Validation
  |
  v
Google Apps Script Web App
  |
  v
Google Spreadsheet
  |
  v
Form Data Stored Successfully
```

## Project Structure

```text
google-sheets-contact-form/
│
├── index.html
├── style.css
├── script.js
└── README.md
```

## Setup Instructions

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

### 2. Open the Project

```bash
cd google-sheets-contact-form
```

### 3. Configure Google Sheets

1. Create a new Google Spreadsheet.
2. Open Google Apps Script.
3. Add the script responsible for receiving form submissions.
4. Configure the script to insert submitted data into the spreadsheet.
5. Deploy the script as a Web App.
6. Copy the deployed Web App URL.
7. Configure the URL in your `script.js` file.

### 4. Run the Project

Open `index.html` in your browser or use the VS Code Live Server extension.

## Data Storage

Every successful form submission is sent to Google Apps Script and stored in the connected Google Spreadsheet.

This makes it easy to:

- View submitted information.
- Manage contact requests.
- Export data to Excel or CSV.
- Maintain a centralized record of submissions.

## Security Considerations

- Validate user input before submission.
- Keep sensitive configuration and credentials out of public frontend code.
- Configure Google Apps Script deployment permissions carefully.
- Avoid collecting unnecessary personal information.

## Future Improvements

- Add spam protection.
- Add stronger form validation.
- Add email notifications.
- Improve submission status messages.
- Add additional form fields.

## License

Specify an appropriate license before distributing this project.

---

**A simple and efficient way to collect website form submissions directly into Google Sheets.**