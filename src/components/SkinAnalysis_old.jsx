import React, { useState, useRef, useCallback, useEffect } from 'react';
import { 
  BiCamera, 
  BiUpload, 
  BiX, 
  BiCheckCircle,
  BiHeart,
  BiTrendingUp,
  BiDownload,
  BiInfoCircle,
  BiVideoRecording
} from 'react-icons/bi';
import { FiStar, FiAlertCircle } from 'react-icons/fi';

/**
 * 肌膚分析項目的中文對照表
 */
const SKIN_ANALYSIS_LABELS = {
  pores_left_cheek: '左臉頰毛孔',
  pores_right_cheek: '右臉頰毛孔',
  pores_forehead: '額頭毛孔',
  pores_jaw: '下顎毛孔',
  nasolabial_fold: '法令紋',
  eye_pouch: '眼袋',
  forehead_wrinkle: '抬頭紋',
  eye_finelines: '眼周細紋',
  dark_circle: '黑眼圈',
  crows_feet: '魚尾紋',
  glabella_wrinkle: '眉間紋',
  skin_spot: '色斑',
  acne: '痘痘',
  blackhead: '黑頭',
  mole: '痣',
  skin_type: '膚質',
  left_eyelids: '左眼皮',
  right_eyelids: '右眼皮'
};

/**
 * 根據 value 值評估狀態
 */
const getStatusByValue = (value) => {
  if (value === 0) return { text: '優秀', color: 'text-green-600', bgColor: 'bg-green-50', icon: '✓' };
  if (value === 1) return { text: '輕微', color: 'text-yellow-600', bgColor: 'bg-yellow-50', icon: '!' };
  if (value === 2) return { text: '中度', color: 'text-orange-600', bgColor: 'bg-orange-50', icon: '!!' };
  return { text: '需改善', color: 'text-red-600', bgColor: 'bg-red-50', icon: '!!!' };
};

/**
 * 根據 confidence 評估可信度
 */
const getConfidenceLevel = (confidence) => {
  if (confidence >= 0.9) return '高';
  if (confidence >= 0.7) return '中';
  return '低';
};

/**
 * 計算整體評分
 */
const calculateOverallScore = (analysisData) => {
  if (!analysisData || typeof analysisData !== 'object') return 75;
  
  const entries = Object.entries(analysisData);
  if (entries.length === 0) return 75;
  
  let totalScore = 0;
  let count = 0;
  
  entries.forEach(([key, data]) => {
    if (data && typeof data === 'object' && data.value !== undefined) {
      const score = Math.max(0, 100 - (data.value * 20));
      totalScore += score;
      count++;
    }
  });
  
  return count > 0 ? Math.round(totalScore / count) : 75;
};

/**
 * 估算肌膚年齡
 */
const estimateSkinAge = (analysisData, realAge = 30) => {
  if (!analysisData) return realAge;
  
  const wrinkleKeys = ['nasolabial_fold', 'forehead_wrinkle', 'eye_finelines', 'crows_feet', 'glabella_wrinkle'];
  const ageingKeys = ['eye_pouch', 'dark_circle', 'skin_spot'];
  
  let wrinkleScore = 0;
  let ageingScore = 0;
  let wrinkleCount = 0;
  let ageingCount = 0;
  
  Object.entries(analysisData).forEach(([key, data]) => {
    if (data && typeof data === 'object' && data.value !== undefined) {
      if (wrinkleKeys.includes(key)) {
        wrinkleScore += data.value;
        wrinkleCount++;
      }
      if (ageingKeys.includes(key)) {
        ageingScore += data.value;
        ageingCount++;
      }
    }
  });
  
  const avgWrinkle = wrinkleCount > 0 ? wrinkleScore / wrinkleCount : 0;
  const avgAgeing = ageingCount > 0 ? ageingScore / ageingCount : 0;
  
  const adjustment = (avgWrinkle * 3) + (avgAgeing * 2);
  
  return Math.max(18, Math.round(realAge + adjustment));
};

/**
 * 生成個人化建議
 */
