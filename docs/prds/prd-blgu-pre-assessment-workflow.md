# **PRD: The BLGU Pre-Assessment Workflow**

### **1. Introduction & Overview**

This document outlines the product requirements for **Epic 2: The BLGU Pre-Assessment Workflow**. This feature is the core "data input" component of the VANTAGE web application, focusing entirely on the experience of the Barangay Local Government Unit (BLGU) user.

The primary goal is to provide BLGU users with a clear, intuitive, and guided interface to conduct their SGLGB self-assessment, upload the necessary evidence (Means of Verification - MOVs), and submit their completed assessment for review by a DILG Area Assessor. This workflow is the starting point for the entire assessment and validation lifecycle.

### **2. Goals**

*   **Provide a "Mission Control" Dashboard:** To give BLGU users a clear, at-a-glance summary of their assessment status, progress, and any required actions.
*   **Streamline Data Entry:** To create an efficient and user-friendly interface for navigating governance areas and filling out the Self-Evaluation Document (SED) for each indicator.
*   **Ensure Data Integrity:** To implement a robust MOV upload system with validation checks that prevent incomplete submissions and ensure data quality.
*   **Establish a Clear Workflow:** To define a locked submission process that provides clear status changes and guides the user through the pre-assessment lifecycle, including rework loops.

### **3. User Stories**

*   **As a BLGU user, I want to:**
    *   See a personalized dashboard with a progress bar, a clear status badge (e.g., "In Progress," "Needs Rework"), and direct links to each governance area, so I can immediately understand my assessment's status and navigate easily.
    *   See a summary of the latest assessor comments on my dashboard if my assessment "Needs Rework," so I know exactly what to address first.
    *   Answer a simple "Yes/No/N/A" for each indicator and have the official "Technical Notes" visible within the same view, so I can perform my self-assessment accurately and efficiently.
    *   Upload multiple files (PDF, DOCX, XLSX, PNG, JPG) of up to 10MB for a single indicator, so I can provide all the necessary evidence required.
    *   See a list of my uploaded files for an indicator and be able to delete them before submission, so I can manage my evidence effectively.
    *   Be prevented from submitting my assessment if I have marked an indicator as "Yes" but haven't uploaded a corresponding MOV, so I can avoid making simple mistakes.
    *   Receive a clear confirmation message after a successful submission and see my dashboard status change to "Submitted for Review," so I have confidence that my work has been received.
    *   Be able to view my submitted assessment in a read-only state, so I can review my work without the risk of making accidental changes.
    *   Be notified when my submission is sent back for rework and see exactly which indicators need my attention.

### **4. Functional Requirements**

#### **4.1. The BLGU Dashboard**
1.1. The dashboard must display a prominent visual progress bar indicating the number of indicators completed out of the total (e.g., "75 / 120 Indicators Compliant").
1.2. A large, clear status badge must be displayed, showing the current state of the assessment. The statuses include: `Not Started`, `In Progress`, `Submitted for Review`, `Needs Rework`, and `Validated`.
1.3. The dashboard must feature a list of clickable links or cards that allow the user to navigate directly to each of the SGLGB Governance Areas.
1.4. If the assessment status is `Needs Rework`, the dashboard must display a section summarizing the most recent comments from the assessor.

#### **4.2. Assessment Interface (The "My Assessment" Page)**
2.1. The interface must be organized into tabs, with each tab corresponding to a top-level **Governance Area**.
2.2. Within each Governance Area tab, all corresponding **Indicators** must be listed, preferably in an accordion style.
2.3. Each indicator item must contain:
    2.3.1. A simple radio button group for the user's self-assessment with three options: `Yes`, `No`, `N/A`.
    2.3.2. A non-editable text area displaying the official "Technical Notes" for that indicator, providing direct guidance to the user.
    2.3.3. The MOV Uploader component (see section 4.3).
    2.3.4. A read-only section to display assessor feedback if the assessment status is `Needs Rework`.

