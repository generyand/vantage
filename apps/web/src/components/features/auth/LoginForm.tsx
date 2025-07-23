// 🚀 Modern login form using auto-generated React Query hooks
'use client';


import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePostAuthLogin, useGetUsersMe } from '@vantage/shared';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

/**
 * Login form component with authentication and redirect logic
 * 
 * Uses the auto-generated usePostAuthLogin hook and integrates with
 * the Zustand auth store for state management.
 */
export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [shouldFetchUser, setShouldFetchUser] = useState(false);
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
        
        // Trigger user data fetch
        setShouldFetchUser(true);
      },
      onError: (error) => {
        console.error('Login failed:', error);
        // Error will be displayed in the UI via loginMutation.error
      }
    }
  });

  // Auto-generated hook to fetch current user data
  const userQuery = useGetUsersMe();

  // Handle user data fetch success/error
  useEffect(() => {
    if (shouldFetchUser) {
      // Trigger user data fetch
      userQuery.refetch().then((result) => {
        if (result.data) {
          console.log('User data fetched:', result.data);
          // Store user in auth store
          setUser(result.data);
          // Redirect to dashboard
          router.push('/dashboard');
        } else if (result.error) {
          console.error('Failed to fetch user data:', result.error);
          // Even if user fetch fails, we can still redirect to dashboard
          router.push('/dashboard');
        }
        // Reset the flag
        setShouldFetchUser(false);
      });
    }
  }, [shouldFetchUser, userQuery, setUser, router]);

  // Show toast on login success
  useEffect(() => {
    if (loginMutation.isSuccess) {
      toast.success('Login Successfully');
    }
  }, [loginMutation.isSuccess]);

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
      const apiError = loginMutation.error as { response?: { data?: { detail?: string } }, message?: string };
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
          <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </Label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
              <Mail className="w-5 h-5" />
            </span>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loginMutation.isPending}
              className="pl-10 block w-full py-3 text-base border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
              placeholder="Enter your email address"
              autoComplete="username"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </Label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
              <Lock className="w-5 h-5" />
            </span>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loginMutation.isPending}
              className="pl-10 block w-full py-3 text-base border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
              placeholder="Enter your password"
              autoComplete="current-password"
            />
          </div>
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
          className="w-full mt-2 text-lg h-12"
        >
          {loginMutation.isPending ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              {loginMutation.isPending ? 'Signing in...' : 'Loading user data...'}
            </>
          ) : (
            'Sign in'
          )}
        </Button>
      </form>
    </div>
  );
} 