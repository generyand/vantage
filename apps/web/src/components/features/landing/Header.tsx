"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export function Header() {
  // Smooth scroll function with header offset
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerHeight = 64; // Height of the sticky header (h-16 = 64px)
      const elementPosition = element.offsetTop - headerHeight;

      window.scrollTo({
        top: elementPosition,
        behavior: "smooth",
      });
    }
  };
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
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
                SGLGB Pre-Assessment for Sulop
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection("home")}
              className="text-black hover:text-[#fbbf24] hover:font-semibold transition-all duration-200 cursor-pointer bg-transparent border-none outline-none p-0"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection("problems")}
              className="text-black hover:text-[#fbbf24] hover:font-semibold transition-all duration-200 cursor-pointer bg-transparent border-none outline-none p-0"
            >
              The Challenge
            </button>
            <button
              onClick={() => scrollToSection("process")}
              className="text-black hover:text-[#fbbf24] hover:font-semibold transition-all duration-200 cursor-pointer bg-transparent border-none outline-none p-0"
            >
              The Workflow
            </button>
            <button
              onClick={() => scrollToSection("coverage")}
              className="text-black hover:text-[#fbbf24] hover:font-semibold transition-all duration-200 cursor-pointer bg-transparent border-none outline-none p-0"
            >
              Coverage
            </button>
          </nav>

          {/* CTA Button */}
          <div className="flex items-center">
            <Link href="/login">
              <Button className="bg-[#fbbf24] text-black hover:bg-[#fbbf24]/90 transition-colors duration-200 font-medium px-6 py-2 border-0">
                Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
