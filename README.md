# Archive

A minimalist, distraction-free writing app with AI-powered formatting, real-time cloud sync, and a clean dark interface.

**Live:** [archive.tirup.in](https://archive.tirup.in)

---

## Features

- **Distraction-free editor** — Full-screen dark writing environment with no clutter
- **AI Formatting** — One-click document structure powered by Gemini (headings, spacing, lists, code blocks)
- **Cloud Sync** — Auto-saves to Firestore when signed in; falls back to `localStorage` for guests
- **Manual Save** — Force-save to cloud anytime with the save button
- **Rich Formatting Toolbar** — Bold, italic, underline, strikethrough, headings, lists, links, code blocks
- **Code Blocks** — Syntax-styled dark boxes with one-click copy button
- **Hyperlinks** — Persistent links with bubble menu preview on hover
- **Multiple Projects** — Create, switch, and delete projects from the sidebar
- **Google Sign-In** — Secure auth via Firebase Authentication
- **Light / Dark theme** — Toggle between themes
- **Export** — Download your document as `.txt`
- **Word & character counter**
- **Voice typing** (Web Speech API)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Editor | TipTap (ProseMirror) |
| Auth | Firebase Authentication (Google) |
| Database | Firestore |
| AI | Gemini via Firebase AI SDK |
| Styling | Vanilla CSS |
| Hosting | Vercel |

---

## Local Development

```bash
git clone https://github.com/YOUR_USERNAME/archive.git
cd archive
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment

No `.env` file needed — Firebase config is inlined in `src/lib/firebase.ts`.  
The project uses Firebase's client SDK (public keys), secured by Firestore rules.

---

## Firestore Rules

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      match /{allPaths=**} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

---

## License

MIT
