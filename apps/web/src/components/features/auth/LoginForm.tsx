// 🚀 Modern login form with Zustand integration and dashboard redirect
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../../store/useAuthStore";

// Type definitions to match the expected API structure
interface AuthToken {
  access_token: string;
  token_type?: string;
  expires_in: number;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface ApiUser {
  id: string;
  email: string;
  name: string;
  role?: string;
  phone_number?: string;
  barangay_id?: number;
  is_active?: boolean;
  must_change_password?: boolean;
  created_at: string;
}

// Temporary API functions until the shared package is properly configured
const API_BASE_URL = "http://localhost:8000";

const loginApi = async (credentials: LoginRequest): Promise<AuthToken> => {
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error("Login failed");
  }

  return response.json();
};

const getCurrentUser = async (token: string): Promise<ApiUser> => {
  const response = await fetch(`${API_BASE_URL}/api/v1/users/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user data");
  }

  return response.json();
};

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const { login } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const credentials: LoginRequest = {
        email,
        password,
      };

      // Step 1: Login and get token
      const authResponse = await loginApi(credentials);
      const token = authResponse.access_token;

      // Step 2: Get user data
      const userData = await getCurrentUser(token);

      // Step 3: Create complete user object with all required fields
      const completeUser = {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        role: userData.role || "BLGU User",
        phone_number: userData.phone_number || undefined,
        barangay_id: userData.barangay_id || undefined,
        is_active: userData.is_active ?? true,
        must_change_password: userData.must_change_password ?? false,
        created_at: userData.created_at,
      };

      // Step 4: Save to Zustand store
      login(completeUser, token);

      // Step 5: Set authentication cookie for middleware
      // Set cookie with secure optionsss
      const cookieOptions = [
        'auth-token=' + token,
        'Path=/',
        'Max-Age=604800', // 7 days (7 * 24 * 60 * 60)
        'SameSite=Strict',
        // Add Secure flag in production
        ...(process.env.NODE_ENV === 'production' ? ['Secure'] : [])
      ];
      document.cookie = cookieOptions.join('; ');

      // Step 6: Show success and redirect
      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } catch (err) {
      console.error("Login failed:", err);
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Sign In</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="user@example.com"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="••••••••"
          />
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <div className="text-red-600 text-sm">{error}</div>
          </div>
        )}

        {/* Submit Button with Loading State */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </button>
      </form>

      {/* Success Message */}
      {success && (
        <div className="mt-4 bg-green-50 border border-green-200 rounded-md p-3">
          <div className="text-green-600 text-sm">
            ✅ Login successful! Redirecting to dashboard...
          </div>
        </div>
      )}
    </div>
  );
}
