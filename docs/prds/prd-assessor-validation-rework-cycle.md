# PRD: The Assessor Validation & Rework Cycle

### 1. Introduction & Overview

This document outlines the product requirements for **Epic 3: The Assessor Validation & Rework Cycle**. This feature set builds the complete toolkit for the DILG Area Assessors, who are the primary validators within the VANTAGE ecosystem.

This epic covers two critical phases of the assessor's workflow:
1.  **The Pre-Assessment Review:** The initial digital review of a BLGU's submission, culminating in a single, consolidated rework request if deficiencies are found.
2.  **The Final Table Validation:** The use of the VANTAGE application as a "live checklist" during the formal, in-person meeting to record the final, authoritative compliance data.

The goal is to provide assessors with a focused, efficient, and powerful interface to ensure the integrity of the SGLGB assessment data.

### 2. Goals

*   **Focused Workspace:** To provide each Area Assessor with a dashboard that is strictly firewalled to their specific governance area, preventing information overload and unauthorized access.
*   **Efficient Validation:** To create a UI that allows for rapid review of BLGU submissions and their corresponding MOVs against the official Technical Notes, supported by in-app document previews.
*   **Structured Feedback:** To formalize the "one-time, big-time" rework process by enabling assessors to compile a single, comprehensive list of all findings.
*   **Support for Hybrid Workflow:** To equip the assessor with the tools needed to use VANTAGE as the official system of record during the in-person Table Validation, including the ability to upload last-minute documents.

### 3. User Stories

*   **As an Area Assessor, I want to:**
    *   Log in and see a dashboard that *only* shows me the barangay submissions for my specific area of expertise (e.g., Environmental Management).
    *   Open a barangay's submission and see their self-assessed answers and a clear, clickable list of their uploaded MOVs.
    *   Preview a PDF or image MOV directly within the application without needing to download it.
    *   View the official DILG "Technical Notes" for an indicator directly alongside the BLGU's submission, so I don't have to cross-reference external documents.
    *   Mark an indicator as "Pass," "Fail," or "Conditional" and write a clear, specific comment explaining my finding.
    *   Leave a private "Internal Note" on an indicator that is only visible to other DILG users.
    *   Compile all of my findings for a single barangay into one consolidated "rework request" and send it back to them in a single action.
    *   During the in-person Table Validation meeting, I want to use the system to record the final pass/fail status for each indicator.
    *   If a barangay presents a new or corrected document during the Table Validation, I want to be able to upload it on their behalf directly into the system.
    *   Save my validation progress as a "draft" during a long Table Validation meeting, so I can pause my work and resume later without losing my comments or selections.

### 4. Functional Requirements

#### 4.1. Assessor's Submissions Queue Module
1.1. Upon login, the system shall redirect the Area Assessor to a dashboard or queue page.
1.2. This page must display a list of barangay submissions. The default view must show submissions with a status of `Submitted for Review`.
1.3. **Queue Filtering:** The assessor must be able to filter the queue via tabs or a dropdown to view submissions in other states, specifically `Needs Rework` and `Validated`.
1.4. **Access Firewall:** The queue must be strictly filtered to show only the submissions relevant to the assessor's assigned `assessor_area`. An Environmental Assessor must never see submissions for the Financial area.
1.5. Each item in the queue should display the Barangay Name, Submission Date, Status, and a "Last Updated" timestamp, with a clear "Review" button.

#### 4.2. Validation Module
2.1. The validation interface must display the BLGU's submission (answers and MOVs) in a read-only format on one side, and the assessor's interactive controls on the other.
2.2. For each indicator, the system must display the corresponding official **Technical Notes** from the database to guide the assessor.
2.3. The assessor must have interactive controls (e.g., radio buttons) to set the validation status of each indicator to `Pass`, `Fail`, or `Conditional`.
2.4. **Conditional Status Logic:**
    *   If an assessor selects `Conditional`, the associated comment field becomes **mandatory**.
    *   The `Conditional` status signifies a minor issue to be resolved during the in-person Table Validation (e.g., "Confirm signature on original document").
    *   A `Conditional` status does **not** trigger the formal rework cycle.
