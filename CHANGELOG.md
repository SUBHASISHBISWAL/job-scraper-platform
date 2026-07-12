# Changelog

All notable changes to HireKarma are documented here. This project adheres to [Semantic Versioning](https://semver.org/).

---

## [1.0.0] — 2026-07-13

### Added
- Initial production-ready release.
- Multi-portal job scraping engine (Internshala, Unstop with mock fallback).
- AI-powered job recommendation system with cosine similarity scoring.
- PDF resume parser with skill extraction (~20 known tech skills).
- AI career advisor chat with 3-tier fallback (Gemini API → keyword responses → contextual advice).
- JWT-based authentication with bcrypt password hashing.
- User profile management (CRUD bio, avatar upload/delete).
- Application tracking with search, filter, and pagination.
- Responsive dark-themed UI with collapsible sidebar and glassmorphic design.
- PostgreSQL primary database with automatic SQLite fallback.
- Comprehensive documentation suite (`docs/`).
- Swagger UI and ReDoc API documentation.

### Security
- Bcrypt password hashing via passlib.
- JWT Bearer token authentication with 60-minute expiry.
- CORS middleware restricting allowed origins.
- Pydantic input validation on all endpoints.
- SQLAlchemy ORM preventing SQL injection.

### Infrastructure
- FastAPI backend with modular router architecture.
- React 19 frontend with Vite 8 and Tailwind CSS v4.
- Resilient database fallback (PostgreSQL → SQLite).
- Static file serving for user-uploaded avatars.
- Health check endpoint (`/health`).

---

## [Unreleased]

### Planned
- LinkedIn and Naukri live scrapers (currently using mock data).
- Unstop headless browser scraper (Playwright/Selenium).
- Alembic database migrations.
- Rate limiting on scraping and AI endpoints.
- Email notifications for application status changes.
- OAuth social login (Google, GitHub).
- Light/dark theme toggle with persistence.
- Resume builder and cover letter generation.
- Interview preparation module with curated DSA questions.
- Admin dashboard for platform analytics.

---

## Versioning

We use [Semantic Versioning](https://semver.org/):

- **MAJOR** version for incompatible API changes.
- **MINOR** version for new functionality in a backward-compatible manner.
- **PATCH** version for backward-compatible bug fixes.

---

## Migration Guide

### From Pre-1.0 to 1.0

No migration needed. This is the initial stable release.

---

## Support

For issues and feature requests, please open an issue on GitHub.
