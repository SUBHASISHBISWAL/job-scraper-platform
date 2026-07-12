# Frontend Deployment

This guide covers deploying the HireKarma React frontend to production environments.

---

## Recommended Platforms

| Platform | Free Tier | Ease of Use | Best For |
| :--- | :--- | :--- | :--- |
| **Vercel** | Yes | ⭐⭐⭐⭐⭐ | React/Next.js apps, auto-deploy |
| **Netlify** | Yes | ⭐⭐⭐⭐ | Static sites, form handling |
| **Cloudflare Pages** | Yes | ⭐⭐⭐⭐ | Global CDN, edge functions |
| **GitHub Pages** | Yes | ⭐⭐⭐ | Free static hosting |
| **AWS S3 + CloudFront** | No | ⭐⭐ | Full control, production-scale |

---

## Deploy to Vercel

### 1. Prepare Your Repository

Ensure your repo has:
- `frontend/package.json`
- `frontend/vite.config.js`

### 2. Import Project

1. Go to [Vercel Dashboard](https://vercel.com/new).
2. Click **Import Project**.
3. Connect your GitHub repository.
4. Select the **frontend** folder as the root directory.

### 3. Configure Build Settings

Vercel auto-detects Vite. Verify:

| Setting | Value |
| :--- | :--- |
| **Framework Preset** | Vite |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |

### 4. Environment Variables

Add in Vercel's **Environment Variables** tab:

| Key | Value | Environment |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | `https://your-backend-url.onrender.com` | Production |

### 5. Deploy

Click **Deploy**. Vercel will build and deploy your app.

- **Live URL**: `https://hirekarma-frontend.vercel.app`
- **Auto-deploy**: Every push to your branch triggers a new deployment.

---

## Deploy to Netlify

### 1. Connect Repository

1. Go to [Netlify Dashboard](https://app.netlify.com/start).
2. Connect your GitHub repository.

### 2. Configure Build Settings

| Setting | Value |
| :--- | :--- |
| **Base directory** | `frontend` |
| **Build command** | `npm run build` |
| **Publish directory** | `frontend/dist` |

### 3. Environment Variables

Add in Netlify's **Site settings** → **Environment variables**:

| Key | Value |
| :--- | :--- |
| `VITE_API_BASE_URL` | `https://your-backend-url.onrender.com` |

### 4. Deploy

Click **Deploy site**.

---

## Deploy to Cloudflare Pages

### 1. Create Project

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/pages).
2. Click **Create a project** → **Connect to Git**.

### 2. Configure Build

| Setting | Value |
| :--- | :--- |
| **Production branch** | `main` |
| **Build command** | `cd frontend && npm install && npm run build` |
| **Build output directory** | `frontend/dist` |

### 3. Environment Variables

Add in **Settings** → **Environment variables**:

| Key | Value |
| :--- | :--- |
| `VITE_API_BASE_URL` | `https://your-backend-url.onrender.com` |

---

## Environment Variables

### Build-Time Variables

| Variable | Purpose | Default |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | Backend API URL for Axios | `http://127.0.0.1:8000` |

### Setting Variables

**Vercel:**
```bash
vercel env add VITE_API_BASE_URL production
```

**Netlify:**
```bash
netlify env:set VITE_API_BASE_URL https://your-backend-url.onrender.com
```

---

## Custom Domain

### Vercel

1. Go to **Settings** → **Domains**.
2. Add your custom domain (e.g., `hirekarma.app`).
3. Update DNS records as instructed.
4. SSL is automatically provisioned.

### Netlify

1. Go to **Domain settings** → **Add custom domain**.
2. Update DNS records.
3. SSL is automatically provisioned via Let's Encrypt.

---

## CI/CD

All recommended platforms support automatic deployments:

- **Vercel**: Deploys on every push to the connected branch.
- **Netlify**: Deploys on every push (can be configured for preview deploys on PRs).
- **Cloudflare Pages**: Deploys on every push.

### Preview Deployments

Vercel and Netlify create preview URLs for every pull request, allowing you to review changes before merging.

---

## Performance Optimization

| Optimization | Status | Notes |
| :--- | :--- | :--- |
| Code splitting | ✅ Automatic | Vite splits chunks automatically |
| Tree shaking | ✅ Automatic | Vite removes unused code |
| Asset optimization | ✅ Automatic | Vite optimizes images and fonts |
| Gzip/Brotli | ✅ Automatic | Vercel/Netlify handle compression |
| CDN caching | ✅ Automatic | Static assets served from CDN |

---

## Troubleshooting

| Issue | Solution |
| :--- | :--- |
| **API calls fail** | Ensure `VITE_API_BASE_URL` points to the live backend URL, not localhost |
| **CORS errors** | Update `allow_origins` in backend `main.py` to include your frontend domain |
| **404 on refresh** | Configure redirect to `index.html` for SPA routing (Vercel/Netlify handle this automatically) |
| **Environment variables not working** | Ensure variables are prefixed with `VITE_` and redeploy after adding |

---

## Next Steps

- [Backend Deployment](../deployment/backend.md) — Deploy the FastAPI backend
- [Configuration Guide](../getting-started/configuration.md) — Environment variables
- [Architecture Overview](../architecture/overview.md) — Frontend structure
