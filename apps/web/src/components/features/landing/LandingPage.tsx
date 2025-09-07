"use client";

import {
  BarangaysSection,
  ChallengeSection,
  FeaturesSection,
  Footer as OldFooter,
  HeroSection as OldHeroSection,
  ProcessSection,
} from "@/components/features/landing-page";
import { Header } from "./Header";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Decorative background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#fecaca] rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#fed7aa] rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-[#e2e8f0] rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10">
        <Header />
        <OldHeroSection />
        <ChallengeSection />
        <FeaturesSection />
        <ProcessSection />
        <BarangaysSection />
        <OldFooter />
      </div>
    </div>
  );
}
