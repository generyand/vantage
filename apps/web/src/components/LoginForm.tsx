// 🚀 Modern login form using auto-generated React Query hooks
'use client';

import { useState } from 'react';
import { useLogin, type LoginRequest } from '../lib/api';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // ✨ Auto-generated mutation hook with optimistic updates and error handling
  const login = useLogin({
    mutation: {
      onSuccess: (response) => {
        console.log('Login successful:', response.data);
        // Store token and redirect (check if response is successful)
        if (response.status === 200 && 'access_token' in response.data) {
          localStorage.setItem('auth_token', response.data.access_token);
          // You could use Next.js router here: router.push('/dashboard')
        }
      },
      onError: (error) => {
        console.error('Login failed:', error);
      }
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const credentials: LoginRequest = {
      email,
      password,
    };

    // 🚀 Type-safe mutation with automatic loading states
    login.mutate({ data: credentials });
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
        {login.error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <div className="text-red-600 text-sm">
              {login.error instanceof Error ? login.error.message : 'Login failed'}
            </div>
          </div>
        )}

        {/* Submit Button with Loading State */}
        <button
          type="submit"
          disabled={login.isPending}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {login.isPending ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Signing in...
            </>
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      {/* Success Message */}
      {login.isSuccess && (
        <div className="mt-4 bg-green-50 border border-green-200 rounded-md p-3">
          <div className="text-green-600 text-sm">
            ✅ Login successful! Redirecting...
          </div>
        </div>
      )}
    </div>
  );
} 