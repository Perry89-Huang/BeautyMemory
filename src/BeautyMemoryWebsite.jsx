import React, { useState, useEffect } from 'react';
import { 
  BiCamera, 
  BiScan, 
  BiBarChart, 
  BiShield, 
  BiData, 
  BiErrorCircle,
  BiTrendingUp,
  BiTrendingDown,
  BiTime,
  BiStar
} from 'react-icons/bi';

import { 
  FiCamera, 
  FiBarChart, 
  FiShield, 
  FiDatabase, 
  FiZap, 
  FiAlertCircle,
  FiSearch,
  FiCalendar,
  FiStar,
  FiShare2,
  FiDownload,
  FiMoreVertical
} from 'react-icons/fi';

import { 
  AiOutlineClose,
  AiOutlineCheck,
  AiOutlineWarning,
  AiOutlineDownload,
  AiOutlineHistory,
  AiOutlineHeart,
  AiOutlineFire
} from 'react-icons/ai';

// Components
import HeroSection from './components/sections/HeroSection';
import SystemFeaturesSection from './components/sections/SystemFeaturesSection';
import SkinAnalysisModal from './components/modals/SkinAnalysisModal';
import MemoryCard, { MemoryEmptyState } from './components/common/MemoryCard';

// Data & Utils
import { INITIAL_MEMORIES, SKIN_ANALYSIS_FEATURES, APP_CONFIG } from './data/constants';
import {
  performSkinAnalysis,
  performBatchAnalysis,
  exportResults,
  getSkinHealthAssessment,
  getFengShuiRecommendations,
  HistoryManager,
  createBeautyMemory,
  calculateBeautyTrend,
  getTodaySkincareAdvice,
  generateSmartSkincareRoutine,
  enhanceAnalysisResult,
  preprocessImage,
  getErrorMessage,
  checkAPIAvailability,
  getUserQuota,
  PerfectCorpAPIError
} from './utils/apiUtils';

/**
 * 美麗記憶網站主組件 - 完整最終版本
 * 整合所有功能：AI分析、記憶管理、風水建議、批量處理等
 */
