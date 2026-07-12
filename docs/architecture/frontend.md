# Frontend Architecture

This document details the React frontend structure, including pages, components, state management, and API communication.

---

## Application Structure

```
frontend/src/
├── main.jsx               # React entry point, mounts <App />
├── App.jsx                # Router configuration, protected route wrapper
├── App.css                # Legacy scaffold styles (mostly unused)
├── index.css              # Tailwind v4 entry, custom theme variables
├── assets/                # Static images and SVGs
├── components/
│   ├── Sidebar.jsx        # Collapsible left navigation
│   ├── Navbar.jsx         # Top navigation (unused in current pages)
│   └── JobCard.jsx        # Job card presentational component (unused)
├── context/
│   └── AuthContext.jsx    # Global auth state (user, token, login/logout)
├── layouts/               # Empty (reserved for layout wrappers)
├── hooks/                 # Empty (reserved for custom hooks)
├── routes/                # Empty (reserved for route configs)
├── utils/                 # Empty (reserved for helpers)
├── pages/
│   ├── Home.jsx           # Public landing page
│   ├── Login.jsx          # Email/password login
│   ├── Signup.jsx         # Registration form
│   ├── Dashboard.jsx      # KPI cards, recent apps, AI chat panel
│   ├── Jobs.jsx           # Scrape form, results table, apply actions
│   ├── Profile.jsx        # Avatar, bio, resume upload, skills
│   ├── ApplicationHistory.jsx  # Full application tracker with filters
│   ├── Settings.jsx       # Dark mode, notifications, health status
│   └── NotFound.jsx       # 404 fallback
└── services/
    └── api.js             # Axios instance with auth interceptor
```

---

## Tech Stack

| Technology | Version | Purpose |
| :--- | :--- | :--- |
| **React** | 19.2.6 | UI library |
| **React Router** | 7.17.0 | Client-side routing |
| **Axios** | 1.17.0 | HTTP client |
| **Tailwind CSS** | 4.3.0 | Utility-first CSS |
| **Vite** | 8.0.12 | Build tool and dev server |

---

## Routing

Routes are defined in `App.jsx`:

```jsx
<BrowserRouter>
  <AuthProvider>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/jobs" element={<ProtectedRoute><Jobs /></ProtectedRoute>} />
      <Route path="/history" element={<ProtectedRoute><ApplicationHistory /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </AuthProvider>
</BrowserRouter>
```

### Protected Route Pattern

`ProtectedRoute` is defined inline in `App.jsx`:

- If `AuthContext.loading` is `true` → shows a centered spinner.
- If no `token` in localStorage → redirects to `/login`.
- Otherwise → renders the child route.

---

## State Management

### Global State: AuthContext

`AuthContext.jsx` wraps the entire app and provides:

```jsx
const { user, token, loading, login, signup, logout, setUser } = useAuth();
```

| State | Type | Description |
| :--- | :--- | :--- |
| `user` | `Object \| null` | Authenticated user profile |
| `token` | `String \| null` | JWT from `localStorage` |
| `loading` | `Boolean` | Loading state during auth check |
| `login(email, password)` | `Function` | POST /auth/login, stores token |
| `signup(name, email, password)` | `Function` | POST /auth/signup |
| `logout()` | `Function` | Clears token and user from state/localStorage |
| `setUser(user)` | `Function` | Hydrate user after session validation |

### Session Hydration

On mount, if a `token` exists in `localStorage`:
1. `GET /auth/me` is called with the token.
2. On success, `user` is populated.
3. On failure, `logout()` is called to clear stale tokens.

### Local State

All pages use `useState` for form fields, fetched data, and UI flags. No external state management library is used.

---

## API Communication

### Axios Instance (`services/api.js`)

```js
const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000",
});

API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
```

- Token is auto-injected on login and cleared on logout.
- Errors are surfaced via `err.response?.data?.detail || "fallback message"`.

### API Endpoints Used

| Method | Endpoint | Used In | Purpose |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/signup` | AuthContext | Create account |
| `POST` | `/auth/login` | AuthContext | Obtain JWT |
| `GET` | `/auth/me` | AuthContext | Validate session |
| `GET` | `/applications/` | Dashboard, History | List applications |
| `POST` | `/applications/apply` | Jobs | Log application |
| `GET` | `/profile/{user_id}` | Profile | Read profile |
| `PUT` | `/profile/{user_id}` | Profile | Update profile |
| `POST` | `/profile/{user_id}/image` | Profile | Upload avatar |
| `DELETE` | `/profile/{user_id}/image` | Profile | Delete avatar |
| `POST` | `/ai/parse-resume` | Profile | Parse PDF resume |
| `POST` | `/ai/recommend` | Jobs | Get job recommendations |
| `POST` | `/ai/chat` | Dashboard | AI career advisor chat |

---

## UI Components

### Sidebar (`components/Sidebar.jsx`)

- Collapsible left navigation.
- Links: Dashboard, Search Jobs, Applications, My Profile, Settings.
- User card at bottom with avatar and logout button.
- Mobile-responsive hamburger menu.

### Navbar (`components/Navbar.jsx`)

- **Status**: Unused in current pages. Legacy component.

### JobCard (`components/JobCard.jsx`)

- **Status**: Unused in current pages. Presentational component for job display.

---

## Styling

### Theme

- **Primary**: Dark theme with `slate` palette (`slate-950` background, `slate-900` cards).
- **Accent**: Indigo for actions and active states.
- **Secondary**: Purple and pink gradients for branding.

### Tailwind v4

Configured via `@tailwindcss/vite` plugin in `vite.config.js`. No separate `tailwind.config.js` is used — configuration is done via CSS.

---

## Empty Directories

The following directories exist but contain no files:

| Directory | Intended Purpose |
| :--- | :--- |
| `src/layouts/` | Layout wrapper components |
| `src/hooks/` | Custom React hooks |
| `src/routes/` | Centralized route configuration |
| `src/utils/` | Helper functions |

These are reserved for future expansion.

---

## Build & Deployment

### Scripts

| Script | Command | Purpose |
| :--- | :--- | :--- |
| `npm run dev` | `vite` | Start dev server with HMR |
| `npm run build` | `vite build` | Production build → `dist/` |
| `npm run preview` | `vite preview` | Preview production build locally |
| `npm run lint` | `eslint .` | Lint JS/JSX files |

### Build Output

Production build outputs to `frontend/dist/`:
- `index.html`
- `assets/index-*.css`
- `assets/index-*.js`

### Environment Variables

- `VITE_API_BASE_URL` — Backend URL (default: `http://127.0.0.1:8000`).

---

## Next Steps

- [Architecture Overview](../architecture/overview.md) — System-wide design
- [Database Schema](database.md) — Backend data models
- [API Reference](../api/endpoints.md) — Backend endpoints
