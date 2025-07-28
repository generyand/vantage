## Relevant Files

-   `apps/api/app/db/enums.py` - **Update** to include `AssessmentStatus` and the new `IndicatorResponseType` Enums.
-   `apps/api/app/db/models/governance_indicator.py` - **Modify** to include the `response_type` column.
-   `apps/api/app/db/models/assessment.py` - New SQLAlchemy model for the `assessments` table.
-   `apps/api/app/db/models/assessment_response.py` - **Modify** to use a `JSONB` column for flexible data storage.
-   `apps/api/app/db/models/mov.py` - New SQLAlchemy model for `movs` (Means of Verification).
-   `apps/api/app/db/models/feedback_comment.py` - New SQLAlchemy model for `feedback_comments`.
-   `apps/api/alembic/versions/` - A new Alembic migration file will be generated for these schema changes.
-   `apps/api/app/schemas/assessment.py` - **Update** Pydantic schemas to handle dynamic `response_data`.
-   `apps/api/app/services/assessment_service.py` - **Update** service logic to read from and write to the new `JSONB` field.
-   `apps/api/tests/api/v1/test_assessments.py` - Backend `pytest` tests for the new assessment API.
-   `apps/web/src/app/(app)/dashboard/page.tsx` - **Update** the main dashboard to route users based on role.
-   `apps/web/src/app/(app)/assessments/[assessmentId]/page.tsx` - The main page for the assessment interface.
-   `apps/web/src/components/features/assessments/` - Directory for all new assessment-related components.
-   `apps/web/src/components/features/assessments/inputs/` - **New Directory** to hold the various dynamic input components (Numeric, Date, etc.).
-   `apps/web/src/hooks/useAssessment.ts` - New custom hooks for fetching and mutating assessment data.
-   `packages/shared/` - This package will be updated by running the `generate` script after backend changes.

### Notes on Testing

-   **Backend Testing:** Unit tests are in `apps/api/tests/`. Run them via `uv run pytest`.
-   **Frontend Testing:** Unit tests are co-located with components. Run them via `pnpm --filter web test`.

## Tasks

-   [ ] 1.0 **Backend: Evolve Database for Dynamic Indicators**
    -   [ ] 1.1 In `apps/api/app/db/enums.py`, create a new string-based `IndicatorResponseType` Enum with values: `YES_NO`, `NUMERIC`, `DATE`, `TEXT`.
    -   [ ] 1.2 Also in `enums.py`, create the string-based `AssessmentStatus` Enum with values: `IN_PROGRESS`, `SUBMITTED`, `NEEDS_REWORK`, `VALIDATED`.
    -   [ ] 1.3 In `apps/api/app/db/models/governance_indicator.py`, add a new column `response_type` that uses the `Enum(IndicatorResponseType)` and set a default value (e.g., `YES_NO`).
    -   [ ] 1.4 In `apps/api/app/db/models/`, create `assessment.py`. The `Assessment` model must include a `status` field using the `Enum(AssessmentStatus)`, a `rework_count` integer field (defaulting to 0), and foreign keys to `barangays` and `users`.
    -   [ ] 1.5 In `apps/api/app/db/models/`, create `assessment_response.py`. The model must:
        -   [ ] 1.5.1 Link to `assessments` and `governance_indicators`.
        -   [ ] 1.5.2 Include a `response_data` column with a data type of `JSONB` (from `sqlalchemy.dialects.postgresql`).
        -   [ ] 1.5.3 Include a boolean `is_flagged_for_rework` field, defaulting to `False`.
    -   [ ] 1.6 Create `mov.py` and `feedback_comment.py` models as originally planned, linking them correctly to the new `assessment_response` model.
    -   [ ] 1.7 Run `uv run alembic revision --autogenerate -m "Add dynamic indicator support and assessment models"` to create the migration.
    -   [ ] 1.8 **Critically review the generated migration script.** Autogenerate may need help with `JSONB` or Enum changes. Manually adjust if necessary.
    -   [ ] 1.9 Update the database seeding script for `governance_indicators` to populate the `response_type` for each indicator.
    -   [ ] 1.10 Apply the migration using `uv run alembic upgrade head`.

