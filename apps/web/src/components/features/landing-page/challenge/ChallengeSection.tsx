"use client";

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

// Challenge card data type
interface ChallengeCard {
  id: string;
  title: string;
  icon?: React.ReactNode;
  imageSrc?: string;
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
    imageSrc: "/Toolkit/manual.png",
    statistic: "70%",
    statisticLabel: "Time lost on paperwork",
    description:
      "Moving beyond paper-based checklists and physical document submissions to a secure, centralized digital workflow.",
    solution: "Move to a guided digital workflow",
    color: "bg-[#fbbf24]",
    delay: 300,
  },
  {
    id: "lack-of-tools",
    title: "Lack of Proactive Tools",
    imageSrc: "/Toolkit/lack.png",
    statistic: "45%",
    statisticLabel: "Fail due to unpreparedness",
    description:
      "Providing barangays with a powerful self-assessment tool to identify and rectify weaknesses before the official audit.",
    solution: "Give barangays a self‑assessment tool",
    color: "bg-[#f59e0b]",
    delay: 400,
  },
  {
    id: "pass-rates",
    title: "Improving Pass Rates",
    imageSrc: "/Toolkit/pass-rate.png",
    statistic: "30%",
    statisticLabel: "Gap between local & national",
    description:
      "Addressing the discrepancy between local and national validation results by ensuring submissions meet the highest standards of quality and completeness.",
    solution: "Use analytics to close validation gaps",
    color: "bg-[#d97706]",
    delay: 500,
  },
];

export function ChallengeSection() {
  const challengeAnimation = useScrollAnimation();

  return (
    <section
      ref={challengeAnimation.elementRef}
      className={`w-full max-w-7xl mx-auto min-h-screen px-8 py-12 flex flex-col justify-center transition-all duration-1000 ${
        challengeAnimation.isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-8"
      }`}
      aria-labelledby="challenges-heading"
    >
      <div
        className={`text-left mb-8 transition-all duration-1000 delay-200 ${
          challengeAnimation.isVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4"
        }`}
      >
        <h2
          id="challenges-heading"
          className="text-4xl md:text-5xl font-extrabold text-black mb-2"
        >
          Close the Validation Gap
        </h2>
        <p className="text-sm md:text-base text-gray-600 max-w-3xl">
          From pre‑assessment to table validation, identify issues early and set
          clear remedies so submissions meet standards the first time.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8" role="list">
        {challengeCards.map((card) => (
          <article
            key={card.id}
            className={`group bg-white rounded-2xl shadow-lg p-8 flex flex-col items-start text-left border border-gray-100 transition-all duration-300 relative overflow-hidden ${
              challengeAnimation.isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
            role="listitem"
            aria-labelledby={`challenge-${card.id}-title`}
          >
            {/* Background accent - red theme for problem */}
            <div
              className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-red-400 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}
              aria-hidden="true"
            ></div>

            {/* Image container: subtle gray, small border, centered image */}
            <div className="relative mb-6 w-full">
              <div className="h-36 rounded-md border border-gray-200 bg-gray-50 flex items-center justify-center shadow-sm transition-transform duration-300 group-hover:scale-105 group-hover:shadow-lg">
                {card.imageSrc ? (
                  <Image
                    src={card.imageSrc}
                    alt={`${card.title} icon`}
                    width={88}
                    height={88}
                    className="object-contain"
                  />
                ) : null}
              </div>
            </div>

            <h3
              id={`challenge-${card.id}-title`}
              className="text-xl font-bold text-black mb-4"
            >
              {card.title}
            </h3>

            {/* Removed percentage/statistics pill for cleaner layout */}

            <p className="text-gray-600 leading-relaxed mb-4">
              {card.description}
            </p>

            {/* Solution Preview (subtle, descriptive outcome) */}
            <div className="mt-auto pt-4 border-t border-gray-100 w-full">
              <div className="flex items-center gap-2 text-gray-600 text-sm">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span>{card.solution}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
