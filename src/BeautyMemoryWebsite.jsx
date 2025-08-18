import React, { useState, useEffect } from 'react';
// 使用 react-icons 替換 lucide-react
import { 
  BiCamera, 
  BiScan, 
  BiBarChart, 
  BiShield, 
  BiData, 
  BiErrorCircle 
} from 'react-icons/bi';

import { 
  FiCamera, 
  FiBarChart, 
  FiShield, 
  FiDatabase, 
  FiZap, 
  FiAlertCircle,
  FiSearch 
} from 'react-icons/fi';

import { 
  AiOutlineClose,
  AiOutlineCheck,
  AiOutlineWarning
} from 'react-icons/ai';

// Components
import HeroSection from './components/sections/HeroSection';
import SystemFeaturesSection from './components/sections/SystemFeaturesSection';
import SkinAnalysisModal from './components/modals/SkinAnalysisModal';
import MemoryCard, { MemoryEmptyState } from './components/common/MemoryCard';

// Data & Utils
import { INITIAL_MEMORIES, SKIN_ANALYSIS_FEATURES, APP_CONFIG } from './data/constants';
import apiUtils, { 
  performSkinAnalysis, 
  preprocessImage, 
  getErrorMessage, 
  checkAPIAvailability,
  getUserQuota,
  compareAnalysisResults,
  APIError 
} from './utils/apiUtils';

/**
 * Main Beauty Memory Website Component with Real API Integration
 */
const BeautyMemoryWebsite = () => {
  // State Management
  const [currentSlide, setCurrentSlide] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [memories, setMemories] = useState(INITIAL_MEMORIES);
  const [activeAnalysisStep, setActiveAnalysisStep] = useState(0);
  const [showSkinAnalysis, setShowSkinAnalysis] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [analysisProgress, setAnalysisProgress] = useState(null);
  const [apiStatus, setApiStatus] = useState({ available: null, checking: true });
  const [userQuota, setUserQuota] = useState(null);
  const [analysisError, setAnalysisError] = useState(null);

  // Effects
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // 檢查 API 可用性
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
        setApiStatus({ available: false, checking: false, error: error.message });
      }
    };

    checkAPI();
  }, []);

  // Event Handlers
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setAnalysisError(null);
      setAnalysisProgress({ step: 0, message: '準備圖片...' });
      
      // 預處理圖片
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
    }
  };

  const startAnalysis = async (imageFile) => {
    try {
      setIsAnalyzing(true);
      setActiveAnalysisStep(1);
      setAnalysisError(null);
      
      // 執行真實的肌膚分析
      const result = await performSkinAnalysis(imageFile, (progress) => {
        setAnalysisProgress(progress);
        
        // 根據進度更新步驟
        if (progress.step === 1) {
          setActiveAnalysisStep(1);
        } else if (progress.step === 2) {
          setActiveAnalysisStep(2);
        } else if (progress.step === 3) {
          setActiveAnalysisStep(3);
        }
      });

      // 比較與上次結果
      const previousResult = memories.length > 0 ? memories[0] : null;
      const comparison = compareAnalysisResults(result, previousResult?.analysisData);
      
      setAnalysisResult({
        ...result,
        comparison
      });
      
      setIsAnalyzing(false);
      setAnalysisProgress({ step: 3, message: '分析完成！' });
      
      // 更新用戶配額
      if (apiStatus.type === 'real') {
        const updatedQuota = await getUserQuota();
        setUserQuota(updatedQuota);
      }
      
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      setAnalysisError(errorMessage);
      setIsAnalyzing(false);
      setAnalysisProgress(null);
      
      // 如果是配額不足錯誤，更新配額狀態
      if (error.code === 'INSUFFICIENT_QUOTA') {
        const updatedQuota = await getUserQuota();
        setUserQuota(updatedQuota);
      }
    }
  };

  const saveToMemory = () => {
    try {
      const newMemory = apiUtils.createMemoryFromAnalysisResult(analysisResult, memories);
      
      // 添加額外的分析數據用於比較
      newMemory.analysisData = analysisResult;
      
      setMemories([newMemory, ...memories]);
      setActiveAnalysisStep(4);
      
      setTimeout(() => {
        resetAnalysisState();
      }, 2000);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      setAnalysisError(errorMessage);
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
    // 檢查 API 狀態和配額
    if (!apiStatus.available) {
      setAnalysisError('API 服務暫時不可用，請稍後重試');
      return;
    }
    
    if (userQuota && !userQuota.available) {
      setAnalysisError('配額不足，請升級您的方案或聯繫客服');
      return;
    }
    
    setShowSkinAnalysis(true);
  };

  const handleLearnMoreClick = () => {
    const techSection = document.getElementById('technology-section');
    if (techSection) {
      techSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* API Status Banner */}
      {apiStatus.checking && <APIStatusBanner status="checking" />}
      {!apiStatus.checking && !apiStatus.available && (
        <APIStatusBanner status="unavailable" message={apiStatus.error} />
      )}
      {userQuota && !userQuota.available && (
        <APIStatusBanner status="quota_exceeded" quota={userQuota} />
      )}
      
      {/* Hero Section */}
      <HeroSection 
        scrollY={scrollY} 
        onAnalysisClick={handleAnalysisClick}
        onLearnMoreClick={handleLearnMoreClick}
        apiStatus={apiStatus}
        userQuota={userQuota}
      />
      
      {/* Enhanced Skin Analysis Modal */}
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
      
      {/* Skin Analysis Features Section */}
      <SkinAnalysisFeaturesSection />
      
      {/* System Features Section */}
      <SystemFeaturesSection />
      
      {/* Enhanced Memory Showcase Section */}
      <EnhancedMemoryShowcaseSection 
        memories={memories} 
        onAnalysisClick={handleAnalysisClick}
        apiStatus={apiStatus}
      />
      
      {/* Technology Section */}
      <TechnologySection />
      
      {/* Enhanced CTA Section */}
      <EnhancedCTASection 
        onAnalysisClick={handleAnalysisClick}
        apiStatus={apiStatus}
        userQuota={userQuota}
      />
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

/**
 * API Status Banner Component
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
 * Enhanced Skin Analysis Modal
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
      <div className="bg-white rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
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

        {/* Error Display */}
        {analysisError && (
          <ErrorAlert 
            message={analysisError} 
            onRetry={onRetry}
            onClose={() => onRetry()}
          />
        )}

        {/* Progress Display */}
        {analysisProgress && !analysisError && (
          <ProgressDisplay progress={analysisProgress} />
        )}

        {/* Original Modal Content */}
        <SkinAnalysisModal 
          isOpen={true}
          onClose={() => {}} // 由外層處理
          activeStep={activeStep}
          uploadedImage={uploadedImage}
          isAnalyzing={isAnalyzing}
          analysisResult={analysisResult}
          onImageUpload={onImageUpload}
          onSaveToMemory={onSaveToMemory}
        />
      </div>
    </div>
  );
};

