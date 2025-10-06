"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, CheckCircle2, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function HeroSection() {
  return (
    <section
      id="home"
      className="relative min-h-screen px-4 sm:px-6 lg:px-8 flex items-center justify-center bg-gradient-to-b from-[#F9FAFB] to-white"
    >
      <div className="max-w-7xl mx-auto w-full py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-28 xl:gap-32 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8 lg:pr-8 xl:pr-12">
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 bg-[#1A3A6D]/5 text-[#1A3A6D] px-4 py-2 rounded-full text-sm font-medium">
              <CheckCircle2 className="w-4 h-4" />
              Official Tool for DILG-Sulop
            </div>

            {/* Headline */}
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight text-black mb-4">
                <span className="whitespace-nowrap">Empowering Barangays</span>
                <br />
                <span className="whitespace-nowrap">
                  for SGLGB <span className="text-[#fbbf24]">Success</span>
                </span>
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl">
                The official pre-assessment and analytics web application for
                the SGLGB. A guided, transparent, and efficient digital workflow
                for the Barangays of Sulop.
              </p>
            </div>

            {/* Feature Pills Grid */}
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 w-5 h-5 text-green-600" />
                <span className="font-semibold text-base text-gray-800">
                  Guided Self-Assessment
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 w-5 h-5 text-green-600" />
                <span className="font-semibold text-base text-gray-800">
                  Structured Rework & Feedback
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 w-5 h-5 text-green-600" />
                <span className="font-semibold text-base text-gray-800">
                  Automated Scoring
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 w-5 h-5 text-green-600" />
                <span className="font-semibold text-base text-gray-800">
                  AI-Powered Insights
                </span>
              </li>
            </ul>

            {/* CTA Button */}
            <Link href="/login">
              <Button className="group bg-[#fbbf24] text-black hover:bg-[#fbbf24]/90 transition-colors duration-200 font-medium px-8 py-4 text-lg rounded-lg border-0 shadow-none">
                Access Login Portal
                <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          {/* Right Column - Visual */}
          <div className="relative lg:pl-8 xl:pl-12">
            {/* Main Monitor Visual */}
            <div className="relative transform rotate-2 lg:scale-[1.15] xl:scale-[1.2] origin-center rounded-2xl overflow-hidden shadow-2xl border border-[#fbbf24] bg-[#fbbf24] p-2">
              <Image
                src="/Scenery/Sulop_Hall.png"
                alt="Sulop Municipal Hall"
                width={1000}
                height={750}
                className="w-full h-auto rounded-lg border border-[#fbbf24]"
              />
            </div>

            {/* Floating Data Cards - Spread Positioning */}
            {/* Top Left Badge */}
            <div className="absolute -top-14 -left-8 md:-top-16 md:-left-10 bg-white/95 rounded-full shadow-lg border border-gray-100 px-4 py-2 flex items-center gap-2 w-max transform rotate-2 hover:-translate-y-0.5 transition-all duration-200">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span className="text-sm font-semibold text-gray-800">
                Validated Submission
              </span>
            </div>
            {/* Top Right Badge */}
            <div className="absolute -top-6 -right-6 md:-top-8 md:-right-8 bg-white/95 rounded-full shadow-lg border border-gray-100 px-4 py-2 flex items-center gap-2 w-max transform rotate-2 hover:-translate-x-0.5 transition-all duration-200">
              <Users className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-semibold text-gray-800">
                25 Barangays Connected
              </span>
            </div>
            {/* Bottom Right Badge */}
            <div className="absolute -bottom-8 -right-6 md:-bottom-10 md:-right-8 bg-white/95 rounded-full shadow-lg border border-gray-100 px-4 py-2 flex items-center gap-2 w-max transform rotate-2 hover:translate-y-0.5 transition-all duration-200">
              <BarChart3 className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-semibold text-gray-800">
                95% Compliance Rate
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