const generateRecommendations = (analysisData) => {
  const recommendations = [];
  
  if (!analysisData || typeof analysisData !== 'object') {
    return ['建議定期進行肌膚檢測,追蹤肌膚狀態變化'];
  }
  
  const poresIssues = ['pores_left_cheek', 'pores_right_cheek', 'pores_forehead', 'pores_jaw']
    .filter(key => analysisData[key]?.value >= 1);
  if (poresIssues.length > 0) {
    recommendations.push('建議使用含有菸鹼酸或水楊酸的產品收斂毛孔,避免過度清潔');
  }
  
  const wrinkleIssues = ['nasolabial_fold', 'forehead_wrinkle', 'crows_feet', 'glabella_wrinkle']
    .filter(key => analysisData[key]?.value >= 1);
  if (wrinkleIssues.length > 0) {
    recommendations.push('建議使用含有維他命 A (視黃醇) 或胜肽成分的抗老產品');
  }
  
  if (analysisData.eye_pouch?.value >= 1 || analysisData.dark_circle?.value >= 1) {
    recommendations.push('建議使用眼霜加強眼周保養,保持充足睡眠,可搭配眼部按摩');
  }
  
  if (analysisData.skin_spot?.value >= 1) {
    recommendations.push('建議使用含有維他命 C 或傳明酸的美白精華,並加強防曬 (SPF 50+)');
  }
  
  if (analysisData.acne?.value >= 1 || analysisData.blackhead?.value >= 1) {
    recommendations.push('建議使用含有水楊酸的產品控油抗痘,保持臉部清潔但避免過度清潔');
  }
  
  recommendations.push('每日使用 SPF 30 以上的防曬產品,預防光老化');
  recommendations.push('保持規律作息和充足睡眠,有助於肌膚自我修復');
  recommendations.push('均衡飲食,多攝取富含抗氧化物的蔬果');
  
  return recommendations;
};

/**
 * AI 肌膚檢測組件 - 即時相機檢測模式
 */
