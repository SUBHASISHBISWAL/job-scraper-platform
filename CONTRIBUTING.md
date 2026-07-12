# Contributing to HireKarma

Thank you for your interest in contributing to HireKarma! This document provides guidelines and best practices for contributing.

---

## Code of Conduct

- Be respectful and inclusive.
- Welcome newcomers and help them get started.
- Focus on constructive feedback.
- Respect differing viewpoints and experiences.

---

## How to Contribute

### Reporting Bugs

1. Search existing issues to avoid duplicates.
2. Open a new issue with:
   - Clear, descriptive title.
   - Steps to reproduce.
   - Expected vs actual behavior.
   - Screenshots or logs if applicable.
   - Environment details (OS, Python/Node versions).

### Suggesting Features

1. Check existing issues and discussions.
2. Open a new issue with:
   - Problem statement.
   - Proposed solution.
   - Alternatives considered.
   - Mockups or examples if applicable.

### Submitting Pull Requests

1. **Fork** the repository.
2. **Create a branch**: `git checkout -b feat/my-feature`
3. **Make changes** following the code style guidelines below.
4. **Test** your changes locally.
5. **Commit** with a clear message: `git commit -am 'feat: add my feature'`
6. **Push** to your fork: `git push origin feat/my-feature`
7. **Open a Pull Request** against `main`.

---

## Code Style Guidelines

### Python (Backend)

- Follow [PEP 8](https://peps.python.org/pep-0008/).
- Use type hints for function signatures.
- Write docstrings for public functions and classes.
- Keep functions small and focused (single responsibility).
- Use SQLAlchemy 2.0 ORM patterns.
- Use Pydantic v2 schemas for request/response validation.

**Example:**

```python
from typing import List
from sqlalchemy.orm import Session

def get_applications(
    db: Session,
    user_id: int,
    status: str | None = None,
    limit: int = 10,
    offset: int = 0,
) -> List[Application]:
    """Retrieve applications for a user with optional status filtering."""
    query = db.query(Application).filter(Application.user_id == user_id)
    if status:
        query = query.filter(Application.status == status)
    return query.offset(offset).limit(limit).all()
```

### JavaScript/JSX (Frontend)

- Use functional components with hooks.
- Use `const` and `let` — avoid `var`.
- Use meaningful variable names.
- Keep components small and focused.
- Use Tailwind CSS utility classes for styling.

**Example:**

```jsx
function JobCard({ title, company, location, onApply }) {
  return (
    <div className="rounded-lg border border-slate-700 bg-slate-800 p-4">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="text-sm text-slate-400">{company}</p>
      <button
        onClick={onApply}
        className="mt-3 rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
      >
        Apply Now
      </button>
    </div>
  );
}
```

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**

```
feat(scraper): add LinkedIn job scraper
fix(auth): handle expired JWT tokens gracefully
docs(api): update endpoint examples in documentation
```

---

## Development Workflow

### 1. Set Up Environment

Follow the [Installation Guide](docs/getting-started/installation.md).

### 2. Create a Branch

```bash
git checkout -b feat/my-feature
```

### 3. Make Changes

- Edit code following style guidelines.
- Update documentation if needed.
- Add tests if applicable.

### 4. Run Locally

```bash
# Backend
cd backend
uvicorn app.main:app --reload

# Frontend
cd frontend
npm run dev
```

### 5. Test

- Manually test the feature in the browser.
- Check for console errors in the browser and backend logs.
- Verify existing functionality is not broken.

### 6. Commit and Push

```bash
git add .
git commit -m "feat: add my feature"
git push origin feat/my-feature
```

### 7. Open Pull Request

- Provide a clear description of the changes.
- Link to any related issues.
- Request review from maintainers.

---

## Testing

### Backend

```bash
cd backend
pytest
```

### Frontend

```bash
cd frontend
npm run lint
```

---

## Questions?

Open an issue or reach out to the maintainers. We're happy to help!
