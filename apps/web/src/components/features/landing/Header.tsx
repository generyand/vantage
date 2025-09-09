"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";

export function Header() {
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Product Name */}
          <div className="flex items-center space-x-3">
            <Image
              src="/officialLogo/MLGRC.webp"
              alt="MLGRC Davao del Sur official logo"
              width={32}
              height={32}
              className="object-contain"
            />
            <div className="leading-tight">
              <div className="font-extrabold text-base md:text-lg tracking-tight text-black">
                VANTAGE
              </div>
              <div className="text-[10px] md:text-xs text-gray-500">
                SGLGB Strategic Analytics Platform
              </div>
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
              href="#process"
              className="text-gray-700 hover:text-[#fbbf24] transition-colors"
            >
              How It Works
            </a>
            <a
              href="#coverage"
              className="text-gray-700 hover:text-[#fbbf24] transition-colors"
            >
              Coverage
            </a>
          </nav>

          {/* CTA Button */}
          <div className="flex items-center">
            <Button
              variant="outline"
              className="border-[#fbbf24] text-[#fbbf24] hover:bg-[#fbbf24] hover:text-black"
            >
              Sign In
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
