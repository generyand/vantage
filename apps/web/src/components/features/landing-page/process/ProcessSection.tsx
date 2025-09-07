"use client";

import { BarChart3, CheckCircle, Upload } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

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

export function ProcessSection() {
  // Move hooks to the top level of the component
  const [activeStep, setActiveStep] = useState(0);
  const [fade, setFade] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Scroll animation hooks for each section
  const processAnimation = useScrollAnimation();

  // Define steps data at the top level
  const steps = [
    {
      label: "Prepare & Submit",
      color: "bg-[#fbbf24]",
      text: "BLGU Users complete their pre-assessment and upload all required documents through the guided digital workflow.",
      backgroundImage: "/Toolkit/Submit.mp4",
      icon: <Upload className="w-4 h-4 text-black" />,
      duration: "5-10 minutes",
      benefit: "Ensures complete documentation",
    },
    {
      label: "Validate & Calibrate",
      color: "bg-[#f59e0b]",
      text: "DILG Area Assessors review the submissions for quality and provide a single, consolidated list of feedback for a one-time rework cycle.",
      backgroundImage: "/Toolkit/Validate.mp4",
      icon: <CheckCircle className="w-4 h-4 text-black" />,
      duration: "2-3 days",
      benefit: "Quality assurance & feedback",
    },
    {
      label: "Analyze & Improve",
      color: "bg-[#d97706]",
      text: "The MLGOO-DILG records the final, official result and uses the system's analytics and AI-powered insights to drive strategic improvements in local governance.",
      backgroundImage: "/Toolkit/analyze.mp4",
      icon: <BarChart3 className="w-4 h-4 text-black" />,
      duration: "Ongoing",
      benefit: "Data-driven insights",
    },
  ];

  const stepsLength = steps.length;

  // Auto-advance carousel only when process section is visible
  useEffect(() => {
    if (processAnimation.isVisible) {
      // Reset to step 1 when first entering the section
      setActiveStep(0);
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
    } else {
      // Clear the interval when section is not visible
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [processAnimation.isVisible, stepsLength]);

  return (
    <section
      ref={processAnimation.elementRef}
      className={`w-full max-w-7xl mx-auto px-8 py-16 transition-all duration-1000 ${
        processAnimation.isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-8"
      }`}
      aria-labelledby="process-heading"
    >
      {/* Enhanced Section Header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 bg-[#fbbf24]/10 text-[#fbbf24] px-4 py-2 rounded-full text-sm font-semibold mb-4">
          <div className="w-2 h-2 bg-[#fbbf24] rounded-full animate-pulse"></div>
          <span>HOW IT WORKS</span>
        </div>
        <h2
          id="process-heading"
          className="text-3xl md:text-4xl font-bold text-black mb-8 relative"
        >
          <span className="relative inline-block">
            Three Step Process
            {/* Animated geometric elements */}
            <div className="absolute -top-2 -right-4 w-8 h-8 border-2 border-[#fbbf24] rotate-45 animate-spin-slow opacity-70"></div>
            <div
              className="absolute -bottom-2 -left-4 w-6 h-6 bg-[#f59e0b] rounded-full animate-bounce opacity-60"
              style={{ animationDelay: "0.5s" }}
            ></div>
            <div className="absolute top-1/2 -right-8 w-4 h-4 bg-[#d97706] transform -translate-y-1/2 animate-pulse"></div>
            <div
              className="absolute -top-4 left-1/4 w-3 h-12 bg-gradient-to-b from-[#fbbf24] to-transparent opacity-50 animate-pulse"
              style={{ animationDelay: "1s" }}
            ></div>
            <div
              className="absolute -bottom-4 right-1/3 w-10 h-2 bg-[#fbbf24] rounded-full animate-pulse opacity-40"
              style={{ animationDelay: "1.5s" }}
            ></div>
          </span>
        </h2>
      </div>

      <div className="flex flex-col lg:flex-row items-stretch gap-8">
        {/* Left: Enhanced Stepper */}
        <div className="flex flex-col justify-center lg:w-2/5 mb-6 lg:mb-0">
          {/* Progress Overview */}
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-600">
                Current Step: {activeStep + 1} of {steps.length}
              </span>
              <div className="flex gap-1">
                {steps.map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      idx === activeStep
                        ? "bg-[#fbbf24] scale-125 shadow-lg"
                        : idx < activeStep
                        ? "bg-green-500"
                        : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div
                className="bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] h-2 rounded-full transition-all duration-500"
                style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
              ></div>
            </div>

            {/* Current Step Info */}
            <div className="text-center">
              <div className="text-2xl font-bold text-[#fbbf24] mb-1">
                {steps[activeStep].duration}
              </div>
              <div className="text-sm text-gray-600">
                {steps[activeStep].benefit}
              </div>
            </div>
          </div>

          {/* Interactive Step Buttons */}
          <div className="flex flex-col gap-3">
            {steps.map((step, idx) => (
              <button
                key={idx}
                className={`group flex items-center w-full p-4 text-left rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#fbbf24] focus:ring-offset-2 ${
                  activeStep === idx
                    ? "bg-white shadow-lg border-2 border-[#fbbf24] transform scale-105"
                    : "bg-white/50 border border-gray-200 hover:bg-white hover:shadow-md hover:scale-102"
                }`}
                onClick={() => {
                  setActiveStep(idx);
                  if (timerRef.current) clearInterval(timerRef.current);
                }}
                aria-pressed={activeStep === idx}
                aria-label={`Step ${idx + 1}: ${step.label}`}
              >
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-full text-black font-bold text-lg mr-4 transition-all duration-300 ${
                    activeStep === idx
                      ? `${step.color} shadow-lg`
                      : `${step.color} opacity-70 group-hover:opacity-100`
                  }`}
                >
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-black text-lg group-hover:text-[#fbbf24] transition-colors duration-300">
                    {step.label}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {step.duration} • {step.benefit}
                  </div>
                </div>
                {activeStep === idx && (
                  <div className="w-2 h-2 bg-[#fbbf24] rounded-full animate-pulse"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Enhanced Content Display */}
        <div className="flex-1 lg:w-1/2">
          <div
            key={activeStep}
            className={`relative bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden transition-all duration-500 ${
              fade ? "opacity-0 scale-95" : "opacity-100 scale-100"
            }`}
            style={{ minHeight: 500 }}
          >
            {/* Background Media */}
            <div
              className={`absolute inset-0 px-6 md:px-8 ${
                activeStep === 0 ? "pt-2" : "pt-8"
              } flex items-start justify-center`}
            >
              {steps[activeStep].backgroundImage.endsWith(".mp4") ? (
                <video
                  key={steps[activeStep].backgroundImage}
                  src={steps[activeStep].backgroundImage}
                  className={`w-full h-full object-contain rounded-xl ${
                    activeStep === 0 ? "-mt-4" : "mt-2"
                  } ${activeStep === 1 ? "max-h-[75%] md:max-h-[70%]" : ""} ${
                    activeStep === 2 ? "max-h-[75%] md:max-h-[70%] -mt-2" : ""
                  }`}
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              ) : (
                <Image
                  src={steps[activeStep].backgroundImage}
                  alt={`Step ${activeStep + 1}: ${
                    steps[activeStep].label
                  } process illustration`}
                  fill
                  className={`w-full h-full object-contain rounded-xl ${
                    activeStep === 0 ? "-mt-4" : "mt-2"
                  } ${activeStep === 1 ? "max-h-[75%] md:max-h-[70%]" : ""} ${
                    activeStep === 2 ? "max-h-[75%] md:max-h-[70%] -mt-2" : ""
                  }`}
                />
              )}
              {/* Removed overlay per request: keep media clean with no gradient */}
            </div>

            {/* Content Overlay - Positioned at bottom like footer */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              {/* Step Badge */}
              <div className="mb-4">
                <span
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-black text-sm font-bold shadow-lg ${
                    activeStep === 0
                      ? "bg-[#fbbf24]"
                      : activeStep === 1
                      ? "bg-[#f59e0b]"
                      : "bg-[#d97706]"
                  }`}
                >
                  <span className="flex items-center justify-center">
                    {steps[activeStep].icon}
                  </span>
                  Step {activeStep + 1}: {steps[activeStep].label}
                </span>
              </div>

              {/* Main Content */}
              <div className="bg-white/95 backdrop-blur-sm rounded-md p-4 shadow-xl border border-white/20">
                <p className="text-base font-medium leading-relaxed text-gray-800 mb-3">
                  {steps[activeStep].text}
                </p>

                {/* Step Metrics */}
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        activeStep === 0
                          ? "bg-[#fbbf24]"
                          : activeStep === 1
                          ? "bg-[#f59e0b]"
                          : "bg-[#d97706]"
                      }`}
                    ></div>
                    <span className="font-medium text-gray-700">
                      Duration: {steps[activeStep].duration}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="font-medium text-gray-700">
                      {steps[activeStep].benefit}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Arrows */}
            <div className="absolute top-1/2 left-4 right-4 flex justify-between transform -translate-y-1/2 pointer-events-none">
              <button
                onClick={() => {
                  const prevStep =
                    activeStep === 0 ? steps.length - 1 : activeStep - 1;
                  setActiveStep(prevStep);
                  if (timerRef.current) clearInterval(timerRef.current);
                }}
                className="w-10 h-10 bg-black/40 hover:bg-black/50 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110 pointer-events-auto focus:outline-none focus:ring-2 focus:ring-black/50"
                aria-label="Previous step"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                onClick={() => {
                  const nextStep =
                    activeStep === steps.length - 1 ? 0 : activeStep + 1;
                  setActiveStep(nextStep);
                  if (timerRef.current) clearInterval(timerRef.current);
                }}
                className="w-10 h-10 bg-black/40 hover:bg-black/50 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110 pointer-events-auto focus:outline-none focus:ring-2 focus:ring-black/50"
                aria-label="Next step"
              >
                <svg
                  className="w-5 h-5"
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
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
