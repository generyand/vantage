# Tasks: Core Intelligence Layer

## PRD Traceability Matrix

This matrix maps each functional requirement from the PRD to the corresponding Epic in this task list.

- **FR 4.1** (Database Schema Changes) → **Epic 1.0**
- **FR 4.2** (Classification Algorithm) → **Epic 2.0**
- **FR 4.3** (Display of Compliance Status) → **Epic 3.0**
- **FR 4.4** (Gemini API Integration) → **Epic 4.0**
- **FR 4.5** (API Endpoints) → **Epic 2.0, 4.0**

## Relevant Files

### Backend Files

- `apps/api/app/db/enums.py` - Add ComplianceStatus enum
- `apps/api/app/db/models/assessment.py` - Add new columns to Assessment model
- `apps/api/alembic/versions/` - Database migration
- `apps/api/app/services/intelligence_service.py` - New intelligence service
- `apps/api/app/workers/intelligence_worker.py` - New Celery worker for background processing
- `apps/api/app/api/v1/assessments.py` - New API endpoints
- `apps/api/app/core/config.py` - Environment variables for Gemini API

### Frontend Files

- `apps/web/src/app/(app)/reports/page.tsx` - Display compliance badges
- `apps/web/src/components/features/reports/ComplianceBadge.tsx` - New component
- `apps/web/src/components/features/reports/AreaResultsDisplay.tsx` - New component
- `apps/web/src/components/features/reports/InsightsGenerator.tsx` - New component
- `apps/web/src/components/features/reports/AIInsightsDisplay.tsx` - New component
- `apps/web/src/hooks/useIntelligence.ts` - New hook for intelligence operations

### Testing Notes

- **Backend Testing:** Place Pytest tests in `apps/api/tests/`. Test the classification algorithm with various pass/fail combinations. Run with `pytest -vv --log-cli-level=DEBUG`.
- **Frontend Testing:** Place test files alongside components (`.test.tsx`). Use Vitest and React Testing Library.
- **API Integration Testing:** Mock Gemini API calls in tests. Include tests for timeout and error scenarios.
- **Type Safety:** Ensure all new database enums and fields are reflected in the generated OpenAPI spec and TypeScript types.

## Tasks

### Three-Tier Structure: Epic → Story → Atomic

---

- [ ] **1.0 Epic: Database Schema Extension for Intelligence Layer** _(FR 4.1)_

  - [ ] **1.1 Story: Add ComplianceStatus Enum**

    - [ ] **1.1.1 Atomic:** Add `ComplianceStatus` enum to `apps/api/app/db/enums.py`
      - **Files:** `apps/api/app/db/enums.py`
      - **Dependencies:** None
      - **Acceptance:** New enum `ComplianceStatus` exists with values `PASSED` and `FAILED`

  - [ ] **1.2 Story: Extend Assessment Model**

    - [ ] **1.2.1 Atomic:** Add `final_compliance_status`, `area_results`, and `ai_recommendations` columns to Assessment model
      - **Files:** `apps/api/app/db/models/assessment.py`
      - **Dependencies:** 1.1.1
      - **Acceptance:** Assessment model has three new nullable fields with appropriate types

  - [ ] **1.3 Story: Create Database Migration**

    - [ ] **1.3.1 Atomic:** Generate Alembic migration for new Assessment columns

      - **Files:** `apps/api/alembic/versions/xxxxx_add_intelligence_fields_to_assessments.py`
      - **Dependencies:** 1.2.1
      - **Acceptance:** Migration file created with correct column definitions
      - **Commands:** `cd apps/api && alembic revision --autogenerate -m "Add intelligence fields to assessments"`

    - [ ] **1.3.2 Atomic:** Review and test migration script
      - **Files:** Migration file from 1.3.1
      - **Dependencies:** 1.3.1
      - **Acceptance:** Migration upgrades and downgrades without errors
      - **Commands:** Test both `alembic upgrade head` and `alembic downgrade -1`

---

