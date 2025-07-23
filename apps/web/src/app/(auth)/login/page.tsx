"use client";

import Image from "next/image";
import LoginForm from "@/components/features/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-orange-50 via-white to-pink-50">
      <div className="w-full max-w-6xl mx-auto flex items-center justify-center gap-x-24 flex-1">
        {/* Left Panel */}
        <div className="hidden lg:flex flex-col items-center justify-center">
          {/* Floating Logo */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="rounded-full shadow-xl bg-gradient-to-br from-orange-100 via-white to-yellow-100 p-6 mb-6 animate-float">
              <Image
                src="/DILG.png"
                alt="DILG Logo"
                width={180}
                height={180}
                priority
                className="rounded-full border-4 border-white shadow-lg"
              />
            </div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight text-center">
              VANTAGE
            </h1>
            <p className="text-lg text-gray-600 text-center max-w-md mb-6">
              Validating Assessments and Nurturing Transparency for Advantaged
              Governance and Evaluation
            </p>
            <ul className="space-y-2 text-base text-gray-700 text-left max-w-md">
              <li className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 rounded-full bg-orange-400 mr-2"></span>
                SGLGB Online Submission Portal
              </li>
              <li className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 rounded-full bg-red-400 mr-2"></span>
                Real-time Transparency & Feedback Loop
              </li>
              <li className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 rounded-full bg-yellow-400 mr-2"></span>
                Governance Analytics & Evaluation Suite
              </li>
            </ul>
          </div>
        </div>
        {/* Right Panel (Login Card) */}
        <div className="flex flex-col items-center justify-center min-w-[380px] max-w-md w-full px-4 py-12 sm:px-6 lg:px-0">
          {/* Single Card: Welcome, subtitle, LoginForm, and assistance text all in one */}
          <div className="w-full bg-white rounded-2xl shadow-xl p-10 md:p-10 flex flex-col space-y-8">
            <div className="text-center mb-2">
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
                Welcome, Partner in Governance
              </h2>
              <p className="text-lg md:text-xl text-gray-500 mb-8">
                Sign in to the VANTAGE Platform.
              </p>
            </div>
            <div className="flex-1 flex flex-col justify-center">
              <LoginForm />
            </div>
            <p className="text-sm text-gray-500 text-center mt-8">
              For account assistance, please contact your DILG Administrator.
            </p>
          </div>
        </div>
      </div>
      {/* Footer */}
      <footer className="w-full bg-white/80 border-t border-gray-200 py-2 px-4 flex flex-col md:flex-row items-center justify-between text-base text-gray-500 gap-2">
        <div>
          Office Hours: Mon-Fri 8:00 AM - 5:00 PM | Sat 8:00 AM - 12:00 PM
        </div>
        <div>Support: (02) 1234-5678 | support.vantage@dilg.gov.ph</div>
        <div>&copy; 2024 DILG-Sulop | The VANTAGE Project</div>
      </footer>
      <style jsx global>{`
        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-16px);
          }
          100% {
            transform: translateY(0px);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
