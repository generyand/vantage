# Changelog

All notable changes to the VANTAGE project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Comprehensive documentation structure with organized sections (getting-started, architecture, api, guides, workflows, troubleshooting)
- Archive directory for historical development context
- Docker development journey documentation chronicling all Docker issues and solutions
- documentation-specialist agent for future documentation work

### Changed
- Consolidated Docker troubleshooting from 8 separate files into organized guides
- Reorganized documentation into clear, maintainable structure

## [0.4.0] - 2025-10-28

### Added
- **Epic 4.0**: Gemini API integration for AI-powered insights and recommendations
- Core intelligence layer with SGLGB classification algorithm ("3+1" logic)
- Celery background processing for insights generation
- Gap analysis comparing initial vs final assessments

### Fixed
- ReportsPage safe rendering for assessments with improved type handling
- Docker authentication issues with bcrypt
- TypeScript and ESLint errors for successful build

### Changed
- Enhanced local Docker support

## [0.3.0] - 2025-10-19

### Added
- **Epic 3**: Assessor validation workflow
- Assessment rework and finalization endpoints
- Validation workflow for assessors
- PRD and task list for Assessor workflow

### Changed
- Enhanced assessment models for assessor workflow
- Renamed and reorganized MOV and UserUpdatedAt interfaces

## [0.2.0] - 2025-10-12

### Added
- **Epic 2**: BLGU Dashboard & Assessment UI (with mock data)
- **Epic 3**: Dynamic forms & MOV upload functionality
- Assessment dashboard endpoint with comprehensive data aggregation
- Assessment progress metrics and governance area summaries
- Sample indicators creation in assessment service

### Changed
- Updated BLGU branding to VANTAGE throughout application
- Assessment hooks now utilize API data instead of mock implementations
- Enhanced assessment service with improved error handling

### Fixed
- MOVStatus import path in generated types
- Build configuration for Vercel deployment

## [0.1.0] - 2025-08-18

### Added
- **Epic 1**: Core user authentication and management
- Initial BLGU pre-assessment workflow foundation
- FastAPI backend with SQLAlchemy ORM
- Next.js 15 frontend with App Router
- Turborepo monorepo structure
- Type generation workflow with Orval
- PostgreSQL database via Supabase
- Redis and Celery for background tasks
- Docker development environment

### Changed
- Initial project architecture and structure

---

## Changelog Maintenance

See [Maintaining the Changelog](./docs/guides/maintaining-changelog.md) for guidelines on updating this file.

To add an entry, use: `/changelog add`

---

## Version History Guidelines

### Version Numbers

We follow [Semantic Versioning](https://semver.org/):
- **MAJOR** version (X.0.0): Incompatible API changes
- **MINOR** version (0.X.0): New features (backward compatible)
- **PATCH** version (0.0.X): Bug fixes (backward compatible)

### Change Categories

- **Added**: New features
- **Changed**: Changes in existing functionality
- **Deprecated**: Soon-to-be removed features
- **Removed**: Removed features
- **Fixed**: Bug fixes
- **Security**: Security vulnerability fixes

### Unreleased Section

The `[Unreleased]` section tracks changes that are committed but not yet released. When creating a new release:

1. Rename `[Unreleased]` to the new version number with date: `[X.Y.Z] - YYYY-MM-DD`
2. Create a new `[Unreleased]` section at the top
3. Tag the commit: `git tag -a vX.Y.Z -m "Version X.Y.Z"`
4. Push tags: `git push origin vX.Y.Z`

---

## Links

- [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
- [Semantic Versioning](https://semver.org/spec/v2.0.0.html)
- [Conventional Commits](https://www.conventionalcommits.org/)
