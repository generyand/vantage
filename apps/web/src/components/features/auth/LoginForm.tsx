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
  const { setUser, setToken } = useAuthStore();

  // Auto-generated login mutation hook
  const loginMutation = usePostAuthLogin({
    mutation: {
      onSuccess: (response) => {
        console.log('Login successful:', response);
        
        // Extract token and user data from response
        const { access_token } = response;
        
        // Store token in auth store
        setToken(access_token);
        
        // For now, we'll need to fetch user data separately
        // In a real implementation, the login response might include user data
        // or we'd fetch it using the token
        fetchUserData(access_token);
      },
      onError: (error) => {
        console.error('Login failed:', error);
      }
    }
  });

  /**
   * Fetch user data after successful login
   * This will be replaced with a proper user fetch hook in task 4.4
   */
  const fetchUserData = async (token: string) => {
    try {
      // TODO: Replace with proper user fetch hook
      // For now, we'll create a mock user object
      // This will be updated when we implement the user fetch functionality
      const mockUser = {
        id: '1',
        email: email,
        name: 'User', // This will come from the actual user data
        role: 'MLGOO_DILG',
        phone_number: null,
        barangay_id: null,
        is_active: true,
        must_change_password: false,
        created_at: new Date().toISOString()
      };
      
      // Store user in auth store
      setUser(mockUser);
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const credentials = {
      email,
      password,
    };

    // Trigger the login mutation
    loginMutation.mutate({ data: credentials });
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
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="••••••••"
          />
        </div>

        {/* Error Display */}
        {loginMutation.error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <div className="text-red-600 text-sm">
              {loginMutation.error instanceof Error 
                ? loginMutation.error.message 
                : 'Login failed. Please check your credentials.'}
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