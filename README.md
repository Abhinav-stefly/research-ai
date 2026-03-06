# Research AI - Full Stack Paper Analysis Platform

A modern web application for analyzing research papers using AI. Extract sections, generate explanations, find similar papers, and more.

## Architecture

### Backend (`/backend`)
- **Node.js + Express** REST API
- **MongoDB** for data storage
- **Hugging Face Inference API** for LLM capabilities
- **pdfjs-dist** for PDF parsing
- Multer for file uploads

Key endpoints:
- `POST /api/auth/*` - Authentication
- `POST /api/papers/upload` - PDF upload
- `GET /api/papers/:id/citations` - Citation extraction
- `POST /api/ai/summarize/:id` - Summarization
- `POST /api/ai/explain` - Text explanation
- `POST /api/ai/math-explain` - Math explanation
- `GET /api/ai/similar/:id` - Similar papers

### Frontend (`/frontend`)
- **React 18** with Vite
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API calls

Features:
- Authentication (Login/Register)
- PDF upload dashboard
- Paper detail view with tabs
- Section browsing
- ELI5/Graduate explanation modes
- Mathematical expression breakdown
- Semantic similarity detection

## Quick Start

### Backend Setup
```bash
cd backend
npm install
# Create .env file with:
# PORT=5000
# MONGO_URI=mongodb://...
# JWT_SECRET=your-secret
# HF_API_KEY=your-huggingface-key
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Access the app at `http://localhost:3000`

## Features Implemented

✅ PDF Upload & Parsing
✅ Section Segmentation (regex+heuristics)
✅ Summarization (HF Inference API)
✅ ELI5/Graduate Explanations
✅ Mathematical Symbol Verbalization
✅ Citation Extraction & Graph
✅ Semantic Similarity (embeddings)
✅ React Frontend with Clean Architecture
✅ Authentication with JWT
✅ Tailwind CSS Styling

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=your-jwt-secret
HF_API_KEY=hf_...
HF_MODEL=facebook/bart-large-cnn
HF_EMBEDDING_MODEL=sentence-transformers/all-MiniLM-L6-v2
HF_MATH_MODEL=google/flan-t5-large
HF_EXPLAIN_MODEL=google/flan-t5-large
```

## Technology Stack

- **Language**: JavaScript (ES Modules)
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Frontend**: React, Vite, Tailwind CSS
- **AI**: Hugging Face Inference API
- **PDF Processing**: pdfjs-dist
- **Authentication**: JWT
- **File Upload**: Multer
