import React, { useState } from 'react';
import { 
  HiOutlineChartBar as BarChart3, 
  HiOutlineTrendingUp as TrendingUp, 
  HiOutlineTrendingDown as TrendingDown,
  HiOutlineEye as Eye,
  HiOutlineCalendar as Calendar
} from 'react-icons/hi2';

import {
  BiTrendingUp,
  BiTrendingDown,
  BiBarChart,
  BiTime,
  BiStar,
  BiCamera,
  BiExpand
} from 'react-icons/bi';

import {
  FiTag,
  FiTrendingUp,
  FiTrendingDown,
  FiMoreVertical,
  FiShare2,
  FiDownload
} from 'react-icons/fi';

import {
  AiOutlineHeart,
  AiOutlineFire,
  AiOutlineThunderbolt
} from 'react-icons/ai';

/**
 * 增強版美麗記憶卡片組件
 * 支援更豐富的數據展示和交互功能
 */
const MemoryCard = ({ 
  memory, 
  showMetrics = true, 
  showAnalysis = true,
  showComparison = false,
  showTags = true,
  showActions = true,
  className = "",
  onShare,
  onExport,
  onExpand
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const {
    id,
    moment,
    emotion,
    date,
    product,
    aiAnalysis,
    skinMetrics,
    tags,
    improvement,
    analysisType,
    analysisData
  } = memory;

  return (
    <div className={`bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 ${className}`}>
      {/* 卡片頭部 */}
      <div className="flex items-start gap-4 mb-4">
        {/* 情感圖標 */}
        <div className="text-4xl flex-shrink-0 animate-pulse">{emotion}</div>
        
        {/* 主要內容 */}
        <div className="flex-1">
          {/* 標題行 */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <p className="text-slate-800 font-bold text-lg">{moment}</p>
              <MemoryBadge id={id} type={analysisType} />
            </div>
            
            {/* 操作按鈕 */}
            {showActions && (
              <ActionButtons 
                memory={memory}
                onShare={onShare}
                onExport={onExport}
                onExpand={() => setIsExpanded(!isExpanded)}
              />
            )}
          </div>
          
          {/* 產品和日期信息 */}
          <div className="flex items-center gap-4 mb-2">
            <p className="text-slate-600">使用產品：{product}</p>
            <div className="flex items-center gap-1 text-slate-500 text-sm">
              <BiTime className="w-4 h-4" />
              <span>{date}</span>
            </div>
          </div>

          {/* 改善指標 */}
          {improvement && (
            <ImprovementIndicator improvement={improvement} />
          )}
        </div>
      </div>

      {/* 標籤系統 */}
      {showTags && tags && tags.length > 0 && (
        <TagsDisplay tags={tags} />
      )}

      {/* 肌膚指標 */}
      {showMetrics && skinMetrics && (
        <SkinMetricsDisplay 
          metrics={skinMetrics} 
          isExpanded={isExpanded}
          maxDisplay={isExpanded ? 10 : 4}
        />
      )}

      {/* AI 分析 */}
      {showAnalysis && aiAnalysis && (
        <AIAnalysisBox analysis={aiAnalysis} />
      )}

      {/* 風水建議已移除 */}

      {/* 比較數據 */}
      {showComparison && memory.comparison && (
        <ComparisonDisplay comparison={memory.comparison} />
      )}

      {/* 展開詳情 */}
      {isExpanded && analysisData && (
        <ExpandedDetails data={analysisData} />
      )}

      {/* 底部操作區 */}
      {(showActions || showDetails) && (
        <div className="mt-4 pt-4 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => setShowDetails(!showDetails)}
              className="text-purple-600 hover:text-purple-800 text-sm font-medium transition-colors"
            >
              {showDetails ? '收起詳情' : '查看詳情'}
            </button>
            
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <BiCamera className="w-3 h-3" />
              <span>Memory #{id}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * 記憶徽章組件
 */
const MemoryBadge = ({ id, type }) => {
  const badgeConfig = {
    professional: { 
      text: '專業分析', 
      color: 'bg-green-50 text-green-700 border-green-200',
      icon: <BiStar className="w-3 h-3" />
    },
    mock: { 
      text: '演示模式', 
      color: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: <BiBarChart className="w-3 h-3" />
    },
    default: { 
      text: `#${id}`, 
      color: 'bg-purple-50 text-purple-700 border-purple-200',
      icon: null
    }
  };

  const config = badgeConfig[type] || badgeConfig.default;

  return (
    <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full border ${config.color}`}>
      {config.icon}
      <span>{config.text}</span>
    </div>
  );
};

/**
 * 操作按鈕組件
 */
const ActionButtons = ({ memory, onShare, onExport, onExpand }) => (
  <div className="flex items-center gap-1">
    <ActionButton 
      icon={<BiExpand className="w-4 h-4" />}
      onClick={onExpand}
      tooltip="展開詳情"
    />
    <ActionButton 
      icon={<FiShare2 className="w-4 h-4" />}
      onClick={() => onShare?.(memory)}
      tooltip="分享記憶"
    />
    <ActionButton 
      icon={<FiDownload className="w-4 h-4" />}
      onClick={() => onExport?.(memory)}
      tooltip="導出數據"
    />
  </div>
);

const ActionButton = ({ icon, onClick, tooltip }) => (
  <button 
    onClick={onClick}
    className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors group"
    title={tooltip}
  >
    {icon}
  </button>
);

/**
 * 改善指標組件
 */
const ImprovementIndicator = ({ improvement }) => {
  const isPositive = improvement.startsWith('+');
  const IconComponent = isPositive ? FiTrendingUp : FiTrendingDown;
  const colorClass = isPositive ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50';

  return (
    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
      <IconComponent className="w-3 h-3" />
      <span>較上次 {improvement}</span>
    </div>
  );
};

/**
 * 標籤顯示組件
 */
const TagsDisplay = ({ tags, maxDisplay = 3 }) => (
  <div className="flex flex-wrap gap-1 mb-3">
    {tags.slice(0, maxDisplay).map((tag, index) => (
      <span 
        key={index}
        className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs"
      >
        <FiTag className="w-3 h-3" />
        {tag}
      </span>
    ))}
    {tags.length > maxDisplay && (
      <span className="px-2 py-1 text-slate-500 text-xs">
        +{tags.length - maxDisplay} 更多
      </span>
    )}
  </div>
);

/**
 * 肌膚指標顯示組件
 */
const SkinMetricsDisplay = ({ metrics, isExpanded = false, maxDisplay = 4 }) => {
  const metricsArray = Object.entries(metrics);
  const displayMetrics = isExpanded ? metricsArray : metricsArray.slice(0, maxDisplay);
  
  if (metricsArray.length === 0) return null;
  
  return (
    <div className="mb-4">
      <h4 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
        <BiBarChart className="w-4 h-4" />
        肌膚指標
      </h4>
      <div className={`grid gap-2 ${isExpanded ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-2 md:grid-cols-4'}`}>
        {displayMetrics.map(([key, value], idx) => (
          <MetricCard key={idx} label={key} value={value} />
        ))}
      </div>
      {!isExpanded && metricsArray.length > maxDisplay && (
        <p className="text-xs text-slate-500 mt-2">
          還有 {metricsArray.length - maxDisplay} 項指標...
        </p>
      )}
    </div>
  );
};

/**
 * 單個指標卡片
 */
const MetricCard = ({ label, value }) => {
  const getScoreInfo = (score) => {
    if (score >= 90) return { color: "text-green-600 bg-green-50 border-green-200", level: "優秀", icon: <BiStar className="w-3 h-3" /> };
    if (score >= 80) return { color: "text-blue-600 bg-blue-50 border-blue-200", level: "良好", icon: <AiOutlineThunderbolt className="w-3 h-3" /> };
    if (score >= 70) return { color: "text-amber-600 bg-amber-50 border-amber-200", level: "一般", icon: <AiOutlineHeart className="w-3 h-3" /> };
    return { color: "text-red-600 bg-red-50 border-red-200", level: "需改善", icon: <AiOutlineFire className="w-3 h-3" /> };
  };
  
  const scoreInfo = getScoreInfo(value);
  
  return (
    <div className={`rounded-lg p-3 text-center border ${scoreInfo.color} transition-all duration-200 hover:scale-105`}>
      <div className="flex items-center justify-center gap-1 mb-1">
        {scoreInfo.icon}
        <div className="text-xs text-slate-600 font-medium">{label}</div>
      </div>
      <div className="text-lg font-bold mb-1">{value}</div>
      <div className="text-xs opacity-75">{scoreInfo.level}</div>
      
      {/* 進度條 */}
      <div className="w-full bg-slate-200 rounded-full h-1 mt-2">
        <div 
          className="bg-current h-1 rounded-full transition-all duration-500" 
          style={{width: `${Math.min(value, 100)}%`}}
        />
      </div>
    </div>
  );
};

/**
 * AI 分析框組件
 */
const AIAnalysisBox = ({ analysis }) => (
  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200/50 mb-3">
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
        <span className="text-white text-sm">🤖</span>
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-purple-800 mb-1">AI 深度分析</h4>
        <p className="text-sm text-purple-700 leading-relaxed">
          {analysis}
        </p>
      </div>
    </div>
  </div>
);

/**
 * 比較數據顯示組件
 */
const ComparisonDisplay = ({ comparison }) => {
  if (!comparison.hasComparison) return null;

  return (
    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 mb-3">
      <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
        <BiTrendingUp className="w-4 h-4" />
        與上次比較
      </h4>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        {comparison.improvements.length > 0 && (
          <div>
            <p className="text-green-700 font-medium mb-1">改善項目：</p>
            <ul className="text-green-600 space-y-1">
              {comparison.improvements.map((item, index) => (
                <li key={index} className="flex items-center gap-1">
                  <BiTrendingUp className="w-3 h-3" />
                  {item.name} +{item.improvement}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {comparison.deteriorations.length > 0 && (
          <div>
            <p className="text-red-700 font-medium mb-1">需關注項目：</p>
            <ul className="text-red-600 space-y-1">
              {comparison.deteriorations.map((item, index) => (
                <li key={index} className="flex items-center gap-1">
                  <BiTrendingDown className="w-3 h-3" />
                  {item.name} -{item.decline}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      {comparison.daysBetween && (
        <p className="text-blue-600 text-xs mt-2">
          距離上次分析：{comparison.daysBetween} 天
        </p>
      )}
    </div>
  );
};

/**
 * 展開詳情組件
 */
const ExpandedDetails = ({ data }) => (
  <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
    <h4 className="font-semibold text-slate-800 mb-3">詳細分析數據</h4>
    
    <div className="grid md:grid-cols-2 gap-4 text-sm">
      <div>
        <p className="text-slate-600 mb-1">分析 ID：</p>
        <p className="font-mono text-slate-800">{data.metadata?.analysisId}</p>
      </div>
      
      <div>
        <p className="text-slate-600 mb-1">處理時間：</p>
        <p className="text-slate-800">{data.metadata?.processingTime}ms</p>
      </div>
      
      <div>
        <p className="text-slate-600 mb-1">圖像質量：</p>
        <p className="text-slate-800">{data.metadata?.imageQuality}</p>
      </div>
      
      <div>
        <p className="text-slate-600 mb-1">光線條件：</p>
        <p className="text-slate-800">{data.metadata?.lightingCondition}</p>
      </div>
    </div>
    
    {data.recommendations && (
      <div className="mt-3">
        <p className="text-slate-600 mb-2">個人化建議：</p>
        <ul className="text-slate-700 space-y-1">
          {data.recommendations.slice(0, 3).map((rec, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="w-1 h-1 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
              <span className="text-sm">{rec}</span>
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
);

/**
 * 記憶卡片骨架載入組件
 */
export const MemoryCardSkeleton = () => (
  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200 shadow-sm animate-pulse">
    <div className="flex items-start gap-4 mb-4">
      <div className="w-12 h-12 bg-slate-200 rounded-full flex-shrink-0"></div>
      <div className="flex-1">
        <div className="h-6 bg-slate-200 rounded mb-2 w-3/4"></div>
        <div className="h-4 bg-slate-200 rounded mb-2 w-1/2"></div>
        <div className="h-3 bg-slate-200 rounded mb-3 w-1/4"></div>
      </div>
    </div>
    
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-16 bg-slate-200 rounded-lg"></div>
      ))}
    </div>
    
    <div className="h-20 bg-slate-200 rounded-lg"></div>
  </div>
);

/**
 * 空狀態組件
 */
export const MemoryEmptyState = ({ onAnalysisClick }) => (
  <div className="text-center py-16">
    <div className="w-32 h-32 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-8">
      <BarChart3 className="w-16 h-16 text-purple-400" />
    </div>
    
    <h3 className="text-2xl font-bold text-slate-800 mb-4">還沒有美麗記憶</h3>
    <p className="text-slate-600 mb-8 max-w-md mx-auto">
      開始您的第一次 AI 肌膚分析，建立專屬美麗記憶庫，
      記錄每一個美麗蛻變的珍貴時刻
    </p>
    
    <button 
      onClick={onAnalysisClick}
      className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
    >
      立即開始分析
    </button>
    
    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
      <div className="text-center">
        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
          <BiCamera className="w-6 h-6 text-purple-600" />
        </div>
        <p className="text-sm text-slate-600">拍照上傳</p>
      </div>
      
      <div className="text-center">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
          <BiBarChart className="w-6 h-6 text-blue-600" />
        </div>
        <p className="text-sm text-slate-600">AI 分析</p>
      </div>
      
      <div className="text-center">
        <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-2">
          <AiOutlineHeart className="w-6 h-6 text-pink-600" />
        </div>
        <p className="text-sm text-slate-600">記錄美麗</p>
      </div>
    </div>
  </div>
);

/**
 * 記憶統計組件
 */
export const MemoryStats = ({ memories }) => {
  const totalMemories = memories.length;
  const averageScore = memories.length > 0 
    ? Math.round(memories.reduce((sum, memory) => {
        const scores = Object.values(memory.skinMetrics || {});
        const avg = scores.length > 0 ? scores.reduce((s, score) => s + score, 0) / scores.length : 0;
        return sum + avg;
      }, 0) / memories.length)
    : 0;

  const recentImprovement = memories.length >= 2 
    ? (() => {
        const recent = Object.values(memories[0].skinMetrics || {});
        const previous = Object.values(memories[1].skinMetrics || {});
        const recentAvg = recent.length > 0 ? recent.reduce((s, score) => s + score, 0) / recent.length : 0;
        const previousAvg = previous.length > 0 ? previous.reduce((s, score) => s + score, 0) / previous.length : 0;
        return recentAvg - previousAvg;
      })()
    : 0;

  return (
    <div className="grid grid-cols-3 gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200 mb-6">
      <div className="text-center">
        <div className="text-2xl font-bold text-purple-600">{totalMemories}</div>
        <div className="text-sm text-purple-700">總記憶數</div>
      </div>
      
      <div className="text-center">
        <div className="text-2xl font-bold text-blue-600">{averageScore}</div>
        <div className="text-sm text-blue-700">平均評分</div>
      </div>
      
      <div className="text-center">
        <div className={`text-2xl font-bold flex items-center justify-center gap-1 ${
          recentImprovement > 0 ? 'text-green-600' : recentImprovement < 0 ? 'text-red-600' : 'text-slate-600'
        }`}>
          {recentImprovement > 0 && <BiTrendingUp className="w-5 h-5" />}
          {recentImprovement < 0 && <BiTrendingDown className="w-5 h-5" />}
          {recentImprovement > 0 ? '+' : ''}{recentImprovement.toFixed(1)}
        </div>
        <div className="text-sm text-slate-700">近期變化</div>
      </div>
    </div>
  );
};

export default MemoryCard;