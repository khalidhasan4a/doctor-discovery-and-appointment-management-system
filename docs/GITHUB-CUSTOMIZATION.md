# GitHub Setup and Customization Guide

This guide explains how to push the project to your own GitHub account, edit files, and publish the static website with GitHub Pages.

## 1. Create your repository

1. Sign in to [GitHub](https://github.com/).
2. Click **New repository**.
3. Use `find-your-doctor-capstone` as the repository name (or choose another name and update the URLs below).
4. Choose Public or Private according to your course requirements.
5. Leave **Add a README**, **Add .gitignore**, and **Choose a license** unchecked; this project already contains those files.
6. Click **Create repository**.

## 2. Push the local project with Git

Extract the ZIP, open the `find-your-doctor-capstone` folder in VS Code, choose **Terminal → New Terminal**, then run:

```bash
git init
git add .
git commit -m "Add Find Your Doctor capstone project"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/find-your-doctor-capstone.git
git push -u origin main
```

Replace `YOUR-USERNAME` with your real GitHub username. If the repository has a different name, replace `find-your-doctor-capstone` in the remote URL. If Git reports that `origin` already exists, inspect it with `git remote -v`; update it with `git remote set-url origin https://github.com/YOUR-USERNAME/find-your-doctor-capstone.git` rather than adding a duplicate remote.

## 3. Change proposal/student information

The cover page metadata is inside `proposal.tex`. Search for the `Submitted by`, `Student ID`, `Course title`, `Course code`, `Submitted to`, `Department`, `University`, and `Planning window` lines. Edit only the values on the right side of each row.

Then recompile `proposal.pdf` from the repository root (requires LaTeX):

```bash
pdflatex proposal.tex
pdflatex proposal.tex
```

The project README has a separate **Student and course details** table. Update that too if the metadata changes. Commit both the `.tex` and regenerated `.pdf` so the source and submitted version stay synchronized.

## 4. Customize the website

| Edit | File |
|---|---|
| Main page heading/title | `index.html` |
| Colours, typography, cards, responsive layout | `css/style.css` |
| Doctor/facility records and demo schedules | `js/data.js` |
| Placeholder doctor image | `images/doctor.png` |
| OOP interface markup | `prototype/index.html` |
| OOP interface styles | `prototype/css/app.css` |
| OOP classes and booking logic | `prototype/js/app.js` |
| Project timeline and milestones | `docs/PROJECT-SCHEDULE.md` and the schedule section of `proposal.tex` |
| UML/analysis diagram | corresponding `docs/diagrams/*.dot` file |
| Intro, screenshots and setup guide | `README.md` |

When customizing sample doctor data, keep the original array format documented in `docs/CODE-GUIDE.md`. Do not treat bundled doctor schedules as verified without checking them against authorized sources.

## 5. Edit files directly on GitHub

For a simple one-file change:

1. Open your repository on GitHub.
2. Click the file you want to edit.
3. Click the pencil (**Edit this file**) button.
4. Make the changes.
5. Click **Commit changes** and add a short commit message.

For multiple files, larger changes, testing, or recompiling LaTeX/diagrams, edit locally in VS Code and push the changes instead. Direct edits to `proposal.tex` on GitHub do **not** automatically regenerate `proposal.pdf`.

## 6. Publish with GitHub Pages

The project includes `.github/workflows/deploy.yml` which publishes the repository's static files when code is pushed to `main`.

1. Push the code to the `main` branch.
2. On GitHub, open **Settings → Pages**.
3. Set the build/deployment source to **GitHub Actions**.
4. Open **Actions** and inspect the deployment workflow run.
5. When it succeeds, open the Pages URL shown by the workflow and test both the home page and OOP prototype.

With repository name `find-your-doctor-capstone`, the common paths are:

```text
https://YOUR-USERNAME.github.io/find-your-doctor-capstone/
https://YOUR-USERNAME.github.io/find-your-doctor-capstone/prototype/
```

Use the actual URL from GitHub Pages/Actions rather than assuming deployment has succeeded.

## 7. Rename the repository or website

- **Repository name:** use **Settings → General → Repository name**. If already cloned, update your local remote with `git remote set-url origin https://github.com/YOUR-USERNAME/NEW-REPO-NAME.git`.
- **Website heading:** edit the heading/title in root `index.html` and the OOP heading in `prototype/index.html` if needed.
- **README title and links:** update `README.md` and any absolute GitHub Pages URL you have added.
- **Proposal title:** edit `proposal.tex` and compile it again to update `proposal.pdf`.

For a course submission, keep the project name and student metadata consistent across the repository README, the PDF cover page, and the source LaTeX.
