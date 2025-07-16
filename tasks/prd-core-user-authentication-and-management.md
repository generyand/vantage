# PRD: Core User Authentication & Management

## 1. Introduction & Overview

This document outlines the requirements for the **Core User Authentication & Management** feature for the VANTAGE web application. This is the foundational security and access control layer, enabling secure user login and providing administrators with the tools to manage user accounts, roles, and permissions. As the primary gateway to the application, its successful implementation is a prerequisite for all other features.

The goal is to create a secure, closed authentication system where users are managed internally by a designated administrator (the MLGOO-DILG Supervisor).

## 2. Goals

*   **Secure Access:** To ensure that only registered and authenticated users can access the application's internal pages.
*   **Role-Based Dashboards:** To redirect users to a specific, role-based dashboard immediately after a successful login.
*   **Administrative Control:** To provide Supervisors with a comprehensive interface to manage the lifecycle of user accounts.
*   **System Integrity:** To establish a robust security posture by implementing JWT-based authentication and protecting all API endpoints.

## 3. User Stories

**As a user (BLGU, Assessor, Supervisor), I want to:**
*   See a clean and professional login page.
*   Securely log in using my email address and password.
*   Be redirected to my specific role-based dashboard upon successful login.
    *   **BLGU User:** Sees a dashboard focused on their single assigned barangay, highlighting pre-assessment status and action items.
    *   **Assessor:** Sees a dashboard with a queue of submissions awaiting review across all barangays in their area of responsibility.
*   Be shown a clear, generic error message if my login credentials are incorrect.
*   Be prevented from accessing any internal pages if I am not logged in.
*   Securely log out of the system, terminating my session.

**As the MLGOO-DILG (Supervisor), I want to:**
*   Access a "User Management" page from my dashboard.
*   View a table of all registered users in the system.
*   Create new user accounts.
*   When creating a user, I must be able to assign them a specific, predefined role (e.g., "BLGU User," "Area Assessor - Environmental").
*   If I assign the "BLGU User" role, I must also be able to link that user to a specific barangay from a predefined list.
*   Edit the details (name, role, assigned barangay) of an existing user.
*   Activate or deactivate a user account to grant or revoke their access.

## 4. Functional Requirements

1.  **Login & Authentication**
    1.1. The system must present a login page at a public route (e.g., `/login`).
    1.2. Users must be able to input their email and password.
    1.3. Upon submission, the system will validate credentials against the `users` table.
    1.4. On successful validation, the system will generate a signed JWT and return it to the client.
    1.5. On failed validation, the system must display a generic error message (e.g., "Invalid credentials, please try again").
    1.6. The client application must store the JWT and use it for all subsequent API requests.
    1.7. All application routes, except for the login page, must be protected. Unauthenticated users attempting to access them must be redirected to the login page.
    1.8. A "Logout" function must be available, which will clear the user's session data from the client and redirect them to the login page.
    1.9. When a Supervisor creates a new user account, they must set a temporary password. The user must be prompted to change this temporary password upon their first successful login.

2.  **User Management (Supervisor-Only)**
    2.1. A "User Management" interface must be accessible to users with the "Supervisor" role.
    2.2. This interface must display a table of all users with the following columns: **Full Name, Email Address, Role, Assigned Barangay, Account Status (Active/Inactive)**.
    2.3. The Supervisor must be able to create a new user by providing a full name, email address, and assigning a role from a fixed, predefined list.
    2.4. If the "BLGU User" role is selected, a dropdown menu populated with a predefined list of barangays must be presented, and the Supervisor must select one. The "Assigned Barangay" field is not applicable to other roles.
    2.5. The Supervisor must be able to edit an existing user's full name, role, and assigned barangay.
    2.6. The Supervisor must be able to toggle a user's account status between "Active" and "Inactive". Inactive users must not be able to log in.

## 5. Non-Goals (Out of Scope)

*   A public-facing user registration/signup page.
*   A "Forgot Password" self-service flow.
*   A "Remember Me" feature for persistent sessions.
*   A user-facing profile page for users to edit their own details.
*   A dynamic permission system beyond the fixed, predefined roles.

## 6. Design & UX Considerations

*   All UI elements will be built using `shadcn/ui` components for a consistent and professional look.
*   The login page should be minimal, clean, and clearly branded for VANTAGE.
*   The User Management table should be clear and easy to read, with intuitive controls for creating and editing users.
*   The flow for forcing a new user to change their temporary password must be clear and non-skippable.

## 7. Technical Considerations

*   **Backend (FastAPI):**
    *   Use `passlib` for hashing and verifying passwords.
    *   Use `python-jose` for creating and validating JWTs.
    *   The `/api/v1/auth/login` endpoint will handle credential validation and token issuance.
    *   All data-related API endpoints will be protected by a dependency that verifies the JWT from the `Authorization` header.
*   **Frontend (Next.js):**
    *   An Axios instance in `lib/api.ts` will manage API communication. An interceptor will be used to automatically attach the JWT to request headers.
    *   A Zustand store (`useAuthStore`) will manage the global authentication state (user info, token).
    *   Next.js middleware (`middleware.ts`) will handle route protection and redirection logic.
*   **Database:**
    *   A `barangays` table will be seeded with the predefined list of the 25 barangays of Sulop.

## 8. Success Metrics

*   100% of internal application routes are inaccessible to unauthenticated users.
*   Supervisors can successfully perform all specified user management functions (Create, Read, Update, Activate/Deactivate).
*   Users are correctly redirected to their role-specific dashboard after logging in.
*   The forced password change flow for new users works as required.

## 9. Open Questions

*   None at this time. The scope is well-defined for this initial version. 