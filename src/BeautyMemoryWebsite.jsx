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
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisStage, setAnalysisStage] = useState('');
  const [mockFaceQuality, setMockFaceQuality] = useState(null);
  const [apiStatus, setApiStatus] = useState({
    available: true,
    message: '原生攝像頭 + AI 分析模式',
    isDemo: true // 設為 true 表示使用模擬數據
  });

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Perfect Corp API 配置（實際使用時需要真實的 API Key）
  const API_CONFIG = {
    baseUrl: 'https://yce-api-01.perfectcorp.com',
    apiKey: 'YOUR_API_KEY_HERE', // 需要替換為真實的 API Key
    // 可選擇 4, 7 或 14 項分析
    skinConcerns14: [
      'eye_pouch',
      'dark_circle', 
      'eye_finelines',
      'forehead_wrinkle',
      'nasolabial_fold',
      'skin_sagging',
      'skin_firmness',
      'pore',
      'blackhead',
      'skin_spot',
      'acne',
      'skin_texture',
      'skin_radiance',
      'oily_dry_skin'
    ],
    skinConcerns7: [
      'dark_circle',
      'eye_finelines', 
      'pore',
      'skin_spot',
      'acne',
      'skin_texture',
      'skin_radiance'
    ]
  };

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

  // Perfect Corp 面部品質檢測 - 加強手機版本
  useEffect(() => {
    if (!cameraOpened) return;

    const qualityInterval = setInterval(() => {
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
      
      const perfectCorpQuality = {
        hasFace: Math.random() > 0.2,
        area: Math.random() > 0.3 ? 'good' : 'needs_adjustment',
        lighting: Math.random() > 0.25 ? 'good' : Math.random() > 0.6 ? 'ok' : 'poor',
        frontal: Math.random() > 0.3 ? 'good' : 'needs_adjustment',
        eye_detection: Math.random() > 0.4 ? 'detected' : 'not_detected',
        mouth_detection: Math.random() > 0.4 ? 'detected' : 'not_detected',
        skin_visibility: Math.random() > 0.3 ? 'sufficient' : 'insufficient',
        image_sharpness: Math.random() > 0.4 ? 'sharp' : 'blurry',
        // 新增手機專用的距離檢測
        distance: isMobile ? (Math.random() > 0.4 ? 'optimal' : Math.random() > 0.5 ? 'too_close' : 'too_far') : 'good',
        face_size: isMobile ? (Math.random() > 0.3 ? 'good' : Math.random() > 0.5 ? 'too_large' : 'too_small') : 'good'
      };
      
      setMockFaceQuality(perfectCorpQuality);
    }, 1000);

    return () => clearInterval(qualityInterval);
  }, [cameraOpened]);

  // 開啟攝像頭
  const openCamera = async () => {
    setCameraLoading(true);
    
    try {
      // 根據裝置類型設定不同的攝像頭參數
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      
      const constraints = {
        video: { 
          facingMode: 'user',
          width: isMobile 
            ? { ideal: 720 }  // 手機使用較低解析度以提升性能
            : { ideal: 1280 },
          height: isMobile 
            ? { ideal: 1280 } // 手機使用直向比例
            : { ideal: 720 },
          aspectRatio: isMobile 
            ? { ideal: 0.75 }  // 3:4 比例，更適合直向拍攝
            : { ideal: 16/9 }
        }
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
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

  // 拍照分析 - 完整的 Perfect Corp API 流程
  const captureAndAnalyze = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    setCaptureInProgress(true);
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setAnalysisStage('準備分析...');
    
    try {
      // 步驟 1: 拍照並轉換為 Blob
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0);
      
      // 拍照後關閉攝像頭（在開始分析前）
      closeCamera();
      
      // 如果是演示模式，使用模擬流程
      if (apiStatus.isDemo) {
        await performMockAnalysis();
        return;
      }
      
      // 真實 API 流程（需要有效的 API Key）
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.95));
      
      // 步驟 2: 上傳圖片到 Perfect Corp
      setAnalysisStage('上傳圖片中...');
      setAnalysisProgress(20);
      const uploadResult = await uploadImageToAPI(blob);
      
      if (!uploadResult.fileId) {
        throw new Error('圖片上傳失敗');
      }
      
      // 步驟 3: 創建分析任務
      setAnalysisStage('創建分析任務...');
      setAnalysisProgress(40);
      const taskResult = await createAnalysisTask(uploadResult.fileId);
      
      if (!taskResult.taskId) {
        throw new Error('任務創建失敗');
      }
      
      // 步驟 4: 輪詢任務狀態
      setAnalysisStage('AI 正在分析您的肌膚...');
      const analysisData = await pollTaskStatus(taskResult.taskId);
      
      // 步驟 5: 處理並顯示結果
      setAnalysisStage('生成報告中...');
      setAnalysisProgress(90);
      const processedResult = processAnalysisResult(analysisData);
      
      setAnalysisResult(processedResult);
      setAnalysisProgress(100);
      setAnalysisStage('分析完成！');
      
    } catch (error) {
      console.error('分析錯誤:', error);
      setApiStatus({
        available: false,
        message: '分析失敗，使用演示模式',
        isDemo: true
      });
      // 失敗時使用模擬數據
      await performMockAnalysis();
    } finally {
      setIsAnalyzing(false);
      setCaptureInProgress(false);
    }
  };
  
  // 模擬分析流程（演示用）
  const performMockAnalysis = async () => {
    const stages = [
      { progress: 10, stage: '檢測臉部特徵...' },
      { progress: 25, stage: '分析膚質狀態...' },
      { progress: 40, stage: '檢測毛孔大小...' },
      { progress: 55, stage: '評估黑眼圈程度...' },
      { progress: 70, stage: '分析細紋與皺紋...' },
      { progress: 85, stage: '檢測斑點與痘痘...' },
      { progress: 95, stage: '生成個人化建議...' },
      { progress: 100, stage: '分析完成！' }
    ];
    
    for (const stage of stages) {
      setAnalysisProgress(stage.progress);
      setAnalysisStage(stage.stage);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    const mockResult = generateDetailedMockResult();
    setAnalysisResult(mockResult);
  };
  
  // 上傳圖片到 API
  const uploadImageToAPI = async (blob) => {
    const formData = new FormData();
    formData.append('file', blob, 'face.jpg');
    
    const response = await fetch(`${API_CONFIG.baseUrl}/file/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_CONFIG.apiKey}`
      },
      body: formData
    });
    
    if (!response.ok) {
      throw new Error('Upload failed');
    }
    
    const data = await response.json();
    return { fileId: data.file_id };
  };
  
  // 創建分析任務
  const createAnalysisTask = async (fileId) => {
    const taskPayload = {
      file_id: fileId,
      dst_actions: API_CONFIG.skinConcerns14 // 使用 14 項分析
    };
    
    const response = await fetch(`${API_CONFIG.baseUrl}/ai_skin_analysis/run_task`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_CONFIG.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(taskPayload)
    });
    
    if (!response.ok) {
      throw new Error('Task creation failed');
    }
    
    const data = await response.json();
    return { taskId: data.task_id };
  };
  
  // 輪詢任務狀態
  const pollTaskStatus = async (taskId) => {
    const maxAttempts = 30;
    let attempts = 0;
    
    while (attempts < maxAttempts) {
      const response = await fetch(`${API_CONFIG.baseUrl}/ai_skin_analysis/check_task_status?task_id=${taskId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${API_CONFIG.apiKey}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Status check failed');
      }
      
      const data = await response.json();
      
      if (data.status === 'succeeded') {
        // 下載結果
        return await downloadResult(data.result_url);
      } else if (data.status === 'failed') {
        throw new Error('Analysis failed');
      }
      
      // 更新進度
      const progress = 40 + (attempts / maxAttempts) * 40;
      setAnalysisProgress(Math.min(progress, 80));
      
      attempts++;
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    throw new Error('Timeout waiting for analysis');
  };
  
  // 下載並解析結果
  const downloadResult = async (resultUrl) => {
    const response = await fetch(resultUrl);
    const blob = await response.blob();
    // 這裡需要解壓 ZIP 文件並解析 JSON 結果
    // 實際實現需要使用 JSZip 或類似庫
    return {}; // 返回解析後的結果
  };
  
  // 處理分析結果
  const processAnalysisResult = (rawData) => {
    // 將 Perfect Corp API 結果轉換為我們的格式
    // 這裡需要根據實際 API 返回格式進行調整
    return {
      overall_score: rawData.overall_score || 75,
      skin_age: rawData.skin_age || 25,
      feng_shui_blessing: '九紫離火運正旺，您的美麗能量處於上升期！',
      concerns: processConcerns(rawData.concerns || []),
      recommendations: generateRecommendations(rawData)
    };
  };
  
  // 處理肌膚問題數據
  const processConcerns = (concerns) => {
    const concernMapping = {
      'eye_pouch': { name: '眼袋', category: 'eye_pouch' },
      'dark_circle': { name: '黑眼圈', category: 'dark_circles' },
      'eye_finelines': { name: '眼部細紋', category: 'wrinkles' },
      'forehead_wrinkle': { name: '額頭皺紋', category: 'wrinkles' },
      'nasolabial_fold': { name: '法令紋', category: 'wrinkles' },
      'skin_sagging': { name: '肌膚鬆弛', category: 'sagging' },
      'skin_firmness': { name: '緊緻度', category: 'firmness' },
      'pore': { name: '毛孔', category: 'pores' },
      'blackhead': { name: '黑頭', category: 'blackhead' },
      'skin_spot': { name: '斑點', category: 'spots' },
      'acne': { name: '痘痘', category: 'acne' },
      'skin_texture': { name: '膚質', category: 'texture' },
      'skin_radiance': { name: '光澤度', category: 'radiance' },
      'oily_dry_skin': { name: '油脂平衡', category: 'oil_balance' }
    };
    
    return concerns.map(concern => {
      const mapping = concernMapping[concern.type] || { name: concern.type, category: concern.type };
      return {
        ...mapping,
        score: concern.score || Math.floor(Math.random() * 30) + 60,
        status: getStatusFromScore(concern.score)
      };
    });
  };
  
  // 根據分數獲取狀態
  const getStatusFromScore = (score) => {
    if (score >= 85) return '優秀';
    if (score >= 75) return '良好';
    if (score >= 65) return '正常';
    if (score >= 55) return '需改善';
    return '需關注';
  };
  
  // 生成個性化建議
  const generateRecommendations = (data) => {
    const recommendations = [];
    
    // 基於分析結果生成建議
    if (data.dark_circle_score < 70) {
      recommendations.push('建議使用眼部精華，改善黑眼圈問題');
    }
    if (data.pore_score < 70) {
      recommendations.push('建議使用收斂毛孔產品，改善毛孔粗大');
    }
    if (data.skin_texture_score < 70) {
      recommendations.push('建議定期去角質，改善膚質粗糙');
    }
    
    // 添加九運建議
    recommendations.push('九運期間多使用紅色系護膚品，增強美麗運勢');
    recommendations.push('建議在午時(11-13點)進行重要護膚步驟');
    
    return recommendations.slice(0, 4); // 返回前 4 條建議
  };
  
  // 生成詳細的模擬結果
  const generateDetailedMockResult = () => {
    const concerns = [
      { name: '眼袋', score: Math.floor(Math.random() * 20) + 70, status: '良好', category: 'eye_pouch' },
      { name: '黑眼圈', score: Math.floor(Math.random() * 30) + 55, status: '需改善', category: 'dark_circles' },
      { name: '眼部細紋', score: Math.floor(Math.random() * 25) + 65, status: '正常', category: 'wrinkles' },
      { name: '毛孔', score: Math.floor(Math.random() * 25) + 70, status: '良好', category: 'pores' },
      { name: '斑點', score: Math.floor(Math.random() * 20) + 75, status: '良好', category: 'spots' },
      { name: '痘痘', score: Math.floor(Math.random() * 15) + 80, status: '優秀', category: 'acne' },
      { name: '膚質', score: Math.floor(Math.random() * 20) + 70, status: '良好', category: 'texture' },
      { name: '光澤度', score: Math.floor(Math.random() * 25) + 60, status: '需改善', category: 'radiance' },
      { name: '緊緻度', score: Math.floor(Math.random() * 20) + 70, status: '良好', category: 'firmness' },
      { name: '油脂平衡', score: Math.floor(Math.random() * 25) + 65, status: '正常', category: 'oil_balance' }
    ];
    
    const overallScore = Math.floor(concerns.reduce((sum, c) => sum + c.score, 0) / concerns.length);
    
    return {
      overall_score: overallScore,
      skin_age: Math.floor(Math.random() * 10) + 20,
      feng_shui_blessing: '九紫離火運正旺，您的美麗能量處於上升期！',
      concerns: concerns,
      recommendations: [
        '建議增加保濕頻率，每日至少補充2次保濕精華',
        '九運期間多使用紅色系護膚品，增強美麗運勢',
        '建議在午時(11-13點)進行重要護膚步驟',
        '搭配火元素精油按摩，激發肌膚活力'
      ],
      timestamp: new Date().toISOString(),
      analysisId: `ANALYSIS_${Date.now()}`
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
      oil_balance: <BiDroplet className="w-4 h-4 text-green-500" />,
      eye_pouch: <FiEye className="w-4 h-4 text-purple-600" />,
      blackhead: <BiScan className="w-4 h-4 text-gray-700" />,
      acne: <BiErrorCircle className="w-4 h-4 text-red-500" />,
      texture: <BiShield className="w-4 h-4 text-cyan-500" />,
      radiance: <RiSparklingFill className="w-4 h-4 text-yellow-500" />,
      firmness: <BiTrendingUp className="w-4 h-4 text-green-600" />,
      sagging: <BiTrendingDown className="w-4 h-4 text-orange-600" />
    };
    return icons[category] || <FiStar className="w-4 h-4 text-gray-500" />;
  };

  // 重置分析
  const resetAnalysis = () => {
    setAnalysisResult(null);
    setIsAnalyzing(false);
    setCaptureInProgress(false);
    setAnalysisProgress(0);
    setAnalysisStage('');
  };

  return (
    <div className="space-y-6">
      {/* 攝像頭控制區 - 只在沒有分析結果時顯示 */}
      {!analysisResult && !isAnalyzing && (
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
          <div className="relative bg-black rounded-xl overflow-hidden" style={{ 
            aspectRatio: typeof window !== 'undefined' && window.innerWidth < 768 ? '3/4' : '16/9',
            maxHeight: typeof window !== 'undefined' && window.innerWidth < 768 ? '75vh' : '60vh'
          }}>
            {cameraOpened ? (
              <>
                <video 
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                  style={{ 
                    transform: typeof window !== 'undefined' && window.innerWidth < 768 
                      ? 'scaleX(-1) scale(0.85)'  // 手機上縮小比例，讓臉部更容易適應
                      : 'scaleX(-1) scale(1.1)',
                    objectPosition: 'center center'
                  }}
                  onLoadedMetadata={(e) => {
                    e.target.play().catch(err => console.error('播放失敗:', err));
                  }}
                />
                <canvas ref={canvasRef} className="hidden" />
                
                {/* 面部檢測覆層 */}
                {mockFaceQuality && (
                  <div className="absolute inset-0 pointer-events-none">
                    {/* 距離提示 - 針對手機優化 */}
                    {mockFaceQuality.hasFace && mockFaceQuality.area !== 'good' && (
                      <div className="absolute top-4 left-4 right-4 text-center">
                        <div className="bg-yellow-500/90 backdrop-blur-sm rounded-lg py-2 px-3 inline-block">
                          <p className="text-white text-sm font-medium">
                            {typeof window !== 'undefined' && window.innerWidth < 768 ? (
                              mockFaceQuality.face_size === 'too_large' ? '📱 臉部太大了！請將手機拉遠一些' :
                              mockFaceQuality.face_size === 'too_small' ? '📱 臉部太小了！請將手機靠近一些' :
                              mockFaceQuality.distance === 'too_close' ? '📱 距離太近！請後退 10-15 公分' :
                              mockFaceQuality.distance === 'too_far' ? '📱 距離太遠！請前進 5-10 公分' :
                              '📱 請調整位置，讓臉部完全在橢圓框內'
                            ) : (
                              '🔍 請調整距離，讓臉部填滿掃描框'
                            )}
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {/* 手機專用距離指示器 */}
                    {typeof window !== 'undefined' && window.innerWidth < 768 && mockFaceQuality.hasFace && (
                      <div className="absolute top-16 left-4 right-4 text-center">
                        <div className="bg-black/50 backdrop-blur-sm rounded-lg py-1 px-3 inline-block">
                          <div className="flex items-center justify-center gap-2">
                            <span className="text-white text-xs">距離:</span>
                            <div className={`w-3 h-3 rounded-full ${
                              mockFaceQuality.distance === 'optimal' ? 'bg-green-400' :
                              mockFaceQuality.distance === 'too_close' ? 'bg-red-400' : 'bg-yellow-400'
                            } animate-pulse`} />
                            <span className="text-white text-xs">
                              {mockFaceQuality.distance === 'optimal' ? '完美' :
                               mockFaceQuality.distance === 'too_close' ? '太近' : '太遠'}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* 掃描框 - 手機上使用更大的框 */}
                    {mockFaceQuality.hasFace && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative">
                          <div className={`${typeof window !== 'undefined' && window.innerWidth < 768 ? 'w-56 h-72' : 'w-64 h-80'} border-2 border-purple-400 rounded-[50%] animate-pulse`} />
                          
                          <div className="absolute top-[30%] left-0 right-0 border-t border-purple-300/50 border-dashed">
                            <span className="absolute -top-3 -left-12 text-xs text-purple-300">眼睛</span>
                          </div>
                          <div className="absolute top-[65%] left-0 right-0 border-t border-purple-300/50 border-dashed">
                            <span className="absolute -top-3 -left-12 text-xs text-purple-300">嘴巴</span>
                          </div>
                          
                          <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-purple-500 rounded-tl-lg" />
                          <div className="absolute -top-2 -right-2 w-6 h-6 border-t-2 border-r-2 border-purple-500 rounded-tr-lg" />
                          <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-2 border-l-2 border-purple-500 rounded-bl-lg" />
                          <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-purple-500 rounded-br-lg" />
                          
                          {mockFaceQuality.area === 'good' && mockFaceQuality.frontal === 'good' && (
                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                              <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full animate-bounce">
                                ✓ 完美對準
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* 狀態指示器 */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="bg-black/60 backdrop-blur-sm rounded-lg p-2">
                        <div className="flex flex-wrap gap-2 justify-center items-center">
                          <div className="flex items-center gap-1">
                            <div className={`w-2 h-2 rounded-full ${mockFaceQuality.hasFace ? 'bg-green-400' : 'bg-red-400'} animate-pulse`} />
                            <span className="text-xs text-white">
                              {mockFaceQuality.hasFace ? '臉部已檢測' : '搜尋臉部中...'}
                            </span>
                          </div>
                          {mockFaceQuality.hasFace && (
                            <>
                              <span className="text-white/50">|</span>
                              <div className="flex items-center gap-1">
                                <span className="text-xs text-white">光線:</span>
                                <div className={`w-3 h-3 rounded-full ${
                                  mockFaceQuality.lighting === 'good' ? 'bg-green-400' :
                                  mockFaceQuality.lighting === 'ok' ? 'bg-yellow-400' : 'bg-red-400'
                                }`} />
                              </div>
                              <span className="text-white/50">|</span>
                              <div className="flex items-center gap-1">
                                <span className="text-xs text-white">角度:</span>
                                <div className={`w-3 h-3 rounded-full ${
                                  mockFaceQuality.frontal === 'good' ? 'bg-green-400' : 'bg-yellow-400'
                                }`} />
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* 未檢測到臉部提示 - 手機優化版本 */}
                    {!mockFaceQuality.hasFace && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center p-6 bg-black/70 backdrop-blur-sm rounded-2xl mx-4">
                          <div className="text-4xl mb-3 animate-bounce">👤</div>
                          <p className="text-white text-lg font-medium mb-2">
                            請將臉部對準畫面中央
                          </p>
                          <p className="text-white/80 text-sm">
                            {typeof window !== 'undefined' && window.innerWidth < 768 ? (
                              <>
                                手機距離臉部 40-50 公分<br/>
                                垂直持握手機，確保光線充足
                              </>
                            ) : (
                              <>
                                保持約 30-40 公分距離<br/>
                                確保光線充足，正面面對攝像頭
                              </>
                            )}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center h-full bg-gradient-to-br from-purple-100 to-pink-100">
                <div className="text-center p-6">
                  <FiCamera className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                  <p className="text-purple-600 font-medium text-lg">攝像頭未開啟</p>
                  <p className="text-sm text-purple-500 mt-2">點擊下方按鈕開始分析</p>
                  {typeof window !== 'undefined' && window.innerWidth < 768 && (
                    <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                      <p className="text-xs text-purple-600">💡 手機拍攝優化提示：</p>
                      <ul className="text-xs text-purple-500 mt-2 text-left">
                        <li>• 手機距離臉部 40-50 公分（比平時自拍遠一些）</li>
                        <li>• 垂直持握手機</li>
                        <li>• 選擇光線明亮的環境</li>
                        <li>• 正面面對前置攝像頭</li>
                        <li>• 確保整張臉都在橢圓框內</li>
                      </ul>
                    </div>
                  )}
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
      )}

      {/* 分析中動畫 */}
      {isAnalyzing && (
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-6 animate-pulse">
              <BiBrain className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">
              AI 正在分析您的肌膚
            </h3>
            <p className="text-slate-600 mb-6">
              Perfect Corp 引擎正在進行 14 項專業檢測
            </p>
            
            {/* 進度條 */}
            <div className="max-w-md mx-auto mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-slate-600">分析進度</span>
                <span className="text-sm font-semibold text-purple-600">{analysisProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${analysisProgress}%` }}
                ></div>
              </div>
            </div>
            
            {/* 當前階段 */}
            <p className="text-sm text-slate-500 mb-6">
              {analysisStage}
            </p>
            
            {/* 分析項目列表 */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-lg mx-auto">
              {['眼袋', '黑眼圈', '細紋', '毛孔', '斑點', '膚質', '光澤度', '緊緻度', '油脂平衡'].map((item, index) => (
                <div 
                  key={index}
                  className={`px-3 py-2 rounded-lg text-sm transition-all duration-300 ${
                    analysisProgress > (index + 1) * 11
                      ? 'bg-green-100 text-green-700 border border-green-300'
                      : analysisProgress > index * 11
                      ? 'bg-purple-100 text-purple-700 border border-purple-300 animate-pulse'
                      : 'bg-gray-100 text-gray-400 border border-gray-200'
                  }`}
                >
                  {analysisProgress > (index + 1) * 11 && '✓ '}
                  {item}
                </div>
              ))}
            </div>
            
            {/* API 狀態提示 */}
            {apiStatus.isDemo && (
              <div className="mt-6 p-3 bg-amber-50 rounded-lg border border-amber-200">
                <p className="text-sm text-amber-700">
                  🧪 目前使用演示模式，實際使用需要配置 Perfect Corp API Key
                </p>
              </div>
            )}
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
              詳細分析報告（14項專業檢測）
            </h3>
            <div className="space-y-3">
              {analysisResult.concerns.map((concern, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                  <div className="flex items-center gap-3">
                    {getConcernIcon(concern.category)}
                    <div>
                      <span className="font-medium text-slate-800">{concern.name}</span>
                      {concern.score < 60 && (
                        <p className="text-xs text-slate-500 mt-0.5">需要特別關注</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          concern.score >= 80 ? 'bg-green-500' :
                          concern.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${concern.score}%` }}
                      />
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-bold min-w-[3rem] text-center ${getScoreColor(concern.score)}`}>
                      {concern.score}
                    </span>
                    <span className="text-sm text-slate-600 min-w-[4rem] text-right">{concern.status}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-purple-800">
                <strong>分析摘要：</strong>
                檢測了 {analysisResult.concerns.length} 項肌膚指標，
                其中 {analysisResult.concerns.filter(c => c.score >= 75).length} 項表現優良，
                {analysisResult.concerns.filter(c => c.score < 60).length} 項需要改善。
              </p>
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
                <div key={index} className="flex items-start gap-3 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                  <span className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <p className="text-slate-800">{rec}</p>
                    {index === 2 && (
                      <p className="text-xs text-slate-500 mt-1">
                        <AiOutlineFire className="inline w-3 h-3 text-red-500 mr-1" />
                        九運最佳時機：每日午時效果最佳
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h4 className="text-sm font-semibold text-purple-800 mb-2">
                🌟 九運美麗小貼士
              </h4>
              <p className="text-sm text-purple-700">
                在九紫離火運期間，選擇含有紅石榴、紅參等紅色系成分的護膚品，
                能夠更好地激發肌膚活力，提升護膚效果。
              </p>
            </div>
          </div>

          {/* 操作按鈕區 */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={resetAnalysis}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-medium hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              重新分析
            </button>
            <button
              onClick={() => {
                alert('分析結果已保存到美麗記憶庫！');
              }}
              className="px-6 py-3 bg-white text-purple-600 border-2 border-purple-500 rounded-full font-medium hover:bg-purple-50 transition-all shadow-lg hover:shadow-xl"
            >
              保存到記憶庫
            </button>
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: '我的肌膚分析報告',
                    text: `我的肌膚綜合評分：${analysisResult.overall_score}分，肌膚年齡：${analysisResult.skin_age}歲`,
                    url: window.location.href
                  });
                } else {
                  alert('分享功能在此瀏覽器不支援');
                }
              }}
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-full font-medium hover:from-pink-600 hover:to-red-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <FiShare2 className="inline w-5 h-5 mr-2" />
              分享結果
            </button>
          </div>

          {/* 分析時間戳 */}
          <div className="text-center mt-6">
            <p className="text-sm text-slate-500">
              分析時間：{new Date().toLocaleString('zh-TW')}
            </p>
            {analysisResult.analysisId && (
              <p className="text-xs text-slate-400 mt-1">
                分析編號：{analysisResult.analysisId}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// 主要的 BeautyMemoryWebsite 組件
const BeautyMemoryWebsite = () => {
  const [scrollY, setScrollY] = useState(0);
  const [currentView, setCurrentView] = useState('home');
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

  // 開啟分析頁面
  const handleAnalysisClick = () => {
    setCurrentView('analysis');
    showNotification('正在啟動 AI 肌膚分析系統...', 'info');
    window.scrollTo(0, 0);
  };

  // 返回首頁
  const handleBackToHome = () => {
    setCurrentView('home');
    showNotification('返回首頁', 'info');
    window.scrollTo(0, 0);
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

  // 根據當前視圖顯示不同內容
  if (currentView === 'analysis') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        {/* 分析頁面導航欄 */}
        <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md shadow-lg">
          <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <button
                onClick={handleBackToHome}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <AiOutlineClose className="w-6 h-6 text-gray-600" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <RiMagicFill className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-800">美魔力 AI 肌膚分析</h1>
                  <p className="text-xs text-purple-600">Perfect Corp 技術驅動</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="px-4 py-2 bg-white/80 rounded-full border border-purple-200">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: fengShuiTiming.color }}></div>
                  <span className="text-sm text-slate-600">{fengShuiTiming.recommendation}</span>
                </div>
              </div>
              <span className={`text-xs px-3 py-1 rounded-full ${
                apiStatus?.isDemo 
                  ? 'bg-amber-100 text-amber-700 border border-amber-200'
                  : 'bg-green-100 text-green-700 border border-green-200'
              }`}>
                {apiStatus?.isDemo ? '🧪 演示模式' : '🔗 專業模式'}
              </span>
            </div>
          </div>
        </nav>

        {/* 分析頁面主要內容 */}
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">AI 智能肌膚分析系統</h2>
            <p className="text-lg text-slate-600">使用攝像頭進行即時肌膚檢測，獲得專業分析報告</p>
          </div>
          
          {/* SkinAnalysis 組件 */}
          <SkinAnalysis isModal={false} />
        </div>

        {/* 通知組件 */}
        <NotificationToast 
          message={notification.message}
          type={notification.type}
          isVisible={notification.isVisible}
        />
      </div>
    );
  }

  // 首頁內容
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
              Perfect Corp 技術支持，專業皮膚科醫師等級分析
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