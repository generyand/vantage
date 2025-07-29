'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import UserNav from '@/components/shared/UserNav';
import { X, Bell } from 'lucide-react';

// Navigation items for different user roles
const adminNavigation = [
  { name: 'Admin Dashboard', href: '/admin/dashboard', icon: 'home' },
  { name: 'User Management', href: '/user-management', icon: 'users' },
  { name: 'Assessments', href: '/admin/assessments', icon: 'clipboard' },
  { name: 'Reports', href: '/admin/reports', icon: 'chart' },
];

const blguNavigation = [
  { name: 'BLGU Dashboard', href: '/blgu/dashboard', icon: 'home' },
  { name: 'My Assessments', href: '/blgu/assessments', icon: 'clipboard' },
  { name: 'My Reports', href: '/blgu/reports', icon: 'chart' },
];

const getIcon = (name: string) => {
  switch (name) {
    case 'home':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      );
    case 'clipboard':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    case 'chart':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      );
    case 'users':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      );
    default:
      return null;
  }
};

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, user, mustChangePassword } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Determine navigation based on user role
  const isAdmin = user?.role === 'SUPERADMIN' || user?.role === 'MLGOO_DILG';
  const navigation = isAdmin ? adminNavigation : blguNavigation;

  // Redirect unauthenticated users to login
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, router]);

  // Redirect users to change password if required
  useEffect(() => {
    if (isAuthenticated && user && mustChangePassword && pathname !== '/change-password') {
      router.replace('/change-password');
      return;
    }
  }, [isAuthenticated, user, mustChangePassword, pathname, router]);

  // Redirect users to appropriate dashboard based on role
  useEffect(() => {
    if (isAuthenticated && user && !mustChangePassword) {
      const isAdmin = user.role === 'SUPERADMIN' || user.role === 'MLGOO_DILG';
      const currentPath = pathname;
      
      // If user is on root path, redirect to appropriate dashboard
      if (currentPath === '/') {
        const dashboardPath = isAdmin ? '/admin/dashboard' : '/blgu/dashboard';
        router.replace(dashboardPath);
        return;
      }
      
      // Check if user is accessing wrong role routes
      const isAdminRoute = currentPath.startsWith('/admin');
      const isBLGURoute = currentPath.startsWith('/blgu');
      const isUserManagementRoute = currentPath.startsWith('/user-management');
      
      if (isAdmin) {
        // Admin users should not access BLGU routes
        if (isBLGURoute) {
          router.replace('/admin/dashboard');
        }
      } else {
        // BLGU users should not access admin routes or user management
        if (isAdminRoute || isUserManagementRoute) {
          router.replace('/blgu/dashboard');
        }
      }
    }
  }, [isAuthenticated, user, mustChangePassword, pathname, router]);

  // Show loading if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // If user must change password and is not on the change-password page, show loading
  if (mustChangePassword && pathname !== '/change-password') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to password change...</p>
        </div>
      </div>
    );
  }

  // If user must change password, show only the change password page without navigation
  if (mustChangePassword && pathname === '/change-password') {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <div className={`fixed inset-0 flex z-50 md:hidden ${sidebarOpen ? '' : 'hidden'}`}>
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white/95 backdrop-blur-sm shadow-xl border-r border-red-100">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-6 mb-8">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src="/DILG.png"
                    alt="DILG Logo"
                    width={40}
                    height={40}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="ml-3">
                  <h1 className="text-lg font-bold text-gray-900">VANTAGE</h1>
                  <p className="text-sm text-gray-600">
                    {isAdmin ? 'Admin Portal' : 'Barangay Submission Portal'}
                  </p>
                </div>
              </div>
            </div>
            <nav className="px-4 space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-4 py-3 text-left rounded-sm transition-all duration-200 ${
                    pathname === item.href
                      ? "bg-[#b91c1c] text-white shadow-lg"
                      : "text-gray-700 hover:bg-red-50 hover:text-red-600"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  {getIcon(item.icon)}
                  <span className="ml-3 font-medium">{item.name}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-white/95 backdrop-blur-sm shadow-xl border-r border-red-100">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-6 mb-8">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src="/DILG.png"
                    alt="DILG Logo"
                    width={40}
                    height={40}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="ml-3">
                  <h1 className="text-lg font-bold text-gray-900">VANTAGE</h1>
                  <p className="text-sm text-gray-600">
                    {isAdmin ? 'Admin Portal' : 'Barangay Submission Portal'}
                  </p>
                </div>
              </div>
            </div>
            <nav className="flex-1 px-4 space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-4 py-3 text-left rounded-sm transition-all duration-200 ${
                    pathname === item.href
                      ? "bg-[#b91c1c] text-white shadow-lg"
                      : "text-gray-700 hover:bg-red-50 hover:text-red-600"
                  }`}
                >
                  {getIcon(item.icon)}
                  <span className="ml-3 font-medium">{item.name}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-64 flex flex-col flex-1">
        <div className="sticky top-0 z-10 md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-gray-50">
          <button
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            onClick={() => setSidebarOpen(true)}
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate">
                  {navigation.find(item => pathname === item.href)?.name || (isAdmin ? 'Admin Dashboard' : 'BLGU Dashboard')}
                </h2>
              </div>
              <div className="flex items-center space-x-4">
                {/* Notifications */}
                <button className="p-2 rounded-full text-gray-500 hover:text-[#b91c1c] hover:bg-red-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#b91c1c] focus:ring-offset-2">
                  <Bell className="h-5 w-5" />
                </button>
                
                {/* Profile dropdown */}
                <div className="relative">
                  <button 
                    className="flex items-center space-x-2 p-2 rounded-full text-gray-500 hover:text-[#b91c1c] hover:bg-red-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#b91c1c] focus:ring-offset-2"
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  >
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#b91c1c] to-[#dc2626] flex items-center justify-center text-white font-semibold text-sm">
                      {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <span className="hidden sm:block text-sm font-medium text-gray-700">
                      {user?.name || 'User'}
                    </span>
                  </button>
                  
                  {/* Profile dropdown menu */}
                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-sm shadow-xl border border-gray-200 z-50">
                      <div className="py-1">
                        <UserNav />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
      
      {/* Click outside to close dropdown */}
      {profileDropdownOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setProfileDropdownOpen(false)}
        />
      )}
    </div>
  );
} 