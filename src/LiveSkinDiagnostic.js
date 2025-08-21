import React, { useState, useEffect, useRef, useCallback } from 'react';
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

// 導入常量和服務
import { FENG_SHUI_CONFIG, APP_CONFIG, SKIN_ANALYSIS_FEATURES } from './data/constants';
import perfectCorpAPI from './services/perfectCorpAPI';

/**
 * 即時肌膚診斷組件 - 整合 YMK JS Camera Module
 * 提供專業級即時肌膚分析和診斷功能
 */
const LiveSkinDiagnostic = () => {
  // 基本狀態管理
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [liveMetricsData, setLiveMetricsData] = useState([]);
  
  // YMK Camera Module 狀態
  const [ymkInitialized, setYmkInitialized] = useState(false);
  const [cameraOpened, setCameraOpened] = useState(false);
  const [faceQuality, setFaceQuality] = useState(null);
  const [ymkLoading, setYmkLoading] = useState(false);
  const [captureInProgress, setCaptureInProgress] = useState(false);
  
  // API 狀態
  const [apiStatus, setApiStatus] = useState({
    isDemo: false,
    available: false,
    checking: true,
    message: '正在檢查 API 連接狀態...'
  });

  // 風水時機狀態
  const [fengShuiTiming, setFengShuiTiming] = useState(getCurrentFengShuiTiming());
  
  // Refs
  const analysisIntervalRef = useRef(null);
  const ymkContainerRef = useRef(null);

  // 獲取當前風水時機
  function getCurrentFengShuiTiming() {
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
  }

  // 修正 ESLint 錯誤：定義 updateLiveMetricsData 函數
  const updateLiveMetricsData = useCallback((newData) => {
    setLiveMetricsData(prevData => {
      const updatedData = [...prevData, newData];
      // 只保留最近 20 個數據點
      return updatedData.slice(-20);
    });
  }, []);

  // YMK SDK 初始化
  useEffect(() => {
    const initializeYMK = () => {
      // 檢查 YMK SDK 是否已載入
      if (typeof window.YMK === 'undefined') {
        console.error('YMK SDK not loaded. Please include the SDK script in your HTML.');
        return;
      }

      try {
        // 設置 YMK 異步初始化
        window.ymkAsyncInit = function() {
          console.log('🎥 [YMK] Starting YMK initialization');
          
          // 初始化 YMK Camera Module
          window.YMK.init({
            width: 640,
            height: 480,
            moduleMode: "ui", // 使用 headless 模式以便自定義 UI
            snapshotType: "base64",
            language: "enu"
          });

          setYmkInitialized(true);
          console.log('✅ [YMK] YMK Camera Module initialized successfully');
        };

        // 註冊 YMK 事件監聽器
        registerYMKEventListeners();

        // 如果 YMK 已經可用，直接初始化
        if (window.YMK && window.YMK.init) {
          window.ymkAsyncInit();
        }

      } catch (error) {
        console.error('❌ [YMK] Failed to initialize YMK SDK:', error);
      }
    };

    // 載入 YMK SDK
    loadYMKSDK().then(() => {
      initializeYMK();
    });

    return () => {
      // 清理 YMK 資源
      if (window.YMK && ymkInitialized) {
        try {
          window.YMK.close();
        } catch (error) {
          console.error('Error closing YMK:', error);
        }
      }
    };
  }, []);

  // 載入 YMK SDK
  const loadYMKSDK = async () => {
    return new Promise((resolve, reject) => {
      // 檢查是否已經載入
      if (window.YMK) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://plugins-media.makeupar.com/v1.0-skincare-camera-kit/sdk.js';
      script.async = true;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  };

  // 註冊 YMK 事件監聽器
  const registerYMKEventListeners = () => {
    if (!window.YMK) return;

    // 監聽載入進度
    window.YMK.addEventListener('loading', (progress) => {
      console.log(`🔄 [YMK] Loading progress: ${progress}%`);
      setYmkLoading(progress < 100);
    });

    // 監聽模組開啟
    window.YMK.addEventListener('opened', () => {
      console.log('📹 [YMK] Camera module opened');
      setCameraOpened(true);
    });

    // 監聽模組載入完成
    window.YMK.addEventListener('loaded', () => {
      console.log('✅ [YMK] Camera module loaded');
      setYmkLoading(false);
    });

    // 監聽攝像頭開啟
    window.YMK.addEventListener('cameraOpened', () => {
      console.log('📷 [YMK] Camera opened successfully');
    });

    // 監聽攝像頭失敗
    window.YMK.addEventListener('cameraFailed', () => {
      console.error('❌ [YMK] Camera access failed');
      alert('無法訪問攝像頭，請檢查權限設置');
    });

    // 監聽面部品質變化
    window.YMK.addEventListener('faceQualityChanged', (quality) => {
      setFaceQuality(quality);
      
      // 更新即時數據
      if (quality.hasFace && isAnalyzing) {
        updateLiveMetricsData({
          timestamp: Date.now(),
          hasFace: quality.hasFace,
          area: quality.area,
          lighting: quality.lighting,
          frontal: quality.frontal,
          quality: calculateOverallQuality(quality)
        });
      }
    });

    // 監聽分析開始
    window.YMK.addEventListener('skinAnalysisDetectionStarted', () => {
      console.log('🔍 [YMK] Skin analysis detection started');
      setIsAnalyzing(true);
    });

    // 監聽拍照完成
    window.YMK.addEventListener('skinAnalysisDetectionCaptured', async (imageData) => {
      console.log('📸 [YMK] Image captured for analysis');
      setCaptureInProgress(true);
      
      try {
        // 處理拍照結果
        await handleCapturedImage(imageData);
      } catch (error) {
        console.error('Error processing captured image:', error);
        alert('圖片處理失敗，請重試');
      } finally {
        setCaptureInProgress(false);
      }
    });

    // 監聽模組關閉
    window.YMK.addEventListener('closed', () => {
      console.log('🔒 [YMK] Camera module closed');
      setCameraOpened(false);
      setIsAnalyzing(false);
    });
  };

  // 計算整體面部品質分數
  const calculateOverallQuality = (quality) => {
    let score = 0;
    let total = 0;

    if (quality.hasFace) {
      score += 25;
    }
    total += 25;

    if (quality.area === 'good') {
      score += 25;
    } else if (quality.area === 'ok') {
      score += 15;
    }
    total += 25;

    if (quality.lighting === 'good') {
      score += 25;
    } else if (quality.lighting === 'ok') {
      score += 15;
    }
    total += 25;

    if (quality.frontal === 'good') {
      score += 25;
    }
    total += 25;

    return Math.round((score / total) * 100);
  };

  // 處理拍照圖片
  const handleCapturedImage = async (imageData) => {
    try {
      setUploadedImage(imageData);
      
      // 如果有真實 API，使用真實分析
      if (apiStatus.available && !apiStatus.isDemo) {
        // 將 base64 轉換為 blob
        const base64Data = imageData.replace(/^data:image\/[a-z]+;base64,/, '');
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'image/jpeg' });

        // 使用 Perfect Corp API 進行分析
        const result = await perfectCorpAPI.analyzeSkin(blob);
        setAnalysisResult(result);
      } else {
        // 使用模擬分析
        const result = await simulateAnalysis();
        setAnalysisResult(result);
      }
    } catch (error) {
      console.error('Analysis failed:', error);
      throw error;
    }
  };

  // 初始化 API 狀態檢查
  useEffect(() => {
    const checkAPIStatus = async () => {
      try {
        setApiStatus(prev => ({ ...prev, checking: true }));
        
        // 檢查 Perfect Corp API 可用性
        await perfectCorpAPI.initialize();
        const accessToken = await perfectCorpAPI.getAccessToken();
        
        if (accessToken && !perfectCorpAPI.useMockAPI) {
          setApiStatus({
            isDemo: false,
            available: true,
            checking: false,
            message: 'Perfect Corp API 連接正常'
          });
        } else {
          setApiStatus({
            isDemo: true,
            available: false,
            checking: false,
            message: 'API 連接失敗，使用演示模式'
          });
        }
      } catch (error) {
        console.error('API status check failed:', error);
        setApiStatus({
          isDemo: true,
          available: false,
          checking: false,
          message: 'API 檢查失敗，使用演示模式'
        });
      }
    };

    checkAPIStatus();
  }, []);

  // 定期更新風水時機
  useEffect(() => {
    const interval = setInterval(() => {
      setFengShuiTiming(getCurrentFengShuiTiming());
    }, 60000); // 每分鐘更新一次

    return () => clearInterval(interval);
  }, []);

  // 開啟 YMK 攝像頭
  const openYMKCamera = async () => {
    if (!ymkInitialized || !window.YMK) {
      alert('YMK Camera Module 尚未初始化完成');
      return;
    }

    try {
      setYmkLoading(true);
      await window.YMK.openSkincareCamera();
      console.log('📹 [YMK] Camera opened successfully');
    } catch (error) {
      console.error('❌ [YMK] Failed to open camera:', error);
      alert('無法開啟攝像頭，請檢查權限設置');
      setYmkLoading(false);
    }
  };

  // 關閉 YMK 攝像頭
  const closeYMKCamera = () => {
    if (window.YMK) {
      try {
        window.YMK.close();
        setCameraOpened(false);
        setIsAnalyzing(false);
        setFaceQuality(null);
      } catch (error) {
        console.error('Error closing YMK camera:', error);
      }
    }
  };

  // 開始即時分析
  const startLiveAnalysis = () => {
    if (!cameraOpened) {
      alert('請先開啟攝像頭');
      return;
    }
    
    setIsAnalyzing(true);
    setLiveMetricsData([]);
  };

  // 停止即時分析
  const stopLiveAnalysis = () => {
    setIsAnalyzing(false);
  };

  // YMK 拍照分析
  const captureWithYMK = () => {
    if (!cameraOpened || !window.YMK) {
      alert('攝像頭未準備就緒');
      return;
    }

    // 檢查面部品質
    if (faceQuality && (!faceQuality.hasFace || faceQuality.area !== 'good' || faceQuality.lighting === 'notgood')) {
      alert('請調整面部位置和光線條件以獲得最佳分析效果');
      return;
    }

    try {
      setCaptureInProgress(true);
      window.YMK.capture();
    } catch (error) {
      console.error('Capture failed:', error);
      alert('拍照失敗，請重試');
      setCaptureInProgress(false);
    }
  };

  // 模擬分析結果
  const simulateAnalysis = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          overall_score: Math.floor(Math.random() * 20) + 75,
          skin_age: Math.floor(Math.random() * 10) + 25,
          concerns: [
            {
              name: "水分",
              score: Math.floor(Math.random() * 30) + 70,
              category: "hydration"
            },
            {
              name: "膚質",
              score: Math.floor(Math.random() * 25) + 75,
              category: "texture"
            },
            {
              name: "亮澤度",
              score: Math.floor(Math.random() * 20) + 80,
              category: "radiance"
            }
          ],
          recommendations: [
            "建議加強保濕護理",
            "定期使用溫和去角質產品",
            "加強防曬保護"
          ]
        });
      }, 2000);
    });
  };

  // 檢查面部品質是否良好
  const isGoodQuality = (quality) => {
    if (!quality) return false;
    return quality.hasFace && 
           quality.area === 'good' && 
           quality.frontal === 'good' && 
           (quality.lighting === 'good' || quality.lighting === 'ok');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* 風水時機橫幅 */}
      <div 
        className="py-2 px-4 text-center text-sm border-b"
        style={{ 
          backgroundColor: fengShuiTiming.color + '20', 
          color: fengShuiTiming.color,
          borderColor: fengShuiTiming.color + '30'
        }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-center gap-2">
          <FiStar className="w-4 h-4" />
          <span className="font-medium">
            🔮 九紫離火運 2025：{fengShuiTiming.recommendation}
          </span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* 標題區域 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">
            AI 即時肌膚診斷系統
          </h1>
          <p className="text-slate-600 text-lg">
            Perfect Corp YMK Camera Module • 專業面部偵測 • 即時品質監控
          </p>
        </div>

        {/* 主要內容區域 */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* 左側：YMK 攝像頭區域 */}
          <div className="space-y-6">
            {/* YMK 攝像頭控制面板 */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FiCamera className="w-5 h-5 text-purple-600" />
                YMK 專業攝像頭
                {ymkLoading && (
                  <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin ml-2" />
                )}
              </h2>
              
              {/* YMK 容器 */}
              <div 
                ref={ymkContainerRef}
                className="relative mb-4 bg-slate-100 rounded-lg overflow-hidden"
                style={{ height: '400px' }}
              >
                {!cameraOpened && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <FiCamera className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                      <p className="text-slate-500 mb-2">
                        {ymkInitialized ? 'YMK 已就緒，點擊開啟攝像頭' : '正在初始化 YMK...'}
                      </p>
                      {!ymkInitialized && (
                        <div className="w-6 h-6 border-2 border-slate-400 border-t-transparent rounded-full animate-spin mx-auto" />
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* 面部品質指示器 */}
              {faceQuality && cameraOpened && (
                <div className="mb-4 p-3 bg-slate-50 rounded-lg">
                  <h4 className="text-sm font-semibold mb-2">面部偵測品質</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex justify-between">
                      <span>面部偵測:</span>
                      <span className={faceQuality.hasFace ? 'text-green-600' : 'text-red-600'}>
                        {faceQuality.hasFace ? '✓ 已偵測' : '✗ 未偵測'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>位置距離:</span>
                      <span className={faceQuality.area === 'good' ? 'text-green-600' : 'text-amber-600'}>
                        {faceQuality.area === 'good' ? '✓ 良好' : '⚠ 需調整'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>光線條件:</span>
                      <span className={
                        faceQuality.lighting === 'good' ? 'text-green-600' : 
                        faceQuality.lighting === 'ok' ? 'text-amber-600' : 'text-red-600'
                      }>
                        {faceQuality.lighting === 'good' ? '✓ 良好' : 
                         faceQuality.lighting === 'ok' ? '○ 可接受' : '✗ 不佳'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>面部角度:</span>
                      <span className={faceQuality.frontal === 'good' ? 'text-green-600' : 'text-amber-600'}>
                        {faceQuality.frontal === 'good' ? '✓ 正面' : '⚠ 需調整'}
                      </span>
                    </div>
                  </div>
                  
                  {/* 整體品質分數 */}
                  <div className="mt-2 text-center">
                    <span className="text-sm font-medium">
                      整體品質: {calculateOverallQuality(faceQuality)}%
                    </span>
                  </div>
                </div>
              )}

              {/* 控制按鈕 */}
              <div className="grid grid-cols-2 gap-3">
                {!cameraOpened ? (
                  <button
                    onClick={openYMKCamera}
                    disabled={!ymkInitialized || ymkLoading}
                    className="col-span-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-3 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FiCamera className="w-5 h-5" />
                    {ymkLoading ? '初始化中...' : '開啟 YMK 攝像頭'}
                  </button>
                ) : (
                  <>
                    <button
                      onClick={captureWithYMK}
                      disabled={captureInProgress || !isGoodQuality(faceQuality)}
                      className="bg-blue-500 text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FiCamera className="w-5 h-5" />
                      {captureInProgress ? '拍照中...' : 'YMK 拍照分析'}
                    </button>
                    
                    {!isAnalyzing ? (
                      <button
                        onClick={startLiveAnalysis}
                        className="bg-green-500 text-white px-4 py-3 rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                      >
                        <BiScan className="w-5 h-5" />
                        開始監控
                      </button>
                    ) : (
                      <button
                        onClick={stopLiveAnalysis}
                        className="bg-red-500 text-white px-4 py-3 rounded-lg font-medium hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                      >
                        <AiOutlineClose className="w-5 h-5" />
                        停止監控
                      </button>
                    )}
                  </>
                )}
              </div>

              {cameraOpened && (
                <button
                  onClick={closeYMKCamera}
                  className="w-full mt-3 bg-slate-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-slate-600 transition-colors flex items-center justify-center gap-2"
                >
                  <AiOutlineClose className="w-4 h-4" />
                  關閉攝像頭
                </button>
              )}

              {/* 品質提示 */}
              {cameraOpened && faceQuality && !isGoodQuality(faceQuality) && (
                <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AiOutlineWarning className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-amber-700">
                      <p className="font-medium mb-1">請調整以獲得最佳分析效果：</p>
                      <ul className="text-xs space-y-1">
                        {!faceQuality.hasFace && <li>• 請將面部置於畫面中心</li>}
                        {faceQuality.area !== 'good' && <li>• 調整與攝像頭的距離</li>}
                        {faceQuality.lighting === 'notgood' && <li>• 增加光線或調整角度</li>}
                        {faceQuality.frontal !== 'good' && <li>• 請正視攝像頭</li>}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 即時數據顯示 */}
            {liveMetricsData.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <BiBarChart className="w-5 h-5 text-blue-600" />
                  即時面部品質數據
                </h3>
                <div className="space-y-3">
                  {liveMetricsData.slice(-3).map((data, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                      <span className="text-sm text-slate-600">
                        {new Date(data.timestamp).toLocaleTimeString()}
                      </span>
                      <div className="flex gap-4 text-sm">
                        <span className={data.hasFace ? 'text-green-600' : 'text-red-600'}>
                          面部: {data.hasFace ? '✓' : '✗'}
                        </span>
                        <span className={data.area === 'good' ? 'text-green-600' : 'text-amber-600'}>
                          位置: {data.area}
                        </span>
                        <span className={
                          data.lighting === 'good' ? 'text-green-600' : 
                          data.lighting === 'ok' ? 'text-amber-600' : 'text-red-600'
                        }>
                          光線: {data.lighting}
                        </span>
                        <span className="text-blue-600">
                          品質: {data.quality}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 右側：分析結果區域 */}
          <div className="space-y-6">
            {/* API 狀態顯示 */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <BiShield className="w-5 h-5 text-green-600" />
                系統狀態
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">YMK Camera Module</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    ymkInitialized 
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {ymkInitialized ? '已初始化' : '初始化中...'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">攝像頭狀態</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    cameraOpened 
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {cameraOpened ? '已開啟' : '未開啟'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">API 狀態</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    apiStatus.checking 
                      ? 'bg-yellow-100 text-yellow-700'
                      : apiStatus.available
                        ? 'bg-green-100 text-green-700'
                        : 'bg-blue-100 text-blue-700'
                  }`}>
                    {apiStatus.message}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">分析模式</span>
                  <span className="text-slate-800 font-medium">
                    {apiStatus.isDemo ? '演示模式' : '專業模式'}
                  </span>
                </div>
              </div>
            </div>

            {/* 面部品質儀表板 */}
            {faceQuality && cameraOpened && (
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FiEye className="w-5 h-5 text-purple-600" />
                  即時面部品質監控
                </h3>
                
                {/* 品質環形圖表示 */}
                <div className="text-center mb-4">
                  <div className="relative inline-flex items-center justify-center w-24 h-24 mb-2">
                    <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-slate-200"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={`${2.51 * calculateOverallQuality(faceQuality)} 251`}
                        className={
                          calculateOverallQuality(faceQuality) >= 80 ? 'text-green-500' :
                          calculateOverallQuality(faceQuality) >= 60 ? 'text-amber-500' : 'text-red-500'
                        }
                      />
                    </svg>
                    <div className="absolute text-center">
                      <div className="text-2xl font-bold text-slate-700">
                        {calculateOverallQuality(faceQuality)}
                      </div>
                      <div className="text-xs text-slate-500">品質</div>
                    </div>
                  </div>
                  
                  <div className={`text-sm font-medium ${
                    calculateOverallQuality(faceQuality) >= 80 ? 'text-green-600' :
                    calculateOverallQuality(faceQuality) >= 60 ? 'text-amber-600' : 'text-red-600'
                  }`}>
                    {calculateOverallQuality(faceQuality) >= 80 ? '優秀 - 可進行分析' :
                     calculateOverallQuality(faceQuality) >= 60 ? '良好 - 建議調整' : '需要改善'}
                  </div>
                </div>

                {/* 詳細品質指標 */}
                <div className="space-y-2">
                  {[
                    { key: 'hasFace', label: '面部偵測', value: faceQuality.hasFace },
                    { key: 'area', label: '位置距離', value: faceQuality.area === 'good' },
                    { key: 'lighting', label: '光線條件', value: faceQuality.lighting !== 'notgood' },
                    { key: 'frontal', label: '面部角度', value: faceQuality.frontal === 'good' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                      <span className="text-sm text-slate-600">{item.label}</span>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${
                          item.value ? 'bg-green-500' : 'bg-red-500'
                        }`} />
                        <span className={`text-sm font-medium ${
                          item.value ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {item.value ? '良好' : '需改善'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 分析結果顯示 */}
            {analysisResult && (
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <BiBrain className="w-5 h-5 text-purple-600" />
                  AI 分析結果
                </h3>
                
                {/* 總體評分 */}
                <div className="mb-6 text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {analysisResult.overall_score}
                  </div>
                  <div className="text-slate-600">總體肌膚評分</div>
                  {analysisResult.skin_age && (
                    <div className="text-sm text-slate-500 mt-1">
                      肌膚年齡: {analysisResult.skin_age} 歲
                    </div>
                  )}
                </div>

                {/* 具體指標 */}
                <div className="space-y-3 mb-6">
                  {analysisResult.concerns?.map((concern, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                      <span className="font-medium">{concern.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-semibold">{concern.score}</span>
                        <div className={`w-2 h-2 rounded-full ${
                          concern.score >= 80 ? 'bg-green-500' :
                          concern.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* 建議 */}
                {analysisResult.recommendations && (
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <AiOutlineHeart className="w-4 h-4 text-pink-500" />
                      護膚建議
                    </h4>
                    <div className="space-y-2">
                      {analysisResult.recommendations.map((recommendation, index) => (
                        <div key={index} className="flex items-start gap-2 text-sm text-slate-600">
                          <AiOutlineCheck className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{recommendation}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 風水建議 */}
                <div className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                  <h4 className="font-semibold mb-2 flex items-center gap-2 text-purple-700">
                    <RiMagicFill className="w-4 h-4" />
                    九紫離火運護膚建議
                  </h4>
                  <p className="text-sm text-purple-600">
                    {fengShuiTiming.recommendation}
                  </p>
                </div>
              </div>
            )}

            {/* YMK 技術特色 */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <BiData className="w-5 h-5 text-blue-600" />
                YMK 技術特色
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { icon: <FiEye className="w-4 h-4" />, name: "智能面部偵測", desc: "自動識別最佳拍攝角度" },
                  { icon: <BiScan className="w-4 h-4" />, name: "即時品質監控", desc: "實時評估圖像品質" },
                  { icon: <FiZap className="w-4 h-4" />, name: "快速響應", desc: "毫秒級品質反饋" },
                  { icon: <BiShield className="w-4 h-4" />, name: "專業級精度", desc: "Perfect Corp 醫師級標準" },
                  { icon: <FiCamera className="w-4 h-4" />, name: "最佳化拍攝", desc: "自動最佳時機捕捉" },
                  { icon: <BiBarChart className="w-4 h-4" />, name: "數據可視化", desc: "直觀的品質指標顯示" }
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <span className="text-blue-600">{feature.icon}</span>
                    <div>
                      <div className="text-sm font-medium">{feature.name}</div>
                      <div className="text-xs text-slate-500">{feature.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 使用說明 */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <AiOutlineHistory className="w-5 h-5 text-green-600" />
                使用說明
              </h3>
              <div className="space-y-3 text-sm text-slate-600">
                <div className="flex items-start gap-2">
                  <span className="bg-purple-100 text-purple-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">1</span>
                  <span>點擊「開啟 YMK 攝像頭」啟動專業攝像頭模組</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="bg-purple-100 text-purple-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">2</span>
                  <span>調整面部位置直到所有品質指標顯示為綠色</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="bg-purple-100 text-purple-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">3</span>
                  <span>點擊「YMK 拍照分析」進行專業肌膚分析</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="bg-purple-100 text-purple-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">4</span>
                  <span>查看詳細分析結果和個性化護膚建議</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* HTML 底部說明 */}
        <div className="mt-8 text-center text-sm text-slate-500">
          <p>
            本系統整合 Perfect Corp YMK JS Camera Module，提供專業級面部偵測和品質監控功能
          </p>
          <p className="mt-1">
            請確保您的瀏覽器支援攝像頭權限，並在 HTTPS 環境下使用以獲得最佳體驗
          </p>
        </div>
      </div>

      {/* 需要在 HTML 頭部添加的 YMK SDK */}
      {!window.YMK && (
        <div className="fixed top-4 right-4 bg-amber-100 border border-amber-200 rounded-lg p-3 max-w-sm">
          <div className="flex items-start gap-2">
            <AiOutlineWarning className="w-5 h-5 text-amber-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-800">需要 YMK SDK</p>
              <p className="text-xs text-amber-700 mt-1">
                請在 HTML 頭部添加 YMK SDK 腳本以啟用完整功能
              </p>
              <code className="text-xs bg-amber-200 px-2 py-1 rounded mt-2 block">
                &lt;script src="https://plugins-media.makeupar.com/v1.0-skincare-camera-kit/sdk.js"&gt;&lt;/script&gt;
              </code>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveSkinDiagnostic;