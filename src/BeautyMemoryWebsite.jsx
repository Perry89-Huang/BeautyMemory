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

// 修改 SkinAnalysis 組件以支援返回功能和模態框使用
const SkinAnalysis = ({ onBack, isModal = false }) => {
  // 攝像頭狀態
  const [cameraOpened, setCameraOpened] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(false);
  const [captureInProgress, setCaptureInProgress] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  
  // 分析狀態
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // 模擬面部品質
  const [mockFaceQuality, setMockFaceQuality] = useState(null);
  
  // API 狀態
  const [apiStatus, setApiStatus] = useState({
    available: true,
    message: '原生攝像頭 + AI 分析模式'
  });

  // Refs
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  // 獲取當前九運時機
  const getCurrentFengShuiTiming = () => {
    const hour = new Date().getHours();
    const fireHours = [11, 12, 13];
    const isFireTime = fireHours.includes(hour);
    
    return {
      isAuspicious: isFireTime,
      color: isFireTime ? '#dc2626' : '#7c3aed',
      recommendation: isFireTime 
        ? '🔥 九紫離火運巔峰時刻，肌膚活力檢測最準確' 
        : '🔮 九紫離火運加持，美麗能量正在聚集'
    };
  };

  const [fengShuiTiming] = useState(getCurrentFengShuiTiming());

  // Perfect Corp 面部品質檢測
  useEffect(() => {
    if (!cameraOpened) return;

    const qualityInterval = setInterval(() => {
      const perfectCorpQuality = {
        hasFace: Math.random() > 0.2,
        area: Math.random() > 0.3 ? 'good' : 'needs_adjustment',
        lighting: Math.random() > 0.25 ? 'good' : Math.random() > 0.6 ? 'ok' : 'poor',
        frontal: Math.random() > 0.3 ? 'good' : 'needs_adjustment',
        eye_detection: Math.random() > 0.4 ? 'detected' : 'not_detected',
        mouth_detection: Math.random() > 0.4 ? 'detected' : 'not_detected',
        skin_visibility: Math.random() > 0.3 ? 'sufficient' : 'insufficient',
        image_sharpness: Math.random() > 0.4 ? 'sharp' : 'blurred',
        perfectcorp_score: Math.floor(Math.random() * 30) + 70
      };
      setMockFaceQuality(perfectCorpQuality);
    }, 1000);

    return () => clearInterval(qualityInterval);
  }, [cameraOpened]);

  // 組件卸載時清理攝像頭
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraStream]);

  // 模擬 Perfect Corp API 分析
  const perfectCorpAnalyzeImage = async (imageBase64) => {
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    return {
      overall_score: Math.floor(Math.random() * 20) + 75,
      skin_age: Math.floor(Math.random() * 10) + 25,
      concerns: [
        {
          name: "皺紋",
          score: Math.floor(Math.random() * 30) + 70,
          status: "良好",
          improvement: `+${Math.floor(Math.random() * 10) + 1}%`,
          category: "aging"
        },
        {
          name: "毛孔",
          score: Math.floor(Math.random() * 30) + 65,
          status: "良好",
          improvement: `+${Math.floor(Math.random() * 8) + 1}%`,
          category: "texture"
        },
        {
          name: "色斑",
          score: Math.floor(Math.random() * 25) + 75,
          status: "優秀",
          improvement: `+${Math.floor(Math.random() * 12) + 1}%`,
          category: "pigmentation"
        },
        {
          name: "水分",
          score: Math.floor(Math.random() * 20) + 70,
          status: "良好",
          improvement: `+${Math.floor(Math.random() * 15) + 1}%`,
          category: "hydration"
        }
      ],
      recommendations: [
        "建議使用含維生素C的美白精華",
        "加強保濕，每日使用補水面膜",
        "注意防曬，使用SPF30以上產品",
        "配合九紫離火運，在午時進行護膚"
      ],
      timestamp: new Date().toISOString(),
      fengShuiAdvice: fengShuiTiming.recommendation
    };
  };

  // 開啟原生攝像頭
  const openNativeCamera = async () => {
    setCameraLoading(true);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640, min: 480 },
          height: { ideal: 480, min: 360 },
          facingMode: 'user'
        },
        audio: false
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraStream(stream);
        setCameraOpened(true);
        
        // 添加面部識別框
        setTimeout(() => {
          addFaceDetectionOverlay();
        }, 500);
      }

    } catch (error) {
      console.error('Camera access failed:', error);
      alert('攝像頭啟動失敗，請確認瀏覽器權限設定');
    } finally {
      setCameraLoading(false);
    }
  };

  // 添加面部識別框
  const addFaceDetectionOverlay = () => {
    if (!containerRef.current) return;

    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      pointer-events: none;
      z-index: 10;
    `;

    const faceFrame = document.createElement('div');
    faceFrame.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 200px;
      height: 250px;
      border: 2px solid #10b981;
      border-radius: 50%;
      box-shadow: 0 0 20px rgba(16, 185, 129, 0.3);
      animation: pulse 2s infinite;
    `;

    if (!document.querySelector('#face-frame-style')) {
      const style = document.createElement('style');
      style.id = 'face-frame-style';
      style.textContent = `
        @keyframes pulse {
          0% { box-shadow: 0 0 20px rgba(16, 185, 129, 0.3); }
          50% { box-shadow: 0 0 30px rgba(16, 185, 129, 0.6); }
          100% { box-shadow: 0 0 20px rgba(16, 185, 129, 0.3); }
        }
      `;
      document.head.appendChild(style);
    }

    overlay.appendChild(faceFrame);
    containerRef.current.appendChild(overlay);
  };

  // 關閉攝像頭
  const closeCamera = () => {
    try {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        setCameraStream(null);
      }
      
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      
      setCameraOpened(false);
      setMockFaceQuality(null);
      setIsAnalyzing(false);
      setCaptureInProgress(false);
      setCameraLoading(false);
      
    } catch (error) {
      console.error('Error closing camera:', error);
    }
  };

  // 拍照分析
  const captureAndAnalyze = async () => {
    if (!videoRef.current || !canvasRef.current) {
      alert('攝像頭未準備就緒');
      return;
    }

    try {
      setCaptureInProgress(true);
      
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const ctx = canvas.getContext('2d');
      
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageBase64 = canvas.toDataURL('image/jpeg', 0.8);
      
      // 閃光效果
      addFlashEffect();
      
      setCaptureInProgress(false);
      setIsAnalyzing(true);
      
      const analysisData = await perfectCorpAnalyzeImage(imageBase64);
      setAnalysisResult(analysisData);
      setIsAnalyzing(false);
      
    } catch (error) {
      console.error('Capture failed:', error);
      setCaptureInProgress(false);
      alert('拍照失敗，請重試');
    }
  };

  // 閃光效果
  const addFlashEffect = () => {
    if (!containerRef.current) return;

    const flash = document.createElement('div');
    flash.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: white;
      opacity: 0.8;
      z-index: 20;
      pointer-events: none;
    `;

    containerRef.current.appendChild(flash);
    setTimeout(() => flash.remove(), 150);
  };

  // 檢查面部品質
  const isGoodQuality = (quality) => {
    if (!quality) return false;
    return quality.hasFace && 
           quality.area === 'good' && 
           quality.lighting !== 'poor' &&
           quality.frontal === 'good';
  };

  const containerClass = isModal 
    ? "space-y-6" 
    : "min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50";

  return (
    <div className={containerClass}>
      {!isModal && (
        <nav className="fixed top-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md shadow-lg">
          <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              {onBack && (
                <button 
                  onClick={onBack}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <AiOutlineClose className="w-6 h-6 text-slate-600" />
                </button>
              )}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <RiMagicFill className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-800">美魔力 AI 分析</h1>
                  <p className="text-xs text-purple-600">Professional Skin Analysis</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full border border-green-200">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-700">系統就緒</span>
            </div>
          </div>
        </nav>
      )}

      <div className={isModal ? "" : "pt-24 p-8"}>
        {/* 九紫離火運狀態 */}
        <div className={`text-center mb-6 p-3 rounded-lg ${
          fengShuiTiming.isAuspicious ? 
          'bg-red-100 text-red-800' : 
          'bg-purple-100 text-purple-800'
        }`}>
          <p className="text-sm font-medium">{fengShuiTiming.recommendation}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* 左側：攝像頭區域 */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FiCamera className="w-5 h-5 text-purple-600" />
                專業攝像頭分析
                {(cameraLoading || captureInProgress) && (
                  <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin ml-2" />
                )}
              </h2>
              
              {/* 攝像頭容器 */}
              <div 
                ref={containerRef}
                className="relative mb-4 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg overflow-hidden"
                style={{ height: '400px' }}
              >
                {!cameraOpened ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <FiCamera className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-600 mb-3 font-medium">
                        點擊開啟專業攝像頭
                      </p>
                      <p className="text-sm text-slate-500 mb-4">
                        Perfect Corp 技術 • 九運加持
                      </p>
                      
                      {cameraLoading && (
                        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mt-2" />
                      )}
                    </div>
                  </div>
                ) : (
                  <>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover rounded-lg"
                      style={{ transform: 'scaleX(-1)' }}
                    />
                    <canvas ref={canvasRef} className="hidden" />

                    {/* 面部品質指示器 */}
                    {mockFaceQuality && (
                      <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-2 rounded-lg">
                        <div className="text-xs space-y-1">
                          <div className="flex justify-between gap-4">
                            <span>面部檢測:</span>
                            <span className={mockFaceQuality.hasFace ? 'text-green-400' : 'text-red-400'}>
                              {mockFaceQuality.hasFace ? '✓' : '✗'}
                            </span>
                          </div>
                          <div className="flex justify-between gap-4">
                            <span>品質評分:</span>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              mockFaceQuality.perfectcorp_score >= 85 ? 'bg-green-100 text-green-700' :
                              mockFaceQuality.perfectcorp_score >= 70 ? 'bg-amber-100 text-amber-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {mockFaceQuality.perfectcorp_score}%
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* 控制按鈕 */}
              <div className="grid grid-cols-2 gap-3">
                {!cameraOpened ? (
                  <button
                    onClick={openNativeCamera}
                    disabled={cameraLoading}
                    className="col-span-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <FiPlay className="w-5 h-5" />
                    {cameraLoading ? '啟動攝像頭...' : '開啟專業攝像頭'}
                  </button>
                ) : (
                  <>
                    <button
                      onClick={captureAndAnalyze}
                      disabled={captureInProgress || isAnalyzing || !isGoodQuality(mockFaceQuality)}
                      className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 py-3 rounded-lg font-medium hover:from-green-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <FiZap className="w-4 h-4" />
                      {captureInProgress ? '拍照中...' : isAnalyzing ? '分析中...' : 'AI 拍照分析'}
                    </button>
                    <button
                      onClick={closeCamera}
                      className="bg-slate-500 text-white px-4 py-3 rounded-lg font-medium hover:bg-slate-600 transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <FiPause className="w-4 h-4" />
                      關閉攝像頭
                    </button>
                  </>
                )}
              </div>

              {/* 分析進度 */}
              {isAnalyzing && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    <span className="text-blue-800 font-medium">
                      Perfect Corp AI 智能分析中...
                    </span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{width: '70%'}}></div>
                  </div>
                  <p className="text-blue-700 text-sm mt-2">九紫離火運加持，正在深度分析您的肌膚狀態...</p>
                </div>
              )}
            </div>
          </div>

          {/* 右側：分析結果 */}
          <div className="space-y-6">
            {analysisResult ? (
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-green-700">
                  <FiStar className="w-5 h-5" />
                  分析結果完成
                </h3>

                {/* 總體評分 */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 text-center mb-6 border border-purple-200">
                  <h4 className="text-lg font-semibold text-slate-800 mb-2">整體肌膚評分</h4>
                  <div className="text-4xl font-bold text-purple-600 mb-2">{analysisResult.overall_score}</div>
                  <div className="text-sm text-slate-600">肌膚年齡: {analysisResult.skin_age} 歲</div>
                </div>

                {/* 詳細分析 */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {analysisResult.concerns.map((concern, index) => (
                    <div key={index} className="bg-slate-50 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <h5 className="font-semibold text-slate-800">{concern.name}</h5>
                        <span className="text-xs text-green-600 font-medium">{concern.status}</span>
                      </div>
                      
                      <div className="mb-3">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-slate-600">評分</span>
                          <span className="font-semibold text-slate-800">{concern.score}</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-1000"
                            style={{ width: `${concern.score}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-500">改善幅度</span>
                        <span className="text-xs font-medium text-green-600">{concern.improvement}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* AI 建議 */}
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                  <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                    <span>🤖</span>
                    AI 個人化建議
                  </h4>
                  <ul className="space-y-2">
                    {analysisResult.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-2 text-slate-700">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 九運建議 */}
                <div className="bg-red-50 rounded-xl p-4 border border-red-200 mt-4">
                  <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                    <span>🔥</span>
                    九紫離火運護膚建議
                  </h4>
                  <p className="text-slate-700 text-sm">{analysisResult.fengShuiAdvice}</p>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <FiEye className="w-5 h-5 text-purple-600" />
                  等待分析
                </h3>
                <div className="text-center py-8">
                  <FiCamera className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500 mb-2">請開啟攝像頭並拍照</p>
                  <p className="text-sm text-slate-400">Perfect Corp 技術將為您提供專業分析</p>
                </div>

                {/* 使用說明 */}
                <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-purple-800 mb-3">使用步驟：</h4>
                  <div className="space-y-2 text-sm text-purple-700">
                    <div className="flex items-start gap-3">
                      <span className="bg-purple-100 text-purple-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-0.5">1</span>
                      <span>點擊「開啟專業攝像頭」啟動原生攝像頭系統</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="bg-purple-100 text-purple-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-0.5">2</span>
                      <span>調整面部位置至綠色圓框內，注意 AI 品質評分</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="bg-purple-100 text-purple-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-0.5">3</span>
                      <span>點擊「AI 拍照分析」進行專業肌膚檢測</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="bg-purple-100 text-purple-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-0.5">4</span>
                      <span>查看詳細分析結果和九運加持的護膚建議</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 底部說明 */}
        {!isModal && (
          <div className="mt-8 text-center text-sm text-slate-500 space-y-2">
            <p>
              採用 Perfect Corp 專業技術，提供專業級面部檢測、品質監控和肌膚分析功能
            </p>
            <p className="text-red-600 font-medium">
              🔮 九紫離火運 2025 • 專業肌膚分析 • Memory = 美魔力
            </p>
          </div>
        )}
      </div>
    </div>
  );
}; justify-center min-h-screen">
        <div className="bg-white rounded-3xl p-8 shadow-2xl max-w-4xl w-full">
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiCamera className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-slate-800 mb-4">AI 專業肌膚分析系統</h1>
            <p className="text-slate-600 mb-2">Perfect Corp 技術驅動 • 九紫離火運能量加持</p>
            <p className="text-lg text-purple-600 font-medium">即時攝像頭分析 • 14項專業檢測</p>
          </div>

          {/* 分析功能展示 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="p-4 bg-purple-50 rounded-xl text-center">
              <BiScan className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-700">皺紋檢測</p>
            </div>
            <div className="p-4 bg-pink-50 rounded-xl text-center">
              <BiDroplet className="w-8 h-8 text-pink-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-700">水分分析</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-xl text-center">
              <BiSun className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-700">色斑檢測</p>
            </div>
            <div className="p-4 bg-green-50 rounded-xl text-center">
              <RiSparklingFill className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-700">亮澤分析</p>
            </div>
          </div>

          {/* 攝像頭區域 */}
          <div className="bg-slate-900 rounded-2xl p-8 mb-6 aspect-video flex items-center justify-center">
            <div className="text-center text-white">
              <FiCamera className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">攝像頭準備中...</p>
              <p className="text-sm opacity-75">請允許攝像頭權限以開始分析</p>
            </div>
          </div>

          {/* 控制按鈕 */}
          <div className="flex gap-4 justify-center">
            <button className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold hover:from-purple-600 hover:to-pink-600 transition-all flex items-center gap-2">
              <FiCamera className="w-5 h-5" />
              開啟攝像頭
            </button>
            <button className="px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all flex items-center gap-2">
              <FiUpload className="w-5 h-5" />
              上傳照片
            </button>
          </div>

          {/* 功能說明 */}
          <div className="mt-8 grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🔬</span>
              </div>
              <h4 className="font-semibold text-slate-800 mb-2">專業檢測</h4>
              <p className="text-sm text-slate-600">14項肌膚指標全面分析</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">⚡</span>
              </div>
              <h4 className="font-semibold text-slate-800 mb-2">即時分析</h4>
              <p className="text-sm text-slate-600">3秒內完成專業評估</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">💾</span>
              </div>
              <h4 className="font-semibold text-slate-800 mb-2">記憶儲存</h4>
              <p className="text-sm text-slate-600">自動保存到美魔力記憶庫</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

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
        "建議使用含維生素C的美白精華",
        "加強防曬保護，SPF30以上",
        "每週使用保濕面膜2-3次",
        "補充膠原蛋白營養品"
      ],
      metadata: {
        analysisId: `ana_${Date.now()}`,
        processingTime: Math.floor(Math.random() * 3000) + 1000
      }
    };
  }
};

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
    title: "選擇分析方式",
    description: "攝像頭拍攝或上傳照片",
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
      recommendation: '🔥 九紫離火運巔峰時刻，適合美白和提亮護理',
      energy: 'high',
      color: '#f43f5e'
    };
  } else if (waterHours.includes(hour)) {
    return {
      type: 'water',
      recommendation: '💧 水元素時辰，適合深層保濕和修復',
      energy: 'calm',
      color: '#3b82f6'
    };
  } else {
    return {
      type: 'neutral',
      recommendation: '⚡ 平衡時辰，適合基礎護理',
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
  const [currentView, setCurrentView] = useState('home'); // 新增視圖狀態
  const [memories, setMemories] = useState([
    {
      id: 1,
      moment: "完美妝容日 - AI 分析評分 92",
      emotion: "✨",
      date: "2025/01/15",
      product: "雅詩蘭黛小棕瓶",
      aiAnalysis: "肌膚年齡: 25歲，亮澤度提升18%，建議持續使用抗氧化精華",
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
  ]);

  // 分析相關狀態
  const [showSkinAnalysis, setShowSkinAnalysis] = useState(false);
  const [activeAnalysisStep, setActiveAnalysisStep] = useState(0);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // 通知狀態
  const [notification, setNotification] = useState({
    isVisible: false,
    message: '',
    type: 'info'
  });

  // API 狀態模擬
  const [apiStatus, setApiStatus] = useState({
    available: true,
    isDemo: true,
    message: '演示模式 - 體驗完整功能'
  });

  // 獲取風水時機
  const [fengShuiTiming] = useState(getCurrentFengShuiTiming());

  // 滾動監聽
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 通知管理
  const showNotification = useCallback((message, type = 'info') => {
    setNotification({
      isVisible: true,
      message,
      type
    });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, isVisible: false }));
    }, 4000);
  }, []);

  // 處理分析點擊 - 可選擇模態框或直接切換
  const handleAnalysisClick = () => {
    if (!apiStatus?.isDemo && !apiStatus?.available) {
      showNotification('服務暫時不可用，請稍後再試', 'error');
      return;
    }
    
    // 可以選擇直接切換到全屏模式或顯示模態框
    // setCurrentView('skinAnalysis'); // 全屏模式
    setShowSkinAnalysis(true); // 模態框模式
    showNotification('正在啟動專業 AI 肌膚分析系統...', 'success');
  };

  // 返回主頁面
  const handleBackToHome = () => {
    setCurrentView('home');
    showNotification('已返回美魔力主頁', 'info');
  };

  // 處理圖片上傳
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showNotification('請選擇有效的圖片文件', 'error');
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
    showNotification('已關閉 AI 肌膚分析系統', 'info');
  };

  // 切換到SkinAnalysis組件
  const switchToSkinAnalysis = () => {
    setCurrentView('skinAnalysis');
    showNotification('正在啟動專業攝像頭分析模式...', 'info');
  };

  // 如果當前視圖是 SkinAnalysis，顯示 SkinAnalysis 組件
  if (currentView === 'skinAnalysis') {
    return <SkinAnalysis onBack={handleBackToHome} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* 導航欄 */}
      <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrollY > 50 ? 'bg-white/90 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}>
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <RiMagicFill className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">美魔力</h1>
              <p className="text-xs text-purple-600">Beauty Memory</p>
            </div>
          </div>
          
          {/* 風水時機指示器 */}
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/80 rounded-full border border-purple-200">
            <div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: fengShuiTiming.color }}></div>
            <span className="text-sm text-slate-600">{fengShuiTiming.recommendation}</span>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={handleAnalysisClick}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-medium text-sm hover:from-purple-600 hover:to-pink-600 transition-all"
            >
              AI 分析
            </button>
          </div>
        </div>
      </nav>

      {/* 主要內容 */}
      <main>
        {/* 英雄區塊 */}
        <HeroSection 
          onAnalysisClick={handleAnalysisClick}
          fengShuiTiming={fengShuiTiming}
          apiStatus={apiStatus}
        />

        {/* 功能特色區塊 */}
        <FeaturesSection />

        {/* 分析功能展示 */}
        <AnalysisFeaturesSection onAnalysisClick={handleAnalysisClick} />

        {/* 美麗記憶展示 */}
        <MemorySection memories={memories} />
      </main>

      {/* 頁腳 */}
      <Footer />

      {/* 肌膚分析模態框 - 使用完整 SkinAnalysis 組件 */}
      <SkinAnalysisModal 
        isOpen={showSkinAnalysis}
        onClose={resetAnalysisState}
        apiStatus={apiStatus}
      />

      {/* 通知組件 */}
      <NotificationToast 
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={() => setNotification(prev => ({ ...prev, isVisible: false }))}
      />
    </div>
  );
};

