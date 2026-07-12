# HireKarma Documentation

Welcome to the official documentation for **HireKarma** — a production-ready full-stack job scraper and tracking platform for SDE candidates.

---

## 📚 Documentation Structure

| Section | Description |
| :--- | :--- |
| [Getting Started](getting-started/installation.md) | Installation, prerequisites, and local setup |
| [Configuration](getting-started/configuration.md) | Environment variables, database setup, and AI configuration |
| [Architecture Overview](architecture/overview.md) | High-level system design and data flow |
| [Backend](architecture/backend.md) | FastAPI application structure, routes, and services |
| [Frontend](architecture/frontend.md) | React application structure, routing, and state management |
| [Database](architecture/database.md) | Schema, models, and relationships |
| [API Reference](api/endpoints.md) | Complete endpoint reference with examples |
| [Authentication](api/authentication.md) | JWT auth flow, security considerations, and best practices |
| [Scraping Engine](features/scraping.md) | Multi-portal scraper architecture and data sources |
| [AI Recommendations](features/ai-recommendations.md) | Cosine similarity scoring and job ranking |
| [Resume Parser](features/resume-parser.md) | PDF parsing, skill extraction, and matching |
| [Application Tracking](features/application-tracking.md) | Job application logging, history, and status management |
| [Backend Deployment](deployment/backend.md) | Render, Railway, and Docker deployment |
| [Frontend Deployment](deployment/frontend.md) | Vercel, Netlify, and static hosting |
| [Changelog](CHANGELOG.md) | Version history and release notes |

---

## 🚀 Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/your-org/job-scraper-platform.git
cd job-scraper-platform

# 2. Backend
cd backend
python -m venv .venv
.\.venv\Scripts\activate   # Windows
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload

# 3. Frontend (in a new terminal)
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## 📖 Key Concepts

- **Scraping**: Live web scraping of Internshala + realistic mock data fallback for demo/testing.
- **AI Matching**: Pure-Python TF cosine similarity scores resume skills against job descriptions.
- **Career Advisor**: Tiered fallback — Google Gemini API → static keyword responses → contextual advice.
- **Auth**: JWT Bearer tokens with bcrypt password hashing. No server-side session store.
- **Database**: PostgreSQL primary with automatic SQLite fallback for offline/local development.

---

## 🤝 Contributing

See the main [README.md](../README.md) for contribution guidelines, tech stack details, and project overview.

---

## 📄 License

This project is proprietary. All rights reserved.
