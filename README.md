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

## 🌟 Features

- ✅ **Modern monorepo** setup with Turborepo
- ✅ **Fast builds** with intelligent caching
- ✅ **Type safety** across frontend and backend
- ✅ **Shared utilities** and types
- ✅ **Hot reloading** for both frontend and backend
- ✅ **CORS configured** for local development
- ✅ **Simple architecture** following best practices

## 📚 Learn More

- [Turborepo Documentation](https://turbo.build/repo/docs)
- [NextJS Documentation](https://nextjs.org/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [pnpm Workspaces](https://pnpm.io/workspaces)
- [uv Package Manager](https://github.com/astral-sh/uv) 