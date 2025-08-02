"use client";

import {
  HeroSection,
  ChallengeSection,
  FeaturesSection,
  ProcessSection,
  BarangaysSection,
  Footer,
} from "@/components/features/landing-page";

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col bg-white">
      <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: rotate(45deg);
          }
          to {
            transform: rotate(405deg);
          }
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

      {/* Footer */}
      <Footer />
    </div>
  );
}
