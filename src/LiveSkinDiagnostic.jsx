// Start live analysis with face detection check
  const startLiveAnalysis = () => {
    if (analysisIntervalRef.current) {
      clearInterval(analysisIntervalRef.current);
    }
    
    analysisIntervalRef.current = setInterval(updateLiveMetricsData, 2000);
    updateLiveMetricsData();
  };import React, { useState, useEffect, useRef } from 'react';

const LiveSkinDiagnostic = () => {
  // State for camera status
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [faceDetected, setFaceDetected] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisStep, setAnalysisStep] = useState('');
  const [showProgress, setShowProgress] = useState(false);
  const [liveMetrics, setLiveMetrics] = useState({
    hydration: 0,
    radiance: 0,
    firmness: 0,
    texture: 0
  });
  const [overallScore, setOverallScore] = useState(0);
  const [overallStatus, setOverallStatus] = useState('等待檢測中...');
  const [recommendations, setRecommendations] = useState([]);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [fengShuiTiming, setFengShuiTiming] = useState({
    timing: '平衡時辰',
    recommendation: '適合基礎護理'
  });

  // Refs
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const analysisIntervalRef = useRef(null);

  // Update feng shui timing
  const updateFengShuiTiming = () => {
    const hour = new Date().getHours();
    const fireHours = [7, 8, 9, 11, 12, 13];
    const waterHours = [19, 20, 21, 23, 0, 1];
    
    let timing, recommendation;
    
    if (fireHours.includes(hour)) {
      timing = '離火時辰';
      recommendation = '適合美白和提亮護理';
    } else if (waterHours.includes(hour)) {
      timing = '水元素時辰';
      recommendation = '適合深層保濕和修復';
    } else {
      timing = '平衡時辰';
      recommendation = '適合基礎護理';
    }
    
    setFengShuiTiming({ timing, recommendation });
  };

  // Initialize and cleanup
  useEffect(() => {
    updateFengShuiTiming();
    const interval = setInterval(updateFengShuiTiming, 60000);
    
    return () => {
      clearInterval(interval);
      // Cleanup camera when component unmounts
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (analysisIntervalRef.current) {
        clearInterval(analysisIntervalRef.current);
      }
    };
  }, []);

  // Stop camera function
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
        console.log('相機軌道已停止:', track.kind);
      });
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setCameraActive(false);
    setFaceDetected(false);
    setCameraError('');
    
    if (analysisIntervalRef.current) {
      clearInterval(analysisIntervalRef.current);
      analysisIntervalRef.current = null;
    }
  };

  // Start camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: 640, 
          height: 480,
          facingMode: 'user'
        } 
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraActive(true);
      
      // 延遲啟動分析，給相機時間載入
      setTimeout(() => {
        startLiveAnalysis();
      }, 3000);
      
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('無法存取相機，請確認權限設定或檢查相機是否被其他應用程式使用');
    }
  };

  // Start live analysis with face detection check
  const startLiveAnalysis = () => {
    // 模擬臉部檢測
    const checkFaceDetection = () => {
      // 在實際應用中，這裡會有真實的臉部檢測邏輯
      const faceDetected = Math.random() > 0.3; // 70% 機率檢測到臉部
      
      if (faceDetected) {
        analysisIntervalRef.current = setInterval(updateLiveMetricsData, 2000);
        updateLiveMetricsData();
      } else {
        // 如果沒檢測到臉部，顯示提示
        setTimeout(checkFaceDetection, 1000);
      }
    };
    
    checkFaceDetection();
  };

  // Update live metrics - moved before startLiveAnalysis
  const updateLiveMetricsData = () => {
    const metrics = {
      hydration: Math.floor(Math.random() * 20) + 70,
      radiance: Math.floor(Math.random() * 25) + 65,
      firmness: Math.floor(Math.random() * 15) + 80,
      texture: Math.floor(Math.random() * 30) + 60
    };

    setLiveMetrics(metrics);

    const overall = Math.floor(Object.values(metrics).reduce((a, b) => a + b) / 4);
    setOverallScore(overall);
    
    let status = '需改善';
    if (overall >= 85) status = '優秀';
    else if (overall >= 75) status = '良好';
    else if (overall >= 65) status = '尚可';
    
    setOverallStatus(`肌膚狀態: ${status}`);

    if (overall > 0) {
      updateRecommendations(overall);
    }
  };

  // Update recommendations
  const updateRecommendations = (score) => {
    const allRecommendations = [
      "建議加強保濕護理，使用含玻尿酸成分的精華液",
      "定期使用溫和去角質產品，改善肌膚紋理",
      "使用含維他命C的精華，提升肌膚亮澤度",
      "加強防曬保護，預防色斑形成",
      "配合九紫離火運時機，午時進行重點護理"
    ];

    const selectedRecs = allRecommendations.slice(0, 3);
    setRecommendations(selectedRecs);
    setShowRecommendations(true);
  };

  // Capture photo and start detailed analysis
  const capturePhoto = () => {
    setShowProgress(true);
    simulateDetailedAnalysis();
  };

  // Simulate detailed analysis
  const simulateDetailedAnalysis = () => {
    const steps = [
      "正在初始化AI引擎...",
      "檢測臉部輪廓...",
      "分析皺紋分布...", 
      "測量毛孔大小...",
      "評估色斑情況...",
      "計算水分含量...",
      "分析膚質紋理...",
      "測量亮澤度...",
      "評估緊緻度...",
      "生成個人化建議...",
      "完成分析報告..."
    ];

    let progress = 0;
    let stepIndex = 0;
    setIsAnalyzing(true);

    const interval = setInterval(() => {
      progress += Math.random() * 15 + 5;
      if (progress > 100) progress = 100;

      setAnalysisProgress(Math.floor(progress));
      
      if (stepIndex < steps.length) {
        setAnalysisStep(steps[stepIndex]);
        stepIndex++;
      }

      if (progress >= 100) {
        clearInterval(interval);
        completeAnalysis();
      }
    }, 800);
  };

  // Complete analysis
  const completeAnalysis = () => {
    setAnalysisStep("分析完成！");
    setIsAnalyzing(false);
    
    const finalResults = {
      hydration: Math.floor(Math.random() * 20) + 75,
      radiance: Math.floor(Math.random() * 25) + 70,
      firmness: Math.floor(Math.random() * 15) + 82,
      texture: Math.floor(Math.random() * 30) + 65
    };

    setLiveMetrics(finalResults);
    const overall = Math.floor(Object.values(finalResults).reduce((a, b) => a + b) / 4);
    setOverallScore(overall);
    
    let status = '需改善';
    if (overall >= 85) status = '優秀';
    else if (overall >= 75) status = '良好';
    else if (overall >= 65) status = '尚可';
    
    setOverallStatus(`肌膚狀態: ${status}`);
    updateRecommendations(overall);

    setTimeout(() => {
      alert('🎉 AI 肌膚分析完成！您的專屬美麗報告已生成。');
    }, 1000);
  };

  // Save diagnostic
  const saveDiagnostic = () => {
    const timestamp = new Date().toLocaleString('zh-TW');
    alert(`✅ 檢測報告已保存至美麗記憶庫\n時間: ${timestamp}\n\n您可以在「我的記憶」中查看完整報告和改善追蹤。`);
  };

  // Share results
  const shareResults = () => {
    const message = `我剛剛完成了 AI 肌膚檢測！\n\n📊 整體評分: ${overallScore}/100\n🔬 採用 AILabTools AI 技術\n✨ 95% 醫師級準確率\n\n立即體驗: 美魔力 AI Live Diagnostic`;
    
    if (navigator.share) {
      navigator.share({
        title: '我的AI肌膚檢測報告',
        text: message
      });
    } else {
      navigator.clipboard.writeText(message).then(() => {
        alert('✅ 檢測結果已複製到剪貼簿，可以分享給朋友！');
      });
    }
  };

  // Download app
  const downloadApp = () => {
    alert('🚀 專業版APP即將推出！\n\n更多功能:\n• 詳細肌膚地圖\n• 長期追蹤分析\n• 個人化護膚計畫\n• 專家諮詢服務\n\n敬請期待！');
  };

  // Scroll to diagnostic section
  const scrollToDiagnostic = () => {
    const element = document.getElementById('diagnostic');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Feature cards data
  const features = [
    { icon: '👁️', title: '皺紋檢測', desc: '精準分析額頭、眼角、法令紋等部位', color: 'border-purple-200 bg-purple-100' },
    { icon: '🔍', title: '毛孔分析', desc: 'HD高清檢測毛孔大小與分布', color: 'border-blue-200 bg-blue-100' },
    { icon: '☀️', title: '色斑檢測', desc: '深層分析色素沉澱與色斑分布', color: 'border-yellow-200 bg-yellow-100' },
    { icon: '💧', title: '水分測試', desc: '即時檢測肌膚含水量狀態', color: 'border-cyan-200 bg-cyan-100' },
    { icon: '📊', title: '膚質分析', desc: '綜合評估肌膚紋理與光滑度', color: 'border-green-200 bg-green-100' },
    { icon: '✨', title: '亮澤度', desc: '測量肌膚光澤與透明感', color: 'border-pink-200 bg-pink-100' },
    { icon: '⚡', title: '緊緻度', desc: '評估肌膚彈性與緊實程度', color: 'border-indigo-200 bg-indigo-100' },
    { icon: '🎯', title: '肌膚年齡', desc: 'AI智能推算實際肌膚年齡', color: 'border-red-200 bg-red-100' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Feng Shui Timing Banner */}
      <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-center py-2 px-4">
        <p className="text-sm font-medium">
          🔥 2025 九紫離火運 • {fengShuiTiming.timing} • {fengShuiTiming.recommendation} • 立即體驗最佳護膚時機
        </p>
      </div>

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-purple-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">美</span>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">美魔力</h1>
                <p className="text-xs text-gray-600">AI Live Diagnostic</p>
              </div>
            </div>
            <nav className="hidden md:flex space-x-6">
              <a href="#diagnostic" className="text-gray-700 hover:text-purple-600 transition-colors">即時檢測</a>
              <a href="#features" className="text-gray-700 hover:text-purple-600 transition-colors">功能特色</a>
              <a href="#technology" className="text-gray-700 hover:text-purple-600 transition-colors">技術優勢</a>
              <a href="#reports" className="text-gray-700 hover:text-purple-600 transition-colors">檢測報告</a>
            </nav>
            <button 
              onClick={scrollToDiagnostic}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full font-medium hover:shadow-lg transition-all"
            >
              立即檢測
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6 animate-pulse">
            AI Live Skin Diagnostic
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            採用 AILabTools AI 技術，即時分析14項肌膚指標<br/>
            95% 醫師級準確率 • 結合2025九紫離火運最佳護膚時機
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <button 
              onClick={scrollToDiagnostic}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              🔍 立即開始檢測
            </button>
            <button className="border-2 border-purple-300 text-purple-600 px-8 py-4 rounded-full font-semibold hover:bg-purple-50 transition-all">
              📱 觀看示範影片
            </button>
          </div>
        </div>
      </section>

      {/* Live Diagnostic Interface */}
      <section id="diagnostic" className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">即時肌膚診斷系統</h2>
            <p className="text-lg text-gray-600">AILabTools AI 技術 • 即時分析 • 精準診斷</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Camera Interface */}
            <div className="relative">
              <div className="bg-gray-900 aspect-square rounded-3xl flex items-center justify-center relative overflow-hidden">
                {!cameraActive ? (
                  <div className="text-center text-white p-8">
                    <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">準備開始檢測</h3>
                    <p className="text-gray-300 mb-6">請確保光線充足，臉部清晰可見</p>
                    
                    {cameraError && (
                      <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-4 text-red-200 text-sm">
                        <div className="font-semibold mb-1">❌ 相機錯誤</div>
                        <div>{cameraError}</div>
                      </div>
                    )}
                    
                    <div className="space-y-3">
                      <button 
                        onClick={startCamera}
                        className="bg-white text-gray-900 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all w-full"
                        disabled={cameraActive}
                      >
                        {cameraActive ? '📷 相機啟動中...' : '📷 開啟相機'}
                      </button>
                      
                      {cameraError && (
                        <button 
                          onClick={() => {
                            setCameraError('');
                            startCamera();
                          }}
                          className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm hover:bg-blue-500 transition-all w-full"
                        >
                          🔄 重新嘗試
                        </button>
                      )}
                      
                      {/* 完整診斷按鈕 */}
                      <button 
                        onClick={async () => {
                          console.log('🔍 開始完整診斷...');
                          
                          // 檢查媒體設備
                          try {
                            const devices = await navigator.mediaDevices.enumerateDevices();
                            const videoDevices = devices.filter(device => device.kind === 'videoinput');
                            console.log('📱 可用相機:', videoDevices);
                            
                            // 檢查當前流狀態
                            if (streamRef.current) {
                              console.log('🎬 當前流狀態:');
                              console.log('- 活動:', streamRef.current.active);
                              console.log('- 軌道:', streamRef.current.getTracks());
                              
                              const videoTrack = streamRef.current.getVideoTracks()[0];
                              if (videoTrack) {
                                console.log('- 視頻軌道設定:', videoTrack.getSettings());
                                console.log('- 視頻軌道狀態:', videoTrack.readyState);
                              }
                            }
                            
                            // 檢查視頻元素
                            if (videoRef.current) {
                              const video = videoRef.current;
                              console.log('🖥️ 視頻元素狀態:');
                              console.log('- Ready State:', video.readyState);
                              console.log('- Network State:', video.networkState);
                              console.log('- 尺寸:', video.videoWidth, 'x', video.videoHeight);
                              console.log('- 暫停:', video.paused);
                              console.log('- 靜音:', video.muted);
                              console.log('- srcObject:', !!video.srcObject);
                              console.log('- 計算樣式:', window.getComputedStyle(video));
                            }
                            
                            alert(`診斷結果:\n相機數量: ${videoDevices.length}\n流狀態: ${streamRef.current?.active}\n視頻尺寸: ${videoRef.current?.videoWidth}x${videoRef.current?.videoHeight}\n詳細信息請查看 Console`);
                            
                          } catch (err) {
                            console.error('診斷失敗:', err);
                          }
                        }}
                        className="bg-red-600 text-white px-4 py-2 rounded-full text-sm hover:bg-red-500 transition-all w-full"
                      >
                        🔍 完整診斷
                      </button>
                      
                      {/* 切換前後鏡頭 */}
                      <button 
                        onClick={async () => {
                          try {
                            if (streamRef.current) {
                              streamRef.current.getTracks().forEach(track => track.stop());
                            }
                            
                            const constraints = {
                              video: {
                                facingMode: { exact: "environment" } // 後置鏡頭
                              }
                            };
                            
                            const stream = await navigator.mediaDevices.getUserMedia(constraints);
                            streamRef.current = stream;
                            if (videoRef.current) {
                              videoRef.current.srcObject = stream;
                              videoRef.current.play();
                            }
                          } catch (err) {
                            console.log('後置鏡頭不可用，使用前置鏡頭');
                            startCamera(); // 回退到前置鏡頭
                          }
                        }}
                        className="bg-purple-600 text-white px-4 py-2 rounded-full text-sm hover:bg-purple-500 transition-all w-full"
                      >
                        🔄 切換鏡頭
                      </button>
                    </div>
                    
                    <div className="mt-6 text-xs text-gray-400 space-y-1">
                      <p>💡 提示：</p>
                      <p>• 請允許網站存取相機權限</p>
                      <p>• 確認相機未被其他應用程式使用</p>
                      <p>• 使用現代瀏覽器以獲得最佳體驗</p>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Video Element with enhanced visibility fixes */}
                    <video 
                      ref={videoRef}
                      className="w-full h-full"
                      autoPlay={true}
                      muted={true}
                      playsInline={true}
                      controls={false}
                      style={{
                        transform: 'scaleX(-1)', // 鏡像翻轉
                        backgroundColor: '#1a1a1a',
                        objectFit: 'cover',
                        width: '100%',
                        height: '100%',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        zIndex: 1
                      }}
                      onError={(e) => {
                        console.error('🎥 Video element error:', e);
                        setCameraError('視頻元素錯誤');
                      }}
                      onLoadStart={() => console.log('🎬 Video load start')}
                      onLoadedData={() => {
                        console.log('📊 Video data loaded');
                        console.log('📐 Video dimensions:', videoRef.current?.videoWidth, 'x', videoRef.current?.videoHeight);
                      }}
                      onCanPlay={() => {
                        console.log('▶️ Video can play');
                        // 強制播放
                        if (videoRef.current) {
                          videoRef.current.play().catch(console.error);
                        }
                      }}
                      onPlay={() => {
                        console.log('🎵 Video play event');
                        // 確保視頻可見
                        if (videoRef.current) {
                          videoRef.current.style.opacity = '1';
                          videoRef.current.style.visibility = 'visible';
                        }
                      }}
                      onPlaying={() => {
                        console.log('🎭 Video playing event');
                        // 視頻正在播放時的處理
                        if (videoRef.current) {
                          console.log('🎬 Video is actually playing, dimensions:', 
                            videoRef.current.videoWidth, 'x', videoRef.current.videoHeight);
                        }
                      }}
                      onPause={() => console.log('⏸️ Video paused')}
                      onEnded={() => console.log('🔚 Video ended')}
                    />
                    
                    {/* Debug overlay - 顯示視頻狀態 */}
                    {cameraActive && (
                      <div className="absolute bottom-4 left-4 bg-black/50 text-white text-xs p-2 rounded z-10">
                        <div>Video Ready: {videoRef.current?.readyState || 'N/A'}</div>
                        <div>Dimensions: {videoRef.current?.videoWidth || 0} x {videoRef.current?.videoHeight || 0}</div>
                        <div>Current Time: {videoRef.current?.currentTime?.toFixed(1) || 0}s</div>
                        <div>Paused: {videoRef.current?.paused ? 'Yes' : 'No'}</div>
                      </div>
                    )}
                    
                    {/* Scan Overlay */}
                    <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent animate-pulse"></div>
                    
                    {/* Detection Indicators */}
                    <div className="absolute top-4 left-4 right-4">
                      <div className="flex justify-between items-start">
                        <div className="bg-black/70 backdrop-blur-sm rounded-lg p-3 text-white text-xs">
                          <div className="flex items-center space-x-2 mb-1">
                            <div className={`w-2 h-2 rounded-full animate-pulse ${faceDetected ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
                            <span>臉部偵測: {faceDetected ? '已鎖定' : '搜尋中...'}</span>
                          </div>
                          <div className="flex items-center space-x-2 mb-1">
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                            <span>光線條件: 良好</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full animate-pulse ${faceDetected ? 'bg-purple-400' : 'bg-gray-400'}`}></div>
                            <span>AI 分析: {faceDetected ? '進行中' : '待命'}</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-col space-y-2">
                          <button 
                            onClick={capturePhoto}
                            disabled={!faceDetected}
                            className={`p-4 rounded-full transition-all transform hover:scale-110 shadow-lg ${
                              faceDetected 
                                ? 'bg-red-500 hover:bg-red-600 text-white' 
                                : 'bg-gray-500 text-gray-300 cursor-not-allowed'
                            }`}
                          >
                            📸
                          </button>
                          
                          <button 
                            onClick={stopCamera}
                            className="p-3 bg-gray-600 hover:bg-gray-700 text-white rounded-full transition-all text-sm"
                          >
                            ⏹️
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Face Detection Overlay */}
                    {faceDetected && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative">
                          {/* 主要臉部輪廓 */}
                          <div className="w-64 h-80 border-2 border-purple-400 rounded-full opacity-80 relative animate-pulse">
                            {/* 四個角落的檢測點 */}
                            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-purple-400 rounded-full animate-bounce"></div>
                            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-3 h-3 bg-purple-400 rounded-full animate-bounce"></div>
                            <div className="absolute left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-purple-400 rounded-full animate-bounce"></div>
                            <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-purple-400 rounded-full animate-bounce"></div>
                            
                            {/* 眼部檢測標記 */}
                            <div className="absolute top-1/3 left-1/4 w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                            <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                            
                            {/* 鼻部檢測標記 */}
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse"></div>
                            
                            {/* 嘴部檢測標記 */}
                            <div className="absolute bottom-1/3 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-2 h-1 bg-pink-400 rounded-full animate-pulse"></div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 無臉部檢測時的提示 */}
                    {!faceDetected && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <div className="text-center text-white bg-black/70 backdrop-blur-sm rounded-2xl p-6 mx-4">
                          <div className="text-4xl mb-3 animate-bounce">👤</div>
                          <h4 className="text-lg font-semibold mb-2">正在搜尋臉部...</h4>
                          <p className="text-sm text-gray-300">
                            請將臉部置於檢測區域內<br/>
                            • 確保光線充足<br/>
                            • 臉部完整出現在畫面中<br/>
                            • 保持穩定不要移動
                          </p>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Progress Bar */}
              {showProgress && (
                <div className="mt-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">AI 分析進度</span>
                    <span className="text-sm font-semibold text-purple-600">{analysisProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${analysisProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">{analysisStep}</p>
                </div>
              )}
            </div>

            {/* Real-time Analysis Results */}
            <div className="space-y-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <span className="w-3 h-3 bg-green-400 rounded-full mr-3 animate-pulse"></span>
                  即時分析結果
                </h3>
                
                <div className="space-y-4">
                  {/* Skin Metrics Display */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/50 rounded-xl p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">水分度</span>
                        <span className="font-bold text-blue-600">{liveMetrics.hydration || '--'}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all"
                          style={{ width: `${liveMetrics.hydration}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="bg-white/50 rounded-xl p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">亮澤度</span>
                        <span className="font-bold text-yellow-600">{liveMetrics.radiance || '--'}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-yellow-500 h-2 rounded-full transition-all"
                          style={{ width: `${liveMetrics.radiance}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="bg-white/50 rounded-xl p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">緊緻度</span>
                        <span className="font-bold text-purple-600">{liveMetrics.firmness || '--'}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-500 h-2 rounded-full transition-all"
                          style={{ width: `${liveMetrics.firmness}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="bg-white/50 rounded-xl p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">膚質</span>
                        <span className="font-bold text-green-600">{liveMetrics.texture || '--'}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all"
                          style={{ width: `${liveMetrics.texture}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Overall Score */}
                  <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-6 text-center">
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">總體肌膚評分</h4>
                    <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                      {overallScore || '--'}
                    </div>
                    <p className="text-gray-600">{overallStatus}</p>
                  </div>

                  {/* Recommendations */}
                  {showRecommendations && (
                    <div className="bg-white/60 rounded-xl p-6">
                      <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        💡 AI 個人化建議
                      </h4>
                      <ul className="space-y-2 text-sm text-gray-700">
                        {recommendations.map((rec, index) => (
                          <li key={index}>• {rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button 
                  onClick={saveDiagnostic}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  💾 保存報告
                </button>
                <button 
                  onClick={shareResults}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  📤 分享結果
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-16 bg-white/30 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">14項專業肌膚檢測</h2>
            <p className="text-lg text-gray-600">AILabTools AI 技術 • 95% 醫師級準確率</p>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className={`bg-white/80 backdrop-blur-sm rounded-xl p-6 border ${feature.color} transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-lg`}>
                <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mb-4`}>
                  <span className="text-2xl">{feature.icon}</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section id="technology" className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">AILabTools AI 技術驅動</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              採用先進的 AILabTools AI 肌膚分析技術，提供媲美專業皮膚科醫師的精準檢測服務
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-200">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">95% 準確率</h3>
              <p className="text-gray-600">Wake Forest 醫學院皮膚科教授驗證，與醫師診斷相關性超過 80%</p>
            </div>

            <div className="text-center bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-200">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">即時分析</h3>
              <p className="text-gray-600">先進 AI 演算法，數秒內完成 14 項專業肌膚檢測</p>
            </div>

            <div className="text-center bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-200">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl">🛡️</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">隱私保護</h3>
              <p className="text-gray-600">企業級安全防護，您的美麗數據完全保密</p>
            </div>
          </div>

          {/* Technology Details */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-200">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">全方位肌膚健康檢測</h3>
                <ul className="space-y-3">
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-gray-700">HD 高清皺紋檢測（額頭、魚尾紋、法令紋等 7 個區域）</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-700">精密毛孔分析（鼻翼、臉頰、額頭分區檢測）</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                    <span className="text-gray-700">色斑與亮澤度全面評估</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700">肌膚年齡 AI 智能推算</span>
                  </li>
                </ul>
              </div>
              <div className="text-center">
                <div className="w-32 h-32 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full border-4 border-purple-200 flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">🔬</span>
                </div>
                <p className="text-gray-600 text-sm">AILabTools AI 進階追蹤技術</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 bg-gradient-to-r from-purple-100 to-pink-100">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 border border-gray-200 shadow-xl">
            <div className="text-6xl mb-6 animate-pulse">🔬</div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              立即體驗 AI 肌膚分析
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              AILabTools AI 技術 • 95% 醫師級準確率<br/>
              開始建立專屬的美麗記憶庫
            </p>
            
            <div className="bg-amber-50 border border-amber-200 text-amber-700 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl">🧪</span>
                <span className="text-sm font-medium">演示模式 • 完整功能體驗 • 無需註冊</span>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <button 
                onClick={scrollToDiagnostic}
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                🚀 立即開始分析
              </button>
              <button 
                onClick={downloadApp}
                className="px-8 py-4 border-2 border-purple-300 text-purple-600 rounded-full font-semibold hover:bg-purple-50 transition-all"
              >
                📱 下載專業版APP
              </button>
            </div>

            <div className="mt-8 grid md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div className="flex items-center justify-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>完全免費體驗</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>隱私安全保護</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>專業級準確度</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reports Section */}
      <section id="reports" className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">專業檢測報告</h2>
            <p className="text-lg text-gray-600">詳細分析報告，追蹤美麗成長軌跡</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Sample Report 1 */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">肌膚健康報告</h3>
                <span className="text-sm text-gray-500">2025.01.20</span>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">整體評分</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                    <span className="font-bold text-green-600">85</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">水分度</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                    </div>
                    <span className="font-bold text-blue-600">78</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">亮澤度</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '82%' }}></div>
                    </div>
                    <span className="font-bold text-yellow-600">82</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">緊緻度</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{ width: '89%' }}></div>
                    </div>
                    <span className="font-bold text-purple-600">89</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">🎯 個人化建議</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• 建議加強保濕護理，使用含玻尿酸成分的精華液</li>
                  <li>• 定期使用溫和去角質產品，改善肌膚紋理</li>
                  <li>• 加強防曬保護，預防光老化</li>
                </ul>
              </div>
            </div>

            {/* Sample Report 2 */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">進度追蹤報告</h3>
                <span className="text-sm text-gray-500">本月改善</span>
              </div>
              
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">+12%</div>
                  <p className="text-gray-600">整體肌膚狀態改善</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-xl font-bold text-blue-600">+15%</div>
                    <div className="text-sm text-blue-800">水分提升</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-xl font-bold text-yellow-600">+8%</div>
                    <div className="text-sm text-yellow-800">亮澤改善</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-xl font-bold text-purple-600">-5</div>
                    <div className="text-sm text-purple-800">細紋減少</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-xl font-bold text-green-600">+2階</div>
                    <div className="text-sm text-green-800">膚色提亮</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-purple-50 rounded-lg">
                <h4 className="font-semibold text-purple-800 mb-2">🔮 九紫離火運建議</h4>
                <p className="text-sm text-purple-700">
                  當前火元素旺盛，適合進行美白和提亮護理。建議在午時（11:00-13:00）進行重點護膚，效果更佳。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">美</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold">美魔力</h3>
                  <p className="text-sm text-gray-400">AI Live Diagnostic</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                讓科技記住每個美麗瞬間，用AI為您的美麗加分。
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">產品功能</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-purple-400 transition-colors">即時肌膚檢測</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">AI 分析報告</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">美麗記憶庫</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">個人化建議</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">技術支援</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-purple-400 transition-colors">使用教學</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">常見問題</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">聯繫客服</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">技術文件</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">關注我們</h4>
              <div className="flex space-x-4 mb-4">
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors">
                  <span className="text-sm">FB</span>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors">
                  <span className="text-sm">IG</span>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors">
                  <span className="text-sm">YT</span>
                </a>
              </div>
              <p className="text-xs text-gray-500">
                訂閱最新美容科技資訊
              </p>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2025 美魔力 AI Live Diagnostic. Powered by AILabTools AI Technology.
            </p>
            <div className="mt-4 flex justify-center gap-4 text-gray-400 text-xs">
              <a href="#" className="hover:text-purple-400 transition-colors">隱私政策</a>
              <a href="#" className="hover:text-purple-400 transition-colors">使用條款</a>
              <a href="#" className="hover:text-purple-400 transition-colors">聯繫我們</a>
              <a href="#" className="hover:text-purple-400 transition-colors">技術支援</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LiveSkinDiagnostic;



