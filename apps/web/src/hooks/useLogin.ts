// 🔐 Login hook using React Query
// Provides a mutation hook for authenticating users

import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";
import { useRouter } from "next/navigation";
import type { User } from "@vantage/shared/src/generated/schemas";
import type { AuthToken } from "@vantage/shared/src/generated/schemas";

// Define the login request type
export interface LoginRequest {
  email: string;
  password: string;
}

// Create the login hook
export function useLogin() {
  const router = useRouter();
  const { setAuth } = useAuthStore();

  return useMutation({
    mutationFn: async (credentials: LoginRequest) => {
      // Make the login API call
      const response = await axios.post<AuthToken>(
        "/api/v1/auth/login",
        credentials
      );

      // Get the user information using the token
      const userResponse = await axios.get<User>("/api/v1/auth/me", {
        headers: {
          Authorization: `Bearer ${response.data.access_token}`,
        },
      });

      return {
        token: response.data,
        user: userResponse.data,
      };
    },
    onSuccess: (data) => {
      // Store authentication data in Zustand store
      setAuth(data.token, data.user);

      // Redirect to dashboard or forced password change page if needed
      if (data.user.must_change_password) {
        router.push("/change-password");
      } else {
        router.push("/dashboard");
      }
    },
  });
}
