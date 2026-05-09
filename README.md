<div align="center">
  <h1>Archive</h1>
  <p>Minimalist writing app with AI formatting and real-time cloud sync.</p>

  <img src="https://img.shields.io/github/license/TirupMehta/archive?style=flat-square" alt="License" />
  <img src="https://img.shields.io/github/last-commit/TirupMehta/archive?style=flat-square" alt="Last Commit" />
  <img src="https://img.shields.io/website?url=https%3A%2F%2Farchive.tirup.in&style=flat-square" alt="Website" />

  <br /><br />

  **[Live Demo](https://archive.tirup.in)** · [Report Bug](https://github.com/TirupMehta/archive/issues) · [Request Feature](https://github.com/TirupMehta/archive/issues)
</div>

---

## About

Archive is a keyboard-first writing environment that stays out of your way. Write as a guest and everything saves locally. Sign in with Google to sync projects across devices. Hit the AI button to have Gemini restructure and format your document in one click.

---

## Features

- **AI Formatting** — Fixes grammar, adds structure, wraps code blocks, and spaces sections automatically
- **Cloud Sync** — Auto-saves to Firestore; falls back to `localStorage` without an account
- **Rich Editor** — Bold, italic, headings, lists, links, code blocks with copy button
- **Multiple Projects** — Create and switch between projects from the sidebar
- **Voice Typing, Export, Word Counter** — Built-in utilities

---

## Tech Stack

| | |
|---|---|
| Framework | Next.js 15 (App Router) |
| Editor | TipTap / ProseMirror |
| Backend | Firebase (Auth + Firestore) |
| AI | Gemini via Firebase AI SDK |
| Hosting | Vercel |

---

## Running Locally

```bash
git clone https://github.com/TirupMehta/archive.git
cd archive
npm install
npm run dev
```

> No `.env` needed — Firebase config uses public client-side keys secured by Firestore rules.

---

## License

MIT © [Tirup Mehta](https://tirup.in)
