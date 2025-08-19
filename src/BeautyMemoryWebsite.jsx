import perfectCorpAPI from './services/perfectCorpAPI';
import React, { useState, useEffect, useCallback } from 'react';
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
  BiStar,
  BiBrain,
  BiHeart,
  BiDroplet,
  BiSun
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
  FiMoreVertical,
  FiUpload,
  FiEye
} from 'react-icons/fi';

import { 
  AiOutlineClose,
  AiOutlineCheck,
  AiOutlineWarning,
  AiOutlineDownload,
  AiOutlineHistory,
  AiOutlineHeart,
  AiOutlineFire,
  AiOutlineThunderbolt,
  AiOutlineCrown
} from 'react-icons/ai';

import { 
  RiSparklingFill,
  RiBrainFill,
  RiMagicFill,
  RiFlowerFill
} from 'react-icons/ri';

// 模擬 API 響應
const mockAPIResponse = {
  generateAnalysisResult: () => {
    const baseScore = Math.floor(Math.random() * 20) + 70;
    return {
      overall_score: baseScore,
      skin_age: Math.floor(Math.random() * 10) + 25,
      timestamp: new Date().toISOString(),
      concerns: [
        {
          name: "皺紋",
          score: Math.floor(Math.random() * 30) + 70,
          status: baseScore >= 85 ? "優秀" : baseScore >= 70 ? "良好" : "需改善",
          improvement: Math.random() > 0.5 ? `+${Math.floor(Math.random() * 15) + 1}%` : `-${Math.floor(Math.random() * 10) + 1}%`,
          category: "aging"
        },
        {
          name: "毛孔",
          score: Math.floor(Math.random() * 30) + 60,
          status: baseScore >= 85 ? "優秀" : baseScore >= 70 ? "良好" : "需改善",
          improvement: Math.random() > 0.5 ? `+${Math.floor(Math.random() * 15) + 1}%` : `-${Math.floor(Math.random() * 10) + 1}%`,
          category: "texture"
        },
        {
          name: "色斑",
          score: Math.floor(Math.random() * 20) + 80,
          status: baseScore >= 85 ? "優秀" : baseScore >= 70 ? "良好" : "需改善",
          improvement: Math.random() > 0.5 ? `+${Math.floor(Math.random() * 15) + 1}%` : `-${Math.floor(Math.random() * 10) + 1}%`,
          category: "pigmentation"
        },
        {
          name: "水分",
          score: Math.floor(Math.random() * 25) + 60,
          status: baseScore >= 85 ? "優秀" : baseScore >= 70 ? "良好" : "需改善",
          improvement: Math.random() > 0.5 ? `+${Math.floor(Math.random() * 15) + 1}%` : `-${Math.floor(Math.random() * 10) + 1}%`,
          category: "hydration"
        },
        {
          name: "亮澤度",
          score: Math.floor(Math.random() * 15) + 85,
          status: "優秀",
          improvement: `+${Math.floor(Math.random() * 12) + 1}%`,
          category: "radiance"
        },
        {
          name: "膚質",
          score: Math.floor(Math.random() * 25) + 70,
          status: baseScore >= 85 ? "優秀" : baseScore >= 70 ? "良好" : "需改善",
          improvement: Math.random() > 0.5 ? `+${Math.floor(Math.random() * 15) + 1}%` : `-${Math.floor(Math.random() * 10) + 1}%`,
          category: "texture"
        }
      ],
      recommendations: [
        "建議加強保濕護理，使用含玻尿酸成分的精華液",
        "定期使用溫和去角質產品，改善肌膚紋理",
        "使用含維他命C的精華，提升肌膚亮澤度",
        "加強防曬保護，預防色斑形成"
      ],
      metadata: {
        analysisId: `DEMO_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        processingTime: Math.floor(Math.random() * 3000) + 2000,
        imageQuality: "good",
        faceDetected: true,
        lightingCondition: "optimal",
        apiType: 'demo'
      }
    };
  }
};

// 初始演示數據
const INITIAL_MEMORIES = [
  { 
    id: 1, 
    moment: "肌膚水分提升 15%", 
    emotion: "💧", 
    date: "2025.01.15",
    product: "蓮花精華露",
    aiAnalysis: "AI 分析：肌膚狀態顯著改善，水分充足度達到優秀等級",
    skinMetrics: { 
      水分: 85, 
      亮澤度: 78, 
      緊緻度: 82,
      膚質: 80,
      整體評分: 81
    },
    tags: ["保濕", "改善", "晨間護理"],
    fengShuiAdvice: "水行旺盛，適合深層保濕",
    improvement: "+15%",
    analysisType: "demo"
  },
  { 
    id: 2, 
    moment: "細紋減少 8 條", 
    emotion: "✨", 
    date: "2025.01.20",
    product: "野山蘿蔔精華",
    aiAnalysis: "AI 建議：抗老效果顯著，建議持續使用以達最佳效果",
    skinMetrics: { 
      皺紋: 92, 
      膚質: 88, 
      亮澤度: 85,
      緊緻度: 89,
      整體評分: 88
    },
    tags: ["抗老", "精華", "夜間護理"],
    fengShuiAdvice: "金運旺盛，宜進行修復護理",
    improvement: "+12%",
    analysisType: "demo"
  },
  { 
    id: 3, 
    moment: "膚色亮度提升 2 階", 
    emotion: "🌟", 
    date: "2025.01.25",
    product: "美白保濕霜",
    aiAnalysis: "AI 預測：持續護理 4 週後可達到理想美白效果",
    skinMetrics: { 
      亮澤度: 91, 
      色斑: 87, 
      膚色均勻度: 89,
      水分: 86,
      整體評分: 88
    },
    tags: ["美白", "提亮", "日間護理"],
    fengShuiAdvice: "火元素活躍，適合亮白護理",
    improvement: "+18%",
    analysisType: "demo"
  }
];

// 肌膚分析功能列表
const SKIN_ANALYSIS_FEATURES = [
  { name: "皺紋檢測", icon: <FiEye className="w-5 h-5" />, color: "text-purple-600", category: "aging" },
  { name: "毛孔分析", icon: <BiScan className="w-5 h-5" />, color: "text-blue-600", category: "texture" },
  { name: "色斑檢測", icon: <BiSun className="w-5 h-5" />, color: "text-amber-600", category: "pigmentation" },
  { name: "水分測試", icon: <BiDroplet className="w-5 h-5" />, color: "text-cyan-600", category: "hydration" },
  { name: "膚質分析", icon: <BiBarChart className="w-5 h-5" />, color: "text-green-600", category: "texture" },
  { name: "亮澤度", icon: <RiSparklingFill className="w-5 h-5" />, color: "text-pink-600", category: "radiance" },
  { name: "緊緻度", icon: <AiOutlineThunderbolt className="w-5 h-5" />, color: "text-indigo-600", category: "firmness" },
  { name: "黑眼圈", icon: <FiEye className="w-5 h-5" />, color: "text-gray-600", category: "eye_area" },
  { name: "眼袋檢測", icon: <FiEye className="w-5 h-5" />, color: "text-slate-600", category: "eye_area" },
  { name: "泛紅分析", icon: <BiHeart className="w-5 h-5" />, color: "text-red-500", category: "sensitivity" },
  { name: "出油檢測", icon: <BiDroplet className="w-5 h-5" />, color: "text-yellow-600", category: "oiliness" },
  { name: "痘痘分析", icon: <BiScan className="w-5 h-5" />, color: "text-orange-600", category: "blemish" },
  { name: "膚色均勻度", icon: <RiSparklingFill className="w-5 h-5" />, color: "text-violet-600", category: "evenness" },
  { name: "肌膚年齡", icon: <FiCalendar className="w-5 h-5" />, color: "text-emerald-600", category: "age" }
];

// 分析步驟
const ANALYSIS_STEPS = [
  {
    step: "01",
    title: "上傳照片",
    description: "上傳清晰的臉部照片",
    icon: <FiUpload className="w-8 h-8" />
  },
  {
    step: "02", 
    title: "AI 分析中",
    description: "AI 引擎進行專業檢測",
    icon: <RiBrainFill className="w-8 h-8" />
  },
  {
    step: "03",
    title: "生成報告",
    description: "獲得專業分析報告",
    icon: <BiBarChart className="w-8 h-8" />
  },
  {
    step: "04",
    title: "記憶儲存", 
    description: "保存到美麗記憶庫",
    icon: <FiDatabase className="w-8 h-8" />
  }
];

// 獲取當前風水時機
const getCurrentFengShuiTiming = () => {
  const hour = new Date().getHours();
  const fireHours = [7, 8, 9, 11, 12, 13];
  const waterHours = [19, 20, 21, 23, 0, 1];
  
  if (fireHours.includes(hour)) {
    return {
      type: 'fire',
      recommendation: '離火時辰，適合美白和提亮護理',
      energy: 'high',
      color: '#f43f5e'
    };
  } else if (waterHours.includes(hour)) {
    return {
      type: 'water',
      recommendation: '水元素時辰，適合深層保濕和修復',
      energy: 'calm',
      color: '#3b82f6'
    };
  } else {
    return {
      type: 'neutral',
      recommendation: '平衡時辰，適合基礎護理',
      energy: 'balanced',
      color: '#8b5cf6'
    };
  }
};

/**
 * 美麗記憶網站主組件
 */
const BeautyMemoryWebsite = () => {
  // 基本狀態
  const [scrollY, setScrollY] = useState(0);
  const [memories, setMemories] = useState(INITIAL_MEMORIES);
  const [showSkinAnalysis, setShowSkinAnalysis] = useState(false);
  const [activeAnalysisStep, setActiveAnalysisStep] = useState(0);
  
  // 分析相關狀態
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'info' });
  
  // API 狀態 - 根據環境變量決定是否允許演示模式
  const [apiStatus, setApiStatus] = useState({ 
    isDemo: false, 
    checking: true, 
    message: '正在檢查 API 連接狀態...',
    allowMock: process.env.REACT_APP_ENABLE_MOCK_API !== 'false'
  });
  
  // 風水建議
  const [fengShuiTiming, setFengShuiTiming] = useState(getCurrentFengShuiTiming());

  // Effects
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setFengShuiTiming(getCurrentFengShuiTiming());
    }, 60000); // 每分鐘更新一次
    return () => clearInterval(interval);
  }, []);

  // 模擬 API 狀態檢查
  useEffect(() => {
    const checkAPIStatus = async () => {
  const allowMock = process.env.REACT_APP_ENABLE_MOCK_API !== 'false';
  
  setApiStatus({ 
    isDemo: false, 
    checking: true, 
    message: '正在檢查 Perfect Corp API 連接...',
    allowMock 
  });
  
  try {
    // 檢查環境變數
    const hasClientId = !!process.env.REACT_APP_PERFECT_CORP_CLIENT_ID;
    const hasClientSecret = !!process.env.REACT_APP_PERFECT_CORP_CLIENT_SECRET;
    
    if (!hasClientId || !hasClientSecret) {
      throw new Error('Missing API credentials in environment variables');
    }
    
    // 嘗試進行認證測試
    //const perfectCorpAPI = new PerfectCorpAPIService();
    await perfectCorpAPI.initialize();
    
    if (perfectCorpAPI.useMockAPI) {
      throw new Error('API service initialized in mock mode');
    }
    
    // 嘗試獲取 access token
    await perfectCorpAPI.getAccessToken();
    
    // 如果成功，設置 API 可用
    setApiStatus({ 
      isDemo: false, 
      checking: false, 
      available: true,
      message: 'Perfect Corp API 連接成功',
      allowMock
    });
    
    showNotification('Perfect Corp API 連接成功！', 'success');
    
  } catch (error) {
    console.log('API 連接檢查結果:', error.message);
    
    if (allowMock) {
      // 允許演示模式，切換到演示模式
      setApiStatus({ 
        isDemo: true, 
        checking: false, 
        available: false,
        message: 'API 連接失敗，已切換到演示模式',
        error: error.message,
        allowMock
      });
      showNotification('Perfect Corp API 暫時不可用，已切換到演示模式體驗', 'info');
    } else {
      // 不允許演示模式，顯示錯誤
      setApiStatus({ 
        isDemo: false, 
        checking: false, 
        available: false,
        message: 'Perfect Corp API 連接失敗',
        error: error.message,
        allowMock
      });
      showNotification('Perfect Corp API 連接失敗，請檢查 API 金鑰設定', 'error');
    }
  }
    };

    checkAPIStatus();
  }, []);

  // 事件處理器
  const showNotification = useCallback((message, type = 'info') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: 'info' }), 4000);
  }, []);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // 驗證文件
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      showNotification('請上傳 JPG、JPEG 或 PNG 格式的圖片', 'error');
      return;
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      showNotification('圖片大小不能超過 10MB', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target.result);
      startAnalysis();
    };
    reader.readAsDataURL(file);
  };

  const startAnalysis = async () => {
    setIsAnalyzing(true);
    setActiveAnalysisStep(1);
    
    try {
      // 模擬分析過程
      await new Promise(resolve => setTimeout(resolve, 1500));
      setActiveAnalysisStep(2);
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      const result = mockAPIResponse.generateAnalysisResult();
      
      setAnalysisResult(result);
      setIsAnalyzing(false);
      setActiveAnalysisStep(3);
      
      showNotification('AI 肌膚分析完成！', 'success');
      
    } catch (error) {
      setIsAnalyzing(false);
      showNotification('分析過程中發生錯誤，請重試', 'error');
    }
  };

  const saveToMemory = () => {
    if (!analysisResult) return;
    
    const newMemory = {
      id: memories.length + 1,
      moment: `AI 肌膚分析 - 總分 ${analysisResult.overall_score}`,
      emotion: '🔬',
      date: new Date().toLocaleDateString('zh-TW'),
      product: 'AI 智能分析',
      aiAnalysis: `肌膚年齡: ${analysisResult.skin_age}歲，${getAnalysisInsight(analysisResult.overall_score)}`,
      skinMetrics: analysisResult.concerns.reduce((acc, concern) => {
        acc[concern.name] = concern.score;
        return acc;
      }, {}),
      analysisId: analysisResult.metadata?.analysisId,
      timestamp: analysisResult.timestamp,
      analysisData: analysisResult
    };
    
    setMemories([newMemory, ...memories]);
    setActiveAnalysisStep(4);
    showNotification('美麗記憶已保存！', 'success');
    
    setTimeout(() => {
      resetAnalysisState();
    }, 2000);
  };

  const getAnalysisInsight = (score) => {
    if (score >= 85) return "肌膚狀態優秀，建議維持現有保養習慣";
    if (score >= 75) return "肌膚狀態良好，建議持續保養";
    if (score >= 65) return "肌膚需要加強護理，建議調整保養方案";
    return "建議尋求專業皮膚科醫師建議";
  };

  const resetAnalysisState = () => {
    setShowSkinAnalysis(false);
    setActiveAnalysisStep(0);
    setAnalysisResult(null);
    setUploadedImage(null);
    setIsAnalyzing(false);
  };

  const handleAnalysisClick = () => {
    if (!apiStatus.allowMock && (!apiStatus.available && apiStatus.available !== undefined)) {
      showNotification('Perfect Corp API 服務暫時不可用，請稍後重試或聯繫技術支援', 'error');
      return;
    }
    
    if (!apiStatus.isDemo && !apiStatus.available && apiStatus.available !== undefined) {
      showNotification('API 服務不可用，且演示模式已禁用', 'error');
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
      {/* API 狀態橫幅 */}
      <APIStatusBanner apiStatus={apiStatus} />

      {/* 通知組件 */}
      <NotificationToast 
        message={notification.message}
        type={notification.type}
        isVisible={notification.show}
        onClose={() => setNotification({ show: false, message: '', type: 'info' })}
      />

      {/* 風水時機提示橫幅 */}
      <FengShuiTimingBanner fengShui={fengShuiTiming} />

      {/* Hero 區域 */}
      <HeroSection 
        scrollY={scrollY} 
        onAnalysisClick={handleAnalysisClick}
        onLearnMoreClick={handleLearnMoreClick}
        apiStatus={apiStatus}
      />

      {/* 肌膚分析功能展示 */}
      <SkinAnalysisFeaturesSection />
      
      {/* 系統功能區域 */}
      <SystemFeaturesSection />
      
      {/* 記憶展示區域 */}
      <MemoryShowcaseSection 
        memories={memories} 
        onAnalysisClick={handleAnalysisClick}
      />
      
      {/* 技術說明區域 */}
      <TechnologySection />
      
      {/* CTA 區域 */}
      <CTASection 
        onAnalysisClick={handleAnalysisClick}
      />
      
      {/* 頁腳 */}
      <Footer />

      {/* 分析模態框 */}
      <SkinAnalysisModal 
        isOpen={showSkinAnalysis}
        onClose={resetAnalysisState}
        activeStep={activeAnalysisStep}
        uploadedImage={uploadedImage}
        isAnalyzing={isAnalyzing}
        analysisResult={analysisResult}
        onImageUpload={handleImageUpload}
        onSaveToMemory={saveToMemory}
        apiStatus={apiStatus}
      />
    </div>
  );
};

// === 組件定義 ===

/**
 * API 狀態橫幅組件
 */
const APIStatusBanner = ({ apiStatus }) => {
  // 檢查中
  if (apiStatus.checking) {
    return (
      <div className="bg-blue-50 border-blue-200 text-blue-700 border-b px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          <BiScan className="w-5 h-5 animate-spin" />
          <span className="font-medium">檢查 Perfect Corp API 狀態中...</span>
        </div>
      </div>
    );
  }

  // API 不可用且不允許演示模式
  if (!apiStatus.isDemo && apiStatus.available === false) {
    return (
      <div className="bg-red-50 border-red-200 text-red-700 border-b px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AiOutlineWarning className="w-5 h-5" />
            <div>
              <span className="font-medium">⚠️ API 服務不可用</span>
              <span className="ml-2 text-sm opacity-80">
                Perfect Corp API 連接失敗，演示模式已禁用
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm bg-red-100 px-3 py-1 rounded-full">
              需要技術支援
            </span>
          </div>
        </div>
      </div>
    );
  }

  // 演示模式
  if (apiStatus.isDemo) {
    return (
      <div className="bg-amber-50 border-amber-200 text-amber-700 border-b px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-lg">🧪</span>
            <div>
              <span className="font-medium">演示模式</span>
              <span className="ml-2 text-sm opacity-80">
                {apiStatus.message}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm bg-amber-100 px-3 py-1 rounded-full">
              完整功能體驗
            </span>
          </div>
        </div>
      </div>
    );
  }

  // API 可用（真實模式）
  if (apiStatus.available) {
    return (
      <div className="bg-green-50 border-green-200 text-green-700 border-b px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-lg">🔗</span>
            <div>
              <span className="font-medium">Perfect Corp API 已連接</span>
              <span className="ml-2 text-sm opacity-80">
                專業級真實分析服務
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm bg-green-100 px-3 py-1 rounded-full">
              真實模式
            </span>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

/**
 * 風水時機橫幅
 */
const FengShuiTimingBanner = ({ fengShui }) => (
  <div 
    className="py-2 px-4 text-center text-sm border-b"
    style={{ 
      backgroundColor: fengShui.color + '20', 
      color: fengShui.color,
      borderColor: fengShui.color + '30'
    }}
  >
    <div className="max-w-6xl mx-auto flex items-center justify-center gap-2">
      <FiStar className="w-4 h-4" />
      <span className="font-medium">
        🔮 九紫離火運 2025：{fengShui.recommendation}
      </span>
    </div>
  </div>
);

/**
 * Hero 區域
 */
const HeroSection = ({ scrollY, onAnalysisClick, onLearnMoreClick, apiStatus }) => (
  <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
    {/* 背景動畫 */}
    <AnimatedBackground scrollY={scrollY} />
    
    {/* 主要內容 */}
    <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
      {/* 技術徽章 */}
      <div className="mb-8 inline-flex items-center bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 border border-blue-200/50 shadow-lg">
        <BiScan className="w-5 h-5 text-purple-500 mr-2 animate-pulse" />
        <span className="text-slate-700 text-sm font-medium">
          Perfect Corp AI • 醫師級肌膚分析技術
          {apiStatus && !apiStatus.checking && (
            <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
              apiStatus.isDemo 
                ? 'bg-amber-100 text-amber-700' 
                : apiStatus.available
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
            }`}>
              {apiStatus.isDemo ? '演示模式' : apiStatus.available ? '真實模式' : '服務不可用'}
            </span>
          )}
        </span>
      </div>

      {/* 品牌標題 */}
      <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 bg-clip-text text-transparent mb-6 tracking-tight">
        美魔力
      </h1>

      {/* 品牌描述 */}
      <div className="mb-8">
        <p className="text-3xl md:text-4xl text-slate-700 font-bold mb-3">
          Beauty Memory
        </p>
        <p className="text-xl text-purple-600 font-medium mb-2">
          AI 智能肌膚分析 • 美麗記憶系統
        </p>
        <p className="text-lg text-slate-500 italic">
          Memory = 美魔力 • Perfect Corp 技術驅動
        </p>
      </div>

      {/* 價值主張 */}
      <p className="text-xl md:text-2xl text-slate-600 mb-8 max-w-4xl mx-auto leading-relaxed">
        全球首創 AI 美麗記憶技術<br />
        <span className="text-pink-500 font-medium">
          95% 準確率媲美專業皮膚科醫師
        </span>
      </p>

      {/* CTA 按鈕 */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto mb-6">
        <button 
          onClick={onAnalysisClick}
          disabled={!apiStatus?.isDemo && !apiStatus?.available}
          className={`group px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 shadow-lg flex items-center gap-2 ${
            (!apiStatus?.isDemo && !apiStatus?.available)
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 hover:shadow-xl'
          }`}
        >
          <FiCamera className={`w-5 h-5 ${(!apiStatus?.isDemo && !apiStatus?.available) ? '' : 'group-hover:rotate-12'} transition-transform duration-300`} />
          {apiStatus?.isDemo ? '立即體驗 AI 肌膚分析' : apiStatus?.available ? '立即 AI 肌膚分析' : 'API 服務暫時不可用'}
        </button>
        <button 
          onClick={onLearnMoreClick}
          className="px-8 py-4 border-2 border-purple-300 rounded-full text-purple-600 font-semibold text-lg hover:bg-purple-50 hover:border-purple-400 transition-all duration-300 shadow-sm hover:shadow-md"
        >
          了解分析技術
        </button>
      </div>
      
      {/* API 不可用時的提示 */}
      {!apiStatus?.isDemo && !apiStatus?.available && apiStatus?.available !== undefined && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg max-w-md mx-auto">
          <div className="text-center">
            <AiOutlineWarning className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <p className="text-red-700 text-sm font-medium mb-2">Perfect Corp API 服務暫時不可用</p>
            <p className="text-red-600 text-xs">
              演示模式已禁用 (REACT_APP_ENABLE_MOCK_API=false)<br />
              請聯繫技術支援或稍後重試
            </p>
          </div>
        </div>
      )}
    </div>
    
    {/* 滾動指示器 */}
    <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
      <div className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200 flex items-center justify-center shadow-lg">
        <BiTrendingDown className="w-4 h-4 text-slate-400" />
      </div>
    </div>
  </section>
);