const BeautyMemoryWebsite = () => {
  // === 基本狀態管理 ===
  const [scrollY, setScrollY] = useState(0);
  const [memories, setMemories] = useState(INITIAL_MEMORIES);
  const [showSkinAnalysis, setShowSkinAnalysis] = useState(false);
  const [activeAnalysisStep, setActiveAnalysisStep] = useState(0);
  
  // === 分析相關狀態 ===
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [analysisProgress, setAnalysisProgress] = useState(null);
  const [analysisError, setAnalysisError] = useState(null);
  
  // === API 狀態 ===
  const [apiStatus, setApiStatus] = useState({ available: null, checking: true });
  const [userQuota, setUserQuota] = useState(null);
  
  // === 增強功能狀態 ===
  const [beautyTrend, setBeautyTrend] = useState(null);
  const [todayAdvice, setTodayAdvice] = useState(null);
  const [fengShuiAdvice, setFengShuiAdvice] = useState(null);
  const [showBatchAnalysis, setShowBatchAnalysis] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [analysisHistory, setAnalysisHistory] = useState([]);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'info' });

  // === Effects ===
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const checkAPI = async () => {
      try {
        const status = await checkAPIAvailability();
        setApiStatus({ ...status, checking: false });
        
        if (status.available) {
          const quota = await getUserQuota();
          setUserQuota(quota);
        }
      } catch (error) {
        console.warn('Failed to check API status:', error);
        setApiStatus({ 
          available: true,
          type: 'mock',
          checking: false, 
          error: error.message 
        });
      }
    };

    checkAPI();
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const history = HistoryManager.getAll();
        setAnalysisHistory(history);
        
        if (memories.length > 1) {
          const trend = calculateBeautyTrend(memories);
          setBeautyTrend(trend);
        }
        
        const advice = getTodaySkincareAdvice();
        setTodayAdvice(advice);
        
        const fengShui = getFengShuiRecommendations();
        setFengShuiAdvice(fengShui);
      } catch (error) {
        console.error('Failed to load initial data:', error);
      }
    };

    loadData();
  }, [memories]);

  // === 事件處理器 ===
  const showNotification = (message, type = 'info') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: 'info' }), 5000);
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setAnalysisError(null);
      setAnalysisProgress({ step: 0, message: '準備圖片...' });
      
      const processedFile = await preprocessImage(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target.result);
        startAnalysis(processedFile);
      };
      reader.readAsDataURL(processedFile);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      setAnalysisError(errorMessage);
      setAnalysisProgress(null);
      showNotification(errorMessage, 'error');
    }
  };

  const startAnalysis = async (imageFile) => {
    try {
      setIsAnalyzing(true);
      setActiveAnalysisStep(1);
      setAnalysisError(null);
      
      const result = await performSkinAnalysis(imageFile, (progress) => {
        setAnalysisProgress(progress);
        
        if (progress.step === 1) {
          setActiveAnalysisStep(1);
        } else if (progress.step === 2) {
          setActiveAnalysisStep(2);
        } else if (progress.step === 3) {
          setActiveAnalysisStep(3);
        }
      });

      const enhancedResult = enhanceAnalysisResult(result, analysisHistory);
      
      setAnalysisResult(enhancedResult);
      setIsAnalyzing(false);
      setAnalysisProgress({ step: 3, message: '分析完成！' });
      
      HistoryManager.save(enhancedResult);
      setAnalysisHistory([enhancedResult, ...analysisHistory]);
      
      if (apiStatus.type === 'real') {
        const updatedQuota = await getUserQuota();
        setUserQuota(updatedQuota);
      }
      
      showNotification('AI 肌膚分析完成！', 'success');
      
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      setAnalysisError(errorMessage);
      setIsAnalyzing(false);
      setAnalysisProgress(null);
      showNotification(errorMessage, 'error');
    }
  };

  const saveToMemory = () => {
    try {
      const newMemory = createBeautyMemory(analysisResult, memories);
      
      setMemories([newMemory, ...memories]);
      setActiveAnalysisStep(4);
      
      const newTrend = calculateBeautyTrend([newMemory, ...memories]);
      setBeautyTrend(newTrend);
      
      showNotification('美麗記憶已保存！', 'success');
      
      setTimeout(() => {
        resetAnalysisState();
      }, 2000);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      setAnalysisError(errorMessage);
      showNotification(errorMessage, 'error');
    }
  };

  const resetAnalysisState = () => {
    setShowSkinAnalysis(false);
    setActiveAnalysisStep(0);
    setAnalysisResult(null);
    setUploadedImage(null);
    setIsAnalyzing(false);
    setAnalysisProgress(null);
    setAnalysisError(null);
  };

  const handleAnalysisClick = () => {
    if (!apiStatus.available) {
      showNotification('API 服務暫時不可用，請稍後重試', 'error');
      return;
    }
    
    if (userQuota && !userQuota.available) {
      showNotification('配額不足，請升級您的方案或聯繫客服', 'warning');
      return;
    }
    
    setShowSkinAnalysis(true);
  };

  const handleBatchAnalysisClick = () => {
    if (!apiStatus.available) {
      showNotification('API 服務暫時不可用，請稍後重試', 'error');
      return;
    }
    setShowBatchAnalysis(true);
  };

  const handleExportClick = async (format = 'json') => {
    try {
      await exportResults(analysisHistory, format);
      showNotification(`分析結果已導出為 ${format.toUpperCase()} 格式`, 'success');
    } catch (error) {
      showNotification(getErrorMessage(error), 'error');
    }
  };

  const handleLearnMoreClick = () => {
    const techSection = document.getElementById('technology-section');
    if (techSection) {
      techSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleBatchComplete = (results) => {
    setAnalysisHistory([...results, ...analysisHistory]);
    setShowBatchAnalysis(false);
    showNotification(`批量分析完成！成功處理 ${results.length} 張圖片`, 'success');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* 通知組件 */}
      <NotificationToast 
        message={notification.message}
        type={notification.type}
        isVisible={notification.show}
        onClose={() => setNotification({ show: false, message: '', type: 'info' })}
      />

      {/* API 狀態橫幅 */}
      {apiStatus.checking && <APIStatusBanner status="checking" />}
      {!apiStatus.checking && !apiStatus.available && (
        <APIStatusBanner status="unavailable" message={apiStatus.error} />
      )}
      {userQuota && !userQuota.available && (
        <APIStatusBanner status="quota_exceeded" quota={userQuota} />
      )}
      
      {/* 風水時機提示橫幅 */}
      {fengShuiAdvice && (
        <FengShuiTimingBanner fengShui={fengShuiAdvice} />
      )}

      {/* Hero 區域 */}
      <HeroSection 
        scrollY={scrollY} 
        onAnalysisClick={handleAnalysisClick}
        onLearnMoreClick={handleLearnMoreClick}
        apiStatus={apiStatus}
        userQuota={userQuota}
        todayAdvice={todayAdvice}
      />
      
      {/* 今日護膚建議區域 */}
      {todayAdvice && (
        <TodaySkincareSection advice={todayAdvice} />
      )}

      {/* 功能特色區域 */}
      <SkinAnalysisFeaturesSection />
      
      {/* 系統功能區域 */}
      <SystemFeaturesSection />
      
      {/* 記憶展示區域 */}
      <EnhancedMemoryShowcaseSection 
        memories={memories} 
        onAnalysisClick={handleAnalysisClick}
        onBatchAnalysisClick={handleBatchAnalysisClick}
        onHistoryClick={() => setShowHistory(true)}
        beautyTrend={beautyTrend}
        apiStatus={apiStatus}
      />
      
      {/* 技術說明區域 */}
      <TechnologySection />
      
      {/* CTA 區域 */}
      <EnhancedCTASection 
        onAnalysisClick={handleAnalysisClick}
        onBatchAnalysisClick={handleBatchAnalysisClick}
        apiStatus={apiStatus}
        userQuota={userQuota}
      />
      
      {/* 頁腳 */}
      <Footer />

      {/* === 模態框組件 === */}
      
      {/* 增強版分析模態框 */}
      <EnhancedSkinAnalysisModal 
        isOpen={showSkinAnalysis}
        onClose={resetAnalysisState}
        activeStep={activeAnalysisStep}
        uploadedImage={uploadedImage}
        isAnalyzing={isAnalyzing}
        analysisResult={analysisResult}
        analysisProgress={analysisProgress}
        analysisError={analysisError}
        onImageUpload={handleImageUpload}
        onSaveToMemory={saveToMemory}
        onRetry={() => {
          setAnalysisError(null);
          setAnalysisProgress(null);
        }}
        apiStatus={apiStatus}
        userQuota={userQuota}
      />

      {/* 批量分析模態框 */}
      <BatchAnalysisModal 
        isOpen={showBatchAnalysis}
        onClose={() => setShowBatchAnalysis(false)}
        onComplete={handleBatchComplete}
      />

      {/* 歷史記錄模態框 */}
      <HistoryModal 
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        history={analysisHistory}
        onExport={handleExportClick}
      />
    </div>
  );
};

