# VANTAGE

A modern monorepo setup using **Turborepo** with **NextJS** frontend and **FastAPI** backend for governance assessment and management.

## Table of Contents

- [Introduction](#introduction)
- [Table of Contents](#table-of-contents)
- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [Configuration](#configuration)
- [Contributing](#contributing)
- [Tests](#tests)
- [Deployment](#deployment)
- [Built With](#built-with)
- [Roadmap](#roadmap)
- [License](#license)
- [Author/Contact](#authorcontact)
- [Acknowledgments](#acknowledgments)

## Introduction

VANTAGE is a comprehensive pre-assessment, preparation, and decision-support tool designed for the DILG's Seal of Good Local Governance for Barangays (SGLGB) process. It facilitates a digital workflow where Barangay Local Government Units (BLGUs) submit their self-assessment and Means of Verification (MOVs), which are then reviewed by DILG Area Assessors through a structured, one-time rework cycle. The application supports formal, in-person Table Validation by functioning as a live checklist where assessors record final compliance data, features a classification algorithm that automatically applies the official "3+1" SGLGB scoring logic, and integrates with Google's Gemini API to generate actionable CapDev recommendations. VANTAGE serves as a strategic gap analysis tool, comparing initial submissions against final validated results to provide insights for improving the governance assessment cycle.

### Key Capabilities

- **SGLGB Assessment Workflow**: Digital submission and validation process for BLGUs
- **Table Validation Support**: Live checklist for in-person compliance recording
- **Automated Scoring**: "3+1" SGLGB scoring logic with classification algorithm
- **AI-Powered Recommendations**: Gemini API integration for CapDev suggestions
- **Gap Analysis**: Strategic comparison of initial vs. final assessment results
- **Multi-role Support**: Admin, BLGU, and Assessor user management
- **Type-safe Architecture**: End-to-end type safety between frontend and backend

## Installation

### Prerequisites

- **Node.js** (18+)
- **Python** (3.13+)
- **pnpm** (`npm install -g pnpm`)
- **uv** (`pip install uv`)

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd vantage
   ```

2. **Install dependencies**
   ```bash
   # Install all dependencies across the monorepo
   pnpm install
   ```

3. **Environment Configuration**
   ```bash
   # Copy environment files (if they exist)
   cp apps/api/.env.example apps/api/.env
   cp apps/web/.env.example apps/web/.env.local
   ```

4. **Database Setup**
   ```bash
   # Navigate to API directory
   cd apps/api
   
   # Run database migrations
   alembic upgrade head
   
   # Return to root
   cd ../..
   ```

5. **Generate Type Definitions**
   ```bash
   # Generate shared types from OpenAPI spec
   pnpm generate-types
   ```

## Usage

### Development Mode

#### Start All Applications
```bash
# Start both frontend and backend
pnpm dev
```

#### Start Individual Applications
```bash
# Frontend only (http://localhost:3000)
pnpm dev:web

# Backend only (http://localhost:8000)
pnpm dev:api
```

### Production Build

```bash
# Build all applications
pnpm build

# Build specific application
turbo build --filter=web
turbo build --filter=api
```

### Available Scripts

- `pnpm dev` - Start all applications in development mode
- `pnpm build` - Build all applications for production
- `pnpm test` - Run tests across all applications
- `pnpm lint` - Run linting across all applications
- `pnpm type-check` - Run TypeScript type checking
- `pnpm clean` - Clean build artifacts
- `pnpm generate-types` - Generate TypeScript types from OpenAPI spec
- `pnpm watch-types` - Watch for API changes and regenerate types

## Features

### Core Functionality

- ✅ **Modern Monorepo Architecture** with Turborepo
- ✅ **Type-safe API Integration** using Orval-generated clients
- ✅ **Role-based Access Control** for different user types
- ✅ **Assessment Management** with form validation and submission
- ✅ **Real-time Dashboard** with KPIs and progress tracking
- ✅ **Document Upload & Processing** with file validation
- ✅ **Report Generation** with export capabilities
- ✅ **Responsive Design** with Tailwind CSS and shadcn/ui
- ✅ **Hot Reloading** for both frontend and backend development
- ✅ **Database Migrations** with Alembic
- ✅ **Background Job Processing** with Celery and Redis

### User Roles

- **Admin**: Full system access, user management, system settings
- **BLGU**: Assessment submission, progress tracking, report viewing
- **Assessor**: Assessment evaluation and validation

## Configuration

### Environment Variables

#### Backend (`apps/api/.env`)
```env
#  VANTAGE API Environment Variables
# Copy this file to .env and fill in your actual values

# =============================================================================
#  APPLICATION SETTINGS  
# =============================================================================
DEBUG=true
ENVIRONMENT=development

# =============================================================================
#  SECURITY SETTINGS
# =============================================================================
SECRET_KEY=your-super-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080

# =============================================================================
#  SUPABASE CONFIGURATION
# =============================================================================
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=
```

#### Frontend (`apps/web/.env.local`)
```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_API_V1_URL=http://localhost:8000/api/v1
```

### Database Configuration

The application uses PostgreSQL with the following key tables:
- `users` - User accounts and authentication
- `barangays` - Barangay/LGU information
- `governance_areas` - Assessment area definitions
- `assessments` - Assessment submissions and data
- `reports` - Generated reports and analytics

### Monorepo Structure

```
vantage/
├── apps/
│   ├── web/              # NextJS frontend (TypeScript)
│   │   ├── src/
│   │   │   ├── app/      # App Router pages
│   │   │   ├── components/ # React components
│   │   │   ├── hooks/    # Custom React hooks
│   │   │   └── lib/      # Utilities and configurations
│   │   └── package.json
│   └── api/              # FastAPI backend (Python)
│       ├── app/
│       │   ├── api/      # API routes
│       │   ├── db/       # Database models and migrations
│       │   ├── schemas/  # Pydantic schemas
│       │   └── services/ # Business logic
│       └── pyproject.toml
├── packages/
│   └── shared/           # Shared types and utilities
│       └── src/generated/ # Auto-generated API client
├── docs/                 # Documentation and PRDs
├── tasks/               # Task lists and project management
└── scripts/             # Build and utility scripts
```

## Contributing

### Development Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow the established code structure
   - Write tests for new functionality
   - Update documentation as needed

3. **Run tests and linting**
   ```bash
   pnpm test
   pnpm lint
   pnpm type-check
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add new feature description"
   ```

5. **Push and create a Pull Request**
   ```bash
   git push origin feature/your-feature-name
   ```

### Code Standards

- **Frontend**: Follow NextJS App Router conventions, use TypeScript, implement proper error handling
- **Backend**: Follow FastAPI best practices, use Pydantic for validation, implement proper service layer pattern
- **Testing**: Write unit tests for business logic, integration tests for API endpoints
- **Documentation**: Update README and code comments for new features

## Tests

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests for specific app
turbo test --filter=web
turbo test --filter=api

# Run tests with verbose output
pnpm test -- -vv --log-cli-level=DEBUG
```

### Test Structure

#### Backend Tests (`apps/api/tests/`)
- Unit tests for services and business logic
- Integration tests for API endpoints
- Database migration tests
- Authentication and authorization tests

#### Frontend Tests (`apps/web/src/`)
- Component tests with React Testing Library
- Hook tests for custom React hooks
- Integration tests for user workflows
- API client tests

### Test Coverage

- Aim for >80% code coverage
- Test critical business logic thoroughly
- Include edge cases and error scenarios
- Mock external dependencies appropriately

## Deployment

### Production Build

```bash
# Build all applications
pnpm build

# Verify builds
turbo build --dry-run
```

### Environment Setup

1. **Configure production environment variables**
2. **Set up PostgreSQL database**
3. **Configure Redis for background jobs**
4. **Set up reverse proxy (nginx)**
5. **Configure SSL certificates**

### Docker Deployment (Optional)

```bash
# Build Docker images
docker build -t vantage-web apps/web
docker build -t vantage-api apps/api

# Run with docker-compose
docker-compose up -d
```

### Monitoring

- Set up application monitoring
- Configure logging aggregation
- Set up health check endpoints
- Monitor database performance

## Built With

### Frontend Technologies
- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[shadcn/ui](https://ui.shadcn.com/)** - Reusable component library
- **[TanStack Query](https://tanstack.com/query)** - Server state management
- **[Zustand](https://zustand-demo.pmnd.rs/)** - Client state management
- **[Lucide React](https://lucide.dev/)** - Icon library

### Backend Technologies
- **[FastAPI](https://fastapi.tiangolo.com/)** - Modern Python web framework
- **[SQLAlchemy](https://www.sqlalchemy.org/)** - Python ORM
- **[Alembic](https://alembic.sqlalchemy.org/)** - Database migration tool
- **[Pydantic](https://pydantic.dev/)** - Data validation and settings
- **[Celery](https://docs.celeryq.dev/)** - Distributed task queue
- **[Redis](https://redis.io/)** - Message broker and caching
- **[Passlib](https://passlib.readthedocs.io/)** - Password hashing
- **[python-jose](https://python-jose.readthedocs.io/)** - JWT implementation

### Development Tools
- **[Turborepo](https://turbo.build/repo)** - Monorepo build system
- **[pnpm](https://pnpm.io/)** - Fast, disk space efficient package manager
- **[uv](https://github.com/astral-sh/uv)** - Fast Python package manager
- **[Orval](https://orval.dev/)** - OpenAPI client generator
- **[Pytest](https://pytest.org/)** - Python testing framework
- **[Vitest](https://vitest.dev/)** - Fast unit test framework

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## Author/Contact

- **Project**: VANTAGE Governance Assessment Platform
- **Repository**: [Vantage](https://github.com/generyand/vantage)
- **Issues**: [Issues](https://github.com/generyand/vantage/issues)

For questions, suggestions, or contributions, please:
1. Check existing [Issues](https://github.com/generyand/vantage/issues)
2. Create a new issue with detailed description
3. Follow the contributing guidelines

## Acknowledgments

- **[Turborepo](https://turbo.build/repo)** for the excellent monorepo tooling
- **[Next.js](https://nextjs.org/)** team for the powerful React framework
- **[FastAPI](https://fastapi.tiangolo.com/)** for the modern Python web framework
- **[shadcn/ui](https://ui.shadcn.com/)** for the beautiful component library
- **[Tailwind CSS](https://tailwindcss.com/)** for the utility-first CSS approach
- **[Orval](https://orval.dev/)** for seamless API client generation
- The open-source community for the amazing tools and libraries that make this project possible