/**
 * 動畫背景
 */
const AnimatedBackground = ({ scrollY }) => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(12)].map((_, i) => (
      <div
        key={i}
        className="absolute animate-pulse"
        style={{
          left: `${10 + i * 8}%`,
          top: `${15 + (i % 4) * 20}%`,
          animationDelay: `${i * 0.3}s`,
          transform: `translateY(${scrollY * (0.1 + i * 0.02)}px)`
        }}
      >
        <div className="w-1 h-1 bg-gradient-to-r from-blue-300 to-purple-300 rounded-full opacity-40" />
        {i % 3 === 0 && (
          <div className="absolute inset-0 w-8 h-8 border border-purple-200/30 rounded-full animate-ping" />
        )}
      </div>
    ))}
  </div>
);

/**
 * 肌膚分析功能區域
 */
const SkinAnalysisFeaturesSection = () => (
  <section className="py-16 px-4 bg-white/50 backdrop-blur-sm border-y border-slate-200/50">
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
          14 項專業肌膚檢測
        </h2>
        <p className="text-lg text-slate-600 mb-6">
          Perfect Corp 醫師級 AI 技術，95% 準確率
        </p>
        <div className="grid md:grid-cols-3 lg:grid-cols-7 gap-4">
          {SKIN_ANALYSIS_FEATURES.map((feature, index) => (
            <div key={index} className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
              <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg mb-2 ${feature.color} bg-opacity-10`}>
                {React.cloneElement(feature.icon, { className: `w-5 h-5 ${feature.color}` })}
              </div>
              <h3 className="text-xs font-bold text-slate-800">{feature.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

/**
 * 系統功能區域
 */
const SystemFeaturesSection = () => (
  <section className="py-20 px-4 relative bg-white/40 backdrop-blur-sm">
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
          AI 智能美麗記憶系統
        </h2>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
          整合 Perfect Corp 專業肌膚分析技術，為您打造專屬的美麗記憶庫，
          讓每一次護膚都成為科學化的美麗投資。
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        <SystemFeatureCard 
          icon={<BiScan className="w-8 h-8" />}
          title="AI 即時肌膚掃描"
          subtitle="Perfect Corp 14項專業檢測"
          description="運用 Perfect Corp 專業技術，即時分析皺紋、毛孔、色斑、亮澤度等 14 項肌膚指標，95% 準確率媲美專業皮膚科醫師，提供醫師級分析報告。"
          gradient="from-blue-400 to-cyan-400"
          details={[
            "即時肌膚狀態掃描",
            "14項專業肌膚分析", 
            "95%醫師級準確率",
            "個人化改善建議"
          ]}
        />
        
        <SystemFeatureCard 
          icon={<BiData className="w-8 h-8" />}
          title="美麗記憶資料庫"
          subtitle="智能化美麗成長記錄"
          description="建立個人美麗成長歷程，AI 智能記錄每次護膚的細微變化，形成專屬的美麗記憶庫，追蹤美麗蛻變軌跡。"
          gradient="from-purple-400 to-indigo-400"
          details={[
            "美麗歷程完整記錄",
            "護膚效果數據分析",
            "個人偏好學習記憶", 
            "趨勢變化可視化"
          ]}
        />
        
        <SystemFeatureCard 
          icon={<FiCamera className="w-8 h-8" />}
          title="智能記憶捕捉"
          subtitle="高精度影像識別技術"
          description="採用先進的 AI 影像識別技術，自動捕捉並分析美麗變化，智能標記重要時刻，讓每個進步都成為珍貴記憶。"
          gradient="from-pink-400 to-rose-400"
          details={[
            "高清肌膚影像記錄",
            "自動美麗變化檢測",
            "時間軸美麗對比",
            "智能標籤系統"
          ]}
        />
        
        <SystemFeatureCard 
          icon={<FiZap className="w-8 h-8" />}
          title="AI 智能提醒系統"
          subtitle="個性化護膚時程管理"
          description="基於您的生活節奏、肌膚週期和 2025 九紫離火運風水時機，智能提醒最佳護膚時機，讓美麗成為自然習慣。"
          gradient="from-amber-400 to-orange-400"
          details={[
            "個人化護膚時程表",
            "九紫離火運時機提醒",
            "環境因子護膚建議",
            "習慣養成智能助手"
          ]}
        />
      </div>
    </div>
  </section>
);

/**
 * 系統功能卡片
 */
const SystemFeatureCard = ({ icon, title, subtitle, description, gradient, details }) => (
  <div className="group relative">
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-slate-200 hover:border-purple-300 transition-all duration-300 transform hover:-translate-y-2 shadow-lg hover:shadow-xl">
      {/* 圖標 */}
      <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r ${gradient} rounded-3xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
        {React.cloneElement(icon, { className: "w-8 h-8 text-white" })}
      </div>
      
      {/* 內容 */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">{title}</h3>
        <p className="text-purple-600 text-sm mb-4 font-medium">{subtitle}</p>
        <p className="text-slate-600 leading-relaxed">{description}</p>
      </div>
      
      {/* 特點列表 */}
      <div className="space-y-2">
        {details.map((detail, idx) => (
          <div 
            key={idx}
            className="flex items-center text-sm text-slate-600 group-hover:text-slate-700 transition-colors duration-300"
          >
            <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mr-3 group-hover:scale-125 transition-transform duration-300" />
            <span className="group-hover:translate-x-1 transition-transform duration-300">
              {detail}
            </span>
          </div>
        ))}
      </div>
      
      {/* 懸停效果覆蓋層 */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  </div>
);

/**
 * 記憶展示區域
 */
const MemoryShowcaseSection = ({ memories, onAnalysisClick }) => (
  <section className="py-20 px-4 bg-white/60 backdrop-blur-sm">
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
          AI 美麗記憶實例
        </h2>
        <p className="text-lg text-slate-600 mb-6">
          系統智能記錄的真實美麗蛻變數據
        </p>
        
        <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200 inline-block">
          <div className="flex items-center gap-2">
            <BiTrendingUp className="w-5 h-5 text-green-500" />
            <span className="font-medium text-slate-700">美麗趨勢：</span>
            <span className="text-purple-600">持續改善中，平均提升 15%</span>
          </div>
        </div>
      </div>

      <div className="flex justify-center mb-8">
        <button 
          onClick={onAnalysisClick}
          className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
        >
          <FiCamera className="w-5 h-5" />
          立即開始分析
        </button>
      </div>

      {memories.length > 0 ? (
        <div className="grid gap-6">
          {memories.map((memory) => (
            <MemoryCard key={memory.id} memory={memory} />
          ))}
        </div>
      ) : (
        <MemoryEmptyState onAnalysisClick={onAnalysisClick} />
      )}
    </div>
  </section>
);

/**
 * 記憶卡片組件
 */
const MemoryCard = ({ memory }) => {
  const {
    id,
    moment,
    emotion,
    date,
    product,
    aiAnalysis,
    skinMetrics,
    tags,
    fengShuiAdvice,
    improvement,
    analysisType
  } = memory;

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
      {/* 卡片頭部 */}
      <div className="flex items-start gap-4 mb-4">
        <div className="text-4xl flex-shrink-0 animate-pulse">{emotion}</div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <p className="text-slate-800 font-bold text-lg">{moment}</p>
              <span className={`text-xs px-2 py-1 rounded-full ${
                analysisType === 'demo' 
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'bg-green-50 text-green-700 border border-green-200'
              }`}>
                {analysisType === 'demo' ? '演示模式' : '專業分析'}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-4 mb-2">
            <p className="text-slate-600">使用產品：{product}</p>
            <div className="flex items-center gap-1 text-slate-500 text-sm">
              <BiTime className="w-4 h-4" />
              <span>{date}</span>
            </div>
          </div>

          {improvement && (
            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
              improvement.startsWith('+') ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'
            }`}>
              {improvement.startsWith('+') ? <BiTrendingUp className="w-3 h-3" /> : <BiTrendingDown className="w-3 h-3" />}
              <span>較上次 {improvement}</span>
            </div>
          )}
        </div>
      </div>

      {/* 標籤 */}
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {tags.map((tag, index) => (
            <span 
              key={index}
              className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs"
            >
              <FiStar className="w-3 h-3" />
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* 肌膚指標 */}
      {skinMetrics && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
            <BiBarChart className="w-4 h-4" />
            肌膚指標
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {Object.entries(skinMetrics).slice(0, 4).map(([key, value], idx) => (
              <MetricCard key={idx} label={key} value={value} />
            ))}
          </div>
        </div>
      )}

      {/* AI 分析 */}
      {aiAnalysis && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200/50 mb-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm">🤖</span>
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-purple-800 mb-1">AI 深度分析</h4>
              <p className="text-sm text-purple-700 leading-relaxed">
                {aiAnalysis}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 風水建議 */}
      {fengShuiAdvice && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-4 border border-amber-200/50">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm">🔮</span>
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-amber-800 mb-1">九紫離火運建議</h4>
              <p className="text-sm text-amber-700 leading-relaxed">
                {fengShuiAdvice}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * 指標卡片
 */
const MetricCard = ({ label, value }) => {
  const getScoreInfo = (score) => {
    if (score >= 90) return { color: "text-green-600 bg-green-50 border-green-200", level: "優秀" };
    if (score >= 80) return { color: "text-blue-600 bg-blue-50 border-blue-200", level: "良好" };
    if (score >= 70) return { color: "text-amber-600 bg-amber-50 border-amber-200", level: "一般" };
    return { color: "text-red-600 bg-red-50 border-red-200", level: "需改善" };
  };
  
  const scoreInfo = getScoreInfo(value);
  
  return (
    <div className={`rounded-lg p-3 text-center border ${scoreInfo.color} transition-all duration-200 hover:scale-105`}>
      <div className="text-xs text-slate-600 font-medium mb-1">{label}</div>
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
 * 空狀態組件
 */
const MemoryEmptyState = ({ onAnalysisClick }) => (
  <div className="text-center py-16">
    <div className="w-32 h-32 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-8">
      <BiBarChart className="w-16 h-16 text-purple-400" />
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
  </div>
);

/**
 * 技術說明區域
 */
const TechnologySection = () => (
  <section id="technology-section" className="py-20 px-4 bg-gradient-to-r from-blue-50 to-purple-50">
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
          Perfect Corp 專業技術驅動
        </h2>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
          採用全球領先的 Perfect Corp AI 肌膚分析技術，
          提供媲美專業皮膚科醫師的精準檢測服務。
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <TechCard 
          icon={<BiBarChart className="w-8 h-8 text-white" />}
          gradient="from-blue-500 to-cyan-500"
          title="95% 準確率"
          description="Wake Forest 醫學院皮膚科教授驗證，與醫師診斷相關性超過 80%"
        />
        
        <TechCard 
          icon={<FiZap className="w-8 h-8 text-white" />}
          gradient="from-purple-500 to-pink-500"
          title="即時分析"
          description="先進 AI 演算法，數秒內完成 14 項專業肌膚檢測"
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
          Perfect Corp 專利 AgileFace® 追蹤技術
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
 * CTA 區域
 */
const CTASection = ({ onAnalysisClick, apiStatus }) => (
  <section className="py-20 px-4 bg-gradient-to-r from-purple-100 to-pink-100">
    <div className="max-w-4xl mx-auto text-center">
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 border border-slate-200 shadow-xl">
        <BiScan className="w-20 h-20 text-purple-500 mx-auto mb-6 animate-pulse" />
        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6">
          立即體驗 AI 肌膚分析
        </h2>
        <p className="text-xl text-slate-600 mb-8 leading-relaxed">
          Perfect Corp 專業技術 • 95% 醫師級準確率<br />
          開始建立專屬的美麗記憶庫
        </p>
        
        <div className={`${
          apiStatus?.isDemo 
            ? 'bg-amber-50 border-amber-200 text-amber-700' 
            : apiStatus?.available
              ? 'bg-green-50 border-green-200 text-green-700'
              : 'bg-red-50 border-red-200 text-red-700'
        } border rounded-lg p-4 mb-6`}>
          <div className="flex items-center justify-center gap-2">
            <FiShield className="w-4 h-4" />
            <span className="text-sm font-medium">
              {apiStatus?.isDemo 
                ? '🧪 演示模式 • 完整功能體驗 • 無需註冊' 
                : apiStatus?.available
                  ? '🔗 Perfect Corp API • 專業級分析服務'
                  : '⚠️ API 服務不可用 • 請聯繫技術支援'
              }
            </span>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto mb-6">
          <input 
            type="email" 
            placeholder="輸入郵件，獲取 AI 分析報告"
            className="w-full px-6 py-3 bg-white/80 border border-slate-300 rounded-full text-slate-700 placeholder-slate-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-200 backdrop-blur-sm shadow-sm"
          />
          <button 
            onClick={onAnalysisClick}
            disabled={!apiStatus?.isDemo && !apiStatus?.available}
            className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 whitespace-nowrap shadow-lg flex items-center gap-2 ${
              (!apiStatus?.isDemo && !apiStatus?.available)
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transform hover:scale-105'
            }`}
          >
            <FiCamera className="w-4 h-4" />
            {apiStatus?.isDemo ? '體驗分析' : apiStatus?.available ? '立即分析' : '服務不可用'}
          </button>
        </div>

        <div className="grid md:grid-cols-4 gap-4 text-sm text-slate-600 max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-2">
            <BiScan className="w-4 h-4 text-purple-500" />
            <span>14 項專業檢測</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <FiBarChart className="w-4 h-4 text-blue-500" />
            <span>95% 準確率</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <FiShield className="w-4 h-4 text-green-500" />
            <span>隱私安全保護</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <FiDatabase className="w-4 h-4 text-pink-500" />
            <span>美麗記憶庫</span>
          </div>
        </div>
      </div>
    </div>
  </section>
);

/**
 * 頁腳
 */
const Footer = () => (
  <footer className="py-12 px-4 border-t border-slate-200 bg-white/40 backdrop-blur-sm">
    <div className="max-w-6xl mx-auto">
      <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
        <div>
          <h3 className="text-2xl font-bold text-slate-800 mb-2">美魔力</h3>
          <p className="text-xl text-purple-600 mb-4">Beauty Memory</p>
          <p className="text-slate-600 leading-relaxed">
            AI 智能肌膚分析系統<br />
            Perfect Corp 技術驅動<br />
            Memory = 美魔力
          </p>
        </div>
        
        <div>
          <h4 className="text-lg font-semibold text-slate-800 mb-4">AI 分析功能</h4>
          <ul className="space-y-2 text-slate-600">
            <li>🔬 14 項專業肌膚檢測</li>
            <li>📊 95% 醫師級準確率</li>
            <li>📸 即時智能分析</li>
            <li>💾 美麗記憶儲存</li>
            <li>🔮 九紫離火運整合</li>
            <li>📈 美麗趨勢追蹤</li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-lg font-semibold text-slate-800 mb-4">技術特色</h4>
          <div className="text-slate-600 space-y-2">
            <p>🏥 Perfect Corp 專業技術</p>
            <p>🔒 企業級安全防護</p>
            <p>📈 個人化改善建議</p>
            <p>🤖 AI 美容顧問服務</p>
            <p>⚡ 即時處理功能</p>
            <p>📊 數據追蹤分析</p>
          </div>
        </div>
      </div>
      
      <div className="border-t border-slate-200 mt-8 pt-8 text-center">
        <p className="text-slate-500 text-sm mb-2">
          © 2025 美魔力 Beauty Memory • AI 智能肌膚分析系統
        </p>
        <p className="text-slate-400 text-xs">
          Powered by Perfect Corp • Memory = 美魔力 • 讓科技記住每個美麗瞬間
        </p>
        <div className="mt-4 flex justify-center gap-4 text-slate-400">
          <a href="#" className="hover:text-purple-600 transition-colors">隱私政策</a>
          <a href="#" className="hover:text-purple-600 transition-colors">使用條款</a>
          <a href="#" className="hover:text-purple-600 transition-colors">聯繫我們</a>
          <a href="#" className="hover:text-purple-600 transition-colors">技術支援</a>
        </div>
      </div>
    </div>
  </footer>
);

/**
 * 肌膚分析模態框
 */
const SkinAnalysisModal = ({ 
  isOpen, 
  onClose, 
  activeStep, 
  uploadedImage, 
  isAnalyzing, 
  analysisResult, 
  onImageUpload, 
  onSaveToMemory,
  apiStatus
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
              AI 肌膚分析系統
              <span className={`text-xs px-3 py-1 rounded-full ${
                apiStatus?.isDemo 
                  ? 'bg-amber-100 text-amber-700 border border-amber-200'
                  : 'bg-green-100 text-green-700 border border-green-200'
              }`}>
                {apiStatus?.isDemo ? '🧪 演示模式' : '🔗 真實模式'}
              </span>
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {apiStatus?.isDemo 
                ? '體驗完整 AI 分析功能，無需真實 API 連接'
                : '使用 Perfect Corp 專業 API 進行真實分析'
              }
            </p>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors group"
          >
            <AiOutlineClose className="w-4 h-4 text-slate-600 group-hover:text-slate-800" />
          </button>
        </div>
        
        <AnalysisStepsIndicator activeStep={activeStep} />
        
        <ModalContent 
          activeStep={activeStep}
          uploadedImage={uploadedImage}
          isAnalyzing={isAnalyzing}
          analysisResult={analysisResult}
          onImageUpload={onImageUpload}
          onSaveToMemory={onSaveToMemory}
          apiStatus={apiStatus}
        />
      </div>
    </div>
  );
};

/**
 * 分析步驟指示器
 */
const AnalysisStepsIndicator = ({ activeStep }) => (
  <div className="grid md:grid-cols-4 gap-4 mb-8">
    {ANALYSIS_STEPS.map((step, index) => (
      <StepIndicatorCard 
        key={index} 
        step={step} 
        index={index} 
        activeStep={activeStep} 
      />
    ))}
  </div>
);

const StepIndicatorCard = ({ step, index, activeStep }) => {
  const getStepStatus = () => {
    if (activeStep === index) return 'active';
    if (activeStep > index) return 'completed';
    return 'pending';
  };

  const status = getStepStatus();
  
  const statusClasses = {
    active: 'border-purple-400 bg-purple-50',
    completed: 'border-green-400 bg-green-50',
    pending: 'border-slate-200 bg-slate-50'
  };

  const iconClasses = {
    active: 'bg-purple-500 text-white',
    completed: 'bg-green-500 text-white',
    pending: 'bg-slate-300 text-slate-600'
  };

  return (
    <div className={`text-center p-4 rounded-xl border-2 transition-all duration-300 ${statusClasses[status]}`}>
      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-3 transition-all duration-300 ${iconClasses[status]}`}>
        {React.cloneElement(step.icon, { className: "w-6 h-6" })}
      </div>
      <div className="text-xs text-purple-500 font-bold mb-1">{step.step}</div>
      <h3 className="text-sm font-bold text-slate-800 mb-1">{step.title}</h3>
      <p className="text-xs text-slate-600">{step.description}</p>
    </div>
  );
};


/**
 * 模態框內容
 */
const ModalContent = ({ 
  activeStep, 
  uploadedImage, 
  isAnalyzing, 
  analysisResult, 
  onImageUpload, 
  onSaveToMemory,
  apiStatus
}) => {
  if (!uploadedImage && activeStep === 0) {
    return <ImageUploadSection onImageUpload={onImageUpload} apiStatus={apiStatus} />;
  }

  if (uploadedImage && isAnalyzing) {
    return <AnalyzingSection apiStatus={apiStatus} />;
  }

  if (analysisResult && !isAnalyzing && activeStep === 3) {
    return <AnalysisResultsSection result={analysisResult} onSaveToMemory={onSaveToMemory} apiStatus={apiStatus} />;
  }

  if (activeStep === 4) {
    return <SavedToMemorySection apiStatus={apiStatus} />;
  }

  return null;
};

/**
 * 圖片上傳區域
 */
const ImageUploadSection = ({ onImageUpload, apiStatus }) => (
  <div className="border-2 border-dashed border-purple-300 rounded-xl p-8 text-center mb-6 hover:border-purple-400 transition-colors duration-300">
    <FiUpload className="w-12 h-12 text-purple-400 mx-auto mb-4" />
    <h3 className="text-lg font-bold text-slate-800 mb-2">上傳您的照片</h3>
    <p className="text-slate-600 mb-4">支援 JPG、PNG 格式，建議正面清晰照片</p>
    
    {apiStatus?.isDemo && (
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
        <p className="text-amber-700 text-sm">
          🧪 演示模式：上傳任何照片都會生成模擬的 AI 分析結果
        </p>
      </div>
    )}
    
    <p className="text-sm text-slate-500 mb-6">
      💡 提示：確保光線充足、臉部清晰可見，以獲得最佳分析效果
    </p>
    
    <input 
      type="file" 
      accept="image/*" 
      onChange={onImageUpload}
      className="hidden" 
      id="imageUpload"
    />
    <label 
      htmlFor="imageUpload"
      className="inline-block px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-medium cursor-pointer hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
    >
      選擇照片
    </label>
  </div>
);

/**
 * 分析中區域
 */
const AnalyzingSection = () => (
  <div className="text-center py-8">
    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4 animate-pulse">
      <RiBrainFill className="w-10 h-10 text-white" />
    </div>
    <h3 className="text-xl font-bold text-slate-800 mb-2">AI 正在分析您的肌膚...</h3>
    <p className="text-slate-600 mb-4">AI 引擎正在進行 14 項專業檢測</p>
    
    {/* 進度條 */}
    <div className="w-64 bg-slate-200 rounded-full h-2 mx-auto mb-4">
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full animate-pulse transition-all duration-1000" 
           style={{ width: '75%' }}></div>
    </div>
    
    {/* 分析步驟 */}
    <div className="text-sm text-slate-500 space-y-1">
      <p>🔍 檢測臉部特徵...</p>
      <p>📊 分析肌膚狀態...</p>
      <p>🧠 生成個人化建議...</p>
    </div>
  </div>
);

/**
 * 分析結果區域
 */
const AnalysisResultsSection = ({ result, onSaveToMemory, apiStatus }) => (
  <div className="space-y-6">
    {apiStatus?.isDemo && (
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-amber-600">🧪</span>
          <h4 className="font-semibold text-amber-800">演示模式結果</h4>
        </div>
        <p className="text-amber-700 text-sm">
          以下是模擬的 AI 分析結果，展示完整功能體驗。真實模式將使用 Perfect Corp 專業 API 進行實際分析。
        </p>
      </div>
    )}
    
    <OverallScoreCard result={result} apiStatus={apiStatus} />
    <ConcernsGrid concerns={result.concerns} />
    <RecommendationsCard recommendations={result.recommendations} />
    <SaveButton onSaveToMemory={onSaveToMemory} apiStatus={apiStatus} />
  </div>
);

/**
 * 總體評分卡片
 */
const OverallScoreCard = ({ result, apiStatus }) => (
  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <h3 className="text-xl font-bold text-slate-800">分析結果</h3>
        <span className={`text-xs px-2 py-1 rounded-full ${
          apiStatus?.isDemo 
            ? 'bg-amber-100 text-amber-700'
            : 'bg-green-100 text-green-700'
        }`}>
          {apiStatus?.isDemo ? '演示' : '真實'}
        </span>
      </div>
      <div className="text-right">
        <div className="text-3xl font-bold text-purple-600">{result.overall_score}</div>
        <div className="text-sm text-slate-600">總體評分</div>
      </div>
    </div>
    <div className="text-center">
      <div className="inline-block bg-white rounded-lg p-3 shadow-sm">
        <span className="text-sm text-slate-600">
          {apiStatus?.isDemo ? '模擬' : 'AI'} 推算肌膚年齡：
        </span>
        <span className="text-lg font-bold text-purple-600 ml-2">{result.skin_age} 歲</span>
      </div>
    </div>
  </div>
);

/**
 * 問題分析網格
 */
const ConcernsGrid = ({ concerns }) => (
  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
    {concerns.map((concern, index) => (
      <ConcernCard key={index} concern={concern} />
    ))}
  </div>
);

/**
 * 單個問題卡片
 */
const ConcernCard = ({ concern }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case '優秀': return 'bg-green-100 text-green-700 border-green-200';
      case '良好': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-amber-100 text-amber-700 border-amber-200';
    }
  };

  return (
    <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-bold text-slate-800">{concern.name}</h4>
        <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(concern.status)}`}>
          {concern.status}
        </span>
      </div>
      
      <div className="mb-2">
        <div className="flex justify-between text-sm mb-1">
          <span>評分</span>
          <span className="font-bold">{concern.score}/100</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full transition-all duration-1000" 
            style={{width: `${concern.score}%`}}
          ></div>
        </div>
      </div>
      
      <div className="text-xs text-slate-600">
        較上次 <span className={concern.improvement.startsWith('+') ? 'text-green-600' : 'text-red-600'}>
          {concern.improvement}
        </span>
      </div>
    </div>
  );
};

/**
 * 建議卡片
 */
const RecommendationsCard = ({ recommendations }) => (
  <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
    <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
      <span>🤖</span>
      AI 個人化建議
    </h4>
    <ul className="space-y-2">
      {recommendations.map((rec, index) => (
        <li key={index} className="flex items-start gap-2 text-slate-700">
          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
          {rec}
        </li>
      ))}
    </ul>
  </div>
);

/**
 * 保存按鈕
 */
const SaveButton = ({ onSaveToMemory, apiStatus }) => (
  <div className="text-center">
    <button 
      onClick={onSaveToMemory}
      className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
    >
      {apiStatus?.isDemo ? '保存演示結果到記憶庫' : '保存到美麗記憶庫'}
    </button>
    
    {apiStatus?.isDemo && (
      <p className="text-xs text-slate-500 mt-2">
        演示結果將添加到您的美麗記憶展示中
      </p>
    )}
  </div>
);

/**
 * 已保存區域
 */
const SavedToMemorySection = ({ apiStatus }) => (
  <div className="text-center py-8">
    <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-4">
      <FiDatabase className="w-10 h-10 text-white" />
    </div>
    <h3 className="text-xl font-bold text-slate-800 mb-2">已保存至記憶庫！</h3>
    <p className="text-slate-600 mb-4">
      您的{apiStatus?.isDemo ? '演示' : '真實'}美麗記憶已成功記錄
    </p>
    <div className="p-3 bg-green-50 rounded-lg border border-green-200">
      <p className="text-sm text-green-700">
        🎉 恭喜！您的肌膚分析數據已加入美麗記憶庫，可隨時查看歷史趨勢變化
        {apiStatus?.isDemo && (
          <span className="block mt-1 text-xs">
            演示模式數據同樣支持完整的記憶管理功能
          </span>
        )}
      </p>
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
    <div className="fixed top-4 right-4 z-50">
      <div className={`${config.color} text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 max-w-sm animate-slide-in`}>
        <span className="text-lg">{config.icon}</span>
        <p className="flex-1 text-sm">{message}</p>
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

export default BeautyMemoryWebsite;