2.5. **MOV Previewer:** The interface must provide an in-app modal viewer for PDF and image files. Clicking on these file types should open a preview, not a download dialog. Other file types (e.g., DOCX, XLSX) can default to a download link.
2.6. A text area must be provided for the assessor to write specific findings and comments for each indicator. This comment is visible to the BLGU user if a rework is issued.
2.7. **Internal Notes:** A separate, clearly labeled text area for **"Internal Notes (DILG Only)"** must be provided for each indicator. Content in this field must never be visible to BLGU users.
2.8. **Assessor-Side MOV Uploader:** The validation interface must include a file uploader that allows the assessor to upload a document on behalf of the barangay. This uploaded file must be clearly marked in the system as "Uploaded by Assessor."
2.9. **Draft Mode:** The assessor must be able to "Save as Draft" to save their progress on validation and comments without finalizing the assessment or sending a rework request.

#### 4.3. Rework Workflow Module
3.1. The assessor's interface must have a "Compile and Send for Rework" button.
3.2. This action must be disabled until the assessor has reviewed all indicators.
3.3. When triggered, the system shall gather all comments and flagged indicators into a single, consolidated rework request.
3.4. The system shall change the overall assessment status to `Needs Rework` and send a notification to the corresponding BLGU user.
3.5. The system must enforce the "one-time" rule: the "Send for Rework" action can only be performed if the assessment's `rework_count` is 0.
3.6. **Post-Rework Handling:** If a BLGU's resubmission after rework is still deficient, the assessor will **not** send it for a second rework. They will mark the relevant indicators as `Fail`, finalize the pre-assessment, and address the final failure during the in-person Table Validation.

#### 4.4. Assessment Finalization Module
4.1. After a submission has been reviewed (and potentially reworked), the assessor's interface must have a "Finalize Validation" button.
4.2. This action will change the overall assessment status to `Validated` and permanently lock the assessment data from any further edits by both the BLGU and the Area Assessor.
4.3. This "Validated" status is the trigger for the system to run the core Classification Algorithm.

### 5. Non-Goals (Out of Scope for this Epic)

*   The UI for the BLGU user to *receive* and *act on* the rework request (this is part of Epic 2).
*   The execution of the Classification Algorithm itself (this is Epic 4).
*   The MLGOO-DILG's high-level analytics dashboards (this is Epic 5).

### 6. Design & UX Considerations

*   The two-column validation UI is critical for efficiency. It must be designed to minimize scrolling and clicks.
*   The in-app MOV previewer should be a modal to avoid navigating away from the validation screen.
*   The distinction between a "Rework Comment" (visible to BLGU) and an "Internal Note" (DILG only) must be visually clear and unambiguous.
*   The firewalled nature of the dashboard must be absolute. The UI should not even load data for other governance areas.
*   The "Save as Draft" vs. "Finalize Validation" actions must be clearly differentiated to prevent user error.

### 7. Technical Considerations

*   **API Endpoints:** New, protected endpoints are required:
    *   `GET /api/v1/assessor/queue`: Fetches the assessor's personalized queue, filtered by their `assessor_area` on the backend.
    *   `POST /api/v1/assessment-responses/{id}/validate`: An endpoint for the assessor to submit their validation status, comments, and internal notes.
    *   `POST /api/v1/assessments/{id}/rework`: An endpoint to trigger the "send for rework" workflow.
    *   `POST /api/v1/assessments/{id}/finalize`: An endpoint to trigger the final validation lock.
*   **Database:** The `feedback_comments` table will need to be modified. It should include a new boolean field like `is_internal_note` to distinguish between feedback for the BLGU and private notes for DILG personnel. The service logic must correctly manage the `status` and `rework_count` fields in the `assessments` table.
*   **Permissions:** The security dependencies in FastAPI must be enhanced to check not only the user's `role` but also their `assessor_area` before granting access to specific data.
*   **Frontend:** A robust component for previewing PDFs and images will need to be implemented or integrated.

### 8. Success Metrics

*   An Area Assessor can successfully log in, view their queue, review a submission, and send a consolidated rework request.
*   The rework request correctly notifies the BLGU and unlocks the appropriate sections for editing.
*   An Area Assessor can successfully perform the final validation within the system, which correctly locks the assessment and triggers the next stage of the workflow.
*   100% of data access is correctly firewalled based on the assessor's assigned governance area.
*   Assessors report a significant reduction in time spent downloading and managing MOV files locally.
