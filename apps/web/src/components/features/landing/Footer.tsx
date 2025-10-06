"use client";

import { Facebook, Instagram, Mail, Shield, Twitter } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// Custom hook for scroll animations
function useScrollAnimation() {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    const currentElement = elementRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, []);

  return { elementRef, isVisible };
}

export function Footer() {
  const footerAnimation = useScrollAnimation();

  return (
    <footer
      ref={footerAnimation.elementRef}
      className={`relative z-20 w-full bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white py-16 px-8 transition-all duration-1000 overflow-hidden ${
        footerAnimation.isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-8"
      }`}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 border border-[#fbbf24] rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 border border-[#f59e0b] rounded-full"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 border border-[#d97706] rounded-full"></div>
        <div className="absolute bottom-10 left-1/3 w-20 h-20 border border-[#fbbf24] rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Column 1: University Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="relative group">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#fbbf24] to-[#f59e0b] rounded-full flex items-center justify-center shadow-lg border border-gray-600/30 group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                    <span className="text-black font-bold text-lg">UM</span>
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#fbbf24]/20 to-[#f59e0b]/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="relative group">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#fbbf24] to-[#f59e0b] rounded-full flex items-center justify-center shadow-lg border border-gray-600/30 group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                    <span className="text-black font-bold text-lg">DTP</span>
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#fbbf24]/20 to-[#f59e0b]/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Department of Technical Program
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                University of Mindanao Digos College - Digos City, Philippines
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-sm p-3 backdrop-blur-sm border border-white/10">
                <div className="text-lg font-bold text-[#fbbf24]">500+</div>
                <div className="text-xs text-gray-400">Active Users</div>
              </div>
              <div className="bg-white/5 rounded-sm p-3 backdrop-blur-sm border border-white/10">
                <div className="text-lg font-bold text-[#f59e0b]">99.9%</div>
                <div className="text-xs text-gray-400">Uptime</div>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-[#fbbf24] to-[#f59e0b] rounded-full"></div>
              Quick Navigation
            </h3>
            <div className="space-y-3">
              <a
                href="#home"
                className="flex items-center gap-3 text-gray-400 hover:text-[#fbbf24] transition-all duration-300 group hover:translate-x-1"
              >
                <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center group-hover:bg-[#fbbf24]/20 transition-colors duration-300">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
                <span className="font-medium">Home</span>
              </a>
              <a
                href="#problems"
                className="flex items-center gap-3 text-gray-400 hover:text-[#fbbf24] transition-all duration-300 group hover:translate-x-1"
              >
                <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center group-hover:bg-[#fbbf24]/20 transition-colors duration-300">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
                <span className="font-medium">Problems</span>
              </a>
              <a
                href="#how-it-works"
                className="flex items-center gap-3 text-gray-400 hover:text-[#fbbf24] transition-all duration-300 group hover:translate-x-1"
              >
                <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center group-hover:bg-[#fbbf24]/20 transition-colors duration-300">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
                <span className="font-medium">How It Works</span>
              </a>
              <a
                href="#faq"
                className="flex items-center gap-3 text-gray-400 hover:text-[#fbbf24] transition-all duration-300 group hover:translate-x-1"
              >
                <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center group-hover:bg-[#fbbf24]/20 transition-colors duration-300">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
                <span className="font-medium">FAQ</span>
              </a>
            </div>
          </div>

          {/* Column 3: Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-[#f59e0b] to-[#d97706] rounded-full"></div>
              Contact & Support
            </h3>
            <div className="space-y-4">
              <div className="bg-white/5 rounded-sm p-4 backdrop-blur-sm border border-white/10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-[#fbbf24]/20 rounded-lg flex items-center justify-center">
                    <Mail className="w-4 h-4 text-[#fbbf24]" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">
                      Email Support
                    </div>
                    <div className="text-xs text-gray-400">
                      Department Contact
                    </div>
                  </div>
                </div>
                <a
                  href="mailto:dtp.dc@umindanao.edu.ph"
                  className="text-[#fbbf24] hover:text-[#f59e0b] font-medium text-sm transition-colors duration-300 hover:underline"
                >
                  dtp.dc@umindanao.edu.ph
                </a>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Shield className="w-4 h-4 text-green-500" />
                <span>Secure & Verified Platform</span>
              </div>
            </div>
          </div>

          {/* Column 4: Social Media & Updates */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-[#d97706] to-[#b45309] rounded-full"></div>
              Stay Connected
            </h3>

            {/* Social Media */}
            <div>
              <p className="text-gray-400 text-sm mb-4">
                Follow us for updates and announcements
              </p>
              <div className="flex gap-3">
                <a
                  href="#"
                  className="w-10 h-10 bg-white/10 hover:bg-[#fbbf24] rounded-lg flex items-center justify-center text-white hover:text-black transition-all duration-300 hover:scale-110 hover:shadow-lg backdrop-blur-sm border border-white/20 group"
                  aria-label="Follow us on Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-white/10 hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-500 rounded-lg flex items-center justify-center text-white transition-all duration-300 hover:scale-110 hover:shadow-lg backdrop-blur-sm border border-white/20 group"
                  aria-label="Follow us on Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-white/10 hover:bg-blue-400 rounded-lg flex items-center justify-center text-white transition-all duration-300 hover:scale-110 hover:shadow-lg backdrop-blur-sm border border-white/20 group"
                  aria-label="Follow us on Twitter"
                >
                  <Twitter className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Status Indicators */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-gray-300">System Online</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-[#fbbf24] rounded-full animate-pulse"></div>
                <span className="text-gray-300">Live Application</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-300">Version 1.0</span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Bottom Section */}
        <div className="border-t border-gray-700/50 pt-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* Left: Copyright */}
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <div className="w-8 h-8 bg-[#fbbf24]/20 rounded-lg flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-[#fbbf24]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <div className="font-medium text-white">
                  © 2025 Department of Technical Program
                </div>
                <div className="text-xs">
                  All Rights Reserved • Developed by GEVIAS
                </div>
              </div>
            </div>

            {/* Right: Additional Info */}
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-[#fbbf24]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <span>SSL Secured</span>
              </div>
              <div className="hidden md:block w-px h-4 bg-gray-600"></div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>University Verified</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
