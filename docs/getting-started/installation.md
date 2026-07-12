# Installation Guide

This guide will walk you through setting up HireKarma on your local machine for development and testing.

---

## Prerequisites

| Tool | Minimum Version | Purpose |
| :--- | :--- | :--- |
| **Python** | 3.10+ | Backend runtime |
| **Node.js** | 18+ | Frontend runtime |
| **npm** | 9+ | Frontend package manager |
| **PostgreSQL** | 14+ | Production database (optional) |
| **Git** | 2.30+ | Version control |

> **Note**: PostgreSQL is optional. If not configured, the app automatically falls back to a local SQLite database (`jobscraper.db`).

---

## Step 1: Clone the Repository

```bash
git clone https://github.com/your-org/job-scraper-platform.git
cd job-scraper-platform
```

---

## Step 2: Backend Setup

### 2.1 Create Virtual Environment

**Windows (PowerShell):**
```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

**macOS / Linux:**
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
```

### 2.2 Install Dependencies

```bash
pip install -r requirements.txt
```

### 2.3 Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and set your configuration values (see [Configuration Guide](../configuration.md)).

### 2.4 Run the Backend Server

```bash
uvicorn app.main:app --reload
```

The backend will be available at `http://127.0.0.1:8000`.

- **API Docs (Swagger)**: `http://127.0.0.1:8000/docs`
- **ReDoc**: `http://127.0.0.1:8000/redoc`
- **Health Check**: `http://127.0.0.1:8000/health`

---

## Step 3: Frontend Setup

Open a new terminal window (keep the backend running).

### 3.1 Install Dependencies

```bash
cd frontend
npm install
```

### 3.2 Run the Development Server

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`.

---

## Step 4: Verify Installation

1. Open `http://localhost:5173` in your browser.
2. Click **Sign Up** and create a test account.
3. Navigate to **Jobs** and trigger a scrape to verify the backend connection.
4. Upload a PDF resume on the **Profile** page to test the AI parser.

---

## Step 5: (Optional) Configure PostgreSQL

If you want to use PostgreSQL instead of SQLite:

1. Install and start PostgreSQL locally.
2. Create a database:

   ```sql
   CREATE DATABASE jobscraper;
   ```

3. Update `backend/.env`:

   ```env
   DATABASE_URL=postgresql://postgres:postgres123@localhost:5432/jobscraper
   ```

4. Restart the backend server. Tables are auto-created on startup.

---

## Troubleshooting

| Issue | Solution |
| :--- | :--- |
| `ModuleNotFoundError` | Ensure the virtual environment is activated and dependencies are installed |
| `Address already in use` | Change the port: `uvicorn app.main:app --reload --port 8001` |
| `CORS error` | Ensure the backend is running and `VITE_API_BASE_URL` matches the backend URL |
| `Database connection failed` | Check PostgreSQL is running, or remove `DATABASE_URL` to use SQLite fallback |
| `npm install` fails | Delete `node_modules/` and `package-lock.json`, then run `npm install` again |

---

## Next Steps

- Read the [Configuration Guide](configuration.md) to learn about environment variables and deployment settings.
- Explore the [Architecture Overview](../architecture/overview.md) to understand how the system works.
- Check the [API Reference](../api/endpoints.md) for available endpoints.
