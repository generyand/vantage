## Relevant Files

-   `apps/api/app/db/enums.py` - **Create/Refactor** Python enums for `UserRole` and `AreaType` to use strings for better readability.
-   `apps/api/app/db/models/user.py` - **Modify** the `User` model to use a string-based enum for the `role` field.
-   `apps/api/app/db/models/governance_area.py` - **Modify** the `GovernanceArea` model to use a string-based enum for the `area_type` field.
-   `apps/api/alembic/versions/` - A **new** Alembic migration file will be generated for all schema alterations.
-   `apps/api/app/schemas/user.py` - **Update** Pydantic schemas to reflect the new `Integer` `id` and `assessor_area` field.
-   `apps/api/app/api/v1/users.py` - **Update** endpoints to handle `assessor_area` logic.
-   `apps/api/app/services/user_service.py` - **Update** service logic to use string-based enums for roles.
-   `apps/api/app/services/governance_area_service.py` - **Update** seeding service to use enum values.
-   `apps/api/app/services/startup_service.py` - **Update** to use enum-based roles for first superuser creation.
-   `apps/api/app/api/deps.py` - **Update** dependencies to handle enum-based roles.
-   `apps/api/tests/api/v1/test_users.py` - Backend tests for the new User Management API.
-   `apps/web/src/store/useAuthStore.ts` - **Create** Zustand store for managing global authentication state with user, token, and must_change_password tracking.
-   `apps/web/src/components/features/auth/LoginForm.tsx` - **Update** to use auto-generated usePostAuthLogin hook and integrate with Zustand auth store.
-   `apps/web/middleware.ts` - **Create** Next.js middleware for route protection with cookie-based auth checking.
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

-   [x] 1.0 **Backend Foundation & Database Schema (Revision 1)**
    -   [x] 1.1 ~~*Original user model changes*~~ (Superseded)
    -   [x] 1.2 ~~*Original barangay model creation*~~ (Completed)
    -   [x] 1.3 ~~*Original relationship setup*~~ (Completed)
    -   [x] 1.4 ~~*Original migration*~~ (Superseded)
    -   [x] 1.5 ~~*Original seeding*~~ (Completed)
    -   [x] 1.6 In `apps/api/app/db/models/user.py`, change the `id` column from `String` to `Integer`.
    -   [x] 1.7 In the `User` model, change `role` to `SMALLINT` and add the nullable `assessor_area` `SMALLINT` column.
    -   [x] 1.8 Create `apps/api/app/db/models/governance_area.py` with `id`, `name`, and `area_type` (`SMALLINT`) columns.
    -   [x] 1.9 Create a one-time seeding service to populate the `governance_areas` table with the 6 predefined SGLGB areas and their types (Core/Essential).
    -   [x] 1.10 Run `uv run alembic revision --autogenerate -m "Alter user table and add governance areas"` to create a new migration file. Review the script.

-   [x] 1.11 ~~**Implement Enums for Type Safety and Better Code Quality**~~ (Superseded by string-based enum refactor)
    -   [x] ~~1.11.1 Create `apps/api/app/db/enums.py` with `UserRole` and `GovernanceAreaType` enums using Python's `enum.IntEnum`.~~
    -   [x] ~~1.11.2 Update `apps/api/app/db/models/user.py` to use `Enum(UserRole)` instead of `SmallInteger` for the `role` column.~~
    -   [x] ~~1.11.3 Update `apps/api/app/db/models/governance_area.py` to use `Enum(GovernanceAreaType)` instead of `SmallInteger` for the `area_type` column.~~
    -   [x] ~~1.11.4 Update `apps/api/app/services/governance_area_service.py` to use enum values in the seeding data.~~
    -   [x] ~~1.11.5 Update `apps/api/app/services/startup_service.py` to use `UserRole.SYSTEM_ADMIN` instead of integer `3`.~~
    -   [x] ~~1.11.6 Create a new Alembic migration to add CHECK constraints for the enum values in the database.~~
    -   [x] ~~1.11.7 Update all existing code that references integer role values to use the new enums.~~

-   [x] 1.12 **Refactor Roles & Area Types to use String-Based Enums**
    -   [x] 1.12.1 In `enums.py`, refactor `UserRole` to be a `(str, enum.Enum)` with values like `"SUPERADMIN"`, `"MLGOO_DILG"`, etc. Create a new `AreaType(str, enum.Enum)` for `"Core"` and `"Essential"`.
    -   [x] 1.12.2 Update `user.py` and `governance_area.py` models to use the new string-based enums.
    -   [x] 1.12.3 In `governance_area_service.py`, update the seeding data to use the new `AreaType` enum string values.
    -   [x] 1.12.4 In `startup_service.py`, update the superuser creation to use `UserRole.SUPERADMIN`.
    -   [x] 1.12.5 In `deps.py`, update the admin check to use `UserRole.SUPERADMIN`.
    -   [x] 1.12.6 Create a new Alembic migration to change the `role` and `area_type` columns to `VARCHAR`, update existing data from integers to strings, and update the `CHECK` constraints.

