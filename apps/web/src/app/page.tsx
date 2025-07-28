"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

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
  // Move hooks to the top level of the component
  const [activeStep, setActiveStep] = useState(0);
  const [fade, setFade] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Scroll animation hooks for each section
  const heroAnimation = useScrollAnimation();
  const challengeAnimation = useScrollAnimation();
  const featuresAnimation = useScrollAnimation();
  const processAnimation = useScrollAnimation();
  const footerAnimation = useScrollAnimation();

  // Define steps data at the top level
  const steps = [
    {
      label: "Prepare & Submit",
      color: "bg-[#b91c1c]",
      text: "BLGU Users complete their pre-assessment and upload all required documents through the guided digital workflow.",
      backgroundImage: "/Scenery/1.jpg",
      icon: "📄",
      duration: "5-10 minutes",
      benefit: "Ensures complete documentation",
    },
    {
      label: "Validate & Calibrate",
      color: "bg-[#f59e42]",
      text: "DILG Area Assessors review the submissions for quality and provide a single, consolidated list of feedback for a one-time rework cycle.",
      backgroundImage: "/Scenery/2.jpg",
      icon: "✅",
      duration: "2-3 days",
      benefit: "Quality assurance & feedback",
    },
    {
      label: "Analyze & Improve",
      color: "bg-[#22c55e]",
      text: "The MLGOO-DILG records the final, official result and uses the system's analytics and AI-powered insights to drive strategic improvements in local governance.",
      backgroundImage: "/Scenery/3.jpg",
      icon: "📊",
      duration: "Ongoing",
      benefit: "Data-driven insights",
    },
  ];

  const stepsLength = steps.length;

  useEffect(() => {
    setFade(true);
    const fadeTimeout = setTimeout(() => setFade(false), 500); // match duration-500
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % stepsLength);
    }, 7000);
    return () => {
      clearTimeout(fadeTimeout);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeStep, stepsLength]);

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-br from-[#f8f9fa] via-[#fff5f5] to-[#fff7ed]">
      {/* Decorative Blobs */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* top right */}
        <div className="absolute top-0 right-0 w-60 h-60 bg-[#fecaca] rounded-full mix-blend-multiply filter blur-xl animate-fade-in-blob animation-delay-800 animate-blob transform translate-x-1/2 -translate-y-1/2"></div>
        {/* bottom left */}
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-[#fed7aa] rounded-full mix-blend-multiply filter blur-xl animate-fade-in-blob animation-delay-2000 animate-blob transform -translate-x-1/2 translate-y-1/2"></div>
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
          <button className="group bg-gradient-to-r from-[#b91c1c] to-[#dc2626] text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 text-base focus-visible:ring-2 focus-visible:ring-[#b91c1c] focus:outline-none transform hover:scale-105 active:scale-95 border border-[#b91c1c]/20 hover:border-[#b91c1c]/40">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Secure Login
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </button>
        </Link>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center w-full">
        {/* Hero Section */}
        <section 
          ref={heroAnimation.elementRef}
          className={`w-full max-w-7xl mx-auto px-8 pt-24 pb-20 flex flex-col md:flex-row items-center gap-12 transition-all duration-1000 ${
            heroAnimation.isVisible 
              ? "opacity-100 translate-y-0" 
              : "opacity-0 translate-y-8"
          }`}
        >
          {/* Left: Text */}
          <div className={`flex-1 flex flex-col items-start justify-center max-w-xl text-left transition-all duration-1000 delay-200 ${
            heroAnimation.isVisible 
              ? "opacity-100 translate-x-0" 
              : "opacity-0 -translate-x-8"
          }`}>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#b91c1c]/10 to-[#dc2626]/10 border border-[#b91c1c]/20 rounded-full text-[#b91c1c] text-sm font-semibold mb-6">
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
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Official SGLGB Platform
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold text-[#212529] mb-6 leading-tight">
              Empowering Barangay Governance.
              <br />
              <span className="text-[#b91c1c]">Achieving SGLGB Success.</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 mb-10 leading-relaxed">
              The official pre-assessment and analytics web application for the
              Municipality of Sulop&apos;s Seal of Good Local Governance for
              Barangays program.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link href="/login">
                <button className="group bg-gradient-to-r from-[#b91c1c] to-[#dc2626] text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 text-lg focus-visible:ring-2 focus-visible:ring-[#b91c1c] focus:outline-none transform hover:scale-105 active:scale-95">
                  <span className="flex items-center gap-2">
                    Get Started
                    <svg
                      className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </span>
                </button>
              </Link>
              <a href="#learn-more">
                <button className="group bg-white border-2 border-gray-200 text-[#212529] font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg hover:border-[#b91c1c]/30 hover:bg-[#b91c1c]/5">
                  <span className="flex items-center gap-2">
                    Learn More
                    <svg
                      className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </span>
                </button>
              </a>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-[#b91c1c]"
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
                Secure & Compliant
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-[#b91c1c]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                AI-Powered Analytics
              </div>
            </div>
          </div>

          {/* Right: Image with enhanced styling */}
          <div className={`flex-1 flex items-center justify-center min-h-[400px] transition-all duration-1000 delay-400 ${
            heroAnimation.isVisible 
              ? "opacity-100 translate-x-0" 
              : "opacity-0 translate-x-8"
          }`}>
            <div className="relative group">
              {/* Background glow */}
              <div className="absolute -inset-4 bg-gradient-to-r from-[#b91c1c]/20 to-[#dc2626]/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>

              {/* Image container */}
              <div className="relative w-full max-w-xl md:max-w-2xl rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-500 group-hover:scale-105 group-hover:shadow-3xl">
                <img
                  src="/Sulop_Hall.png"
                  alt="Sulop Municipal Hall"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>

              {/* Floating badge */}
              <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-lg px-4 py-2 border border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#22c55e] rounded-full animate-pulse"></div>
                  <span className="text-sm font-semibold text-gray-700">
                    Live Platform
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Challenge Section */}
        <section 
          ref={challengeAnimation.elementRef}
          className={`w-full max-w-7xl mx-auto px-8 py-16 transition-all duration-1000 ${
            challengeAnimation.isVisible 
              ? "opacity-100 translate-y-0" 
              : "opacity-0 translate-y-8"
          }`}
        >
          <div className={`text-center mb-12 transition-all duration-1000 delay-200 ${
            challengeAnimation.isVisible 
              ? "opacity-100 translate-y-0" 
              : "opacity-0 translate-y-4"
          }`}>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Bridging the Gap Between Preparation and National Validation
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Understanding the challenges that VANTAGE was built to solve
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className={`group bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center text-center border border-gray-100 transition-all duration-1000 delay-300 hover:shadow-2xl hover:-translate-y-2 hover:border-[#b91c1c]/20 relative overflow-hidden ${
              challengeAnimation.isVisible 
                ? "opacity-100 translate-y-0" 
                : "opacity-0 translate-y-8"
            }`}>
              {/* Background accent */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#b91c1c] to-[#dc2626] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              {/* Icon: Paper files */}
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-[#b91c1c] to-[#dc2626] rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-[#b91c1c] transition-colors duration-300">
                Inefficient Manual Processes
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Moving beyond paper-based checklists and physical document
                submissions to a secure, centralized digital workflow.
              </p>
            </div>
            <div className={`group bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center text-center border border-gray-100 transition-all duration-1000 delay-400 hover:shadow-2xl hover:-translate-y-2 hover:border-[#f59e42]/20 relative overflow-hidden ${
              challengeAnimation.isVisible 
                ? "opacity-100 translate-y-0" 
                : "opacity-0 translate-y-8"
            }`}>
              {/* Background accent */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#f59e42] to-[#ea580c] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              {/* Icon: Magnifying glass with a red X */}
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-[#f59e42] to-[#ea580c] rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-[#f59e42] transition-colors duration-300">
                Lack of Proactive Tools
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Providing barangays with a powerful self-assessment tool to
                identify and rectify weaknesses before the official audit.
              </p>
            </div>
            <div className={`group bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center text-center border border-gray-100 transition-all duration-1000 delay-500 hover:shadow-2xl hover:-translate-y-2 hover:border-[#22c55e]/20 relative overflow-hidden ${
              challengeAnimation.isVisible 
                ? "opacity-100 translate-y-0" 
                : "opacity-0 translate-y-8"
            }`}>
              {/* Background accent */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#22c55e] to-[#16a34a] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              {/* Icon: Chart with a gap */}
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-[#22c55e] to-[#16a34a] rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-[#22c55e] transition-colors duration-300">
                Improving Pass Rates
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Addressing the discrepancy between local and national validation
                results by ensuring submissions meet the highest standards of
                quality and completeness.
              </p>
            </div>
          </div>
        </section>

        {/* Key Features Section */}
        <section 
          ref={featuresAnimation.elementRef}
          className={`w-full max-w-7xl mx-auto px-8 py-12 transition-all duration-1000 ${
            featuresAnimation.isVisible 
              ? "opacity-100 translate-y-0" 
              : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className={`text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center transition-all duration-1000 delay-200 ${
            featuresAnimation.isVisible 
              ? "opacity-100 translate-y-0" 
              : "opacity-0 translate-y-4"
          }`}>
            A Modern Toolkit for Data-Driven Governance
          </h2>
          <div className="flex flex-col md:flex-row md:items-center gap-8">
            {/* Left: Image */}
            <div className={`flex-1 flex items-center justify-center transition-all duration-1000 delay-300 ${
              featuresAnimation.isVisible 
                ? "opacity-100 translate-x-0" 
                : "opacity-0 -translate-x-8"
            }`}>
              <div className="w-full max-w-xl md:max-w-2xl rounded-2xl shadow-lg overflow-hidden">
                <img
                  src="/Day_Care_Center.jpg"
                  alt="Day Care Center"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            {/* Right: Feature Cards */}
            <div className={`flex-1 flex flex-col gap-6 transition-all duration-1000 delay-400 ${
              featuresAnimation.isVisible 
                ? "opacity-100 translate-x-0" 
                : "opacity-0 translate-x-8"
            }`}>
              <div className="bg-white shadow-lg rounded-t-xl flex items-center gap-6 pr-6 pb-3 pt-3 border-l-8 border-primary pl-6 transition-all duration-200 hover:shadow-xl hover:-translate-y-1">
                <img
                  src="/Toolkit/assessment.jpg"
                  alt="Guided Self-Assessment"
                  className="w-24 h-24 md:w-28 md:h-28 rounded-xl object-cover"
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Guided Self-Assessment
                  </h3>
                  <p className="text-gray-600">
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
                  className="w-24 h-24 md:w-28 md:h-28 rounded-xl object-cover"
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Structured Validation & Rework
                  </h3>
                  <p className="text-gray-600">
                    An efficient interface for DILG Area Assessors to review
                    submissions, provide consolidated feedback, and manage a
                    single, streamlined rework cycle.
                  </p>
                </div>
              </div>
              <div className="bg-white shadow-lg rounded-b-xl flex items-center gap-6 pr-6 pb-3 pt-3 border-l-8 border-primary pl-6 transition-all duration-200 hover:shadow-xl hover:-translate-y-1">
                <img
                  src="/Toolkit/analytics.jpg"
                  alt="Powerful Analytics & AI Insights"
                  className="w-24 h-24 md:w-28 md:h-28 rounded-xl object-cover"
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Powerful Analytics & AI Insights
                  </h3>
                  <p className="text-gray-600">
                    A high-level dashboard with cross-matching analysis and
                    AI-generated CapDev recommendations to support strategic
                    decision-making.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section 
          ref={processAnimation.elementRef}
          className={`w-full max-w-7xl mx-auto px-8 py-12 transition-all duration-1000 ${
            processAnimation.isVisible 
              ? "opacity-100 translate-y-0" 
              : "opacity-0 translate-y-8"
          }`}
        >
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
              {/* Progress Indicator */}
              <div className="flex items-center justify-end gap-2 mb-4">
                <span className="text-sm text-gray-600 font-medium">
                  Step {activeStep + 1} of {steps.length}
                </span>
                <div className="flex gap-1">
                  {steps.map((_, idx) => (
                    <div
                      key={idx}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        idx === activeStep
                          ? "bg-[#b91c1c] scale-125"
                          : idx < activeStep
                          ? "bg-gray-400"
                          : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-0 w-full bg-white shadow rounded-l-xl border border-gray-200">
                {steps.map((step, idx) => (
                  <button
                    key={idx}
                    className={`flex items-center w-full px-6 py-4 text-left transition-all duration-300 focus:outline-none border-b border-gray-100 last:border-b-0 transform hover:scale-105 active:scale-95 ${
                      activeStep === idx
                        ? `bg-gray-50 cursor-default z-10 shadow-lg`
                        : "bg-white hover:bg-gray-50 cursor-pointer hover:shadow-md"
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
                      className={`flex items-center justify-center w-10 h-10 rounded-full text-white font-bold text-xl mr-4 transition-all duration-300 ${
                        activeStep === idx
                          ? `${step.color} shadow-lg animate-pulse`
                          : step.color
                      }`}
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
              className={`flex-1 bg-white shadow rounded-r-xl border border-gray-200 flex items-end justify-start px-8 py-8 transition-all duration-500 ${
                fade ? "opacity-0" : "opacity-100"
              }`}
              style={{
                minHeight: 280,
                backgroundImage: `url(${steps[activeStep].backgroundImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                position: "relative",
              }}
            >
              {/* Text content positioned at bottom left with artistic background */}
              <div className="relative z-10 text-gray-900 text-lg font-normal leading-relaxed max-w-2xl mb-4 animate-in slide-in-from-bottom-4 duration-500">
                <div className="mb-4">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-white text-sm font-semibold animate-pulse ${
                      activeStep === 0
                        ? "bg-[#b91c1c]"
                        : activeStep === 1
                        ? "bg-[#f59e42]"
                        : "bg-[#22c55e]"
                    }`}
                  >
                    Step {activeStep + 1}
                  </span>
                </div>
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/50 transform transition-all duration-500 hover:scale-105 hover:shadow-2xl">
                  <p className="text-xl font-semibold leading-relaxed text-gray-900">
                    {steps[activeStep].text}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer 
        ref={footerAnimation.elementRef}
        className={`relative z-20 w-full bg-gradient-to-r from-gray-50 to-white border-t border-gray-200 py-12 px-8 mt-16 transition-all duration-1000 ${
          footerAnimation.isVisible 
            ? "opacity-100 translate-y-0" 
            : "opacity-0 translate-y-8"
        }`}
      >
        <div className="max-w-7xl mx-auto">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Left: Logos and Description */}
            <div className="flex flex-col items-start space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <Image
                    src="/DILG.png"
                    alt="DILG Logo"
                    width={50}
                    height={50}
                    className="rounded-xl bg-white shadow-lg border border-gray-200 object-contain p-2 group-hover:shadow-xl transition-all duration-300 group-hover:scale-105"
                  />
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="relative group">
                  <Image
                    src="/Sulop_Municipal_Government.png"
                    alt="Sulop Municipal Government Logo"
                    width={50}
                    height={50}
                    className="rounded-xl bg-white shadow-lg border border-gray-200 object-contain p-2 group-hover:shadow-xl transition-all duration-300 group-hover:scale-105"
                  />
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#b91c1c]/20 to-[#dc2626]/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  VANTAGE Web Application
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Empowering local governance through digital innovation and
                  data-driven insights for the Seal of Good Local Governance for
                  Barangays program.
                </p>
              </div>
            </div>

            {/* Center: Quick Links */}
            <div className="flex flex-col items-center md:items-start space-y-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Quick Links
              </h3>
              <div className="flex flex-col space-y-3">
                <a
                  href="#features"
                  className="text-gray-600 hover:text-[#b91c1c] transition-colors duration-300 flex items-center gap-2 group"
                >
                  <svg
                    className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
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
                  Our Features
                </a>
                <a
                  href="#process"
                  className="text-gray-600 hover:text-[#b91c1c] transition-colors duration-300 flex items-center gap-2 group"
                >
                  <svg
                    className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
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
                  The Process
                </a>
                <a
                  href="#challenges"
                  className="text-gray-600 hover:text-[#b91c1c] transition-colors duration-300 flex items-center gap-2 group"
                >
                  <svg
                    className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
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
                  Why VANTAGE?
                </a>
              </div>
            </div>

            {/* Right: Contact & Support */}
            <div className="flex flex-col items-center md:items-end space-y-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Support & Contact
              </h3>
              <div className="flex flex-col space-y-3 text-right">
                <a
                  href="#help-support"
                  className="text-gray-600 hover:text-[#b91c1c] transition-colors duration-300 flex items-center justify-end gap-2 group"
                >
                  <span>Help & Support</span>
                  <svg
                    className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.25 4.5l7.5 7.5-7.5 7.5"
                    />
                  </svg>
                </a>
                <div className="text-gray-600 text-sm">
                  <p>System Administrator</p>
                  <a href="mailto:sulop.mlgoo@dilg.gov.ph" className="text-[#b91c1c] font-semibold hover:underline transition-colors duration-300">
                    MLGOO-DILG
                  </a>
                  <p className="text-gray-500 text-xs mt-1">sulop.mlgoo@dilg.gov.ph</p>
                </div>
                <div className="flex items-center justify-end gap-2 text-sm text-gray-500">
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
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  <span>Secure Application</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom: Copyright and Divider */}
          <div className="border-t border-gray-200 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <svg className="w-4 h-4 text-[#b91c1c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>
                  © 2024 Municipality of Sulop. All Rights Reserved. Developed by the VANTAGE Team.
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-[#22c55e] rounded-full animate-pulse"></div>
                  <span>Live Application</span>
                </span>
                <span>•</span>
                <span>Version 1.0</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
