"use client";
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState, useEffect, useRef } from "react";
import { HeroSection, ChallengeSection, FeaturesSection, ProcessSection, BarangaysSection, Footer } from "@/components/features/landing-page";

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

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col bg-white">
      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(45deg); }
          to { transform: rotate(405deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 4s linear infinite;
        }
      `}</style>

      {/* Hero Section */}
      <HeroSection />

      {/* Challenge Section */}
      <ChallengeSection />

            {/* Features Section */}
      <FeaturesSection />

      {/* Process Section */}
      <ProcessSection />

      {/* Barangays Section */}
      <BarangaysSection />

      {/* Rest of the content sections with updated theme */}
      <main className="relative z-10 flex-1 flex flex-col items-center w-full bg-white">
          
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
