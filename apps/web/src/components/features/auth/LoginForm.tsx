// 🚀 Modern login form using auto-generated React Query hooks
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePostAuthLogin } from '@vantage/shared';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * Login form component with authentication and redirect logic
 * 
 * Uses the auto-generated usePostAuthLogin hook and integrates with
 * the Zustand auth store for state management.
 */
export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  
  // Get auth store actions
  const { setToken, setUser } = useAuthStore();

  // Auto-generated login mutation hook
  const loginMutation = usePostAuthLogin({
    mutation: {
      onSuccess: (response) => {
        console.log('Login successful:', response);
        
        // Extract token from response
        const accessToken = response.access_token;
        
        if (!accessToken) {
          console.error('No access token received from server');
          return;
        }
        
        // Store token in auth store
        setToken(accessToken);
        
        // Redirect immediately - user data will be fetched in dashboard
        router.push('/dashboard');
      },
      onError: (error) => {
        console.error('Login failed:', error);
        // Error will be displayed in the UI via loginMutation.error
      }
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const credentials = {
      email,
      password,
    };

    // Trigger the login mutation
    loginMutation.mutate({ data: credentials });
  };

  // Get error message for display
  const getErrorMessage = () => {
    if (!loginMutation.error) return null;
    
    // Handle different error types
    if (loginMutation.error instanceof Error) {
      return loginMutation.error.message;
    }
    
    // Handle API error responses
    if (typeof loginMutation.error === 'object' && loginMutation.error !== null) {
      const apiError = loginMutation.error as any;
      if (apiError.response?.data?.detail) {
        return apiError.response.data.detail;
      }
      if (apiError.message) {
        return apiError.message;
      }
    }
    
    return 'Login failed. Please check your credentials.';
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Sign In</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loginMutation.isPending}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
            placeholder="user@example.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loginMutation.isPending}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
            placeholder="••••••••"
          />
        </div>

        {/* Error Display */}
        {loginMutation.error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <div className="text-red-600 text-sm">
              {getErrorMessage()}
            </div>
          </div>
        )}

        {/* Submit Button with Loading State */}
        <Button
          type="submit"
          disabled={loginMutation.isPending}
          className="w-full"
        >
          {loginMutation.isPending ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Signing in...
            </>
          ) : (
            'Sign In'
          )}
        </Button>
      </form>

      {/* Success Message */}
      {loginMutation.isSuccess && (
        <div className="mt-4 bg-green-50 border border-green-200 rounded-md p-3">
          <div className="text-green-600 text-sm">
            ✅ Login successful! Redirecting...
          </div>
        </div>
      )}
    </div>
  );
} 