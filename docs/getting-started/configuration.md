# Configuration Guide

This document describes all environment variables and configuration options available in HireKarma.

---

## Environment Variables

Configuration is managed via `.env` files. The backend loads these using `python-dotenv`.

### File Location

```
backend/.env          # Local overrides (git-ignored)
backend/.env.example  # Template (committed to git)
```

### Variables Reference

| Variable | Required | Default | Description |
| :--- | :--- | :--- | :--- |
| `DATABASE_URL` | No | `sqlite:///./jobscraper.db` | PostgreSQL connection string. Leave empty to use SQLite fallback. |
| `GEMINI_API_KEY` | No | *(none)* | Google Generative AI API key. Enables Gemini-powered career advisor responses. |

---

## Database Configuration

### SQLite (Default)

No configuration needed. If `DATABASE_URL` is empty or the PostgreSQL connection fails, the app automatically creates and uses:

```
jobscraper.db
```

This file is git-ignored and created in the `backend/` directory.

### PostgreSQL (Recommended for Production)

1. Set the `DATABASE_URL` in `.env`:

   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/jobscraper
   ```

2. The app will:
   - Attempt to connect to PostgreSQL on startup.
   - Auto-create all tables via `Base.metadata.create_all(bind=engine)`.
   - Fall back to SQLite if the connection fails (logged to console).

### Connection Behavior

The database layer in `backend/app/database.py` implements a **resilient fallback strategy**:

1. Load `DATABASE_URL` from environment.
2. If present, attempt PostgreSQL connection.
3. If connection fails, log the error and fall back to SQLite.
4. SQLite connections use `check_same_thread=False` for multi-threaded FastAPI access.

---

## AI Configuration

### Gemini API (Optional)

To enable Google Gemini-powered career advice:

1. Obtain an API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Add it to `backend/.env`:

   ```env
   GEMINI_API_KEY=AIzaSy...
   ```

3. The `/ai/chat` endpoint will use Gemini 1.5 Flash for responses.

### Fallback Behavior

If `GEMINI_API_KEY` is not set, the system falls back to:

1. **Static keyword responses** — Pre-defined answers for common career topics (DSA, React, Docker, AWS, etc.).
2. **Contextual fallback** — Generic career advice incorporating the user's saved skills.

---

## Frontend Configuration

The frontend uses Vite environment variables. Create a `.env` file in the `frontend/` directory (optional):

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

If not set, the default is `http://127.0.0.1:8000`.

### Build-Time Variables

| Variable | Purpose | Default |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | Backend API base URL for Axios | `http://127.0.0.1:8000` |

> **Note**: Vite exposes only variables prefixed with `VITE_` to the client-side code.

---

## Security Considerations

| Concern | Recommendation |
| :--- | :--- |
| `SECRET_KEY` | Currently hardcoded in `utils/jwt.py`. Move to environment variable for production. |
| `GEMINI_API_KEY` | Never commit to version control. Use `.env` and ensure `.gitignore` includes `.env`. |
| `DATABASE_URL` | Use strong passwords. For production, use managed database services (e.g., Supabase, Neon, AWS RDS). |
| CORS | Restrict `allow_origins` in `main.py` to your production domain in production. |

---

## Next Steps

- Read the [Architecture Overview](../architecture/overview.md) to understand the system design.
- Explore the [API Reference](../api/endpoints.md) for available endpoints.