const SkinAnalysis = () => {
  // 使用環境變數或預設值
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://beautymemory-6a58c48154f4.herokuapp.com';
  
  // 相機模式狀態
  const [cameraMode, setCameraMode] = useState(true); // true: 相機模式, false: 上傳模式
  const [cameraActive, setCameraActive] = useState(false);
  const [stream, setStream] = useState(null);
  
  // 即時檢測狀態
  const [lightingStatus, setLightingStatus] = useState({ status: 'checking', text: '檢測中' });
  const [angleStatus, setAngleStatus] = useState({ status: 'checking', text: '檢測中' });
  const [distanceStatus, setDistanceStatus] = useState({ status: 'checking', text: '檢測中' });
  const [faceDetected, setFaceDetected] = useState(false);
  
  // 上傳模式狀態
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  
  // 共用狀態
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);
  const [showAllDetails, setShowAllDetails] = useState(false);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const detectionIntervalRef = useRef(null);

  // 清理相機資源
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // 開啟相機
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setCameraActive(true);
        setError(null);
        
        // 開始即時檢測
        startRealTimeDetection();
      }
    } catch (err) {
      setError('無法開啟相機，請確認瀏覽器權限設定');
      console.error('Camera error:', err);
    }
  };

  // 停止相機
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
    stopRealTimeDetection();
  };

  // 開始即時檢測
  const startRealTimeDetection = () => {
    detectionIntervalRef.current = setInterval(() => {
      detectFaceQuality();
    }, 500);
  };

  // 停止即時檢測
  const stopRealTimeDetection = () => {
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }
  };

  // 檢測臉部品質（模擬）
  const detectFaceQuality = () => {
    // 實際應用中這裡會使用 face-api.js 或類似庫進行真實檢測
    // 這裡使用模擬數據
    
    const hasGoodLighting = Math.random() > 0.2;
    const hasGoodAngle = Math.random() > 0.3;
    const hasGoodDistance = Math.random() > 0.25;
    
    setLightingStatus(
      hasGoodLighting 
        ? { status: 'good', text: 'Ok' }
        : { status: 'warning', text: '請移至光線充足處' }
    );
    
    setAngleStatus(
      hasGoodAngle
        ? { status: 'good', text: 'Good' }
        : { status: 'warning', text: '請保持正面' }
    );
    
    setDistanceStatus(
      hasGoodDistance
        ? { status: 'good', text: '距離適中' }
        : { status: 'warning', text: 'Come Closer' }
    );
    
    setFaceDetected(hasGoodLighting && hasGoodAngle && hasGoodDistance);
  };

  // 拍照並分析
  const captureAndAnalyze = async () => {
    if (!videoRef.current || !canvasRef.current) {
      setError('相機未就緒');
      return;
    }

    // 捕獲當前畫面
    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);
    
    // 轉換為 Blob
    canvas.toBlob(async (blob) => {
      if (!blob) {
        setError('無法捕獲影像');
        return;
      }

      // 轉換為 File 對象
      const file = new File([blob], 'capture.jpg', { type: 'image/jpeg' });
      
      // 驗證圖片
      await validateAndAnalyze(file);
    }, 'image/jpeg', 0.95);
  };

  // 驗證並分析圖片
  const validateAndAnalyze = async (file) => {
    // 檢查檔案大小
    if (file.size > 5 * 1024 * 1024) {
      setError('圖片檔案不能超過 5MB');
      return;
    }

    // 檢查解析度
    const img = new Image();
    const reader = new FileReader();
    
    reader.onload = (e) => {
      img.onload = async () => {
        const width = img.width;
        const height = img.height;
        
        if (width < 200 || height < 200) {
          setError(`圖片解析度過低 (${width}x${height})，最小需要 200x200 像素`);
          return;
        }
        
        if (width > 4096 || height > 4096) {
          setError(`圖片解析度過高 (${width}x${height})，最大支援 4096x4096 像素`);
          return;
        }
        
        // 驗證通過，開始分析
        await analyzeImage(file);
      };
      
      img.src = e.target.result;
    };
    
    reader.readAsDataURL(file);
  };

  // 切換模式
  const switchMode = () => {
    if (cameraMode) {
      stopCamera();
    }
    setCameraMode(!cameraMode);
    setError(null);
    setAnalysisResult(null);
  };

  // 上傳模式的文件處理
  const handleFileSelect = useCallback((event) => {
    const file = event.target.files[0];
    if (file) processFile(file);
  }, []);

  const handleDrop = useCallback((event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.match('image/(jpeg|jpg)')) {
      processFile(file);
    } else {
      setError('請上傳 JPG 或 JPEG 格式的圖片');
    }
  }, []);

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
  }, []);

  const processFile = (file) => {
    // AILabTools 要求：僅支援 JPG/JPEG 格式
    if (!file.type.match('image/(jpeg|jpg)')) {
      setError('請上傳 JPG 或 JPEG 格式的圖片（不支援 PNG）');
      return;
    }
    
    // AILabTools 要求：檔案大小不超過 5MB
    if (file.size > 5 * 1024 * 1024) {
      setError('圖片檔案不能超過 5MB');
      return;
    }

    // 驗證圖片解析度（200x200 到 4096x4096）
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const width = img.width;
        const height = img.height;
        
        // AILabTools 要求：最小解析度 200x200
        if (width < 200 || height < 200) {
          setError(`圖片解析度過低 (${width}x${height})，最小需要 200x200 像素`);
          return;
        }
        
        // AILabTools 要求：最大解析度 4096x4096
        if (width > 4096 || height > 4096) {
          setError(`圖片解析度過高 (${width}x${height})，最大支援 4096x4096 像素`);
          return;
        }
        
        // 檢查通過，設置圖片
        setSelectedImage(file);
        setError(null);
        setAnalysisResult(null);
        setPreviewUrl(e.target.result);
      };
      
      img.onerror = () => {
        setError('無法讀取圖片，請確認檔案是否完整');
      };
      
      img.src = e.target.result;
    };
    
    reader.onerror = () => {
      setError('讀取檔案失敗，請重試');
    };
    
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    setAnalysisResult(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const analyzeImage = async () => {
  if (!selectedImage) {
    setError('請先上傳照片');
    return;
  }

  setIsAnalyzing(true);
  setError(null);
  setAnalysisProgress(0);

  try {
    const progressInterval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 300);

    const formData = new FormData();
    formData.append('image', selectedImage);

    console.log('📤 發送請求到:', `${API_BASE_URL}/api/analyze`);
    console.log('📷 圖片檔案:', selectedImage.name, selectedImage.type, selectedImage.size);

    const response = await fetch(`${API_BASE_URL}/api/analyze`, {
      method: 'POST',
      body: formData,
      // 不要手動設置 Content-Type，讓瀏覽器自動處理 multipart/form-data
    });

    clearInterval(progressInterval);
    setAnalysisProgress(100);

    console.log('📥 回應狀態:', response.status, response.statusText);

    if (!response.ok) {
      // 嘗試讀取錯誤詳情
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      try {
        const errorData = await response.json();
        console.error('❌ 伺服器錯誤詳情:', errorData);
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch (e) {
        const errorText = await response.text();
        console.error('❌ 伺服器回應文本:', errorText);
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('✅ API 完整回應:', data);

    if (data.success) {
      console.log('✅ API 回應結構:', {
        hasAnalysis: !!data.data?.analysis,
        hasSummary: !!data.data?.summary,
        summaryKeys: data.data?.summary ? Object.keys(data.data.summary) : []
      });

      // 優先使用後端返回的 summary 數據
      let overall_score, skin_age, rawAnalysis, recommendations;

      if (data.data?.summary) {
        // 使用後端計算好的摘要數據
        console.log('✅ 使用後端 summary 數據');
        overall_score = data.data.summary.overall_score;
        skin_age = data.data.summary.skin_age;
        
        // 處理 recommendations - 轉換對象數組為字符串數組
        const backendRecs = data.data.summary.recommendations || [];
        if (backendRecs.length > 0 && typeof backendRecs[0] === 'object') {
          recommendations = backendRecs.map(rec => rec.suggestion || rec.issue);
        } else {
          recommendations = backendRecs;
        }
        
        rawAnalysis = data.data.analysis?.result || {};
        
        console.log('後端 summary:', {
          overall_score,
          skin_age,
          recommendations_count: recommendations.length
        });
      } else {
        // 後備方案：使用前端計算
        console.log('⚠️ 無 summary，使用前端計算');
        rawAnalysis = data.data?.analysis?.result || data.data?.result || data.data?.analysis || {};
        overall_score = calculateOverallScore(rawAnalysis);
        skin_age = estimateSkinAge(rawAnalysis);
        recommendations = generateRecommendations(rawAnalysis);
      }
      
      console.log('原始分析數據:', rawAnalysis);
      console.log('最終數據:', { overall_score, skin_age });
      
      const processedData = {
        overall_score: overall_score,
        skin_age: skin_age,
        analysis: rawAnalysis,
        recommendations: recommendations,
        face_rectangle: data.data?.face_rectangle || data.data?.analysis?.face_rectangle,
        raw_data: data.data
      };
      
      console.log('處理後的數據:', processedData);
      console.log('分析項目列表:', Object.keys(processedData.analysis));
      setAnalysisResult(processedData);
    } else {
      throw new Error(data.error || '分析失敗');
    }

  } catch (err) {
    let userFriendlyMessage = '分析過程發生錯誤，請重試';
    
    if (err.message.includes('400')) {
      userFriendlyMessage = '圖片格式不正確或檔案損壞，請選擇其他照片';
    } else if (err.message.includes('401') || err.message.includes('403')) {
      userFriendlyMessage = 'API 認證失敗，請聯繫系統管理員';
    } else if (err.message.includes('500')) {
      userFriendlyMessage = '伺服器暫時無法處理，請稍後再試';
    } else if (err.message.includes('Failed to fetch') || err.message.includes('Network')) {
      userFriendlyMessage = '網路連線失敗，請檢查網路狀態';
    }
    
    setError(userFriendlyMessage);
  } finally {
    setIsAnalyzing(false);
    setAnalysisProgress(0);
  }
};

  const downloadReport = () => {
    if (!analysisResult) return;

    const reportContent = generateReportText(analysisResult);
    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `美魔力肌膚檢測報告_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const generateReportText = (data) => {
    const date = new Date().toLocaleString('zh-TW');
    
    let report = `
========================================
美魔力 AI 肌膚檢測報告
========================================

檢測日期: ${date}
整體評分: ${data.overall_score} 分
肌膚年齡: ${data.skin_age} 歲

----------------------------------------
詳細分析結果
----------------------------------------

`;

    Object.entries(data.analysis).forEach(([key, value]) => {
      const label = SKIN_ANALYSIS_LABELS[key] || key;
      if (value && typeof value === 'object') {
        const status = getStatusByValue(value.value);
        const confidence = (value.confidence * 100).toFixed(1);
        report += `${label}: ${status.text} (可信度: ${confidence}%)\n`;
      }
    });

    report += `
----------------------------------------
個人化保養建議
----------------------------------------

`;

    data.recommendations.forEach((rec, index) => {
      report += `${index + 1}. ${rec}\n`;
    });

    report += `
----------------------------------------
本報告由美魔力 AI 肌膚檢測系統自動生成
僅供參考,不構成醫療建議

© 2025 美魔力 Beauty Memory
========================================
    `;

    return report;
  };

  const getScoreDescription = (score) => {
    if (score >= 85) return { text: '優秀!您的肌膚狀態非常好', color: 'text-green-600' };
    if (score >= 70) return { text: '良好!持續保持就能更上一層樓', color: 'text-blue-600' };
    if (score >= 55) return { text: '一般,建議加強日常保養', color: 'text-yellow-600' };
    return { text: '需要改善,請參考以下建議', color: 'text-red-600' };
  };

  const categorizeAnalysis = (analysis) => {
    const categories = {
      毛孔: ['pores_left_cheek', 'pores_right_cheek', 'pores_forehead', 'pores_jaw'],
      皺紋: ['nasolabial_fold', 'forehead_wrinkle', 'eye_finelines', 'crows_feet', 'glabella_wrinkle'],
      眼周: ['eye_pouch', 'dark_circle', 'left_eyelids', 'right_eyelids'],
      色素: ['skin_spot', 'mole'],
      痘痘: ['acne', 'blackhead'],
      其他: ['skin_type']
    };

    const result = {};
    Object.entries(categories).forEach(([category, keys]) => {
      result[category] = keys
        .filter(key => analysis[key])
        .map(key => ({
          key,
          label: SKIN_ANALYSIS_LABELS[key],
          data: analysis[key]
        }));
    });

    return result;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* 頁首 */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent mb-4">
          AI 智慧肌膚檢測
        </h1>
        <p className="text-xl text-slate-600 mb-6">
          運用尖端科技,洞察肌膚真實狀態
        </p>

        <div className="max-w-3xl mx-auto bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-200 mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <FiStar className="w-6 h-6 text-red-500" />
            <h3 className="text-xl font-semibold text-red-800">九紫離火運與美麗新契機</h3>
          </div>
          <p className="text-slate-700 leading-relaxed">
            從 2024 年開始,我們進入「九紫離火運」時代,這是一個強調光明、智慧與美學的二十年週期。
            透過科技了解自己的肌膚,正是順應時代能量,以智慧之光照亮美麗之路的最佳體現。
          </p>
        </div>
      </div>

      {/* 上傳區域 */}
      {!analysisResult && (
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-purple-100">
          <h2 className="text-2xl font-semibold text-center mb-6 text-slate-800">
            開始您的肌膚檢測之旅
          </h2>
          <p className="text-center text-slate-600 mb-4">
            請上傳清晰的正面肌膚照片，光線充足效果更佳
          </p>
          <div className="text-center text-sm text-slate-500 mb-6 space-y-1">
            <p>📋 圖片要求：JPG/JPEG 格式，最大 5MB</p>
            <p>📐 解析度：200x200 至 4096x4096 像素</p>
            <p>👤 建議臉部像素大於 400px，正面角度（偏轉 ≤ ±30°，俯仰 ≤ ±40°）</p>
          </div>

          {!previewUrl ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="border-3 border-dashed border-purple-300 rounded-xl p-12 text-center cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-all"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg"
                onChange={handleFileSelect}
                className="hidden"
              />
              <BiUpload className="w-16 h-16 mx-auto text-purple-400 mb-4" />
              <p className="text-lg text-slate-700 mb-2">
                點擊上傳照片或拖曳檔案至此
              </p>
              <p className="text-sm text-slate-500">
                僅支援 JPG/JPEG 格式，檔案大小 ≤ 5MB
              </p>
            </div>
          ) : (
            <div className="relative">
              <img
                src={previewUrl}
                alt="預覽"
                className="w-full max-w-md mx-auto rounded-xl shadow-lg"
              />
              <button
                onClick={removeImage}
                className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
              >
                <BiX className="w-6 h-6" />
              </button>
            </div>
          )}

          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center gap-2">
              <FiAlertCircle className="w-5 h-5" />
              {error}
            </div>
          )}

          {previewUrl && !isAnalyzing && (
            <button
              onClick={analyzeImage}
              className="mt-8 w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold text-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <BiCamera className="w-6 h-6" />
              開始分析
            </button>
          )}

          {isAnalyzing && (
            <div className="mt-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
              <p className="text-lg text-slate-700 mb-2">AI 正在深度分析您的肌膚...</p>
              <p className="text-sm text-slate-500">這可能需要 10-30 秒</p>
              <div className="mt-4 max-w-md mx-auto">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${analysisProgress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 分析結果 */}
      {analysisResult && !isAnalyzing && (
        <div className="space-y-6">
          {/* 總體評分 */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-8 text-white shadow-xl">
            <h2 className="text-2xl font-semibold mb-4 text-center">
              您的肌膚檢測報告
            </h2>
            <div className="text-center">
              <div className="text-6xl font-bold mb-2">
                {analysisResult.overall_score}
              </div>
              <div className="text-xl mb-4">整體評分</div>
              <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-6 py-2">
                <p className="text-lg">
                  {getScoreDescription(analysisResult.overall_score).text}
                </p>
              </div>
            </div>
          </div>

          {/* 肌膚年齡 */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-slate-800">
              <BiHeart className="w-6 h-6 text-pink-500" />
              肌膚年齡
            </h3>
            <div className="text-center">
              <span className="text-5xl font-bold text-purple-600">
                {analysisResult.skin_age}
              </span>
              <span className="text-2xl text-slate-600 ml-2">歲</span>
            </div>
          </div>

          {/* 詳細分析 */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-slate-800">
                📊 詳細分析結果
              </h3>
              <button
                onClick={() => setShowAllDetails(!showAllDetails)}
                className="text-purple-600 hover:text-purple-700 text-sm flex items-center gap-1"
              >
                <BiInfoCircle className="w-4 h-4" />
                {showAllDetails ? '顯示摘要' : '查看全部'}
              </button>
            </div>

            {(() => {
              const categorized = categorizeAnalysis(analysisResult.analysis);
              console.log('分類後的數據:', categorized);
              
              // 計算總項目數
              const totalItems = Object.values(categorized).reduce((sum, items) => sum + items.length, 0);
              console.log('總項目數:', totalItems);
              
              // 如果沒有任何項目,顯示提示
              if (totalItems === 0) {
                return (
                  <div className="text-center py-8 text-slate-500">
                    <p>暫無詳細分析數據</p>
                    <p className="text-sm mt-2">請重新上傳照片進行檢測</p>
                  </div>
                );
              }
              
              return (
                <div className="space-y-6">
                  {Object.entries(categorized).map(([category, items]) => {
                    if (items.length === 0) return null;
                    
                    // 檢查是否有需要注意的項目
                    const hasIssues = items.some(item => item.data?.value >= 1);
                    const issueCount = items.filter(item => item.data?.value >= 1).length;
                    
                    // 在摘要模式下,如果沒有問題則跳過此分類
                    if (!showAllDetails && !hasIssues) return null;
                    
                    return (
                      <div key={category} className="border-l-4 border-purple-300 pl-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-slate-700">{category}</h4>
                          {!showAllDetails && issueCount > 0 && (
                            <span className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
                              {issueCount} 項需注意
                            </span>
                          )}
                        </div>
                        <div className="grid md:grid-cols-2 gap-3">
                          {items.map(item => {
                            const status = getStatusByValue(item.data.value);
                            const confidence = getConfidenceLevel(item.data.confidence);
                            
                            // 在摘要模式下,只顯示有問題的項目
                            if (!showAllDetails && item.data.value === 0) return null;
                            
                            return (
                              <div
                                key={item.key}
                                className={`${status.bgColor} rounded-lg p-3 border border-gray-200`}
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-sm font-medium text-slate-700">
                                    {item.label}
                                  </span>
                                  <span className={`text-lg ${status.color} font-bold`}>
                                    {status.icon}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                  <span className={`${status.color} font-semibold`}>
                                    {status.text}
                                  </span>
                                  <span className="text-slate-500">
                                    可信度: {confidence}
                                  </span>
                                </div>
                                {showAllDetails && (
                                  <div className="mt-2 text-xs text-slate-500">
                                    信心值: {(item.data.confidence * 100).toFixed(1)}%
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                  
                  {/* 如果摘要模式下沒有任何需要注意的項目 */}
                  {!showAllDetails && 
                   Object.values(categorized).every(items => 
                     items.every(item => item.data?.value === 0)
                   ) && (
                    <div className="text-center py-8">
                      <div className="text-6xl mb-4">🎉</div>
                      <p className="text-lg font-semibold text-green-600 mb-2">
                        恭喜!您的肌膚狀態非常好
                      </p>
                      <p className="text-slate-600">
                        所有檢測項目都處於優秀狀態
                      </p>
                      <button
                        onClick={() => setShowAllDetails(true)}
                        className="mt-4 text-purple-600 hover:text-purple-700 text-sm"
                      >
                        點擊查看詳細數據
                      </button>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>

          {/* 建議事項 */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 shadow-lg border border-yellow-200">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-slate-800">
              <BiTrendingUp className="w-6 h-6 text-orange-500" />
              💡 個人化保養建議
            </h3>
            <div className="space-y-3">
              {analysisResult.recommendations.map((rec, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 bg-white rounded-lg p-4"
                >
                  <BiCheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <p className="text-slate-700">{rec}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 動作按鈕 */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={removeImage}
              className="px-8 py-3 bg-white border-2 border-purple-500 text-purple-600 rounded-full font-semibold hover:bg-purple-50 transition-colors"
            >
              重新檢測
            </button>
            <button
              onClick={downloadReport}
              className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <BiDownload className="w-5 h-5" />
              儲存報告
            </button>
          </div>
        </div>
      )}

      {/* 說明區塊 */}
      <div className="mt-12 grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg text-center border border-purple-100">
          <div className="text-4xl mb-3">🔒</div>
          <h3 className="font-semibold text-slate-800 mb-2">隱私保護</h3>
          <p className="text-sm text-slate-600">
            照片僅用於分析,24 小時後自動刪除
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-lg text-center border border-pink-100">
          <div className="text-4xl mb-3">⚡</div>
          <h3 className="font-semibold text-slate-800 mb-2">快速準確</h3>
          <p className="text-sm text-slate-600">
            30 秒內完成分析,準確度媲美專業診所
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-lg text-center border border-red-100">
          <div className="text-4xl mb-3">📱</div>
          <h3 className="font-semibold text-slate-800 mb-2">隨時隨地</h3>
          <p className="text-sm text-slate-600">
            手機、平板、電腦都可使用
          </p>
        </div>
      </div>

      {/* 免責聲明 */}
      <div className="mt-8 text-center text-sm text-slate-500">
        <p>本系統僅供參考,不構成醫療建議。如有嚴重肌膚問題請諮詢專業皮膚科醫師。</p>
        <p className="mt-2">© 2025 美魔力 Beauty Memory. 讓科技與美麗共振,啟動肌膚的魔力!</p>
      </div>
    </div>
  );
};

export default SkinAnalysis;