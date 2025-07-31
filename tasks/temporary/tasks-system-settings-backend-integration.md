# System Settings Backend Integration Tasks

## Overview
This document outlines the backend tasks required to fully integrate the System Settings module with the VANTAGE API.

## Database Schema Tasks

### 1. Create Assessment Periods Table
**Priority:** High
**Status:** Pending

Create a new table `assessment_periods` with the following structure:
```sql
CREATE TABLE assessment_periods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    performance_year INTEGER NOT NULL,
    assessment_year INTEGER NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'upcoming', 'archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2. Create Assessment Period Deadlines Table
**Priority:** High
**Status:** Pending

Create a new table `assessment_period_deadlines` with the following structure:
```sql
CREATE TABLE assessment_period_deadlines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    period_id UUID NOT NULL REFERENCES assessment_periods(id) ON DELETE CASCADE,
    blgu_submission_deadline TIMESTAMP WITH TIME ZONE NOT NULL,
    rework_completion_deadline TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3. Add Assessment Period Reference to Existing Tables
**Priority:** Medium
**Status:** Pending

Update existing assessment-related tables to include `period_id` foreign key:
- `assessments` table (if exists)
- Any other assessment-related tables

## API Endpoints Tasks

### 1. Assessment Periods CRUD Endpoints
**Priority:** High
**Status:** Pending

Create the following endpoints in `apps/api/app/api/v1/system.py`:

#### GET /api/v1/system/assessment-periods
- List all assessment periods
- Support filtering by status
- Include pagination

#### POST /api/v1/system/assessment-periods
- Create new assessment period
- Validate that only one period can be active at a time
- Automatically generate assessment records for all barangays

#### PUT /api/v1/system/assessment-periods/{period_id}/activate
- Activate an assessment period
- Archive the currently active period
- Update all related records

#### PUT /api/v1/system/assessment-periods/{period_id}/archive
- Archive an assessment period
- Make all related assessments read-only

#### DELETE /api/v1/system/assessment-periods/{period_id}
- Delete an assessment period (only if status is 'upcoming')
- Delete all related assessment records

### 2. Assessment Period Deadlines Endpoints
**Priority:** High
**Status:** Pending

Create the following endpoints:

#### GET /api/v1/system/assessment-periods/{period_id}/deadlines
- Get deadlines for a specific period

#### PUT /api/v1/system/assessment-periods/{period_id}/deadlines
- Update deadlines for a specific period
- Validate that rework deadline is after submission deadline

## Pydantic Schemas Tasks

### 1. Create Assessment Period Schemas
**Priority:** High
**Status:** Pending

Create schemas in `apps/api/app/schemas/system.py`:

```python
class AssessmentPeriodBase(BaseModel):
    performance_year: int
    assessment_year: int

class AssessmentPeriodCreate(AssessmentPeriodBase):
    pass

class AssessmentPeriodUpdate(BaseModel):
    status: str

class AssessmentPeriod(AssessmentPeriodBase):
    id: str
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
```

### 2. Create Deadlines Schemas
**Priority:** High
**Status:** Pending

```python
class AssessmentPeriodDeadlinesBase(BaseModel):
    blgu_submission_deadline: datetime
    rework_completion_deadline: datetime

class AssessmentPeriodDeadlinesCreate(AssessmentPeriodDeadlinesBase):
    pass

class AssessmentPeriodDeadlinesUpdate(AssessmentPeriodDeadlinesBase):
    pass

class AssessmentPeriodDeadlines(AssessmentPeriodDeadlinesBase):
    id: str
    period_id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
```

## SQLAlchemy Models Tasks

### 1. Create Assessment Period Model
**Priority:** High
**Status:** Pending

Create model in `apps/api/app/db/models/system.py`:

```python
class AssessmentPeriod(Base):
    __tablename__ = "assessment_periods"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    performance_year = Column(Integer, nullable=False)
    assessment_year = Column(Integer, nullable=False)
    status = Column(String(20), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
```

### 2. Create Deadlines Model
**Priority:** High
**Status:** Pending

```python
class AssessmentPeriodDeadlines(Base):
    __tablename__ = "assessment_period_deadlines"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    period_id = Column(UUID(as_uuid=True), ForeignKey("assessment_periods.id"), nullable=False)
    blgu_submission_deadline = Column(DateTime(timezone=True), nullable=False)
    rework_completion_deadline = Column(DateTime(timezone=True), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
```

## Service Layer Tasks

### 1. Create System Settings Service
**Priority:** High
**Status:** Pending

Create `apps/api/app/services/system_settings_service.py` with methods:
- `create_assessment_period()`
- `get_assessment_periods()`
- `activate_assessment_period()`
- `archive_assessment_period()`
- `delete_assessment_period()`
- `get_deadlines()`
- `update_deadlines()`

### 2. Business Logic Implementation
**Priority:** High
**Status:** Pending

Implement critical business logic:
- Only one assessment period can be active at a time
- When activating a period, archive the current active period
- When creating a period, automatically generate assessment records for all barangays
- Validate deadline relationships (rework after submission)
- Prevent deletion of active or archived periods

## Security Tasks

### 1. Add Authorization Checks
**Priority:** High
**Status:** Pending

- Ensure only MLGOO-DILG users can access system settings endpoints
- Add role-based access control
- Implement audit logging for all system settings changes

## Testing Tasks

### 1. Unit Tests
**Priority:** Medium
**Status:** Pending

Create comprehensive tests for:
- Assessment period CRUD operations
- Deadline management
- Business logic validation
- Authorization checks

### 2. Integration Tests
**Priority:** Medium
**Status:** Pending

Test complete workflows:
- Creating and activating assessment periods
- Managing deadlines
- Error handling and edge cases

## Migration Tasks

### 1. Create Alembic Migration
**Priority:** High
**Status:** Pending

Generate and review migration for new tables:
```bash
cd apps/api
alembic revision --autogenerate -m "Add assessment periods and deadlines tables"
```

## Frontend Integration Tasks

### 1. Update API Client Generation
**Priority:** Medium
**Status:** Pending

After backend implementation:
1. Run `pnpm generate` to update TypeScript types
2. Update `useSystemSettings` hook to use real API calls
3. Remove mock data
4. Add proper error handling

### 2. Add Loading States
**Priority:** Low
**Status:** Pending

- Implement proper loading states for all operations
- Add optimistic updates where appropriate
- Handle network errors gracefully

## Documentation Tasks

### 1. API Documentation
**Priority:** Medium
**Status:** Pending

- Update OpenAPI documentation
- Add examples for all endpoints
- Document error responses

### 2. User Documentation
**Priority:** Low
**Status:** Pending

- Create user guide for system settings
- Document the assessment period lifecycle
- Explain deadline management

## Deployment Tasks

### 1. Database Migration
**Priority:** High
**Status:** Pending

- Plan migration strategy for production
- Ensure data integrity during migration
- Create rollback plan

### 2. Environment Configuration
**Priority:** Medium
**Status:** Pending

- Update environment variables if needed
- Configure proper logging for system settings
- Set up monitoring for critical operations

## Success Criteria

- [ ] All database tables created and migrated
- [ ] All API endpoints implemented and tested
- [ ] Frontend fully integrated with real API
- [ ] Authorization properly implemented
- [ ] Business logic validated and tested
- [ ] Documentation complete
- [ ] Production deployment successful

## Notes

- The frontend is currently using mock data and is ready for backend integration
- All UI components are implemented and follow the design specifications
- The system includes proper confirmation dialogs for high-stakes operations
- The module is designed to be accessible only to MLGOO-DILG users 