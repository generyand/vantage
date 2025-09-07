"use client";

import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and University Name */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#fbbf24] to-[#f59e0b] rounded-full flex items-center justify-center">
              <span className="text-black font-bold text-lg">UM</span>
            </div>
            <div>
              <h1 className="text-sm font-semibold text-gray-900">
                Department of Technical Program
              </h1>
              <p className="text-xs text-gray-600">
                University of Mindanao Digos College
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="#home"
              className="text-gray-700 hover:text-[#fbbf24] transition-colors"
            >
              Home
            </a>
            <a
              href="#problems"
              className="text-gray-700 hover:text-[#fbbf24] transition-colors"
            >
              Problems
            </a>
            <a
              href="#how-it-works"
              className="text-gray-700 hover:text-[#fbbf24] transition-colors"
            >
              How It Works
            </a>
            <a
              href="#faq"
              className="text-gray-700 hover:text-[#fbbf24] transition-colors"
            >
              FAQ
            </a>
          </nav>

          {/* CTA Buttons */}
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              className="border-[#fbbf24] text-[#fbbf24] hover:bg-[#fbbf24] hover:text-black"
            >
              Join Event
            </Button>
            <Button
              variant="ghost"
              className="text-gray-700 hover:text-[#fbbf24]"
            >
              Sign In
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
