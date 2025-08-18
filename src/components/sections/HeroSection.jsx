import React from 'react';
import { HiOutlineChevronDown as ChevronDown, HiOutlineCamera as Camera, HiOutlineViewfinderCircle as Scan } from 'react-icons/hi2';
import AnimatedBackground from '../common/AnimatedBackground';
import { APP_CONFIG } from '../../data/constants';

/**
 * Hero Section Component
 * Main landing section with brand introduction and CTA
 */
const HeroSection = ({ 
  scrollY = 0, 
  onAnalysisClick,
  onLearnMoreClick 
}) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Overlay */}
      <BackgroundOverlay scrollY={scrollY} />
      
      {/* Animated Background */}
      <AnimatedBackground scrollY={scrollY} />
      
      {/* Main Content */}
      <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
        <TechBadge />
        <BrandTitle />
        <BrandDescription />
        <ValueProposition />
        <CTAButtons 
          onAnalysisClick={onAnalysisClick}
          onLearnMoreClick={onLearnMoreClick}
        />
      </div>
      
      {/* Scroll Indicator */}
      <ScrollIndicator />
    </section>
  );
};

/**
 * Background Overlay with Parallax Effect
 */
const BackgroundOverlay = ({ scrollY }) => (
  <div 
    className="absolute inset-0 bg-gradient-to-br from-white/60 to-blue-100/40"
    style={{ transform: `translateY(${scrollY * 0.5}px)` }}
  />
);

/**
 * Technology Badge
 */
const TechBadge = () => (
  <div className="mb-8 inline-flex items-center bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 border border-blue-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
    <Scan className="w-5 h-5 text-purple-500 mr-2 animate-pulse" />
    <span className="text-slate-700 text-sm font-medium">
      {APP_CONFIG.technology.provider} AI • 醫師級肌膚分析技術
    </span>
  </div>
);

/**
 * Brand Title
 */
const BrandTitle = () => (
  <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 bg-clip-text text-transparent mb-6 tracking-tight animate-fade-in">
    {APP_CONFIG.brand.name}
  </h1>
);

/**
 * Brand Description
 */
const BrandDescription = () => (
  <div className="mb-8">
    <p className="text-3xl md:text-4xl text-slate-700 font-bold mb-3">
      {APP_CONFIG.brand.englishName}
    </p>
    <p className="text-xl text-purple-600 font-medium mb-2">
      AI 智能肌膚分析 • 美麗記憶系統
    </p>
    <p className="text-lg text-slate-500 italic">
      {APP_CONFIG.brand.tagline} • {APP_CONFIG.technology.provider} 技術驅動
    </p>
  </div>
);

/**
 * Value Proposition
 */
const ValueProposition = () => (
  <p className="text-xl md:text-2xl text-slate-600 mb-8 max-w-4xl mx-auto leading-relaxed">
    全球首創 AI 美麗記憶技術<br />
    <span className="text-pink-500 font-medium">
      {APP_CONFIG.technology.accuracy} 準確率媲美專業皮膚科醫師
    </span>
  </p>
);

/**
 * Call-to-Action Buttons
 */
const CTAButtons = ({ onAnalysisClick, onLearnMoreClick }) => (
  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
    <PrimaryButton onClick={onAnalysisClick} />
    <SecondaryButton onClick={onLearnMoreClick} />
  </div>
);

/**
 * Primary CTA Button
 */
const PrimaryButton = ({ onClick }) => (
  <button 
    onClick={onClick}
    className="group px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white font-semibold text-lg hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
  >
    <Camera className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
    立即 AI 肌膚分析
  </button>
);

/**
 * Secondary CTA Button
 */
const SecondaryButton = ({ onClick }) => (
  <button 
    onClick={onClick}
    className="px-8 py-4 border-2 border-purple-300 rounded-full text-purple-600 font-semibold text-lg hover:bg-purple-50 hover:border-purple-400 transition-all duration-300 shadow-sm hover:shadow-md"
  >
    了解分析技術
  </button>
);

/**
 * Scroll Indicator
 */
const ScrollIndicator = () => (
  <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
    <div className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200 flex items-center justify-center shadow-lg">
      <ChevronDown className="w-4 h-4 text-slate-400" />
    </div>
  </div>
);

export default HeroSection;