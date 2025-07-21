import { useGetUsers } from '@vantage/shared/src/generated/endpoints/users/users';

/**
 * Custom hook to fetch all users for the admin user management interface.
 * Wraps the auto-generated useGetUsers hook for clarity and future extensibility.
 *
 * @param params - Optional query params for filtering, pagination, etc.
 * @param options - Optional react-query options
 */
export function useUsers(params?: Parameters<typeof useGetUsers>[0], options?: Parameters<typeof useGetUsers>[1]) {
  return useGetUsers(params, options);
} 