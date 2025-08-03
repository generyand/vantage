"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import LoginForm from "@/components/features/auth/LoginForm";

// Custom hook for dark mode detection
function useDarkMode() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check initial system preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(mediaQuery.matches);

    // Listen for changes
    const handleChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return isDarkMode;
}

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const isDarkMode = useDarkMode();

  // Page entrance animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Redirect authenticated users to appropriate dashboard
  useEffect(() => {
    if (isAuthenticated && user) {
      const isAdmin = user.role === 'SUPERADMIN' || user.role === 'MLGOO_DILG';
      const isAssessor = user.role === 'AREA_ASSESSOR';
      
      let dashboardPath;
      if (isAdmin) {
        dashboardPath = '/admin/dashboard';
      } else if (isAssessor) {
        dashboardPath = '/assessor/submissions';
      } else {
        dashboardPath = '/blgu/dashboard';
      }
      
      router.replace(dashboardPath);
    }
  }, [isAuthenticated, user, router]);

  // Show loading or redirect if user is authenticated
  if (isAuthenticated) {
    return (
      <div className={`relative h-screen flex items-center justify-center transition-colors duration-500 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-slate-800 via-gray-900 to-black' 
          : 'bg-gradient-to-br from-slate-50 via-yellow-50 to-amber-50'
      }`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#fbbf24] mx-auto mb-4"></div>
          <p className={`transition-colors duration-500 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Redirecting to dashboard...
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className={`relative min-h-screen flex flex-col transition-colors duration-500 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-slate-800 via-gray-900 to-black' 
        : 'bg-gradient-to-br from-slate-50 via-yellow-50 to-amber-50'
    }`}>
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Sophisticated geometric background pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          {/* Grid pattern */}
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(251, 191, 36, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(251, 191, 36, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}></div>
          {/* Geometric shapes */}
          <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-[#fbbf24] rounded-full animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/3 w-24 h-24 border border-[#f59e0b] rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 right-1/4 w-16 h-16 border border-[#d97706] rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/6 right-1/6 w-20 h-20 border border-[#fbbf24] transform rotate-45" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute bottom-1/4 left-1/6 w-28 h-28 border border-[#f59e0b] transform rotate-12" style={{ animationDelay: '1.5s' }}></div>
        </div>
        
        {/* Enhanced glowing blobs - Dynamic opacity based on theme */}
        {/* top right - Primary yellow glow */}
        <div className={`absolute -top-40 -right-40 w-48 h-48 lg:w-60 lg:h-60 xl:w-80 xl:h-80 rounded-full filter blur-xl animate-fade-in-blob animation-delay-800 animate-blob transition-all duration-500 ${
          isDarkMode 
            ? 'bg-[#fbbf24]/60 mix-blend-screen' 
            : 'bg-[#fbbf24]/30 mix-blend-multiply'
        }`}></div>
        <div className={`absolute -top-20 -right-20 w-32 h-32 lg:w-40 lg:h-40 xl:w-48 xl:h-48 rounded-full filter blur-lg animate-fade-in-blob animation-delay-1000 animate-blob transition-all duration-500 ${
          isDarkMode 
            ? 'bg-[#fbbf24]/40 mix-blend-screen' 
            : 'bg-[#fbbf24]/20 mix-blend-multiply'
        }`}></div>
        
        {/* bottom left - Secondary amber glow */}
        <div className={`absolute -bottom-40 -left-40 w-48 h-48 lg:w-60 lg:h-60 xl:w-80 xl:h-80 rounded-full filter blur-xl animate-fade-in-blob animation-delay-2000 animate-blob transition-all duration-500 ${
          isDarkMode 
            ? 'bg-[#f59e0b]/60 mix-blend-screen' 
            : 'bg-[#f59e0b]/30 mix-blend-multiply'
        }`}></div>
        <div className={`absolute -bottom-20 -left-20 w-32 h-32 lg:w-40 lg:h-40 xl:w-48 xl:h-48 rounded-full filter blur-lg animate-fade-in-blob animation-delay-2200 animate-blob transition-all duration-500 ${
          isDarkMode 
            ? 'bg-[#f59e0b]/40 mix-blend-screen' 
            : 'bg-[#f59e0b]/20 mix-blend-multiply'
        }`}></div>
        
        {/* top left - Tertiary orange accent */}
        <div className={`absolute top-40 left-40 w-48 h-48 lg:w-60 lg:h-60 xl:w-80 xl:h-80 rounded-full filter blur-xl animate-fade-in-blob-light animation-delay-4000 animate-blob transition-all duration-500 ${
          isDarkMode 
            ? 'bg-[#d97706]/50 mix-blend-screen' 
            : 'bg-[#d97706]/25 mix-blend-multiply'
        }`}></div>
        
        {/* Center accent glow */}
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full filter blur-3xl animate-fade-in-blob animation-delay-3000 transition-all duration-500 ${
          isDarkMode 
            ? 'bg-[#fbbf24]/10 mix-blend-screen' 
            : 'bg-[#fbbf24]/5 mix-blend-multiply'
        }`}></div>
      </div>
      {/* Main content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto flex items-center justify-center gap-x-24 flex-1 py-2">
        {/* Left Panel */}
        <div className={`hidden lg:flex flex-col items-center justify-center transition-all duration-1000 ${
          isPageLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
        }`}>
          {/* Floating Logo */}
          <div className="relative z-10 flex flex-col items-center">
            <div className={`mb-6 animate-float transition-all duration-1000 delay-200 ${
              isPageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}>
              <Image
                src="/DILG.png"
                alt="DILG Logo"
                width={180}
                height={180}
                priority
              />
            </div>
            <h1 className={`text-4xl font-extrabold mb-4 tracking-tight text-center transition-all duration-1000 delay-400 ${
              isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            } ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              VANTAGE
            </h1>
            <p className={`text-base font-medium text-center max-w-md mb-8 leading-relaxed transition-all duration-1000 delay-600 ${
              isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            } ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Validating Assessments and Nurturing Transparency for Advantaged Governance and Evaluation
            </p>
          </div>
        </div>
        {/* Right Panel (Login Card) */}
        <div className={`flex flex-col items-center justify-center min-w-[380px] max-w-md w-full px-4 py-2 sm:px-6 lg:px-0 transition-all duration-1000 delay-300 ${
          isPageLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
        }`}>
          {/* Single Card: Welcome, subtitle, LoginForm, and assistance text all in one */}
          <div className={`w-full backdrop-blur-md rounded-2xl p-8 md:p-8 flex flex-col space-y-5 transition-all duration-1000 delay-500 hover:scale-[1.005] ${
            isPageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          } ${
            isDarkMode 
              ? 'bg-gray-800/95 border border-gray-700/40' 
              : 'bg-white/95 border border-white/50'
          }`} style={{
            boxShadow: isDarkMode 
              ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 40px 60px -12px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(251, 191, 36, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.08), inset 0 0 20px rgba(251, 191, 36, 0.03)'
              : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 40px 60px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(251, 191, 36, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.15), inset 0 0 20px rgba(251, 191, 36, 0.02)'
          }}>
            <div className={`text-center transition-all duration-1000 delay-700 ${
              isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              <h2 className={`text-2xl md:text-3xl font-extrabold mb-2 leading-tight tracking-tight transition-colors duration-500 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Welcome, Partner in Governance
              </h2>
              <p className={`text-base leading-relaxed transition-colors duration-500 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Sign in to the VANTAGE Platform.
              </p>
            </div>
            <div className="flex-1 flex flex-col justify-center">
              <LoginForm isDarkMode={isDarkMode} />
            </div>
            <p className={`text-sm text-center mt-4 transition-all duration-1000 delay-1000 ${
              isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            } ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              For account assistance, please contact your DILG Administrator.
            </p>
          </div>
        </div>
      </div>
      {/* Footer */}
      <footer className={`relative z-20 w-full backdrop-blur-md py-3 px-4 transition-colors duration-500 ${
        isDarkMode 
          ? 'bg-black/50 border-t border-white/10' 
          : 'bg-white/90 border-t border-gray-200/80'
      }`}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
          <div className={`flex items-center gap-3 text-xs ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            <span>&copy; 2024 DILG-Sulop</span>
            <span className="hidden md:inline">|</span>
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Secured Platform
            </span>
          </div>
          <div className={`text-center text-xs ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            <div>Support: (02) 1234-5678 | support.vantage@dilg.gov.ph</div>
            <div className="text-xs opacity-75">Version 1.0.0 | Build 2024.01.15</div>
          </div>
        </div>
      </footer>
      <style jsx global>{`
        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-16px);
          }
          100% {
            transform: translateY(0px);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        @keyframes fade-in-blob {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 0.6;
          }
        }
        .animate-fade-in-blob {
          animation: fade-in-blob 1.2s ease-in forwards;
        }
        .animate-fade-in-blob-light {
          animation: fade-in-blob 1.2s 0.5s ease-in forwards;
        }
        .animate-blob {
          animation: blob 8s infinite linear alternate;
        }
        @keyframes blob {
          0% {
            transform: scale(1) translate(0px, 0px);
          }
          33% {
            transform: scale(1.1, 0.9) translate(30px, -20px);
          }
          66% {
            transform: scale(0.9, 1.1) translate(-20px, 30px);
          }
          100% {
            transform: scale(1) translate(0px, 0px);
          }
        }
        .animation-delay-800 {
          animation-delay: 0.8s;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