- [ ] **2.0 Epic: Classification Algorithm Implementation** _(FR 4.2, 4.5)_

  - [ ] **2.1 Story: Query Validation Data**

    - [ ] **2.1.1 Atomic:** Create method to fetch all assessment_responses for an assessment filtered by validation_status

      - **Files:** `apps/api/app/services/intelligence_service.py`
      - **Dependencies:** 1.2.1
      - **Acceptance:** Method returns all responses with `validation_status` of `Pass`, grouped by governance area

    - [ ] **2.1.2 Atomic:** Create method to identify which governance areas have passed (all indicators must pass)
      - **Files:** `apps/api/app/services/intelligence_service.py`
      - **Dependencies:** 2.1.1
      - **Acceptance:** Method returns dictionary mapping area name to pass/fail status

  - [ ] **2.2 Story: Implement "3+1" Rule Logic**

    - [ ] **2.2.1 Atomic:** Implement logic to determine if all three Core areas have passed

      - **Files:** `apps/api/app/services/intelligence_service.py`
      - **Dependencies:** 2.1.2
      - **Acceptance:** Method correctly identifies if all Core areas (Financial, Disaster Prep, Safety/Peace/Order) have passed

    - [ ] **2.2.2 Atomic:** Implement logic to determine if at least one Essential area has passed

      - **Files:** `apps/api/app/services/intelligence_service.py`
      - **Dependencies:** 2.1.2
      - **Acceptance:** Method correctly identifies if at least one Essential area has passed

    - [ ] **2.2.3 Atomic:** Implement overall compliance determination using "3+1" rule
      - **Files:** `apps/api/app/services/intelligence_service.py`
      - **Dependencies:** 2.2.1, 2.2.2
      - **Acceptance:** Returns `PASSED` if all Core areas pass AND at least one Essential area passes; otherwise returns `FAILED`

  - [ ] **2.3 Story: Store Classification Results**

    - [ ] **2.3.1 Atomic:** Create method to save final_compliance_status and area_results to database
      - **Files:** `apps/api/app/services/intelligence_service.py`
      - **Dependencies:** 2.2.3, 1.2.1
      - **Acceptance:** Method updates assessment record with compliance status and area results JSONB

  - [ ] **2.4 Story: Integrate into Finalization Process**

    - [ ] **2.4.1 Atomic:** Automatically trigger classification algorithm when assessment is finalized

      - **Files:** `apps/api/app/services/assessor_service.py`, `apps/api/app/services/intelligence_service.py`
      - **Dependencies:** 2.3.1
      - **Acceptance:** When "Finalize Validation" is called, classification algorithm runs and stores results

    - [ ] **2.4.2 Atomic:** Create API endpoint for manual classification (for testing)
      - **Files:** `apps/api/app/api/v1/assessments.py`
      - **Dependencies:** 2.3.1
      - **Acceptance:** `POST /api/v1/assessments/{id}/classify` endpoint exists and requires authentication

  - [ ] **2.5 Story: Unit Tests for Classification Logic**
    - [ ] **2.5.1 Atomic:** Create test cases covering all possible "3+1" combinations
      - **Files:** `apps/api/tests/test_classification_algorithm.py`
      - **Dependencies:** 2.2.3
      - **Acceptance:** Tests verify 100% of possible pass/fail combinations across all 6 areas

---

- [ ] **3.0 Epic: Display Compliance Status** _(FR 4.3)_

  - [ ] **3.1 Story: MLGOO Dashboard Compliance Badge**

    - [ ] **3.1.1 Atomic:** Create ComplianceBadge component with PASSED/FAILED states

      - **Files:** `apps/web/src/components/features/reports/ComplianceBadge.tsx`
      - **Dependencies:** None
      - **Acceptance:** Component renders styled badge with appropriate colors (green for PASSED, red for FAILED)

    - [ ] **3.1.2 Atomic:** Update MLGOO dashboard to display compliance badge next to barangay name

      - **Files:** `apps/web/src/app/(app)/reports/page.tsx`
      - **Dependencies:** 3.1.1
      - **Acceptance:** Dashboard shows compliance badge for each assessment in the list

    - [ ] **3.1.3 Atomic:** Make compliance badge clickable to navigate to detailed report
      - **Files:** `apps/web/src/components/features/reports/ComplianceBadge.tsx`
      - **Dependencies:** 3.1.1
      - **Acceptance:** Clicking badge navigates to detailed assessment report page

  - [ ] **3.2 Story: Area Results Display**

    - [ ] **3.2.1 Atomic:** Create AreaResultsDisplay component to show individual area statuses

      - **Files:** `apps/web/src/components/features/reports/AreaResultsDisplay.tsx`
      - **Dependencies:** None
      - **Acceptance:** Component displays area results in readable format (table or grid with icons)

    - [ ] **3.2.2 Atomic:** Add AreaResultsDisplay to detailed report page
      - **Files:** `apps/web/src/app/(app)/reports/[id]/page.tsx` (may need to create)
      - **Dependencies:** 3.2.1
      - **Acceptance:** Detailed report page shows area-by-area compliance breakdown

