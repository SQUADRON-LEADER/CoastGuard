# Contributing to CoastGuard 🌊

Thank you for your interest in contributing to **CoastGuard** — a community-driven coastal disaster management platform built for India. Every contribution, no matter how small, helps protect lives along India's 7,516 km coastline.

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Branch Naming Convention](#branch-naming-convention)
- [Commit Message Convention](#commit-message-convention)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)
- [Code Style Guidelines](#code-style-guidelines)

---

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please read it before contributing.

---

## How Can I Contribute?

### 🐛 Reporting Bugs
- Use the [GitHub Issues](https://github.com/SQUADRON-LEADER/CoastGuard/issues) page
- Check if the issue already exists before creating a new one
- Use the **Bug Report** issue template
- Include steps to reproduce, expected vs actual behavior, and screenshots if applicable

### 💡 Suggesting Enhancements
- Open a [Feature Request](https://github.com/SQUADRON-LEADER/CoastGuard/issues/new) issue
- Describe the problem you're solving, not just the solution
- Include mockups or examples if possible

### 🔧 Code Contributions
- Pick an open issue labeled `good first issue` or `help wanted`
- Comment on the issue to let others know you're working on it
- Fork the repository and create your branch from `main`

### 📝 Documentation
- Fix typos, clarify explanations, or add missing documentation
- Documentation PRs are always welcome!

---

## Development Setup

### Frontend
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

### Backend
```bash
cd backend
npm install
cp .env.example .env
npm start
```

See the [README](README.md) for full environment variable configuration.

---

## Branch Naming Convention

Use descriptive branch names following this pattern:

```
<type>/<short-description>
```

| Type | When to Use |
|---|---|
| `feat/` | New feature |
| `fix/` | Bug fix |
| `docs/` | Documentation changes |
| `refactor/` | Code refactoring |
| `style/` | Formatting, UI changes |
| `test/` | Adding or fixing tests |
| `chore/` | Build, config, dependency updates |

**Examples:**
```
feat/fisherman-geofence-sms-alert
fix/map-cluster-mobile-viewport
docs/api-reference-update
```

---

## Commit Message Convention

We follow the **Conventional Commits** specification. Every commit message must have a structured format:

```
<type>(<scope>): <short description>

[optional body]

[optional footer(s)]
```

### Types

| Type | Description |
|---|---|
| `feat` | A new feature |
| `fix` | A bug fix |
| `docs` | Documentation only changes |
| `style` | Formatting, missing semicolons, etc. (no logic change) |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `perf` | Performance improvement |
| `test` | Adding or correcting tests |
| `chore` | Build process, config, or dependency changes |
| `ci` | CI/CD configuration changes |

### Examples

```
feat(map): add real-time storm surge overlay to Leaflet map

fix(auth): handle expired JWT token with automatic refresh

docs(readme): update API reference with new /api/alerts endpoint

chore(deps): upgrade React from 18.2 to 18.3
```

---

## Pull Request Process

1. **Fork** the repository to your GitHub account
2. **Clone** your fork locally
3. **Create** a branch from `main` using the naming convention above
4. **Make** your changes — keep them focused and atomic
5. **Test** your changes locally (frontend + backend)
6. **Lint** the code:
   ```bash
   cd frontend && npm run lint
   ```
7. **Commit** using Conventional Commits format
8. **Push** your branch to your fork
9. **Open** a Pull Request against `SQUADRON-LEADER/CoastGuard:main`

### PR Checklist

Before submitting your PR, verify:

- [ ] My changes don't break existing functionality
- [ ] I've tested on both desktop and mobile viewports
- [ ] Environment variables are documented in `.env.example` if added
- [ ] No hardcoded secrets or API keys in the code
- [ ] The PR description explains what and why (not just how)
- [ ] Screenshots/recordings attached for UI changes

### Review Process

- A maintainer will review your PR within **3–5 business days**
- Address all review comments in new commits (don't force-push)
- Once approved, your PR will be squash-merged into `main`

---

## Reporting Bugs

When filing a bug report, please include:

```markdown
**Describe the bug:**
A clear description of what the bug is.

**Steps to Reproduce:**
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

**Expected behavior:**
What you expected to happen.

**Screenshots:**
If applicable, add screenshots.

**Environment:**
- OS: [e.g. Windows 11]
- Browser: [e.g. Chrome 120]
- Device: [e.g. Desktop / Mobile]
```

---

## Suggesting Features

When filing a feature request, please include:

```markdown
**Is your feature request related to a problem?**
A clear description of the problem. e.g. "I'm always frustrated when..."

**Describe the solution you'd like:**
A clear description of what you want to happen.

**Describe alternatives you've considered:**
Any alternative solutions or features you've considered.

**Additional context:**
Add any other context, mockups, or screenshots.
```

---

## Code Style Guidelines

### TypeScript / React

- Use **functional components** with hooks — no class components
- Use **TypeScript** types/interfaces for all props and state
- Prefer **named exports** over default exports for components
- Use **Tailwind CSS** utility classes — no inline styles
- Keep components **small and focused** — split if > 200 lines
- Use **custom hooks** to extract complex logic from components

### Node.js / Express

- Use **async/await** — no raw `.then()` chains
- Always handle errors with `try/catch` and return proper HTTP status codes
- Validate request bodies before processing
- Keep route handlers thin — business logic in separate functions

### General

- No commented-out code in PRs
- No `console.log` statements in production code
- All API keys and secrets must use environment variables

---

## Questions?

Open a [Discussion](https://github.com/SQUADRON-LEADER/CoastGuard/discussions) on GitHub or reach out via the project's community channels.

Thank you for helping protect India's coasts! 🌊🇮🇳
