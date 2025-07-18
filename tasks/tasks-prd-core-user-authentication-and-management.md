## Relevant Files

-   `apps/api/app/db/models/user.py` - Modify the `User` model to include `phone_number`, `is_active`, and `must_change_password` fields.
-   `apps/api/app/db/models/barangay.py` - Create a new `Barangay` model for the predefined list of barangays.
-   `apps/api/alembic/versions/` - A new Alembic migration file will be generated for the database schema changes.
-   `apps/api/app/schemas/user.py` - Update Pydantic schemas for user creation, update, and response models.
-   `apps/api/app/api/v1/auth.py` - Modify the login endpoint and add a new endpoint for changing passwords.
-   `apps/api/app/api/v1/users.py` - Create endpoints for User Management (CRUD operations for administrators).
-   `apps/api/app/api/deps.py` - Enhance dependency injection to include permission checks for roles like "MLGOO-DILG".
-   `apps/api/app/services/user_service.py` - Create a new service for user-related business logic.
-   `apps/api/tests/api/v1/test_users.py` - Backend tests for the new User Management API.
-   `apps/web/src/store/useAuthStore.ts` - Create a new Zustand store for managing global authentication state.
-   `apps/web/middleware.ts` - Create Next.js middleware for route protection.
-   `apps/web/src/hooks/useAuth.ts` - Create a hook for handling login, logout, and password changes.
-   `apps/web/src/hooks/useUsers.ts` - Create hooks for fetching and managing user data for the admin interface.
-   `apps/web/src/app/(app)/user-management/page.tsx` - The main page for the User Management feature.
-   `apps/web/src/components/features/users/UserManagementTable.tsx` - A component to display users in a data table.
-   `apps/web/src/components/features/users/UserForm.tsx` - A form component for creating and editing users.
-   `apps/web/src/app/(app)/change-password/page.tsx` - A dedicated page for the mandatory password change flow.

### Notes on Testing

-   **Backend Testing:** Unit tests for the Python backend are located in `apps/api/tests/`. To run them, navigate to the `apps/api` directory and execute `uv run pytest`.
-   **Frontend Testing:** Unit tests for Next.js components are placed alongside the component files. To run them, navigate to the `apps/web` directory and execute `pnpm test`.

## Tasks

-   [x] 1.0 **Backend Foundation & Database Schema**
    -   [x] 1.1 In `apps/api/app/db/models/user.py`, add `phone_number` (String, nullable), `is_active` (Boolean, default True), and `must_change_password` (Boolean, default True) columns to the `User` model.
    -   [x] 1.2 Create `apps/api/app/db/models/barangay.py` with a `Barangay` model containing `id` and `name`.
    -   [x] 1.3 Establish the relationship between `User` and `Barangay` (a user can be linked to one barangay).
    -   [x] 1.4 Run `uv run alembic revision --autogenerate -m "Add user fields and barangay table"` to create the migration file. Review the generated script.
    -   [x] 1.5 Create a seeding script or a one-time service to populate the `barangays` table with the 25 barangays of Sulop.

-   [ ] 2.0 **Implement Backend Authentication Endpoints**
    -   [ ] 2.1 In `apps/api/app/api/v1/auth.py`, enhance the `/login` endpoint to check if `is_active` is true.
    -   [ ] 2.2 The JWT payload should include `user_id`, `role`, and `must_change_password`.
    -   [ ] 2.3 Create a new endpoint `/api/v1/auth/change-password` that allows an authenticated user to update their password. This endpoint should set `must_change_password` to `False`.
    -   [ ] 2.4 In `apps/api/app/api/deps.py`, create a dependency `get_current_active_user` that verifies the JWT and ensures the user is active.

-   [ ] 3.0 **Implement Backend User Management API (Admin)**
    -   [ ] 3.1 In `apps/api/app/schemas/user.py`, create `UserCreate`, `UserUpdate` schemas to handle the new fields.
    -   [ ] 3.2 Create `apps/api/app/services/user_service.py` to encapsulate the business logic for creating, reading, updating, and deactivating users.
    -   [ ] 3.3 Create a new router `apps/api/app/api/v1/users.py`.
    -   [ ] 3.4 Implement CRUD endpoints for user management (`GET /users`, `POST /users`, `GET /users/{id}`, `PUT /users/{id}`).
    -   [ ] 3.5 In `deps.py`, create a permission dependency that restricts access to these user management endpoints to users with the "MLGOO-DILG" role only.

-   [ ] 4.0 **Frontend Foundation & Login Flow**
    -   [ ] 4.1 Create `apps/web/src/store/useAuthStore.ts` using Zustand to hold `user`, `token`, and `isAuthenticated` state.
    -   [ ] 4.2 Update the `LoginForm` component to use a `useMutation` hook to call the login endpoint. On success, save state to Zustand and redirect to the dashboard.
    -   [ ] 4.3 Create `apps/web/middleware.ts` to protect all routes inside the `(app)` group. Unauthenticated users should be redirected to `/login`.
    -   [ ] 4.4 Implement a "Logout" button in the `UserNav` component that clears the auth store and redirects to login.

-   [ ] 5.0 **Build Frontend User Management Interface (Admin)**
    -   [ ] 5.1 Create the page `apps/web/src/app/(app)/user-management/page.tsx`. This page should be accessible only to the admin role.
    -   [ ] 5.2 Create a `useUsers` hook with `useQuery` to fetch the list of all users.
    -   [ ] 5.3 Build the `UserManagementTable.tsx` component using the shared `DataTable` to display users. Include columns for all relevant data and action buttons (Edit, Activate/Deactivate).
    -   [ ] 5.4 Create a `UserForm.tsx` component for the user creation/editing modal/dialog.
    -   [ ] 5.5 The form should conditionally display the "Assigned Barangay" dropdown only when the "BLGU User" role is selected.
    -   [ ] 5.6 Create `useCreateUser` and `useUpdateUser` mutation hooks. On success, invalidate the user list query to refetch data.

-   [ ] 6.0 **Implement Forced Password Change Flow**
    -   [ ] 6.1 In the main application layout (`apps/web/src/app/(app)/layout.tsx`), add a check that reads `must_change_password` from the `useAuthStore`.
    -   [ ] 6.2 If `must_change_password` is `true`, redirect the user to the `/change-password` page.
    -   [ ] 6.3 Create the `apps/web/src/app/(app)/change-password/page.tsx` page with a form for changing the password.
    -   [ ] 6.4 Create a `useChangePassword` mutation hook. On success, update the auth store and redirect the user to their dashboard.

-   [ ] 7.0 **End-to-End Testing and Refinement**
    -   [ ] 7.1 Write `pytest` tests for the auth and user management endpoints, including permission checks.
    -   [ ] 7.2 Write frontend tests for the `LoginForm`, `UserManagementTable`, and `UserForm` components.
    -   [ ] 7.3 Conduct a full manual test of the authentication flow: new user creation -> first login -> forced password change -> logout.
    -   [ ] 7.4 Conduct a full manual test of all user management functions from the MLGOO-DILG account.
