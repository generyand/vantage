## Relevant Files

- `apps/api/app/db/models/user.py` - Update SQLAlchemy model to include roles, status, and barangay relationship.
- `apps/api/app/db/models/barangay.py` - Create new SQLAlchemy model for barangays.
- `apps/api/alembic/versions/` - A new Alembic migration file will be generated here to update the database schema.
- `apps/api/app/schemas/user.py` - Update Pydantic schemas for user creation, updates, and API responses.
- `apps/api/app/api/v1/auth.py` - Update to implement the JWT login logic.
- `apps/api/app/api/v1/users.py` - Implement CRUD endpoints for user management by supervisors.
- `apps/api/app/api/deps.py` - Implement the JWT token validation dependency to protect routes.
- `apps/api/tests/api/v1/test_auth.py` - Add unit and integration tests for the authentication flow.
- `apps/api/tests/api/v1/test_users.py` - Add tests for the user management API endpoints.
- `apps/web/src/middleware.ts` - Create Next.js middleware to handle route protection and redirects.
- `apps/web/src/lib/api.ts` - Configure Axios instance and add an interceptor to attach the auth token to requests.
- `apps/web/src/store/useAuthStore.ts` - Create a Zustand store to manage user session state globally.
- `apps/web/src/app/(auth)/login/page.tsx` - Create the main component for the login page.
- `apps/web/src/components/features/auth/LoginForm.tsx` - Create the form component for handling user login.
- `apps/web/src/app/(app)/admin/users/page.tsx` - Create the page for the User Management dashboard.
- `apps/web/src/components/features/users/UserManagementTable.tsx` - Create the data table component to display and manage users.
- `apps/web/src/components/features/users/UserForm.tsx` - Create the form component for creating and editing users.

### Notes

- Unit tests should be placed alongside the code files they are testing where applicable (e.g., in the same directory or a `__tests__` subdirectory).
- Use `pnpm test` in the root or app-specific directory to run tests. For example, `cd apps/api && pnpm test` for the backend.

## Tasks

- [ ] 1.0 Backend: Database & Model Setup
  - [ ] 1.1 Update the `User` model in `apps/api/app/db/models/user.py` to include `role` (Enum), `status` (Enum: active, inactive), and a foreign key to the `barangays` table (nullable).
  - [ ] 1.2 Create the `Barangay` model in `apps/api/app/db/models/barangay.py` with `id` and `name` fields.
  - [ ] 1.3 Generate a new Alembic migration to apply the model changes to the database schema.
  - [ ] 1.4 Create a seeding script or update an existing one to populate the `barangays` table with the 25 official barangays of Sulop.
  - [ ] 1.5 Update Pydantic schemas in `apps/api/app/schemas/user.py` for user creation, editing, and API responses, including the new fields.
- [ ] 2.0 Backend: Implement Authentication & User Management APIs
  - [ ] 2.1 In `apps/api/app/core/security.py`, ensure functions for password hashing/verification (`passlib`) and JWT creation/verification (`python-jose`) exist.
  - [ ] 2.2 Implement the `/api/v1/auth/login` endpoint in `auth.py` to validate credentials and issue a JWT access token.
  - [ ] 2.3 Create a new dependency in `apps/api/app/api/deps.py` that validates the JWT bearer token and retrieves the current user.
  - [ ] 2.4 Implement a protected API endpoint in `users.py` to get a list of all users (`GET /api/v1/users`).
  - [ ] 2.5 Implement a protected endpoint to create a new user (`POST /api/v1/users`), ensuring the creator is a Supervisor.
  - [ ] 2.6 Implement protected endpoints to update a user's details (`PUT /api/v1/users/{user_id}`) and activate/deactivate them.
  - [ ] 2.7 Write API tests for login, user creation, and fetching users, ensuring proper authorization and error handling.
  - [ ] 2.8 Regenerate the frontend types by running `pnpm generate` in the root directory.
- [ ] 3.0 Frontend: Build Login Page & Authentication State
  - [ ] 3.1 Create the login page UI at `apps/web/src/app/(auth)/login/page.tsx`.
  - [ ] 3.2 Build the `LoginForm.tsx` component using `shadcn/ui` components (`Input`, `Button`, `Card`).
  - [ ] 3.3 Create the `useAuthStore` in `apps/web/src/store/useAuthStore.ts` to hold the auth token and user state.
  - [ ] 3.4 Implement the login logic in `LoginForm.tsx` to call the API via `api.ts`, and on success, save the token/user to the Zustand store.
  - [ ] 3.5 Configure the Axios instance in `apps/web/src/lib/api.ts` with an interceptor that attaches the JWT token to the `Authorization` header of all outgoing requests.
- [ ] 4.0 Frontend: Implement Route Protection & Role-Based Redirects
  - [ ] 4.1 Create `apps/web/src/middleware.ts` to protect all routes under the `(app)` group.
  - [ ] 4.2 The middleware should read the auth token (e.g., from cookies) and redirect any unauthenticated users from `(app)` routes to `/login`.
  - [ ] 4.3 After a successful login in `LoginForm.tsx`, programmatically redirect the user to their appropriate dashboard (`/dashboard`).
  - [ ] 4.4 Implement a "Logout" button in the `UserNav.tsx` component that clears the auth store and redirects to `/login`.
- [ ] 5.0 Frontend: Build User Management UI for Supervisors
  - [ ] 5.1 Create the user management page at `/admin/users` (or a similar protected route).
  - [ ] 5.2 Use the shared `DataTable.tsx` component to display the list of users fetched from the API.
  - [ ] 5.3 Implement a "Create User" button that opens a dialog or form (`UserForm.tsx`).
  - [ ] 5.4 The `UserForm` should include fields for name, email, role (dropdown), and assigned barangay (conditional dropdown), and handle the creation API call.
  - [ ] 5.5 Add "Edit" and "Activate/Deactivate" actions to each row in the data table, linking them to the appropriate API calls. 