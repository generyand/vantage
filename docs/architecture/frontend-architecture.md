# Frontend Architecture

> **TODO**: Document Next.js frontend architecture including:
> - App Router structure and conventions
> - Server Components vs Client Components strategy
> - Component organization (features/, shared/, ui/)
> - State management with Zustand
> - Data fetching with TanStack Query
> - API client integration (@vantage/shared)
> - Authentication flow and protected routes
> - Form handling and validation
> - Styling approach (Tailwind, shadcn/ui)
> - Error boundaries and error handling

## Directory Structure

```
apps/web/
├── src/
│   ├── app/             # App Router pages and layouts
│   │   ├── (app)/       # Authenticated pages
│   │   └── (auth)/      # Public pages
│   ├── components/      # React components
│   │   ├── features/    # Domain-specific components
│   │   ├── shared/      # Reusable components
│   │   └── ui/          # shadcn/ui components
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utilities and configurations
│   ├── providers/       # React context providers
│   └── store/           # Zustand stores
└── public/              # Static assets
```

## Component Patterns

> **TODO**: Document component architecture patterns, naming conventions, and best practices

## Data Flow

> **TODO**: Document how data flows from API → hooks → components → UI

## Routing Strategy

> **TODO**: Document App Router usage, route groups, and navigation patterns