// === 組件定義 ===

/**
 * API 狀態橫幅組件
 */
const APIStatusBanner = ({ status, message, quota }) => {
  const statusConfig = {
    checking: {
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      borderColor: 'border-blue-200',
      icon: <BiScan className="w-4 h-4 animate-spin" />,
      text: '正在檢查 API 服務狀態...'
    },
    unavailable: {
      bgColor: 'bg-red-50',
      textColor: 'text-red-700',
      borderColor: 'border-red-200',
      icon: <FiAlertCircle className="w-4 h-4" />,
      text: `API 服務暫時不可用${message ? `：${message}` : ''}`
    },
    quota_exceeded: {
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-700',
      borderColor: 'border-amber-200',
      icon: <AiOutlineWarning className="w-4 h-4" />,
      text: `配額不足（剩餘：${quota?.remaining || 0}），請升級方案`
    }
  };

  const config = statusConfig[status];
  
  return (
    <div className={`${config.bgColor} ${config.borderColor} border-b px-4 py-3`}>
      <div className="max-w-6xl mx-auto flex items-center gap-2">
        {config.icon}
        <span className={`text-sm font-medium ${config.textColor}`}>
          {config.text}
        </span>
      </div>
    </div>
  );
};

/**
 * 風水時機提示橫幅
 */
const FengShuiTimingBanner = ({ fengShui }) => {
  const timing = fengShui.timing;
  if (!timing) return null;

  return (
    <div 
      className="py-2 px-4 text-center text-sm"
      style={{ backgroundColor: timing.color + '20', color: timing.color }}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-center gap-2">
        <FiStar className="w-4 h-4" />
        <span className="font-medium">
          🔮 九紫離火運：{timing.recommendation}
        </span>
      </div>
    </div>
  );
};

/**
 * 今日護膚建議區域
 */
