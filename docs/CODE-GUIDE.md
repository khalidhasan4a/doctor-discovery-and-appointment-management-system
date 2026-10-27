# Code Guide

## Baseline application

| Path | Purpose |
|---|---|
| `index.html` | Baseline page structure, dialogs, form controls, and script loading order |
| `css/style.css` | Layout, cards, filters, forms, modals, print styling and theme styles |
| `js/data.js` | Bundled doctor/facility data, demo patients and configuration |
| `js/geo.js` | Bangladesh division, district and upazila options |
| `js/utils.js` | DOM, escaping, date/day, label and formatting helpers |
| `js/storage.js` | Browser storage access, registration/reference/serial handling |
| `js/dropdown.js` | Reusable searchable dropdown component |
| `js/finder.js` | Doctor filtering, cards and profile popup |
| `js/booking.js` | Date selection, patient form and booking flow |
| `js/slip.js` | Appointment slip printing and optional PDF generation |
| `js/appointments.js` | Export, backup and restore helpers |
| `js/admin.js` | Demonstration admin login, appointment management and panel |
| `js/status.js` | Patient appointment status lookup |
| `js/main.js` | Startup and theme toggle |
| `images/doctor.png` | Doctor illustration used in baseline cards/profile |

Script load order in the HTML is deliberate: shared data/helpers must load before modules that use them, and `main.js` starts the page last.

## OOP prototype

`prototype/js/app.js` implements seven classes: `Doctor`, `Patient`, `Appointment`, `DoctorDirectory`, `LocalStorageRepository`, `AppointmentService`, and `PrototypeUI`. Class responsibilities are shown in `docs/diagrams/class-diagram.pdf`; the editable source is `docs/diagrams/class-diagram.dot`.

## Important architectural limit

Both pages are client-side demos. Browser storage is local to a browser profile and is not a shared database. Do not deploy these flows for real patient use without a separate server-side architecture, data verification, security and privacy review.