#### **4.3. MOV (Means of Verification) Uploader**
3.1. The file uploader must restrict uploads to the following file types: **PDF, DOCX, XLSX, PNG, and JPG**.
3.2. The system must enforce a maximum file size limit of **10MB** per file. An error message must be shown if a user attempts to upload a larger file.
3.3. The system must allow multiple files to be uploaded for a single indicator.
3.4. After a file is successfully uploaded, it must appear in a list below the uploader.
3.5. Each item in the list must display the full filename and a "delete" icon.
3.6. Clicking the "delete" icon must remove the file from the assessment. This action must only be possible before the assessment is submitted or when it is in a `Needs Rework` state.

#### **4.4. Submission Workflow**
4.1. A "Submit for Review" button must be present on the assessment page.
4.2. **Preliminary Compliance Check:** Upon clicking "Submit for Review," the system must perform a validation check.
    4.2.1. If any indicator is marked `Yes` but has no associated MOV file uploaded, the submission must be blocked.
    4.2.2. The UI must clearly highlight the specific indicators that failed the check, guiding the user to the incomplete sections.
4.3. **Successful Submission:** If the compliance check passes, a confirmation modal dialog must appear.
4.4. After the user closes the confirmation modal, they must be automatically redirected to their BLGU dashboard, where the status has been updated to `Submitted for Review`.
4.5. **Locked State:** Once submitted, the entire "My Assessment" page becomes read-only for the BLGU user. All form controls and upload/delete buttons must be disabled.

#### **4.5. Feedback and Rework Workflow**
5.1. When an assessor sends an assessment back for rework, the BLGU user must receive a notification.
5.2. The assessment status on the dashboard must change to `Needs Rework`.
5.3. The "My Assessment" page must become editable again, but only for the specific indicators that the assessor has flagged.
5.4. The system must clearly display the assessor's comments for each flagged indicator.
5.5. The BLGU user can then re-upload corrected MOVs and resubmit the assessment, which then returns to the `Submitted for Review` status. This rework cycle can only be performed **once**.

### **5. Non-Goals (Out of Scope)**

*   The system will not save multiple draft versions of an assessment. It will only maintain the single, current state.
*   A user-facing audit log or detailed history of changes is not required for this epic.
*   The application will not support an offline mode for filling out forms.
*   A feature for the BLGU user to unilaterally "un-submit" or recall their submission is not included.

### **6. Design & UX Considerations**

*   The UI will be built using `shadcn/ui` components for consistency.
*   The dashboard should be designed as a "mission control" center, prioritizing clarity and at-a-glance information.
*   The use of visual aids like progress bars and color-coded status badges is highly encouraged.
*   Error messages must be user-friendly and specific.
*   The UI must clearly distinguish between locked (read-only) and editable states.

### **7. Technical Considerations**

*   **Database Schema:** This epic will require the implementation and interaction of the following database models, as defined in our official data dictionary:
    *   `assessments`: To track the overall status (`Not Started`, `In Progress`, `Submitted for Review`, etc.) for a specific barangay and assessment period.
    *   `assessment_responses`: To store the `Yes/No/N/A` answer for each indicator.
    *   `movs`: To store metadata about uploaded files (filename, storage path, associated response).
    *   `feedback_comments`: To store the remarks from the assessor, linked to a specific `assessment_response`.
*   **Backend Logic:**
    *   The backend must implement the server-side validation logic for file types, file sizes, and the Preliminary Compliance Check.
    *   API endpoints are needed for creating/updating assessment responses, and for uploading/deleting MOV files.
    *   The API must manage the state transitions of an assessment (e.g., from `In Progress` to `Submitted for Review`).
*   **File Storage:** All uploaded MOV files will be securely stored in **Supabase Storage**. The backend API will manage the upload and retrieval of these files via the `supabase-py` client library.

### **8. Success Metrics**

*   BLGU users can successfully complete and submit their pre-assessment with a high task completion rate.
*   The "Preliminary Compliance Check" successfully blocks 100% of submissions where an indicator is marked "Yes" but is missing an MOV.
*   The end-to-end flow—from starting the form, to submitting, to receiving a rework request, to resubmitting—is functional and intuitive.
*   A measurable reduction in the time it takes for a BLGU to complete their self-assessment compared to previous manual methods.

### **9. Open Questions**

*   All initial clarifying questions for this epic have been addressed.