const TodaySkincareSection = ({ advice }) => (
  <section className="py-12 px-4 bg-gradient-to-r from-purple-100/50 to-pink-100/50">
    <div className="max-w-4xl mx-auto">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <FiCalendar className="w-6 h-6 text-purple-500" />
          <h3 className="text-xl font-bold text-slate-800">今日護膚建議</h3>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold text-slate-700 mb-2">時間建議</h4>
            <p className="text-slate-600">{advice.timeAdvice}</p>
          </div>
          
          {advice.fengShuiTiming && (
            <div>
              <h4 className="font-semibold text-slate-700 mb-2">風水時機</h4>
              <p className="text-slate-600">{advice.fengShuiTiming.recommendation}</p>
            </div>
          )}
        </div>
        
        {advice.recommendedProducts && advice.recommendedProducts.length > 0 && (
          <div className="mt-4">
            <h4 className="font-semibold text-slate-700 mb-2">推薦產品</h4>
            <div className="flex flex-wrap gap-2">
              {advice.recommendedProducts.map((product, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                >
                  {product}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  </section>
);

/**
 * 肌膚分析功能區域
 */
const SkinAnalysisFeaturesSection = () => (
  <section className="py-16 px-4 bg-white/50 backdrop-blur-sm border-y border-slate-200/50">
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
          {APP_CONFIG.technology.features} 項專業肌膚檢測
        </h2>
        <p className="text-lg text-slate-600 mb-6">
          {APP_CONFIG.technology.provider} 醫師級 AI 技術，{APP_CONFIG.technology.accuracy} 準確率
        </p>
        <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
          {SKIN_ANALYSIS_FEATURES.map((feature, index) => (
            <div key={index} className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
              <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg mb-2 ${feature.color} bg-opacity-10`}>
                {React.cloneElement(feature.icon, { className: `w-5 h-5 ${feature.color}` })}
              </div>
              <h3 className="text-sm font-bold text-slate-800">{feature.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

/**
 * 增強版記憶展示區域
 */
const EnhancedMemoryShowcaseSection = ({ 
  memories, 
  onAnalysisClick, 
  onBatchAnalysisClick,
  onHistoryClick,
  beautyTrend,
  apiStatus 
}) => (
  <section className="py-20 px-4 bg-white/60 backdrop-blur-sm">
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
          AI 美麗記憶實例
        </h2>
        <p className="text-lg text-slate-600">
          系統智能記錄的真實美麗蛻變數據
        </p>
        
        {beautyTrend && beautyTrend.trend !== 'insufficient_data' && (
          <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
            <div className="flex items-center justify-center gap-2">
              {beautyTrend.direction === 'up' && <BiTrendingUp className="w-5 h-5 text-green-500" />}
              {beautyTrend.direction === 'down' && <BiTrendingDown className="w-5 h-5 text-red-500" />}
              <span className="font-medium text-slate-700">美麗趨勢：</span>
              <span className="text-purple-600">{beautyTrend.message}</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-wrap justify-center gap-4 mb-8">
        <button 
          onClick={onAnalysisClick}
          className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg flex items-center gap-2"
        >
          <FiCamera className="w-5 h-5" />
          單張分析
        </button>
        
        <button 
          onClick={onBatchAnalysisClick}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full font-medium hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-lg flex items-center gap-2"
        >
          <BiData className="w-5 h-5" />
          批量分析
        </button>
        
        <button 
          onClick={onHistoryClick}
          className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-full font-medium hover:from-emerald-600 hover:to-green-600 transition-all duration-300 shadow-lg flex items-center gap-2"
        >
          <AiOutlineHistory className="w-5 h-5" />
          歷史記錄
        </button>
      </div>

      {memories.length > 0 ? (
        <div className="grid gap-6">
          {memories.map((memory) => (
            <MemoryCard 
              key={memory.id} 
              memory={memory} 
              showComparison={memory.comparison}
            />
          ))}
        </div>
      ) : (
        <MemoryEmptyState onAnalysisClick={onAnalysisClick} />
      )}
    </div>
  </section>
);

/**
 * 技術說明區域
 */
const TechnologySection = () => (
  <section id="technology-section" className="py-20 px-4 bg-gradient-to-r from-blue-50 to-purple-50">
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
          {APP_CONFIG.technology.provider} 專業技術驅動
        </h2>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
          採用全球領先的 {APP_CONFIG.technology.provider} AI 肌膚分析技術，
          提供媲美專業皮膚科醫師的精準檢測服務。
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <TechCard 
          icon={<BiBarChart className="w-8 h-8 text-white" />}
          gradient="from-blue-500 to-cyan-500"
          title={`${APP_CONFIG.technology.accuracy} 準確率`}
          description="Wake Forest 醫學院皮膚科教授驗證，與醫師診斷相關性超過 80%"
        />
        
        <TechCard 
          icon={<FiZap className="w-8 h-8 text-white" />}
          gradient="from-purple-500 to-pink-500"
          title="即時分析"
          description={`先進 AI 演算法，數秒內完成 ${APP_CONFIG.technology.features} 項專業肌膚檢測`}
        />
        
        <TechCard 
          icon={<BiShield className="w-8 h-8 text-white" />}
          gradient="from-green-500 to-emerald-500"
          title="隱私保護"
          description="企業級安全防護，您的美麗數據完全保密"
        />
      </div>

      <TechDetailsCard />
    </div>
  </section>
);

const TechCard = ({ icon, gradient, title, description }) => (
  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-slate-200 shadow-lg text-center hover:shadow-xl transition-all duration-300">
    <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${gradient} rounded-2xl mb-6`}>
      {icon}
    </div>
    <h3 className="text-xl font-bold text-slate-800 mb-3">{title}</h3>
    <p className="text-slate-600">{description}</p>
  </div>
);

const TechDetailsCard = () => (
  <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-slate-200 shadow-xl">
    <div className="grid md:grid-cols-2 gap-8 items-center">
      <div>
        <h3 className="text-2xl font-bold text-slate-800 mb-4">
          全方位肌膚健康檢測
        </h3>
        <div className="space-y-3">
          <TechDetailItem 
            color="bg-purple-500"
            text="HD 高清皺紋檢測（額頭、魚尾紋、法令紋等 7 個區域）"
          />
          <TechDetailItem 
            color="bg-blue-500"
            text="精密毛孔分析（鼻翼、臉頰、額頭分區檢測）"
          />
          <TechDetailItem 
            color="bg-pink-500"
            text="色斑與亮澤度全面評估"
          />
          <TechDetailItem 
            color="bg-green-500"
            text="肌膚年齡 AI 智能推算"
          />
        </div>
      </div>
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full border-4 border-purple-200 mb-4">
          <BiScan className="w-16 h-16 text-purple-600" />
        </div>
        <p className="text-slate-600 text-sm">
          {APP_CONFIG.technology.provider} 專利 {APP_CONFIG.technology.patentTech}
        </p>
      </div>
    </div>
  </div>
);

const TechDetailItem = ({ color, text }) => (
  <div className="flex items-center gap-3">
    <div className={`w-2 h-2 ${color} rounded-full`}></div>
    <span className="text-slate-700">{text}</span>
  </div>
);

/**
 * 增強版 CTA 區域
 */
const EnhancedCTASection = ({ onAnalysisClick, onBatchAnalysisClick, apiStatus, userQuota }) => (
  <section className="py-20 px-4 bg-gradient-to-r from-purple-100 to-pink-100">
    <div className="max-w-4xl mx-auto text-center">
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 border border-slate-200 shadow-xl">
        <BiScan className="w-20 h-20 text-purple-500 mx-auto mb-6 animate-pulse" />
        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6">
          立即體驗 AI 肌膚分析
        </h2>
        <p className="text-xl text-slate-600 mb-8 leading-relaxed">
          {APP_CONFIG.technology.provider} 專業技術 • {APP_CONFIG.technology.accuracy} 醫師級準確率<br />
          開始建立專屬的美麗記憶庫
        </p>
        
        {apiStatus.available && userQuota && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center gap-2 text-green-700">
              <FiShield className="w-4 h-4" />
              <span className="text-sm">
                {apiStatus.type === 'real' 
                  ? `API 服務正常 • 剩餘分析次數：${userQuota.remaining}` 
                  : '演示模式 • 無限制使用'
                }
              </span>
            </div>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto mb-6">
          <input 
            type="email" 
            placeholder="輸入郵件，獲取 AI 分析報告"
            className="w-full px-6 py-3 bg-white/80 border border-slate-300 rounded-full text-slate-700 placeholder-slate-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-200 backdrop-blur-sm shadow-sm"
          />
          <div className="flex gap-2">
            <button 
              onClick={onAnalysisClick}
              disabled={!apiStatus.available}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 whitespace-nowrap shadow-lg flex items-center gap-2 ${
                apiStatus.available
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transform hover:scale-105'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <FiCamera className="w-4 h-4" />
              立即分析
            </button>
          </div>
        </div>

        <CTAFeaturesList />
      </div>
    </div>
  </section>
);

const CTAFeaturesList = () => (
  <div className="grid md:grid-cols-4 gap-4 text-sm text-slate-600 max-w-3xl mx-auto">
    <CTAFeatureItem 
      icon={<BiScan className="w-4 h-4 text-purple-500" />}
      text={`${APP_CONFIG.technology.features} 項專業檢測`}
    />
    <CTAFeatureItem 
      icon={<FiBarChart className="w-4 h-4 text-blue-500" />}
      text={`${APP_CONFIG.technology.accuracy} 準確率`}
    />
    <CTAFeatureItem 
      icon={<FiShield className="w-4 h-4 text-green-500" />}
      text="隱私安全保護"
    />
    <CTAFeatureItem 
      icon={<FiDatabase className="w-4 h-4 text-pink-500" />}
      text="美麗記憶庫"
    />
  </div>
);

const CTAFeatureItem = ({ icon, text }) => (
  <div className="flex items-center justify-center gap-2">
    {icon}
    <span>{text}</span>
  </div>
);

/**
 * 頁腳組件
 */
const Footer = () => (
  <footer className="py-12 px-4 border-t border-slate-200 bg-white/40 backdrop-blur-sm">
    <div className="max-w-6xl mx-auto">
      <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
        <FooterBrandSection />
        <FooterFeaturesSection />
        <FooterTechSection />
      </div>
      
      <FooterCopyright />
    </div>
  </footer>
);

const FooterBrandSection = () => (
  <div>
    <h3 className="text-2xl font-bold text-slate-800 mb-2">{APP_CONFIG.brand.name}</h3>
    <p className="text-xl text-purple-600 mb-4">{APP_CONFIG.brand.englishName}</p>
    <p className="text-slate-600 leading-relaxed">
      {APP_CONFIG.brand.description}<br />
      {APP_CONFIG.technology.provider} 技術驅動<br />
      {APP_CONFIG.brand.tagline}
    </p>
  </div>
);

const FooterFeaturesSection = () => (
  <div>
    <h4 className="text-lg font-semibold text-slate-800 mb-4">AI 分析功能</h4>
    <ul className="space-y-2 text-slate-600">
      <li>🔬 {APP_CONFIG.technology.features} 項專業肌膚檢測</li>
      <li>📊 {APP_CONFIG.technology.accuracy} 醫師級準確率</li>
      <li>📸 即時智能分析</li>
      <li>💾 美麗記憶儲存</li>
      <li>🔮 九紫離火運整合</li>
      <li>📈 美麗趨勢追蹤</li>
    </ul>
  </div>
);

const FooterTechSection = () => (
  <div>
    <h4 className="text-lg font-semibold text-slate-800 mb-4">技術特色</h4>
    <div className="text-slate-600 space-y-2">
      <p>🏥 {APP_CONFIG.technology.provider} 專業技術</p>
      <p>🔒 企業級安全防護</p>
      <p>📈 個人化改善建議</p>
      <p>🤖 AI 美容顧問服務</p>
      <p>⚡ 批量處理功能</p>
      <p>📊 數據導出分析</p>
    </div>
  </div>
);

const FooterCopyright = () => (
  <div className="border-t border-slate-200 mt-8 pt-8 text-center">
    <p className="text-slate-500 text-sm mb-2">
      © {APP_CONFIG.contact.year} {APP_CONFIG.contact.copyright}
    </p>
    <p className="text-slate-400 text-xs">
      {APP_CONFIG.contact.poweredBy}
    </p>
    <div className="mt-4 flex justify-center gap-4 text-slate-400">
      <a href="#" className="hover:text-purple-600 transition-colors">隱私政策</a>
      <a href="#" className="hover:text-purple-600 transition-colors">使用條款</a>
      <a href="#" className="hover:text-purple-600 transition-colors">聯繫我們</a>
      <a href="#" className="hover:text-purple-600 transition-colors">API 文檔</a>
    </div>
  </div>
);

// === 模態框組件 ===

/**
 * 增強版分析模態框
 */
const EnhancedSkinAnalysisModal = ({ 
  isOpen, 
  onClose, 
  activeStep, 
  uploadedImage, 
  isAnalyzing, 
  analysisResult, 
  analysisProgress,
  analysisError,
  onImageUpload, 
  onSaveToMemory,
  onRetry,
  apiStatus,
  userQuota
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">AI 肌膚分析系統</h2>
            {apiStatus.type && (
              <p className="text-sm text-slate-500 mt-1">
                {apiStatus.type === 'real' ? '🔗 使用 Perfect Corp API' : '🧪 演示模式'}
                {userQuota && userQuota.type === 'real' && (
                  <span className="ml-2">
                    • 剩餘配額：{userQuota.remaining}
                  </span>
                )}
              </p>
            )}
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"
          >
            <AiOutlineClose className="w-4 h-4" />
          </button>
        </div>

        {analysisError && (
          <ErrorAlert 
            message={analysisError} 
            onRetry={onRetry}
            onClose={() => onRetry()}
          />
        )}

        {analysisProgress && !analysisError && (
          <ProgressDisplay progress={analysisProgress} />
        )}

        <SkinAnalysisModal 
          isOpen={true}
          onClose={() => {}}
          activeStep={activeStep}
          uploadedImage={uploadedImage}
          isAnalyzing={isAnalyzing}
          analysisResult={analysisResult}
          onImageUpload={onImageUpload}
          onSaveToMemory={onSaveToMemory}
        />

        {analysisResult && analysisResult.healthAssessment && (
          <EnhancedResultsDisplay result={analysisResult} />
        )}
      </div>
    </div>
  );
};

/**
 * 增強版分析結果顯示
 */
const EnhancedResultsDisplay = ({ result }) => (
  <div className="mt-8 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-200">
    <h3 className="text-xl font-bold text-slate-800 mb-4">🌟 AI 深度分析報告</h3>
    
    <div className="grid md:grid-cols-2 gap-6">
      {result.healthAssessment?.health && (
        <div>
          <h4 className="font-semibold text-slate-700 mb-2">健康評估</h4>
          <div className="flex items-center gap-2 mb-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: result.healthAssessment.health.color }}
            ></div>
            <span className="font-medium">{result.healthAssessment.health.message}</span>
          </div>
        </div>
      )}

      {result.fengShuiAdvice && (
        <div>
          <h4 className="font-semibold text-slate-700 mb-2">🔮 風水建議</h4>
          <p className="text-sm text-slate-600">
            {result.fengShuiAdvice.timing?.recommendation || '保持現有護理習慣'}
          </p>
        </div>
      )}

      {result.trend && (
        <div>
          <h4 className="font-semibold text-slate-700 mb-2 flex items-center gap-2">
            {result.trend.direction === 'up' && <BiTrendingUp className="w-4 h-4 text-green-500" />}
            {result.trend.direction === 'down' && <BiTrendingDown className="w-4 h-4 text-red-500" />}
            美麗趨勢
          </h4>
          <p className="text-sm text-slate-600">{result.trend.message}</p>
        </div>
      )}

      {result.personalizedAdvice && (
        <div>
          <h4 className="font-semibold text-slate-700 mb-2">💡 個性化建議</h4>
          <ul className="text-sm text-slate-600 space-y-1">
            {result.personalizedAdvice.slice(0, 2).map((advice, index) => (
              <li key={index}>{advice}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  </div>
);

/**
 * 批量分析模態框
 */
const BatchAnalysisModal = ({ isOpen, onClose, onComplete }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(null);
  const [results, setResults] = useState(null);

  const handleFilesSelect = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
  };

  const startBatchAnalysis = async () => {
    if (selectedFiles.length === 0) return;

    setIsProcessing(true);
    setProgress({ current: 0, total: selectedFiles.length });

    try {
      const batchResults = await performBatchAnalysis(selectedFiles, (progress) => {
        setProgress(progress);
      });

      setResults(batchResults);
      onComplete(batchResults.results.map(r => r.result));
    } catch (error) {
      console.error('Batch analysis failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-3xl w-full max-h-[80vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">批量肌膚分析</h2>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"
          >
            <AiOutlineClose className="w-4 h-4" />
          </button>
        </div>

        {!isProcessing && !results && (
          <div>
            <div className="border-2 border-dashed border-purple-300 rounded-xl p-8 text-center mb-6">
              <FiCamera className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-800 mb-2">選擇多張照片</h3>
              <p className="text-slate-600 mb-4">一次最多可分析 10 張照片</p>
              
              <input 
                type="file" 
                accept="image/*" 
                multiple
                onChange={handleFilesSelect}
                className="hidden" 
                id="batchImageUpload"
              />
              <label 
                htmlFor="batchImageUpload"
                className="inline-block px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-medium cursor-pointer hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
              >
                選擇照片
              </label>
            </div>

            {selectedFiles.length > 0 && (
              <div>
                <h4 className="font-semibold mb-4">已選擇 {selectedFiles.length} 張照片</h4>
                <div className="grid grid-cols-4 gap-2 mb-6">
                  {selectedFiles.slice(0, 8).map((file, index) => (
                    <div key={index} className="aspect-square bg-slate-100 rounded-lg flex items-center justify-center">
                      <span className="text-xs text-slate-500">{file.name.substring(0, 10)}...</span>
                    </div>
                  ))}
                </div>
                
                <button 
                  onClick={startBatchAnalysis}
                  className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
                >
                  開始批量分析
                </button>
              </div>
            )}
          </div>
        )}

        {isProcessing && progress && (
          <div className="text-center py-8">
            <BiScan className="w-16 h-16 text-purple-500 mx-auto mb-4 animate-pulse" />
            <h3 className="text-xl font-bold text-slate-800 mb-2">正在分析中...</h3>
            <p className="text-slate-600 mb-4">
              處理進度：{progress.current} / {progress.total}
            </p>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300" 
                style={{width: `${(progress.current / progress.total) * 100}%`}}
              ></div>
            </div>
          </div>
        )}

        {results && (
          <div>
            <div className="text-center mb-6">
              <AiOutlineCheck className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-800 mb-2">批量分析完成！</h3>
              <p className="text-slate-600">
                成功分析 {results.successCount} 張，失敗 {results.errorCount} 張
              </p>
            </div>
            
            <button 
              onClick={onClose}
              className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full font-medium"
            >
              查看結果
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * 歷史記錄模態框
 */
const HistoryModal = ({ isOpen, onClose, history, onExport }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-4xl w-full max-h-[80vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">分析歷史記錄</h2>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => onExport('csv')}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              <AiOutlineDownload className="w-4 h-4" />
              導出 CSV
            </button>
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"
            >
              <AiOutlineClose className="w-4 h-4" />
            </button>
          </div>
        </div>

        {history.length > 0 ? (
          <div className="space-y-4">
            {history.slice(0, 20).map((record, index) => (
              <div key={record.metadata?.analysisId || index} className="p-4 bg-slate-50 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">
                      分析 #{record.metadata?.analysisId || index + 1}
                    </h4>
                    <p className="text-sm text-slate-600">
                      總分：{record.overall_score} | 肌膚年齡：{record.skin_age}歲
                    </p>
                    <p className="text-xs text-slate-500">
                      {new Date(record.timestamp).toLocaleDateString('zh-TW')}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    record.metadata?.apiType === 'real' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {record.metadata?.apiType === 'real' ? '專業分析' : '演示模式'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <AiOutlineHistory className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-600 mb-2">暫無歷史記錄</h3>
            <p className="text-slate-500">開始您的第一次肌膚分析吧！</p>
          </div>
        )}
      </div>
    </div>
  );
};

// === 輔助組件 ===

/**
 * 錯誤警告組件
 */
const ErrorAlert = ({ message, onRetry, onClose }) => (
  <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
    <div className="flex items-start gap-3">
      <BiErrorCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <h4 className="text-red-800 font-medium mb-1">分析失敗</h4>
        <p className="text-red-700 text-sm">{message}</p>
      </div>
      <div className="flex gap-2">
        <button 
          onClick={onRetry}
          className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
        >
          重試
        </button>
        <button 
          onClick={onClose}
          className="px-3 py-1 text-red-600 text-sm hover:bg-red-100 rounded-md transition-colors"
        >
          關閉
        </button>
      </div>
    </div>
  </div>
);

/**
 * 進度顯示組件
 */
const ProgressDisplay = ({ progress }) => (
  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
        <BiScan className="w-4 h-4 text-white animate-pulse" />
      </div>
      <div className="flex-1">
        <h4 className="text-blue-800 font-medium">{progress.message}</h4>
        {progress.details && (
          <p className="text-blue-600 text-sm mt-1">{progress.details}</p>
        )}
        {progress.progress !== undefined && (
          <div className="w-full bg-blue-200 rounded-full h-1.5 mt-2">
            <div 
              className="bg-blue-500 h-1.5 rounded-full transition-all duration-300" 
              style={{width: `${Math.min(progress.progress, 100)}%`}}
            ></div>
          </div>
        )}
      </div>
    </div>
  </div>
);

/**
 * 通知組件
 */
const NotificationToast = ({ message, type = 'info', isVisible, onClose }) => {
  if (!isVisible) return null;

  const typeConfig = {
    success: { color: 'bg-green-500', icon: '✅' },
    error: { color: 'bg-red-500', icon: '❌' },
    info: { color: 'bg-blue-500', icon: 'ℹ️' },
    warning: { color: 'bg-amber-500', icon: '⚠️' }
  };

  const config = typeConfig[type];

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className={`${config.color} text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 max-w-sm`}>
        <span className="text-lg">{config.icon}</span>
        <p className="flex-1">{message}</p>
        <button 
          onClick={onClose}
          className="text-white/80 hover:text-white transition-colors"
        >
          <AiOutlineClose className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// 錯誤邊界組件
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
          <div className="text-center p-8">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BiErrorCircle className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">發生了一些問題</h2>
            <p className="text-slate-600 mb-4">系統遇到了錯誤，請重新整理頁面</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              重新載入
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// 包裝主組件
const WrappedBeautyMemoryWebsite = () => (
  <ErrorBoundary>
    <BeautyMemoryWebsite />
  </ErrorBoundary>
);

export default WrappedBeautyMemoryWebsite;