---

- [ ] **4.0 Epic: Gemini API Integration** _(FR 4.4, 4.5)_

  - [ ] **4.1 Story: Gemini Service Setup**

    - [ ] **4.1.1 Atomic:** Add Gemini API key to configuration

      - **Files:** `apps/api/app/core/config.py`
      - **Dependencies:** None
      - **Acceptance:** New setting `GEMINI_API_KEY` exists and reads from environment variable

    - [ ] **4.1.2 Atomic:** Install Google AI Python SDK
      - **Files:** `apps/api/pyproject.toml`
      - **Dependencies:** None
      - **Acceptance:** `google-generativeai` package is added to dependencies
      - **Command:** `cd apps/api && uv add google-generativeai`

  - [ ] **4.2 Story: Build Gemini Prompt**

    - [ ] **4.2.1 Atomic:** Create method to build structured prompt from failed indicators
      - **Files:** `apps/api/app/services/intelligence_service.py`
      - **Dependencies:** 4.1.1
      - **Acceptance:** Method creates comprehensive prompt with barangay name, year, failed indicators, and assessor comments

  - [ ] **4.3 Story: Call Gemini API**

    - [ ] **4.3.1 Atomic:** Implement method to call Gemini API and parse response

      - **Files:** `apps/api/app/services/intelligence_service.py`
      - **Dependencies:** 4.1.2, 4.2.1
      - **Acceptance:** Method successfully calls API and returns parsed JSON with `summary`, `recommendations`, and `capacity_development_needs` keys

    - [ ] **4.3.2 Atomic:** Implement error handling for API failures and timeouts

      - **Files:** `apps/api/app/services/intelligence_service.py`
      - **Dependencies:** 4.3.1
      - **Acceptance:** Method catches exceptions and returns appropriate error messages

    - [ ] **4.3.3 Atomic:** Implement caching logic (check if ai_recommendations already exists)
      - **Files:** `apps/api/app/services/intelligence_service.py`
      - **Dependencies:** 4.3.1
      - **Acceptance:** Method checks database first and only calls API if recommendations don't exist

  - [ ] **4.4 Story: Store and Retrieve Recommendations**

    - [ ] **4.4.1 Atomic:** Create method to save Gemini response to ai_recommendations column
      - **Files:** `apps/api/app/services/intelligence_service.py`
      - **Dependencies:** 4.3.1, 1.2.1
      - **Acceptance:** Method stores JSON response in database

  - [ ] **4.5 Story: API Endpoint for Insights Generation**

    - [ ] **4.5.1 Atomic:** Create API endpoint `POST /api/v1/assessments/{id}/generate-insights` that dispatches a Celery task
      - **Files:** `apps/api/app/api/v1/assessments.py`
      - **Dependencies:** 4.8.1
      - **Acceptance:** Endpoint requires authentication, validates assessment status, dispatches Celery task using `generate_insights_task.delay(assessment_id)`, and immediately returns `202 Accepted` HTTP status

  - [ ] **4.6 Story: Frontend Insights Generator**

    - [ ] **4.6.1 Atomic:** Create InsightsGenerator component with "Generate AI-Powered Insights" button

      - **Files:** `apps/web/src/components/features/reports/InsightsGenerator.tsx`
      - **Dependencies:** None
      - **Acceptance:** Component displays button that is enabled only when assessment is validated

    - [ ] **4.6.2 Atomic:** Create API hook for generating insights with polling support
      - **Files:** `apps/web/src/hooks/useIntelligence.ts`
      - **Dependencies:** 4.5.1
      - **Acceptance:** Hook provides `generateInsights` function that expects 202 Accepted response, initiates polling every 5 seconds using a query refetch mechanism to check for ai_recommendations field, automatically stops polling when data appears

  - [ ] **4.7 Story: Display AI Insights**

    - [ ] **4.7.1 Atomic:** Create AIInsightsDisplay component to render Gemini response

      - **Files:** `apps/web/src/components/features/reports/AIInsightsDisplay.tsx`
      - **Dependencies:** None
      - **Acceptance:** Component displays summary, recommendations list, and capacity development needs

    - [ ] **4.7.2 Atomic:** Integrate AIInsightsDisplay into report page with loading and error states
      - **Files:** `apps/web/src/app/(app)/reports/[id]/page.tsx`
      - **Dependencies:** 4.6.1, 4.6.2, 4.7.1
      - **Acceptance:** Report page shows persistent "Generating..." state during polling, displays insights when ready, shows error message on failure

  - [ ] **4.8 Story: Background Worker for Insight Generation**

    - [ ] **4.8.1 Atomic:** Create Celery task `generate_insights_task` that calls intelligence_service and saves results

      - **Files:** `apps/api/app/workers/intelligence_worker.py` (new file)
      - **Dependencies:** 4.3.1, 4.4.1
      - **Acceptance:** Celery task accepts assessment_id, calls Gemini API via intelligence_service, handles errors/retries, and saves to ai_recommendations column

    - [ ] **4.8.2 Atomic:** Register Celery task with decorator and implement error handling with retries
      - **Files:** `apps/api/app/workers/intelligence_worker.py`
      - **Dependencies:** 4.8.1
      - **Acceptance:** Task has retry logic (max 3 attempts with exponential backoff) and logs errors appropriately

  - [ ] **4.9 Story: Testing Gemini Integration**

    - [ ] **4.9.1 Atomic:** Create unit tests for Gemini prompt building

      - **Files:** `apps/api/tests/test_gemini_prompt.py`
      - **Dependencies:** 4.2.1
      - **Acceptance:** Tests verify prompt structure and content

    - [ ] **4.9.2 Atomic:** Create integration tests for Gemini API calls (mocked)

      - **Files:** `apps/api/tests/test_gemini_service.py`
      - **Dependencies:** 4.3.1
      - **Acceptance:** Tests verify API call, response parsing, and caching logic

    - [ ] **4.9.3 Atomic:** Create tests for Celery background task

      - **Files:** `apps/api/tests/test_intelligence_worker.py`
      - **Dependencies:** 4.8.1, 4.8.2
      - **Acceptance:** Tests verify task dispatch, execution, error handling, and retry logic

    - [ ] **4.9.4 Atomic:** Create frontend tests for InsightsGenerator component and polling behavior
      - **Files:** `apps/web/src/components/features/reports/InsightsGenerator.test.tsx`
      - **Dependencies:** 4.6.1, 4.6.2
      - **Acceptance:** Tests verify button states, polling logic, and error handling

