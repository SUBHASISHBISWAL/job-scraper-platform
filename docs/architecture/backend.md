# Backend Architecture

This document details the FastAPI backend structure, including routes, services, utilities, and request lifecycle.

---

## Application Structure

```
backend/app/
├── main.py                # App factory, CORS, middleware, startup
├── database.py            # SQLAlchemy engine, session factory, fallback logic
├── dependencies/
│   └── auth.py            # get_current_user JWT dependency
├── models/
│   ├── user.py            # User ORM model
│   ├── job.py             # Job ORM model
│   └── application.py     # Application ORM model
├── schemas/
│   ├── user.py            # User Pydantic schemas
│   ├── login.py           # Login request schema
│   └── application.py     # Application Pydantic schemas
├── routes/
│   ├── auth.py            # Authentication endpoints
│   ├── jobs.py            # Job scraping endpoints
│   ├── applications.py    # Application tracking endpoints
│   ├── profile.py         # User profile endpoints
│   └── ai.py              # AI-powered endpoints
├── scraper/
│   └── scraper_engine.py  # Multi-portal scraping logic
├── services/
│   └── ai.py              # PDF parsing, cosine similarity, Gemini chat
├── static/
│   └── uploads/           # User-uploaded profile images
├── utils/
│   ├── jwt.py             # JWT creation and verification
│   └── security.py        # Password hashing utilities
└── .env                   # Local environment variables (git-ignored)
```

---

## App Factory (`main.py`)

The FastAPI app is created with the following setup:

```python
app = FastAPI(title="HireKarma Job Scraper API", version="1.0.0")
```

### Startup Events
- **Table Creation**: `Base.metadata.create_all(bind=engine)` auto-creates tables on startup.
- **Static Files**: Mounts `app/static` for serving uploaded profile images.

### Middleware
- **CORS**: Allows origins `http://localhost:5173`, `http://localhost:5174`, `http://localhost:5175`, `http://localhost:3000`.

### Router Registration

| Router | Prefix | Tags | Purpose |
| :--- | :--- | :--- | :--- |
| `auth_router` | `/auth` | `auth` | User signup, login, session management |
| `jobs_router` | `/jobs` | `jobs` | Job scraping trigger |
| `applications_router` | `/applications` | `applications` | Application CRUD and history |
| `profile_router` | `/profile` | `profile` | User profile read/update |
| `ai_router` | `/ai` | `ai` | Resume parsing, job recommendations, chat |

---

## Database Layer (`database.py`)

### Engine Creation

```python
engine = create_engine(DATABASE_URL, ...)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
```

### Fallback Logic

1. Load `DATABASE_URL` from environment.
2. If empty, use SQLite: `sqlite:///./jobscraper.db`.
3. If PostgreSQL URL is provided, attempt connection.
4. On connection failure, log error and fall back to SQLite.

### Session Management

```python
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

---

## Routes

### Authentication (`routes/auth.py`)

| Method | Path | Auth | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/signup` | Public | Create new user with hashed password |
| `POST` | `/auth/login` | Public | Validate credentials, return JWT |
| `GET` | `/auth/me` | Bearer | Return current authenticated user |

### Jobs (`routes/jobs.py`)

| Method | Path | Auth | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/jobs/scrape` | Bearer | Trigger multi-source scraping with `keyword` and `location` params |

### Applications (`routes/applications.py`)

| Method | Path | Auth | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/applications/apply` | Bearer | Create new application log |
| `GET` | `/applications/` | Bearer | List applications with search, filter, pagination |

Query parameters: `search` (ILIKE title/company), `status`, `platform`, `limit`, `offset`.

### Profile (`routes/profile.py`)

| Method | Path | Auth | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/profile/{user_id}` | **None** | Fetch user profile (public) |
| `PUT` | `/profile/{user_id}` | Bearer | Update name, phone, location, skills |
| `POST` | `/profile/{user_id}/image` | Bearer | Upload avatar image |
| `DELETE` | `/profile/{user_id}/image` | Bearer | Delete avatar image |

### AI (`routes/ai.py`)

| Method | Path | Auth | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/ai/parse-resume` | Bearer | Parse PDF resume, extract skills |
| `POST` | `/ai/recommend` | Bearer | Scrape and rank jobs by resume match |
| `POST` | `/ai/chat` | Bearer | Career advisor chat (Gemini or fallback) |

---

## Services

### Scraper Engine (`scraper/scraper_engine.py`)

- **`scrape_jobs_from_web(keyword, location)`**: Orchestrator that tries live scrapers sequentially, falls back to mock data if <5 results.
- **`scrape_internshala(keyword, location)`**: Live scraper using `requests` + `BeautifulSoup`. Targets `div.container-fluid.individual_internship` cards.
- **`scrape_unstop(keyword, location)`**: Stub (returns empty) — Unstop uses client-side rendering.
- **`generate_mock_jobs(keyword, location)`**: Generates 12 realistic mock jobs from a fixed company pool.

### AI Service (`services/ai.py`)

- **`extract_text_from_pdf(pdf_bytes)`**: Extracts text from all PDF pages using `PyPDF2`.
- **`parse_resume_skills(text)`**: Regex-based extraction against ~20 known tech skills.
- **`calculate_cosine_similarity(text1, text2)`**: TF-based cosine similarity using `Counter` vectors.
- **`calculate_match_score(resume, title, description)`**: Similarity percentage with +25 buffer (capped at 100).
- **`chat_with_advisor(message, user_skills)`**: 3-tier fallback — Gemini API → keyword responses → contextual advice.

---

## Utilities

### JWT (`utils/jwt.py`)

- Algorithm: HMAC-SHA256 (`HS256`)
- Secret: Hardcoded `"mysecretkey"` (move to env for production)
- Expiry: 60 minutes
- Functions: `create_access_token(data)`, `decode_access_token(token)`

### Security (`utils/security.py`)

- Uses `passlib` with `bcrypt` scheme.
- Functions: `hash_password(password)`, `verify_password(plain, hashed)`

---

## Dependencies

### Auth Dependency (`dependencies/auth.py`)

```python
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    # Decode JWT
    # Query user by email (sub claim)
    # Return User or raise 401
```

This dependency is used on all protected routes.

---

## Request Lifecycle

```
Incoming Request
       │
       ▼
  CORS Middleware
       │
       ▼
  Router Matching
       │
       ▼
  Dependency Injection (get_db, get_current_user)
       │
       ▼
  Route Handler
       │
       ├──> Service / Scraper / AI
       │
       ▼
  Pydantic Response Serialization
       │
       ▼
  JSON Response
```

---

## Next Steps

- [Frontend Architecture](frontend.md) — React app structure
- [Database Schema](database.md) — ORM models and relationships
- [API Reference](../api/endpoints.md) — Complete endpoint documentation