-   [x] 2.0 **Implement Backend Authentication Endpoints (Revision 1)**
    -   [x] 2.1 ~~*Original login endpoint enhancement*~~ (Completed)
    -   [x] 2.2 In `apps/api/app/core/security.py`, update `create_access_token` and `verify_token` to handle integer `user_id`.
    -   [x] 2.3 In `apps/api/app/api/v1/auth.py`, update the `/login` endpoint to query users by integer ID.
    -   [x] 2.4 Update the JWT payload to include the string `role`.

-   [x] 3.0 **Implement Backend User Management API (Admin) (Revision 1)**
    -   [x] 3.1 In `apps/api/app/schemas/user.py`, update all user schemas to use `int` for `id` and include the optional `assessor_area` field.
    -   [x] 3.2 In `apps/api/app/services/user_service.py`, refactor methods to handle the `assessor_area` field, ensuring it's only set for users with the "Area Assessor" role.
    -   [x] 3.3 In `apps/api/app/api/v1/users.py`, update the create and update endpoints to accept and process the `assessor_area`.
    -   [x] 3.4 ~~In `apps/api/app/api/deps.py`, update `get_current_admin_user` to check for `role == 1` (MLGOO-DILG).~~ (Superseded by Task 1.12.5)

-   [ ] 4.0 **Frontend Foundation & Login Flow**
    -   [x] 4.1 Create `apps/web/src/store/useAuthStore.ts` using Zustand to hold `user`, `token`, and `isAuthenticated` state.
    -   [x] 4.2 In the `LoginForm` component, use the auto-generated `usePostLogin` mutation hook from `@vantage/shared`. On success, save the returned token and user state to the Zustand store and redirect to the dashboard.
    -   [x] 4.3 Create `apps/web/middleware.ts` to protect all routes inside the `(app)` group. Unauthenticated users should be redirected to `/login`.
    -   [ ] 4.4 In the `UserNav` component, use the auto-generated `usePostLogout` mutation hook. On success, clear the auth store and redirect to the login page.

-   [ ] 5.0 **Build Frontend User Management Interface (Admin)**
    -   [x] 5.1 Create the page `apps/web/src/app/(app)/user-management/page.tsx`. This page should be accessible only to the admin role.
    -   [x] 5.2 On this page, use the auto-generated `useGetUsers` query hook to fetch the list of all users.
    -   [x] 5.3 Build the `UserManagementTable.tsx` component to display the "Assigned Barangay/Area" column, showing the barangay for BLGU users and the governance area for Assessors.
    -   [ ] 5.4 Create a `UserForm.tsx` component for the user creation/editing modal/dialog.
    -   [ ] 5.5 In the `UserForm`, conditionally display EITHER the "Assigned Barangay" dropdown (for "BLGU User" role) OR the "Assigned Governance Area" dropdown (for "Area Assessor" role).
    -   [ ] 5.6 The `UserForm` should use the auto-generated `usePostUser` and `usePutUser` mutation hooks, ensuring `assessor_area` is passed when required. On success, invalidate the `useGetUsers` query.

-   [ ] 6.0 **Implement Forced Password Change Flow**
    -   [ ] 6.1 In the main application layout (`apps/web/src/app/(app)/layout.tsx`), add a check that reads `must_change_password` from the `useAuthStore`.
    -   [ ] 6.2 If `must_change_password` is `true`, redirect the user to the `/change-password` page.
    -   [ ] 6.3 Create the `apps/web/src/app/(app)/change-password/page.tsx` page with a form for changing the password.
    -   [ ] 6.4 The password change form should use the auto-generated `usePostChangePassword` mutation hook. On success, update the auth store and redirect the user to their dashboard.

-   [ ] 7.0 **End-to-End Testing and Refinement**
    -   [ ] 7.1 Write `pytest` tests for the auth and user management endpoints, including permission checks.
    -   [ ] 7.2 Write frontend tests for the `LoginForm`, `UserManagementTable`, and `UserForm` components.
    -   [ ] 7.3 Conduct a full manual test of the authentication flow: new user creation -> first login -> forced password change -> logout.
    -   [ ] 7.4 Conduct a full manual test of all user management functions from the MLGOO-DILG account.
