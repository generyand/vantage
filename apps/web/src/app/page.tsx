"use client";
/* eslint-disable @typescript-eslint/no-unused-vars */

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { MapPin, Facebook, Instagram, Twitter, FileText, Search, BarChart3, Upload, CheckCircle } from "lucide-react";

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
  
  // Hero carousel state
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);

  // Sticky header state
  const [isScrolled, setIsScrolled] = useState(false);

  // Hero entrance animations state
  const [heroLoaded, setHeroLoaded] = useState(false);

  // Scroll animation hooks for each section
  const heroAnimation = useScrollAnimation();
  const challengeAnimation = useScrollAnimation();
  const featuresAnimation = useScrollAnimation();
  const processAnimation = useScrollAnimation();
  const barangaysAnimation = useScrollAnimation();
  const footerAnimation = useScrollAnimation();

  // Define steps data at the top level
  const steps = [
    {
      label: "Prepare & Submit",
      color: "bg-[#fbbf24]",
      text: "BLGU Users complete their pre-assessment and upload all required documents through the guided digital workflow.",
      backgroundImage: "/Scenery/1.jpg",
      icon: <Upload className="w-4 h-4 text-black" />,
      duration: "5-10 minutes",
      benefit: "Ensures complete documentation",
    },
    {
      label: "Validate & Calibrate",
      color: "bg-[#f59e0b]",
      text: "DILG Area Assessors review the submissions for quality and provide a single, consolidated list of feedback for a one-time rework cycle.",
      backgroundImage: "/Scenery/2.jpg",
      icon: <CheckCircle className="w-4 h-4 text-black" />,
      duration: "2-3 days",
      benefit: "Quality assurance & feedback",
    },
    {
      label: "Analyze & Improve",
      color: "bg-[#d97706]",
      text: "The MLGOO-DILG records the final, official result and uses the system's analytics and AI-powered insights to drive strategic improvements in local governance.",
      backgroundImage: "/Scenery/3.jpg",
      icon: <BarChart3 className="w-4 h-4 text-black" />,
      duration: "Ongoing",
      benefit: "Data-driven insights",
    },
  ];

  const stepsLength = steps.length;

  // Define hero slides data
  const heroSlides = [
    {
      location: "Sulop, Philippines",
      title: "VANTAGE",
      subtitle: "The official pre-assessment and analytics web application for the Municipality of Sulop's Seal of Good Local Governance for Barangays program.",
      backgroundImage: "/Sulop_Hall.png"
    },
    {
      location: "Sulop, Philippines", 
      title: "VANTAGE",
      subtitle: "The official pre-assessment and analytics web application for the Municipality of Sulop's Seal of Good Local Governance for Barangays program.",
      backgroundImage: "/Sulop_Hall.png"
    },
    {
      location: "Sulop, Philippines",
      title: "VANTAGE", 
      subtitle: "The official pre-assessment and analytics web application for the Municipality of Sulop's Seal of Good Local Governance for Barangays program.",
      backgroundImage: "/Sulop_Hall.png"
    }
  ];

  const heroSlidesLength = heroSlides.length;
  const currentHeroSlide = heroSlides[activeHeroSlide];

  // Hero navigation functions
  const nextHeroSlide = () => {
    setActiveHeroSlide((prev) => (prev + 1) % heroSlidesLength);
  };

  const prevHeroSlide = () => {
    setActiveHeroSlide((prev) => (prev - 1 + heroSlidesLength) % heroSlidesLength);
  };

  const goToHeroSlide = (index: number) => {
    setActiveHeroSlide(index);
  };

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

  // Scroll event listener for sticky header
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Hero entrance animations - trigger on page load
  useEffect(() => {
    const timer = setTimeout(() => {
      setHeroLoaded(true);
    }, 100); // Small delay to ensure smooth entrance

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col bg-white">
      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(45deg); }
          to { transform: rotate(405deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 4s linear infinite;
        }
      `}</style>

      {/* Sticky Header */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-black/95 backdrop-blur-md shadow-lg translate-y-0' 
            : 'bg-transparent -translate-y-full'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Left: VANTAGE Logo */}
            <div className="flex items-center gap-3">
              <Image
                src="/DILG.png"
                alt="Department of the Interior and Local Government (DILG) official logo"
                width={32}
                height={32}
                className="rounded-full bg-white border border-gray-200 object-contain"
              />
              <div className="flex flex-col">
                <span className="font-extrabold text-lg tracking-tight text-white leading-tight">
                  VANTAGE
                </span>
                <span className="text-xs text-gray-400 font-medium">
                  SGLGB Strategic Analytics Platform
                </span>
              </div>
            </div>

            {/* Right: Login Button */}
            <Link href="/login">
              <button 
                className="bg-transparent border-2 border-[#fbbf24] text-white px-6 py-2 rounded-lg hover:bg-[#fbbf24] hover:text-black transition-all duration-300 font-semibold text-sm transform hover:scale-105 active:scale-95 hover:shadow-lg active:shadow-sm focus:outline-none focus:ring-2 focus:ring-[#fbbf24] focus:ring-offset-2 focus:ring-offset-transparent"
                aria-label="Login to VANTAGE platform"
                type="button"
              >
                <span className="flex items-center gap-2">
                  Login
                  <svg 
                    className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section Login Button - Top Right */}
      <div className={`fixed top-4 right-4 lg:top-8 lg:right-8 z-40 transition-all duration-1000 ease-out delay-900 ${
        heroLoaded ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-4 scale-95'
      }`}>
        <Link href="/login">
          <button 
            className="bg-transparent border-2 border-[#fbbf24] text-white px-6 py-2 rounded-lg hover:bg-[#fbbf24] hover:text-black transition-all duration-300 font-semibold text-sm transform hover:scale-105 active:scale-95 hover:shadow-lg active:shadow-sm focus:outline-none focus:ring-2 focus:ring-[#fbbf24] focus:ring-offset-2 focus:ring-offset-transparent backdrop-blur-sm"
            aria-label="Login to VANTAGE platform"
            type="button"
          >
            <span className="flex items-center gap-2">
              Login
              <svg 
                className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </button>
        </Link>
      </div>

      {/* Cityscape Layout - First Section */}
      <div className="flex h-screen relative">
        {/* Left Sidebar - Cityscape Theme */}
        <aside className="hidden lg:flex lg:w-1/4 bg-[var(--cityscape-black)] dark:bg-[var(--cityscape-dark)] flex-col justify-between p-4 lg:p-8 transition-colors duration-300" role="complementary" aria-label="Navigation sidebar">
          {/* Top: Logo and Navigation */}
          <div className="space-y-8">
            {/* Logo */}
            <div className={`flex items-center gap-2 lg:gap-3 transition-all duration-1000 ease-out ${
              heroLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
            }`}>
              <Image
                src="/DILG.png"
                alt="Department of the Interior and Local Government (DILG) official logo"
                width={32}
                height={32}
                className="lg:w-10 lg:h-10 rounded-full bg-white border border-gray-200 object-contain"
              />
              <div className="flex flex-col">
                <span className="font-extrabold text-lg lg:text-xl tracking-tight text-[var(--text-inverse)] leading-tight">
                  VANTAGE
                </span>
                <span className="text-xs text-[var(--text-muted)] font-medium">
                  SGLGB Strategic Analytics Platform
                </span>
              </div>
            </div>
          </div>

          {/* Bottom: Social Media */}
          <div className="flex flex-col items-start space-y-50">
            <div className={`relative transition-all duration-1000 ease-out delay-300 ${
              heroLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
            }`}>
              <div
                className="text-[var(--text-inverse)] text-sm font-medium tracking-wider"
                style={{
                  writingMode: "vertical-rl",
                  textOrientation: "mixed",
                  transform: "rotate(180deg)",
                }}
                aria-label="Follow us on social media"
              >
                FOLLOW US
              </div>
              <div className="absolute top-30 left-3 w-px h-30 bg-[var(--text-inverse)]" aria-hidden="true"></div>
            </div>
            <nav className={`flex flex-col space-y-6 transition-all duration-1000 ease-out delay-500 ${
              heroLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
            }`} role="navigation" aria-label="Social media links">
              <a
                href="#"
                className="group w-10 h-10 bg-white/10 dark:bg-white/5 hover:bg-[var(--cityscape-yellow)] rounded-full flex items-center justify-center text-[var(--text-inverse)] hover:text-[var(--cityscape-accent-foreground)] transition-all duration-300 hover:scale-110 hover:shadow-lg backdrop-blur-sm border border-white/20 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-[var(--cityscape-yellow)] focus:ring-offset-2 focus:ring-offset-[var(--cityscape-black)]"
                aria-label="Follow us on Facebook"
                tabIndex={0}
              >
                <Facebook className="w-5 h-5" aria-hidden="true" />
              </a>
              <a
                href="#"
                className="group w-10 h-10 bg-white/10 dark:bg-white/5 hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-500 rounded-full flex items-center justify-center text-[var(--text-inverse)] transition-all duration-300 hover:scale-110 hover:shadow-lg backdrop-blur-sm border border-white/20 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-[var(--cityscape-yellow)] focus:ring-offset-2 focus:ring-offset-[var(--cityscape-black)]"
                aria-label="Follow us on Instagram"
                tabIndex={0}
              >
                <Instagram className="w-5 h-5" aria-hidden="true" />
              </a>
              <a
                href="#"
                className="group w-10 h-10 bg-white/10 dark:bg-white/5 hover:bg-blue-400 rounded-full flex items-center justify-center text-[var(--text-inverse)] transition-all duration-300 hover:scale-110 hover:shadow-lg backdrop-blur-sm border border-white/20 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-[var(--cityscape-yellow)] focus:ring-offset-2 focus:ring-offset-[var(--cityscape-black)]"
                aria-label="Follow us on Twitter"
                tabIndex={0}
              >
                <Twitter className="w-5 h-5" aria-hidden="true" />
              </a>
            </nav>
            </div>
        </aside>

        {/* Philippine Flag - positioned between black sidebar and image like 2100 Club */}
        <div className={`hidden 2xl:block absolute top-2/4 left-1/8 transform -translate-y-1/2 z-30 transition-all duration-1200 ease-out delay-700 ${
          heroLoaded ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 -translate-x-16 scale-95'
        }`} role="img" aria-label="Philippine flag representing national identity and government authority">
          <div className="relative">
            <Image
            src="/flag.jpg"
              alt="Philippine flag with blue, red, and white sections featuring the sun and three stars, symbolizing the Republic of the Philippines"
              width={256}
              height={416}
              className="w-64 h-[26rem] object-cover drop-shadow-2xl rounded-sm bg-white"
            />
            {/* Dark overlay for consistent styling */}
            <div className="absolute inset-0 bg-black/15 rounded-sm" aria-hidden="true"></div>
            {/* Left side gradient for blending with dark sidebar */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent rounded-sm" aria-hidden="true"></div>
            {/* Corner blending only on left side */}
            <div className="absolute inset-0 rounded-sm" aria-hidden="true" style={{
              background: 'linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 25%, transparent 50%), linear-gradient(225deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 25%, transparent 50%)'
            }}></div>
          </div>
        </div>

        {/* Right Content - Large Image with Overlay */}
        <main className="w-full lg:w-3/4 relative" role="main">
          {/* Background Image */}
          <div className={`absolute inset-0 transition-all duration-1500 ease-out ${
            heroLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          }`}>
            <Image
              src={currentHeroSlide.backgroundImage}
              alt="Sulop Municipal Hall, the official government building of the Municipality of Sulop in Davao del Sur, Philippines, serving as the administrative center for local governance"
              fill
              className="w-full h-full object-cover transition-opacity duration-500"
            />

            {/* Dark overlay for better text readability */}
            <div className="absolute inset-0 bg-black/60" aria-hidden="true"></div>
          </div>

          {/* Content Overlay */}
          <div className="absolute bottom-8 left-4 lg:bottom-20 lg:left-8 xl:left-32 text-white space-y-2 lg:space-y-6 max-w-sm lg:max-w-2xl xl:max-w-3xl">
            {/* Location with enhanced styling */}
            <div className={`flex items-center gap-2 mb-2 backdrop-blur-sm bg-black/20 px-3 py-1.5 rounded-md border border-white/10 w-fit transition-all duration-1000 ease-out delay-300 ${
              heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`} role="region" aria-label="Location information">
              <MapPin className="w-3 h-3 lg:w-4 lg:h-4 text-[#fbbf24]" aria-hidden="true" />
              <div className="text-sm lg:text-base font-medium tracking-wide uppercase text-gray-200 hover:text-white transition-colors duration-300">
              {currentHeroSlide.location}
            </div>
            </div>
            
            {/* Enhanced VANTAGE title */}
            <div className={`relative transition-all duration-1200 ease-out delay-500 ${
              heroLoaded ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'
            }`}>
              <h1 className="text-4xl sm:text-5xl lg:text-7xl xl:text-8xl font-black text-[#fbbf24] leading-none tracking-tight mb-2 lg:mb-4 transform hover:scale-105 transition-all duration-500 ease-out">
                <span className="inline-block hover:animate-pulse">
              {currentHeroSlide.title}
                </span>
            </h1>
              {/* Subtle glow effect */}
              <div className="absolute inset-0 text-4xl sm:text-5xl lg:text-7xl xl:text-8xl font-black text-[#fbbf24] leading-none tracking-tight opacity-20 blur-sm -z-10" aria-hidden="true">
                {currentHeroSlide.title}
            </div>
          </div>

            {/* Enhanced subtitle */}
            <div className={`text-sm sm:text-base lg:text-xl font-light leading-relaxed text-gray-100 max-w-2xl transition-all duration-1000 ease-out delay-700 ${
              heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <span className="block mb-2 text-xs lg:text-sm uppercase tracking-wider text-[#fbbf24] font-semibold" role="banner">
                Official Platform
              </span>
              <span aria-label="Platform description">{currentHeroSlide.subtitle}</span>
          </div>
          </div>
        </main>
      </div>

      {/* Rest of the content sections with updated theme */}
      <main className="relative z-10 flex-1 flex flex-col items-center w-full bg-white">
        {/* Challenge Section */}
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
            <article
              className={`group bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center text-center border border-gray-100 transition-all duration-1000 delay-300 hover:shadow-2xl hover:-translate-y-2 hover:border-[#fbbf24]/20 relative overflow-hidden ${
                challengeAnimation.isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              role="listitem"
              aria-labelledby="challenge-1-title"
            >
              {/* Background accent */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" aria-hidden="true"></div>
              
              {/* Problem Badge */}
              <div className="absolute top-4 right-4 bg-red-100 text-red-600 text-xs font-semibold px-2 py-1 rounded-full">
                PROBLEM
              </div>
              
              {/* Icon */}
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-[#fbbf24] to-[#f59e0b] rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                  <FileText className="w-8 h-8 text-black" aria-hidden="true" />
                </div>
              </div>
              
              <h3 id="challenge-1-title" className="text-xl font-bold text-black mb-4 group-hover:text-[#fbbf24] transition-colors duration-300">
                Inefficient Manual Processes
              </h3>
              
              {/* Statistics */}
              <div className="bg-gray-50 rounded-lg p-3 mb-4 w-full">
                <div className="text-2xl font-bold text-[#fbbf24] mb-1">70%</div>
                <div className="text-xs text-gray-600">Time lost on paperwork</div>
              </div>
              
              <p className="text-gray-600 leading-relaxed mb-4">
                Moving beyond paper-based checklists and physical document
                submissions to a secure, centralized digital workflow.
              </p>
              
              {/* Solution Preview */}
              <div className="mt-auto pt-4 border-t border-gray-100 w-full">
                <div className="flex items-center justify-center gap-2 text-green-600 text-sm font-medium">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Digital workflow solution</span>
            </div>
              </div>
            </article>
            
            <article
              className={`group bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center text-center border border-gray-100 transition-all duration-1000 delay-400 hover:shadow-2xl hover:-translate-y-2 hover:border-[#f59e0b]/20 relative overflow-hidden ${
                challengeAnimation.isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              role="listitem"
              aria-labelledby="challenge-2-title"
            >
              {/* Background accent */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#f59e0b] to-[#d97706] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" aria-hidden="true"></div>
              
              {/* Problem Badge */}
              <div className="absolute top-4 right-4 bg-red-100 text-red-600 text-xs font-semibold px-2 py-1 rounded-full">
                PROBLEM
              </div>
              
              {/* Icon */}
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-[#f59e0b] to-[#d97706] rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                  <Search className="w-8 h-8 text-black" aria-hidden="true" />
                </div>
              </div>
              
              <h3 id="challenge-2-title" className="text-xl font-bold text-black mb-4 group-hover:text-[#f59e0b] transition-colors duration-300">
                Lack of Proactive Tools
              </h3>
              
              {/* Statistics */}
              <div className="bg-gray-50 rounded-lg p-3 mb-4 w-full">
                <div className="text-2xl font-bold text-[#f59e0b] mb-1">45%</div>
                <div className="text-xs text-gray-600">Fail due to unpreparedness</div>
              </div>
              
              <p className="text-gray-600 leading-relaxed mb-4">
                Providing barangays with a powerful self-assessment tool to
                identify and rectify weaknesses before the official audit.
              </p>
              
              {/* Solution Preview */}
              <div className="mt-auto pt-4 border-t border-gray-100 w-full">
                <div className="flex items-center justify-center gap-2 text-green-600 text-sm font-medium">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Self-assessment tools</span>
            </div>
              </div>
            </article>
            
            <article
              className={`group bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center text-center border border-gray-100 transition-all duration-1000 delay-500 hover:shadow-2xl hover:-translate-y-2 hover:border-[#d97706]/20 relative overflow-hidden ${
                challengeAnimation.isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              role="listitem"
              aria-labelledby="challenge-3-title"
            >
              {/* Background accent */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#d97706] to-[#b45309] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" aria-hidden="true"></div>
              
              {/* Problem Badge */}
              <div className="absolute top-4 right-4 bg-red-100 text-red-600 text-xs font-semibold px-2 py-1 rounded-full">
                PROBLEM
              </div>
              
              {/* Icon */}
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-[#d97706] to-[#b45309] rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                  <BarChart3 className="w-8 h-8 text-black" aria-hidden="true" />
                </div>
              </div>
              
              <h3 id="challenge-3-title" className="text-xl font-bold text-black mb-4 group-hover:text-[#d97706] transition-colors duration-300">
                Improving Pass Rates
              </h3>
              
              {/* Statistics */}
              <div className="bg-gray-50 rounded-lg p-3 mb-4 w-full">
                <div className="text-2xl font-bold text-[#d97706] mb-1">30%</div>
                <div className="text-xs text-gray-600">Gap between local & national</div>
              </div>
              
              <p className="text-gray-600 leading-relaxed mb-4">
                Addressing the discrepancy between local and national validation
                results by ensuring submissions meet the highest standards of
                quality and completeness.
              </p>
              
              {/* Solution Preview */}
              <div className="mt-auto pt-4 border-t border-gray-100 w-full">
                <div className="flex items-center justify-center gap-2 text-green-600 text-sm font-medium">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Analytics & insights</span>
            </div>
              </div>
            </article>
          </div>
        </section>

        {/* Key Features Section */}
        <section
          ref={featuresAnimation.elementRef}
          className={`w-full max-w-7xl mx-auto px-8 py-16 transition-all duration-1000 ${
            featuresAnimation.isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
          aria-labelledby="features-heading"
        >
          {/* Enhanced Header */}
          <div
            className={`text-center mb-16 transition-all duration-1000 delay-200 ${
              featuresAnimation.isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            <div className="inline-flex items-center gap-2 bg-[#fbbf24]/10 text-[#fbbf24] px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <div className="w-2 h-2 bg-[#fbbf24] rounded-full animate-pulse"></div>
              <span>PLATFORM FEATURES</span>
            </div>
            <h2 id="features-heading" className="text-3xl md:text-4xl font-bold text-black mb-4">
            A Modern Toolkit for Data-Driven Governance
          </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive tools designed to support SGLGB evaluation process
            </p>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-stretch gap-12">
            {/* Left: Enhanced Image with Overlay */}
            <div
              className={`flex-1 transition-all duration-1000 delay-300 ${
                featuresAnimation.isVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-8"
              }`}
            >
              <div className="relative group h-full">
                <div className="w-full h-full min-h-[500px] rounded-2xl shadow-2xl overflow-hidden relative">
                  <Image
                  src="/Day_Care_Center.jpg"
                    alt="Modern day care center facility showcasing community development and local governance infrastructure"
                    fill
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20"></div>
                  
                  {/* Floating Stats Cards */}
                  <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg transform group-hover:scale-105 transition-all duration-300">
                    <div className="text-2xl font-bold text-[#fbbf24] mb-1">40+</div>
                    <div className="text-sm text-gray-600">Barangays Served</div>
              </div>
                  
                  <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg transform group-hover:scale-105 transition-all duration-300 delay-100">
                    <div className="text-2xl font-bold text-[#f59e0b] mb-1">95%</div>
                    <div className="text-sm text-gray-600">Success Rate</div>
            </div>
                  
                  <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg transform group-hover:scale-105 transition-all duration-300 delay-200">
                    <div className="text-2xl font-bold text-[#d97706] mb-1">60%</div>
                    <div className="text-sm text-gray-600">Time Saved</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Enhanced Feature Cards */}
            <div
              className={`flex-1 flex flex-col gap-6 transition-all duration-1000 delay-400 ${
                featuresAnimation.isVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-8"
              }`}
            >
              {/* Feature 1 */}
              <div className="group bg-white shadow-xl rounded-2xl p-6 border border-gray-100 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:border-[#fbbf24]/30 relative overflow-hidden">
                {/* Progress Bar */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gray-100">
                  <div className="h-full bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] w-0 group-hover:w-full transition-all duration-700"></div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#fbbf24] to-[#f59e0b] rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                      <FileText className="w-8 h-8 text-black" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold text-black group-hover:text-[#fbbf24] transition-colors duration-300">
                    Guided Self-Assessment
                  </h3>
                      <div className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                        STEP 1
                      </div>
                    </div>
                    <p className="text-gray-600 leading-relaxed mb-3">
                      A step-by-step workflow for BLGUs to complete their Self-Evaluation Document (SED) and upload all required Means of Verification (MOVs) with confidence.
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-[#fbbf24] rounded-full"></div>
                        <span>5-10 minutes</span>
                </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>User-friendly</span>
              </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="group bg-white shadow-xl rounded-2xl p-6 border border-gray-100 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:border-[#f59e0b]/30 relative overflow-hidden">
                {/* Progress Bar */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gray-100">
                  <div className="h-full bg-gradient-to-r from-[#f59e0b] to-[#d97706] w-0 group-hover:w-full transition-all duration-700 delay-100"></div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#f59e0b] to-[#d97706] rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                      <Search className="w-8 h-8 text-black" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold text-black group-hover:text-[#f59e0b] transition-colors duration-300">
                    Structured Validation & Rework
                  </h3>
                      <div className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                        STEP 2
                      </div>
                    </div>
                    <p className="text-gray-600 leading-relaxed mb-3">
                      An efficient interface for DILG Area Assessors to review submissions, provide consolidated feedback, and manage a single, streamlined rework cycle.
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-[#f59e0b] rounded-full"></div>
                        <span>2-3 days</span>
                </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>Quality assured</span>
              </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="group bg-white shadow-xl rounded-2xl p-6 border border-gray-100 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:border-[#d97706]/30 relative overflow-hidden">
                {/* Progress Bar */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gray-100">
                  <div className="h-full bg-gradient-to-r from-[#d97706] to-[#b45309] w-0 group-hover:w-full transition-all duration-700 delay-200"></div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#d97706] to-[#b45309] rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                      <BarChart3 className="w-8 h-8 text-black" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold text-black group-hover:text-[#d97706] transition-colors duration-300">
                    Powerful Analytics & AI Insights
                  </h3>
                      <div className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
                        ONGOING
                      </div>
                    </div>
                    <p className="text-gray-600 leading-relaxed mb-3">
                      A high-level dashboard with cross-matching analysis and AI-generated CapDev recommendations to support strategic decision-making.
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-[#d97706] rounded-full"></div>
                        <span>Real-time</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span>AI-powered</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
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
            <h2 id="process-heading" className="text-3xl md:text-4xl font-bold text-black mb-8 relative">
              <span className="relative inline-block">
                Three Step Process
                {/* Animated geometric elements */}
                <div className="absolute -top-2 -right-4 w-8 h-8 border-2 border-[#fbbf24] rotate-45 animate-spin-slow opacity-70"></div>
                <div className="absolute -bottom-2 -left-4 w-6 h-6 bg-[#f59e0b] rounded-full animate-bounce opacity-60" style={{ animationDelay: '0.5s' }}></div>
                <div className="absolute top-1/2 -right-8 w-4 h-4 bg-[#d97706] transform -translate-y-1/2 animate-pulse"></div>
                <div className="absolute -top-4 left-1/4 w-3 h-12 bg-gradient-to-b from-[#fbbf24] to-transparent opacity-50 animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute -bottom-4 right-1/3 w-10 h-2 bg-[#fbbf24] rounded-full animate-pulse opacity-40" style={{ animationDelay: '1.5s' }}></div>
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
            <div className="flex-1 lg:w-3/5">
            <div
              key={activeStep}
                className={`relative bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden transition-all duration-500 ${
                  fade ? "opacity-0 scale-95" : "opacity-100 scale-100"
                }`}
                style={{ minHeight: 600 }}
              >
                {/* Background Image */}
                <div className="absolute inset-0">
                  <Image
                    src={steps[activeStep].backgroundImage}
                    alt={`Step ${activeStep + 1}: ${steps[activeStep].label} process illustration`}
                    fill
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
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
                      <span className="flex items-center justify-center">{steps[activeStep].icon}</span>
                      Step {activeStep + 1}: {steps[activeStep].label}
                  </span>
                </div>

                  {/* Main Content */}
                  <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-xl border border-white/20">
                    <p className="text-base font-medium leading-relaxed text-gray-800 mb-3">
                    {steps[activeStep].text}
                  </p>
                    
                    {/* Step Metrics */}
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          activeStep === 0 ? "bg-[#fbbf24]" : activeStep === 1 ? "bg-[#f59e0b]" : "bg-[#d97706]"
                        }`}></div>
                        <span className="font-medium text-gray-700">Duration: {steps[activeStep].duration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="font-medium text-gray-700">{steps[activeStep].benefit}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Navigation Arrows */}
                <div className="absolute top-1/2 left-4 right-4 flex justify-between transform -translate-y-1/2 pointer-events-none">
                  <button
                    onClick={() => {
                      const prevStep = activeStep === 0 ? steps.length - 1 : activeStep - 1;
                      setActiveStep(prevStep);
                      if (timerRef.current) clearInterval(timerRef.current);
                    }}
                    className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110 pointer-events-auto focus:outline-none focus:ring-2 focus:ring-white/50"
                    aria-label="Previous step"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => {
                      const nextStep = activeStep === steps.length - 1 ? 0 : activeStep + 1;
                      setActiveStep(nextStep);
                      if (timerRef.current) clearInterval(timerRef.current);
                    }}
                    className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110 pointer-events-auto focus:outline-none focus:ring-2 focus:ring-white/50"
                    aria-label="Next step"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Barangays Coverage Section */}
        <section ref={barangaysAnimation.elementRef} className="w-full bg-gradient-to-br from-gray-900 via-black to-gray-800 py-20 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 border border-[#fbbf24] rounded-full"></div>
            <div className="absolute bottom-20 right-20 w-24 h-24 border border-[#f59e0b] rounded-full"></div>
            <div className="absolute top-1/2 left-1/4 w-16 h-16 border border-[#d97706] rounded-full"></div>
          </div>

          <div className="max-w-7xl mx-auto px-8 text-center relative z-10">
            {/* Section Header */}
            <div className={`mb-16 transition-all duration-1000 ${
              barangaysAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <div className={`inline-flex items-center gap-2 bg-[#fbbf24]/20 text-[#fbbf24] px-4 py-2 rounded-full text-sm font-semibold mb-6 transition-all duration-1000 delay-200 ${
                barangaysAnimation.isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
              }`}>
                <div className="w-2 h-2 bg-[#fbbf24] rounded-full animate-pulse"></div>
                <span>OUR COVERAGE</span>
              </div>
              <h2 className={`text-4xl md:text-5xl font-bold text-white mb-4 transition-all duration-1000 delay-400 ${
                barangaysAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}>
                Serving All Barangays
              </h2>
              <p className={`text-xl text-gray-300 max-w-3xl mx-auto transition-all duration-1000 delay-600 ${
                barangaysAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}>
                VANTAGE connects and empowers all 25 barangays of Sulop Municipality
              </p>
            </div>

            {/* Interactive Map Visualization */}
            <div className={`relative max-w-5xl mx-auto h-96 md:h-[500px] transition-all duration-1000 delay-800 ${
              barangaysAnimation.isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}>
              {/* Connection Lines - Following Sulop's geographic pattern */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 400">
                <defs>
                  {/* Gradient for connection lines */}
                  <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="rgba(251, 191, 36, 0.1)" />
                    <stop offset="50%" stopColor="rgba(251, 191, 36, 0.4)" />
                    <stop offset="100%" stopColor="rgba(251, 191, 36, 0.1)" />
                  </linearGradient>
                  {/* Animated gradient for active connections */}
                  <linearGradient id="activeConnectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="rgba(251, 191, 36, 0.8)">
                      <animate attributeName="stop-color" 
                        values="rgba(251, 191, 36, 0.8);rgba(245, 158, 11, 0.8);rgba(251, 191, 36, 0.8)" 
                        dur="3s" repeatCount="indefinite" />
                    </stop>
                    <stop offset="50%" stopColor="rgba(245, 158, 11, 1.0)">
                      <animate attributeName="stop-color" 
                        values="rgba(245, 158, 11, 1.0);rgba(251, 191, 36, 1.0);rgba(245, 158, 11, 1.0)" 
                        dur="3s" repeatCount="indefinite" />
                    </stop>
                    <stop offset="100%" stopColor="rgba(251, 191, 36, 0.8)">
                      <animate attributeName="stop-color" 
                        values="rgba(251, 191, 36, 0.8);rgba(245, 158, 11, 0.8);rgba(251, 191, 36, 0.8)" 
                        dur="3s" repeatCount="indefinite" />
                    </stop>
                  </linearGradient>
                </defs>
                
                {/* Main roads and connections based on Sulop's layout */}
                <g fill="none">
                  {/* Central hub connections (Municipal Hall to major areas) - Animated drawing effect */}
                  <path d="M400,200 L200,120" stroke="url(#connectionGradient)" strokeWidth="2" strokeDasharray="3,3"
                    className={`transition-all duration-2000 delay-1000 ${
                      barangaysAnimation.isVisible ? 'opacity-100' : 'opacity-0'
                    }`}
                    style={{
                      strokeDashoffset: barangaysAnimation.isVisible ? '0' : '400',
                      transition: 'stroke-dashoffset 2s ease-out 1s'
                    }} />
                  <path d="M400,200 L600,160" stroke="url(#connectionGradient)" strokeWidth="2" strokeDasharray="3,3"
                    className={`transition-all duration-2000 delay-1200 ${
                      barangaysAnimation.isVisible ? 'opacity-100' : 'opacity-0'
                    }`}
                    style={{
                      strokeDashoffset: barangaysAnimation.isVisible ? '0' : '400',
                      transition: 'stroke-dashoffset 2s ease-out 1.2s'
                    }} />
                  <path d="M400,200 L350,100" stroke="url(#connectionGradient)" strokeWidth="2" strokeDasharray="3,3"
                    className={`transition-all duration-2000 delay-1400 ${
                      barangaysAnimation.isVisible ? 'opacity-100' : 'opacity-0'
                    }`}
                    style={{
                      strokeDashoffset: barangaysAnimation.isVisible ? '0' : '400',
                      transition: 'stroke-dashoffset 2s ease-out 1.4s'
                    }} />
                  <path d="M400,200 L450,320" stroke="url(#connectionGradient)" strokeWidth="2" strokeDasharray="3,3"
                    className={`transition-all duration-2000 delay-1600 ${
                      barangaysAnimation.isVisible ? 'opacity-100' : 'opacity-0'
                    }`}
                    style={{
                      strokeDashoffset: barangaysAnimation.isVisible ? '0' : '400',
                      transition: 'stroke-dashoffset 2s ease-out 1.6s'
                    }} />
                  
                  {/* Regional connections - Staggered animation */}
                  <path d="M200,120 L150,80 L100,100 L120,160 L180,180 L200,120" stroke="url(#activeConnectionGradient)" strokeWidth="1.5"
                    className={`transition-all duration-3000 delay-1800 ${
                      barangaysAnimation.isVisible ? 'opacity-100' : 'opacity-0'
                    }`} />
                  <path d="M600,160 L650,120 L700,140 L680,200 L620,220 L600,160" stroke="url(#activeConnectionGradient)" strokeWidth="1.5"
                    className={`transition-all duration-3000 delay-2000 ${
                      barangaysAnimation.isVisible ? 'opacity-100' : 'opacity-0'
                    }`} />
                  <path d="M350,100 L300,60 L400,50 L450,80 L350,100" stroke="url(#activeConnectionGradient)" strokeWidth="1.5"
                    className={`transition-all duration-3000 delay-2200 ${
                      barangaysAnimation.isVisible ? 'opacity-100' : 'opacity-0'
                    }`} />
                  <path d="M450,320 L400,360 L350,340 L380,300 L450,320" stroke="url(#activeConnectionGradient)" strokeWidth="1.5"
                    className={`transition-all duration-3000 delay-2400 ${
                      barangaysAnimation.isVisible ? 'opacity-100' : 'opacity-0'
                    }`} />
                </g>
              </svg>

              {/* Barangay Dots - Positioned based on Sulop's actual geography */}
              {Array.from({ length: 25 }, (_, i) => {
                // More realistic positioning based on Sulop's geographic layout
                const positions = [
                  // Western barangays (like Tanwalang, Lati-an, Panaglib areas)
                  { x: 12, y: 30, delay: 0, cluster: 'west' }, 
                  { x: 18, y: 25, delay: 0.1, cluster: 'west' }, 
                  { x: 15, y: 40, delay: 0.2, cluster: 'west' },
                  { x: 22, y: 35, delay: 0.3, cluster: 'west' }, 
                  { x: 25, y: 45, delay: 0.4, cluster: 'west' },
                  
                  // Northern barangays (like Harada Butai, Tala-o areas)
                  { x: 35, y: 15, delay: 0.5, cluster: 'north' }, 
                  { x: 42, y: 12, delay: 0.6, cluster: 'north' }, 
                  { x: 48, y: 18, delay: 0.7, cluster: 'north' },
                  { x: 38, y: 22, delay: 0.8, cluster: 'north' }, 
                  { x: 45, y: 25, delay: 0.9, cluster: 'north' },
                  
                  // Eastern barangays (like Balasinon, Bagumbayan areas)
                  { x: 75, y: 30, delay: 1.0, cluster: 'east' }, 
                  { x: 82, y: 35, delay: 1.1, cluster: 'east' }, 
                  { x: 78, y: 45, delay: 1.2, cluster: 'east' },
                  { x: 85, y: 40, delay: 1.3, cluster: 'east' }, 
                  { x: 80, y: 55, delay: 1.4, cluster: 'east' },
                  
                  // Southern barangays (like New Baclayon, Waterfall areas)
                  { x: 45, y: 80, delay: 1.5, cluster: 'south' }, 
                  { x: 52, y: 85, delay: 1.6, cluster: 'south' }, 
                  { x: 38, y: 85, delay: 1.7, cluster: 'south' },
                  { x: 48, y: 75, delay: 1.8, cluster: 'south' }, 
                  { x: 42, y: 90, delay: 1.9, cluster: 'south' },
                  
                  // Central/Urban barangays (moved away from Municipal Hall center)
                  { x: 65, y: 42, delay: 2.0, cluster: 'center' }, 
                  { x: 30, y: 48, delay: 2.1, cluster: 'center' }, 
                  { x: 68, y: 62, delay: 2.2, cluster: 'center' },
                  { x: 28, y: 62, delay: 2.3, cluster: 'center' }, 
                  { x: 58, y: 35, delay: 2.4, cluster: 'center' }
                ];
                
                const pos = positions[i];
                const isHighlighted = i % 6 === 0; // Highlight every 6th dot for better distribution
                
                // Color coding based on geographic clusters
                const getClusterColor = (cluster: string) => {
                  switch(cluster) {
                    case 'west': return 'bg-[#fbbf24]';
                    case 'north': return 'bg-[#f59e0b]';
                    case 'east': return 'bg-[#d97706]';
                    case 'south': return 'bg-[#b45309]';
                    case 'center': return 'bg-[#fbbf24]';
                    default: return 'bg-gray-400';
                  }
                };

                return (
                  <div
                    key={i}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-800 hover:scale-150 cursor-pointer group ${
                      isHighlighted ? 'animate-pulse' : ''
                    } ${
                      barangaysAnimation.isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                    }`}
                    style={{
                      left: `${pos.x}%`,
                      top: `${pos.y}%`,
                      animationDelay: `${pos.delay}s`,
                      transitionDelay: `${2.5 + pos.delay * 0.1}s` // Staggered entrance after connections
                    }}
                  >
                    {/* Dot with cluster-based coloring */}
                    <div
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        isHighlighted
                          ? `${getClusterColor(pos.cluster)} shadow-lg shadow-[#fbbf24]/50`
                          : `${getClusterColor(pos.cluster)} opacity-80 hover:opacity-100 group-hover:shadow-lg group-hover:shadow-[#fbbf24]/50`
                      }`}
                    ></div>
                    
                    {/* Ripple Effect */}
                    <div
                      className={`absolute inset-0 rounded-full transition-all duration-1000 ${
                        isHighlighted
                          ? 'bg-[#fbbf24]/20 animate-ping'
                          : 'bg-transparent group-hover:bg-[#fbbf24]/20 group-hover:animate-ping'
                      }`}
                      style={{ animationDelay: `${pos.delay}s` }}
                    ></div>

                    {/* Enhanced Tooltip with cluster info */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 bg-black/90 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap shadow-lg">
                      <div className="font-semibold">Barangay {i + 1}</div>
                      <div className="text-gray-300 capitalize">{pos.cluster}ern Area</div>
                    </div>
                  </div>
                );
              })}

              {/* Central Hub (Municipal Hall) - Positioned more centrally like in the map */}
              <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1200 delay-3000 ${
                barangaysAnimation.isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
              }`}>
                <div className="relative">
                  {/* Enhanced Municipal Hall with special effects */}
                  <div className={`w-12 h-12 bg-gradient-to-br from-[#fbbf24] via-[#f59e0b] to-[#d97706] rounded-full shadow-2xl flex items-center justify-center border-4 border-white transition-all duration-1000 ${
                    barangaysAnimation.isVisible ? 'animate-pulse' : ''
                  }`}>
                    <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-inner">
                      <div className="w-2 h-2 bg-[#fbbf24] rounded-full animate-pulse"></div>
                    </div>
                  </div>
                  
                  {/* Enhanced ripple effects with staggered animations */}
                  <div className={`absolute inset-0 bg-[#fbbf24]/30 rounded-full transition-all duration-1000 delay-3200 ${
                    barangaysAnimation.isVisible ? 'animate-ping opacity-100' : 'opacity-0'
                  }`}></div>
                  <div className={`absolute inset-0 bg-[#f59e0b]/20 rounded-full transition-all duration-1000 delay-3400 ${
                    barangaysAnimation.isVisible ? 'animate-ping opacity-100' : 'opacity-0'
                  }`} style={{ animationDelay: '0.5s' }}></div>
                  <div className={`absolute inset-0 bg-[#d97706]/15 rounded-full transition-all duration-1000 delay-3600 ${
                    barangaysAnimation.isVisible ? 'animate-ping opacity-100' : 'opacity-0'
                  }`} style={{ animationDelay: '1s' }}></div>
                  
                  {/* Rotating orbit effect */}
                  <div className={`absolute inset-0 w-16 h-16 -top-2 -left-2 border border-[#fbbf24]/30 rounded-full transition-all duration-1000 delay-3800 ${
                    barangaysAnimation.isVisible ? 'opacity-100 animate-spin' : 'opacity-0'
                  }`} style={{ animationDuration: '8s' }}>
                    <div className="absolute top-0 left-1/2 w-1 h-1 bg-[#fbbf24] rounded-full transform -translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-1/2 w-1 h-1 bg-[#f59e0b] rounded-full transform -translate-x-1/2"></div>
                    <div className="absolute left-0 top-1/2 w-1 h-1 bg-[#d97706] rounded-full transform -translate-y-1/2"></div>
                    <div className="absolute right-0 top-1/2 w-1 h-1 bg-[#fbbf24] rounded-full transform -translate-y-1/2"></div>
                  </div>
                  
                  {/* Enhanced label with entrance animation */}
                  <div className={`absolute top-full left-1/2 transform -translate-x-1/2 mt-4 px-4 py-2 bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-black text-sm font-bold rounded-lg shadow-lg whitespace-nowrap transition-all duration-1000 delay-4000 ${
                    barangaysAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}>
                    <div className="text-center">
                      <div className="font-bold">Sulop Municipal Hall</div>
                      <div className="text-xs opacity-80">Central Hub</div>
                    </div>
                    {/* Arrow pointing to center */}
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-[#fbbf24]"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 transition-all duration-1000 delay-4500 ${
              barangaysAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <div className={`text-center transition-all duration-1000 delay-4700 ${
                barangaysAnimation.isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
              }`}>
                <div className="relative group">
                  <div className="text-4xl md:text-5xl font-bold text-[#fbbf24] mb-2 transition-all duration-300 group-hover:scale-110">
                    <span className={`inline-block ${barangaysAnimation.isVisible ? 'animate-pulse' : ''}`}>25</span>
                  </div>
                  <div className="text-gray-300 font-medium">Barangays Connected</div>
                  {/* Decorative elements */}
                  <div className="absolute -top-2 -right-2 w-3 h-3 bg-[#fbbf24]/30 rounded-full animate-ping"></div>
                </div>
              </div>
              <div className={`text-center transition-all duration-1000 delay-4900 ${
                barangaysAnimation.isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
              }`}>
                <div className="relative group">
                  <div className="text-4xl md:text-5xl font-bold text-[#f59e0b] mb-2 transition-all duration-300 group-hover:scale-110">
                    <span className={`inline-block ${barangaysAnimation.isVisible ? 'animate-pulse' : ''}`} style={{ animationDelay: '0.5s' }}>100%</span>
                  </div>
                  <div className="text-gray-300 font-medium">Coverage Across Sulop</div>
                  {/* Decorative elements */}
                  <div className="absolute -top-2 -right-2 w-3 h-3 bg-[#f59e0b]/30 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
                </div>
              </div>
              <div className={`text-center transition-all duration-1000 delay-5100 ${
                barangaysAnimation.isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
              }`}>
                <div className="relative group">
                  <div className="text-4xl md:text-5xl font-bold text-[#d97706] mb-2 transition-all duration-300 group-hover:scale-110">
                    <span className={`inline-block ${barangaysAnimation.isVisible ? 'animate-pulse' : ''}`} style={{ animationDelay: '1s' }}>1</span>
                  </div>
                  <div className="text-gray-300 font-medium">Unified Platform</div>
                  {/* Decorative elements */}
                  <div className="absolute -top-2 -right-2 w-3 h-3 bg-[#d97706]/30 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer
        ref={footerAnimation.elementRef}
        className={`relative z-20 w-full bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white py-16 px-8 mt-16 transition-all duration-1000 overflow-hidden ${
          footerAnimation.isVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-8"
        }`}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-32 h-32 border border-[#fbbf24] rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-24 h-24 border border-[#f59e0b] rounded-full"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 border border-[#d97706] rounded-full"></div>
          <div className="absolute bottom-10 left-1/3 w-20 h-20 border border-[#fbbf24] rounded-full"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Enhanced Header Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-[#fbbf24]/10 text-[#fbbf24] px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <div className="w-2 h-2 bg-[#fbbf24] rounded-full animate-pulse"></div>
              <span>CONNECT WITH VANTAGE</span>
            </div>
          </div>

          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Column 1: Organization Info */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-4 mb-4">
                <div className="relative group">
                  <Image
                    src="/DILG.png"
                    alt="DILG Logo"
                    width={50}
                    height={50}
                      className="rounded-xl shadow-lg border border-gray-600/30 object-contain p-2 group-hover:shadow-xl transition-all duration-300 group-hover:scale-105 bg-white/10 backdrop-blur-sm"
                  />
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#fbbf24]/20 to-[#f59e0b]/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="relative group">
                  <Image
                    src="/Sulop_Municipal_Government.png"
                    alt="Sulop Municipal Government Logo"
                    width={50}
                    height={50}
                      className="rounded-xl shadow-lg border border-gray-600/30 object-contain p-2 group-hover:shadow-xl transition-all duration-300 group-hover:scale-105 bg-white/10 backdrop-blur-sm"
                  />
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#fbbf24]/20 to-[#f59e0b]/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  VANTAGE Platform
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  The official digital platform for Sulop&apos;s Seal of Good Local Governance for Barangays program.
                </p>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-sm p-3 backdrop-blur-sm border border-white/10">
                  <div className="text-lg font-bold text-[#fbbf24]">25</div>
                  <div className="text-xs text-gray-400">Barangays</div>
                </div>
                <div className="bg-white/5 rounded-sm p-3 backdrop-blur-sm border border-white/10">
                  <div className="text-lg font-bold text-[#f59e0b]">100%</div>
                  <div className="text-xs text-gray-400">Coverage</div>
                </div>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-[#fbbf24] to-[#f59e0b] rounded-full"></div>
                Quick Navigation
              </h3>
              <div className="space-y-3">
                <a
                  href="#features"
                  className="flex items-center gap-3 text-gray-400 hover:text-[#fbbf24] transition-all duration-300 group hover:translate-x-1"
                >
                  <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center group-hover:bg-[#fbbf24]/20 transition-colors duration-300">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  </div>
                  <span className="font-medium">Platform Features</span>
                </a>
                <a
                  href="#process"
                  className="flex items-center gap-3 text-gray-400 hover:text-[#fbbf24] transition-all duration-300 group hover:translate-x-1"
                >
                  <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center group-hover:bg-[#fbbf24]/20 transition-colors duration-300">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  </div>
                  <span className="font-medium">Assessment Process</span>
                </a>
                <a
                  href="#challenges"
                  className="flex items-center gap-3 text-gray-400 hover:text-[#fbbf24] transition-all duration-300 group hover:translate-x-1"
                >
                  <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center group-hover:bg-[#fbbf24]/20 transition-colors duration-300">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                  <span className="font-medium">Why VANTAGE?</span>
                </a>
                <Link
                  href="/login"
                  className="flex items-center gap-3 text-gray-400 hover:text-[#fbbf24] transition-all duration-300 group hover:translate-x-1"
                >
                  <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center group-hover:bg-[#fbbf24]/20 transition-colors duration-300">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  </div>
                  <span className="font-medium">Access Portal</span>
                </Link>
              </div>
            </div>

            {/* Column 3: Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-[#f59e0b] to-[#d97706] rounded-full"></div>
                Contact & Support
              </h3>
              <div className="space-y-4">
                <div className="bg-white/5 rounded-sm p-4 backdrop-blur-sm border border-white/10">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-[#fbbf24]/20 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-[#fbbf24]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">System Administrator</div>
                      <div className="text-xs text-gray-400">MLGOO-DILG</div>
                    </div>
                  </div>
                  <a
                    href="mailto:sulop.mlgoo@dilg.gov.ph"
                    className="text-[#fbbf24] hover:text-[#f59e0b] font-medium text-sm transition-colors duration-300 hover:underline"
                  >
                    sulop.mlgoo@dilg.gov.ph
                  </a>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span>Secure & Verified Platform</span>
                </div>
              </div>
            </div>

            {/* Column 4: Social Media & Updates */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-[#d97706] to-[#b45309] rounded-full"></div>
                Stay Connected
              </h3>
              
              {/* Social Media */}
              <div>
                <p className="text-gray-400 text-sm mb-4">Follow us for updates and announcements</p>
                <div className="flex gap-3">
                  <a
                    href="#"
                    className="w-10 h-10 bg-white/10 hover:bg-[#fbbf24] rounded-lg flex items-center justify-center text-white hover:text-black transition-all duration-300 hover:scale-110 hover:shadow-lg backdrop-blur-sm border border-white/20 group"
                    aria-label="Follow us on Facebook"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 bg-white/10 hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-500 rounded-lg flex items-center justify-center text-white transition-all duration-300 hover:scale-110 hover:shadow-lg backdrop-blur-sm border border-white/20 group"
                    aria-label="Follow us on Instagram"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 bg-white/10 hover:bg-blue-400 rounded-lg flex items-center justify-center text-white transition-all duration-300 hover:scale-110 hover:shadow-lg backdrop-blur-sm border border-white/20 group"
                    aria-label="Follow us on Twitter"
                  >
                    <Twitter className="w-5 h-5" />
                  </a>
                </div>
                </div>

              {/* Status Indicators */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-gray-300">System Online</span>
              </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-[#fbbf24] rounded-full animate-pulse"></div>
                  <span className="text-gray-300">Live Application</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-300">Version 1.0</span>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Bottom Section */}
          <div className="border-t border-gray-700/50 pt-8">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              {/* Left: Copyright */}
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <div className="w-8 h-8 bg-[#fbbf24]/20 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-[#fbbf24]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
                <div>
                  <div className="font-medium text-white">© 2024 Municipality of Sulop</div>
                  <div className="text-xs">All Rights Reserved • Developed by VANTAGE Team</div>
              </div>
            </div>

              {/* Right: Additional Info */}
              <div className="flex items-center gap-6 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#fbbf24]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>SSL Secured</span>
                </div>
                <div className="hidden md:block w-px h-4 bg-gray-600"></div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Government Verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
