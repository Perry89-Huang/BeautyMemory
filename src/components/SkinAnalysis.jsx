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
import { getTaiwanTimestamp, getTaiwanDateString } from '../utils/timezone';

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
  sensitivity: '敏感度',
  skin_age: '肌膚年齡',
  face_maps: '肌膚色譜圖'
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
    return ['建議定期進行肌膚檢測，追蹤肌膚狀態變化，及早發現問題'];
  }
  
  // 1. 毛孔問題分析
  const poresIssues = ['pores_left_cheek', 'pores_right_cheek', 'pores_forehead', 'pores_jaw']
    .filter(key => analysisData[key]?.value >= 1);
  if (poresIssues.length > 0) {
    const severity = Math.max(...poresIssues.map(key => analysisData[key]?.value || 0));
    if (severity >= 2) {
      recommendations.push('🔳 毛孔粗大較明顯：建議使用荷顏靚膚液升級版搭配精華液，深層清潔並收斂毛孔。避免過度清潔導致油脂分泌失衡');
    } else {
      recommendations.push('🔳 毛孔輕微擴張：使用荷顏靚膚液升級版調理肌膚，維持水油平衡，預防毛孔粗大惡化');
    }
  }
  
  // 2. 皺紋與老化分析
  const wrinkleIssues = ['wrinkle_nasolabial_fold_severity', 'wrinkle_forehead_severity', 'wrinkle_crows_feet_severity', 'wrinkle_glabella_severity']
    .filter(key => analysisData[key]?.value >= 1);
  if (wrinkleIssues.length > 0) {
    const wrinkleTypes = [];
    if (analysisData.wrinkle_forehead_severity?.value >= 1) wrinkleTypes.push('額頭紋');
    if (analysisData.wrinkle_glabella_severity?.value >= 1) wrinkleTypes.push('眉間紋');
    if (analysisData.wrinkle_crows_feet_severity?.value >= 1) wrinkleTypes.push('魚尾紋');
    if (analysisData.wrinkle_nasolabial_fold_severity?.value >= 1) wrinkleTypes.push('法令紋');
    
    recommendations.push(`👵 檢測到${wrinkleTypes.join('、')}：建議使用荷顏煥采肌活蛋白霜配合精華液，深層修護肌膚彈性。早晚使用，重點加強紋路部位，並搭配按摩手法促進吸收`);
  }
  
  // 3. 眼周問題分析
  const hasEyeIssues = analysisData.eye_pouch?.value >= 1 || analysisData.dark_circle_severity?.value >= 1;
  if (hasEyeIssues) {
    const issues = [];
    if (analysisData.eye_pouch?.value >= 1) issues.push('眼袋');
    if (analysisData.dark_circle_severity?.value >= 1) issues.push('黑眼圈');
    recommendations.push(`👁️ ${issues.join('與')}問題：建議使用荷顏精華液加強眼周保養，輕柔按摩促進循環。保持每日 7-8 小時優質睡眠，避免長時間使用 3C 產品`);
  }
  
  // 4. 色素與斑點分析
  const hasPigmentation = analysisData.pigmentation?.value >= 1 || analysisData.spots?.value >= 1;
  if (hasPigmentation) {
    const pigmentLevel = Math.max(analysisData.pigmentation?.value || 0, analysisData.spots?.value || 0);
    if (pigmentLevel >= 2) {
      recommendations.push('🎨 色素沉澱明顯：強烈建議使用荷顏防曬隔離霜（SPF 50+）配合煥采肌活蛋白霜，阻斷紫外線並淡化色斑。每 2-3 小時補擦防曬，配合 SOD 面膜加強代謝');
    } else {
      recommendations.push('🎨 輕微色素沉澱：使用荷顏防曬隔離霜預防惡化，搭配靚膚液升級版提亮膚色，維持肌膚透亮度');
    }
  }
  
  // 5. 痘痘與粉刺分析
  const hasAcne = analysisData.acne?.value >= 1 || analysisData.acne_severity?.value >= 1 || analysisData.blackhead?.value >= 1;
  if (hasAcne) {
    recommendations.push('🔴 痘痘肌膚調理：建議使用荷顏溫和清潔配合 SOD 面膜，溫和清潔不刺激。避免擠壓痘痘，保持臉部清潔但勿過度清潔造成肌膚屏障受損');
  }
  
  // 6. 敏感與紅區分析
  const hasSensitivity = analysisData.sensitivity?.value >= 1 || analysisData.red_area_severity?.value >= 1;
  if (hasSensitivity) {
    recommendations.push('🌿 敏感肌膚護理：您的肌膚較為敏感，建議使用荷顏溫和清潔與靚膚液升級版，強化肌膚屏障。避免使用刺激性產品，新產品使用前先做耳後測試');
  }
  
  // 7. 肌膚類型建議
  const skinType = analysisData.skin_type?.value;
  if (skinType === 0) {
    recommendations.push('🌊 油性肌膚：注意控油但避免過度清潔，使用荷顏靚膚液升級版調節水油平衡，選擇清爽型保濕產品');
  } else if (skinType === 1) {
    recommendations.push('💧 乾性肌膚：加強保濕鎖水，使用荷顏精華液配合養顏乳，建立完整保濕屏障。避免使用含酒精的產品');
  } else if (skinType === 2) {
    recommendations.push('⚖️ 中性肌膚：恭喜您擁有理想膚質！建議使用荷顏靚膚液升級版維持平衡狀態，持續做好基礎保養與防曬');
  } else if (skinType === 3) {
    recommendations.push('🔄 混合性肌膚：T 字部位與兩頰需分區保養，使用荷顏靚膚液升級版平衡膚質，油性區域加強控油，乾燥區域加強保濕');
  }
  
  // 8. 基礎保養建議（總是顯示）
  recommendations.push('☀️ 防曬是最重要的保養：每日使用荷顏防曬隔離霜 SPF 50+，即使陰天或室內也要防護，預防光老化與色素沉澱');
  
  // 9. 生活習慣建議
  if (wrinkleIssues.length > 0 || hasEyeIssues) {
    recommendations.push('😴 優質睡眠促進修復：建議每晚 11 點前就寢，保持 7-8 小時深度睡眠，讓肌膚充分進行夜間修護');
  }
  
  // 10. 飲食建議
  if (hasPigmentation || wrinkleIssues.length > 0) {
    recommendations.push('🥗 抗氧化飲食：多攝取富含維生素 C、E 的蔬果（藍莓、番茄、堅果），減少糖分攝取，補充足夠水分（每日 2000cc）');
  }
  
  // 11. 荷顏產品使用建議
  recommendations.push('💎 荷顏 28 天煥膚計畫：建議搭配荷顏完整產品線，連續使用 28 天（完整肌膚更新週期），即可看到顯著改善效果');
  
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
  const [showAllDetails, setShowAllDetails] = useState('issues'); // 'issues' | 'all' | 'none'
  const [showRedAreaMap, setShowRedAreaMap] = useState(false);
  
  // AI 推薦狀態
  const [aiRecommendation, setAiRecommendation] = useState(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [showAIRecommendation, setShowAIRecommendation] = useState(false);
  
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

      const response = await fetch(`${API_BASE_URL}/api/analysis/analyze`, {
        method: 'POST',
        headers,
        body: formData,
      });

      clearInterval(progressInterval);
      setAnalysisProgress(100);

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        let errorDetails = null;
        let suggestions = [];
        
        try {
          const errorData = await response.json();
          errorMessage = errorData.error?.message || errorData.message || errorMessage;
          errorDetails = errorData.error?.detail;
          suggestions = errorData.error?.suggestions || [];
        } catch (e) {
          // Ignore JSON parse error
        }
        
        // 顯示友善的錯誤訊息
        let displayMessage = errorMessage;
        if (suggestions.length > 0) {
          displayMessage += '\n\n' + suggestions.join('\n');
        }
        
        setError(displayMessage);
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
          
          // 正確解析分析數據：analysis.result 才是真正的肌膚數據
          rawAnalysis = data.data.analysis?.result || data.data.analysis || {};
          
          // 添加 face_maps 和 sensitivity（它們不在 result 裡面）
          if (data.data.analysis?.face_maps) {
            rawAnalysis.face_maps = data.data.analysis.face_maps;
          }
          if (data.data.analysis?.sensitivity) {
            rawAnalysis.sensitivity = data.data.analysis.sensitivity;
          }
          
          // 調試輸出
          console.log('📊 分析數據結構:', {
            hasAnalysis: !!data.data.analysis,
            hasResult: !!data.data.analysis?.result,
            hasFaceMaps: !!data.data.analysis?.face_maps,
            hasSensitivity: !!data.data.analysis?.sensitivity,
            analysisKeys: Object.keys(rawAnalysis),
            sampleData: Object.keys(rawAnalysis).slice(0, 3)
          });
        } else {
          rawAnalysis = data.data?.analysis?.result || data.data?.result || data.data?.analysis || {};
          
          // 添加 face_maps 和 sensitivity（它們不在 result 裡面）
          if (data.data?.analysis?.face_maps) {
            rawAnalysis.face_maps = data.data.analysis.face_maps;
          }
          if (data.data?.analysis?.sensitivity) {
            rawAnalysis.sensitivity = data.data.analysis.sensitivity;
          }
          
          overall_score = calculateOverallScore(rawAnalysis);
          skin_age = estimateSkinAge(rawAnalysis);
          recommendations = generateRecommendations(rawAnalysis);
        }
        
        const processedData = {
          overall_score: overall_score,
          skin_age: skin_age,
          analysis: rawAnalysis,
          recommendations: recommendations,
          skincareRoutine: data.data?.skincareRoutine || null,
          face_rectangle: data.data?.face_rectangle || data.data?.analysis?.face_rectangle,
          raw_data: {
            ...data.data,
            scores: data.data?.summary?.scores || {
              hydration: 0,
              radiance: 0,
              firmness: 0
            }
          }
        };
        
        console.log('✅ 處理後的分析結果:', {
          overall_score,
          skin_age,
          analysisKeys: Object.keys(rawAnalysis),
          recommendationsCount: recommendations?.length,
          hasSkincareRoutine: !!data.data?.skincareRoutine,
          scores: data.data?.summary?.scores
        });
        
        // 保存分析結果到本地存儲（包含完整數據和保養方案）
        try {
          const fengShuiInfo = data.data?.fengShui || {};
          const savedRecord = {
            id: data.data?.recordId || `local_${Date.now()}`,
            created_at: getTaiwanTimestamp(),
            timestamp: getTaiwanTimestamp(),
            overall_score: overall_score,
            skin_age: skin_age,
            analysis: rawAnalysis,
            full_analysis_data: rawAnalysis,
            recommendations: recommendations,
            skincare_routine: data.data?.skincareRoutine || null,
            face_rectangle: data.data?.face_rectangle || data.data?.analysis?.face_rectangle,
            feng_shui: fengShuiInfo,
            feng_shui_element: fengShuiInfo.element || '未知',
            feng_shui_blessing: fengShuiInfo.blessing || '',
            userMode: data.data?.userMode || 'member',
            source: 'local'
          };
          
          // 獲取現有記錄
          const existingRecords = JSON.parse(localStorage.getItem('skin_analysis_history') || '[]');
          
          // 添加新記錄到開頭（最新的在前面）
          existingRecords.unshift(savedRecord);
          
          // 只保留最近 50 筆記錄
          if (existingRecords.length > 50) {
            existingRecords.splice(50);
          }
          
          // 保存回本地存儲
          localStorage.setItem('skin_analysis_history', JSON.stringify(existingRecords));
          
          console.log('✅ 分析結果已保存到本地存儲');
        } catch (saveError) {
          console.error('❌ 保存到本地存儲失敗:', saveError);
        }
        
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

  // 獲取 AI 專家推薦
  const getAIExpertRecommendation = async (userQuery = '') => {
    if (!analysisResult) {
      setError('請先完成肌膚檢測');
      return;
    }

    setIsLoadingAI(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/ai/skin-recommendation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          analysisResult: analysisResult,
          userQuery: userQuery
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || '獲取 AI 推薦失敗');
      }

      const data = await response.json();
      
      if (data.success) {
        setAiRecommendation(data.data);
        setShowAIRecommendation(true);
      } else {
        throw new Error(data.error?.message || 'AI 推薦失敗');
      }

    } catch (err) {
      console.error('AI 推薦錯誤:', err);
      setError(`AI 推薦系統暫時無法使用: ${err.message}`);
    } finally {
      setIsLoadingAI(false);
    }
  };

  const downloadReport = () => {
    if (!analysisResult) return;

    const reportContent = generateReportText(analysisResult);
    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `美魔力肌膚檢測報告_${getTaiwanDateString()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const generateReportText = (data) => {
    const date = getTaiwanTimestamp().replace('T', ' ').substring(0, 19) + ' (台灣時間)';
    
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
      if (key === 'face_rectangle' || key === 'face_maps') return;

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
        } else if (key === 'sensitivity') {
            if (value.sensitivity_area !== undefined && value.sensitivity_intensity !== undefined) {
              const area = (value.sensitivity_area * 100).toFixed(1);
              const intensity = value.sensitivity_intensity.toFixed(1);
              statusText = `面積 ${area}% / 強度 ${intensity}`;
            } else {
              statusText = 'N/A';
            }
        } else if (key === 'skin_age') {
            statusText = `${value.value || 'N/A'} 歲`;
        } else if (['skintone_ita', 'skin_hue_ha'].includes(key)) {
            statusText = value.ITA?.toFixed(2) || value.HA?.toFixed(2) || 'N/A';
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
      '🕳️ 毛孔': ['pores_left_cheek', 'pores_right_cheek', 'pores_forehead', 'pores_jaw'],
      '👵 皺紋': ['nasolabial_fold', 'forehead_wrinkle', 'eye_finelines', 'crows_feet', 'glabella_wrinkle', 'nasolabial_fold_severity'],
      '👁️ 眼周': ['eye_pouch', 'dark_circle', 'left_eyelids', 'right_eyelids', 'eye_pouch_severity'],
      '🎨 色素': ['skin_spot', 'mole', 'skin_color', 'skintone_ita', 'skin_hue_ha'],
      '🔴 痘痘': ['acne', 'blackhead', 'closed_comedones'],
      '📊 其他': ['skin_type', 'sensitivity', 'skin_age', 'face_maps']
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

          {/* 分析總結 */}
          <div className="bg-white rounded-2xl p-6 shadow-xl border-2 border-purple-200">
            <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <span className="text-3xl">📋</span>
              分析總結
            </h3>
            
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              {/* 基礎狀態 */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border-2 border-blue-200">
                <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <span className="text-xl">🎨</span>
                  基礎狀態
                </h4>
                <div className="space-y-2 text-sm">
                  {analysisResult.analysis.skin_color && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">膚色</span>
                      <span className="font-semibold text-slate-800">
                        {getSkinColorLabel(analysisResult.analysis.skin_color.value || analysisResult.analysis.skin_color.skin_color)}
                      </span>
                    </div>
                  )}
                  {analysisResult.analysis.skin_age && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">肌膚年齡</span>
                      <span className="font-bold text-blue-600 text-lg">
                        {analysisResult.analysis.skin_age.value || analysisResult.skin_age} 歲
                      </span>
                    </div>
                  )}
                  {analysisResult.analysis.skin_type && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">膚質</span>
                      <span className="font-semibold text-slate-800">
                        {getSkinTypeLabel(analysisResult.analysis.skin_type.skin_type)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* 肌膚指標 */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border-2 border-purple-200">
                <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <span className="text-xl">💎</span>
                  肌膚指標
                </h4>
                <div className="space-y-2 text-sm">
                  {analysisResult.raw_data?.scores && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">💧 水潤度</span>
                        <span className={`font-bold text-lg ${
                          analysisResult.raw_data.scores.hydration >= 80 ? 'text-blue-600' :
                          analysisResult.raw_data.scores.hydration >= 60 ? 'text-cyan-600' : 'text-orange-600'
                        }`}>
                          {analysisResult.raw_data.scores.hydration || 0}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">✨ 光澤度</span>
                        <span className={`font-bold text-lg ${
                          analysisResult.raw_data.scores.radiance >= 80 ? 'text-yellow-600' :
                          analysisResult.raw_data.scores.radiance >= 60 ? 'text-amber-600' : 'text-orange-600'
                        }`}>
                          {analysisResult.raw_data.scores.radiance || 0}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">🎯 緊緻度</span>
                        <span className={`font-bold text-lg ${
                          analysisResult.raw_data.scores.firmness >= 80 ? 'text-purple-600' :
                          analysisResult.raw_data.scores.firmness >= 60 ? 'text-pink-600' : 'text-red-600'
                        }`}>
                          {analysisResult.raw_data.scores.firmness || 0}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* 老化指標 */}
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-4 border-2 border-orange-200">
                <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <span className="text-xl">👵</span>
                  老化指標
                </h4>
                <div className="space-y-2 text-sm">
                  {(() => {
                    const wrinkles = ['forehead_wrinkle', 'crows_feet', 'eye_finelines', 'nasolabial_fold'];
                    const detected = wrinkles.filter(key => analysisResult.analysis[key]?.value >= 1);
                    return (
                      <>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600">皺紋檢測</span>
                          <span className={`font-bold text-lg ${detected.length > 2 ? 'text-red-600' : detected.length > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                            {detected.length} 項
                          </span>
                        </div>
                        {detected.length > 0 && (
                          <div className="text-xs text-slate-500 mt-2">
                            發現：{detected.map(k => SKIN_ANALYSIS_LABELS[k]).join('、')}
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* 瑕疵與敏感 */}
              <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-4 border-2 border-red-200">
                <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <span className="text-xl">🔴</span>
                  瑕疵與敏感
                </h4>
                <div className="space-y-2 text-sm">
                  {(() => {
                    const blemishes = ['acne', 'skin_spot', 'blackhead', 'closed_comedones'];
                    const totalCount = blemishes.reduce((sum, key) => {
                      const data = analysisResult.analysis[key];
                      if (data?.rectangle) return sum + data.rectangle.length;
                      if (data?.value) return sum + data.value;
                      return sum;
                    }, 0);
                    
                    return (
                      <>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600">斑點/痘痘</span>
                          <span className={`font-bold text-lg ${totalCount > 5 ? 'text-red-600' : totalCount > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                            {totalCount} 處
                          </span>
                        </div>
                        {analysisResult.analysis.sensitivity && (
                          <div className="mt-2">
                            <div className="flex justify-between">
                              <span className="text-slate-600">敏感度</span>
                              <span className={`font-semibold ${
                                analysisResult.analysis.sensitivity.sensitivity_intensity > 50 ? 'text-red-600' : 'text-orange-600'
                              }`}>
                                {analysisResult.analysis.sensitivity.sensitivity_intensity.toFixed(0)}
                              </span>
                            </div>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>

            {/* 專業總結範例 */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-5 border-2 border-purple-200">
              <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                <span className="text-xl">💬</span>
                專業總結
              </h4>
              <p className="text-slate-700 leading-relaxed">
                {(() => {
                  const score = analysisResult.overall_score;
                  const age = analysisResult.skin_age;
                  const wrinkles = ['forehead_wrinkle', 'crows_feet', 'nasolabial_fold'].filter(k => analysisResult.analysis[k]?.value >= 1);
                  const blemishes = ['acne', 'skin_spot'].reduce((sum, k) => {
                    const data = analysisResult.analysis[k];
                    return sum + (data?.rectangle?.length || data?.value || 0);
                  }, 0);
                  
                  let summary = `根據 AI 深度分析，您的肌膚整體評分為 ${score} 分，肌膚年齡為 ${age} 歲。`;
                  
                  if (wrinkles.length > 0) {
                    summary += ` 檢測到 ${wrinkles.map(k => SKIN_ANALYSIS_LABELS[k]).join('、')} 等老化跡象，建議加強抗老保養。`;
                  }
                  
                  if (blemishes > 5) {
                    summary += ` 發現多處色斑與痘痘問題，需要針對性護理。`;
                  } else if (blemishes > 0) {
                    summary += ` 有少量瑕疵，持續保養可改善。`;
                  }
                  
                  if (analysisResult.analysis.sensitivity?.sensitivity_intensity > 50) {
                    summary += ` 肌膚敏感度較高，建議採用溫和舒緩產品。`;
                  }
                  
                  if (score >= 85) {
                    summary += ` 整體狀態優異，請繼續保持良好習慣！`;
                  } else if (score >= 70) {
                    summary += ` 肌膚狀態良好，持續保養可達到更佳效果。`;
                  } else {
                    summary += ` 建議參考下方個人化建議，加強日常保養。`;
                  }
                  
                  return summary;
                })()}
              </p>
            </div>
          </div>

          {/* 詳細分析 */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-slate-800 mb-1">
                  🔍 詳細分析結果
                </h3>
                <p className="text-sm text-slate-500">
                  {showAllDetails === 'all' ? '顯示所有項目' : 
                   showAllDetails === 'issues' ? '僅顯示需要注意的項目' : 
                   '已隱藏所有項目'}
                </p>
              </div>
              <button
                onClick={() => {
                  if (showAllDetails === 'issues') setShowAllDetails('all');
                  else if (showAllDetails === 'all') setShowAllDetails('none');
                  else setShowAllDetails('issues');
                }}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-sm font-semibold hover:from-purple-600 hover:to-pink-600 transition-all shadow-md flex items-center gap-2"
              >
                <BiInfoCircle className="w-4 h-4" />
                {showAllDetails === 'issues' ? '展開全部' : 
                 showAllDetails === 'all' ? '隱藏全部' : 
                 '顯示問題'}
              </button>
            </div>

            {(() => {
              // 如果狀態是 'none'，顯示隱藏提示
              if (showAllDetails === 'none') {
                return (
                  <div className="text-center py-12 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border-2 border-dashed border-purple-200">
                    <div className="text-6xl mb-4">👁️‍🗨️</div>
                    <p className="text-lg font-semibold text-slate-700 mb-2">
                      詳細分析結果已隱藏
                    </p>
                    <p className="text-sm text-slate-500 mb-4">
                      點擊上方按鈕「顯示問題」或「展開全部」查看分析結果
                    </p>
                  </div>
                );
              }

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
                      // These are informational fields, not issues
                      if (['skin_type', 'skin_color', 'skintone_ita', 'skin_hue_ha', 'sensitivity', 'skin_age', 'face_maps'].includes(item.key)) {
                          return false;
                      }
                      return item.data?.value >= 1;
                    };

                    const hasIssues = items.some(isIssue);
                    const issueCount = items.filter(isIssue).length;
                    
                    if (showAllDetails === 'issues' && !hasIssues) return null;
                    
                    return (
                      <div key={category} className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border-l-4 border-purple-400">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-lg font-bold text-slate-800">{category}</h4>
                          {showAllDetails === 'issues' && issueCount > 0 && (
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-orange-600 bg-orange-100 px-3 py-1.5 rounded-full border-2 border-orange-300 shadow-sm">
                                ⚠️ {issueCount} 項需注意
                              </span>
                            </div>
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
                            } else if (item.key === 'sensitivity') {
                              // Handle sensitivity object with area and intensity
                              if (item.data.sensitivity_area !== undefined && item.data.sensitivity_intensity !== undefined) {
                                const area = (item.data.sensitivity_area * 100).toFixed(1);
                                const intensity = item.data.sensitivity_intensity.toFixed(1);
                                status = { 
                                  text: `面積 ${area}% / 強度 ${intensity}`, 
                                  color: intensity > 50 ? 'text-red-600' : 'text-yellow-600', 
                                  bgColor: intensity > 50 ? 'bg-red-50' : 'bg-yellow-50', 
                                  icon: intensity > 50 ? '⚠️' : 'ℹ' 
                                };
                              } else {
                                status = { text: 'N/A', color: 'text-gray-600', bgColor: 'bg-gray-50', icon: '?' };
                              }
                            } else if (item.key === 'skin_age') {
                              // Handle skin_age object
                              const ageValue = item.data.value || 'N/A';
                              status = { text: `${ageValue} 歲`, color: 'text-blue-600', bgColor: 'bg-blue-50', icon: '📅' };
                            } else if (item.key === 'face_maps') {
                              // Handle face_maps - show if red_area exists
                              if (item.data.red_area) {
                                status = { text: '點擊查看', color: 'text-purple-600', bgColor: 'bg-purple-50', icon: '🗺️' };
                              } else {
                                status = { text: 'N/A', color: 'text-gray-600', bgColor: 'bg-gray-50', icon: '?' };
                              }
                            } else if (['skintone_ita', 'skin_hue_ha'].includes(item.key)) {
                              const val = item.data.ITA?.toFixed(2) || item.data.HA?.toFixed(2) || 'N/A';
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
                            if (showAllDetails === 'issues' && isSeverityField && displayValue === 0) return null;
                            
                            return (
                              <div
                                key={item.key}
                                onClick={() => {
                                  if (item.key === 'face_maps' && item.data.red_area) {
                                    setShowRedAreaMap(true);
                                  }
                                }}
                                className={`${status.bgColor} rounded-xl p-4 border-2 ${
                                  displayValue === 0 ? 'border-green-200' : displayValue >= 2 ? 'border-red-200' : 'border-orange-200'
                                } ${
                                  item.key === 'face_maps' && item.data.red_area ? 'cursor-pointer hover:shadow-lg hover:scale-105 transition-all' : 'hover:shadow-md transition-shadow'
                                }`}
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-base font-bold text-slate-800">
                                    {item.label}
                                  </span>
                                  <span className={`text-2xl ${status.color} font-bold`}>
                                    {status.icon}
                                  </span>
                                </div>
                                <div className="mb-2">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className={`${status.color} font-bold text-sm`}>
                                      {status.text}
                                    </span>
                                  </div>
                                  {/* Progress bar for severity items */}
                                  {isSeverityField && displayValue !== null && (
                                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                      <div 
                                        className={`h-full transition-all duration-500 ${
                                          displayValue === 0 ? 'bg-green-500' :
                                          displayValue === 1 ? 'bg-yellow-500' :
                                          displayValue === 2 ? 'bg-orange-500' :
                                          'bg-red-500'
                                        }`}
                                        style={{ width: `${Math.min(displayValue * 33.33, 100)}%` }}
                                      ></div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                  
                  {showAllDetails === 'issues' && 
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
                        onClick={() => setShowAllDetails('all')}
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

          {/* 保養建議 */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 shadow-lg border border-yellow-200">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-slate-800">
              <BiTrendingUp className="w-6 h-6 text-orange-500" />
              💡 保養建議
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


          {/* 個人專屬保養方案 */}
          {analysisResult.skincareRoutine && (
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100">
              <h3 className="text-2xl font-bold mb-2 flex items-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                <span className="text-3xl">✨</span>
                個人化專屬保養方案
              </h3>
              <p className="text-slate-600 mb-6">
                根據您的肌膚檢測報告量身打造，配合規律使用 28 天可見顯著改善
              </p>

              <div className="space-y-6">
                {/* 早晨保養程序 */}
                {analysisResult.skincareRoutine.morning?.length > 0 && (
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-5 border border-orange-200">
                    <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                      🌅 早晨保養程序
                    </h4>
                    <div className="space-y-3">
                      {analysisResult.skincareRoutine.morning.map((item, index) => (
                        <div key={index} className="flex gap-3 bg-white/60 rounded-lg p-3">
                          <div className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                            {item.step}
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-800">{item.name}</p>
                            <p className="text-sm text-gray-600 mt-1">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 晚間保養程序 */}
                {analysisResult.skincareRoutine.evening?.length > 0 && (
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-5 border border-indigo-200">
                    <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                      🌙 晚間保養程序
                    </h4>
                    <div className="space-y-3">
                      {analysisResult.skincareRoutine.evening.map((item, index) => (
                        <div key={index} className="flex gap-3 bg-white/60 rounded-lg p-3">
                          <div className="flex-shrink-0 w-8 h-8 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                            {item.step}
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-800">{item.name}</p>
                            <p className="text-sm text-gray-600 mt-1">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 每週特殊保養 */}
                {analysisResult.skincareRoutine.weekly?.length > 0 && (
                  <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl p-5 border border-pink-200">
                    <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                      📅 每週特殊保養
                    </h4>
                    <div className="space-y-3">
                      {analysisResult.skincareRoutine.weekly.map((item, index) => (
                        <div key={index} className="bg-white/60 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-3 py-1 bg-pink-500 text-white text-xs rounded-full font-semibold">
                              {item.freq}
                            </span>
                            <p className="font-semibold text-gray-800">{item.name}</p>
                          </div>
                          <p className="text-sm text-gray-600">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 推薦產品組合 */}
                {analysisResult.skincareRoutine.products?.length > 0 && (
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-200">
                    <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                      🛍️ 推薦產品組合
                    </h4>
                    <div className="space-y-2">
                      {analysisResult.skincareRoutine.products.map((product, index) => (
                        <div key={index} className="bg-white/60 rounded-lg p-3 text-gray-700">
                          {product}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 生活習慣建議 */}
                {analysisResult.skincareRoutine.lifestyle?.length > 0 && (
                  <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-5 border border-green-200">
                    <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                      🌿 生活習慣建議
                    </h4>
                    <div className="grid md:grid-cols-2 gap-3">
                      {analysisResult.skincareRoutine.lifestyle.map((tip, index) => (
                        <div key={index} className="bg-white/60 rounded-lg p-3 text-sm text-gray-700">
                          {tip}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 溫馨提示 */}
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    <span className="font-semibold text-blue-700">💡 溫馨提示：</span>
                    本保養方案根據您的肌膚檢測結果量身定制。建議持續使用 28 天（一個肌膚更新週期）後再次檢測，追蹤改善成效。如有任何不適，請立即停用並諮詢專業人士。
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 舊的產品推薦區塊（如果沒有 skincareRoutine 才顯示）*/}
          {!analysisResult.skincareRoutine && (() => {
            // Generate product recommendations based on skin analysis
            const generateProductRecommendations = () => {
              const recommendations = [];
              const analysis = analysisResult.analysis;
              
              // Get analysis data
              const hasWrinkles = 
                (analysis.wrinkle_detection_result?.value > 0) ||
                (analysis.wrinkle_forehead_severity?.value > 0) ||
                (analysis.wrinkle_glabella_severity?.value > 0) ||
                (analysis.wrinkle_crows_feet_severity?.value > 0) ||
                (analysis.wrinkle_nasolabial_fold_severity?.value > 0);
              
              const hasDarkSpots = 
                (analysis.dark_circle_severity?.value > 0) ||
                (analysis.pigmentation?.value > 0) ||
                (analysis.spots?.value > 0);
              
              const hasDryness = 
                (analysis.skin_type?.value === 1); // 乾性肌膚
              
              const hasSensitivity = 
                (analysis.sensitivity?.value > 0) ||
                (analysis.red_area_severity?.value > 0);
              
              const hasAcne = 
                (analysis.acne?.value > 0) ||
                (analysis.acne_severity?.value > 0);
              
              // A. 老化與黯沉問題
              if (hasWrinkles || hasDarkSpots) {
                recommendations.push({
                  type: 'aging_dullness',
                  title: '🌟 抗老煥采專屬方案',
                  description: '您的肌膚顯示出老化或黯沉的跡象，建議使用荷顏抗老系列產品組合，28 天看見年輕改變：',
                  priority: 'high',
                  duration: '連續使用 28 天為一週期，建議持續 3 個月達到最佳效果',
                  products: [
                    {
                      name: '煥采肌活蛋白霜',
                      benefit: '含高濃度膠原蛋白與彈力蛋白，深層滋養提升肌膚彈性，減少細紋與皺紋深度',
                      usage: '早晚潔膚後，取珍珠大小份量，由內而外、由下而上輕柔按摩至吸收',
                      time: '早上 + 晚上',
                      tips: '重點加強於法令紋、額頭紋等皺紋部位，配合向上提拉手法'
                    },
                    {
                      name: '靚膚液升級版',
                      benefit: '促進肌膚新陳代謝，加速老廢角質代謝，改善黯沉無光澤，提亮膚色恢復透亮感',
                      usage: '清潔後第一步驟，取適量於手心，輕拍全臉至完全吸收',
                      time: '早上 + 晚上（清潔後立即使用）',
                      tips: '使用後等待 30 秒再進行下一步保養，提升後續產品吸收力'
                    },
                    {
                      name: '精華液',
                      benefit: '高濃度活性抗老成分，深入真皮層修護老化受損肌膚，增強肌膚自我修復能力',
                      usage: '靚膚液後使用，取 2-3 滴於指尖，點塗於全臉後輕柔按摩',
                      time: '晚上重點使用（可早晚使用）',
                      tips: '重點加強於皺紋、細紋部位，可局部疊擦增強效果'
                    },
                    {
                      name: 'SOD 面膜',
                      benefit: '超氧化物歧化酶強效抗氧化，中和自由基，延緩肌膚老化，提升肌膚防禦力',
                      usage: '清潔後敷於全臉 15-20 分鐘，取下後輕拍幫助吸收，無需清洗',
                      time: '每週 2-3 次（晚上使用）',
                      tips: '敷面膜前可先使用靚膚液打底，提升吸收效果'
                    }
                  ]
                });
              }
              
              // B. 黯沉與斑點問題
              if (hasDarkSpots && !hasWrinkles) {
                recommendations.push({
                  type: 'dullness_spots',
                  title: '✨ 淨白透亮專屬方案',
                  description: '針對黯沉與色素沉澱問題，為您規劃專業淨白提亮方案，重現肌膚自然光采：',
                  priority: 'high',
                  duration: '建議持續使用 8-12 週，配合防曬達到最佳淡斑效果',
                  products: [
                    {
                      name: '防曬隔離霜 SPF 50+ PA++++',
                      benefit: '高效阻擋 UVA/UVB，預防色素沉澱加重，同時形成保護膜隔離環境傷害',
                      usage: '白天保養最後一步驟，取適量均勻塗抹全臉及頸部',
                      time: '每天早上（出門前 15 分鐘）',
                      tips: '室外活動每 2-3 小時補擦，流汗後立即補充。陰天也要使用！'
                    },
                    {
                      name: '煥采肌活蛋白霜',
                      benefit: '含美白精萃成分，淡化色斑與膚色不均，均勻膚色，恢復肌膚透亮光澤',
                      usage: '早晚清潔後，取適量輕柔按摩全臉至吸收',
                      time: '早上 + 晚上',
                      tips: '重點加強於色斑、暗沉部位，可局部疊擦'
                    },
                    {
                      name: '靚膚液升級版',
                      benefit: '促進黑色素代謝，提亮膚色，改善整體黯沉，恢復肌膚自然透亮度',
                      usage: '清潔後立即使用，輕拍全臉至吸收',
                      time: '早上 + 晚上（第一步驟）',
                      tips: '配合由內而外輕拍手法，促進循環與吸收'
                    },
                    {
                      name: 'SOD 面膜',
                      benefit: '強效抗氧化配方，中和自由基，加速黑色素代謝，提升肌膚亮度',
                      usage: '清潔後敷於全臉 15-20 分鐘，取下後輕拍吸收',
                      time: '每週 2-3 次（建議晚上使用）',
                      tips: '密集淡斑期可增加至每天使用，持續 2 週後改為每週 2-3 次'
                    }
                  ]
                });
              }
              
              // C. 乾燥與屏障受損
              if (hasDryness) {
                recommendations.push({
                  type: 'dryness_barrier',
                  title: '💧 深層保濕修護方案',
                  description: '您的肌膚偏乾燥，需要加強保濕與肌膚屏障修護，建立完整保水防護網：',
                  priority: 'high',
                  duration: '建議持續使用 4-6 週修護屏障，之後維持保養',
                  products: [
                    {
                      name: '精華液',
                      benefit: '小分子玻尿酸深層補水，直達肌膚底層，修護受損屏障，增強肌膚保水能力',
                      usage: '靚膚液後取 2-3 滴，均勻塗抹全臉，乾燥部位可重複疊擦',
                      time: '早上 + 晚上',
                      tips: '特別乾燥時可增加用量，搭配輕拍手法促進吸收'
                    },
                    {
                      name: '靚膚液升級版',
                      benefit: '打開肌膚吸收通道，提升後續保養品吸收效率，幫助鎖住水分不流失',
                      usage: '清潔後立即使用，倒於化妝棉或手心，輕拍全臉至吸收',
                      time: '早上 + 晚上（清潔後第一步）',
                      tips: '乾燥肌建議使用手心溫敷法，避免化妝棉摩擦刺激'
                    },
                    {
                      name: '養顏乳',
                      benefit: '含神經醯胺與植物油脂，長效鎖水保濕，形成天然保護膜，防止水分流失',
                      usage: '精華液後取適量，由內而外輕柔推勻全臉',
                      time: '早上 + 晚上（保養最後一步）',
                      tips: '冬季或特別乾燥時可增加用量，或局部加強兩頰等乾燥區域'
                    },
                    {
                      name: '煥采肌活蛋白霜',
                      benefit: '滋潤質地深層滋養，修護乾燥受損肌膚，提升肌膚柔軟度與彈性',
                      usage: '晚間保養可替代養顏乳，或疊加使用加強滋養',
                      time: '晚上（可與養顏乳擇一或疊加）',
                      tips: '極乾燥肌膚可與養顏乳混合使用，增強保濕滋潤效果'
                    }
                  ]
                });
              }
              
              // D. 敏感與不適
              if (hasSensitivity || hasAcne) {
                recommendations.push({
                  type: 'sensitivity',
                  title: '🌿 舒緩修護溫和方案',
                  description: '您的肌膚較為敏感或有痘痘困擾，建議使用溫和舒緩的產品組合，重建肌膚健康防禦：',
                  priority: 'critical',
                  duration: '急性期每日使用，穩定後改為每週 2-3 次維持',
                  products: [
                    {
                      name: '溫和清潔',
                      benefit: '弱酸性溫和配方，不含皂鹼與刺激成分，溫和清潔同時維持肌膚天然 pH 值與屏障',
                      usage: '取適量加水搓揉起泡，輕柔按摩全臉 30 秒，溫水洗淨',
                      time: '早上 + 晚上',
                      tips: '避免過度搓揉或使用過熱的水，不要清潔超過 1 分鐘。一天最多清潔 2 次'
                    },
                    {
                      name: 'SOD 面膜',
                      benefit: 'SOD 酵素舒緩鎮定，快速減少泛紅、紅腫與刺癢不適感，修護敏感受損肌膚',
                      usage: '清潔後敷於全臉或局部泛紅區域 15-20 分鐘，取下後輕拍吸收',
                      time: '敏感急性期：每天使用 / 穩定期：每週 2-3 次',
                      tips: '可冰敷於冰箱冷藏後使用，加強鎮定舒緩效果。不適時可局部敷用'
                    },
                    {
                      name: '靚膚液升級版',
                      benefit: '強化肌膚天然防禦屏障，降低外界刺激的敏感反應，提升肌膚耐受性',
                      usage: '清潔後立即使用，倒於手心輕拍全臉，幫助肌膚快速穩定',
                      time: '早上 + 晚上（清潔後第一步）',
                      tips: '敏感期間避免使用化妝棉，用手心溫敷按壓更溫和。若刺痛請暫停使用'
                    },
                    {
                      name: '精華液',
                      benefit: '溫和修護配方，修護敏感受損肌膚，增強屏障功能，減少敏感發作頻率',
                      usage: '靚膚液後使用，取 1-2 滴輕柔按壓全臉',
                      time: '晚上（白天若不適也可使用）',
                      tips: '敏感急性期減少用量，待肌膚穩定後再增加。新產品使用前請先做耳後測試'
                    }
                  ]
                });
              }
              
              // If no specific issues detected, provide general care
              if (recommendations.length === 0) {
                recommendations.push({
                  type: 'maintenance',
                  title: '✅ 理想肌膚維持方案',
                  description: '恭喜！您的肌膚狀態很好，建議持續以下日常保養，維持最佳狀態並預防老化：',
                  priority: 'maintenance',
                  duration: '持續使用維持健康膚質，預防勝於治療',
                  products: [
                    {
                      name: '靚膚液升級版',
                      benefit: '維持肌膚健康平衡，提升細胞新陳代謝，預防提前老化，維持肌膚年輕狀態',
                      usage: '每日清潔後第一步驟，倒於手心或化妝棉輕拍至吸收',
                      time: '早上 + 晚上（必用）',
                      tips: '可以想像成肌膚的「打底液」，讓後續保養更有效'
                    },
                    {
                      name: '防曬隔離霜 SPF 50+ PA++++',
                      benefit: '防曬是最有效的抗老手段，預防光老化、色素沉澱，保持肌膚年輕狀態',
                      usage: '白天保養最後一步，出門前 15 分鐘均勻塗抹',
                      time: '每天早上（陰天也要用！）',
                      tips: '室內也有紫外線！即使不出門也建議使用。長時間室外活動每 2-3 小時補擦'
                    },
                    {
                      name: 'SOD 面膜',
                      benefit: '定期深層保養，抗氧化修護，維持肌膚最佳狀態，預防環境傷害',
                      usage: '清潔後敷於全臉 15-20 分鐘，取下後輕拍吸收',
                      time: '每週 1-2 次（建議晚上）',
                      tips: '可選擇固定每週特定日子（如週三、週六）作為肌膚特殊護理日'
                    },
                    {
                      name: '精華液',
                      benefit: '預防性抗老保養，延緩皺紋出現，維持肌膚細臻年輕健康',
                      usage: '靚膚液後取 1-2 滴均勻塗抹，可重點加強眼周、額頭',
                      time: '晚上使用（或早晚）',
                      tips: '25 歲以上建議加入抗老精華液，預防老化從現在開始'
                    }
                  ]
                });
              }
              
              return recommendations;
            };
            
            const productRecommendations = generateProductRecommendations();
            
            return (
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 rounded-2xl p-6 shadow-xl border-2 border-purple-200">
                  <h3 className="text-2xl font-bold mb-2 flex items-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    <span className="text-3xl">💎</span>
                    個人化專屬保養方案:
                  </h3>
                  <p className="text-slate-600 mb-2">
                    根據您的肌膚檢測報告，我們為您量身打造專屬保養方案
                  </p>
                  <p className="text-sm text-purple-600 font-semibold mb-6 flex items-center gap-2">
                    <BiCheckCircle className="w-4 h-4" />
                    共推薦 {productRecommendations.length} 個專屬方案，請仔細閱讀
                  </p>
                  
                  <div className="space-y-6">
                    {productRecommendations.map((recommendation, recIndex) => {
                      // 優先級樣式
                      const priorityConfig = {
                        critical: { bg: 'bg-red-100', border: 'border-red-300', text: 'text-red-700', label: '緊急處理' },
                        high: { bg: 'bg-orange-100', border: 'border-orange-300', text: 'text-orange-700', label: '優先處理' },
                        maintenance: { bg: 'bg-green-100', border: 'border-green-300', text: 'text-green-700', label: '維持保養' }
                      };
                      const priority = priorityConfig[recommendation.priority] || priorityConfig.high;
                      
                      return (
                        <div key={recIndex} className="bg-white rounded-xl p-6 shadow-lg border-2 border-purple-100 hover:border-purple-300 transition-all">
                          {/* 方案標題與優先級 */}
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="text-xl font-bold text-purple-700 flex-1">
                              {recommendation.title}
                            </h4>
                            {recommendation.priority && (
                              <span className={`${priority.bg} ${priority.border} ${priority.text} px-3 py-1 rounded-full text-xs font-bold border-2 flex-shrink-0 ml-2`}>
                                {priority.label}
                              </span>
                            )}
                          </div>
                          
                          {/* 方案說明 */}
                          <p className="text-slate-600 mb-3 text-sm leading-relaxed">
                            {recommendation.description}
                          </p>
                          
                          {/* 使用周期 */}
                          {recommendation.duration && (
                            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-3 mb-4 border border-blue-200">
                              <p className="text-sm text-blue-700 flex items-center gap-2">
                                <span className="text-base">⏰</span>
                                <span className="font-semibold">建議療程：</span>
                                {recommendation.duration}
                              </p>
                            </div>
                          )}
                          
                          {/* 產品清單 */}
                          <div className="space-y-4">
                            {recommendation.products.map((product, prodIndex) => (
                              <div key={prodIndex} className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-100 hover:shadow-md transition-all">
                                <div className="flex items-start gap-3">
                                  {/* 編號 */}
                                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                                    {prodIndex + 1}
                                  </div>
                                  
                                  <div className="flex-1">
                                    {/* 產品名稱 */}
                                    <h5 className="font-bold text-lg text-purple-700 mb-2">
                                      🌺 荷顏 {product.name}
                                    </h5>
                                    
                                    {/* 功效 */}
                                    <div className="mb-2">
                                      <p className="text-slate-700 text-sm">
                                        <span className="inline-flex items-center gap-1 font-semibold text-purple-600">
                                          ✨ 功效：
                                        </span>
                                        {product.benefit}
                                      </p>
                                    </div>
                                    
                                    {/* 使用方式 */}
                                    <div className="mb-2">
                                      <p className="text-slate-600 text-sm">
                                        <span className="inline-flex items-center gap-1 font-semibold text-pink-600">
                                          👆 使用方式：
                                        </span>
                                        {product.usage}
                                      </p>
                                    </div>
                                    
                                    {/* 使用時間 */}
                                    {product.time && (
                                      <div className="mb-2">
                                        <p className="text-slate-600 text-sm">
                                          <span className="inline-flex items-center gap-1 font-semibold text-indigo-600">
                                            🕒 使用時間：
                                          </span>
                                          {product.time}
                                        </p>
                                      </div>
                                    )}
                                    
                                    {/* 小提示 */}
                                    {product.tips && (
                                      <div className="mt-3 pt-3 border-t border-purple-200">
                                        <p className="text-xs text-slate-500 flex items-start gap-2">
                                          <span className="text-sm flex-shrink-0">💡</span>
                                          <span>
                                            <span className="font-semibold text-orange-600">小提示：</span>
                                            {product.tips}
                                          </span>
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          {/* 方案底部提醒 */}
                          <div className="mt-4 pt-4 border-t border-purple-200">
                            <p className="text-xs text-slate-500 flex items-center gap-2">
                              <BiCheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                              建議按順序使用以上產品，連續使用 28 天（完整肌膚更新週期），即可看到明顯改善效果
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* 整體注意事項 */}
                  <div className="mt-6 space-y-3">
                    <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg p-4 border-l-4 border-orange-500">
                      <p className="text-sm text-slate-700 flex items-start gap-2">
                        <span className="text-lg flex-shrink-0">💡</span>
                        <span>
                          <span className="font-bold text-orange-700">使用順序提醒：</span>
                          一般保養步驟為：清潔 → 靚膚液 → 精華液 → 眼霜 → 乳液/面霜 → 防曬（白天）。面膜在清潔後使用。
                        </span>
                      </p>
                    </div>
                    
                    <div className="bg-gradient-to-r from-red-100 to-pink-100 rounded-lg p-4 border-l-4 border-red-500">
                      <p className="text-sm text-slate-700 flex items-start gap-2">
                        <span className="text-lg flex-shrink-0">⚠️</span>
                        <span>
                          <span className="font-bold text-red-700">安全提醒：</span>
                          每個人的肌膚狀況不同，新產品建議先進行耳後或手腕內側小範圍測試 24 小時。若使用期間有任何不適、發紅、刺痛等情況，請立即停用並請教專業皮膚科醫師。
                        </span>
                      </p>
                    </div>
                    
                    <div className="bg-gradient-to-r from-purple-100 to-indigo-100 rounded-lg p-4 border-l-4 border-purple-500">
                      <p className="text-sm text-slate-700 flex items-start gap-2">
                        <span className="text-lg flex-shrink-0">🎯</span>
                        <span>
                          <span className="font-bold text-purple-700">持之以恆：</span>
                          肌膚保養是長期投資，不是立竿見影。建議至少持續使用 28 天（一個肌膚代謝週期）才能看到顯著效果。配合規律作息、均衡飲食、充足睡眠，效果更佳！
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}


          {/* 動作按鈕 */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => {
                setAnalysisResult(null);
                setError(null);
                setAiRecommendation(null);
                setShowAIRecommendation(false);
              }}
              className="px-8 py-3 bg-white border-2 border-purple-500 text-purple-600 rounded-full font-semibold hover:bg-purple-50 transition-colors"
            >
              重新檢測
            </button>
            <button
              onClick={() => getAIExpertRecommendation('')}
              disabled={isLoadingAI}
              className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full font-semibold hover:from-indigo-600 hover:to-purple-600 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoadingAI ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  AI 分析中...
                </>
              ) : (
                <>
                  <span className="text-xl">🤖</span>
                  獲取 AI 專家推薦
                </>
              )}
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

      {/* AI 專家推薦模態框 */}
      {showAIRecommendation && aiRecommendation && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
          onClick={() => setShowAIRecommendation(false)}
        >
          <div 
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 p-6 rounded-t-2xl z-10">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                  <span className="text-3xl">🤖</span>
                  AI 專家分析與推薦
                </h3>
                <button
                  onClick={() => setShowAIRecommendation(false)}
                  className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-indigo-100 mt-2 text-sm">
                由 Claude AI 提供的專業肌膚分析建議
              </p>
            </div>
            
            <div className="p-6">
              {/* AI 推薦內容 */}
              <div className="prose prose-slate max-w-none">
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 mb-6 border border-indigo-200">
                  <div className="whitespace-pre-wrap text-slate-700 leading-relaxed">
                    {aiRecommendation.recommendation}
                  </div>
                </div>
              </div>
              
              {/* 底部資訊 */}
              <div className="mt-6 pt-4 border-t border-gray-200 flex items-center justify-between text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-semibold">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                    </svg>
                    {aiRecommendation.model}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400">生成時間</p>
                  <p className="font-medium">{new Date(aiRecommendation.timestamp).toLocaleString('zh-TW')}</p>
                </div>
              </div>
              
              {/* 操作按鈕 */}
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => {
                    const text = aiRecommendation.recommendation;
                    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `AI專家推薦_${new Date().toISOString().split('T')[0]}.txt`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);
                  }}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-semibold hover:from-indigo-600 hover:to-purple-600 transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <BiDownload className="w-5 h-5" />
                  下載推薦內容
                </button>
                <button
                  onClick={() => setShowAIRecommendation(false)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  關閉
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 紅區圖模態框 */}
      {showRedAreaMap && analysisResult?.analysis?.face_maps?.red_area && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowRedAreaMap(false)}
        >
          <div 
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-slate-800">
                  🗺️ 肌膚敏感區域熱力圖
                </h3>
                <button
                  onClick={() => setShowRedAreaMap(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <BiX className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <img
                  src={`data:image/jpeg;base64,${analysisResult.analysis.face_maps.red_area}`}
                  alt="紅區圖"
                  className="w-full rounded-lg shadow-lg"
                />
                
                {analysisResult.analysis.sensitivity && (
                  <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-4 border border-red-200">
                    <h4 className="font-semibold text-slate-800 mb-3">敏感度分析</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-slate-600 mb-1">敏感區域面積</p>
                        <p className="text-2xl font-bold text-red-600">
                          {(analysisResult.analysis.sensitivity.sensitivity_area * 100).toFixed(1)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600 mb-1">紅腫強度</p>
                        <p className="text-2xl font-bold text-orange-600">
                          {analysisResult.analysis.sensitivity.sensitivity_intensity.toFixed(1)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <p className="text-sm text-slate-700">
                    <span className="font-semibold">💡 說明：</span>
                    紅色區域表示肌膚較為敏感或有發紅現象，建議使用溫和的舒緩保養品，避免刺激性成分。
                  </p>
                </div>
              </div>
            </div>
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
