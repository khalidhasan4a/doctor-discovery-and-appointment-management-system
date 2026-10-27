# Run Find Your Doctor in VS Code

## 1. Open the project folder

1. Extract `find-your-doctor-capstone.zip`.
2. Open VS Code and choose **File → Open Folder**.
3. Select the extracted `find-your-doctor-capstone` folder, not a single file.
4. If VS Code asks whether you trust the folder, select the option appropriate for your own project folder.

## 2. Install Live Server (recommended)

1. Open Extensions with **Ctrl + Shift + X**.
2. Search for **Live Server** by Ritwick Dey and install it.
3. Open the root `index.html` and click **Go Live** or right-click and select **Open with Live Server**.
4. To start the class-based interface, open `prototype/index.html`, then select **Open with Live Server**.
5. Save changes with **Ctrl + S**. Live Server normally reloads the browser automatically.

## 3. Without the extension

On Windows, the included `.vscode/tasks.json` defines **Open in Chrome**. With the project folder open, choose **Terminal → Run Build Task** or press **Ctrl + Shift + B**. This task tries to open the root `index.html` in Chrome. It depends on Chrome being installed and available under that command name.

You may also double-click the root `index.html`. A local server is still recommended, especially while developing the OOP prototype.

## 4. Folder/path rules

- Root baseline page: `index.html`
- Root styles: `css/style.css`
- Baseline JavaScript: `js/`
- Doctor illustration: `images/doctor.png`
- OOP page: `prototype/index.html`
- OOP CSS and JS: `prototype/css/app.css` and `prototype/js/app.js`

Keep these folders together. The prototype page loads `../js/data.js` and will not work if you copy the HTML file by itself.

## 5. Storage note

Records are stored by browser origin. `file://.../index.html` and a Live Server address such as `http://127.0.0.1:5500` may have different storage. The baseline and OOP prototype also use different storage keys. Do not enter real patient data; this is a local demonstration only.

## 6. Optional downloads

The baseline app loads SheetJS and jsPDF from CDNs for XLSX and PDF generation. These features can be unavailable without internet access. Follow the fallback/status message shown by the application.
