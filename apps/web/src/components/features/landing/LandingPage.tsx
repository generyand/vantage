"use client";

import {
  BarangaysSection,
  ChallengeSection,
  Footer as OldFooter,
  ProcessSection,
} from "@/components/features/landing-page";
import { Header } from "./Header";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Clean background - no blobs */}

      {/* Main content */}
      <div className="relative z-10">
        <Header />
        {/* Blank hero area for /landing */}
        <section id="home" className="min-h-screen" />
        <div id="problems" className="bg-gray-50">
          <ChallengeSection />
        </div>
        {/* Features section removed for /landing */}
        <div id="process" className="bg-white">
          <ProcessSection />
        </div>
        <div id="coverage" className="bg-white">
          <BarangaysSection />
        </div>
        <OldFooter />
      </div>
    </div>
  );
}
