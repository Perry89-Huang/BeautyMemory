import React from 'react';
import { HiOutlineChartBar as BarChart3, HiOutlineTrendingUp as TrendingUp, HiOutlineTrendingDown as TrendingDown } from 'react-icons/hi2';

/**
 * Memory Card Component
 * Displays individual beauty memory entries
 */
const MemoryCard = ({ 
  memory, 
  showMetrics = true, 
  showAnalysis = true,
  className = "" 
}) => {
  const {
    id,
    moment,
    emotion,
    date,
    product,
    aiAnalysis,
    skinMetrics
  } = memory;

  return (
    <div className={`bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 ${className}`}>
      <div className="flex items-start gap-4">
        {/* Emotion Icon */}
        <div className="text-3xl flex-shrink-0">{emotion}</div>
        
        {/* Content */}
        <div className="flex-1">
          {/* Header */}
          <div className="flex items-center gap-2 mb-2">
            <p className="text-slate-800 font-bold text-lg">{moment}</p>
            <MemoryBadge id={id} />
          </div>
          
          {/* Product Info */}
          <p className="text-slate-600 mb-2">使用產品：{product}</p>
          <p className="text-slate-500 text-sm mb-3">{date}</p>
          
          {/* Skin Metrics */}
          {showMetrics && skinMetrics && (
            <SkinMetricsDisplay metrics={skinMetrics} />
          )}
          
          {/* AI Analysis */}
          {showAnalysis && aiAnalysis && (
            <AIAnalysisBox analysis={aiAnalysis} />
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Memory Badge Component
 */
const MemoryBadge = ({ id }) => (
  <div className="text-xs text-purple-500 bg-purple-50 px-2 py-1 rounded-full border border-purple-200">
    Memory #{id}
  </div>
);

/**
 * Skin Metrics Display Component
 */
const SkinMetricsDisplay = ({ metrics, maxDisplay = 3 }) => {
  const metricsArray = Object.entries(metrics).slice(0, maxDisplay);
  
  if (metricsArray.length === 0) return null;
  
  return (
    <div className="grid grid-cols-3 gap-2 mb-3">
      {metricsArray.map(([key, value], idx) => (
        <MetricCard key={idx} label={key} value={value} />
      ))}
    </div>
  );
};

/**
 * Individual Metric Card
 */
const MetricCard = ({ label, value }) => {
  const getScoreColor = (score) => {
    if (score >= 85) return "text-green-600 bg-green-50";
    if (score >= 70) return "text-blue-600 bg-blue-50";
    return "text-amber-600 bg-amber-50";
  };
  
  const scoreColorClass = getScoreColor(value);
  
  return (
    <div className={`rounded-lg p-2 text-center border ${scoreColorClass}`}>
      <div className="text-xs text-slate-600">{label}</div>
      <div className="text-sm font-bold">{value}</div>
      {/* Progress bar */}
      <div className="w-full bg-slate-200 rounded-full h-1 mt-1">
        <div 
          className="bg-current h-1 rounded-full transition-all duration-300" 
          style={{width: `${Math.min(value, 100)}%`}}
        />
      </div>
    </div>
  );
};

/**
 * AI Analysis Box Component
 */
const AIAnalysisBox = ({ analysis }) => (
  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-3 border border-purple-200/50">
    <div className="flex items-start gap-2">
      <span className="text-purple-600 flex-shrink-0">🤖</span>
      <p className="text-sm text-purple-600 font-medium leading-relaxed">
        {analysis}
      </p>
    </div>
  </div>
);

/**
 * Memory Card Skeleton for loading states
 */
export const MemoryCardSkeleton = () => (
  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200 shadow-sm animate-pulse">
    <div className="flex items-start gap-4">
      <div className="w-8 h-8 bg-slate-200 rounded-full flex-shrink-0"></div>
      <div className="flex-1">
        <div className="h-5 bg-slate-200 rounded mb-2 w-3/4"></div>
        <div className="h-4 bg-slate-200 rounded mb-2 w-1/2"></div>
        <div className="h-3 bg-slate-200 rounded mb-3 w-1/4"></div>
        <div className="grid grid-cols-3 gap-2 mb-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-12 bg-slate-200 rounded-lg"></div>
          ))}
        </div>
        <div className="h-16 bg-slate-200 rounded-lg"></div>
      </div>
    </div>
  </div>
);

/**
 * Empty State for when no memories exist
 */
export const MemoryEmptyState = ({ onAnalysisClick }) => (
  <div className="text-center py-12">
    <div className="w-24 h-24 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
      <BarChart3 className="w-12 h-12 text-purple-400" />
    </div>
    <h3 className="text-xl font-bold text-slate-800 mb-2">還沒有美麗記憶</h3>
    <p className="text-slate-600 mb-6">開始您的第一次 AI 肌膚分析，建立專屬美麗記憶庫</p>
    <button 
      onClick={onAnalysisClick}
      className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg"
    >
      立即開始分析
    </button>
  </div>
);

export default MemoryCard;