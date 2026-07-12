# Backend Deployment

This guide covers deploying the HireKarma FastAPI backend to production environments.

---

## Recommended Platforms

| Platform | Free Tier | Ease of Use | Best For |
| :--- | :--- | :--- | :--- |
| **Render** | Yes | ⭐⭐⭐⭐⭐ | Quick deploys, auto-SSL |
| **Railway** | Yes | ⭐⭐⭐⭐⭐ | Simple setup, GitHub integration |
| **Fly.io** | Yes | ⭐⭐⭐⭐ | Global edge deployment |
| **AWS EC2** | No | ⭐⭐ | Full control, production-scale |
| **Google Cloud Run** | Yes | ⭐⭐⭐⭐ | Container-based, auto-scaling |

---

## Deploy to Render

### 1. Prepare Your Repository

Ensure your repo has:
- `backend/requirements.txt`
- `backend/app/main.py`
- `backend/.env.example`

### 2. Create Render Web Service

1. Go to [Render Dashboard](https://dashboard.render.com/).
2. Click **New** → **Web Service**.
3. Connect your GitHub repository.
4. Configure:
   - **Name**: `hirekarma-backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r backend/requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Root Directory**: `backend`

### 3. Environment Variables

Add these in Render's **Environment** tab:

| Key | Value | Required |
| :--- | :--- | :--- |
| `DATABASE_URL` | Your PostgreSQL connection string | No (SQLite fallback) |
| `GEMINI_API_KEY` | Your Google AI API key | No |

### 4. Deploy

Click **Create Web Service**. Render will build and deploy your app.

- **Live URL**: `https://hirekarma-backend.onrender.com`
- **Health Check**: `https://hirekarma-backend.onrender.com/health`

---

## Deploy to Railway

### 1. Create Railway Project

1. Go to [Railway Dashboard](https://railway.app/).
2. Click **New Project** → **Deploy from GitHub repo**.
3. Select your repository.

### 2. Configure Service

Railway auto-detects Python. Ensure:
- **Root Directory**: `backend`
- **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

### 3. Add Environment Variables

In Railway's **Variables** tab:

| Key | Value |
| :--- | :--- |
| `DATABASE_URL` | `postgresql://postgres:password@host:5432/hirekarma` |
| `GEMINI_API_KEY` | `AIzaSy...` |

Railway can also provision a PostgreSQL database for you.

### 4. Deploy

Railway will automatically deploy on every push to your branch.

- **Live URL**: `https://hirekarma-backend.up.railway.app`

---

## Deploy with Docker

### Dockerfile

Create `backend/Dockerfile`:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Build and Run

```bash
docker build -t hirekarma-backend ./backend
docker run -p 8000:8000 --env-file backend/.env hirekarma-backend
```

---

## Database Setup

### PostgreSQL (Production)

**Option A: Managed Database**

- **Render**: Add a PostgreSQL service in your project.
- **Railway**: Add a PostgreSQL plugin.
- **Supabase**: Free tier with 500MB storage.
- **Neon**: Free tier with serverless PostgreSQL.

**Option B: Self-Hosted**

```bash
# On your server
sudo apt install postgresql
sudo -u postgres psql
CREATE DATABASE hirekarma;
CREATE USER hirekarma_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE hirekarma TO hirekarma_user;
```

Update `DATABASE_URL`:

```
postgresql://hirekarma_user:secure_password@localhost:5432/hirekarma
```

### SQLite (Development Only)

For local development, leave `DATABASE_URL` empty:

```env
# DATABASE_URL=
```

The app will create `jobscraper.db` automatically.

---

## Environment Variables

### Required

| Variable | Description |
| :--- | :--- |
| `DATABASE_URL` | PostgreSQL connection string (or empty for SQLite) |
| `GEMINI_API_KEY` | Google Generative AI API key (optional) |

### Security Notes

- **Never** commit `.env` to version control.
- Use your platform's secrets manager (Render Environment, Railway Variables).
- Rotate `GEMINI_API_KEY` if exposed.

---

## CORS Configuration

Update `backend/app/main.py` for production:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://hirekarma.vercel.app",
        "https://your-custom-domain.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## Health Checks

The backend exposes:

```
GET /health
```

Response:

```json
{
  "status": "ok"
}
```

Use this for uptime monitoring and deployment health checks.

---

## Monitoring

- **Logs**: Use your platform's log viewer (Render Logs, Railway Logs).
- **Metrics**: Monitor response times, error rates, and database connections.
- **Alerts**: Set up uptime monitors (UptimeRobot, Pingdom) for `/health`.

---

## Next Steps

- [Frontend Deployment](../deployment/frontend.md) — Deploy the React app
- [Configuration Guide](../getting-started/configuration.md) — Environment variables
- [API Reference](../api/endpoints.md) — Backend endpoints
