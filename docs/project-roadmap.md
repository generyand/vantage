### **VANTAGE Application Feature Epics**

#### **Phase 1: Core User Authentication & Management**
*   **Status:** In Progress
*   **Description:** The foundational security layer. Includes user login/logout, a User Management dashboard for the Supervisor (CRUD operations), and a secure, role-based access control system. This is the gateway to all other features.

---

#### **Phase 2: The BLGU Pre-Assessment Workflow**
*   **Status:** Not Started
*   **Description:** This epic focuses entirely on the BLGU user's journey. It's the core "data input" part of the application.
*   **Key Features:**
    *   A personalized BLGU dashboard showing their specific barangay's status.
    *   A multi-tabbed interface for navigating the SGLGB Governance Areas.
    *   A dynamic form/accordion for filling out the Self-Evaluation Document (SED) for each indicator.
    *   A fully functional MOV (Means of Verification) uploader that links files to specific indicators.
    *   A "Submit for Review" function that changes the assessment status and locks the submission from further edits by the BLGU.

---

#### **Phase 3: The Assessor Validation & Rework Workflow**
*   **Status:** Not Started
*   **Description:** This epic builds the tools for the DILG Area Assessors to perform their validation tasks. This is the "human review" part of the application.
*   **Key Features:**
    *   A "Submissions Queue" dashboard for Assessors, showing only the submissions relevant to their specific governance area.
    *   A two-column "Validation UI" for comparing the BLGU's submission and MOVs against the official Technical Notes.
    *   Functionality for the Assessor to mark indicators as "Pass," "Fail," or "Conditional."
    *   A feature to add comments and findings for each indicator.
    *   A "Send for Rework" function that compiles all findings into a single request and notifies the BLGU.
    *   A "Finalize Validation" function that locks the assessment from further changes by the Assessor.

---

#### **Phase 4: The Core Intelligence Layer**
*   **Status:** Not Started
*   **Description:** This epic implements the "smart" features that provide the core analytical value of VANTAGE.
*   **Key Features:**
    *   **The Classification Algorithm:** A backend module that runs automatically after an Assessor finalizes their validation. It applies the "3+1" logic to the validated data to calculate the official `pre_assessment_result`.
    *   **The Supervisor Confirmation Module:** A dedicated UI for the MLGOO-DILG to input the final, official result from the offline Table Validation, enabling the cross-matching feature.
    *   **Gemini API Integration:** A backend service that sends the finalized assessment data to the Google Gemini API and processes the response to generate written recommendations and CapDev insights.

---

#### **Phase 5: High-Level Analytics & Reporting**
*   **Status:** Not Started
*   **Description:** This epic focuses on providing the DILG Supervisor and other stakeholders with high-level data visualizations and reports.
*   **Key Features:**
    *   A comprehensive Supervisor dashboard with KPIs on municipal-wide performance.
    *   A dedicated "Reports" page with data visualizations (charts, graphs).
    *   The "Cross-Matching/Gap Analysis" report, which compares the `pre_assessment_result` against the `official_assessment_result`.
    *   A UI component to cleanly display the AI-generated recommendations from Gemini.
    *   Functionality to export reports to PDF or CSV.
    *   The secure data feed/API endpoint for the UMDC Paranayan Center.

---

#### **Phase 6: General UI Polish & Notifications**
*   **Status:** Not Started
*   **Description:** This is a cross-cutting epic that covers final polish and essential user experience features.
*   **Key Features:**
    *   A comprehensive notification system (email, and potentially in-app) for all key events (e.g., "Submission Received," "Rework Required," "Assessment Finalized").
    *   User profile pages for users to manage their own passwords.
    *   Full mobile responsiveness testing and refinement for all user roles.
    *   Accessibility (a11y) review and improvements.
    *   Creation of a "Help & Support" section or user guide.