/**
 * Error Alert Component
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
 * Progress Display Component
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
 * Enhanced Memory Showcase Section with Comparison
 */
const EnhancedMemoryShowcaseSection = ({ memories, onAnalysisClick, apiStatus }) => (
  <section className="py-20 px-4 bg-white/60 backdrop-blur-sm">
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
          AI 美麗記憶實例
        </h2>
        <p className="text-lg text-slate-600">
          系統智能記錄的真實美麗蛻變數據
          {apiStatus.type === 'real' && (
            <span className="block text-sm text-green-600 mt-1">
              <AiOutlineCheck className="w-4 h-4 inline mr-1" />
              使用 Perfect Corp 專業分析技術
            </span>
          )}
        </p>
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

      <div className="text-center mt-8">
        <button 
          onClick={onAnalysisClick}
          disabled={!apiStatus.available}
          className={`px-6 py-3 rounded-full font-medium transition-all duration-300 shadow-lg flex items-center gap-2 mx-auto ${
            apiStatus.available 
              ? 'bg-gradient-to-r from-purple-400 to-pink-400 text-white hover:from-purple-500 hover:to-pink-500' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <FiCamera className="w-5 h-5" />
          立即進行 AI 肌膚分析
        </button>
      </div>
    </div>
  </section>
);

/**
 * Enhanced CTA Section with API Status
 */
const EnhancedCTASection = ({ onAnalysisClick, apiStatus, userQuota }) => (
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
        
        {/* API Status and Quota Info */}
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
          <button 
            onClick={onAnalysisClick}
            disabled={!apiStatus.available}
            className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 whitespace-nowrap shadow-lg ${
              apiStatus.available
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transform hover:scale-105'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            立即分析
          </button>
        </div>

        <CTAFeaturesList />
      </div>
    </div>
  </section>
);

// 保持其他組件不變...
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
  </div>
);

export default BeautyMemoryWebsite;