/**
 * 英雄區塊
 */
const HeroSection = ({ onAnalysisClick, fengShuiTiming, apiStatus }) => (
  <section className="relative pt-24 pb-16 px-4 overflow-hidden">
    {/* 背景裝飾 */}
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute -top-10 -right-10 w-80 h-80 bg-gradient-to-br from-purple-300/20 to-pink-300/20 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-gradient-to-br from-blue-300/20 to-purple-300/20 rounded-full blur-3xl"></div>
    </div>

    <div className="relative max-w-6xl mx-auto text-center">
      {/* 2025 九紫離火運標識 */}
      <div className="mb-6">
        <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-full border border-red-200/50">
          <AiOutlineFire className="w-4 h-4 text-red-500" />
          <span className="text-sm font-medium text-red-700">
            2025 九紫離火運 • 美麗能量巔峰年
          </span>
          {apiStatus && (
            <span className={`text-xs px-2 py-1 rounded-full ${
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

      {/* CTA 按鈕組 */}
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
          {apiStatus?.isDemo ? '立即體驗 AI 肌膚分析' : apiStatus?.available ? '立即AI肌膚分析' : '服務暫時不可用'}
        </button>
      </div>

      {/* 功能特色標籤 */}
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
  </section>
);

/**
 * 功能特色區塊
 */
const FeaturesSection = () => (
  <section className="py-16 px-4 bg-white/40 backdrop-blur-sm">
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-slate-800 mb-4">
          科技與美麗的完美融合
        </h2>
        <p className="text-xl text-slate-600">
          Perfect Corp 專業技術 • 九紫離火運能量加持
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-purple-100">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <BiBrain className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-4">AI 智能分析</h3>
          <p className="text-slate-600 leading-relaxed">
            採用 Perfect Corp 專業技術，14 項專業肌膚檢測，95% 醫師級準確率，即時生成個人化美容建議
          </p>
        </div>

        <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FiDatabase className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-4">美麗記憶庫</h3>
          <p className="text-slate-600 leading-relaxed">
            Memory = 美魔力，讓 AI 記住每個美麗瞬間，追蹤肌膚變化趨勢，打造專屬美麗時光軸
          </p>
        </div>

        <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-red-100">
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <AiOutlineFire className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-4">九紫離火運</h3>
          <p className="text-slate-600 leading-relaxed">
            結合 2025 年九紫離火運能量，根據時辰提供最佳美容時機，讓科技與東方智慧完美結合
          </p>
        </div>
      </div>
    </div>
  </section>
);

/**
 * 分析功能展示區塊
 */
const AnalysisFeaturesSection = ({ onAnalysisClick }) => (
  <section className="py-16 px-4">
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-slate-800 mb-4">
          14 項專業肌膚檢測
        </h2>
        <p className="text-xl text-slate-600">
          Perfect Corp 專業技術，媲美皮膚科醫師的精準分析
        </p>
      </div>

      <div className="grid md:grid-cols-4 lg:grid-cols-7 gap-4 mb-12">
        {SKIN_ANALYSIS_FEATURES.map((feature, index) => (
          <div 
            key={index}
            className="group p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-slate-100 hover:border-purple-200"
          >
            <div className={`${feature.color} mb-3 group-hover:scale-110 transition-transform duration-300`}>
              {feature.icon}
            </div>
            <h4 className="text-sm font-semibold text-slate-800 mb-1">{feature.name}</h4>
            <div className="w-full bg-slate-200 rounded-full h-1">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-1 rounded-full" style={{ width: `${Math.floor(Math.random() * 30) + 70}%` }}></div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center">
        <button 
          onClick={onAnalysisClick}
          className="px-12 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold text-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          開始專業肌膚分析
        </button>
      </div>
    </div>
  </section>
);

/**
 * 美麗記憶區塊
 */
const MemorySection = ({ memories }) => (
  <section className="py-16 px-4 bg-gradient-to-br from-purple-50/50 to-pink-50/50">
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-slate-800 mb-4">
          美麗記憶時光軸
        </h2>
        <p className="text-xl text-slate-600">
          讓 AI 記住每個美麗瞬間，追蹤您的美麗成長軌跡
        </p>
      </div>

      <div className="space-y-6">
        {memories.map((memory, index) => (
          <MemoryCard key={memory.id} memory={memory} index={index} />
        ))}
      </div>
    </div>
  </section>
);

/**
 * 記憶卡片
 */
const MemoryCard = ({ memory, index }) => (
  <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-100">
    <div className="flex items-start gap-6">
      <div className="flex-shrink-0">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-2xl">
          {memory.emotion}
        </div>
      </div>
      
      <div className="flex-1">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-slate-800">{memory.moment}</h3>
          <span className="text-sm text-slate-500">{memory.date}</span>
        </div>
        
        <p className="text-slate-600 mb-4">{memory.aiAnalysis}</p>
        
        {memory.skinMetrics && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {Object.entries(memory.skinMetrics).map(([key, value]) => (
              <div key={key} className="text-center p-3 bg-slate-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{value}</div>
                <div className="text-xs text-slate-600">{key}</div>
              </div>
            ))}
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {memory.tags?.map((tag, i) => (
              <span key={i} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                {tag}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <BiTrendingUp className="w-4 h-4 text-green-500" />
            <span>{memory.improvement}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

/**
 * 肌膚分析模態框 - 現在使用完整的 SkinAnalysis 組件
 */
const SkinAnalysisModal = ({ 
  isOpen, 
  onClose, 
  apiStatus
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
              美魔力 AI 專業肌膚分析
              <span className={`text-xs px-3 py-1 rounded-full ${
                apiStatus?.isDemo 
                  ? 'bg-amber-100 text-amber-700 border border-amber-200'
                  : 'bg-green-100 text-green-700 border border-green-200'
              }`}>
                {apiStatus?.isDemo ? '🧪 演示模式' : '🔗 專業模式'}
              </span>
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Perfect Corp 技術驅動 • 九紫離火運能量加持
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <AiOutlineClose className="w-6 h-6 text-slate-600" />
          </button>
        </div>

        {/* 使用完整的 SkinAnalysis 組件 */}
        <SkinAnalysis isModal={true} />
      </div>
    </div>
  );
};

/**
 * 分析步驟指示器
 */
const AnalysisStepIndicator = ({ step, status }) => {
  const statusClasses = {
    active: 'border-purple-300 bg-purple-50',
    completed: 'border-green-300 bg-green-50',
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
  onSwitchToCamera,
  apiStatus
}) => {
  if (!uploadedImage && activeStep === 0) {
    return <ImageUploadSection onImageUpload={onImageUpload} onSwitchToCamera={onSwitchToCamera} apiStatus={apiStatus} />;
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
const ImageUploadSection = ({ onImageUpload, onSwitchToCamera, apiStatus }) => (
  <div className="space-y-6">
    {/* 選擇分析方式 */}
    <div className="text-center mb-8">
      <h3 className="text-xl font-bold text-slate-800 mb-4">選擇分析方式</h3>
      <p className="text-slate-600">請選擇您偏好的肌膚分析方式</p>
    </div>

    <div className="grid md:grid-cols-2 gap-6">
      {/* 攝像頭拍攝選項 */}
      <div className="border-2 border-dashed border-purple-300 rounded-xl p-8 text-center hover:border-purple-400 transition-colors cursor-pointer group"
           onClick={onSwitchToCamera}>
        <FiCamera className="w-16 h-16 text-purple-500 mx-auto mb-4 group-hover:scale-110 transition-transform" />
        <h4 className="text-lg font-semibold text-slate-800 mb-2">攝像頭即時拍攝</h4>
        <p className="text-slate-600 mb-4">
          使用設備攝像頭進行即時肌膚分析
        </p>
        <button className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-medium hover:from-purple-600 hover:to-pink-600 transition-all">
          啟動攝像頭
        </button>
      </div>

      {/* 圖片上傳選項 */}
      <div className="border-2 border-dashed border-blue-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
        <FiUpload className="w-16 h-16 text-blue-500 mx-auto mb-4" />
        <h4 className="text-lg font-semibold text-slate-800 mb-2">上傳照片分析</h4>
        <p className="text-slate-600 mb-4">
          上傳清晰的臉部照片進行分析
        </p>
        <label className="inline-block">
          <input 
            type="file" 
            accept="image/*" 
            onChange={onImageUpload}
            className="hidden"
          />
          <span className="px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full font-medium hover:from-blue-600 hover:to-cyan-600 transition-all cursor-pointer">
            選擇照片
          </span>
        </label>
      </div>
    </div>

    {/* 提示說明 */}
    <div className="bg-slate-50 rounded-xl p-4">
      <h4 className="font-semibold text-slate-800 mb-2">拍攝建議：</h4>
      <ul className="text-sm text-slate-600 space-y-1">
        <li>• 確保光線充足，避免逆光</li>
        <li>• 臉部正對鏡頭，表情自然</li>
        <li>• 清潔臉部，卸除彩妝</li>
        <li>• 避免頭髮遮擋臉部區域</li>
      </ul>
    </div>
  </div>
);

/**
 * 分析中區域
 */
const AnalyzingSection = ({ apiStatus }) => (
  <div className="text-center py-12">
    <div className="relative w-32 h-32 mx-auto mb-8">
      <div className="absolute inset-0 border-4 border-purple-200 rounded-full"></div>
      <div className="absolute inset-0 border-4 border-purple-500 rounded-full border-t-transparent animate-spin"></div>
      <div className="absolute inset-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
        <RiBrainFill className="w-12 h-12 text-white" />
      </div>
    </div>
    
    <h3 className="text-2xl font-bold text-slate-800 mb-4">AI 正在分析您的肌膚...</h3>
    <p className="text-slate-600 mb-6">
      {apiStatus?.isDemo 
        ? '演示模式：正在生成模擬分析結果'
        : 'Perfect Corp 專業引擎正在進行 14 項肌膚檢測'
      }
    </p>
    
    <div className="max-w-md mx-auto">
      <div className="space-y-3">
        {['面部區域識別', '肌膚質地分析', '色彩與色斑檢測', '生成個人化建議'].map((step, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-slate-600">{step}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/**
 * 分析結果區域
 */
const AnalysisResultsSection = ({ result, onSaveToMemory, apiStatus }) => (
  <div className="space-y-6">
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-4">
        <AiOutlineCheck className="w-10 h-10 text-white" />
      </div>
      <h3 className="text-2xl font-bold text-slate-800 mb-2">分析完成！</h3>
      <p className="text-slate-600">
        您的{apiStatus?.isDemo ? '演示' : '專業'}肌膚分析報告已生成
      </p>
    </div>

    {/* 總體評分 */}
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 text-center border border-purple-200">
      <h4 className="text-lg font-semibold text-slate-800 mb-2">整體肌膚評分</h4>
      <div className="text-4xl font-bold text-purple-600 mb-2">{result.overall_score}</div>
      <div className="text-sm text-slate-600">肌膚年齡: {result.skin_age} 歲</div>
    </div>

    {/* 詳細分析結果 */}
    <div className="grid md:grid-cols-2 gap-4">
      {result.concerns.map((concern, index) => (
        <ConcernCard key={index} concern={concern} />
      ))}
    </div>

    {/* AI 建議 */}
    <RecommendationsCard recommendations={result.recommendations} />

    {/* 保存按鈕 */}
    <SaveButton onSaveToMemory={onSaveToMemory} apiStatus={apiStatus} />
  </div>
);

/**
 * 問題分析卡片
 */
const ConcernCard = ({ concern }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case '優秀': return 'text-green-600';
      case '良好': return 'text-blue-600';
      case '需改善': return 'text-amber-600';
      default: return 'text-slate-600';
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 border border-slate-200">
      <div className="flex justify-between items-start mb-3">
        <h5 className="font-semibold text-slate-800">{concern.name}</h5>
        <span className={`text-sm font-medium ${getStatusColor(concern.status)}`}>
          {concern.status}
        </span>
      </div>
      
      <div className="mb-3">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm text-slate-600">評分</span>
          <span className="font-semibold text-slate-800">{concern.score}</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-1000"
            style={{ width: `${concern.score}%` }}
          ></div>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <span className="text-xs text-slate-500">較上次</span>
        <span className={`text-xs font-medium ${
          concern.improvement.includes('+') ? 'text-green-600' : 'text-red-600'
        }`}>
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