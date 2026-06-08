# HireKarma Job Scraper Platform

A production-ready Full-Stack Job Scraper and Tracking Platform designed to aggregate active SDE job listings from major Indian job portals, matching them against candidate resumes using local text-mining and Google Gemini AI insights.

---

## 🚀 Key Features

*   **Multi-Portal Scraper Engine**: Automates scraping across LinkedIn, Naukri, Internshala, and Unstop using keyword and location filters.
*   **AI Resume Parser**: Upload a PDF resume to extract key tech capabilities and automatically match them against job requirements.
*   **Compatibility Scoring**: Computes a dynamic match compatibility index (0-100%) for job postings based on skills overlap.
*   **Job Tracker & History Log**: Log applications automatically upon clicking "Apply Now" to track applied dates and status histories.
*   **Interactive SaaS UI/UX**: Responsive dashboard featuring glassmorphic designs, dark mode themes, collapsible sidebar menus, and loading states.
*   **Secure Access Controls**: Robust JWT authentication enforcements on backend routers and client-side page gates.

---

## 🛠️ Technology Stack

*   **Frontend**: React (Vite), Tailwind CSS v4, Axios, React Router Dom.
*   **Backend**: FastAPI (Python), SQLAlchemy, PyPDF2, Pure-Python Cosine Similarity engine.
*   **Database**: PostgreSQL (with automatic SQLite fallback `jobscraper.db` for offline setups out-of-the-box).

---

## 📦 Local Installation

### 1. Backend Setup
1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
3.  Configure environment variables by copying `.env.example` to `.env`:
    ```bash
    cp .env.example .env
    ```
    *(Note: If you leave `DATABASE_URL` empty or do not run PostgreSQL, the system automatically creates and connects to a local SQLite database)*
4.  Launch the FastAPI server:
    ```bash
    uvicorn app.main:app --reload
    ```
    *(The backend will be accessible at `http://127.0.0.1:8000`)*

### 2. Frontend Setup
1.  Navigate to the frontend directory:
    ```bash
    cd ../frontend
    ```
2.  Install packages:
    ```bash
    npm install
    ```
3.  Launch the development server:
    ```bash
    npm run dev
    ```
    *(The frontend will run at `http://localhost:5173`)*

---

## 📡 Core API Documentation

| Endpoint | Method | Security | Description |
| :--- | :--- | :--- | :--- |
| `/auth/signup` | `POST` | Public | Registers a new user. |
| `/auth/login` | `POST` | Public | Authenticates credentials and returns a JWT access token. |
| `/auth/me` | `GET` | Bearer | Resolves the authenticated user context. |
| `/jobs/scrape` | `GET` | Bearer | Triggers multi-source scrapers with `keyword` and `location`. |
| `/applications/apply` | `POST` | Bearer | Saves a new application log in the tracker. |
| `/applications/` | `GET` | Bearer | Retrieves search-filtered and paginated history. |
| `/profile/{user_id}` | `GET` | Bearer | Fetches bio and skills configuration. |
| `/profile/{user_id}` | `PUT` | Bearer | Updates bio metadata details. |
| `/profile/{user_id}/image`| `POST` | Bearer | Uploads a new user avatar. |
| `/ai/parse-resume` | `POST` | Bearer | Parses a PDF resume to update matching skills. |

---

## ☁️ Deployment Guidelines

*   **Backend (Render / Railway)**: Connect the GitHub repository, select Python environment, configure startup command `uvicorn app.main:app --host 0.0.0.0 --port $PORT`, and set environment config variables.
*   **Frontend (Vercel)**: Link React project root, configure output directory to `dist`, and set `VITE_API_URL` to point to the live backend server.
