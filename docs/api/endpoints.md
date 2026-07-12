# API Reference

This document provides a complete reference of all HireKarma API endpoints, including request/response schemas, authentication requirements, and example usage.

---

## Base URL

```
http://127.0.0.1:8000
```

All endpoints are prefixed with their respective router prefix (`/auth`, `/jobs`, `/applications`, `/profile`, `/ai`).

---

## Interactive Documentation

FastAPI provides auto-generated interactive documentation:

- **Swagger UI**: `http://127.0.0.1:8000/docs`
- **ReDoc**: `http://127.0.0.1:8000/redoc`

---

## Authentication

All protected endpoints require a Bearer JWT token in the `Authorization` header:

```
Authorization: Bearer <access_token>
```

Tokens are obtained via `POST /auth/login` and expire after 60 minutes.

---

## Endpoints

### Authentication

#### `POST /auth/signup`

Register a new user account.

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response (201 Created):**

```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "phone": null,
  "location": null,
  "skills": null,
  "profile_image": null
}
```

**Errors:**
- `400 Bad Request` — Email already registered.

---

#### `POST /auth/login`

Authenticate and receive a JWT access token.

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response (200 OK):**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

**Errors:**
- `401 Unauthorized` — Invalid email or password.

---

#### `GET /auth/me`

Get the current authenticated user's profile.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response (200 OK):**

```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+91 98765 43210",
  "location": "Bangalore",
  "skills": "Python, React, Docker",
  "profile_image": null
}
```

**Errors:**
- `401 Unauthorized` — Missing or invalid token.

---

### Jobs

#### `GET /jobs/scrape`

Trigger multi-source job scraping.

**Query Parameters:**

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `keyword` | `string` | Yes | Job title or skill to search (e.g., `Python Developer`) |
| `location` | `string` | Yes | Location to search in (e.g., `Bangalore`) |

**Example Request:**

```
GET /jobs/scrape?keyword=Python&location=Bangalore
Authorization: Bearer <access_token>
```

**Response (200 OK):**

```json
[
  {
    "title": "Python Developer",
    "company": "Google",
    "location": "Bangalore",
    "platform": "LinkedIn",
    "job_link": "https://linkedin.com/jobs/view/12345"
  },
  {
    "title": "Backend Engineer",
    "company": "Amazon",
    "location": "Bangalore",
    "platform": "Naukri",
    "job_link": "https://naukri.com/job-listings/67890"
  }
]
```

**Notes:**
- Returns a minimum of 5 jobs. If live scrapers return fewer, realistic mock jobs are generated.
- Unstop scraper is currently a stub (returns empty).

---

### Applications

#### `POST /applications/apply`

Log a new job application.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Request Body:**

```json
{
  "job_title": "Python Developer",
  "company": "Google",
  "platform": "LinkedIn",
  "job_link": "https://linkedin.com/jobs/view/12345",
  "status": "Applied"
}
```

**Response (201 Created):**

```json
{
  "id": 1,
  "user_id": 1,
  "job_title": "Python Developer",
  "company": "Google",
  "platform": "LinkedIn",
  "job_link": "https://linkedin.com/jobs/view/12345",
  "status": "Applied",
  "applied_date": "2026-07-13T20:30:00"
}
```

**Errors:**
- `401 Unauthorized` — Missing or invalid token.

---

#### `GET /applications/`

List applications for the current user with optional filters.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Query Parameters:**

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `search` | `string` | No | Search in job title or company (ILIKE) |
| `status` | `string` | No | Filter by status (e.g., `Applied`, `Interviewing`) |
| `platform` | `string` | No | Filter by platform |
| `limit` | `integer` | No | Number of results per page (default: 10) |
| `offset` | `integer` | No | Number of results to skip (for pagination) |

**Example Request:**

```
GET /applications/?search=Google&status=Applied&limit=10&offset=0
Authorization: Bearer <access_token>
```

**Response (200 OK):**

```json
[
  {
    "id": 1,
    "user_id": 1,
    "job_title": "Python Developer",
    "company": "Google",
    "platform": "LinkedIn",
    "job_link": "https://linkedin.com/jobs/view/12345",
    "status": "Applied",
    "applied_date": "2026-07-13T20:30:00"
  }
]
```

**Notes:**
- Results are ordered by `applied_date` descending.
- Pagination is manual via `limit` and `offset`.

---

### Profile

#### `GET /profile/{user_id}`

Fetch a user's public profile.

**Path Parameters:**

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `user_id` | `integer` | User ID to fetch |

**Example Request:**

```
GET /profile/1
```

**Response (200 OK):**

```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+91 98765 43210",
  "location": "Bangalore",
  "skills": "Python, React, Docker",
  "profile_image": null
}
```

