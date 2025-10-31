# Database Schema

> **TODO**: Document the complete database schema including:
> - Entity Relationship Diagram (ERD)
> - Core tables and their purposes
> - Relationships and foreign keys
> - Indexes and performance considerations
> - Enum types and constraints
> - Audit fields (created_at, updated_at, deleted_at)
> - Migration strategy

## Core Entities

### User Management
- `users` - User accounts (Admin, BLGU, Assessor roles)
- `roles` - Role definitions
- `permissions` - Permission system

### Assessment Workflow
- `barangays` - Barangay/LGU information
- `assessments` - Assessment submissions
- `governance_areas` - Assessment area definitions
- `indicators` - SGLGB indicators
- `assessment_responses` - User responses to indicators
- `movs` - Means of Verification uploads

### Intelligence Layer
- `classifications` - SGLGB classification results
- `insights` - AI-generated recommendations
- `gap_analyses` - Comparison between initial and final assessments

## Entity Relationships

```mermaid
# TODO: Create comprehensive ERD diagram
```

## Table Details

### users

> **TODO**: Document user table schema, fields, and constraints

### assessments

> **TODO**: Document assessment table schema and lifecycle

### Additional Tables

> **TODO**: Document remaining tables
