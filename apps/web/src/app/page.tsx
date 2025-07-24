

import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-br from-[#f8f9fa] via-[#fff5f5] to-[#fff7ed] overflow-x-hidden">
      {/* Decorative Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* top right */}
        <div className="absolute -top-40 -right-40 w-60 h-60 bg-[#fecaca] rounded-full mix-blend-multiply filter blur-xl animate-fade-in-blob animation-delay-800 animate-blob"></div>
        {/* bottom left */}
        <div className="absolute -bottom-40 -left-40 w-60 h-60 bg-[#fed7aa] rounded-full mix-blend-multiply filter blur-xl animate-fade-in-blob animation-delay-2000 animate-blob"></div>
        {/* top left */}
        <div className="absolute top-40 left-40 w-60 h-60 bg-[#e2e8f0] rounded-full mix-blend-multiply filter blur-xl animate-fade-in-blob-light animation-delay-4000 animate-blob"></div>
      </div>

      {/* Navbar */}
      <nav className="relative z-10 w-full flex items-center justify-between px-6 py-4 bg-white/80 border-b border-gray-200 shadow-sm">
        <div className="flex items-center gap-3">
          <Image src="/DILG.png" alt="DILG Logo" width={40} height={40} className="rounded-full bg-white border border-gray-200 object-contain" />
          <div className="flex flex-col">
            <span className="font-extrabold text-xl tracking-tight text-[#b91c1c] leading-tight">VANTAGE</span>
            <span className="text-xs text-gray-700 font-medium">SGLGB Strategic Analytics Platform</span>
          </div>
        </div>
        <Link href="/login">
          <button className="bg-[#b91c1c] text-white font-semibold px-6 py-2 rounded-md shadow hover:bg-[#a31b1b] transition-all text-base focus-visible:ring-2 focus-visible:ring-[#b91c1c] focus:outline-none">
            Secure Login
          </button>
        </Link>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center w-full">
        {/* Hero Section */}
        <section className="w-full flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto px-4 pt-20 pb-16 gap-8">
          {/* Left: Text */}
          <div className="flex-1 flex flex-col items-start justify-center max-w-xl text-left">
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#212529] mb-4 leading-tight">
              Empowering Barangay Governance.<br />
              <span className="text-[#b91c1c]">Streamlining SGLGB Success.</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-700 mb-8">
              The official pre-assessment and analytics web application for the Municipality of Sulop's Seal of Good Local Governance for Barangays program.
            </p>
            <div className="flex gap-4">
              <Link href="/login">
                <button className="bg-[#b91c1c] text-white font-semibold px-6 py-3 rounded-md shadow hover:bg-[#a31b1b] transition-all text-base focus-visible:ring-2 focus-visible:ring-[#b91c1c] focus:outline-none">
                  Get Started
                </button>
              </Link>
              <a href="#learn-more">
                <button className="bg-white border border-gray-300 text-[#212529] font-semibold px-6 py-3 rounded-md shadow hover:bg-gray-100 transition-all text-base">
                  Learn More
                </button>
              </a>
            </div>
          </div>
          {/* Right: Image/Card Placeholder */}
          <div className="flex-1 flex items-center justify-center min-h-[320px]">
            <div className="w-full max-w-lg aspect-[4/3] bg-gray-200 rounded-2xl shadow-inner flex items-center justify-center overflow-hidden relative">
              <Image src="/Sulop_Hall.png" alt="Sulop Municipal Hall" fill style={{objectFit: 'cover'}} className="rounded-2xl" priority />
            </div>
          </div>
        </section>

        {/* Challenge Section */}
        <section className="w-full max-w-5xl mx-auto py-12 px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">Bridging the Gap Between Preparation and National Validation</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center text-center border border-gray-100">
              {/* Icon: Paper files */}
              <svg className="w-10 h-10 text-[#b91c1c] mb-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a2 2 0 012-2h2a2 2 0 012 2v2m-6 0h6m-6 0a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2m-6 0v2a2 2 0 002 2h4a2 2 0 002-2v-2" /></svg>
              <h3 className="font-semibold text-lg mb-2">Inefficient Manual Processes</h3>
              <p className="text-gray-600 text-sm">Moving beyond paper-based checklists and physical document submissions to a secure, centralized digital workflow.</p>
            </div>
            <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center text-center border border-gray-100">
              {/* Icon: Magnifying glass with a red X */}
              <svg className="w-10 h-10 text-[#dc3545] mb-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M13 9l-4 4m0-4l4 4" /></svg>
              <h3 className="font-semibold text-lg mb-2">Lack of Proactive Tools</h3>
              <p className="text-gray-600 text-sm">Providing barangays with a powerful self-assessment tool to identify and rectify weaknesses before the official audit.</p>
            </div>
            <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center text-center border border-gray-100">
              {/* Icon: Chart with a gap */}
              <svg className="w-10 h-10 text-[#d97706] mb-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 17v-6a2 2 0 012-2h2a2 2 0 012 2v6m0 0v-2a2 2 0 012-2h2a2 2 0 012 2v2m0 0v-4a2 2 0 012-2h2a2 2 0 012 2v4" /></svg>
              <h3 className="font-semibold text-lg mb-2">Improving Pass Rates</h3>
              <p className="text-gray-600 text-sm">Addressing the discrepancy between local and national validation results by ensuring submissions meet the highest standards of quality and completeness.</p>
            </div>
          </div>
        </section>

        {/* Key Features Section */}
        <section className="w-full max-w-5xl mx-auto py-12 px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">A Modern Toolkit for Data-Driven Governance</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1: For BLGUs */}
            <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center text-center border border-gray-100">
              {/* Icon: Upload Cloud */}
              <svg className="w-10 h-10 text-[#b91c1c] mb-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M7 16v-4a4 4 0 018 0v4m-4-4v8m0-8l-3 3m3-3l3 3" /></svg>
              <h3 className="font-semibold text-lg mb-2">Guided Self-Assessment</h3>
              <p className="text-gray-600 text-sm">A step-by-step workflow for BLGUs to complete their Self-Evaluation Document (SED) and upload all required Means of Verification (MOVs) with confidence.</p>
            </div>
            {/* Card 2: For Assessors */}
            <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center text-center border border-gray-100">
              {/* Icon: Checkmark Shield */}
              <svg className="w-10 h-10 text-[#28a745] mb-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5a2 2 0 00-2-2H6a2 2 0 00-2 2v7c0 6 8 10 8 10z" /><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" /></svg>
              <h3 className="font-semibold text-lg mb-2">Structured Validation & Rework</h3>
              <p className="text-gray-600 text-sm">An efficient interface for DILG Area Assessors to review submissions, provide consolidated feedback, and manage a single, streamlined rework cycle.</p>
            </div>
            {/* Card 3: For the MLGOO-DILG */}
            <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center text-center border border-gray-100">
              {/* Icon: Bar Chart / AI Bot */}
              <svg className="w-10 h-10 text-[#d97706] mb-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 17v-6a2 2 0 012-2h2a2 2 0 012 2v6m0 0v-2a2 2 0 012-2h2a2 2 0 012 2v2m0 0v-4a2 2 0 012-2h2a2 2 0 012 2v4" /></svg>
              <h3 className="font-semibold text-lg mb-2">Powerful Analytics & AI Insights</h3>
              <p className="text-gray-600 text-sm">A high-level dashboard with cross-matching analysis and AI-generated CapDev recommendations to support strategic decision-making.</p>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="w-full max-w-4xl mx-auto py-12 px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">A Simple, Three-Step Process</h2>
          <ol className="space-y-8">
            <li className="flex flex-col md:flex-row items-center gap-6">
              <span className="flex-shrink-0 w-12 h-12 rounded-full bg-[#b91c1c] text-white flex items-center justify-center text-2xl font-bold">1</span>
              <div className="flex-1 text-center md:text-left">
                <h4 className="font-semibold text-lg mb-1">Prepare & Submit</h4>
                <p className="text-gray-600 text-sm">BLGU Users complete their pre-assessment and upload all required documents through the guided digital workflow.</p>
              </div>
            </li>
            <li className="flex flex-col md:flex-row items-center gap-6">
              <span className="flex-shrink-0 w-12 h-12 rounded-full bg-[#d97706] text-white flex items-center justify-center text-2xl font-bold">2</span>
              <div className="flex-1 text-center md:text-left">
                <h4 className="font-semibold text-lg mb-1">Validate & Calibrate</h4>
                <p className="text-gray-600 text-sm">DILG Area Assessors review the submissions for quality and provide a single, consolidated list of feedback for a one-time rework cycle.</p>
              </div>
            </li>
            <li className="flex flex-col md:flex-row items-center gap-6">
              <span className="flex-shrink-0 w-12 h-12 rounded-full bg-[#28a745] text-white flex items-center justify-center text-2xl font-bold">3</span>
              <div className="flex-1 text-center md:text-left">
                <h4 className="font-semibold text-lg mb-1">Analyze & Improve</h4>
                <p className="text-gray-600 text-sm">The MLGOO-DILG records the final, official result and uses the system's analytics and AI-powered insights to drive strategic improvements in local governance.</p>
              </div>
            </li>
          </ol>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-20 w-full bg-white/80 border-t border-gray-200 py-4 px-4 flex flex-col md:flex-row items-center justify-between text-base text-gray-500 gap-2 mt-8">
        <div className="flex items-center gap-3">
          <Image src="/DILG.png" alt="DILG Logo" width={40} height={40} className="rounded-full bg-white border border-gray-200 object-contain" />
          <Image src="/Sulop_Municipal_Government.png" alt="Sulop Municipal Government Logo" width={40} height={40} className="rounded-full bg-white border border-gray-200 object-contain" />
        </div>
        <div className="text-sm">© 2024 Municipality of Sulop &amp; [Your Capstone Team Name]</div>
        <Link href="/help" className="text-sm text-[#b91c1c] hover:underline">Help &amp; Support</Link>
      </footer>
    </div>
  );
}
