# VANTAGE Application - Feature Roadmap

This document outlines the high-level feature epics for the development of the VANTAGE web application. Epics are listed in the general order of implementation.

## Phase 1: Core User Authentication & Management
**Status:** ✅ Completed  
**Description:** The foundational security layer. Includes user login/logout, a User Management dashboard for the MLGOO-DILG (CRUD operations), and a secure, role-based access control system. This is the gateway to all other features.

---

## Phase 2: The BLGU Pre-Assessment Workflow
**Status:** ✅ Completed  
**Description:** This epic focuses entirely on the BLGU user's journey. It's the core "data input" part of the application, where the initial self-assessment data is captured.

**Key Features:**
- A personalized BLGU dashboard showing their specific barangay's status.
- A multi-tabbed interface for navigating SGLGB Governance Areas.
- A dynamic, metadata-driven form for filling out the Self-Evaluation Document (SED).
- A fully functional MOV (Means of Verification) uploader.
- A "Submit for Review" function that sends the submission to the appropriate Area Assessor.

---

## Phase 3: The Assessor Validation & Rework Cycle
**Status:** Not Started  
**Description:** This epic builds the tools for the DILG Area Assessors. It covers both the initial review for the rework cycle and the final validation that occurs during the in-person Table Assessment.

**Key Features:**
- A "Submissions Queue" dashboard, firewalled to the Assessor's specific governance area.
- A validation UI for reviewing BLGU submissions against official Technical Notes.
- A feature to compile a single, consolidated rework request and send it back to the BLGU.
- Functionality to perform the final, authoritative validation clicks within the system during the Table Assessment.
- An Assessor-side MOV uploader to handle "pahabol" documents presented during the Table Validation.

---

## Phase 4: The Core Intelligence Layer
**Status:** Not Started  
**Description:** This epic implements the "smart" features that automate scoring and generate insights based on the final, validated data.

**Key Features:**
- **The Classification Algorithm:** A backend module that runs automatically after an Assessor performs the final validation in the system. It applies the "3+1" logic to the final, authoritative data to calculate the official SGLGB Compliance Status (pass/fail result).
- **Gemini API Integration:** A backend service that sends the finalized assessment results to the Google Gemini API to generate written recommendations and CapDev insights.

---

## Phase 5: High-Level Analytics & Reporting
**Status:** Not Started  
**Description:** This epic focuses on providing the MLGOO-DILG and other stakeholders with high-level data visualizations and reports.

**Key Features:**
- A comprehensive MLGOO-DILG dashboard with KPIs on municipal-wide performance.
- A dedicated "Reports" page with data visualizations.
- The "Gap Analysis" report, which compares the initial BLGU submission against the final validated data to identify common areas of correction and weakness.
- A UI component to cleanly display the AI-generated recommendations from Gemini.
- A secure, read-only data feed/API endpoint for the Katuparan Center and the UMDC Peace Center.

---

## Phase 6: Administrative Features (MLGOO-DILG)
**Status:** Not Started  
**Description:** A dedicated epic for high-level administrative functions required by the MLGOO-DILG to manage the system over time.

**Key Features:**
- Indicator Management: A CRUD interface for the MLGOO-DILG to add, edit, or deactivate SGLGB indicators to keep the system aligned with national standards.
- BBI Module: A simple workflow for BLGUs to submit BBI documents and for the MLGOO-DILG to review them directly.
- System settings for managing assessment cycles and deadlines.

---

## Phase 7: General UI Polish & Notifications
**Status:** Not Started  
**Description:** This is a cross-cutting epic that covers final polish and essential user experience features.

**Key Features:**
- A comprehensive email notification system for all key events (e.g., "Submission Received," "Rework Required").
- User profile pages for users to manage their own passwords.
- Full mobile responsiveness testing and refinement.
- Creation of a "Help & Support" section.

---

## VANTAGE Web Application: A Brief Summary

The SGLGB Strategic Analytics Web Application (VANTAGE) is a pre-assessment, preparation, and decision-support tool designed to address the high failure rate of barangays in the official Seal of Good Local Governance for Barangays (SGLGB) assessment. The application manages a complete digital workflow where Barangay Local Government Units (BLGUs) conduct a self-assessment by submitting a Self-Evaluation Document (SED) and uploading digital Means of Verification (MOVs).

This submission then enters a single, consolidated rework cycle, where a specialized DILG Area Assessor provides a comprehensive list of all deficiencies for the BLGU to correct and resubmit once. The application's unique value is in its support for a hybrid validation process: during the formal, in-person "Table Validation" meeting, the assessor uses VANTAGE as a live checklist to record the final, official compliance data.

At its core, VANTAGE features a classification algorithm that runs on this final, validated data to automatically apply the official "3+1" SGLGB logic and determine the official pass/fail result. The system also functions as a powerful gap analysis tool by comparing the initial BLGU submission against the final validated results. Finally, an integration with Google's Gemini API leverages these outcomes to generate actionable CapDev recommendations, providing DILG leadership with a sophisticated platform for data-driven governance.
