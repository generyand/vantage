"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

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
          <Image
            src="/DILG.png"
            alt="DILG Logo"
            width={40}
            height={40}
            className="rounded-full bg-white border border-gray-200 object-contain"
          />
          <div className="flex flex-col">
            <span className="font-extrabold text-xl tracking-tight text-[#b91c1c] leading-tight">
              VANTAGE
            </span>
            <span className="text-xs text-gray-700 font-medium">
              SGLGB Strategic Analytics Platform
            </span>
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
        <section className="w-full max-w-7xl mx-auto px-8 pt-20 pb-16 flex flex-col md:flex-row items-center gap-8">
          {/* Left: Text */}
          <div className="flex-1 flex flex-col items-start justify-center max-w-xl text-left">
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#212529] mb-4 leading-tight">
              Empowering Barangay Governance.
              <br />
              <span className="text-[#b91c1c]">
                Streamlining SGLGB Success.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-700 mb-8">
              The official pre-assessment and analytics web application for the
              Municipality of Sulop&apos;s Seal of Good Local Governance for
              Barangays program.
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
            <div className="w-full max-w-xl md:max-w-2xl rounded-2xl shadow-lg overflow-hidden">
              <img
                src="/Sulop_Hall.png"
                alt="Sulop Municipal Hall"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* Challenge Section */}
        <section className="w-full max-w-7xl mx-auto px-8 py-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
            Bridging the Gap Between Preparation and National Validation
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center text-center border border-gray-100">
              {/* Icon: Paper files */}
              <svg
                className="w-10 h-10 text-[#b91c1c] mb-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 17v-2a2 2 0 012-2h2a2 2 0 012 2v2m-6 0h6m-6 0a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2m-6 0v2a2 2 0 002 2h4a2 2 0 002-2v-2"
                />
              </svg>
              <h3 className="font-semibold text-lg mb-2">
                Inefficient Manual Processes
              </h3>
              <p className="text-gray-600 text-sm">
                Moving beyond paper-based checklists and physical document
                submissions to a secure, centralized digital workflow.
              </p>
            </div>
            <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center text-center border border-gray-100">
              {/* Icon: Magnifying glass with a red X */}
              <svg
                className="w-10 h-10 text-[#dc3545] mb-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="8" />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35M13 9l-4 4m0-4l4 4"
                />
              </svg>
              <h3 className="font-semibold text-lg mb-2">
                Lack of Proactive Tools
              </h3>
              <p className="text-gray-600 text-sm">
                Providing barangays with a powerful self-assessment tool to
                identify and rectify weaknesses before the official audit.
              </p>
            </div>
            <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center text-center border border-gray-100">
              {/* Icon: Chart with a gap */}
              <svg
                className="w-10 h-10 text-[#d97706] mb-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 17v-6a2 2 0 012-2h2a2 2 0 012 2v6m0 0v-2a2 2 0 012-2h2a2 2 0 012 2v2m0 0v-4a2 2 0 012-2h2a2 2 0 012 2v4"
                />
              </svg>
              <h3 className="font-semibold text-lg mb-2">
                Improving Pass Rates
              </h3>
              <p className="text-gray-600 text-sm">
                Addressing the discrepancy between local and national validation
                results by ensuring submissions meet the highest standards of
                quality and completeness.
              </p>
            </div>
          </div>
        </section>

        {/* Key Features Section */}
        <section className="w-full max-w-7xl mx-auto px-8 py-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 text-center">
            A Modern Toolkit for Data-Driven Governance
          </h2>
          <p className="text-lg text-gray-500 text-center mb-8">
            Everything you need for SGLGB success, in one platform.
          </p>
          <div className="flex flex-col md:flex-row md:items-center gap-8">
            {/* Left: Image */}
            <div className="flex-1 flex justify-center">
              <img
                src="/Day_Care_Center.jpg"
                alt="Day Care Center"
                className="w-full max-w-xl md:max-w-2xl rounded-2xl shadow-lg object-cover"
              />
            </div>
            {/* Right: Feature Boxes */}
            <div className="flex-1 flex flex-col gap-6 justify-center">
              <div className="bg-white shadow-lg flex items-center gap-6 pr-6 pb-3 border-l-8 border-primary pl-6 transition-all duration-200 hover:shadow-xl hover:-translate-y-1 rounded-t-xl">
                <img
                  src="/Toolkit/assessment.jpg"
                  alt="Guided Self-Assessment"
                  className="w-24 h-24 md:w-28 md:h-28 rounded-xl object-cover transition-transform duration-200 hover:scale-105 hover:rotate-3"
                />
                <div>
                  <h3 className="font-bold text-lg mb-1">
                    Guided Self-Assessment
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    A step-by-step workflow for BLGUs to complete their
                    Self-Evaluation Document (SED) and upload all required Means
                    of Verification (MOVs) with confidence.
                  </p>
                </div>
              </div>
              <div className="bg-white shadow-lg flex items-center gap-6 pr-6 pb-3 pt-3 border-l-8 border-primary pl-6 transition-all duration-200 hover:shadow-xl hover:-translate-y-1">
                <img
                  src="/Toolkit/rework.jpg"
                  alt="Structured Validation & Rework"
                  className="w-24 h-24 md:w-28 md:h-28 rounded-xl object-cover transition-transform duration-200 hover:scale-105 hover:rotate-3"
                />
                <div>
                  <h3 className="font-bold text-lg mb-1">
                    Structured Validation & Rework
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    An efficient interface for DILG Area Assessors to review
                    submissions, provide consolidated feedback, and manage a
                    single, streamlined rework cycle.
                  </p>
                </div>
              </div>
              <div className="bg-white shadow-lg flex items-center gap-6 pr-6 pb-3 border-l-8 border-primary pl-6 transition-all duration-200 hover:shadow-xl hover:-translate-y-1 rounded-b-xl">
                <img
                  src="/Toolkit/analytics.jpg"
                  alt="Powerful Analytics & AI Insights"
                  className="w-24 h-24 md:w-28 md:h-28 rounded-xl object-cover transition-transform duration-200 hover:scale-105 hover:rotate-3"
                />
                <div>
                  <h3 className="font-bold text-lg mb-1">
                    Powerful Analytics & AI Insights
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    A high-level dashboard with cross-matching analysis and
                    AI-generated CapDev recommendations to support strategic
                    decision-making.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section (Interactive Stepper) */}
        <section className="w-full max-w-7xl mx-auto px-8 py-12">
          {(() => {
            const steps = [
              {
                label: "Prepare & Submit",
                color: "bg-[#dc2626]",
                text: "BLGU Users complete their pre-assessment and upload all required documents through the guided digital workflow.",
                image: (
                  <img
                    src="/Toolkit/assessment.jpg"
                    alt="Prepare & Submit"
                    className="w-40 h-40 object-cover rounded-xl border-2 border-gray-200 bg-white"
                  />
                ),
              },
              {
                label: "Validate & Calibrate",
                color: "bg-[#f59e42]",
                text: "DILG Area Assessors review the submissions for quality and provide a single, consolidated list of feedback for a one-time rework cycle.",
                image: (
                  <img
                    src="/Toolkit/rework.jpg"
                    alt="Validate & Calibrate"
                    className="w-40 h-40 object-cover rounded-xl border-2 border-gray-200 bg-white"
                  />
                ),
              },
              {
                label: "Analyze & Improve",
                color: "bg-[#22c55e]",
                text: "The MLGOO-DILG records the final, official result and uses the system's analytics and AI-powered insights to drive strategic improvements in local governance.",
                image: (
                  <img
                    src="/Toolkit/analytics.jpg"
                    alt="Analyze & Improve"
                    className="w-40 h-40 object-cover rounded-xl border-2 border-gray-200 bg-white"
                  />
                ),
              },
            ];
            const [activeStep, setActiveStep] = useState(0);
            const [fade, setFade] = useState(false);
            const stepsLength = steps.length;
            const timerRef = useRef<NodeJS.Timeout | null>(null);
            useEffect(() => {
              setFade(true);
              const fadeTimeout = setTimeout(() => setFade(false), 500); // match duration-500
              if (timerRef.current) clearInterval(timerRef.current);
              timerRef.current = setInterval(() => {
                setActiveStep((prev) => (prev + 1) % stepsLength);
              }, 5000);
              return () => {
                clearTimeout(fadeTimeout);
                if (timerRef.current) clearInterval(timerRef.current);
              };
            }, [activeStep, stepsLength]);
            return (
              <div className="flex flex-col md:flex-row items-stretch gap-8">
                {/* Left: Stepper */}
                <div className="flex flex-col justify-center items-end md:w-1/4 mb-6 md:mb-0">
                  <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight text-right mb-8">
                    Three
                    <br /> 
                    Step
                    <br />
                    Process
                  </h2>
                  <div className="flex flex-col gap-0 w-full bg-white shadow rounded-l-xl border border-gray-200">
                    {steps.map((step, idx) => (
                      <button
                        key={idx}
                        className={`flex items-center w-full px-6 py-4 text-left transition-all duration-150 focus:outline-none border-b border-gray-100 last:border-b-0 ${
                          activeStep === idx
                            ? `bg-gray-50 cursor-default z-10`
                            : "bg-white hover:bg-gray-50 cursor-pointer"
                        } ${idx === 0 ? "rounded-tl-xl" : ""} ${
                          idx === steps.length - 1 ? "rounded-bl-xl" : ""
                        }`}
                        onClick={() => {
                          setActiveStep(idx);
                          if (timerRef.current) clearInterval(timerRef.current);
                        }}
                        disabled={activeStep === idx}
                        style={{
                          borderRight: activeStep === idx ? "none" : undefined,
                        }}
                      >
                        <span
                          className={`flex items-center justify-center w-10 h-10 rounded-full text-white font-bold text-xl mr-4 ${step.color}`}
                        >
                          {idx + 1}
                        </span>
                        <span className="font-semibold text-gray-800 text-lg">
                          {step.label}
                        </span>
                      </button>
                    ))} 
                  </div>
                </div>
                {/* Right: Active Step Content */}
                <div
                  key={activeStep}
                  className={`flex-1 bg-white shadow rounded-r-xl border border-gray-200 flex flex-col md:flex-row items-center px-8 py-8 transition-opacity duration-500 ${
                    fade ? "opacity-0" : "opacity-100"
                  } ${
                    activeStep === 0
                      ? "bg-[#fff5f5]"
                      : activeStep === 1
                      ? "bg-[#fffbea]"
                      : "bg-[#e6fff3]"
                  }`}
                  style={{ minHeight: 280 }}
                >
                  <div className="flex-1 text-gray-800 text-lg font-normal leading-relaxed md:pr-8 mb-8 md:mb-0">
                    {steps[activeStep].text}
                  </div>
                  <div className="flex-shrink-0 flex items-center justify-center">
                    {steps[activeStep].image}
                  </div>
                </div>
              </div>
            );
          })()}
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-20 w-full bg-white/80 border-t border-gray-200 py-4 px-4 flex flex-col md:flex-row items-center justify-between text-base text-gray-500 gap-2 mt-8">
        <div className="flex items-center gap-3">
          <Image
            src="/DILG.png"
            alt="DILG Logo"
            width={40}
            height={40}
            className="rounded-full bg-white border border-gray-200 object-contain"
          />
          <Image
            src="/Sulop_Municipal_Government.png"
            alt="Sulop Municipal Government Logo"
            width={40}
            height={40}
            className="rounded-full bg-white border border-gray-200 object-contain"
          />
        </div>
        <div className="text-sm">
          © 2024 Municipality of Sulop &amp; [Your Capstone Team Name]
        </div>
        <Link href="/help" className="text-sm text-[#b91c1c] hover:underline">
          Help &amp; Support
        </Link>
      </footer>
    </div>
  );
}
