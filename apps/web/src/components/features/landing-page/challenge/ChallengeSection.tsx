"use client";

import { useState, useEffect, useRef } from "react";
import { FileText, Search, BarChart3 } from "lucide-react";

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

// Challenge card data type
interface ChallengeCard {
  id: string;
  title: string;
  icon: React.ReactNode;
  statistic: string;
  statisticLabel: string;
  description: string;
  solution: string;
  color: string;
  delay: number;
}

// Challenge cards data
const challengeCards: ChallengeCard[] = [
  {
    id: "inefficient-processes",
    title: "Inefficient Manual Processes",
    icon: <FileText className="w-8 h-8 text-black" aria-hidden="true" />,
    statistic: "70%",
    statisticLabel: "Time lost on paperwork",
    description: "Moving beyond paper-based checklists and physical document submissions to a secure, centralized digital workflow.",
    solution: "Digital workflow solution",
    color: "bg-[#fbbf24]",
    delay: 300,
  },
  {
    id: "lack-of-tools",
    title: "Lack of Proactive Tools",
    icon: <Search className="w-8 h-8 text-black" aria-hidden="true" />,
    statistic: "45%",
    statisticLabel: "Fail due to unpreparedness",
    description: "Providing barangays with a powerful self-assessment tool to identify and rectify weaknesses before the official audit.",
    solution: "Self-assessment tools",
    color: "bg-[#f59e0b]",
    delay: 400,
  },
  {
    id: "pass-rates",
    title: "Improving Pass Rates",
    icon: <BarChart3 className="w-8 h-8 text-black" aria-hidden="true" />,
    statistic: "30%",
    statisticLabel: "Gap between local & national",
    description: "Addressing the discrepancy between local and national validation results by ensuring submissions meet the highest standards of quality and completeness.",
    solution: "Analytics & insights",
    color: "bg-[#d97706]",
    delay: 500,
  },
];

export function ChallengeSection() {
  const challengeAnimation = useScrollAnimation();

  return (
    <section
      ref={challengeAnimation.elementRef}
      className={`w-full max-w-7xl mx-auto px-8 py-16 transition-all duration-1000 ${
        challengeAnimation.isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-8"
      }`}
      aria-labelledby="challenges-heading"
    >
      <div
        className={`text-center mb-12 transition-all duration-1000 delay-200 ${
          challengeAnimation.isVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4"
        }`}
      >
        <h2 id="challenges-heading" className="text-3xl md:text-4xl font-bold text-black mb-8">
          Bridging the Gap Between Pre-Assessment and Table Validation
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8" role="list">
        {challengeCards.map((card) => (
          <article
            key={card.id}
            className={`group bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center text-center border border-gray-100 transition-all duration-1000 delay-${card.delay} hover:shadow-2xl hover:-translate-y-2 hover:border-[#fbbf24]/20 relative overflow-hidden ${
              challengeAnimation.isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
            role="listitem"
            aria-labelledby={`challenge-${card.id}-title`}
          >
            {/* Background accent */}
            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${card.color} to-[#f59e0b] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`} aria-hidden="true"></div>
            
            {/* Problem Badge */}
            <div className="absolute top-4 right-4 bg-red-100 text-red-600 text-xs font-semibold px-2 py-1 rounded-full">
              PROBLEM
            </div>
            
            {/* Icon */}
            <div className="relative mb-6">
              <div className={`w-16 h-16 bg-gradient-to-br ${card.color} to-[#f59e0b] rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                {card.icon}
              </div>
            </div>
            
            <h3 id={`challenge-${card.id}-title`} className="text-xl font-bold text-black mb-4 group-hover:text-[#fbbf24] transition-colors duration-300">
              {card.title}
            </h3>
            
            {/* Statistics */}
            <div className="bg-gray-50 rounded-lg p-3 mb-4 w-full">
              <div className="text-2xl font-bold text-[#fbbf24] mb-1">{card.statistic}</div>
              <div className="text-xs text-gray-600">{card.statisticLabel}</div>
            </div>
            
            <p className="text-gray-600 leading-relaxed mb-4">
              {card.description}
            </p>
            
            {/* Solution Preview */}
            <div className="mt-auto pt-4 border-t border-gray-100 w-full">
              <div className="flex items-center justify-center gap-2 text-green-600 text-sm font-medium">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>{card.solution}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
} 