---

## Implementation Notes

### Critical Implementation Order

1. **Implement Epic 1.0 first** (Database schema changes must be deployed before any intelligence features are built)
2. **Implement Epic 2.0 second** (Classification algorithm is prerequisite for Epic 4.0)
3. **Implement Epic 3.0 third** (Display features depend on Epic 2.0 data)
4. **Implement Epic 4.0 last** (Gemini integration consumes output from Epic 2.0)

### Key Considerations

- **Performance:** The classification algorithm must complete in under 5 seconds to ensure real-time user experience
- **Asynchronous Processing:** The Gemini API integration uses Celery background tasks for resilience. The API endpoint dispatches a task and immediately returns `202 Accepted`, while the frontend polls for results.
- **Cost Management:** Always check if `ai_recommendations` exists before calling Gemini API to avoid duplicate API calls
- **Error Handling:** Both classification and Gemini integration must handle failures gracefully without breaking the user workflow. Celery tasks include retry logic (max 3 attempts with exponential backoff).
- **User Experience:** The frontend must provide persistent "Generating..." feedback during polling, allowing users to navigate away and return later to see results.
- **Testing:** Create comprehensive test coverage for the "3+1" logic to verify 100% accuracy across all possible combinations. Include tests for Celery task dispatch and polling behavior.
- **Type Safety:** Ensure all database changes are reflected in the OpenAPI spec and regenerated TypeScript types using `pnpm generate`

### Environment Variables Required

Add to `.env` file in `apps/api/`:

```bash
GEMINI_API_KEY=your_gemini_api_key_here
```
