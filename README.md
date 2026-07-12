# HireKarma Job Scraper Platform

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](CHANGELOG.md)
[![License](https://img.shields.io/badge/license-Proprietary-red.svg)](#license)
[![Python](https://img.shields.io/badge/python-3.10%2B-green.svg)](https://www.python.org/)
[![React](https://img.shields.io/badge/react-19.2.6-61dafb.svg)](https://react.dev/)

**HireKarma** is a production-ready full-stack job scraper and tracking platform designed for SDE candidates in India. It aggregates active job listings from major Indian portals, computes AI-powered compatibility scores against candidate resumes, and tracks application history — all wrapped in a modern, dark-themed SaaS UI.

---

## ✨ Key Features

- 🔍 **Multi-Portal Scraper Engine** — Automates scraping across Internshala and Unstop, with realistic mock data fallback for LinkedIn and Naukri.
- 🤖 **AI Resume Parser** — Upload a PDF resume to extract key tech capabilities using `PyPDF2` and regex-based skill matching.
- 📊 **Compatibility Scoring** — Computes a dynamic 0–100% match index using pure-Python TF cosine similarity.
- 📋 **Job Tracker & History Log** — Log applications automatically upon clicking "Apply Now" with full search, filter, and pagination.
- 💬 **AI Career Advisor** — Chat with an SDE career advisor powered by Google Gemini 1.5 Flash (with intelligent local fallback).
- 🔐 **Secure Access Controls** — JWT Bearer authentication with bcrypt password hashing on all protected routes.
- 🎨 **Interactive SaaS UI/UX** — Responsive dashboard with glassmorphic dark theme, collapsible sidebar, and loading states.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite 8, Tailwind CSS v4, Axios, React Router v7 |
| **Backend** | FastAPI, SQLAlchemy 2.0, PyPDF2, BeautifulSoup4 |
| **Database** | PostgreSQL (primary) with automatic SQLite fallback |
| **Authentication** | JWT Bearer tokens (`python-jose`) + bcrypt (`passlib`) |
| **AI / ML** | Pure-Python cosine similarity engine + optional Google Gemini API |

---

## 🚀 Quick Start

### Prerequisites

- **Python** 3.10+
- **Node.js** 18+
- **npm** 9+
- **PostgreSQL** 14+ (optional — SQLite fallback available)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-org/job-scraper-platform.git
cd job-scraper-platform

# 2. Backend setup
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1     # Windows
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload

# 3. Frontend setup (in a new terminal)
cd ../frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

> **Detailed installation instructions**: See [Getting Started → Installation](docs/getting-started/installation.md)

---

## 📡 Core API Endpoints

| Endpoint | Method | Auth | Description |
| :--- | :--- | :--- | :--- |
| `/auth/signup` | `POST` | Public | Register a new user |
| `/auth/login` | `POST` | Public | Authenticate and receive JWT |
| `/auth/me` | `GET` | Bearer | Get current user profile |
| `/jobs/scrape` | `GET` | Bearer | Trigger multi-source job scraping |
| `/applications/apply` | `POST` | Bearer | Log a new job application |
| `/applications/` | `GET` | Bearer | List applications with search/filter |
| `/profile/{user_id}` | `GET` | Public | Fetch user profile |
| `/profile/{user_id}` | `PUT` | Bearer | Update profile fields |
| `/profile/{user_id}/image` | `POST` | Bearer | Upload profile avatar |
| `/ai/parse-resume` | `POST` | Bearer | Parse PDF resume for skills |
| `/ai/recommend` | `POST` | Bearer | Get AI-ranked job recommendations |
| `/ai/chat` | `POST` | Bearer | Chat with AI career advisor |

> **Complete API reference**: See [API Reference](docs/api/endpoints.md)

---

## 📁 Project Structure

```
job-scraper-platform/
├── backend/
│   ├── app/
│   │   ├── main.py              # App factory, CORS, DB init
│   │   ├── database.py          # SQLAlchemy engine + SQLite fallback
│   │   ├── models/              # ORM entities (User, Job, Application)
│   │   ├── schemas/             # Pydantic request/response DTOs
│   │   ├── routes/              # Domain routers (auth, jobs, ai, etc.)
│   │   ├── services/ai.py       # PDF parsing, cosine similarity, Gemini chat
│   │   ├── scraper/             # Multi-portal scraping engine
│   │   ├── utils/               # JWT, password hashing
│   │   └── dependencies/        # Auth dependency injection
│   ├── .env.example
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── pages/               # Route views (Dashboard, Jobs, Profile, etc.)
│   │   ├── components/          # Shared UI (Sidebar, JobCard)
│   │   ├── context/             # AuthContext for global auth state
│   │   └── services/api.js      # Axios instance with auth interceptor
│   ├── package.json
│   └── vite.config.js
├── docs/                        # Full documentation suite
│   ├── getting-started/
│   ├── architecture/
│   ├── api/
│   ├── features/
│   └── deployment/
└── CHANGELOG.md
```

---

## 📚 Documentation

| Document | Description |
| :--- | :--- |
| [Getting Started](docs/getting-started/installation.md) | Installation, prerequisites, and local setup |
| [Configuration](docs/getting-started/configuration.md) | Environment variables, database, and AI setup |
| [Architecture Overview](docs/architecture/overview.md) | High-level system design and data flows |
| [Backend Architecture](docs/architecture/backend.md) | FastAPI routes, services, and utilities |
| [Frontend Architecture](docs/architecture/frontend.md) | React app structure, routing, and state management |
| [Database Schema](docs/architecture/database.md) | ORM models, relationships, and ERD |
| [API Reference](docs/api/endpoints.md) | Complete endpoint reference with examples |
| [Authentication](docs/api/authentication.md) | JWT flow, security, and best practices |
| [Scraping Engine](docs/features/scraping.md) | Multi-portal scraper architecture |
| [AI Recommendations](docs/features/ai-recommendations.md) | Cosine similarity scoring and job ranking |
| [Resume Parser](docs/features/resume-parser.md) | PDF parsing and skill extraction |
| [Application Tracking](docs/features/application-tracking.md) | Job application logging and history |
| [Backend Deployment](docs/deployment/backend.md) | Render, Railway, and Docker guides |
| [Frontend Deployment](docs/deployment/frontend.md) | Vercel, Netlify, and Cloudflare Pages |
| [Changelog](CHANGELOG.md) | Version history and release notes |

---

## 🚢 Deployment

### Backend
Deploy to **Render** or **Railway** with one click:

```bash
# Render / Railway start command
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

Set environment variables:
- `DATABASE_URL` — PostgreSQL connection string (optional, SQLite fallback)
- `GEMINI_API_KEY` — Google AI API key (optional)

> **Detailed guide**: See [Backend Deployment](docs/deployment/backend.md)

### Frontend
Deploy to **Vercel** or **Netlify**:

```bash
npm run build
```

Set environment variable:
- `VITE_API_BASE_URL` — Your live backend URL

> **Detailed guide**: See [Frontend Deployment](docs/deployment/frontend.md)

---

## 🔒 Security Considerations

| Concern | Status | Recommendation |
| :--- | :--- | :--- |
| Password hashing | ✅ Bcrypt | Never store plaintext passwords |
| JWT signing | ⚠️ Hardcoded | Move `SECRET_KEY` to environment variable |
| Token expiry | ✅ 60 min | Consider refresh tokens for production |
| CORS | ⚠️ Permissive | Restrict `allow_origins` to production domains |
| Rate limiting | ❌ Not implemented | Add `slowapi` or platform-level limits |
| Public profile endpoints | ⚠️ No auth | `GET/PUT /profile/{user_id}` are public — add auth guards |

---

## 🤝 Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -am 'feat: add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request.

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for coding standards and guidelines.

---

## 📄 License

This project is proprietary. All rights reserved.

---

## 🙋 Support

For questions, issues, or feature requests, please open an issue on GitHub.
