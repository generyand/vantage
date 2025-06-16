# Vantage Monorepo

A modern monorepo setup using **Turborepo** with **NextJS** frontend and **FastAPI** backend.

## 🏗️ Project Structure

```
/
├── apps/
│   ├── web/          # NextJS frontend (TypeScript)
│   └── api/          # FastAPI backend (Python)
├── packages/
│   └── shared/       # Shared types and utilities (TypeScript)
├── turbo.json        # Turborepo configuration
├── package.json      # Root package.json
└── pnpm-workspace.yaml
```

## 🛠️ Tech Stack

### Frontend (`apps/web`)
- **Framework**: NextJS 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Package Manager**: pnpm

### Backend (`apps/api`)
- **Framework**: FastAPI
- **Language**: Python 3.13+
- **Package Manager**: uv
- **Server**: Uvicorn

### Shared (`packages/shared`)
- **Language**: TypeScript
- **Purpose**: Common types, utilities, and constants

### Monorepo
- **Tool**: Turborepo
- **Package Manager**: pnpm (workspaces)

## 🚀 Quick Start

### Prerequisites
- Node.js (18+)
- Python (3.13+)
- pnpm (`npm install -g pnpm`)
- uv (`pip install uv`)

### Installation
```bash
# Install all dependencies
pnpm install
```

### Development

#### Start all applications
```bash
pnpm dev
```

#### Start individual applications
```bash
# Frontend only (http://localhost:3000)
pnpm dev:web

# Backend only (http://localhost:8000)
pnpm dev:api
```

### Building

```bash
# Build all applications
pnpm build

# Build specific application
turbo build --filter=web
turbo build --filter=api
```

### Testing & Linting

```bash
# Run tests across all apps
pnpm test

# Run linting
pnpm lint

# Type checking
pnpm type-check
```

## 📝 Available Scripts

- `pnpm dev` - Start all applications in development mode
- `pnpm build` - Build all applications
- `pnpm test` - Run tests across all applications
- `pnpm lint` - Run linting across all applications
- `pnpm type-check` - Run TypeScript type checking
- `pnpm clean` - Clean build artifacts

## 🔗 API Endpoints

The FastAPI backend runs on `http://localhost:8000` and provides:

- `GET /` - Welcome message
- `GET /health` - Health check endpoint
- `GET /api/hello` - Hello world endpoint
- `GET /api/users/me` - Get current user info

## 🔄 Type Sharing Between Frontend & Backend

This monorepo keeps TypeScript and Python types in sync using **tag-based organization** for maintainable, scalable type management:

### 🏗️ **Tag-Based Type Organization**

Instead of one massive types file, we organize types by **feature areas** using OpenAPI tags:

```
packages/shared/src/generated/
├── models/
│   ├── AuthModels.ts      → Auth-related types
│   ├── UserModels.ts      → User-related types  
│   ├── ProjectModels.ts   → Project-related types
│   └── SystemModels.ts    → System/health types
├── services/
│   ├── AuthService.ts     → Auth API calls
│   ├── UserService.ts     → User API calls
│   ├── ProjectService.ts  → Project API calls
│   └── SystemService.ts   → System API calls
└── index.ts               → Clean exports
```

### How It Works:
1. **Organize Python models** by domain in proper FastAPI structure:
   ```
   apps/api/app/models/
   ├── __init__.py       → Exports all models
   ├── base.py          → Common models (ApiResponse)
   ├── user.py          → User models
   ├── auth.py          → Authentication models  
   ├── project.py       → Project models
   └── system.py        → System/health models
   ```

2. **Tag API endpoints** in FastAPI by feature area:
   ```python
   @app.post("/api/auth/login", tags=["auth"])
   @app.get("/api/users/me", tags=["users"])
   @app.get("/api/projects", tags=["projects"])
   ```

3. **Generate organized types** using advanced tooling:
   ```bash
   pnpm dev:api          # Start API
   pnpm generate-types   # Generate organized types
   ```

4. **Use clean, organized imports**:
   ```typescript
   import { User, AuthToken, Project } from '@vantage/shared';
   ```

### 📁 **Scalable Structure**

✅ **Feature-based files** instead of one massive file  
✅ **Logical organization** by domain/resource  
✅ **Easy maintenance** - find types quickly  
✅ **Auto-generated services** with proper typing  
✅ **Clean imports** from `@vantage/shared`

### Commands:
- `pnpm generate-types` - Generate organized TypeScript types
- Types are organized in `packages/shared/src/generated/`
- Import from `@vantage/shared` for clean, typed API access

## 🌟 Features

- ✅ **Modern monorepo** setup with Turborepo
- ✅ **Fast builds** with intelligent caching
- ✅ **Type safety** across frontend and backend
- ✅ **Shared utilities** and types
- ✅ **Hot reloading** for both frontend and backend
- ✅ **CORS configured** for local development
- ✅ **Simple architecture** following best practices

## 🔧 Git Workflow

This monorepo uses a **single Git repository** at the root level for all packages.

### Initial Setup (Already Done)
```bash
git init
git add .
git commit -m "Initial commit: Setup Vantage monorepo"
```

### Daily Workflow
```bash
# Check status across all packages
git status

# Add changes across all packages
git add .

# Commit with descriptive message
git commit -m "feat: add new API endpoint and update frontend"

# Example of committing changes to specific apps
git add apps/web/
git commit -m "feat(web): add user dashboard component"

git add apps/api/
git commit -m "fix(api): handle user authentication edge case"
```

### Branch Strategy
```bash
# Create feature branch
git checkout -b feature/user-auth

# Work on changes across multiple packages
# ... make changes ...

# Commit changes
git add .
git commit -m "feat: implement user authentication system"

# Push and create PR
git push origin feature/user-auth
```

## 📚 Learn More

- [Turborepo Documentation](https://turbo.build/repo/docs)
- [NextJS Documentation](https://nextjs.org/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [pnpm Workspaces](https://pnpm.io/workspaces)
- [uv Package Manager](https://github.com/astral-sh/uv) 