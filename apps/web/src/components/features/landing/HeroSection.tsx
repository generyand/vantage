"use client";

import { Button } from "@/components/ui/button";
import {
  BarChart3,
  CheckCircle,
  Clock,
  Download,
  QrCode,
  Users,
  Zap,
} from "lucide-react";

export function HeroSection() {
  return (
    <section id="home" className="relative py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Trust Indicator */}
            <div className="inline-flex items-center space-x-2 bg-[#fbbf24]/10 px-4 py-2 rounded-full border border-[#fbbf24]/20">
              <Zap className="w-4 h-4 text-[#fbbf24]" />
              <span className="text-sm font-medium text-gray-700">
                Trusted by UM Digos College
              </span>
            </div>

            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Modernizing Event Attendance,{" "}
                <span className="text-[#fbbf24]">Effortlessly.</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Launch events, scan arrivals, and see attendance update in
                real-time - all in one modern dashboard.
              </p>
            </div>

            {/* Key Features */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 p-4 border border-[#fbbf24]/20 rounded-lg bg-white/50">
                <Clock className="w-5 h-5 text-[#fbbf24]" />
                <span className="text-sm font-medium text-gray-700">
                  Real-time attendance tracking
                </span>
              </div>
              <div className="flex items-center space-x-3 p-4 border border-[#fbbf24]/20 rounded-lg bg-white/50">
                <QrCode className="w-5 h-5 text-[#fbbf24]" />
                <span className="text-sm font-medium text-gray-700">
                  QR code check-ins
                </span>
              </div>
              <div className="flex items-center space-x-3 p-4 border border-[#fbbf24]/20 rounded-lg bg-white/50">
                <BarChart3 className="w-5 h-5 text-[#fbbf24]" />
                <span className="text-sm font-medium text-gray-700">
                  One dashboard for every event
                </span>
              </div>
              <div className="flex items-center space-x-3 p-4 border border-[#fbbf24]/20 rounded-lg bg-white/50">
                <Download className="w-5 h-5 text-[#fbbf24]" />
                <span className="text-sm font-medium text-gray-700">
                  Exportable reports
                </span>
              </div>
            </div>

            {/* CTA Button */}
            <div>
              <Button
                size="lg"
                className="bg-[#fbbf24] hover:bg-[#f59e0b] text-black font-semibold px-8 py-4 text-lg"
              >
                Get My QR Code →
              </Button>
            </div>
          </div>

          {/* Right Content - Phone Mockup */}
          <div className="relative">
            <div className="relative mx-auto w-80 h-96">
              {/* Phone Mockup */}
              <div className="absolute inset-0 bg-gray-900 rounded-[3rem] p-2 shadow-2xl">
                <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative">
                  {/* Message Bubble */}
                  <div className="absolute top-8 left-4 right-4 bg-[#fbbf24] rounded-2xl p-4 shadow-lg">
                    <div className="text-black">
                      <div className="font-semibold text-sm">MESSAGE</div>
                      <div className="text-xs mt-1">
                        Reminder: Please have your QR code ready for check-in.
                        Thank you!
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Stats */}
              <div className="absolute -top-4 -right-4 bg-green-500 text-white px-3 py-2 rounded-full text-sm font-semibold flex items-center space-x-2 shadow-lg">
                <CheckCircle className="w-4 h-4" />
                <span>98% Accuracy</span>
              </div>

              <div className="absolute top-1/2 -left-4 bg-blue-500 text-white px-3 py-2 rounded-full text-sm font-semibold flex items-center space-x-2 shadow-lg">
                <Users className="w-4 h-4" />
                <span>500+ Users</span>
              </div>

              <div className="absolute -bottom-4 -right-4 bg-purple-500 text-white px-3 py-2 rounded-full text-sm font-semibold flex items-center space-x-2 shadow-lg">
                <Clock className="w-4 h-4" />
                <span>&lt;5s Check-in</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
