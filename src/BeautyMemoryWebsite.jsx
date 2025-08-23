import React, { useState, useEffect, useRef } from 'react';
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
  FiEye,
  FiPlay,
  FiPause,
  FiDroplet,
  FiSun,
  FiBarChart2
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

// SkinAnalysis 組件
const SkinAnalysis = ({ isModal = false }) => {
  const [cameraOpened, setCameraOpened] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(false);
  const [captureInProgress, setCaptureInProgress] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [mockFaceQuality, setMockFaceQuality] = useState(null);
  const [apiStatus, setApiStatus] = useState({
    available: true,
    message: '原生攝像頭 + AI 分析模式'
  });

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

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
        image_sharpness: Math.random() > 0.4 ? 'sharp' : 'blurry'
      };
      
      setMockFaceQuality(perfectCorpQuality);
    }, 1000);

    return () => clearInterval(qualityInterval);
  }, [cameraOpened]);

  // 開啟攝像頭
  const openCamera = async () => {
    setCameraLoading(true);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      setCameraStream(stream);
      setCameraOpened(true);
      
      setTimeout(() => {
        if (videoRef.current && stream) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(err => {
            console.error('視頻播放失敗:', err);
          });
        }
      }, 100);
      
    } catch (error) {
      console.error('攝像頭開啟失敗:', error);
      setApiStatus({
        available: false,
        message: '攝像頭存取被拒絕'
      });
    } finally {
      setCameraLoading(false);
    }
  };

  // 關閉攝像頭
  const closeCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraOpened(false);
    setMockFaceQuality(null);
  };

  // 拍照分析
  const captureAndAnalyze = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    setCaptureInProgress(true);
    setIsAnalyzing(true);
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);
    
    setTimeout(() => {
      const mockResult = generateMockAnalysisResult();
      setAnalysisResult(mockResult);
      setIsAnalyzing(false);
      setCaptureInProgress(false);
      closeCamera();
    }, 3000);
  };

  // 生成模擬分析結果
  const generateMockAnalysisResult = () => {
    return {
      overall_score: Math.floor(Math.random() * 20) + 75,
      skin_age: Math.floor(Math.random() * 10) + 20,
      feng_shui_blessing: '九紫離火運正旺，您的美麗能量處於上升期！',
      concerns: [
        { name: '水分', score: Math.floor(Math.random() * 30) + 60, status: '良好', category: 'hydration' },
        { name: '毛孔', score: Math.floor(Math.random() * 25) + 70, status: '正常', category: 'pores' },
        { name: '斑點', score: Math.floor(Math.random() * 20) + 75, status: '優秀', category: 'spots' },
        { name: '皺紋', score: Math.floor(Math.random() * 25) + 65, status: '需改善', category: 'wrinkles' },
        { name: '黑眼圈', score: Math.floor(Math.random() * 30) + 55, status: '需關注', category: 'dark_circles' },
        { name: '膚色均勻度', score: Math.floor(Math.random() * 20) + 70, status: '良好', category: 'skin_tone' },
        { name: '油脂平衡', score: Math.floor(Math.random() * 25) + 65, status: '正常', category: 'oil_balance' }
      ],
      recommendations: [
        '建議增加保濕頻率，每日至少補充2次保濕精華',
        '九運期間多使用紅色系護膚品，增強美麗運勢',
        '建議在午時(11-13點)進行重要護膚步驟',
        '搭配火元素精油按摩，激發肌膚活力'
      ]
    };
  };

  // 獲取分數顏色
  const getScoreColor = (score) => {
    if (score >= 80) return 'bg-green-100 text-green-700';
    if (score >= 60) return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  // 獲取關注點圖標
  const getConcernIcon = (category) => {
    const icons = {
      hydration: <FiDroplet className="w-4 h-4 text-blue-500" />,
      pores: <BiScan className="w-4 h-4 text-gray-500" />,
      spots: <FiSun className="w-4 h-4 text-orange-500" />,
      wrinkles: <FiBarChart2 className="w-4 h-4 text-purple-500" />,
      dark_circles: <FiEye className="w-4 h-4 text-indigo-500" />,
      skin_tone: <BiStar className="w-4 h-4 text-pink-500" />,
      oil_balance: <BiDroplet className="w-4 h-4 text-green-500" />
    };
    return icons[category] || <FiStar className="w-4 h-4 text-gray-500" />;
  };

  // 重置分析
  const resetAnalysis = () => {
    setAnalysisResult(null);
    setIsAnalyzing(false);
    setCaptureInProgress(false);
  };

  return (
    <div className="space-y-6">
      {/* 攝像頭控制區 */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <FiCamera className="w-5 h-5 text-purple-600" />
            AI 智能肌膚分析
          </h3>
          <div className="text-sm px-3 py-1 bg-white rounded-full border border-purple-200 text-purple-600">
            {apiStatus.message}
          </div>
        </div>

        {/* 攝像頭視窗 */}
        <div className="relative bg-black rounded-xl overflow-hidden" style={{ aspectRatio: '16/9' }}>
          {cameraOpened ? (
            <>
              <video 
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
                style={{ transform: 'scaleX(-1)' }}
                onLoadedMetadata={(e) => {
                  e.target.play().catch(err => console.error('播放失敗:', err));
                }}
              />
              <canvas ref={canvasRef} className="hidden" />
              
              {/* 面部檢測覆層 */}
              {mockFaceQuality && (
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-4 left-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg p-3">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-white">臉部檢測:</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          mockFaceQuality.hasFace ? 'bg-green-500' : 'bg-red-500'
                        } text-white`}>
                          {mockFaceQuality.hasFace ? '已檢測' : '未檢測'}
                        </span>
                      </div>
                      {mockFaceQuality.hasFace && (
                        <>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-white">光線:</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              mockFaceQuality.lighting === 'good' ? 'bg-green-500' :
                              mockFaceQuality.lighting === 'ok' ? 'bg-yellow-500' : 'bg-red-500'
                            } text-white`}>
                              {mockFaceQuality.lighting === 'good' ? '充足' :
                               mockFaceQuality.lighting === 'ok' ? '一般' : '不足'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-white">角度:</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              mockFaceQuality.frontal === 'good' ? 'bg-green-500' : 'bg-yellow-500'
                            } text-white`}>
                              {mockFaceQuality.frontal === 'good' ? '正面' : '需調整'}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {/* 掃描框 */}
                  {mockFaceQuality.hasFace && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-64 h-64 border-2 border-purple-400 rounded-full animate-pulse" />
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center h-full bg-gradient-to-br from-purple-100 to-pink-100">
              <div className="text-center">
                <FiCamera className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                <p className="text-purple-600 font-medium">攝像頭未開啟</p>
                <p className="text-sm text-purple-500 mt-2">點擊下方按鈕開始分析</p>
              </div>
            </div>
          )}
        </div>

        {/* 控制按鈕 */}
        <div className="flex justify-center gap-4 mt-6">
          {!cameraOpened ? (
            <button
              onClick={openCamera}
              disabled={cameraLoading}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-medium hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50"
            >
              {cameraLoading ? '開啟中...' : '開啟攝像頭'}
            </button>
          ) : (
            <>
              <button
                onClick={captureAndAnalyze}
                disabled={captureInProgress || !mockFaceQuality?.hasFace}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-medium hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50"
              >
                {captureInProgress ? '分析中...' : '拍照分析'}
              </button>
              <button
                onClick={closeCamera}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-full font-medium hover:bg-gray-300 transition-all"
              >
                關閉攝像頭
              </button>
            </>
          )}
        </div>
      </div>

      {/* 分析中動畫 */}
      {isAnalyzing && (
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4 animate-pulse">
            <BiBrain className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">AI 正在分析您的肌膚...</h3>
          <p className="text-slate-600 mb-4">Perfect Corp 引擎正在進行 14 項專業檢測</p>
          
          <div className="w-64 bg-slate-200 rounded-full h-2 mx-auto mb-4">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full animate-pulse transition-all duration-1000" 
                 style={{ width: '75%' }}></div>
          </div>
          
          <div className="text-sm text-slate-500 space-y-1">
            <p>🔍 檢測臉部特徵...</p>
            <p>📊 分析肌膚狀態...</p>
            <p>🧠 生成個人化建議...</p>
          </div>
        </div>
      )}

      {/* 分析結果 */}
      {analysisResult && !isAnalyzing && (
        <div className="space-y-6">
          {/* 總體評分 */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <BiHeart className="w-5 h-5 text-red-500" />
              肌膚健康評分
            </h3>
            <div className="text-center">
              <div className="text-5xl font-bold text-purple-600 mb-2">
                {analysisResult.overall_score}
              </div>
              <div className="text-slate-600 mb-4">總體評分</div>
              <div className="flex items-center justify-center gap-4 text-sm text-slate-600">
                <span>肌膚年齡: {analysisResult.skin_age} 歲</span>
              </div>
            </div>
          </div>

          {/* 九運祝福 */}
          <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-6 border border-red-200">
            <div className="text-center">
              <FiStar className="w-8 h-8 text-red-500 mx-auto mb-3" />
              <p className="text-red-800 font-medium">{analysisResult.feng_shui_blessing}</p>
            </div>
          </div>

          {/* 詳細分析 */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FiBarChart2 className="w-5 h-5 text-blue-500" />
              詳細分析報告
            </h3>
            <div className="space-y-4">
              {analysisResult.concerns.map((concern, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getConcernIcon(concern.category)}
                    <span className="font-medium">{concern.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${getScoreColor(concern.score)}`}>
                      {concern.score}
                    </span>
                    <span className="text-sm text-slate-600">{concern.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 護膚建議 */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <BiTrendingUp className="w-5 h-5 text-green-500" />
              個性化護膚建議
            </h3>
            <div className="space-y-3">
              {analysisResult.recommendations.map((rec, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                  <span className="bg-green-100 text-green-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-0.5">
                    {index + 1}
                  </span>
                  <span className="text-green-800">{rec}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 重新分析按鈕 */}
          <div className="text-center">
            <button
              onClick={resetAnalysis}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-medium hover:from-purple-600 hover:to-pink-600 transition-all"
            >
              重新分析
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// 主要的 BeautyMemoryWebsite 組件
const BeautyMemoryWebsite = () => {
  const [scrollY, setScrollY] = useState(0);
  const [showSkinAnalysis, setShowSkinAnalysis] = useState(false);
  const [memories, setMemories] = useState([
    {
      id: 1,
      moment: "首次使用AI分析後的驚喜",
      emotion: "😍",
      date: "2025-01-15",
      product: "Perfect Corp AI",
      aiAnalysis: "肌膚狀態評分 85 分，水潤度提升 20%",
      improvement: "+15% 整體改善"
    },
    {
      id: 2,
      moment: "堅持護膚一個月的成果",
      emotion: "🎉",
      date: "2025-01-01",
      product: "九運能量精華",
      aiAnalysis: "毛孔細緻度提升，膚色均勻度改善",
      improvement: "+22% 肌膚緊緻"
    }
  ]);
  
  const [notification, setNotification] = useState({
    isVisible: false,
    message: '',
    type: 'info'
  });

  const [apiStatus, setApiStatus] = useState({
    isDemo: true,
    message: '演示模式'
  });

  // 獲取當前九運時機
  const getCurrentFengShuiTiming = () => {
    const hour = new Date().getHours();
    const fireHours = [11, 12, 13];
    const isFireTime = fireHours.includes(hour);
    
    return {
      isAuspicious: isFireTime,
      color: isFireTime ? '#dc2626' : '#7c3aed',
      recommendation: isFireTime 
        ? '🔥 九紫離火運巔峰時刻' 
        : '🔮 九紫離火運能量聚集中'
    };
  };

  const [fengShuiTiming] = useState(getCurrentFengShuiTiming());

  // 滾動監聽
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 顯示通知
  const showNotification = (message, type = 'info') => {
    setNotification({ isVisible: true, message, type });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, isVisible: false }));
    }, 3000);
  };

  // 開啟分析模態框
  const handleAnalysisClick = () => {
    setShowSkinAnalysis(true);
    showNotification('正在啟動 AI 肌膚分析系統...', 'info');
  };

  // 關閉分析模態框
  const closeAnalysisModal = () => {
    setShowSkinAnalysis(false);
    showNotification('已關閉 AI 肌膚分析系統', 'info');
  };

  // SkinAnalysisModal 組件
  const SkinAnalysisModal = ({ isOpen, onClose, apiStatus }) => {
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

  // 通知組件
  const NotificationToast = ({ message, type, isVisible }) => {
    if (!isVisible) return null;

    const typeStyles = {
      info: 'bg-blue-500',
      success: 'bg-green-500',
      error: 'bg-red-500',
      warning: 'bg-yellow-500'
    };

    return (
      <div className={`fixed top-20 right-4 z-50 ${typeStyles[type]} text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}>
        <div className="flex items-center gap-2">
          {type === 'success' && <AiOutlineCheck className="w-5 h-5" />}
          {type === 'error' && <AiOutlineClose className="w-5 h-5" />}
          {type === 'warning' && <AiOutlineWarning className="w-5 h-5" />}
          <span>{message}</span>
        </div>
      </div>
    );
  };

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
        <section className="relative min-h-screen flex items-center justify-center px-4 pt-20">
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-8">
              <div className="inline-flex items-center bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 border border-purple-200 shadow-lg mb-6">
                <RiSparklingFill className="w-5 h-5 text-purple-500 mr-2" />
                <span className="text-slate-700 text-sm font-medium">
                  2025 九紫離火運 • AI 美麗新紀元
                </span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent mb-6">
                美魔力
              </h1>
              
              <p className="text-2xl md:text-3xl text-slate-700 font-medium mb-4">
                AI 智能肌膚分析 × 美麗記憶系統
              </p>
              
              <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
                結合 Perfect Corp 專業技術與九紫離火運能量，
                為您打造專屬的美麗記憶庫，讓每一次護膚都成為科學化的美麗投資
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleAnalysisClick}
                className="group px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold text-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <span className="flex items-center gap-2">
                  <BiCamera className="w-6 h-6" />
                  立即體驗 AI 肌膚分析
                </span>
              </button>
            </div>

            {/* 特色指標 */}
            <div className="grid grid-cols-3 gap-4 mt-16 max-w-2xl mx-auto">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-purple-100">
                <div className="text-3xl font-bold text-purple-600">95%</div>
                <div className="text-sm text-slate-600">分析準確率</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-pink-100">
                <div className="text-3xl font-bold text-pink-600">14項</div>
                <div className="text-sm text-slate-600">專業檢測</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-red-100">
                <div className="text-3xl font-bold text-red-600">3秒</div>
                <div className="text-sm text-slate-600">快速分析</div>
              </div>
            </div>
          </div>
        </section>

        {/* 功能展示區 */}
        <section className="py-20 px-4 bg-white/50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center text-slate-800 mb-4">
              AI 賦能的美麗科技
            </h2>
            <p className="text-xl text-center text-slate-600 mb-12">
              Perfect Corp 技術支援，專業皮膚科醫師等級分析
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
                  <BiScan className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">智能肌膚掃描</h3>
                <p className="text-slate-600">
                  採用深度學習算法，精準識別14種肌膚問題，包括斑點、皺紋、毛孔等
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-red-500 rounded-xl flex items-center justify-center mb-4">
                  <BiBarChart className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">數據化追蹤</h3>
                <p className="text-slate-600">
                  建立個人美麗檔案，追蹤肌膚變化趨勢，科學量化護膚效果
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
                <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl flex items-center justify-center mb-4">
                  <RiBrainFill className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">個性化建議</h3>
                <p className="text-slate-600">
                  基於AI分析結果，提供專屬護膚方案，結合九運能量時機優化效果
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 美麗記憶展示 */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center text-slate-800 mb-4">
              美麗記憶時光軸
            </h2>
            <p className="text-xl text-center text-slate-600 mb-12">
              記錄每一次蛻變，見證美麗成長
            </p>

            <div className="space-y-6">
              {memories.map((memory) => (
                <div key={memory.id} className="group">
                  <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="text-4xl">{memory.emotion}</div>
                        <div>
                          <h3 className="text-xl font-bold text-slate-800">{memory.moment}</h3>
                          <p className="text-sm text-slate-500">{memory.date} • {memory.product}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-green-600">
                        <BiTrendingUp className="w-5 h-5" />
                        <span className="font-medium">{memory.improvement}</span>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4">
                      <p className="text-slate-700">
                        <span className="font-medium">AI 分析：</span>
                        {memory.aiAnalysis}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 九運能量區 */}
        <section className="py-20 px-4 bg-gradient-to-r from-red-50 to-orange-50">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-red-500 to-orange-500 rounded-full mb-6">
              <AiOutlineFire className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-slate-800 mb-4">
              九紫離火運 美麗新紀元
            </h2>
            <p className="text-xl text-slate-600 mb-8">
              2025年開啟的二十年火運週期，激發內在美麗能量
            </p>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6">
                <h3 className="text-lg font-bold text-red-700 mb-2">🔥 火元素加持</h3>
                <p className="text-slate-600">提升肌膚活力與光澤，激發細胞再生能量</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6">
                <h3 className="text-lg font-bold text-red-700 mb-2">⏰ 最佳時機</h3>
                <p className="text-slate-600">午時(11-13點)護膚效果倍增，把握黃金時段</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6">
                <h3 className="text-lg font-bold text-red-700 mb-2">💎 能量共振</h3>
                <p className="text-slate-600">紅色系護膚品與火運能量共振，效果更顯著</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 頁腳 */}
      <footer className="bg-slate-900 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <RiMagicFill className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold">美魔力 Beauty Memory</h3>
          </div>
          <p className="text-slate-400 mb-4">
            Powered by Perfect Corp AI Technology
          </p>
          <p className="text-sm text-slate-500">
            © 2025 美魔力. 推廣所有跟美相關的人事物
          </p>
        </div>
      </footer>

      {/* 肌膚分析模態框 - 使用完整 SkinAnalysis 組件 */}
      <SkinAnalysisModal 
        isOpen={showSkinAnalysis}
        onClose={closeAnalysisModal}
        apiStatus={apiStatus}
      />

      {/* 通知組件 */}
      <NotificationToast 
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
      />
    </div>
  );
};

export default BeautyMemoryWebsite;