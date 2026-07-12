# Architecture Overview

This document provides a high-level view of the HireKarma system architecture, component relationships, and data flow.

---

## System Architecture

```mermaid
flowchart TD
    Client["React Frontend (Vite)"] -->|HTTP/JSON| Backend["FastAPI Backend"]
    Backend -->|ORM| DB[(PostgreSQL / SQLite)]
    Backend -->|Scrape| Scraper["Scraper Engine"]
    Backend -->|AI| AIService["AI Service"]
    AIService -->|Optional| Gemini["Google Gemini API"]
    Scraper -->|Fetch| Portals["Job Portals\n(Internshala, Unstop, etc.)"]
    
    style Client fill:#6366f1,color:#fff
    style Backend fill:#10b981,color:#fff
    style DB fill:#f59e0b,color:#fff
    style AIService fill:#8b5cf6,color:#fff
    style Scraper fill:#ec4899,color:#fff
```

---

## Component Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           React Frontend                                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌───────────────┐  │
│  │  AuthContext │  │   Pages/    │  │ Components/ │  │ services/api  │  │
│  │  (JWT State)│  │ (Views)     │  │ (UI Reuse)  │  │  (Axios)      │  │
│  └─────────────┘  └─────────────┘  └─────────────┘  └───────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                              HTTP/HTTPS
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          FastAPI Backend                                │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │ main.py — App factory, CORS, static files, DB init               │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│  ┌──────────┐ ┌──────────┐ ┌───────────┐ ┌──────────┐ ┌────────────┐ │
│  │ routes/  │ │ routes/  │ │  routes/  │ │ routes/  │ │  routes/   │ │
│  │ auth.py  │ │ jobs.py  │ │applications│ │profile.py│ │   ai.py    │ │
│  └──────────┘ └──────────┘ └───────────┘ └──────────┘ └────────────┘ │
│                                    │                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────────────────┐  │
│  │ scraper/     │  │ services/    │  │     models/                  │  │
│  │scraper_engine│  │    ai.py    │  │  user.py / job.py /         │  │
│  │              │  │              │  │  application.py              │  │
│  └──────────────┘  └──────────────┘  └─────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                              SQLAlchemy 2.0
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                            Database Layer                               │
│  ┌─────────────────────────┐    ┌──────────────────────────────────┐   │
│  │     PostgreSQL          │    │   SQLite (Fallback)              │   │
│  │   (Production)          │    │   jobscraper.db                  │   │
│  └─────────────────────────┘    └──────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Core Flows

### 1. Authentication Flow

```mermaid
sequenceDiagram
    participant Client
    participant AuthAPI
    participant JWT
    participant DB
    
    Client->>AuthAPI: POST /auth/login {email, password}
    AuthAPI->>DB: Verify credentials
    DB-->>AuthAPI: User object
    AuthAPI->>JWT: Create access token
    JWT-->>AuthAPI: Signed JWT
    AuthAPI-->>Client: {access_token, token_type}
    
    Client->>AuthAPI: GET /auth/me (Bearer <token>)
    AuthAPI->>JWT: Decode token
    JWT-->>AuthAPI: Payload {sub: email}
    AuthAPI->>DB: Query user by email
    DB-->>AuthAPI: User object
    AuthAPI-->>Client: User profile
```

### 2. Scraping Flow

```mermaid
sequenceDiagram
    participant Client
    participant JobsAPI
    participant Scraper
    participant Portal
    participant DB
    
    Client->>JobsAPI: GET /jobs/scrape?keyword=Python&location=Bangalore
    JobsAPI->>Scraper: scrape_jobs_from_web(keyword, location)
    
    par Live Scraping
        Scraper->>Portal: GET Internshala search results
        Portal-->>Scraper: HTML response
        Scraper->>Scraper: Parse with BeautifulSoup
    and Mock Fallback
        Scraper->>Scraper: generate_mock_jobs() if <5 results
    end
    
    Scraper-->>JobsAPI: List[Job dict]
    JobsAPI-->>Client: {jobs: [...]}
```

### 3. AI Recommendation Flow

```mermaid
sequenceDiagram
    participant Client
    participant AIAPI
    participant Scraper
    participant AIService
    participant DB
    
    Client->>AIAPI: POST /ai/recommend {keyword, location, resume_text}
    AIAPI->>Scraper: scrape_jobs_from_web(keyword, location)
    Scraper-->>AIAPI: jobs[]
    
    loop For each job
        AIAPI->>AIService: calculate_cosine_similarity(resume, job)
        AIService-->>AIAPI: match_score (0-100)
    end
    
    AIAPI->>AIAPI: Sort jobs by match_score desc
    AIAPI-->>Client: {recommendations: [{job, match_score, feedback}]}
```

---

## Design Patterns

| Pattern | Where Used | Description |
| :--- | :--- | :--- |
| **Dependency Injection** | `get_db`, `get_current_user` | Database sessions and authenticated users injected via `Depends()` |
| **Service Layer** | `services/ai.py`, `scraper/scraper_engine.py` | Business logic decoupled from route handlers |
| **Repository Pattern** | SQLAlchemy ORM + session | Data access abstracted through ORM models |
| **Graceful Degradation** | Scraper, AI, Database | Failed scrapers → mock data; failed DB → SQLite; no Gemini → keyword responses |
| **Router Modularization** | `app/routes/*.py` | Each domain split into its own `APIRouter` with prefix and tags |

---

## Next Steps

- [Backend Architecture](backend.md) — Deep dive into FastAPI structure
- [Frontend Architecture](frontend.md) — React app structure and routing
- [Database Schema](database.md) — ORM models and relationships
- [API Reference](../api/endpoints.md) — Complete endpoint documentation
