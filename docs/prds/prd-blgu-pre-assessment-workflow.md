# **PRD: The BLGU Pre-Assessment Workflow**

### **1. Introduction & Overview**

This document outlines the product requirements for **Epic 2: The BLGU Pre-Assessment Workflow**. This feature is the core "data input" component of the VANTAGE web application, focusing entirely on the experience of the Barangay Local Government Unit (BLGU) user.

The primary goal is to provide BLGU users with a clear, intuitive, and **dynamically generated interface** to conduct their SGLGB self-assessment, upload the necessary evidence (Means of Verification - MOVs), and submit their completed assessment for review. This workflow is the starting point for the entire assessment lifecycle.

### **2. Goals**

- **Provide a "Mission Control" Dashboard:** To give BLGU users a clear, at-a-glance summary of their assessment status and required actions.
- **Streamline Data Entry via a Dynamic UI:** To create an efficient, **metadata-driven interface** that automatically renders the correct input fields (e.g., Yes/No, Date, Numeric) for each unique SGLGB indicator.
- **Ensure Data Integrity:** To implement a robust MOV upload system with validation checks that prevent incomplete submissions.
- **Establish a Clear Workflow:** To define a locked submission process with clear status changes, guiding the user through the single, consolidated rework cycle.

### **3. User Stories**

- **As a BLGU user, I want to:**
  - See a personalized dashboard with my assessment status, a progress bar, and direct links to each governance area, so I can immediately understand what to do.
  - See a summary of assessor comments on my dashboard if my assessment "Needs Rework," so I can quickly find what to fix.
  - **Be presented with the correct set of input fields for each indicator (e.g., a Yes/No choice, a date picker, a number field), so I can provide accurate data for every type of question.**
  - Have the official "Technical Notes" visible for every indicator, so I have the necessary guidance to comply.
  - Upload multiple files (PDF, DOCX, etc.) of up to 10MB for any indicator, so I can provide all necessary evidence.
  - Be prevented from submitting if I have marked a compliance indicator as "Yes" but haven't uploaded a corresponding MOV.
  - Receive a clear confirmation after submission and see my dashboard status update to "Submitted for Review."
  - Be notified when my submission is sent back for rework and see exactly which indicators are flagged.

### **4. Functional Requirements**

#### **4.1. The BLGU Dashboard**

1.1. The dashboard must display a prominent visual progress bar indicating the number of indicators completed.
1.2. A large, clear status badge must be displayed, showing the current assessment status (`Not Started`, `In Progress`, `Submitted for Review`, `Needs Rework`, `Validated`).
1.3. The dashboard must feature a list of clickable links to navigate directly to each SGLGB Governance Area.
1.4. If the status is `Needs Rework`, the dashboard must display a section summarizing the assessor's comments.

#### **4.2. Assessment Interface (The "My Assessment" Page)**

2.1. The interface must be organized into tabs, each corresponding to a top-level **Governance Area**.
2.2. Within each tab, all corresponding **Indicators** must be listed in an accordion style.
2.3. **Dynamic Form Rendering:** For each indicator, the system must read its `form_schema` metadata from the API and dynamically render the appropriate input components. This includes support for:
_ **`YES_NO`:** A radio button group with `Yes` and `No` options.
_ **`NUMERIC`:** A number input field.
_ **`DATE`:** A date picker component.
_ **`TEXT`:** A text input field.
_ **`COMPOUND`:** A combination of multiple input fields within a single indicator.
_ **`MULTI_CHECKBOX`:** A list of checkboxes for sub-indicators.
2.4. Each indicator must display its official "Technical Notes" and the MOV Uploader component.

#### **4.3. MOV (Means of Verification) Uploader**

3.1. The uploader must restrict uploads to: **PDF, DOCX, XLSX, PNG, and JPG**.
3.2. A maximum file size limit of **10MB** per file must be enforced.
3.3. Multiple files must be allowed for a single indicator.
3.4. Uploaded files must appear in a list with a "delete" icon, which is only active before submission or during a rework phase.

#### **4.4. Submission Workflow**

4.1. A "Submit for Review" button must be present on the assessment page.
4.2. **Preliminary Compliance Check:** Upon clicking "Submit," the system must perform a validation check. If any indicator that requires an MOV (based on a "Yes" answer for `YES_NO` types) is missing one, the submission must be blocked, and the UI must highlight the incomplete indicators.
4.3. **Successful Submission:** If the check passes, a confirmation modal must appear, and the user will be redirected to their dashboard. The status must update to `Submitted for Review`.
4.4. **Locked State:** Once submitted, the entire "My Assessment" page becomes read-only for the BLGU user.

#### **4.5. Feedback and Rework Workflow**

5.1. When an assessment is sent back for rework, the BLGU user must be notified, and the dashboard status must change to `Needs Rework`.
5.2. The "My Assessment" page must become editable again, but **only for the specific indicators** flagged by the assessor.
5.3. The BLGU user can then update their answers, re-upload corrected MOVs, and resubmit. This rework cycle can only be performed **once**.

### **5. Non-Goals (Out of Scope)**

- The system will not save multiple draft versions of an assessment. It will only maintain the single, current state.
- A user-facing audit log or detailed history of changes is not required for this epic.
- The application will not support an offline mode for filling out forms.
- A feature for the BLGU user to unilaterally "un-submit" or recall their submission is not included.

### **6. Design & UX Considerations**

- The UI will be built using `shadcn/ui` components for consistency.
- The dashboard should be designed as a "mission control" center, prioritizing clarity and at-a-glance information.
- The use of visual aids like progress bars and color-coded status badges is highly encouraged.
- Error messages must be user-friendly and specific.
- The UI must clearly distinguish between locked (read-only) and editable states.

### **7. Technical Considerations**

- **Database Schema:** This epic requires the implementation and interaction of the following models:
  - `governance_indicators`: Must include the **`form_schema` (JSONB)** column to define the structure of each indicator's form.
  - `assessments`: To track the overall status (Enum).
  - `assessment_responses`: Must use a **`response_data` (JSONB)** column to flexibly store the structured data from the dynamic forms.
  - `movs` & `feedback_comments`: As previously defined.
- **Backend Logic:**
  - The main `GET` endpoint for the assessment must return the `form_schema` for each indicator.
  - The `PUT` endpoint for updating an indicator response must be able to handle and validate the flexible `JSONB` data structure based on the indicator's `form_schema`.
  - The Preliminary Compliance Check logic must be robust enough to handle the different indicator types.
- **File Storage:** All uploaded MOV files will be securely stored in **Supabase Storage**.

### **8. Success Metrics**

- BLGU users can successfully complete and submit their pre-assessment, accurately providing data for all different indicator types (Yes/No, Numeric, Date, etc.).
- The "Preliminary Compliance Check" successfully blocks all incomplete submissions.
- The end-to-end flow—from data entry, to submission, to rework, to resubmission—is functional and intuitive.
- A measurable reduction in the time it takes for a BLGU to complete their self-assessment compared to manual methods.

### **9. Open Questions**

- All initial clarifying questions for this epic have been addressed.
