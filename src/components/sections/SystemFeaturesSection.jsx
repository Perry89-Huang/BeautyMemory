import React from 'react';
import { SYSTEM_FEATURES } from '../../data/constants';

/**
 * System Features Section Component
 * Displays the main AI system capabilities
 */
const SystemFeaturesSection = () => {
  return (
    <section className="py-20 px-4 relative bg-white/40 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto">
        <SectionHeader />
        <FeaturesGrid />
      </div>
    </section>
  );
};

/**
 * Section Header
 */
const SectionHeader = () => (
  <div className="text-center mb-16">
    <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
      AI 智能美麗記憶系統
    </h2>
    <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
      整合 Perfect Corp 專業肌膚分析技術，為您打造專屬的美麗記憶庫，
      讓每一次護膚都成為科學化的美麗投資。
    </p>
  </div>
);

/**
 * Features Grid
 */
const FeaturesGrid = () => (
  <div className="grid md:grid-cols-2 gap-8">
    {SYSTEM_FEATURES.map((feature, index) => (
      <FeatureCard key={index} feature={feature} index={index} />
    ))}
  </div>
);

/**
 * Individual Feature Card
 */
const FeatureCard = ({ feature, index }) => {
  const { icon, title, subtitle, description, gradient, details } = feature;
  
  return (
    <div className="group relative">
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-slate-200 hover:border-purple-300 transition-all duration-300 transform hover:-translate-y-2 shadow-lg hover:shadow-xl">
        {/* Icon */}
        <FeatureIcon icon={icon} gradient={gradient} />
        
        {/* Content */}
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-slate-800 mb-2">{title}</h3>
          <p className="text-purple-600 text-sm mb-4 font-medium">{subtitle}</p>
          <p className="text-slate-600 leading-relaxed">{description}</p>
        </div>
        
        {/* Details List */}
        <FeatureDetails details={details} />
        
        {/* Hover Effect Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>
    </div>
  );
};

/**
 * Feature Icon Component
 */
const FeatureIcon = ({ icon, gradient }) => (
  <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r ${gradient} rounded-3xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg group-hover:shadow-xl`}>
    {React.cloneElement(icon, { className: "w-8 h-8 text-white" })}
  </div>
);

/**
 * Feature Details List
 */
const FeatureDetails = ({ details }) => (
  <div className="space-y-2">
    {details.map((detail, idx) => (
      <FeatureDetailItem key={idx} detail={detail} index={idx} />
    ))}
  </div>
);

/**
 * Individual Feature Detail Item
 */
const FeatureDetailItem = ({ detail, index }) => (
  <div 
    className="flex items-center text-sm text-slate-600 group-hover:text-slate-700 transition-colors duration-300"
    style={{ animationDelay: `${index * 0.1}s` }}
  >
    <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mr-3 group-hover:scale-125 transition-transform duration-300" />
    <span className="group-hover:translate-x-1 transition-transform duration-300">
      {detail}
    </span>
  </div>
);

/**
 * Features Section with Animation on Scroll
 */
export const AnimatedSystemFeaturesSection = () => {
  const [isVisible, setIsVisible] = React.useState(false);
  const sectionRef = React.useRef(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={sectionRef} className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      <SystemFeaturesSection />
    </div>
  );
};

export default SystemFeaturesSection;