**Notes:**
- **No authentication required** — this endpoint is publicly accessible.

---

#### `PUT /profile/{user_id}`

Update a user's profile.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Path Parameters:**

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `user_id` | `integer` | User ID to update |

**Request Body:**

```json
{
  "name": "John Doe",
  "phone": "+91 98765 43210",
  "location": "Bangalore",
  "skills": "Python, React, Docker, AWS"
}
```

**Response (200 OK):**

```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+91 98765 43210",
  "location": "Bangalore",
  "skills": "Python, React, Docker, AWS",
  "profile_image": null
}
```

**Notes:**
- Only `name`, `phone`, `location`, and `skills` can be updated.
- Email and password cannot be changed via this endpoint.

---

#### `POST /profile/{user_id}/image`

Upload a profile avatar image.

**Headers:**

```
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

**Form Data:**

| Field | Type | Description |
| :--- | :--- | :--- |
| `file` | `UploadFile` | Image file to upload |

**Response (200 OK):**

```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+91 98765 43210",
  "location": "Bangalore",
  "skills": "Python, React, Docker",
  "profile_image": "user_1.jpg"
}
```

**Notes:**
- Files are saved to `backend/app/static/uploads/`.
- The `profile_image` field stores just the filename.

---

#### `DELETE /profile/{user_id}/image`

Remove a user's profile avatar.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response (200 OK):**

```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+91 98765 43210",
  "location": "Bangalore",
  "skills": "Python, React, Docker",
  "profile_image": null
}
```

**Notes:**
- Deletes the file from disk and clears the `profile_image` field.

---

### AI

#### `POST /ai/parse-resume`

Parse a PDF resume and extract tech skills.

**Headers:**

```
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

**Form Data:**

| Field | Type | Description |
| :--- | :--- | :--- |
| `file` | `UploadFile` | PDF resume file |

**Response (200 OK):**

```json
{
  "skills_extracted": ["Python", "React", "Docker", "AWS"],
  "message": "Successfully parsed 4 skills from resume"
}
```

**Errors:**
- `400 Bad Request` — Invalid file format or empty PDF.
- `401 Unauthorized` — Missing or invalid token.

---

#### `POST /ai/recommend`

Get AI-ranked job recommendations based on resume.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Request Body:**

```json
{
  "keyword": "Python Developer",
  "location": "Bangalore",
  "resume_text": "Experienced Python developer with React and AWS..."
}
```

**Response (200 OK):**

```json
[
  {
    "title": "Senior Python Engineer",
    "company": "Google",
    "location": "Bangalore",
    "platform": "LinkedIn",
    "job_link": "https://linkedin.com/jobs/view/12345",
    "match_score": 92,
    "feedback": "Strong match! Your Python and AWS skills align well."
  },
  {
    "title": "Backend Developer",
    "company": "Amazon",
    "location": "Bangalore",
    "platform": "Naukri",
    "job_link": "https://naukri.com/job-listings/67890",
    "match_score": 78,
    "feedback": "Good match. Consider highlighting Docker experience."
  }
]
```

**Notes:**
- Jobs are scraped live using the same engine as `/jobs/scrape`.
- Scoring uses TF-based cosine similarity with a +25 point buffer (capped at 100).
- Results are sorted by `match_score` descending.

---

#### `POST /ai/chat`

Send a message to the AI career advisor.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Request Body:**

```json
{
  "message": "How do I prepare for SDE-1 interviews?"
}
```

**Response (200 OK):**

```json
{
  "reply": "For SDE-1 interviews, focus on: 1) Data Structures & Algorithms...",
  "source": "gemini"
}
```

**Response Sources:**
- `"gemini"` — Response from Google Gemini API.
- `"keyword"` — Response from static keyword database.
- `"fallback"` — Generic contextual advice using user's saved skills.

**Notes:**
- If `GEMINI_API_KEY` is not configured, the system falls back to keyword responses.
- User's saved skills are included in the system prompt for contextual responses.

---

## Error Responses

All errors follow a consistent format:

```json
{
  "detail": "Error message describing the issue"
}
```

### Common HTTP Status Codes

| Code | Meaning |
| :--- | :--- |
| `200 OK` | Successful GET/PUT |
| `201 Created` | Successful POST creating a resource |
| `400 Bad Request` | Invalid input or validation error |
| `401 Unauthorized` | Missing or invalid JWT token |
| `404 Not Found` | Resource not found |
| `422 Unprocessable Entity` | Pydantic validation error |

---

## Next Steps

- [Authentication Guide](../api/authentication.md) — JWT flow and security best practices
- [Backend Architecture](../architecture/backend.md) — How routes and services are structured
- [Getting Started](../getting-started/installation.md) — Set up your local environment
