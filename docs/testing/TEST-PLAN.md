# Test Plan

## Purpose

Verify the baseline static website still opens after the repository folder reorganization, and verify the additional object-oriented interface against its class diagram and acceptance criteria.

## Test environment

- OS: Windows/macOS/Linux with a modern Chrome, Edge or Firefox browser
- Recommended serving method: VS Code Live Server
- Test data: synthetic patient name/mobile only
- Browser storage: a clean profile for first-run checks; a separate origin for each interface
- Optional external libraries: SheetJS and jsPDF; tests should record whether the CDN loaded

## Test cases

| ID | Test | Expected result |
|---|---|---|
| TC-01 | Search by doctor-name fragment | Only matching cards remain and result count updates |
| TC-02 | Search by department/hospital/speciality | Matching entries appear |
| TC-03 | Search for an absent phrase | Helpful empty state appears |
| TC-04 | Select doctor in OOP prototype | Doctor summary populates and form focus moves to patient name |
| TC-05 | Submit blank/short patient details | Submission is blocked with a validation message |
| TC-06 | Select a past date | Booking is rejected |
| TC-07 | Select a date outside a specified visit weekday | Booking is rejected |
| TC-08 | Submit valid synthetic details | A pending demo appointment and serial/reference are shown |
| TC-09 | Refresh the same origin after booking | Previously saved OOP demo appointment remains visible |
| TC-10 | Create records for the same doctor/facility/date | Serials increase sequentially in the same browser storage |
| TC-11 | Fill daily capacity with 15 records | The next booking is rejected by demo capacity logic |
| TC-12 | Clear OOP demo appointments | Only the OOP storage key is cleared after confirmation |
| TC-13 | Open baseline site | CSS, doctor image, and JavaScript modules load without missing local paths |
| TC-14 | Exercise baseline booking/status/admin flows | Baseline demonstrations operate as documented; no claim of real confirmation is made |
| TC-15 | Inspect mobile viewport | Layout remains usable without horizontal overflow |
| TC-16 | Optional PDF/XLSX downloads | Feature works if its CDN library loads; otherwise fallback/notice is documented |

## Out-of-scope test claims

This plan does not validate real hospital schedules, clinical correctness, multi-user concurrency, secure authentication, privacy compliance, accessibility conformance certification, penetration resistance, or production availability. Those require a backend and specialist review.