-   [ ] 2.0 **Backend: Update Services and API for Flexible Data**
    -   [ ] 2.1 In `apps/api/app/schemas/assessment.py`, update `AssessmentResponseUpdate` to accept a flexible `response_data: dict`. Update `AssessmentResponseRead` to expose it.
    -   [ ] 2.2 In `apps/api/app/services/assessment_service.py`, refactor `update_indicator_response` to correctly serialize the incoming dictionary into the `response_data` `JSONB` field.
    -   [ ] 2.3 In `get_assessment_for_user`, ensure the query joins with `governance_indicators` so that the `response_type` for each indicator is returned with the assessment data.
    -   [ ] 2.4 Implement the other service functions (`add_mov_to_response`, `delete_mov`, `submit_assessment_for_review`), ensuring they are compatible with the new structure.
    -   [ ] 2.5 Ensure the `submit_assessment_for_review` service function correctly increments the `rework_count` if the status was `NEEDS_REWORK`.
    -   [ ] 2.6 Implement the `send_for_rework` service function, which must check that `rework_count` is zero before flagging responses and changing the status.
    -   [ ] 2.7 In `apps/api/app/api/v1/assessments.py`, implement the planned RESTful endpoints, ensuring the `PUT` endpoint for responses correctly handles the flexible JSON payload.
    -   [ ] 2.8 Write comprehensive `pytest` tests covering the new `JSONB` data structures, validation for different response types, and the rework cycle logic.

-   [ ] 3.0 **Frontend: BLGU Dashboard Page**
    -   [ ] 3.1 In the main dashboard page (`apps/web/src/app/(app)/dashboard/page.tsx`), add logic to check the user's role from the auth store and render a specific `BLGUDashboard` component.
    -   [ ] 3.2 Create the `useAssessment` hook to fetch data using the auto-generated `useGetAssessmentsMy-assessment` query hook.
    -   [ ] 3.3 Build the `AssessmentStatusBadge`, `ProgressSummary`, and `GovernanceAreaLinks` components as planned.
    -   [ ] 3.4 Build the `NotificationHandler` component to display a prominent banner or alert on the dashboard if the assessment status is `NEEDS_REWORK`.
    -   [ ] 3.5 Build the `ReworkComments` component to display assessor feedback.

-   [ ] 4.0 **Frontend: Build Dynamic Assessment Interface**
    -   [ ] 4.1 Create the main assessment page (`/assessments/[assessmentId]/page.tsx`) and the main `GovernanceAreaTabs` component.
    -   [ ] 4.2 Create the new directory: `apps/web/src/components/features/assessments/inputs/`.
        -   [ ] 4.2.1 Create `YesNoInput.tsx`.
        -   [ ] 4.2.2 Create `NumericInput.tsx`.
        -   [ ] 4.2.3 Create `DateInput.tsx`.
        -   [ ] 4.2.4 Create `TextInput.tsx`.
    -   [ ] 4.3 Refactor the `IndicatorAccordion.tsx` to act as a dynamic renderer.
        -   [ ] 4.3.1 It must accept the full indicator object, including `response_type` and `response_data`, as a prop.
        -   [ ] 4.3.2 It must use a component map or switch statement based on `response_type` to render the correct component from the `inputs` directory.
        -   [ ] 4.3.3 It must pass down the relevant part of the `response_data` JSON to the specific input component.
    -   [ ] 4.4 In each specific input component (e.g., `DateInput.tsx`):
        -   [ ] 4.4.1 Manage its own state.
        -   [ ] 4.4.2 On change, call the `usePutAssessmentResponsesResponseId` mutation hook with the correctly formatted JSON payload (e.g., `{"value": "2024-01-01"}`).
    -   [ ] 4.5 Display the read-only "Technical Notes" and any assessor feedback within each `IndicatorAccordion` item.
    -   [ ] 4.6 Implement the read-only logic, disabling form controls based on the overall assessment status and the `is_flagged_for_rework` field on each indicator.

-   [ ] 5.0 **Frontend: MOV Uploader and Submission Logic**
    -   [ ] 5.1 Build the `MovUploader` component with client-side validation for file types and size.
    -   [ ] 5.2 The uploader must call the `usePostAssessmentResponsesResponseIdMovs` mutation hook on file drop.
    -   [ ] 5.3 Display the list of uploaded files with a delete button that calls the `useDeleteMovsMovId` mutation hook.
    -   [ ] 5.4 On the main assessment page, implement the client-side "Preliminary Compliance Check" logic. This check must now be more robust, ensuring the `response_data` is not null for "Yes" answers, not just that an MOV exists.
    -   [ ] 5.5 The "Submit" button should call the `usePostAssessmentsAssessmentIdSubmit` mutation hook, showing a confirmation on success.
    -   [ ] 5.6 Ensure MOV upload/delete functionality is correctly enabled/disabled based on the assessment status and rework flags.

-   [ ] 6.0 **Finalization & Integration**
    -   [ ] 6.1 After all backend changes are complete and migrated, run `pnpm generate-types` to update the shared package.
    -   [ ] 6.2 Conduct a full, manual end-to-end test, ensuring to test indicators with **each of the four different response types**.
    -   [ ] 6.3 Write frontend unit tests for the new dynamic input components (`YesNoInput`, `NumericInput`, etc.).
    -   [ ] 6.4 Verify all new components and pages are fully responsive on mobile devices.