## PRD Traceability Matrix

This matrix maps each functional requirement from the PRD to the corresponding Epic in this task list.

- **FR 4.1** (Assessor's Submissions Queue Module) → **Epic 1.0**
- **FR 4.2** (Validation Module) → **Epic 2.0**
- **FR 4.3** (Rework Workflow Module) → **Epic 3.0**
- **FR 4.4** (Assessment Finalization Module) → **Epic 3.0**

## Relevant Files

- `apps/api/alembic/versions/xxxx_add_is_internal_note_to_feedback.py`
- `apps/api/app/db/models/assessment.py`
- `apps/api/app/api/deps.py`
- `apps/api/app/api/v1/assessor.py`
- `apps/api/app/schemas/assessor.py`
- `apps/api/app/services/assessor_service.py`
- `apps/web/src/app/(app)/assessor/dashboard/page.tsx`
- `apps/web/src/app/(app)/assessor/submissions/[id]/page.tsx`
- `apps/web/src/components/features/assessor/SubmissionsQueue.tsx`
- `apps/web/src/components/features/assessor/ValidationControls.tsx`
- `apps/web/src/components/shared/FilePreviewerModal.tsx`
- `apps/web/src/hooks/useAssessor.ts`

### Testing Notes

- **Backend Testing:** Place Pytest tests in `apps/api/tests/`. Test services and API endpoints separately. Run with `pytest -vv --log-cli-level=DEBUG`.
- **Frontend Testing:** Place test files alongside components (`.test.tsx`). Use Vitest and React Testing Library.
- **Type Safety:** Import auto-generated types from `@vantage/shared` to ensure frontend and backend are in sync.
- **Run Tests:** Use `pnpm test` from the root, which will run tests for all workspaces.

## Tasks

### Three-Tier Structure: Epic → Story → Atomic

- [ ] **1.0 Epic: Assessor Dashboard & Secure Queue** *(FR 4.1)*
  - [ ] **1.1 Story: Backend API for Secure Queue**
    - [ ] **1.1.1 Atomic:** Enhance FastAPI security dependency to enforce `assessor_area` firewall.
      - **Files:** `apps/api/app/api/deps.py`
      - **Dependencies:** None.
      - **Acceptance:** A new dependency function is created that verifies the authenticated user has the `Assessor` role and fetches their `assessor_area`. This dependency will be used to protect all assessor-specific endpoints.
      - **Tech:** FastAPI Dependency Injection.
    - [ ] **1.1.2 Atomic:** Create `GET /api/v1/assessor/queue` endpoint.
      - **Files:** `apps/api/app/api/v1/assessor.py` (new file), `apps/api/app/services/assessor_service.py` (new file), `apps/api/app/schemas/assessor.py` (new file).
      - **Dependencies:** Security dependency (1.1.1).
      - **Acceptance:** The endpoint, protected by the new dependency, returns a list of submissions strictly filtered by the assessor's `assessor_area`. The response includes Barangay Name, Submission Date, Status, and Last Updated timestamp, matching a new Pydantic schema.
      - **Tech:** FastAPI, SQLAlchemy, Pydantic.
  - [ ] **1.2 Story: Frontend Assessor Dashboard UI**
    - [ ] **1.2.1 Atomic:** Create the Assessor Dashboard page and submissions queue component.
      - **Files:** `apps/web/src/app/(app)/assessor/dashboard/page.tsx`, `apps/web/src/components/features/assessor/SubmissionsQueue.tsx`.
      - **Dependencies:** None.
      - **Acceptance:** The page renders the `SubmissionsQueue` component, which uses `shadcn/ui` `Table` and `Tabs` to display the queue. The tabs allow filtering by status (`Submitted for Review`, `Needs Rework`, `Validated`). Each row has a "Review" button that links to the validation page.
      - **Tech:** Next.js App Router, shadcn/ui (`Table`, `Tabs`, `Button`).
    - [ ] **1.2.2 Atomic:** Create custom hook to fetch and manage assessor queue data.
      - **Files:** `apps/web/src/hooks/useAssessor.ts` (new file).
      - **Dependencies:** Backend API (1.1.2), Orval client generation must be run.
      - **Acceptance:** The `useAssessor` hook uses TanStack Query's `useQuery` to fetch data from the `/api/v1/assessor/queue` endpoint via the generated Orval client. It provides loading, error, and data states to the `SubmissionsQueue` component.
      - **Tech:** TanStack Query, Orval, Axios.
- [ ] **2.0 Epic: Interactive Assessment Validation Interface** *(FR 4.2)*
  - [ ] **2.1 Story: Database Schema for Internal Notes**
    - [ ] **2.1.1 Atomic:** Create Alembic migration to add `is_internal_note` to `feedback_comments` table.
      - **Files:** `apps/api/alembic/versions/xxxx_add_is_internal_note_to_feedback.py`, `apps/api/app/db/models/assessment.py`.
      - **Dependencies:** None.
      - **Acceptance:** The migration successfully adds a `is_internal_note` boolean column (defaulting to `False`) to the `feedback_comments` table. The SQLAlchemy model is updated to reflect this change.
      - **Tech:** Alembic, SQLAlchemy.
  - [ ] **2.2 Story: Backend API for Validation Actions**
    - [ ] **2.2.1 Atomic:** Create `POST /api/v1/assessment-responses/{id}/validate` endpoint.
      - **Files:** `apps/api/app/api/v1/assessor.py`, `apps/api/app/services/assessor_service.py`, `apps/api/app/schemas/assessor.py`.
      - **Dependencies:** DB Schema (2.1.1).
      - **Acceptance:** The endpoint accepts a payload containing the validation status (`Pass`, `Fail`, `Conditional`), a public comment, and an internal note. The service logic saves both comments to the `feedback_comments` table, setting `is_internal_note` to `True` for the internal note.
      - **Tech:** FastAPI, Pydantic, SQLAlchemy.
    - [ ] **2.2.2 Atomic:** Implement assessor-side MOV uploader endpoint.
      - **Files:** `apps/api/app/api/v1/assessor.py`, `apps/api/app/services/assessor_service.py`.
      - **Dependencies:** None.
      - **Acceptance:** A new endpoint `POST /api/v1/assessment-responses/{id}/upload-mov` accepts a file, saves it, and associates it with the assessment. The file metadata must indicate it was "Uploaded by Assessor".
      - **Tech:** FastAPI `UploadFile`.
    - [ ] **2.2.3 Atomic:** Create `GET /api/v1/assessments/{id}/technical-notes` endpoint.
      - **Files:** `apps/api/app/api/v1/assessor.py`, `apps/api/app/services/assessor_service.py`.
      - **Dependencies:** None.
      - **Acceptance:** The endpoint returns the official Technical Notes for all indicators within a specific assessment. This allows the frontend to display guidance to the assessor.
      - **Tech:** FastAPI, SQLAlchemy.
  - [ ] **2.3 Story: Frontend Validation View & Controls**
    - [ ] **2.3.1 Atomic:** Build the main validation page and its two-column layout.
      - **Files:** `apps/web/src/app/(app)/assessor/submissions/[id]/page.tsx`.
      - **Dependencies:** Backend API for fetching submission data must exist.
      - **Acceptance:** The page fetches the specific assessment data and displays the BLGU's submission in a read-only view on the left, and the interactive controls on the right.
      - **Tech:** Next.js App Router, TanStack Query.
    - [ ] **2.3.2 Atomic:** Create the interactive `ValidationControls` component.
      - **Files:** `apps/web/src/components/features/assessor/ValidationControls.tsx`.
      - **Dependencies:** None.
      - **Acceptance:** The component renders controls for each indicator: `RadioGroup` for status, `Textarea` for public comments, and a separate `Textarea` for internal notes. The public comment field is mandatory if status is `Conditional`.
      - **Tech:** React, shadcn/ui (`RadioGroup`, `Textarea`, `Label`).
    - [ ] **2.3.3 Atomic:** Implement "Save as Draft" functionality.
      - **Files:** `apps/web/src/hooks/useAssessor.ts`.
      - **Dependencies:** Backend API (2.2.1), Orval client updated.
      - **Acceptance:** A new `useMutation` hook is added to `useAssessor.ts` that calls the `validate` endpoint. The "Save as Draft" button on the validation page triggers this mutation.
      - **Tech:** TanStack Query `useMutation`.
    - [ ] **2.3.4 Atomic:** Fetch and display Technical Notes in the validation view.
      - **Files:** `apps/web/src/hooks/useAssessor.ts`, `apps/web/src/components/features/assessor/ValidationControls.tsx`.
      - **Dependencies:** Backend API (2.2.3), Orval client updated.
      - **Acceptance:** The `useAssessor` hook is updated to fetch technical notes. The `ValidationControls` component is modified to display the relevant technical note for each indicator, perhaps in a `Tooltip` or an `Accordion` from `shadcn/ui`.
      - **Tech:** TanStack Query, shadcn/ui (`Tooltip` or `Accordion`).
    - [ ] **2.3.5 Atomic:** Implement the assessor-side MOV uploader UI.
      - **Files:** `apps/web/src/components/features/assessor/ValidationControls.tsx`, `apps/web/src/hooks/useAssessor.ts`.
      - **Dependencies:** Backend API (2.2.2), Orval client updated.
      - **Acceptance:** A `FileUploader` component is added to the validation controls for each indicator. A new `useMutation` hook in `useAssessor.ts` is created to handle the upload logic, calling the endpoint from task 2.2.2.
      - **Tech:** `FileUploader` component, TanStack Query `useMutation`.
  - [ ] **2.4 Story: Frontend MOV Previewer Component**
    - [ ] **2.4.1 Atomic:** Create a shared `FilePreviewerModal` component.
      - **Files:** `apps/web/src/components/shared/FilePreviewerModal.tsx`.
      - **Dependencies:** None.
      - **Acceptance:** The component, using `shadcn/ui` `Dialog`, accepts a file URL. It renders PDF and image files in-app (e.g., using `react-pdf` or an `<iframe>`/`<img>` tag). For other file types, it displays a "Download File" link.
      - **Tech:** shadcn/ui `Dialog`, potentially a library like `react-pdf`.
- [ ] **3.0 Epic: Rework & Finalization Workflow** *(FR 4.3, 4.4)*
  - [ ] **3.1 Story: Backend API for Rework & Finalization**
    - [ ] **3.1.1 Atomic:** Create `POST /api/v1/assessments/{id}/rework` endpoint and trigger notification.
      - **Files:** `apps/api/app/api/v1/assessor.py`, `apps/api/app/services/assessor_service.py`, `apps/api/app/workers/notifications.py` (new file).
      - **Dependencies:** Celery worker setup (3.3.1).
      - **Acceptance:** The endpoint changes the assessment status to `Needs Rework` and triggers a Celery background task to handle sending the notification. It fails with a 403 error if the assessment's `rework_count` is not 0.
      - **Tech:** FastAPI, SQLAlchemy, Celery.
    - [ ] **3.1.2 Atomic:** Create `POST /api/v1/assessments/{id}/finalize` endpoint.
      - **Files:** `apps/api/app/api/v1/assessor.py`, `apps/api/app/services/assessor_service.py`.
      - **Dependencies:** None.
      - **Acceptance:** The endpoint changes the assessment status to `Validated`, permanently locking the assessment from further edits by either the BLGU or the Assessor.
      - **Tech:** FastAPI, SQLAlchemy.
  - [ ] **3.2 Story: Frontend Controls for Rework & Finalization**
    - [ ] **3.2.1 Atomic:** Add workflow buttons and their controlling logic to the validation page.
      - **Files:** `apps/web/src/app/(app)/assessor/submissions/[id]/page.tsx`.
      - **Dependencies:** None.
      - **Acceptance:** "Compile and Send for Rework" and "Finalize Validation" buttons are added. The rework button is disabled until every indicator has been reviewed (status set). They are clearly styled as primary actions.
      - **Tech:** React state management (`useState`).
    - [ ] **3.2.2 Atomic:** Create mutations for rework and finalization actions.
      - **Files:** `apps/web/src/hooks/useAssessor.ts`.
      - **Dependencies:** Backend API (3.1.1, 3.1.2), Orval client updated.
      - **Acceptance:** Two new `useMutation` hooks are added to `useAssessor.ts` for the `rework` and `finalize` endpoints. The buttons trigger these mutations, show loading states, and display success/error notifications using `sonner`. On success, the user is redirected to the dashboard.
      - **Tech:** TanStack Query `useMutation`, `sonner` for notifications, Next.js `useRouter`.
  - [ ] **3.3 Story: Background Notification Worker**
    - [ ] **3.3.1 Atomic:** Implement Celery task for sending rework notifications.
      - **Files:** `apps/api/app/workers/notifications.py` (new file).
      - **Dependencies:** Celery infrastructure must be configured.
      - **Acceptance:** A Celery task is created that takes an assessment ID, retrieves the necessary BLGU user details, and handles the logic for sending a notification (e.g., logging it for now, with email integration to come later).
      - **Tech:** Celery, Redis.
