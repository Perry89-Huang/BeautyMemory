import React, { useState, useRef, useCallback, useEffect } from 'react';
import { 
  BiCamera, 
  BiUpload, 
  BiX, 
  BiCheckCircle,
  BiHeart,
  BiTrendingUp,
  BiDownload,
  BiInfoCircle
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
  right_eyelids: '右眼皮',
  skin_color: '膚色',
  closed_comedones: '閉口粉刺',
  skintone_ita: '膚色 ITA 值',
  skin_hue_ha: '膚色 HA 值',
  eye_pouch_severity: '眼袋嚴重度',
  nasolabial_fold_severity: '法令紋嚴重度',
  sensitivity: '敏感度'
};

/**
 * 獲取膚質標籤
 */
const getSkinTypeLabel = (type) => {
  const types = ['油性肌膚', '乾性肌膚', '中性肌膚', '混合性肌膚'];
  return types[type] || '未知';
};

/**
 * 獲取膚色標籤
 */
const getSkinColorLabel = (color) => {
  const colors = ['白皙', '黃調', '棕調', '黑調'];
  return colors[color] || '未知';
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
  const [lightingStatus, setLightingStatus] = useState({ status: 'checking', text: '檢測中', color: 'gray' });
  const [distanceStatus, setDistanceStatus] = useState({ status: 'checking', text: '檢測中', color: 'gray' });
  const [faceDetected, setFaceDetected] = useState(false);
  const [greenStatusTime, setGreenStatusTime] = useState(0);
  const [autoCapturing, setAutoCapturing] = useState(false);
  
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
  
  // Refs for tracking state inside intervals
  const isAnalyzingRef = useRef(false);
  const autoCapturingRef = useRef(false);

  // Sync refs with state
  useEffect(() => {
    isAnalyzingRef.current = isAnalyzing;
  }, [isAnalyzing]);

  useEffect(() => {
    autoCapturingRef.current = autoCapturing;
  }, [autoCapturing]);

  // 清理相機資源
  useEffect(() => {
    return () => {
      stopCamera();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 停止相機
  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
    setFaceDetected(false);
    setLightingStatus({ status: 'checking', text: '檢測中', color: 'gray' });
    setDistanceStatus({ status: 'checking', text: '檢測中', color: 'gray' });
    setGreenStatusTime(0);
    setAutoCapturing(false);
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }
  }, [stream]);

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
    }
  };

  // 開始即時檢測
  const startRealTimeDetection = () => {
    detectionIntervalRef.current = setInterval(() => {
      detectFaceQuality();
    }, 1000); // 從 500ms 改為 1000ms，減少更新頻率
  };

  // 檢測臉部品質（基於視訊畫面分析）
  const detectFaceQuality = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // 確保視訊已載入
    if (video.readyState !== video.HAVE_ENOUGH_DATA) return;
    
    // 設置 canvas 尺寸為較小的採樣尺寸以提升性能
    const sampleWidth = 160;
    const sampleHeight = 120;
    canvas.width = sampleWidth;
    canvas.height = sampleHeight;
    
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, sampleWidth, sampleHeight);
    
    try {
      const imageData = ctx.getImageData(0, 0, sampleWidth, sampleHeight);
      const data = imageData.data;
      
      // 1. 光線檢測：分析臉部區域的光線品質
      // 定義橢圓參數（對應 UI 上的白色橢圓框）
      const centerX = sampleWidth / 2;
      const centerY = sampleHeight / 2;
      const radiusX = sampleWidth * 0.35; // 橢圓水平半徑
      const radiusY = sampleHeight * 0.48; // 橢圓垂直半徑
      
      let ovalPixelCount = 0;
      let ovalContentPixels = 0;
      let ovalBrightnessSum = 0;
      let ovalBrightnessCount = 0;
      let overexposedPixels = 0;
      let underexposedPixels = 0;
      
      // 分析橢圓內的像素（同時進行光線和臉部位置檢測）
      for (let y = 0; y < sampleHeight; y++) {
        for (let x = 0; x < sampleWidth; x++) {
          // 檢查點是否在橢圓內
          const normalizedX = (x - centerX) / radiusX;
          const normalizedY = (y - centerY) / radiusY;
          const isInOval = (normalizedX * normalizedX + normalizedY * normalizedY) <= 1;
          
          if (isInOval) {
            ovalPixelCount++;
            const idx = (y * sampleWidth + x) * 4;
            const r = data[idx];
            const g = data[idx + 1];
            const b = data[idx + 2];
            const brightness = (0.299 * r + 0.587 * g + 0.114 * b);
            
            // 累計亮度用於光線檢測
            ovalBrightnessSum += brightness;
            ovalBrightnessCount++;
            
            // 檢測過曝和欠曝
            if (brightness > 230) {
              overexposedPixels++;
            } else if (brightness < 30) {
              underexposedPixels++;
            }
            
            // 檢測是否有實質內容（非純黑或純白背景）
            // 膚色範圍大致在 RGB 中偏暖色調，亮度適中
            const isLikelyFace = brightness > 60 && brightness < 220 && 
                                 r > 80 && g > 60 && b > 50 && 
                                 r > b; // 膚色紅色分量通常大於藍色
            
            if (isLikelyFace) {
              ovalContentPixels++;
            }
          }
        }
      }
      
      // 計算橢圓內的平均亮度
      const ovalAvgBrightness = ovalBrightnessCount > 0 ? ovalBrightnessSum / ovalBrightnessCount : 0;
      const lightingScore = ovalAvgBrightness / 255; // 標準化到 0-1
      
      // 計算過曝/欠曝比例
      const overexposureRatio = ovalPixelCount > 0 ? overexposedPixels / ovalPixelCount : 0;
      const underexposureRatio = ovalPixelCount > 0 ? underexposedPixels / ovalPixelCount : 0;
      
      // 光線評估（優化版）：考慮亮度和曝光問題
      let newLightingStatus;
      
      // 檢查過曝問題（超過 20% 像素過曝）
      if (overexposureRatio > 0.2) {
        newLightingStatus = { status: 'bad', text: '光線過強', color: 'red' };
      }
      // 檢查欠曝問題（超過 30% 像素欠曝）
      else if (underexposureRatio > 0.3 || lightingScore < 0.25) {
        newLightingStatus = { status: 'bad', text: '光線不足', color: 'red' };
      }
      // 亮度偏低但還可接受
      else if (lightingScore < 0.40) {
        newLightingStatus = { status: 'warning', text: '請移至光線充足處', color: 'yellow' };
      }
      // 亮度略高但還在可接受範圍
      else if (lightingScore > 0.75) {
        newLightingStatus = { status: 'warning', text: '光線稍強', color: 'yellow' };
      }
      // 理想亮度範圍（40-75%）
      else {
        newLightingStatus = { status: 'good', text: '良好', color: 'green' };
      }
      
      // 2. 臉部位置檢測
      // 計算橢圓內的臉部覆蓋率
      const faceOvalCoverage = ovalPixelCount > 0 ? ovalContentPixels / ovalPixelCount : 0;
      
      // 臉部位置評估：確保臉部至少佔橢圓 60% 面積
      // 紅(0-0.35)、黃(0.35-0.60)、綠(0.60-1)
      let newDistanceStatus;
      if (faceOvalCoverage >= 0.60) {
        newDistanceStatus = { status: 'good', text: '位置正確', color: 'green' };
      } else if (faceOvalCoverage >= 0.35) {
        newDistanceStatus = { status: 'warning', text: '請將臉靠近一些', color: 'yellow' };
      } else {
        newDistanceStatus = { status: 'bad', text: '請將臉移入框內', color: 'red' };
      }
      
      setLightingStatus(newLightingStatus);
      setDistanceStatus(newDistanceStatus);
      
      const bothGreen = newLightingStatus.color === 'green' && newDistanceStatus.color === 'green';
      setFaceDetected(bothGreen);
      
      // 自動拍照邏輯：兩個指標都是綠色持續 2 秒
      if (bothGreen) {
        setGreenStatusTime(prev => {
          const newTime = prev + 1; // 每秒增加 1（檢測間隔為 1000ms）
          
          // 使用 Ref 檢查狀態，避免閉包導致的舊狀態問題
          if (newTime >= 2 && !autoCapturingRef.current && !isAnalyzingRef.current) {
            // 達到 2 秒，觸發自動拍照
            setAutoCapturing(true);
            // 立即更新 ref 以防止在下一次渲染前重複觸發
            autoCapturingRef.current = true;
            
            setTimeout(() => {
              captureAndAnalyze();
            }, 100);
          }
          return newTime;
        });
      } else {
        setGreenStatusTime(0);
        setAutoCapturing(false);
        autoCapturingRef.current = false;
      }
      
    } catch (error) {
      // 發生錯誤時使用保守的狀態
      setLightingStatus({ status: 'checking', text: '檢測中', color: 'gray' });
      setDistanceStatus({ status: 'checking', text: '檢測中', color: 'gray' });
    }
  };

  // 拍照並分析
  const captureAndAnalyze = async () => {
    // 防止重複調用
    if (isAnalyzingRef.current) return;

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
      
      // 驗證並分析
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
    setSelectedImage(null);
    setPreviewUrl(null);
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

  // 分析圖片
  const analyzeImage = async (file) => {
    if (!file) {
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
      formData.append('image', file);

      // 取得認證 token
      const accessToken = localStorage.getItem('accessToken');
      const headers = {};
      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }

      const response = await fetch(`${API_BASE_URL}/api/analyze`, {
        method: 'POST',
        headers,
        body: formData,
      });

      clearInterval(progressInterval);
      setAnalysisProgress(100);

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch (e) {
          // Ignore JSON parse error
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();

      if (data.success) {
        let overall_score, skin_age, rawAnalysis, recommendations;

        if (data.data?.summary) {
          overall_score = data.data.summary.overall_score;
          skin_age = data.data.summary.skin_age;
          
          const backendRecs = data.data.summary.recommendations || [];
          if (backendRecs.length > 0 && typeof backendRecs[0] === 'object') {
            recommendations = backendRecs.map(rec => rec.suggestion || rec.issue);
          } else {
            recommendations = backendRecs;
          }
          
          rawAnalysis = data.data.analysis?.result || {};
        } else {
          rawAnalysis = data.data?.analysis?.result || data.data?.result || data.data?.analysis || {};
          overall_score = calculateOverallScore(rawAnalysis);
          skin_age = estimateSkinAge(rawAnalysis);
          recommendations = generateRecommendations(rawAnalysis);
        }
        
        const processedData = {
          overall_score: overall_score,
          skin_age: skin_age,
          analysis: rawAnalysis,
          recommendations: recommendations,
          face_rectangle: data.data?.face_rectangle || data.data?.analysis?.face_rectangle,
          raw_data: data.data
        };
        
        setAnalysisResult(processedData);
        
        // 關閉相機
        if (cameraMode && stream) {
          stopCamera();
        }
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
      
      // Skip keys that don't have a valid value object or are handled elsewhere
      if (key === 'skin_age' || key === 'face_rectangle') return;

      if (value && typeof value === 'object') {
        let statusText = '';
        let confidenceText = '';

        // Special handling for different field types
        if (['acne', 'mole', 'skin_spot', 'blackhead', 'closed_comedones'].includes(key)) {
            const count = value.rectangle ? value.rectangle.length : (value.value || 0);
            statusText = `${count} 處`;
        } else if (key === 'skin_type') {
            statusText = getSkinTypeLabel(value.skin_type);
        } else if (key === 'skin_color') {
            statusText = getSkinColorLabel(value.skin_color);
        } else if (['skintone_ita', 'skin_hue_ha'].includes(key)) {
            statusText = value.value?.toFixed(2) || 'N/A';
        } else if (value.value !== undefined) {
             statusText = getStatusByValue(value.value).text;
        } else {
            statusText = 'N/A';
        }

        // Confidence handling
        if (value.confidence !== undefined) {
            confidenceText = `(可信度: ${(value.confidence * 100).toFixed(1)}%)`;
        }

        report += `${label}: ${statusText} ${confidenceText}\n`;
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
      皺紋: ['nasolabial_fold', 'forehead_wrinkle', 'eye_finelines', 'crows_feet', 'glabella_wrinkle', 'nasolabial_fold_severity'],
      眼周: ['eye_pouch', 'dark_circle', 'left_eyelids', 'right_eyelids', 'eye_pouch_severity'],
      色素: ['skin_spot', 'mole', 'skin_color', 'skintone_ita', 'skin_hue_ha'],
      痘痘: ['acne', 'blackhead', 'closed_comedones'],
      其他: ['skin_type', 'sensitivity']
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
          (功能開發中.... 目前為測試版) <br /> <br /> AI 智慧肌膚檢測 
        </h1>
        <p className="text-xl text-slate-600 mb-6">
          運用尖端科技,洞察肌膚真實狀態
        </p>

      </div>

      {/* 檢測區域 */}
      {!analysisResult && (
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-purple-100">
          {/* 模式切換 */}
          <div className="flex justify-center mb-6">
            <div className="flex w-full max-w-md rounded-2xl border-2 border-purple-200 p-1.5 bg-purple-50 shadow-md">
              <button
                onClick={() => cameraMode || switchMode()}
                className={`flex-1 py-3 rounded-xl transition-all font-semibold text-sm sm:text-base flex items-center justify-center ${
                  cameraMode
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'text-slate-600 hover:text-purple-600'
                }`}
              >
                <BiCamera className="inline w-5 h-5 mr-1 sm:mr-2" />
                即時檢測
              </button>
              <button
                onClick={() => !cameraMode || switchMode()}
                className={`flex-1 py-3 rounded-xl transition-all font-semibold text-sm sm:text-base flex items-center justify-center ${
                  !cameraMode
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'text-slate-600 hover:text-purple-600'
                }`}
              >
                <BiUpload className="inline w-5 h-5 mr-1 sm:mr-2" />
                上傳照片
              </button>
            </div>
          </div>

          {/* 相機模式 */}
          {cameraMode && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-center text-slate-800">
                即時肌膚檢測
              </h2>
              <p className="text-center text-slate-600 text-base font-medium mb-4">
                請面向鏡頭，確保光線充足，保持正面角度
              </p>

              {/* 相機畫面 */}
              <div className="relative mx-auto max-w-2xl">
                <div className="relative aspect-[3/4] bg-slate-900 rounded-2xl overflow-hidden">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                    style={{ transform: 'scaleX(-1)' }}
                  />
                  
                  {/* 臉部框線 */}
                  {stream && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-72 h-96 border-4 border-white rounded-full opacity-30"></div>
                    </div>
                  )}

                  {/* 未開啟相機時的提示 */}
                  {!stream && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                      <BiCamera className="w-20 h-20 mb-4 opacity-50" />
                      <p className="text-lg">點擊下方按鈕開啟相機</p>
                    </div>
                  )}
                </div>

                {/* 隱藏的 canvas 用於捕獲畫面 */}
                <canvas ref={canvasRef} className="hidden" />
                
                {/* 狀態指示器 - 移到畫面外 */}
                {stream && (
                  <div className="flex flex-col gap-3 items-center w-full mt-4">
                    {/* 光線狀態 */}
                    <div className={`px-6 py-2 rounded-full font-semibold text-base shadow-lg transition-all ${
                      lightingStatus.color === 'green'
                        ? 'bg-green-500 text-white'
                        : lightingStatus.color === 'yellow'
                        ? 'bg-yellow-500 text-gray-900'
                        : lightingStatus.color === 'red'
                        ? 'bg-red-500 text-white'
                        : 'bg-slate-600 text-white'
                    }`}>
                      💡 Lighting: {lightingStatus.text}
                    </div>
                    
                    {/* 臉部位置狀態 */}
                    <div className={`px-6 py-2 rounded-full font-semibold text-base shadow-lg transition-all ${
                      distanceStatus.color === 'green'
                        ? 'bg-green-500 text-white'
                        : distanceStatus.color === 'yellow'
                        ? 'bg-yellow-500 text-gray-900'
                        : distanceStatus.color === 'red'
                        ? 'bg-red-500 text-white'
                        : 'bg-slate-600 text-white'
                    }`}>
                      📍 Face Position: {distanceStatus.text}
                    </div>
                    
                    {/* 自動拍照倒數提示 */}
                    {greenStatusTime > 0 && greenStatusTime < 2 && (
                      <div className="px-6 py-2 bg-blue-500 text-white rounded-full font-bold text-lg shadow-lg animate-pulse">
                        ✓ 保持不動 {2 - greenStatusTime} 秒
                      </div>
                    )}
                    
                    {autoCapturing && (
                      <div className="px-6 py-2 bg-purple-500 text-white rounded-full font-bold text-lg shadow-lg animate-pulse">
                        📸 正在拍攝...
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* 控制按鈕 */}
              <div className="flex flex-col sm:flex-row justify-center gap-3 px-4">
                {!stream ? (
                  <button
                    onClick={startCamera}
                    className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-3xl font-bold text-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-2"
                  >
                    <BiCamera className="w-7 h-7" />
                    即時檢測
                  </button>
                ) : (
                  <>
                    <button
                      onClick={captureAndAnalyze}
                      disabled={!faceDetected || isAnalyzing}
                      className={`w-full sm:w-auto px-10 py-4 rounded-3xl font-bold text-lg transition-all shadow-xl flex items-center justify-center gap-2 ${
                        faceDetected && !isAnalyzing
                          ? 'bg-blue-400 text-white hover:bg-blue-500 hover:shadow-2xl'
                          : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      <BiCamera className="w-7 h-7" />
                      {isAnalyzing ? '分析中...' : '拍照並分析'}
                    </button>
                    <button
                      onClick={stopCamera}
                      className="w-full sm:w-auto px-10 py-4 bg-white border-2 border-slate-400 text-slate-700 rounded-3xl font-bold text-lg hover:bg-slate-100 transition-all shadow-lg"
                    >
                      <BiX className="inline w-7 h-7 mr-1" />
                      關閉相機
                    </button>
                  </>
                )}
              </div>

              {/* 提示訊息 */}
              {stream && !faceDetected && (
                <div className="text-center bg-orange-100 rounded-2xl p-5 border-2 border-orange-300 mx-4">
                  <div className="flex items-center justify-center gap-2 text-orange-700">
                    <FiAlertCircle className="w-6 h-6" />
                    <span className="font-semibold text-base">
                      請調整位置，確保光線充足、正面角度、適當距離
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 上傳模式 */}
          {!cameraMode && (
            <div>
              <h2 className="text-2xl font-semibold text-center mb-6 text-slate-800">
                上傳照片檢測
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

              {previewUrl && !isAnalyzing && (
                <button
                  onClick={() => analyzeImage(selectedImage)}
                  className="mt-8 w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold text-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <BiCamera className="w-6 h-6" />
                  開始分析
                </button>
              )}
            </div>
          )}

          {/* 錯誤訊息 */}
          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center gap-2">
              <FiAlertCircle className="w-5 h-5" />
              {error}
            </div>
          )}

          {/* 分析進度 */}
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
              
              const totalItems = Object.values(categorized).reduce((sum, items) => sum + items.length, 0);
              
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
                    
                    const isIssue = (item) => {
                      if (['acne', 'mole', 'skin_spot', 'blackhead', 'closed_comedones'].includes(item.key)) {
                          const count = item.data.rectangle ? item.data.rectangle.length : (item.data.value || 0);
                          return count > 0;
                      }
                      if (['skin_type', 'skin_color', 'skintone_ita', 'skin_hue_ha', 'sensitivity'].includes(item.key)) {
                          return false;
                      }
                      return item.data?.value >= 1;
                    };

                    const hasIssues = items.some(isIssue);
                    const issueCount = items.filter(isIssue).length;
                    
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
                            let status = { text: '未知', color: 'text-gray-600', bgColor: 'bg-gray-50', icon: '?' };
                            let displayValue = null;
                            let isSeverityField = false;

                            // Handle different types
                            if (['acne', 'mole', 'skin_spot', 'blackhead', 'closed_comedones'].includes(item.key)) {
                              const count = item.data.rectangle ? item.data.rectangle.length : (item.data.value || 0);
                              status = {
                                text: `${count} 處`,
                                color: count > 0 ? 'text-orange-600' : 'text-green-600',
                                bgColor: count > 0 ? 'bg-orange-50' : 'bg-green-50',
                                icon: count > 0 ? '!' : '✓'
                              };
                              displayValue = count;
                              isSeverityField = true; // Treat count > 0 as an issue
                            } else if (item.key === 'skin_type') {
                              const label = getSkinTypeLabel(item.data.skin_type);
                              status = { text: label, color: 'text-blue-600', bgColor: 'bg-blue-50', icon: 'ℹ' };
                            } else if (item.key === 'skin_color') {
                              const label = getSkinColorLabel(item.data.skin_color);
                              status = { text: label, color: 'text-blue-600', bgColor: 'bg-blue-50', icon: 'ℹ' };
                            } else if (['skintone_ita', 'skin_hue_ha'].includes(item.key)) {
                              const val = item.data.value?.toFixed(2) || 'N/A';
                              status = { text: val, color: 'text-gray-600', bgColor: 'bg-gray-50', icon: '#' };
                            } else if (item.data.value !== undefined) {
                              status = getStatusByValue(item.data.value);
                              displayValue = item.data.value;
                              isSeverityField = true;
                            }

                            const confidence = item.data.confidence !== undefined 
                              ? getConfidenceLevel(item.data.confidence) 
                              : 'N/A';
                            
                            // Filter logic
                            if (!showAllDetails && isSeverityField && displayValue === 0) return null;
                            
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
                                {showAllDetails && item.data.confidence !== undefined && (
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
              onClick={() => {
                setAnalysisResult(null);
                setError(null);
              }}
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
