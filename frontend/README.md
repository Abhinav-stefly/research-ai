# Research AI Frontend

React + Vite frontend for the Research AI paper analysis platform.

## Features

- **Authentication**: Login and register pages with form validation
- **Dashboard**: Upload PDFs, view your papers
- **Paper Detail**: Multi-tab interface with:
  - Summary (short/detailed)
  - Sections (abstract, intro, methodology, results, conclusion)
  - ELI5/Graduate explanations
  - Mathematical expression explanations
  - Similar papers (based on semantic similarity)
- **Responsive Design**: Tailwind CSS for clean, mobile-friendly UI
- **API Integration**: Axios-based API calls with auth token management

## Setup

```bash
cd frontend
npm install
npm run dev
```

The dev server runs on `http://localhost:3000` and proxies API calls to `http://localhost:5000`.

## Build

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── pages/           # Page components
├── components/      # Reusable components
│   └── tabs/       # Detail page tabs
├── api.js          # API client
├── utils.js        # Utility functions
├── index.css       # Tailwind styles
├── App.jsx         # Main app component
└── main.jsx        # Entry point
```

## Environment

Make sure the backend is running on `http://localhost:5000` before starting the frontend dev server.
