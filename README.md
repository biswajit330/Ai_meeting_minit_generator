# MinuteAI Frontend

Modern AI Meeting Minutes Generator web application frontend built with React, Vite, and Tailwind CSS.

## Structure

```text
frontend/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── api.js
    ├── components/
    │   ├── Navbar.jsx
    │   ├── AudioRecorder.jsx
    │   └── Loading.jsx
    └── pages/
        ├── Home.jsx
        ├── Generate.jsx
        └── Results.jsx
```

## Running standalone

```bash
cd frontend
npm install
npm run dev
```

The frontend sends meeting audio via `multipart/form-data` to:
`POST http://localhost:8000/api/generate-minutes`
